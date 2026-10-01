import { useState } from "react";
import { Link } from "react-router-dom";
import { submitContactMessage } from "../../lib/api.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Real customer login (session/SSO) is a separate build — see
// ARCHITECTURE.md "Deliberately deferred". This just captures interest so
// we know who's asking before that's wired up.
export default function PortalLanding() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  async function handleRequestAccess(e) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setError(null);
    try {
      await submitContactMessage({
        name: trimmed.split("@")[0],
        email: trimmed,
        message: "Requested client portal access.",
        source: "portal_access_request",
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        Client Portal
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-400">
        Your Azure environment&apos;s health, cost, and alerts in one place.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col rounded-lg border border-white/10 bg-base-900 p-8">
          <h2 className="text-lg font-semibold text-white">Existing client</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Client login isn&apos;t live yet. Leave your email and we&apos;ll
            set up access.
          </p>

          {status === "success" ? (
            <p className="mt-6 text-sm text-accent-400">
              Got it — we&apos;ll reach out shortly.
            </p>
          ) : (
            <form onSubmit={handleRequestAccess} className="mt-6" noValidate>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-md border border-white/10 bg-base-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
              />
              {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-3 w-full rounded-md border border-white/15 px-4 py-2.5 text-center text-sm font-semibold text-zinc-200 transition hover:border-white/30 hover:bg-white/5 disabled:opacity-60"
              >
                {status === "submitting" ? "Sending…" : "Request access"}
              </button>
            </form>
          )}
        </div>

        <div className="flex flex-col rounded-lg border border-accent-500/40 bg-base-900 p-8 shadow-glow">
          <h2 className="text-lg font-semibold text-white">Not a client yet?</h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
            See a sample of what the portal looks like, with demo data
            standing in for your Azure environment.
          </p>
          <Link
            to="/portal/dashboard"
            className="mt-6 rounded-md bg-accent-500 px-4 py-2.5 text-center text-sm font-semibold text-base-950 transition hover:bg-accent-400"
          >
            View sample dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
