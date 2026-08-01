from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


@dataclass
class PreprocessingSummary:
    test_size: float
    random_state: int
    scaler: str
    train_rows: int
    test_rows: int

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def split_and_scale(
    x: pd.DataFrame, y: pd.Series, test_size: float = 0.20, random_state: int = 42
) -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series, StandardScaler, PreprocessingSummary]:
    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=test_size,
        random_state=random_state,
    )

    scaler = StandardScaler()
    x_train_scaled = pd.DataFrame(
        scaler.fit_transform(x_train),
        columns=x_train.columns,
        index=x_train.index,
    )
    x_test_scaled = pd.DataFrame(
        scaler.transform(x_test),
        columns=x_test.columns,
        index=x_test.index,
    )

    summary = PreprocessingSummary(
        test_size=test_size,
        random_state=random_state,
        scaler="StandardScaler",
        train_rows=len(x_train_scaled),
        test_rows=len(x_test_scaled),
    )
    return x_train_scaled, x_test_scaled, y_train, y_test, scaler, summary
