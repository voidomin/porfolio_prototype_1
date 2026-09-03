"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/portfolio";

/* ──────────────────────────────────────────────────────────
   TestimonialsSection – between the Clearing (Publications)
   and Golden Hour (Photography) chapters. Renders nothing
   until real quotes are added to `testimonials` in
   src/data/portfolio.ts — no placeholder content is shown.
   ────────────────────────────────────────────────────────── */

export const TestimonialsSection = () => {
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="relative py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            Kind <span className="text-dawn-600">Words</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="parchment rounded-3xl p-8 shadow-lg border border-dawn-200/50"
            >
              <Quote className="h-6 w-6 text-dawn-500/60 mb-4" />
              <p className="text-stone-700 leading-relaxed italic mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold text-stone-900">{testimonial.name}</p>
                <p className="text-sm text-stone-500">
                  {testimonial.role}
                  {testimonial.company ? ` · ${testimonial.company}` : ""}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
