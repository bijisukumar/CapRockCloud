import { useState } from "react";
import { createPortal } from "react-dom";
import { submitContactMessage } from "../../lib/api.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  return errors;
}

export default function CallRequestModal({ open, onClose }) {
  const [values, setValues] = useState({ name: "", email: "", company: "", note: "" });
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
      await submitContactMessage({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        company: values.company.trim(),
        message: values.note.trim() || "Requested a call — no additional notes.",
        source: "call_request",
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err.message);
    }
  }

  // Portaled to <body>: the sticky header's backdrop-blur makes it the
  // containing block for `fixed` children, which pinned the modal inside it.
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-base-900 p-8 shadow-glow">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-white">
            {status === "success" ? "We'll be in touch" : "Get on a call"}
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
            Thanks{values.name ? `, ${values.name.split(" ")[0]}` : ""} — we'll reach out to{" "}
            <span className="text-zinc-200">{values.email}</span> to find a time.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <p className="text-sm text-zinc-400">
              Leave your details and we&apos;ll reach out to set up a time to connect.
            </p>

            <div>
              <label className="block text-xs font-medium text-zinc-400">Full name</label>
              <input
                type="text"
                value={values.name}
                onChange={handleChange("name")}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
                placeholder="Jordan Rivera"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400">Email</label>
              <input
                type="email"
                value={values.email}
                onChange={handleChange("email")}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
                placeholder="jordan@company.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Company (optional)
              </label>
              <input
                type="text"
                value={values.company}
                onChange={handleChange("company")}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400">
                What's on your mind? (optional)
              </label>
              <textarea
                value={values.note}
                onChange={handleChange("note")}
                rows={3}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
                placeholder="Briefly, what are you looking to solve?"
              />
            </div>

            {status === "error" && <p className="text-xs text-red-400">{serverError}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-md bg-accent-500 px-4 py-2.5 text-sm font-semibold text-base-950 transition hover:bg-accent-400 disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Request a call"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
