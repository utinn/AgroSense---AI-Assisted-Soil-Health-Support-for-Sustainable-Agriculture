import { FIELD_RANGES } from "../data/constants";

export function isInRange(fieldKey, value) {
  const range = FIELD_RANGES[fieldKey];
  if (!range) return true; 
  return value >= range.min && value <= range.max;
}

export function getInvalidFields(values, keys) {
  return keys.filter((key) => !isInRange(key, values[key]));
}
