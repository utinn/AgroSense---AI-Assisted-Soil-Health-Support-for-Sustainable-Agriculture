import { useState } from "react";

export default function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex shrink-0">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-label="More info"
        aria-expanded={open}
        className="flex h-4 w-4 items-center justify-center rounded-full border border-muted/50 text-[10px] font-semibold leading-none text-muted transition-colors hover:border-moss-500 hover:text-moss-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500"
      >
        ?
      </button>

      {open && (
        <span
          role="tooltip"
          className="whitespace-pre-line pointer-events-none absolute bottom-full right-0 z-30 mb-2 w-max max-w-md rounded-lg border border-amber-600/400 bg-white px-3 py-2 text-xs font-normal normal-case leading-relaxed text-gray-600 shadow-lg"
        >
          {text}
          {}
          <span className="absolute right-1 top-full h-2 w-2 -translate-y-1/2 rotate-45 border-b border-r border-moss-600/40 bg-amber-400" />
        </span>
      )}
    </span>
  );
}
