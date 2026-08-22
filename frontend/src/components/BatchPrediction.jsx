import { useRef, useState } from "react";
import SectionCard from "./SectionCard";
import { BATCH_INPUT_COLS, PH_CLASSES } from "../data/constants";
import { predictBatch, ApiError } from "../api";

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] === undefined || cells[i] === "" ? NaN : parseFloat(cells[i]);
    });
    return row;
  });
  return { headers, rows };
}

function downloadCsv(filename, rows, columns) {
  const header = columns.join(",");
  const body = rows.map((r) => columns.map((c) => r[c]).join(",")).join("\n");
  const blob = new Blob([`${header}\n${body}`], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BatchPrediction() {
  const [fileName, setFileName] = useState(null);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleTemplateDownload = () => {
    downloadCsv("agrosense_template.csv", [], BATCH_INPUT_COLS);
  };

  const processFile = async (file) => {
    setError(null);
    setRows(null);
    setFileName(file.name);

    const text = await file.text();
    let parsed;
    try {
      parsed = parseCsv(text);
    } catch {
      setError("Could not read CSV — check the file formatting.");
      return;
    }
    const missing = BATCH_INPUT_COLS.filter((c) => !parsed.headers.includes(c));
    if (missing.length > 0) {
      setError(`Missing columns: ${missing.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const predictions = await predictBatch(file);
      const combined = parsed.rows.map((row, i) => ({
        ...row,
        predictedClass: predictions[i]?.label ?? "—",
        confidence:
          predictions[i]?.confidence != null ? `${predictions[i].confidence.toFixed(1)}%` : "—",
      }));
      setRows(combined);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const distribution = rows
    ? Object.entries(
        rows.reduce((acc, r) => {
          acc[r.predictedClass] = (acc[r.predictedClass] || 0) + 1;
          return acc;
        }, {})
      )
    : [];

  return (
    <div>
      <SectionCard icon="📂" title="Batch Mode" className="animate-rise">
        <p className="text-sm text-muted">Upload a CSV file with the following columns:</p>
        <code className="mt-2 block overflow-x-auto rounded-md bg-parchment-dim px-3 py-2 font-mono text-xs text-ink">
          {BATCH_INPUT_COLS.join(", ")}
        </code>
        <p className="mt-2 text-xs text-muted">
          The model automatically computes <strong>% Ca</strong>, <strong>% Mg</strong>, and{" "}
          <strong>% K</strong> from Ca, Mg, K values.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleTemplateDownload}
            className="rounded-full border border-line bg-parchment px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment-dim"
          >
            ⬇️ Download CSV template
          </button>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => !loading && inputRef.current?.click()}
          className={`mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
            loading ? "cursor-wait border-line bg-parchment-dim" : "cursor-pointer"
          } ${dragActive ? "border-moss-500 bg-moss-200/15" : "border-line bg-parchment"}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileInput}
            disabled={loading}
          />
          {loading ? (
            <p className="flex items-center gap-2 text-sm font-medium text-ink">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Analyzing {fileName}…
            </p>
          ) : (
            <>
              <p className="text-sm font-medium text-ink">
                {fileName ? fileName : "Drop a CSV here, or click to browse"}
              </p>
              <p className="mt-1 text-xs text-muted">.csv files only</p>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-clay-500 bg-clay-500/5 px-4 py-3 text-sm text-clay-600">
            ⚠️ {error}
          </div>
        )}
      </SectionCard>

      {rows && (
        <div className="animate-rise mt-6 rounded-xl border border-line bg-paper p-5 md:p-6">
          <p className="text-sm font-medium text-moss-600">✅ {rows.length} rows processed successfully.</p>

          <div className="mt-5 grid gap-6 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
                Class distribution
              </p>
              <div className="flex flex-col gap-2">
                {distribution.map(([label, count]) => {
                  const cls = PH_CLASSES.find((c) => c.label === label);
                  const pct = (count / rows.length) * 100;
                  return (
                    <div key={label} className="flex items-center gap-2 text-sm">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: cls?.color ?? "#888" }}
                      />
                      <span className="flex-1">{label}</span>
                      <span className="font-mono text-xs text-muted">
                        {count} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-x-auto">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
                Preview (first 10 rows)
              </p>
              <table className="w-full min-w-[560px] border-collapse text-xs">
                <thead>
                  <tr className="border-b border-line text-left text-muted">
                    {[...BATCH_INPUT_COLS, "Predicted pH Class", "Confidence"].map((c) => (
                      <th key={c} className="whitespace-nowrap px-2 py-1.5 font-medium">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 10).map((r, i) => (
                    <tr key={i} className="border-b border-line/60">
                      {BATCH_INPUT_COLS.map((c) => (
                        <td key={c} className="whitespace-nowrap px-2 py-1.5 font-mono">
                          {r[c]}
                        </td>
                      ))}
                      <td className="whitespace-nowrap px-2 py-1.5">{r.predictedClass}</td>
                      <td className="whitespace-nowrap px-2 py-1.5 font-mono">{r.confidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() =>
              downloadCsv("agrosense_batch_results.csv", rows, [
                ...BATCH_INPUT_COLS,
                "predictedClass",
                "confidence",
              ])
            }
            className="mt-5 rounded-full border border-line bg-parchment px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-parchment-dim"
          >
            ⬇️ Download full results CSV
          </button>
        </div>
      )}
    </div>
  );
}
