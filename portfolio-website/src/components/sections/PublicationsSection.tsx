"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, FlaskConical, BookOpen, PenLine, ArrowRight } from "lucide-react";
import { publications, blogPosts } from "@/data/portfolio";
import { AccentLineReveal } from "@/components/ui/AccentLineReveal";

// The research write-up has a narrative companion piece in Writing — surfacing
// it here gives the section a real second element instead of one lone card,
// and shows the site's sections are actually connected to each other.
const RELATED_POST_SLUG = "trusting-a-single-signal";

/* ──────────────────────────────────────────────────────────
   PublicationsSection – "Chapter 5: The Clearing"
   Warm afternoon light. Publication styled as a
   parchment/journal page in a sunny forest clearing.
   ────────────────────────────────────────────────────────── */

export const PublicationsSection = () => {
  if (publications.length === 0) return null;

  const relatedPost = blogPosts.find((post) => post.slug === RELATED_POST_SLUG);

  return (
    <section
      id="publications"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(191, 227, 254, 0.2) 0%, rgba(232, 245, 204, 0.15) 10%, rgba(245, 251, 232, 0.15) 30%, rgba(245, 251, 232, 0.15) 70%, rgba(232, 245, 204, 0.15) 90%, rgba(252, 232, 230, 0.25) 100%)",
      }}
    >
      {/* Afternoon warmth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(240,180,41,0.12),transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <AccentLineReveal className="bg-dawn-500" />
          <p className="text-dawn-600/50 text-sm tracking-[0.3em] uppercase mb-4">Chapter Five</p>
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            The <span className="text-dawn-600">Clearing</span>
          </h2>
          <p className="text-stone-600/60 max-w-xl mx-auto">
            A single research chapter, told like a story found in an afternoon clearing.
          </p>
        </motion.div>

        {/* Publication cards */}
        <div className="space-y-8">
          {publications.map((publication, index) => (
            <motion.article
              key={publication.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="parchment rounded-3xl p-8 md:p-10 shadow-lg border border-dawn-200/50"
            >
              <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-start">
                <div className="space-y-5">
                  <div className="flex items-center gap-2 text-dawn-700 text-sm font-medium">
                    <FlaskConical className="h-4 w-4" />
                    Research Publication · {publication.year}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-semibold text-stone-900 leading-tight font-serif">
                    {publication.title}
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed italic">
                    {publication.authors.join(", ")}
                  </p>

                  {publication.abstract && (
                    <div className="bg-dawn-50/80 rounded-2xl p-6 border border-dawn-200/40">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-dawn-600/60" />
                        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                          Storyline
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed text-stone-700">
                        {publication.abstract}
                      </p>
                    </div>
                  )}
                </div>

                <aside className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-dawn-200/40">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-4">Details</p>
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="block text-stone-400 text-xs mb-1">Venue</span>
                      <span className="font-medium text-stone-700">{publication.venue}</span>
                    </div>
                    {publication.citation && (
                      <div>
                        <span className="block text-stone-400 text-xs mb-1">Citation</span>
                        <span className="font-medium text-stone-600 text-xs">
                          {publication.citation}
                        </span>
                      </div>
                    )}
                  </div>

                  {publication.link && (
                    <a
                      href={publication.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-dawn-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-dawn-700 shadow-md"
                    >
                      Read Paper
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </aside>
              </div>
            </motion.article>
          ))}
        </div>

        {relatedPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href={`/blog/${relatedPost.slug}`}
              className="group mt-6 flex items-center gap-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-dawn-200/40 p-5 transition-all duration-300 hover:bg-white/80 hover:border-dawn-300/60 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dawn-100 text-dawn-700">
                <PenLine className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  The story behind this research
                </p>
                <p className="truncate text-sm font-medium text-stone-800">{relatedPost.title}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-dawn-600 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};
