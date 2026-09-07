"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Command } from "lucide-react";
import { navigationItems, projects, blogPosts } from "@/data/portfolio";

/* ──────────────────────────────────────────────────────────
   CommandPalette – Cmd/Ctrl+K quick-jump. Mounted once in the
   root layout so it works on every route, including the
   sub-pages (blog posts, project case studies, photography)
   that otherwise have no persistent navigation of their own.
   ────────────────────────────────────────────────────────── */

interface PaletteItem {
  id: string;
  label: string;
  sublabel?: string;
  group: "Sections" | "Projects" | "Writing" | "Pages";
  action: () => void;
}

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const goToSection = useCallback(
    (id: string) => {
      if (pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/#${id}`);
      }
    },
    [pathname, router]
  );

  const items = useMemo<PaletteItem[]>(() => {
    const sectionItems: PaletteItem[] = navigationItems
      .filter((nav) => nav.href.startsWith("#"))
      .map((nav) => ({
        id: `section-${nav.href}`,
        label: nav.label,
        group: "Sections",
        action: () => goToSection(nav.href.slice(1)),
      }));

    const pageItems: PaletteItem[] = [
      {
        id: "page-overview",
        label: "Quick Overview",
        sublabel: "Printable one-page summary",
        group: "Pages",
        action: () => router.push("/overview"),
      },
    ];

    const projectItems: PaletteItem[] = projects.map((p) => ({
      id: `project-${p.slug}`,
      label: p.title,
      sublabel: p.description,
      group: "Projects",
      action: () => router.push(`/projects/${p.slug}`),
    }));

    const writingItems: PaletteItem[] = blogPosts.map((post) => ({
      id: `post-${post.slug}`,
      label: post.title,
      sublabel: post.excerpt,
      group: "Writing",
      action: () => router.push(`/blog/${post.slug}`),
    }));

    return [...sectionItems, ...pageItems, ...projectItems, ...writingItems];
  }, [goToSection, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) => item.label.toLowerCase().includes(q) || item.sublabel?.toLowerCase().includes(q)
    );
  }, [items, query]);

  const groupedFiltered = useMemo(() => {
    const groups: Record<string, PaletteItem[]> = {};
    filtered.forEach((item) => {
      groups[item.group] = groups[item.group] ?? [];
      groups[item.group].push(item);
    });
    return groups;
  }, [filtered]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const runItem = useCallback(
    (item: PaletteItem) => {
      item.action();
      close();
    },
    [close]
  );

  // Global Cmd/Ctrl+K toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Wait for the entrance animation frame so the input is mounted and focusable
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) runItem(item);
    }
  };

  let runningIndex = -1;

  return (
    <>
      {/* Discoverability hint — small, unobtrusive, desktop-only */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden md:flex print:hidden fixed bottom-6 left-6 z-[90] items-center gap-2 px-3 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/60 hover:text-white/90 hover:bg-black/30 transition-colors text-xs"
        aria-label="Open quick navigation (Cmd+K)"
        title="Quick navigation"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="flex items-center gap-1">
          <Command className="w-3 h-3" />K
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[10010] flex items-start justify-center pt-[12vh] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Quick navigation"
              className="relative w-full max-w-xl bg-forest-950/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                <Search className="w-4 h-4 text-white/40 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Jump to a section, project, or post..."
                  className="flex-1 bg-transparent text-white placeholder:text-white/30 focus:outline-none text-sm"
                />
                <kbd className="hidden sm:inline text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">
                  Esc
                </kbd>
              </div>

              <div className="max-h-[50vh] overflow-y-auto py-2">
                {filtered.length === 0 && (
                  <p className="px-5 py-6 text-sm text-white/40 text-center">No matches found.</p>
                )}

                {(["Sections", "Pages", "Projects", "Writing"] as const).map((group) => {
                  const groupItems = groupedFiltered[group];
                  if (!groupItems || groupItems.length === 0) return null;

                  return (
                    <div key={group} className="mb-2 last:mb-0">
                      <p className="px-5 py-1.5 text-[10px] tracking-[0.2em] uppercase text-white/30 font-semibold">
                        {group}
                      </p>
                      {groupItems.map((item) => {
                        runningIndex += 1;
                        const isActive = runningIndex === activeIndex;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => runItem(item)}
                            onMouseEnter={() => setActiveIndex(runningIndex)}
                            className={`w-full flex items-center justify-between gap-3 px-5 py-2.5 text-left transition-colors ${
                              isActive ? "bg-white/10" : "hover:bg-white/5"
                            }`}
                          >
                            <span className="min-w-0">
                              <span className="block text-sm text-white/90 truncate">
                                {item.label}
                              </span>
                              {item.sublabel && (
                                <span className="block text-xs text-white/40 truncate">
                                  {item.sublabel}
                                </span>
                              )}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
