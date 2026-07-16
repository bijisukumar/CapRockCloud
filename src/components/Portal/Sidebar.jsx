const NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "health", label: "Infrastructure Health" },
  { key: "messages", label: "Message Volume" },
  { key: "alerts", label: "Alert Log" },
  { key: "cost", label: "Cost Metrics" },
];

export default function Sidebar({ activeKey, onSelect }) {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-base-900">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <span className="text-sm font-semibold tracking-tight text-white">
          Caprock <span className="text-accent-400">Cloud</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
              activeKey === item.key
                ? "bg-white/10 text-white"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4 text-xs text-zinc-500">
        Signed in as <span className="text-zinc-300">ops@customer.com</span>
      </div>
    </aside>
  );
}
