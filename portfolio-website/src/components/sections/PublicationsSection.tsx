"use client";

import { motion } from "framer-motion";
import { ExternalLink, Calendar, Users, BookOpen, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
  url?: string;
  abstract: string;
  type: "journal" | "conference" | "book" | "preprint";
  featured: boolean;
}

const publications: Publication[] = [
  {
    id: "1",
    title:
      "Modern Web Development Patterns: A Comprehensive Analysis of React and Next.js Performance",
    authors: ["John Doe", "Jane Smith", "Robert Johnson"],
    journal: "Journal of Web Technologies",
    year: 2024,
    volume: "15",
    pages: "123-145",
    doi: "10.1000/jwt.2024.001",
    url: "https://example.com/publication1",
    abstract:
      "This paper presents a comprehensive analysis of modern web development patterns, focusing on React and Next.js performance optimizations. We examine various rendering strategies and their impact on user experience.",
    type: "journal",
    featured: true,
  },
  {
    id: "2",
    title:
      "Accessibility in Modern Web Applications: Best Practices and Implementation Strategies",
    authors: ["John Doe", "Sarah Wilson"],
    journal: "International Conference on Web Accessibility",
    year: 2023,
    pages: "45-52",
    doi: "10.1109/ICWA.2023.001",
    url: "https://example.com/publication2",
    abstract:
      "We present a comprehensive guide to implementing accessibility features in modern web applications, with practical examples and testing strategies.",
    type: "conference",
    featured: true,
  },
  {
    id: "3",
    title: "TypeScript Design Patterns for Scalable Applications",
    authors: ["John Doe"],
    journal: "Tech Publishing House",
    year: 2023,
    doi: "10.1234/book.2023.ts",
    url: "https://example.com/book",
    abstract:
      "A comprehensive guide to TypeScript design patterns that help developers build maintainable and scalable applications.",
    type: "book",
    featured: false,
  },
  {
    id: "4",
    title: "Performance Optimization Techniques in Single Page Applications",
    authors: ["John Doe", "Michael Brown", "Lisa Davis"],
    journal: "arXiv preprint",
    year: 2023,
    doi: "arXiv:2023.001",
    url: "https://arxiv.org/abs/2023.001",
    abstract:
      "This preprint explores various performance optimization techniques for single page applications, including code splitting, lazy loading, and caching strategies.",
    type: "preprint",
    featured: false,
  },
];

const publicationTypes = {
  journal: { icon: BookOpen, label: "Journal Article", color: "text-blue-500" },
  conference: {
    icon: Users,
    label: "Conference Paper",
    color: "text-green-500",
  },
  book: { icon: Award, label: "Book", color: "text-purple-500" },
  preprint: { icon: Calendar, label: "Preprint", color: "text-orange-500" },
};

const PublicationCard = ({
  publication,
  index,
}: {
  publication: Publication;
  index: number;
}) => {
  const TypeIcon = publicationTypes[publication.type].icon;

  const formatCitation = (pub: Publication) => {
    const authors = pub.authors.join(", ");
    const year = pub.year;
    const title = pub.title;
    const journal = pub.journal;

    if (pub.type === "book") {
      return `${authors} (${year}). ${title}. ${journal}.`;
    } else if (pub.type === "conference") {
      return `${authors} (${year}). ${title}. In ${journal}${
        pub.pages ? `, pp. ${pub.pages}` : ""
      }.`;
    } else {
      return `${authors} (${year}). ${title}. ${journal}${
        pub.volume ? `, ${pub.volume}` : ""
      }${pub.pages ? `, ${pub.pages}` : ""}.`;
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300",
        publication.featured && "ring-2 ring-primary-500/20"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "p-2 rounded-lg bg-gray-100 dark:bg-gray-700",
              publicationTypes[publication.type].color
            )}
          >
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <span
              className={cn(
                "text-sm font-medium",
                publicationTypes[publication.type].color
              )}
            >
              {publicationTypes[publication.type].label}
            </span>
            {publication.featured && (
              <span className="ml-2 px-2 py-1 text-xs bg-primary-500 text-white rounded-full">
                Featured
              </span>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {publication.year}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
        {publication.title}
      </h3>

      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-mono leading-relaxed">
        {formatCitation(publication)}
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
        {publication.abstract}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          {publication.doi && (
            <span className="font-mono">DOI: {publication.doi}</span>
          )}
        </div>
        {publication.url && (
          <motion.a
            href={publication.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-primary-500 hover:text-primary-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm font-medium">Read More</span>
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        )}
      </div>
    </motion.article>
  );
};

export const PublicationsSection = () => {
  const featuredPublications = publications.filter((pub) => pub.featured);
  const otherPublications = publications.filter((pub) => !pub.featured);

  const stats = [
    { label: "Total Publications", value: publications.length },
    {
      label: "Journal Articles",
      value: publications.filter((p) => p.type === "journal").length,
    },
    {
      label: "Conference Papers",
      value: publications.filter((p) => p.type === "conference").length,
    },
    {
      label: "Books",
      value: publications.filter((p) => p.type === "book").length,
    },
  ];

  return (
    <section id="publications" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Publications & <span className="text-primary-500">Research</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of my published works, research papers, and
            contributions to the development community and academic literature.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
            >
              <div className="text-2xl font-bold text-primary-500 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Publications */}
        {featuredPublications.length > 0 && (
          <div className="mb-16">
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-8"
            >
              Featured Publications
            </motion.h3>
            <div className="space-y-6">
              {featuredPublications.map((publication, index) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Publications */}
        {otherPublications.length > 0 && (
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-8"
            >
              Other Publications
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherPublications.map((publication, index) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  index={index + featuredPublications.length}
                />
              ))}
            </div>
          </div>
        )}

        {/* Citation Note */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            <strong>Citation Format:</strong> All citations follow the standard
            academic format. For BibTeX or other citation formats, please click
            on the individual publication links.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
