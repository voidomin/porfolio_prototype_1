import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PenLine } from "lucide-react";
import { blogPosts } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Writing | Akash",
  description: "Notes and essays on engineering, data, and building things.",
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-stone-50 pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">Writing</h1>
        <p className="text-stone-600 mb-12">
          Notes and essays on engineering, data, and building things. ·{" "}
          <a href="/feed.xml" className="underline hover:text-stone-900 transition-colors">
            RSS
          </a>
        </p>

        {blogPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-stone-300 rounded-2xl">
            <PenLine className="w-8 h-8 text-stone-400 mb-4" />
            <p className="text-stone-500 font-medium">First post coming soon.</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block w-full sm:w-[380px] rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h2 className="text-base font-bold text-stone-900 mb-1.5 group-hover:text-dawn-700 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {post.readingTime} min read
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
