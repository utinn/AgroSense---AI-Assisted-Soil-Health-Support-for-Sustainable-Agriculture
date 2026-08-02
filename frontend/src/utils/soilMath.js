// Ported directly from compute_percentages() in Main.py.
// Still used client-side for the live %Ca/%Mg/%K chips as the user types,
// ahead of and independent from the actual prediction call.
export function computePercentages(Ca, Mg, K, Na) {
  const total = Ca + Mg + K + Na;
  if (total > 0) {
    return {
      pctCa: (Ca / total) * 100,
      pctMg: (Mg / total) * 100,
      pctK: (K / total) * 100,
      pctNa: (Na / total) * 100
    };
  }
  return { pctCa: 0, pctMg: 0, pctK: 0, pctNa: 0};
}
