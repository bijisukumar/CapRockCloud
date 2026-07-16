import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link to="/" className="text-sm font-semibold tracking-tight text-white">
            Caprock <span className="text-accent-400">Cloud</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-zinc-500">
            Migration, modernization, and AI-powered monitoring for
            mission-critical Azure environments.
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Site
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="/#capabilities" className="text-zinc-400 hover:text-zinc-200">
                  Capabilities
                </a>
              </li>
              <li>
                <Link to="/about" className="text-zinc-400 hover:text-zinc-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-zinc-400 hover:text-zinc-200">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-zinc-400 hover:text-zinc-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/portal" className="text-zinc-400 hover:text-zinc-200">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Contact
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a
                  href="mailto:hello@caprock-cloud.com"
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  hello@caprock-cloud.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-6">
        <p className="mx-auto max-w-6xl text-xs text-zinc-600">
          © {new Date().getFullYear()} Caprock Cloud. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
