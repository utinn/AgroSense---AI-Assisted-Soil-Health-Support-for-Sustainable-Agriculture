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
