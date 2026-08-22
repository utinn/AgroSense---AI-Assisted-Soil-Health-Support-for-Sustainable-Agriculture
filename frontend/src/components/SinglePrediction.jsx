import { useState } from "react";
import TextureCard from "./TextureCard";
import NutrientsCard from "./NutrientsCard";
import ChemicalsCard from "./ChemicalsCard";
import MetricsCard from "./MetricsCard";
import ResultPanel from "./ResultPanel";
import { DEFAULT_SINGLE_INPUTS, FIELD_RANGES } from "../data/constants";
import { predictSingle, ApiError } from "../api";
import { getInvalidFields } from "../utils/validation";

const ALL_FIELD_KEYS = Object.keys(FIELD_RANGES);

export default function SinglePrediction() {
  const [values, setValues] = useState(DEFAULT_SINGLE_INPUTS);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setResult(null);
  };

  const textureValid = Math.abs(values.SAND + values.CLAY + values.SILT - 100) < 0.01;

  const handlePredict = async () => {
    const invalidFields = getInvalidFields(values, ALL_FIELD_KEYS);
    if (invalidFields.length > 0) {
      setError("Invalid input! Please make sure the input is in range!");
      setResult(null);
      return;
    }

    if (!textureValid) {
      setError("Sand + Clay + Silt must sum to exactly 100%.");
      setResult(null);
      return;
    }

    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const prediction = await predictSingle(values);
      setResult(prediction);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 md:gap-6">
        <div className="flex flex-col gap-5 md:gap-6">
          <div className="animate-rise [animation-delay:0ms]">
            <TextureCard values={values} onChange={set} />
          </div>
          <div className="animate-rise [animation-delay:100ms]">
            <NutrientsCard values={values} onChange={set} />
          </div>
        </div>
        <div className="flex flex-col gap-5 md:gap-6">
          <div className="animate-rise [animation-delay:50ms]">
            <ChemicalsCard values={values} onChange={set} />
          </div>
          <div className="animate-rise [animation-delay:150ms]">
            <MetricsCard values={values} onChange={set} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handlePredict}
          disabled={loading}
          className="flex w-full max-w-md items-center justify-center gap-2 rounded-full bg-gradient-to-br from-moss-500 to-moss-700 px-8 py-3 font-semibold text-paper shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:px-12"
        >
          {loading ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-90"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Analyzing sample…
            </>
          ) : (
            "🔍 Predict Category"
          )}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-clay-500 bg-clay-500/5 px-4 py-3 text-sm text-clay-600">
          ⚠️ {error}
        </div>
      )}

      <ResultPanel result={result} />
    </div>
  );
}
