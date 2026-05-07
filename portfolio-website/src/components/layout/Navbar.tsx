"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navigationItems, personalProfile } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/useIntersectionObserver";

/* ──────────────────────────────────────────────────────────
   Navbar – transparent at top, gains frosted glass on scroll.
   Nature-inspired hover effects. No dark mode toggle.
   ────────────────────────────────────────────────────────── */

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollDirection, scrollY } = useScrollDirection();

  const shouldHideNav = scrollDirection === "down" && scrollY > 100;
  const hasScrolled = scrollY > 50;

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        animate={{
          y: shouldHideNav ? -100 : 0,
          opacity: shouldHideNav ? 0.8 : 1,
        }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500",
          hasScrolled
            ? "bg-night-950/60 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("#home");
            }}
            className="relative cursor-pointer"
            whileHover={{ scale: 1.03 }}
          >
            <span
              className={cn(
                "text-xl font-semibold tracking-wide transition-colors duration-300",
                hasScrolled ? "text-white/90" : "text-forest-950"
              )}
            >
              {personalProfile.name}
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 + 0.3, duration: 0.3 }}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.href);
                }}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                  hasScrolled
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-forest-950/80 hover:text-forest-950 hover:bg-forest-950/10"
                )}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden p-2 rounded-full transition-all duration-300",
              hasScrolled
                ? "hover:bg-white/10 text-white/80"
                : "hover:bg-forest-950/10 text-forest-950"
            )}
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
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-full w-80 max-w-[80vw] z-50 bg-night-950/95 backdrop-blur-xl border-l border-white/10 md:hidden"
            >
              <div className="p-6 pt-20">
                <div className="space-y-2">
                  {navigationItems.map((item, i) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.08 + 0.15, duration: 0.3 }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.href);
                      }}
                      className="block text-lg font-medium py-3 px-4 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all"
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
