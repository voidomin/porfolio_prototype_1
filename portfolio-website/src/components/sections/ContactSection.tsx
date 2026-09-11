"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin,
  Copy,
  Check,
} from "lucide-react";
import { socialLinks, contactInfo } from "@/data/portfolio";
import { ContactFormData } from "@/types";
import { cn } from "@/lib/utils";
import { glowBloomReveal } from "@/lib/revealVariants";
import { ChapterMarker } from "@/components/ui/ChapterMarker";

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

// Interactive rising campfire embers on input hover & focus
const InputEmberEmitter = ({ active }: { active: boolean }) => {
  const [embers, setEmbers] = useState<
    {
      id: number;
      left: number;
      size: number;
      delay: number;
      duration: number;
      distanceY: number;
      driftX: number;
    }[]
  >([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(globalThis.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!active) {
      setEmbers([]);
      return;
    }
    // Generate 12 lively embers (3 on mobile for performance)
    const count = isMobile ? 3 : 12;
    const list = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      size: 1.5 + Math.random() * 2.5,
      delay: Math.random() * 1.2,
      duration: 1.2 + Math.random() * 1.5,
      distanceY: -40 - Math.random() * 50,
      driftX: -20 + Math.random() * 40,
    }));
    setEmbers(list);
  }, [active, isMobile]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {embers.map((ember) => (
        <motion.div
          key={ember.id}
          className="absolute rounded-full bg-orange-400"
          style={{
            left: `${ember.left}%`,
            bottom: "0px",
            width: ember.size,
            height: ember.size,
            boxShadow: isMobile
              ? `0 0 ${ember.size * 1.5}px rgba(249,115,22,0.6)`
              : `0 0 ${ember.size * 3}px ${ember.size}px rgba(249,115,22,0.8)`,
          }}
          initial={{ opacity: 0, y: 0, x: 0 }}
          animate={{
            opacity: [0, 1, 0.7, 0],
            y: [0, ember.distanceY],
            x: [0, ember.driftX],
          }}
          transition={{
            duration: ember.duration,
            delay: ember.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

interface FormInputProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}

const FormInput = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}: FormInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group">
      <label htmlFor={id} className="block text-sm font-medium text-white/75 mb-2 select-none">
        {label} {required && "*"}
      </label>
      <div
        className="relative rounded-xl overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-4 py-3 bg-white/8 border border-white/15 rounded-xl text-white placeholder:text-white/40 focus:border-dawn-400/50 focus:bg-white/12 focus:outline-none transition-all relative z-10"
          placeholder={placeholder}
          required={required}
        />
        {/* Campfire embers trail overlay */}
        <InputEmberEmitter active={isFocused || isHovered} />
      </div>
    </div>
  );
};

interface FormTextareaProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  rows?: number;
}

const MAX_MESSAGE_CHARS = 1000;

