import SectionCard from "./SectionCard";
import NumberField from "./NumberField";
import { getInvalidFields } from "../utils/validation";

const SEGMENTS = [
  { key: "SAND", label: "Sand", color: "#C9A96E" },
  { key: "CLAY", label: "Clay", color: "#8B5E3C" },
  { key: "SILT", label: "Silt", color: "#A0B87A" },
];

const FIELD_KEYS = ["SAND", "CLAY", "SILT"];

export default function TextureCard({ values, onChange }) {
  const sum = values.SAND + values.CLAY + values.SILT;
  const sumValid = Math.abs(sum - 100) < 0.01;
  const invalidFields = getInvalidFields(values, FIELD_KEYS);

  return (
    <SectionCard icon="🪨" title="Soil Texture">
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="Sand" tipKey="SAND" value={values.SAND} onChange={(v) => onChange("SAND", v)} step={0.5} />
        <NumberField label="Clay" tipKey="CLAY" value={values.CLAY} onChange={(v) => onChange("CLAY", v)} step={0.5} />
        <NumberField label="Silt" tipKey="SILT" value={values.SILT} onChange={(v) => onChange("SILT", v)} step={0.5} />
      </div>

      <div className="mt-4 flex h-5 w-full overflow-hidden rounded-md bg-parchment-dim">
        {SEGMENTS.map((seg) => {
          const w = sum > 0 ? (values[seg.key] / sum) * 100 : 0;
          return (
            <div
              key={seg.key}
              style={{ width: `${w}%`, backgroundColor: seg.color }}
              className="flex items-center justify-center text-[10px] font-semibold text-white/95 transition-[width] duration-300"
            >
              {w > 14 ? seg.label : ""}
            </div>
          );
        })}
      </div>

      <div className={`mt-2 text-xs font-semibold ${sumValid ? "text-moss-600" : "text-clay-600"}`}>
        {sumValid ? `✓ Total: 100.0%` : `✗ Total: ${sum.toFixed(1)}% — must equal 100%`}
      </div>

      {invalidFields.length > 0 && (
        <div className="mt-3 rounded-lg border border-clay-500 bg-clay-500/5 px-3 py-2 text-xs font-semibold text-clay-600">
          ⚠️ Invalid! Input out of range: {invalidFields.join(", ")}
        </div>
      )}
    </SectionCard>
  );
}
