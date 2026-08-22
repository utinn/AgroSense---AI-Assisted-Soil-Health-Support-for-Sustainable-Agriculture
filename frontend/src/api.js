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

export async function predictSingle(values) {
  const data = await postJson("/predict", values);
  return {
    index: data.class_index,
    label: data.label,
    confidence: data.confidence,
    percentCa: data.percent_ca,
    percentMg: data.percent_mg,
    percentK: data.percent_k,
  };
}

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
