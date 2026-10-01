import { Link, useParams } from "react-router-dom";
import { getPost, formatPostDate } from "../../lib/blog.js";

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Post not found
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          <Link to="/blog" className="text-accent-400 hover:text-accent-300">
            Back to the blog
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <Link to="/blog" className="text-sm text-zinc-500 hover:text-zinc-300">
        ← Back to the blog
      </Link>

      {post.date && (
        <p className="mt-6 text-xs font-medium uppercase tracking-widest text-zinc-500">
          {formatPostDate(post.date)}
        </p>
      )}
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        {post.title}
      </h1>

      <div
        className="prose prose-invert mt-10 max-w-none prose-headings:text-white prose-p:text-zinc-400 prose-a:text-accent-400"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />

      {post.relatedAssetSlug && (
        <div className="mt-12 rounded-lg border border-accent-500/30 bg-base-900 p-6">
          <p className="text-sm text-zinc-300">Want the full checklist?</p>
          <Link
            to={`/resources/${post.relatedAssetSlug}`}
            className="mt-3 inline-block rounded-md bg-accent-500 px-4 py-2.5 text-sm font-semibold text-base-950 transition hover:bg-accent-400"
          >
            Get the download
          </Link>
        </div>
      )}
    </div>
  );
}
