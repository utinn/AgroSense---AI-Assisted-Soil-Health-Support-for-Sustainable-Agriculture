// Talks to the FastAPI backend. Base URL comes from an env var so the same
// code works against localhost in dev and your deployed Render URL in prod.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function readErrorDetail(response) {
  try {
    const data = await response.json();
    if (typeof data.detail === "string") return data.detail;
    // FastAPI/Pydantic validation errors arrive as a list of {msg, loc, ...}
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((d) => (d.msg || JSON.stringify(d)).replace(/^Value error,\s*/, ""))
        .join(" ");
    }
    return `Request failed (${response.status}).`;
  } catch {
    return `Request failed (${response.status}).`;
  }
}

async function postJson(path, body) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      `Could not reach the prediction server at ${API_BASE_URL}. Is the backend running?`,
      0
    );
  }
  if (!response.ok) throw new ApiError(await readErrorDetail(response), response.status);
  return response.json();
}

/** POST /predict — single sample. `values` keys must match the backend's
 * SoilSample schema exactly: SAND, CLAY, SILT, N, P, Ca, K, Mg, Na, CEC, SAR, ESP. */
export async function predictSingle(values) {
  const data = await postJson("/predict", values);
  return {
    index: data.class_index,
    label: data.label,
    confidence: data.confidence, // may be null if the model has no predict_proba
    percentCa: data.percent_ca,
    percentMg: data.percent_mg,
    percentK: data.percent_k,
  };
}

/** POST /predict/batch — CSV upload. Returns one prediction per row, in the
 * same order as the uploaded file. */
export async function predictBatch(file) {
  const formData = new FormData();
  formData.append("file", file);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/predict/batch`, { method: "POST", body: formData });
  } catch {
    throw new ApiError(
      `Could not reach the prediction server at ${API_BASE_URL}. Is the backend running?`,
      0
    );
  }
  if (!response.ok) throw new ApiError(await readErrorDetail(response), response.status);

  const data = await response.json();
  return data.results.map((r) => ({
    label: r.label,
    classIndex: r.class_index,
    confidence: r.confidence,
    percentCa: r.percent_ca,
    percentMg: r.percent_mg,
    percentK: r.percent_k,
  }));
}
