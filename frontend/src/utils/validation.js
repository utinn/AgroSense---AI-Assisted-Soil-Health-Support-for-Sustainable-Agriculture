import { FIELD_RANGES } from "../data/constants";

/** Is this single field's value within its researched range? */
export function isInRange(fieldKey, value) {
  const range = FIELD_RANGES[fieldKey];
  if (!range) return true; // no known range for this key — nothing to check
  return value >= range.min && value <= range.max;
}

/** Given a values object and a list of field keys to check, returns just
 * the keys that are currently out of range. Empty array = all valid. */
export function getInvalidFields(values, keys) {
  return keys.filter((key) => !isInRange(key, values[key]));
}