const FormTextarea = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 5,
}: FormTextareaProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const remaining = MAX_MESSAGE_CHARS - value.length;
  const isNearLimit = remaining <= 100;

  return (
    <div className="relative group">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="block text-sm font-medium text-white/75 select-none">
          {label} {required && "*"}
        </label>
        <span
          className={cn(
            "text-xs font-mono tabular-nums transition-colors duration-300",
            isNearLimit ? (remaining <= 0 ? "text-red-400" : "text-dawn-400") : "text-white/30"
          )}
        >
          {value.length}/{MAX_MESSAGE_CHARS}
        </span>
      </div>
      <div
        className="relative rounded-xl overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={MAX_MESSAGE_CHARS}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:border-dawn-400/50 focus:bg-white/10 focus:outline-none resize-none transition-all relative z-10"
          placeholder={placeholder}
          required={required}
        />
        {/* Campfire embers trail overlay */}
        <InputEmberEmitter active={isFocused || isHovered} />
      </div>
    </div>
  );
};

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
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — the mailto link next to it still works.
    }
  };
  const [fireflies, setFireflies] = useState<
    { id: number; x: number; y: number; delay: number; duration: number; size: number }[]
  >([]);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mobile = globalThis.innerWidth < 768;
    setIsMobile(mobile);
    setFireflies(generateFireflies(mobile ? 4 : 15));
    setMounted(true);
  }, []);

  const handleCampfireStoke = () => {
    const campfireEl = document.getElementById("campfire-vector");
    let px = globalThis.innerWidth / 2;
    let py = globalThis.innerHeight * 0.8;

    if (campfireEl) {
      const rect = campfireEl.getBoundingClientRect();
      px = rect.left + rect.width / 2;
      py = rect.top + rect.height / 2;
    }

    // 1. Dispatch custom event to spark rising campfire embers from this exact position
    globalThis.dispatchEvent(
      new CustomEvent("nature-campfire-stoke", {
        detail: { x: px, y: py },
      })
    );

    // 2. Dispatch event to trigger synthesized crackle sounds
    globalThis.dispatchEvent(new CustomEvent("nature-campfire-crackle"));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data: { error?: string } = {};
      try {
        data = await res.json();
      } catch {
        // Non-JSON response (e.g. an upstream proxy/CDN failure page) —
        // fall through to the generic message below instead of surfacing
        // a raw parse error to the user.
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to send message.");
      }

      setFormData({ name: "", email: "", subject: "", message: "" });
      setFormState({
        status: "success",
        message: "Thanks for reaching out. I will get back to you soon.",
      });
      setTimeout(() => setFormState({ status: "idle", message: "" }), 3000);
    } catch (err) {
      setFormState({
        status: "error",
        message:
          err instanceof Error ? err.message : "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(252, 232, 230, 0.2) 0%, rgba(245, 179, 175, 0.25) 15%, rgba(224, 93, 87, 0.3) 35%, rgba(118, 43, 42, 0.35) 60%, rgba(64, 19, 18, 0.45) 80%, rgba(26, 10, 9, 0.5) 100%)",
      }}
    >
      {/* Firefly particles */}
      {mounted && !prefersReducedMotion && (
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
                boxShadow: isMobile
                  ? `0 0 ${ff.size * 2}px rgba(240,180,41,0.3)`
                  : `0 0 ${ff.size * 3}px ${ff.size}px rgba(240,180,41,0.4)`,
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
        {/* Section header — warm ember glow blooms in as the fire settles */}
        <motion.div
          className="relative text-center mb-16"
          variants={glowBloomReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div
            aria-hidden
            className="absolute inset-x-0 -top-10 h-40 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(240,84,30,0.2),transparent_65%)]"
          />
          <ChapterMarker color="#fbdf85" className="relative z-10" />
          <p className="relative z-10 text-dusk-200/70 text-sm tracking-[0.3em] uppercase mb-4">
            Chapter Seven
          </p>
          <h2 className="relative z-10 text-4xl md:text-5xl font-bold text-white mb-4">
            Campfire at <span className="text-dawn-300">Dusk</span>
          </h2>
          <p className="relative z-10 text-dusk-100/70 max-w-xl mx-auto">
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
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>

              <div className="space-y-5">
                <motion.div
                  className="flex items-center gap-4"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-11 h-11 bg-dawn-500/80 rounded-full flex items-center justify-center shadow-lg shadow-dawn-500/20">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <h4 className="font-semibold text-white text-sm">Email</h4>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-dusk-200/60 hover:text-dawn-300 transition-colors text-sm"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-1.5 rounded-full text-dusk-200/50 hover:text-dawn-300 hover:bg-white/5 transition-colors"
                      title="Copy email address"
                      aria-label="Copy email address"
                    >
                      {emailCopied ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
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
                    <h4 className="font-semibold text-white text-sm">Location</h4>
                    <p className="text-dusk-200/60 text-sm">{contactInfo.location}</p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="glass-nature rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Profiles</h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = socialIcons[social.icon as keyof typeof socialIcons];
                  if (!IconComponent) return null;

                  return (
                    <motion.a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      title={social.platform}
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

            {/* Interactive Campfire */}
            <div className="glass-nature rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden group select-none">
              <h3 className="text-xl font-bold text-white mb-3">Interactive Campfire 🔥</h3>
              <p className="text-xs text-white/50 mb-6 max-w-xs leading-relaxed">
                Stoke the digital campfire! Click the logs below to spark high-energy rising embers
                and hear synthesized wood snaps.
              </p>

              {/* Animated Campfire Vector */}
              <motion.div
                id="campfire-vector"
                onClick={handleCampfireStoke}
                className="cursor-pointer relative flex items-center justify-center w-36 h-36 bg-black/25 border border-white/5 hover:border-dawn-500/20 rounded-full shadow-inner transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Click logs to stoke the fire!"
              >
                {/* Licking Flame Animations (using SVG paths and subtle scaling loops) */}
                <svg
                  className="w-20 h-20"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer glow */}
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="url(#fireGlow)"
                    opacity="0.3"
                    className="animate-pulse"
                  />

                  {/* Flame Back */}
                  <motion.path
                    d="M50 15C50 15 35 40 35 55C35 67 43 75 50 75C57 75 65 67 65 55C65 40 50 15 50 15Z"
                    fill="#f0541e"
                    opacity="0.85"
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : isMobile
                          ? { scaleY: [0.95, 1.05, 0.95], opacity: [0.75, 0.9, 0.75] }
                          : {
                              scaleY: [1, 1.15, 0.95, 1.08, 1],
                              skewX: [0, -3, 3, -1, 0],
                              y: [0, -2, 1, -1, 0],
                            }
                    }
                    transition={{
                      duration: isMobile ? 1.5 : 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ originX: "50px", originY: "75px" }}
                  />

                  {/* Flame Middle */}
                  <motion.path
                    d="M50 25C50 25 38 43 38 58C38 68 45 75 50 75C55 75 62 68 62 58C62 43 50 25 50 25Z"
                    fill="#ff9800"
                    opacity="0.95"
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : isMobile
                          ? { scaleY: [0.96, 1.04, 0.96], opacity: [0.85, 0.98, 0.85] }
                          : {
                              scaleY: [1, 0.92, 1.12, 0.97, 1],
                              skewX: [0, 4, -4, 2, 0],
                              y: [0, 1, -2, 1, 0],
                            }
                    }
                    transition={{
                      duration: isMobile ? 1.2 : 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ originX: "50px", originY: "75px" }}
                  />

                  {/* Flame Core */}
                  <motion.path
                    d="M50 38C50 38 42 50 42 62C42 69 46 75 50 75C54 75 58 69 58 62C58 50 50 38 50 38Z"
                    fill="#ffeb3b"
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : isMobile
                          ? { scaleY: [0.97, 1.03, 0.97] }
                          : {
                              scaleY: [1, 1.1, 0.9, 1.05, 1],
                              skewX: [0, -2, 2, 0, 0],
                            }
                    }
                    transition={{
                      duration: isMobile ? 1.0 : 1.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{ originX: "50px", originY: "75px" }}
                  />

                  {/* Cross-positioned Campfire Logs */}
                  {/* Log Left */}
                  <line
                    x1="25"
                    y1="78"
                    x2="75"
                    y2="68"
                    stroke="#4a2711"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Log Right */}
                  <line
                    x1="75"
                    y1="78"
                    x2="25"
                    y2="68"
                    stroke="#3d1f0c"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Glowing Log Core embers */}
                  <circle cx="50" cy="73" r="4" fill="#f0541e" className="animate-ping" />

                  {/* SVG Gradient definitions */}
                  <defs>
                    <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f0541e" />
                      <stop offset="100%" stopColor="#f0541e" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>
              </motion.div>
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
            <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Name"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                />
                <FormInput
                  label="Email"
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <FormInput
                label="Subject"
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="What would you like to discuss?"
              />

              <FormTextarea
                label="Message"
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Share your thoughts..."
                required
              />

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
                  <span className="text-sm" role="alert">
                    {formState.message}
                  </span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={formState.status === "loading"}
                className={cn(
                  "w-full px-8 py-4 font-semibold rounded-full transition-all duration-300",
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
