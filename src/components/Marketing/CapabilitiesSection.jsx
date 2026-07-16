const CAPABILITIES = [
  {
    title: "Middleware Modernization",
    description:
      "Retire legacy ESB/BizTalk estates and re-platform integrations onto Azure Integration Services without breaking downstream contracts.",
  },
  {
    title: "Azure Operations & FinOps",
    description:
      "Continuous cost, health, and throughput visibility across every subscription — surfaced through Turbo360-powered dashboards.",
  },
  {
    title: "Managed Integration Services",
    description:
      "24/7 monitoring, incident response, and change management for Logic Apps, Service Bus, API Management, and Functions.",
  },
  {
    title: "Multi-Tenant Governance",
    description:
      "Tenant-scoped access, policy, and reporting so every business unit or customer sees only their own environment.",
  },
];

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-accent-400">
        Capabilities
      </h2>
      <p className="mt-3 max-w-2xl text-2xl font-medium text-white sm:text-3xl">
        Everything between your legacy middleware and a fully governed Azure
        estate.
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
