import { PH_CLASSES } from "../data/constants";

const TOTAL_WEIGHT = PH_CLASSES.reduce((sum, c) => sum + c.weight, 0);

// Left-edge offset (%) and width (%) of each band along the scale.
const BANDS = (() => {
  let cursor = 0;
  return PH_CLASSES.map((cls) => {
    const width = (cls.weight / TOTAL_WEIGHT) * 100;
    const band = { ...cls, left: cursor, width };
    cursor += width;
    return band;
  });
})();

/**
 * The strata scale reads like a soil-core cross-section: five bands running
 * acidic -> alkaline, each colored to the mineral tone that produces it
 * (iron-oxide red, ochre, loam green, slate blue, chalky caliche violet).
 *
 * mode="legend"  — ambient, always-on reference (used in the hero)
 * mode="result"  — same bands, plus a pin marking the predicted class
 */
export default function StrataScale({ mode = "legend", activeIndex = null, confidence = null, dense = false }) {
  const active = activeIndex != null ? BANDS[activeIndex] : null;
  const pinLeft = active ? active.left + active.width / 2 : null;

  return (
    <div className="w-full select-none">
      {mode === "result" && active && (
        <div className="relative h-14">
          <div
            className="absolute bottom-0 flex -translate-x-1/2 flex-col items-center transition-[left] duration-700 ease-out"
            style={{ left: `${pinLeft}%` }}
          >
            <span
              className="whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide text-paper shadow-sm"
              style={{ backgroundColor: active.color }}
            >
              {confidence != null ? `${confidence.toFixed(1)}%` : active.label}
            </span>
            <svg width="14" height="10" viewBox="0 0 14 10" className="mt-0.5">
              <path d="M7 10 L0 0 H14 Z" fill={active.color} />
            </svg>
          </div>
        </div>
      )}

      <div
        className={`flex w-full overflow-hidden rounded-full ring-1 ring-ink/10 ${
          dense ? "h-2.5" : "h-3.5 md:h-4"
        }`}
      >
        {BANDS.map((band) => (
          <div
            key={band.key}
            style={{ width: `${band.width}%`, backgroundColor: band.color }}
            className={`h-full transition-opacity duration-500 ${
              active && active.key !== band.key ? "opacity-40" : "opacity-100"
            }`}
            title={`${band.label} (${band.range})`}
          />
        ))}
      </div>

      {mode === "legend" && (
        <div className="mt-2 flex w-full">
          {BANDS.map((band) => (
            <div key={band.key} style={{ width: `${band.width}%` }} className="px-0.5 text-center">
              <div className="truncate font-mono text-[10px] uppercase tracking-wider text-moss-200/80 md:text-[11px]">
                {band.range}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { BANDS };
