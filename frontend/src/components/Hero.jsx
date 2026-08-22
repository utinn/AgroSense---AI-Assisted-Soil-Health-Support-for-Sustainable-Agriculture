import StrataScale from "./StrataScale";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-moss-700 via-ink to-ink">
      <div className="bg-topo animate-propagate pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-moss-300">
              AI-powered Soil pH Classifier
            </p>
            <h1 className="mt-2 max-w-md font-display text-4xl leading-[1.05] text-parchment md:text-5xl">
              Know your soil before you plant.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-parchment/70 md:text-base">
              Enter a single sample's texture, nutrients, and base chemistry or
              upload a field-wide CSV and AgroSense classifies pH across five
              agronomic bands, from strongly acidic to strongly alkaline.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-parchment/50">
              Five soil pH categories the AI predicts
            </p>
            <StrataScale mode="legend" />
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {["Strongly Acidic", "Moderately Acidic", "Neutral", "Moderately Alkaline", "Strongly Alkaline"].map(
                (label) => (
                  <span key={label} className="text-[11px] text-parchment/60">
                    {label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
