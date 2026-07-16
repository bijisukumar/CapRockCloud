const MOCK_TENANTS = [{ slug: "demo-client", displayName: "Demo Client" }];

export default function TenantSelector({ tenantSlug, onChange }) {
  return (
    <select
      value={tenantSlug}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-white/10 bg-base-950 px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-accent-500"
    >
      {MOCK_TENANTS.map((tenant) => (
        <option key={tenant.slug} value={tenant.slug}>
          {tenant.displayName}
        </option>
      ))}
    </select>
  );
}

export { MOCK_TENANTS };
