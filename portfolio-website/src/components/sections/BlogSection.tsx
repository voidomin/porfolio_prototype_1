"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Tag, ArrowRight, Filter } from "lucide-react";
import { blogPosts } from "@/data/portfolio";
import { BlogPost, type BlogCategory } from "@/types";
import { cn } from "@/lib/utils";

const categories: { value: BlogCategory | "all"; label: string }[] = [
  { value: "all", label: "All Posts" },
  { value: "tech", label: "Technology" },
  { value: "design", label: "Design" },
  { value: "tutorial", label: "Tutorials" },
  { value: "personal", label: "Personal" },
];

const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
    >
      {/* Blog Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          src={post.image}
          alt={post.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 group-hover:scale-110",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-primary-500 animate-pulse" />
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-primary-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
          {post.category}
        </div>

        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-accent-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
            Featured
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Blog Content */}
      <div className="p-6">
        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{post.readingTime} min read</span>
            </div>
          </div>
          <span className="text-primary-500 font-medium">{post.author}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors leading-tight">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Read More Link */}
        <motion.div
          className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700"
          whileHover={{ x: 5 }}
        >
          <span className="text-primary-500 font-medium text-sm group-hover:text-primary-600 transition-colors">
            Read Full Article
          </span>
          <ArrowRight className="w-4 h-4 text-primary-500 group-hover:text-primary-600 transition-colors" />
        </motion.div>
      </div>
    </motion.article>
  );
};

export const BlogSection = () => {
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "all">(
    "all"
  );
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  const handleCategoryChange = (category: BlogCategory | "all") => {
    setActiveCategory(category);
    if (category === "all") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter((post) => post.category === category));
    }
  };

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <section id="blog" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest <span className="text-primary-500">Blog Posts</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights from my development journey and
            creative process
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.value}
              onClick={() => handleCategoryChange(category.value)}
              className={cn(
                "px-6 py-3 rounded-full font-medium transition-all duration-300",
                "border-2 border-transparent",
                activeCategory === category.value
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-500/50"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>{category.label}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <div className="mb-16">
                <motion.h3
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-8"
                >
                  Featured Posts
                </motion.h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredPosts.map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <div>
                {featuredPosts.length > 0 && (
                  <motion.h3
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-8"
                  >
                    Recent Posts
                  </motion.h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post, index) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      index={index + featuredPosts.length}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* No Posts Message */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 dark:text-gray-400">
              No blog posts found in this category.
            </p>
          </motion.div>
        )}

        {/* Blog Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-500">
              {blogPosts.length}+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Articles
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-500">
              {blogPosts.reduce((acc, post) => acc + post.readingTime, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Minutes of Content
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-500">
              {new Set(blogPosts.flatMap((post) => post.tags)).size}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Unique Topics
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary-500">
              {blogPosts.filter((post) => post.featured).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Featured Posts
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
