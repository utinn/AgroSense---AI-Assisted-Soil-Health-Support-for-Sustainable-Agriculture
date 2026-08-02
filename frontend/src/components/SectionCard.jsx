export default function SectionCard({ icon, title, caption, children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-line bg-paper p-5 shadow-[0_1px_2px_rgba(34,38,28,0.06)] md:p-6 ${className}`}
    >
      <div className="mb-4 flex items-baseline justify-between border-b border-line pb-3">
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-moss-600">
          <span className="mr-1.5">{icon}</span>
          {title}
        </h3>
      </div>
      {caption && <p className="-mt-2.5 mb-4 text-xs text-muted">{caption}</p>}
      {children}
    </div>
  );
}
