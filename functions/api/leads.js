// POST /api/leads
// Cloudflare Pages Function — writes a gated-content lead directly into D1.
// Bound via wrangler.toml: [[d1_databases]] binding = "CAPROCK_DB"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(message) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const company = (body.company || "").trim();
  const assetSlug = (body.assetSlug || "").trim();
  const attributionToken = body.attributionToken || null;
  const sourcePage = body.sourcePage || null;

  if (!name) return badRequest("name is required.");
  if (!email || !EMAIL_PATTERN.test(email)) return badRequest("A valid email is required.");
  if (!company) return badRequest("company is required.");
  if (!assetSlug) return badRequest("assetSlug is required.");

  try {
    await env.CAPROCK_DB.prepare(
      `INSERT INTO leads (name, email, company, asset_slug, attribution_token, source_page)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6)
       ON CONFLICT (email, asset_slug) DO UPDATE SET
         name = excluded.name,
         company = excluded.company,
         attribution_token = excluded.attribution_token,
         source_page = excluded.source_page`
    )
      .bind(name, email, company, assetSlug, attributionToken, sourcePage)
      .run();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to store lead." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
