import SectionCard from "./SectionCard";
import NumberField from "./NumberField";
import { computePercentages } from "../utils/soilMath";
import { getInvalidFields } from "../utils/validation";

const FIELD_KEYS = ["Ca", "Mg", "K", "Na"];

export default function ChemicalsCard({ values, onChange }) {
  const { pctCa, pctMg, pctK, pctNa } = computePercentages(values.Ca, values.Mg, values.K, values.Na);
  const invalidFields = getInvalidFields(values, FIELD_KEYS);

  return (
    <SectionCard icon="⚗️" title="Base Chemicals (Cmol(+)/kg)">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Ca" tipKey="Ca" value={values.Ca} onChange={(v) => onChange("Ca", v)} step={0.1} />
        <NumberField label="Mg" tipKey="Mg" value={values.Mg} onChange={(v) => onChange("Mg", v)} step={0.1} />
        <NumberField label="K" tipKey="K" value={values.K} onChange={(v) => onChange("K", v)} step={0.01} />
        <NumberField label="Na" tipKey="Na" value={values.Na} onChange={(v) => onChange("Na", v)} step={0.01} />
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {[
          ["% Ca", pctCa],
          ["% Mg", pctMg],
          ["% K", pctK],
          ["% Na", pctNa]
        ].map(([label, val]) => (
          <span key={label} className="rounded-md bg-parchment-dim px-2.5 py-1 font-mono text-xs text-ink">
            {label}: {val.toFixed(1)}
          </span>
        ))}
      </div>

      {invalidFields.length > 0 && (
        <div className="mt-3 rounded-lg border border-clay-500 bg-clay-500/5 px-3 py-2 text-xs font-semibold text-clay-600">
          ⚠️ Invalid! Input out of range: {invalidFields.join(", ")}
        </div>
      )}
    </SectionCard>
  );
}
