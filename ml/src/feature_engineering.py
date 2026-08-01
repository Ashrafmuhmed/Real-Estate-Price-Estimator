from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any

import numpy as np
import pandas as pd

from utils import FEATURE_ORDER


@dataclass
class FeatureEngineeringSummary:
    feature_order: list[str]
    target_name: str
    price_skew: float
    used_log_price: bool

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def build_features(
    frame: pd.DataFrame, skew_threshold: float = 1.0
) -> tuple[pd.DataFrame, pd.Series, FeatureEngineeringSummary]:
    x = frame[FEATURE_ORDER].copy()
    y_raw = frame["price"].copy()
    skew = float(y_raw.skew())
    use_log = abs(skew) > skew_threshold

    if use_log:
        y = np.log1p(y_raw)
        target_name = "log_price"
    else:
        y = y_raw
        target_name = "price"

    summary = FeatureEngineeringSummary(
        feature_order=FEATURE_ORDER,
        target_name=target_name,
        price_skew=skew,
        used_log_price=use_log,
    )
    return x, y, summary
