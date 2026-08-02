import SectionCard from "./SectionCard";
import NumberField from "./NumberField";
import { getInvalidFields } from "../utils/validation";

const FIELD_KEYS = ["CEC", "SAR", "ESP"];

export default function MetricsCard({ values, onChange }) {
  const invalidFields = getInvalidFields(values, FIELD_KEYS);

  return (
    <SectionCard icon="📊" title="Soil Metrics">
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="CEC" tipKey="CEC" value={values.CEC} onChange={(v) => onChange("CEC", v)} step={0.5} />
        <NumberField label="SAR" tipKey="SAR" value={values.SAR} onChange={(v) => onChange("SAR", v)} step={0.1} />
        <NumberField label="ESP" tipKey="ESP" value={values.ESP} onChange={(v) => onChange("ESP", v)} step={0.5} />
      </div>

      {invalidFields.length > 0 && (
        <div className="mt-3 rounded-lg border border-clay-500 bg-clay-500/5 px-3 py-2 text-xs font-semibold text-clay-600">
          ⚠️ Invalid! Input out of range: {invalidFields.join(", ")}
        </div>
      )}
    </SectionCard>
  );
}
