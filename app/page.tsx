import { allPosts } from "@/.contentlayer/generated";
import Link from "next/link";

export default function Home() {
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="prose dark:prose-invert">
      {sortedPosts.map((post) => (
        <article key={post._id}>
          <Link href={post.slug}>
            <h2>{post.title}</h2>
          </Link>

          {post.description && <p>{post.description}</p>}
          {post.date && (
            <div className="text-xs font-light">
              {new Date(post.date).toDateString()}
            </div>
          )}
          {post.author && (
            <div className="text-xs font-light">by {post.author}</div>
          )}
        </article>
      ))}
    </div>
  );
}
