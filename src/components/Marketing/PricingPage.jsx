import { Link } from "react-router-dom";

const ENGAGEMENTS = [
  {
    name: "Assessment & Roadmap",
    description:
      "A scoped review of your current middleware and infrastructure, ending in a prioritized migration and modernization plan.",
    included: [
      "Environment and dependency audit",
      "Risk and downtime assessment",
      "Phased migration roadmap",
    ],
  },
  {
    name: "Migration & Modernization",
    description:
      "The core delivery engagement — moving and re-platforming your integration estate onto Azure.",
    included: [
      "Middleware and application migration",
      "Integration re-platforming",
      "Cutover planning and support",
    ],
    highlighted: true,
  },
  {
    name: "Managed AI Monitoring",
    description:
      "Ongoing operations once you're live — we monitor, alert, and manage cost across your Azure estate.",
    included: [
      "24/7 infrastructure and health monitoring",
      "AI-driven anomaly detection and alerting",
      "Cost visibility and optimization",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        Engagement models
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-400">
        Every environment is different, so pricing is scoped to the size and
        complexity of yours. These are the three ways we typically work
        together.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {ENGAGEMENTS.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-lg border p-8 ${
              tier.highlighted
                ? "border-accent-500/40 bg-base-900 shadow-glow"
                : "border-white/10 bg-base-900"
            }`}
          >
            <h2 className="text-lg font-semibold text-white">{tier.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {tier.description}
            </p>

            <ul className="mt-6 flex-1 space-y-2">
              {tier.included.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-zinc-300">
                  <span className="text-accent-400">—</span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              to="/contact"
              className={`mt-8 rounded-md px-4 py-2.5 text-center text-sm font-semibold transition ${
                tier.highlighted
                  ? "bg-accent-500 text-base-950 hover:bg-accent-400"
                  : "border border-white/15 text-zinc-200 hover:border-white/30 hover:bg-white/5"
              }`}
            >
              Talk to us
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-zinc-500">
        Custom pricing based on environment size and scope —{" "}
        <Link to="/contact" className="text-accent-400 hover:text-accent-300">
          contact us
        </Link>{" "}
        for a quote.
      </p>
    </div>
  );
}
