import StrataScale from "./StrataScale";
import { PH_CLASSES } from "../data/constants";

export default function ResultPanel({ result }) {
  if (!result) return null;
  const cls = PH_CLASSES[result.index];
  const hasConfidence = result.confidence != null;

  return (
    <div
      className="animate-rise mt-6 rounded-xl border-l-4 bg-paper p-6 shadow-sm md:p-7"
      style={{ borderLeftColor: cls.color }}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">Prediction Result</p>
          <h3 className="mt-1 font-display text-3xl" style={{ color: cls.color }}>
            {cls.label}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {hasConfidence && (
              <>
                Confidence: <strong className="text-ink">{result.confidence.toFixed(1)}%</strong> ·{" "}
              </>
            )}
            pH {cls.range}
          </p>
        </div>

        <div className="w-full md:w-[46%]">
          <StrataScale mode="result" activeIndex={result.index} confidence={result.confidence} />
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-moss-200 bg-moss-200/15 p-4 text-sm leading-relaxed text-ink">
        <strong style={{ color: cls.color }}>
          Soil is {cls.label.toLowerCase()} (pH {cls.range}).
        </strong>{" "}
        {cls.interpretation}
      </div>
    </div>
  );
}
