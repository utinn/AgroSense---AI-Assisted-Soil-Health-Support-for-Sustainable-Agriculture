export default function TopNav({ mode, setMode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
        <div className="flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 32 32" className="shrink-0">
            <rect width="32" height="32" rx="7" fill="#8FBB6E" />
            <path d="M8 22C8 13 14 8 24 8c0 10-5 16-14 16-1 0-2-2-2-2Z" fill="#22261C" />
          </svg>
          <span className="font-display text-lg font-medium tracking-tight text-parchment">
            AgroSense
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Prediction mode"
          className="flex rounded-full bg-black/25 p-1 text-sm"
        >
          {[
            { id: "single", label: "Singular Mode" },
            { id: "batch", label: "Batch Mode" },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={mode === tab.id}
              onClick={() => setMode(tab.id)}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-colors md:px-4 ${
                mode === tab.id
                  ? "bg-moss-500 text-paper"
                  : "text-parchment/70 hover:text-parchment"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
