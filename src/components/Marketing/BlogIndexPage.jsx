import { Link } from "react-router-dom";
import { listPosts, formatPostDate } from "../../lib/blog.js";

export default function BlogIndexPage() {
  const posts = listPosts();

  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        Blog
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-zinc-400">
        Notes on migration, modernization, and running Azure environments at
        scale.
      </p>

      <div className="mt-14 divide-y divide-white/10 border-t border-white/10">
        {posts.length === 0 && (
          <p className="py-8 text-sm text-zinc-500">No posts yet — check back soon.</p>
        )}
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="block py-8 transition hover:bg-white/5"
          >
            {post.date && (
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                {formatPostDate(post.date)}
              </p>
            )}
            <h2 className="mt-2 text-xl font-semibold text-white">{post.title}</h2>
            {post.excerpt && (
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
