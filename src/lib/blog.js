// Loads src/content/blog/*.md at build time and renders them to HTML.
// Frontmatter here is intentionally flat key: value pairs, parsed with a
// few lines of regex instead of pulling a Node-oriented library (e.g.
// gray-matter) into the client bundle — it added ~170kB and relied on
// eval(), neither of which is worth it for a handful of flat fields.
import { marked } from "marked";

const POST_FILES = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };

  const data = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    data[key] = value;
  }

  return { data, body: match[2] };
}

function slugFromPath(path) {
  return path.split("/").pop().replace(/\.md$/, "");
}

// Blog content is authored by us and committed to the repo, not
// user-submitted, so rendering marked's HTML output directly is fine —
// there's no untrusted-input path here.
const POSTS = Object.entries(POST_FILES)
  .map(([path, raw]) => {
    const { data, body } = parseFrontmatter(raw);
    return {
      slug: data.slug || slugFromPath(path),
      title: data.title || "Untitled",
      date: data.date || null,
      excerpt: data.excerpt || "",
      relatedAssetSlug: data.relatedAssetSlug || null,
      html: marked.parse(body),
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function listPosts() {
  return POSTS;
}

export function getPost(slug) {
  return POSTS.find((post) => post.slug === slug) || null;
}

// Parsed as local midnight rather than new Date(dateStr) (which parses
// "2026-10-01" as UTC midnight) so the displayed date doesn't shift back a
// day in timezones behind UTC.
export function formatPostDate(dateStr) {
  if (!dateStr) return null;
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
