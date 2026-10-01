// POST /api/leads
// Cloudflare Pages Function — writes a gated-content lead directly into D1,
// then emails the requested document to them via Resend (best-effort: a
// Resend failure doesn't fail the lead capture, since the row in D1 is the
// source of truth we can always follow up from manually).
// Bound via wrangler.toml: [[d1_databases]] binding = "CAPROCK_DB"
// Secret (set via `wrangler pages secret put RESEND_API_KEY`): RESEND_API_KEY

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(message) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

async function sendDocumentEmail({ env, to, name, asset, origin }) {
  if (!env.RESEND_API_KEY) {
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }

  const downloadUrl = `${origin}${asset.file_path}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.LEADS_FROM_EMAIL || "Caprock Cloud <hello@caprock-cloud.com>",
        to: [to],
        subject: `Your download: ${asset.title}`,
        html: `<p>Hi${name ? ` ${name.split(" ")[0]}` : ""},</p>
<p>Thanks for your interest in Caprock Cloud. Here's your download:</p>
<p><a href="${downloadUrl}">${asset.title}</a></p>
<p>— Caprock Cloud</p>`,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { sent: false, reason: `Resend API error ${res.status}: ${body}` };
    }

    return { sent: true };
  } catch (err) {
    return { sent: false, reason: err.message };
  }
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

  const asset = await env.CAPROCK_DB.prepare(
    `SELECT slug, title, file_path FROM content_assets WHERE slug = ?1`
  )
    .bind(assetSlug)
    .first();

  let emailResult = { sent: false, reason: "Unknown asset slug — no file to send." };
  if (asset) {
    const origin = new URL(request.url).origin;
    emailResult = await sendDocumentEmail({ env, to: email, name, asset, origin });
  }
  if (!emailResult.sent) {
    console.error(`Lead stored but document email not sent for ${email}: ${emailResult.reason}`);
  }

  return new Response(JSON.stringify({ ok: true, emailSent: emailResult.sent }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
