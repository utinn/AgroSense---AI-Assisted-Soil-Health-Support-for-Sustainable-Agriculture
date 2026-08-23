"""Phusion Passenger entrypoint for AnyMHost cPanel hosting.

Thread limits MUST be set before numpy/scipy/scikit-learn/xgboost/app.model
are imported anywhere in the process — see app/wsgi.py and Main import below.
setdefault() never overwrites values cPanel's own environment already set.
"""
import os

os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("NUMEXPR_NUM_THREADS", "1")
os.environ.setdefault("BLIS_NUM_THREADS", "1")

# Clamps the trained model's n_jobs=-1 estimators to n_jobs=1 at load time
# (app/model.py, in-memory only). Off by default everywhere else so local/
# Docker FastAPI keeps the model's original parallelism.
os.environ.setdefault("AGROSENSE_LIMIT_PARALLELISM", "true")

import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.wsgi import app as application  # noqa: E402
