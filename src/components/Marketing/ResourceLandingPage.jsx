import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAsset, submitLead } from "../../lib/api.js";

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

  if (!values.name.trim()) errors.name = "Name is required.";

  const email = values.email.trim().toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = "Work email is required.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  } else if (FREE_EMAIL_DOMAINS.has(email.split("@")[1])) {
    errors.email = "Please use your corporate email address.";
  }

  if (!values.company.trim()) errors.company = "Company is required.";

  return errors;
}

export default function ResourceLandingPage() {
  const { slug } = useParams();
  const [asset, setAsset] = useState(null);
  const [assetStatus, setAssetStatus] = useState("loading"); // loading | ready | error

  const [values, setValues] = useState({ name: "", email: "", company: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setAssetStatus("loading");

    fetchAsset(slug)
      .then((data) => {
        if (!cancelled) {
          setAsset(data);
          setAssetStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) setAssetStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

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
        assetSlug: slug,
        attributionToken: new URLSearchParams(window.location.search).get("utm_campaign") || null,
        sourcePage: window.location.pathname,
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setServerError(err.message);
    }
  }

  if (assetStatus === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (assetStatus === "error" || !asset) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          We couldn&apos;t find that resource
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          The link may be out of date. Reach out at{" "}
          <a href="mailto:hello@caprock-cloud.com" className="text-accent-400 hover:text-accent-300">
            hello@caprock-cloud.com
          </a>{" "}
          and we&apos;ll send it over.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {asset.title}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-zinc-400">{asset.description}</p>

      <div className="mt-12 max-w-xl">
        {status === "success" ? (
          <div className="rounded-lg border border-white/10 bg-base-900 p-8">
            <h2 className="text-lg font-semibold text-white">Check your inbox</h2>
            <p className="mt-3 text-sm text-zinc-400">
              Thanks{values.name ? `, ${values.name.split(" ")[0]}` : ""} — the{" "}
              <span className="text-zinc-200">{asset.title}</span> is on its way to{" "}
              <span className="text-zinc-200">{values.email}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-white/10 bg-base-900 p-8" noValidate>
            <p className="text-sm text-zinc-400">
              Trade your corporate email for the{" "}
              <span className="text-zinc-200">{asset.title}</span>.
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
              <label className="block text-xs font-medium text-zinc-400">Work email</label>
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
              <label className="block text-xs font-medium text-zinc-400">Company</label>
              <input
                type="text"
                value={values.company}
                onChange={handleChange("company")}
                className="mt-1.5 w-full rounded-md border border-white/10 bg-base-950 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-accent-500"
                placeholder="Acme Corp"
              />
              {errors.company && <p className="mt-1 text-xs text-red-400">{errors.company}</p>}
            </div>

            {status === "error" && <p className="text-xs text-red-400">{serverError}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-md bg-accent-500 px-4 py-2.5 text-sm font-semibold text-base-950 transition hover:bg-accent-400 disabled:opacity-60 sm:w-auto"
            >
              {status === "submitting" ? "Sending…" : "Send it to me"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
