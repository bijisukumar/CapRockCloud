const CAPABILITIES = [
  {
    title: "Migration",
    description:
      "Move legacy applications, middleware, and data onto Azure with a proven, phased methodology — no risky all-at-once cutovers.",
  },
  {
    title: "Modernization",
    description:
      "Retire legacy ESB/BizTalk estates and re-platform integrations onto cloud-native services without breaking downstream contracts.",
  },
  {
    title: "Moving to Cloud",
    description:
      "End-to-end cloud adoption — architecture, landing zones, governance, and workload migration — built for teams who can't afford downtime.",
  },
  {
    title: "AI in Monitoring",
    description:
      "Our AI-powered monitoring platform delivers real-time infrastructure health, cost intelligence, and anomaly detection across your entire Azure estate.",
  },
];

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-accent-400">
        Capabilities
      </h2>
      <p className="mt-3 max-w-2xl text-2xl font-medium text-white sm:text-3xl">
        Migration, modernization, and cloud operations — backed by AI-driven
        monitoring built into everything we run for you.
      </p>

      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
        {CAPABILITIES.map((item) => (
          <div key={item.title} className="bg-base-900 p-8">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
