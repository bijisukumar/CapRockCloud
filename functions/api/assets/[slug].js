// GET /api/assets/:slug
// Cloudflare Pages Function — looks up a gated-content asset's public
// metadata (title/description/file path) so a landing page can render
// itself without hardcoding copy per document.

export async function onRequestGet({ params, env }) {
  const { slug } = params;

  const asset = await env.CAPROCK_DB.prepare(
    `SELECT slug, title, description, file_path FROM content_assets WHERE slug = ?1`
  )
    .bind(slug)
    .first();

  if (!asset) {
    return new Response(JSON.stringify({ error: "Unknown asset." }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(asset), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
