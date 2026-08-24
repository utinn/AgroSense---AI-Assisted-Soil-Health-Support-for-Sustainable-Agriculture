import os

os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("NUMEXPR_NUM_THREADS", "1")
os.environ.setdefault("BLIS_NUM_THREADS", "1")

os.environ.setdefault("AGROSENSE_LIMIT_PARALLELISM", "true")

import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.wsgi import app as application 
