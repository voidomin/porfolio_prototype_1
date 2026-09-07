"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/data/portfolio";

/* ──────────────────────────────────────────────────────────
   WritingSection – homepage preview for the /blog writing
   archive, mirroring PhotographySection's "preview + view
   more" pattern. Renders nothing while blogPosts is empty.
   ────────────────────────────────────────────────────────── */

export const WritingSection = () => {
  if (blogPosts.length === 0) return null;

  const previewPosts = [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  return (
    <section id="writing" className="relative py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            Field <span className="text-dawn-600">Notes</span>
          </h2>
          <p className="text-stone-600/60 max-w-xl mx-auto text-sm leading-relaxed">
            Notes and essays on engineering, data, and building things.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
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
                  <h3 className="text-sm font-bold text-stone-900 mb-1.5 group-hover:text-dawn-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                    {post.readingTime} min read
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-stone-900 text-white border border-stone-800 hover:bg-stone-850 hover:border-stone-700 text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-lg shadow-stone-900/10 hover:shadow-stone-900/25"
          >
            View All Writing
            <ArrowRight className="w-4 h-4 text-dawn-500 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};
