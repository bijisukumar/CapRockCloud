import { useState } from "react";
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
  if (!values.message.trim()) errors.message = "Message is required.";
  return errors;
}

export default function ContactPage() {
  const [values, setValues] = useState({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState(null);

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
        message: values.message.trim(),
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        Contact us
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-400">
        Tell us about your environment and what you're trying to solve.
        We'll get back to you shortly.
      </p>

      <div className="mt-12 max-w-xl">
        {status === "success" ? (
          <div className="rounded-lg border border-white/10 bg-base-900 p-8">
            <h2 className="text-lg font-semibold text-white">Message sent</h2>
            <p className="mt-3 text-sm text-zinc-400">
              Thanks{values.name ? `, ${values.name.split(" ")[0]}` : ""} — we'll
              be in touch soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-zinc-400">
                Full name
              </label>
              <input
                type="text"
                value={values.name}
                onChange={handleChange("name")}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-900 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
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
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-900 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
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
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-900 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400">Message</label>
              <textarea
                value={values.message}
                onChange={handleChange("message")}
                rows={5}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-900 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
                placeholder="What are you trying to solve?"
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-400">{errors.message}</p>
              )}
            </div>

            {status === "error" && (
              <p className="text-xs text-red-400">{serverError}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-md bg-accent-500 px-4 py-2.5 text-sm font-semibold text-base-950 transition hover:bg-accent-400 disabled:opacity-60 sm:w-auto"
            >
              {status === "submitting" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
