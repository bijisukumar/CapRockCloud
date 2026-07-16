const PILLARS = [
  {
    title: "Migration",
    description:
      "We plan and execute moves off legacy platforms with a phased approach — no risky all-at-once cutovers.",
  },
  {
    title: "Modernization",
    description:
      "We re-platform integrations and middleware onto cloud-native services without breaking what already works.",
  },
  {
    title: "Moving to Cloud",
    description:
      "We handle the full arc of cloud adoption: architecture, landing zones, governance, and the workload migration itself.",
  },
  {
    title: "AI in Monitoring",
    description:
      "Once you're live, our AI-powered monitoring platform keeps watch — health, cost, and anomaly detection in one place.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        About Caprock Cloud
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-zinc-400">
        Caprock Cloud is an enterprise integration and MSP partner. We help
        teams move off legacy middleware, land safely on Azure, and keep
        their environment healthy long after the migration is done — without
        the downtime that usually comes with it.
      </p>

      <p className="mt-4 max-w-2xl text-lg text-zinc-400">
        We work as an extension of your team: scoping the migration,
        modernizing the integrations that depend on it, and staying on as
        your managed operations partner once you're running in the cloud.
      </p>

      <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
        {PILLARS.map((pillar) => (
          <div key={pillar.title} className="bg-base-900 p-8">
            <h2 className="text-lg font-semibold text-white">{pillar.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
