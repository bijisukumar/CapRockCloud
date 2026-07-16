import { useState } from "react";
import { submitLead } from "../../lib/api.js";

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
]);

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  const email = values.email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = "Work email is required.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (FREE_EMAIL_DOMAINS.has(email.split("@")[1])) {
    errors.email = "Please use your corporate email address.";
  }

  if (!values.company.trim()) {
    errors.company = "Company is required.";
  }

  return errors;
}

export default function GatedContentModal({
  open,
  onClose,
  assetName = "Middleware to Cloud Migration Checklist",
  assetSlug = "middleware-to-cloud-migration-checklist",
}) {
  const [values, setValues] = useState({ name: "", email: "", company: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState(null);

  if (!open) return null;

  function handleChange(field) {
    return (e) => setValues((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    setServerError(null);

    try {
      await submitLead({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        company: values.company.trim(),
        assetSlug,
        attributionToken: new URLSearchParams(window.location.search).get("utm_campaign") || null,
        sourcePage: window.location.pathname,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-base-900 p-8 shadow-glow">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-white">
            {status === "success" ? "Check your inbox" : "Get the checklist"}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-zinc-500 transition hover:text-zinc-300"
          >
            ✕
          </button>
        </div>

        {status === "success" ? (
          <p className="mt-4 text-sm text-zinc-400">
            Thanks{values.name ? `, ${values.name.split(" ")[0]}` : ""} — the{" "}
            <span className="text-zinc-200">{assetName}</span> is on its way
            to <span className="text-zinc-200">{values.email}</span>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <p className="text-sm text-zinc-400">
              Trade your corporate email for the{" "}
              <span className="text-zinc-200">{assetName}</span>.
            </p>

            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Full name
              </label>
              <input
                type="text"
                value={values.name}
                onChange={handleChange("name")}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
                placeholder="Jordan Rivera"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Work email
              </label>
              <input
                type="email"
                value={values.email}
                onChange={handleChange("email")}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
                placeholder="jordan@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Company
              </label>
              <input
                type="text"
                value={values.company}
                onChange={handleChange("company")}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
                placeholder="Acme Corp"
              />
              {errors.company && (
                <p className="mt-1 text-xs text-red-400">{errors.company}</p>
              )}
            </div>

            {status === "error" && (
              <p className="text-xs text-red-400">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-md bg-accent-500 px-4 py-2.5 text-sm font-semibold text-base-950 transition hover:bg-accent-400 disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Send me the checklist"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
