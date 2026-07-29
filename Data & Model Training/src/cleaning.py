from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any

import pandas as pd
from sklearn.datasets import fetch_openml

from utils import FEATURE_ORDER


@dataclass
class CleaningSummary:
    initial_rows: int
    rows_after_missing_drop: int
    rows_after_duplicate_drop: int
    rows_after_domain_filters: int
    rows_after_iqr_filter: int
    dropped_missing: int
    dropped_duplicates: int
    dropped_domain: int
    dropped_iqr: int
    iqr_bounds: dict[str, tuple[float, float]]

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def build_raw_housing_frame(current_year: int) -> pd.DataFrame:
    dataset = fetch_openml(name="house_prices", version=1, as_frame=True, parser="auto")
    frame = dataset.frame

    raw = pd.DataFrame(
        {
            "sqft": pd.to_numeric(frame["GrLivArea"], errors="coerce"),
            "bedrooms": pd.to_numeric(frame["BedroomAbvGr"], errors="coerce"),
            "bathrooms": pd.to_numeric(frame["FullBath"], errors="coerce")
            + 0.5 * pd.to_numeric(frame["HalfBath"], errors="coerce"),
            "year_built": pd.to_numeric(frame["YearBuilt"], errors="coerce"),
            "price": pd.to_numeric(frame["SalePrice"], errors="coerce"),
        }
    )
    raw["age"] = current_year - raw["year_built"]
    return raw


def _domain_valid_rows(frame: pd.DataFrame) -> pd.Series:
    return (
        frame["sqft"].between(300, 10000)
        & frame["bedrooms"].between(1, 10)
        & frame["bathrooms"].between(0.5, 10)
        & frame["age"].between(0, 150)
        & frame["price"].between(10000, 2000000)
    )


def _iqr_bounds(frame: pd.DataFrame, columns: list[str]) -> dict[str, tuple[float, float]]:
    bounds: dict[str, tuple[float, float]] = {}
    for col in columns:
        q1 = frame[col].quantile(0.25)
        q3 = frame[col].quantile(0.75)
        iqr = q3 - q1
        bounds[col] = (float(q1 - 1.5 * iqr), float(q3 + 1.5 * iqr))
    return bounds


def clean_housing_frame(raw: pd.DataFrame) -> tuple[pd.DataFrame, CleaningSummary]:
    base_cols = FEATURE_ORDER + ["price"]
    initial_rows = len(raw)

    no_missing = raw.dropna(subset=base_cols).copy()
    rows_after_missing_drop = len(no_missing)

    no_duplicates = no_missing.drop_duplicates(subset=base_cols).copy()
    rows_after_duplicate_drop = len(no_duplicates)

    domain_clean = no_duplicates.loc[_domain_valid_rows(no_duplicates)].copy()
    rows_after_domain_filters = len(domain_clean)

    iqr_cols = FEATURE_ORDER + ["price"]
    bounds = _iqr_bounds(domain_clean, iqr_cols)
    iqr_mask = pd.Series(True, index=domain_clean.index)
    for col, (low, high) in bounds.items():
        iqr_mask &= domain_clean[col].between(low, high)
    iqr_clean = domain_clean.loc[iqr_mask, base_cols].copy()
    iqr_clean["bathrooms"] = iqr_clean["bathrooms"].round(2)

    summary = CleaningSummary(
        initial_rows=initial_rows,
        rows_after_missing_drop=rows_after_missing_drop,
        rows_after_duplicate_drop=rows_after_duplicate_drop,
        rows_after_domain_filters=rows_after_domain_filters,
        rows_after_iqr_filter=len(iqr_clean),
        dropped_missing=initial_rows - rows_after_missing_drop,
        dropped_duplicates=rows_after_missing_drop - rows_after_duplicate_drop,
        dropped_domain=rows_after_duplicate_drop - rows_after_domain_filters,
        dropped_iqr=rows_after_domain_filters - len(iqr_clean),
        iqr_bounds=bounds,
    )

    return iqr_clean, summary
