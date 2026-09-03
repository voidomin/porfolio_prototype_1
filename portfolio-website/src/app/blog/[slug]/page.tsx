import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { blogPosts } from "@/data/portfolio";

interface BlogPostPageProps {
  params: { slug: string };
}

function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPost(params.slug);
  if (!post) {
    return { title: "Post Not Found" };
  }
  return {
    title: `${post.title} | Akash`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [{ url: post.image }],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPost(params.slug);
  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="min-h-screen bg-stone-50 pt-32 pb-24 px-6">
      <article className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-forest-700 hover:text-forest-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Writing
        </Link>

        <p className="text-xs font-mono text-stone-500 font-semibold mb-3">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {post.readingTime} min read
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-8">
          {post.title}
        </h1>

        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-stone-200 shadow-lg mb-10">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        <div className="prose prose-stone max-w-none">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-stone-700 leading-relaxed mb-5">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
