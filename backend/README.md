# AgroSense — Backend (FastAPI)

Wraps your soil pH model in a REST API: `POST /predict` for a single
sample, `POST /predict/batch` for a CSV upload — same logic as the
Streamlit app's `predict_single()` and batch-prediction block, just
exposed over HTTP instead of rendered in a page.

**A demo model is included** (`models/soil_ph_model.pkl`) — a small
`VotingClassifier` (MLP + XGBoost + Random Forest) trained on synthetic
data, purely so the API works out of the box and you can confirm the
plumbing before touching your real model. **Replace it with yours.**

## 1. Set up and run locally

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env              # then edit if your setup differs

uvicorn app.main:app --reload
```

Open **http://localhost:8000/docs** — FastAPI's interactive Swagger UI.
You can try `/predict` right there without writing any code.

## 2. Swap in your real model

Copy your `.pkl` into `models/soil_ph_model.pkl` (overwrite the demo one),
or point `MODEL_PATH` in `.env` at wherever you keep it.

**Two things to check before it "just works":**

- **Column names must match exactly.** Your model must expose
  `model.feature_names_in_` with these 14 columns, in any order (pandas
  reindexes them for you): `P, SAND, CLAY, N, K, Ca, Mg, Na, CEC, SAR, ESP,
  % Ca, % Mg, % K`. This is exactly what `Main.py` built before calling
  `model.predict()`, so if your Streamlit app worked, this will too.
- **If your `.pkl` is a *custom* Python class** (not a plain
  scikit-learn/XGBoost object) — e.g. a hand-written ensemble wrapper —
  `joblib.load()` needs that class definition importable in this project
  too, or unpickling will fail. If that's your case, tell me and I'll fold
  the class into `app/model.py` so it loads correctly.

Restart the server (or just let `--reload` pick it up) and hit `/health` —
it reports `model_loaded: true/false` and the exact load error if one
occurred, so you're not guessing.

## 3. Endpoints

| Method | Path             | Purpose                                    |
|--------|------------------|---------------------------------------------|
| GET    | `/health`        | Confirms the API is up and the model loaded |
| POST   | `/predict`       | Single sample → label, confidence, %Ca/Mg/K |
| POST   | `/predict/batch` | CSV upload → predictions for every row       |

`/predict` expects this JSON body (same fields, same valid ranges as the
Streamlit form):

```json
{
  "SAND": 40, "CLAY": 30, "SILT": 30,
  "N": 0.2, "P": 15,
  "Ca": 12, "K": 0.5, "Mg": 3, "Na": 0.5,
  "CEC": 20, "SAR": 2, "ESP": 5
}
```

Sand + Clay + Silt not summing to 100% returns a `422` before the model is
ever touched — same validation the Streamlit app did client-side, now
enforced server-side too (never trust the frontend alone).

`/predict/batch` expects a `multipart/form-data` upload with a `file`
field containing a CSV with columns: `P, SAND, CLAY, N, K, Ca, Mg, Na, CEC,
SAR, ESP` (the same template your Streamlit app generates).

## 4. CORS

`CORS_ORIGINS` in `.env` controls which frontend origins may call this
API. It already includes `http://localhost:5173` (Vite's default dev
port) so your React app can call it locally with no extra setup. Add your
Vercel URL there once the frontend is deployed.

## 5. Project structure

```
app/
  main.py          FastAPI app, CORS, lifespan model loading
  config.py         Settings from environment variables (.env)
  model.py           joblib loading + predict_dataframe() (the ported math)
  constants.py        PH_LABELS, REQUIRED_COLS, BATCH_INPUT_COLS
  schemas.py          Pydantic request/response models + texture validation
  routers/
    health.py          GET /health
    predict.py           POST /predict, POST /predict/batch
models/
  soil_ph_model.pkl   demo model — replace with yours
requirements.txt
Procfile               for Render (next deployment step)
.env.example
```

## Not done yet (next steps)

- Wire the React frontend's `mockPredictSingle`/`mockPredictBatch` to call
  this API instead (`fetch('http://localhost:8000/predict', ...)`).
- Deploy this to Render (the `Procfile` is already here for that).
- Update `CORS_ORIGINS` with the real Vercel URL once deployed.
