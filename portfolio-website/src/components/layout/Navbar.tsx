"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon } from "lucide-react";
import { navigationItems } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/useIntersectionObserver";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { scrollDirection, scrollY } = useScrollDirection();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navVariants = {
    visible: {
      y: 0,
      opacity: 1,
      backdropFilter: scrollY > 100 ? "blur(20px)" : "blur(0px)",
      backgroundColor:
        scrollY > 100 ? "rgba(255, 255, 255, 0.1)" : "transparent",
      transition: { duration: 0.3 },
    },
    hidden: {
      y: -100,
      opacity: 0.8,
      transition: { duration: 0.3 },
    },
  };

  const logoVariants = {
    initial: { scale: 0, rotation: -180 },
    animate: {
      scale: 1,
      rotation: 0,
      transition: { duration: 0.6, ease: "backOut" },
    },
    hover: {
      scale: 1.05,
      rotate: 2,
      filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))",
      transition: { duration: 0.3 },
    },
  };

  const linkVariants = {
    initial: { y: -30, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.1 + 0.3, duration: 0.3 },
    }),
    hover: {
      y: -2,
      transition: { duration: 0.2 },
    },
  };

  const mobileMenuVariants = {
    closed: {
      x: "100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    open: {
      x: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const mobileItemVariants = {
    closed: { x: 50, opacity: 0 },
    open: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1 + 0.2, duration: 0.3 },
    }),
  };

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const shouldHideNav = scrollDirection === "down" && scrollY > 100;

  return (
    <>
      <motion.nav
        variants={navVariants}
        animate={shouldHideNav ? "hidden" : "visible"}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-6 py-4",
          "border-b border-white/10 dark:border-white/10"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div
            variants={logoVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="relative cursor-pointer"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              Portfolio
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                variants={linkVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                custom={i}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className={cn(
                  "relative text-sm font-medium transition-colors",
                  "hover:text-primary-500 dark:hover:text-primary-400",
                  "after:absolute after:bottom-0 after:left-0 after:h-0.5",
                  "after:w-0 after:bg-gradient-to-r after:from-primary-500 after:to-accent-500",
                  "after:transition-all after:duration-300 hover:after:w-full"
                )}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  "hover:bg-primary-500/10 dark:hover:bg-primary-400/10"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {theme === "dark" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 180, scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -180, scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full hover:bg-primary-500/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: 90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: -90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={cn(
                "fixed top-0 right-0 h-full w-80 max-w-[80vw] z-50",
                "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
                "border-l border-gray-200/20 dark:border-gray-700/20",
                "md:hidden"
              )}
            >
              <div className="p-6 pt-20">
                <div className="space-y-6">
                  {navigationItems.map((item, i) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      variants={mobileItemVariants}
                      custom={i}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.href);
                      }}
                      className={cn(
                        "block text-lg font-medium py-3 px-4 rounded-lg",
                        "hover:bg-primary-500/10 dark:hover:bg-primary-400/10",
                        "transition-colors border-b border-gray-200/10 dark:border-gray-700/10"
                      )}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
