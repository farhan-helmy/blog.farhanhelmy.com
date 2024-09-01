import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";

import { Metadata } from "next";
import { Mdx } from "@/components/mdx-components";
import "@/styles/mdx.css";
import Image from "next/image";

interface PostProps {
  params: {
    slug: string[];
  };
}

async function getPostFromParams(params: PostProps["params"]) {
  const slug = params?.slug?.join("/");
  const post = allPosts.find((post) => post.slugAsParams === slug);

  if (!post) {
    null;
  }

  return post;
}

export async function generateMetadata({
  params,
}: PostProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://blog.farhanhelmy.com/posts/${params.slug.join("/")}`,
      type: 'article',
      images: [
        {
          url: post.image || 'https://blog.farhanhelmy.com/blog-post-3.jpg',
          width: 800,
          height: 600,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image || 'https://blog.farhanhelmy.com/blog-post-3.jpg'],
    },
  };
}

export async function generateStaticParams(): Promise<PostProps["params"][]> {
  return allPosts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }));
}

export default async function PostPage({ params }: PostProps) {
  const post = await getPostFromParams(params);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-6 prose dark:prose-invert">
      <h1 className="mb-2">{post.title}</h1>
      {post.description && (
        <p className="text-xl mt-0 text-slate-700 dark:text-slate-200">
          {post.description}
        </p>
      )}
      {post.date && (
        <div className="text-xs font-light">
          {new Date(post.date).toDateString()} by Farhan Helmy
        </div>
      )}
      {post.image && (
        <Image src={post.image} alt={post.title} className="my-4" width={1000} height={1000} />
      )}
      <hr className="my-4" />
      <Mdx code={post.body.code} />
    </article>
  );
}
