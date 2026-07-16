// POST /api/contact
// Cloudflare Pages Function — writes a general contact-form message into D1.

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
  const company = (body.company || "").trim() || null;
  const message = (body.message || "").trim();

  if (!name) return badRequest("name is required.");
  if (!email || !EMAIL_PATTERN.test(email)) return badRequest("A valid email is required.");
  if (!message) return badRequest("message is required.");

  try {
    await env.CAPROCK_DB.prepare(
      `INSERT INTO contact_messages (name, email, company, message) VALUES (?1, ?2, ?3, ?4)`
    )
      .bind(name, email, company, message)
      .run();
  } catch {
    return new Response(JSON.stringify({ error: "Failed to store message." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
