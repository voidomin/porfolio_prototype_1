"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUp, Mail, Github, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

interface FABAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  color?: string;
}

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const openGithub = () => {
    window.open("https://github.com", "_blank");
    setIsOpen(false);
  };

  const openLinkedIn = () => {
    window.open("https://linkedin.com", "_blank");
    setIsOpen(false);
  };

  const actions: FABAction[] = [
    {
      id: "top",
      label: "Back to Top",
      icon: <ArrowUp className="w-5 h-5" />,
      action: scrollToTop,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "contact",
      label: "Contact Me",
      icon: <Mail className="w-5 h-5" />,
      action: scrollToContact,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "github",
      label: "GitHub",
      icon: <Github className="w-5 h-5" />,
      action: openGithub,
      color: "bg-gray-800 hover:bg-gray-900",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      action: openLinkedIn,
      color: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      y: 20,
      opacity: 0,
      scale: 0.3,
      transition: {
        duration: 0.2,
      },
    },
  };

  const mainButtonVariants = {
    open: {
      rotate: 45,
      scale: 1.1,
    },
    closed: {
      rotate: 0,
      scale: 1,
    },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        variants={containerVariants}
        animate={isOpen ? "open" : "closed"}
        className="flex flex-col-reverse items-end space-y-reverse space-y-3"
      >
        {/* Action Buttons */}
        <AnimatePresence>
          {isOpen && (
            <>
              {actions.map((action, index) => (
                <motion.div
                  key={action.id}
                  variants={itemVariants}
                  className="flex items-center space-x-3"
                >
                  {/* Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg"
                  >
                    {action.label}
                  </motion.div>

                  {/* Action Button */}
                  <motion.button
                    onClick={action.action}
                    className={cn(
                      "w-12 h-12 rounded-full text-white shadow-lg",
                      "flex items-center justify-center",
                      "transition-colors duration-200",
                      action.color || "bg-primary-500 hover:bg-primary-600"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {action.icon}
                  </motion.button>
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500",
            "text-white rounded-full shadow-lg",
            "flex items-center justify-center",
            "hover:shadow-xl transition-shadow duration-300"
          )}
          variants={mainButtonVariants}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isOpen ? "open" : "closed"}
        >
          <Plus className="w-6 h-6" />
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
