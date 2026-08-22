import { FIELD_RANGES, TOOLTIPS } from "../data/constants";
import InfoTooltip from "./InfoTooltip";
import { isInRange } from "../utils/validation";

export default function NumberField({
  label,
  tipKey,
  value,
  onChange,
  step = 0.1,
  suffix,
}) {
  const tip = tipKey ? TOOLTIPS[tipKey] : null;
  const range = tipKey ? FIELD_RANGES[tipKey] : null;
  const invalid = tipKey ? !isInRange(tipKey, value) : false;

  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-2 text-xs font-medium text-muted">
        <span>{label}</span>
        {tip && <InfoTooltip text={tip} />}
      </span>
      <span className="relative flex items-center">
        <input
          type="number"
          value={value}
          min={range?.min}
          max={range?.max}
          step={step}
          onChange={(e) => onChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
          aria-invalid={invalid}
          className={`w-full rounded-lg border px-3 py-2 font-mono text-sm text-ink transition-colors duration-200 focus:outline-none ${
            invalid
              ? "border-clay-500 bg-clay-500/5 focus:border-clay-500"
              : "border-line bg-parchment focus:border-moss-500 focus:bg-paper"
          }`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 text-xs text-muted">{suffix}</span>
        )}
      </span>
    </label>
  );
}
