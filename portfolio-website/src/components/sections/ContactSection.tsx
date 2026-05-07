"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin,
} from "lucide-react";
import { socialLinks, contactInfo } from "@/data/portfolio";
import { ContactFormData } from "@/types";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────
   ContactSection – "Chapter 7: Campfire at Dusk"
   Dusk gradient, firefly particles, warm campfire tones.
   Form styled with organic, warm aesthetics.
   ────────────────────────────────────────────────────────── */

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
};

interface FormState {
  status: "idle" | "loading" | "success" | "error";
  message: string;
}

// Firefly particles
function generateFireflies(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: 20 + Math.random() * 60,
    delay: Math.random() * 6,
    duration: 4 + Math.random() * 4,
    size: 2 + Math.random() * 3,
  }));
}

export const ContactSection = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formState, setFormState] = useState<FormState>({
    status: "idle",
    message: "",
  });
  const [fireflies] = useState(() => generateFireflies(15));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setFormState({
        status: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormState({
        status: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setFormState({ status: "loading", message: "" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setFormState({
        status: "success",
        message: "Thanks for reaching out. I will get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFormState({
        status: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #fce8e6 0%, #f5b3af 15%, #e05d57 35%, #762b2a 60%, #401312 80%, #1a0a09 100%)",
      }}
    >
      {/* Firefly particles */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {fireflies.map((ff) => (
            <motion.div
              key={ff.id}
              className="absolute rounded-full"
              style={{
                left: `${ff.x}%`,
                top: `${ff.y}%`,
                width: ff.size,
                height: ff.size,
                background: "#f0b429",
                boxShadow: `0 0 ${ff.size * 3}px ${ff.size}px rgba(240,180,41,0.4)`,
              }}
              animate={{
                x: [0, 20 - Math.random() * 40, 0],
                y: [0, -30 - Math.random() * 20, 0],
                opacity: [0, 0.8, 0.4, 0.9, 0],
              }}
              transition={{
                duration: ff.duration,
                delay: ff.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-dusk-300/50 text-sm tracking-[0.3em] uppercase mb-4">
            Chapter Seven
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Campfire at{" "}
            <span className="text-dawn-300">Dusk</span>
          </h2>
          <p className="text-dusk-200/50 max-w-xl mx-auto">
            Open to roles, collaborations, and thoughtful product work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="glass-nature rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">
                Contact Information
              </h3>

              <div className="space-y-5">
                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-11 h-11 bg-dawn-500/80 rounded-full flex items-center justify-center shadow-lg shadow-dawn-500/20">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Email</h4>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-dusk-200/60 hover:text-dawn-300 transition-colors text-sm"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-11 h-11 bg-dusk-500/80 rounded-full flex items-center justify-center shadow-lg shadow-dusk-500/20">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      Location
                    </h4>
                    <p className="text-dusk-200/60 text-sm">
                      {contactInfo.location}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="glass-nature rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Profiles</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const IconComponent =
                    socialIcons[social.icon as keyof typeof socialIcons];
                  if (!IconComponent) return null;

                  return (
                    <motion.a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 bg-white/10 border border-white/15 rounded-full flex items-center justify-center text-white/70 hover:bg-dawn-500/80 hover:text-white hover:border-dawn-500/50 transition-all duration-300"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-nature rounded-3xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-6">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:border-dawn-400/50 focus:bg-white/12 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:border-dawn-400/50 focus:bg-white/12 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:border-dawn-400/50 focus:bg-white/12 transition-all"
                  placeholder="What would you like to discuss?"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-white/70 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:border-dawn-400/50 focus:bg-white/12 resize-none transition-all"
                  placeholder="Share your thoughts..."
                />
              </div>

              {formState.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-center gap-2 p-4 rounded-xl",
                    formState.status === "success"
                      ? "bg-forest-500/20 text-forest-200"
                      : "bg-dusk-500/20 text-dusk-200"
                  )}
                >
                  {formState.status === "success" ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm">{formState.message}</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={formState.status === "loading"}
                className={cn(
                  "w-full px-8 py-4 font-semibold rounded-xl transition-all duration-300",
                  "bg-gradient-to-r from-dawn-500 to-dawn-600 text-white",
                  "hover:from-dawn-400 hover:to-dawn-500",
                  "shadow-lg shadow-dawn-500/20",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center justify-center gap-2"
                )}
                whileHover={{
                  scale: formState.status === "loading" ? 1 : 1.01,
                  y: formState.status === "loading" ? 0 : -1,
                }}
                whileTap={{ scale: formState.status === "loading" ? 1 : 0.99 }}
              >
                {formState.status === "loading" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
