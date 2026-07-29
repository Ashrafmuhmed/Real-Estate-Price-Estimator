from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any

FEATURE_ORDER = ["sqft", "bedrooms", "bathrooms", "age"]


def project_root() -> Path:
    return Path(__file__).resolve().parent.parent


def current_year() -> int:
    return datetime.now().year


def ensure_parent_dir(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def save_json(path: Path, payload: Any) -> None:
    ensure_parent_dir(path)
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
