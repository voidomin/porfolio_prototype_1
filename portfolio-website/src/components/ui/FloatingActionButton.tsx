"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowUp, Mail, Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import { socialLinks } from "@/data/portfolio";

/* ──────────────────────────────────────────────────────────
   FloatingActionButton – Compass rose themed.
   Nature-inspired action items with organic animations.
   ────────────────────────────────────────────────────────── */

interface FABAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      setVisible(window.scrollY > window.innerHeight * 0.3);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const openGithub = () => {
    const github = socialLinks.find((item) => item.icon === "github");
    if (github) window.open(github.url, "_blank");
    setIsOpen(false);
  };

  const openLinkedIn = () => {
    const linkedin = socialLinks.find((item) => item.icon === "linkedin");
    if (linkedin) window.open(linkedin.url, "_blank");
    setIsOpen(false);
  };

  const actions: FABAction[] = [
    {
      id: "top",
      label: "Back to Dawn",
      icon: <ArrowUp className="w-5 h-5" />,
      action: scrollToTop,
      color: "bg-forest-600 hover:bg-forest-500",
    },
    {
      id: "contact",
      label: "Send Message",
      icon: <Mail className="w-5 h-5" />,
      action: scrollToContact,
      color: "bg-dawn-500 hover:bg-dawn-400",
    },
    {
      id: "github",
      label: "GitHub",
      icon: <Github className="w-5 h-5" />,
      action: openGithub,
      color: "bg-night-800 hover:bg-night-700",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      action: openLinkedIn,
      color: "bg-river-600 hover:bg-river-500",
    },
  ];

  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.7, y: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <motion.div
        animate={isOpen ? "open" : "closed"}
        className="flex flex-col-reverse items-end gap-3"
      >
        {/* Action buttons */}
        <AnimatePresence>
          {isOpen &&
            actions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ y: 20, opacity: 0, scale: 0.3 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                    delay: index * 0.08,
                  },
                }}
                exit={{
                  y: 20,
                  opacity: 0,
                  scale: 0.3,
                  transition: { duration: 0.15 },
                }}
                className="flex items-center gap-3"
              >
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-night-950/90 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg backdrop-blur-sm"
                >
                  {action.label}
                </motion.span>

                <motion.button
                  onClick={action.action}
                  className={cn(
                    "w-11 h-11 rounded-full text-white shadow-lg",
                    "flex items-center justify-center transition-colors duration-200",
                    action.color
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {action.icon}
                </motion.button>
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Main compass button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full shadow-xl",
            "bg-gradient-to-br from-forest-600 to-forest-800",
            "text-white flex items-center justify-center",
            "hover:shadow-2xl hover:shadow-forest-500/20 transition-shadow duration-300"
          )}
          animate={{ rotate: isOpen ? 135 : 0, scale: isOpen ? 1.05 : 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Compass className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] -z-10"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
