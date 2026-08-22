import SectionCard from "./SectionCard";
import NumberField from "./NumberField";
import { getInvalidFields } from "../utils/validation";

const FIELD_KEYS = ["N", "P"];

export default function NutrientsCard({ values, onChange }) {
  const invalidFields = getInvalidFields(values, FIELD_KEYS);

  return (
    <SectionCard icon="🌿" title="Soil Nutrients">
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="N" tipKey="N" value={values.N} onChange={(v) => onChange("N", v)} step={0.01} />
        <NumberField label="P" tipKey="P" value={values.P} onChange={(v) => onChange("P", v)} step={0.5} />
      </div>

      {invalidFields.length > 0 && (
        <div className="mt-3 rounded-lg border border-clay-500 bg-clay-500/5 px-3 py-2 text-xs font-semibold text-clay-600">
          ⚠️ Invalid! Input out of range: {invalidFields.join(", ")}
        </div>
      )}
    </SectionCard>
  );
}
