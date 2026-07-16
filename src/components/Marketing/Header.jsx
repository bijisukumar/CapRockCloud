import { useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS = [{ label: "Capabilities", href: "#capabilities" }];

export default function Header({ onOpenGate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-base-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="text-sm font-semibold tracking-tight text-white">
          Caprock <span className="text-accent-400">Cloud</span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <button
            onClick={onOpenGate}
            className="text-sm font-medium text-zinc-400 transition hover:text-zinc-200"
          >
            Get the checklist
          </button>
          <Link
            to="/portal"
            className="rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-white/30 hover:bg-white/5"
          >
            Client Portal
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-zinc-300 sm:hidden"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 px-6 py-4 sm:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenGate?.();
              }}
              className="rounded-md px-2 py-2 text-left text-sm font-medium text-zinc-300 hover:bg-white/5"
            >
              Get the checklist
            </button>
            <Link
              to="/portal"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-md border border-white/15 px-2 py-2 text-center text-sm font-semibold text-zinc-200 hover:border-white/30 hover:bg-white/5"
            >
              Client Portal
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
