import { notFound } from "next/navigation";
import { Metadata } from "next";
import { allPages } from "contentlayer/generated";

import { Mdx } from "@/components/mdx-components";
import { allCarisurauPosts } from "contentlayer/generated";
import Link from "next/link";
import "@/styles/mdx.css";

interface PageProps {
  params: {
    slug: string[];
  };
}

async function getPageFromParams(params: PageProps["params"]) {
  const slug = params?.slug?.join("/");
  const page = allPages.find((page) => page.slugAsParams === slug);

  if (!page) {
    null;
  }

  return page;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getPageFromParams(params);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  return allPages.map((page) => ({
    slug: page.slugAsParams.split("/"),
  }));
}

export default async function PagePage({ params }: PageProps) {
  const page = await getPageFromParams(params);

  const sortedCarisurauPosts = allCarisurauPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!page) {
    notFound();
  }

  if (page.slugAsParams === "carisurau") {
    return (
      <div className="prose dark:prose-invert">
        {sortedCarisurauPosts.map((post) => (
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

  return (
    <article className="py-6 prose dark:prose-invert">
      <h1>{page.title}</h1>
      {page.description && <p className="text-xl">{page.description}</p>}
      <hr />
      <Mdx code={page.body.code} />
    </article>
  );
}
