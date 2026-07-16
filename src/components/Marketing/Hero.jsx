export default function Hero({ onOpenGate }) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(45,212,191,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(45,212,191,0.08), transparent 35%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-32 sm:py-40">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
          Enterprise Integration &amp; Azure Operations Partner
        </div>

        <h1 className="mt-8 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Migrate. Modernize. Move to the cloud. Watch it all with AI.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          Caprock Cloud migrates and modernizes mission-critical middleware
          onto Azure, then keeps it running with an AI-powered monitoring
          platform built for teams who can&apos;t afford downtime.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#capabilities"
            className="rounded-md bg-accent-500 px-5 py-2.5 text-sm font-semibold text-base-950 transition hover:bg-accent-400"
          >
            Explore capabilities
          </a>
          <button
            onClick={onOpenGate}
            className="rounded-md border border-white/15 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-white/30 hover:bg-white/5"
          >
            Get the migration checklist
          </button>
        </div>
      </div>
    </section>
  );
}
