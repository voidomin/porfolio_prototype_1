"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Instagram, Heart } from "lucide-react";
import { socialLinks } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Portfolio
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex justify-center space-x-6">
              {socialLinks.map((link) => {
                const IconComponent =
                  iconMap[link.icon as keyof typeof iconMap];
                if (!IconComponent) return null;

                return (
                  <motion.a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "p-3 rounded-full transition-colors",
                      "bg-gray-200 dark:bg-gray-800",
                      "hover:bg-primary-500 hover:text-white",
                      "dark:hover:bg-primary-500"
                    )}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Copyright */}
          <motion.div
            variants={itemVariants}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center justify-center space-x-1">
              <span>© {currentYear} Portfolio. Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </motion.div>
              <span>and lots of coffee.</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};
