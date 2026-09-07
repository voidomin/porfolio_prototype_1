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

interface EqualizerBarsProps {
  soundEnabled: boolean;
  barColorOn: string;
  barColorOff: string;
  isMobile?: boolean;
}

const EqualizerBars = ({
  soundEnabled,
  barColorOn,
  barColorOff,
  isMobile = false,
}: EqualizerBarsProps) => {
  const durations = isMobile ? [0.8, 1.1, 0.7, 1] : [0.7, 1.1, 0.6, 0.9];
  return (
    <div
      className={cn(
        "flex items-end overflow-hidden",
        isMobile ? "gap-[2px] h-3 w-3" : "gap-[2.5px] h-3.5 w-4"
      )}
    >
      {durations.map((dur) => (
        <motion.div
          key={`${isMobile ? "mob" : "desk"}-eq-${dur}`}
          animate={{
            scaleY: soundEnabled ? [0.25, 1, 0.25] : 0.25,
          }}
          transition={{
            duration: dur,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={cn(
            "origin-bottom rounded-full transition-colors duration-300",
            isMobile ? "w-[1.5px]" : "w-[2px]",
            "h-full",
            soundEnabled ? barColorOn : barColorOff
          )}
        />
      ))}
    </div>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
  hasScrolled: boolean;
  isActive: boolean;
  onClick: (href: string) => void;
}

const NavLink = ({ href, label, hasScrolled, isActive, onClick }: NavLinkProps) => {
  return (
    <motion.a
      href={href}
      onClick={(e) => {
        if (href.startsWith("#")) {
          e.preventDefault();
          onClick(href);
        }
      }}
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
        hasScrolled
          ? isActive
            ? "text-white bg-white/10"
            : "text-white/70 hover:text-white hover:bg-white/10"
          : isActive
            ? "text-forest-950 bg-forest-950/10"
            : "text-forest-950/80 hover:text-forest-950 hover:bg-forest-950/10"
      )}
    >
      {label}
      {isActive && (
        // Plain wrapper owns the centering transform — layoutId's own FLIP
        // animation writes the transform inline style directly, which would
        // otherwise silently overwrite Tailwind's -translate-x-1/2 here.
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2">
          <motion.span
            layoutId="nav-active-dot"
            className={cn(
              "block w-1 h-1 rounded-full",
              hasScrolled ? "bg-forest-400" : "bg-forest-700"
            )}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </span>
      )}
    </motion.a>
  );
};

const MenuToggleIcon = ({ isOpen }: { isOpen: boolean }) => (
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
);

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkClick: (href: string) => void;
}

const MobileMenu = ({ isOpen, onClose, onLinkClick }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />

          <motion.div
            id="mobile-navigation-drawer"
            role="navigation"
            aria-label="Mobile navigation"
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
                      if (item.href.startsWith("#")) {
                        e.preventDefault();
                      }
                      onLinkClick(item.href);
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
  );
};

interface ButtonStyles {
  desktopButtonClass: string;
  mobileButtonClass: string;
  desktopBarColorOn: string;
  desktopBarColorOff: string;
  mobileBarColorOn: string;
  mobileBarColorOff: string;
}

const getSoundButtonStyles = (hasScrolled: boolean, soundEnabled: boolean): ButtonStyles => {
  if (hasScrolled) {
    return {
      desktopButtonClass: soundEnabled
        ? "bg-forest-500/10 text-forest-400 border-forest-500/20"
        : "text-white/50 border-white/10 hover:text-white",
      mobileButtonClass: soundEnabled
        ? "bg-forest-500/10 text-forest-400 border-forest-500/20"
        : "text-white/50 border-white/10",
      desktopBarColorOn: "bg-forest-400",
      desktopBarColorOff: "bg-white/30",
      mobileBarColorOn: "bg-forest-400",
      mobileBarColorOff: "bg-white/30",
    };
  }

  return {
    desktopButtonClass: soundEnabled
      ? "bg-forest-950/15 text-forest-950 border-forest-950/20 animate-pulse"
      : "text-forest-950/50 border-forest-950/10 hover:text-forest-950",
    mobileButtonClass: soundEnabled
      ? "bg-forest-950/15 text-forest-950 border-forest-950/20 animate-pulse"
      : "text-forest-950/50 border-forest-950/10",
    desktopBarColorOn: "bg-forest-950",
    desktopBarColorOff: "bg-forest-950/30",
    mobileBarColorOn: "bg-forest-950",
    mobileBarColorOff: "bg-forest-950/30",
  };
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const { scrollY } = useScrollDirection();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    navigationItems.forEach((item) => {
      if (!item.href.startsWith("#")) return;
      const el = document.querySelector(item.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const hasScrolled = scrollY > 50;

  const {
    desktopButtonClass,
    mobileButtonClass,
    desktopBarColorOn,
    desktopBarColorOff,
    mobileBarColorOn,
    mobileBarColorOff,
  } = getSoundButtonStyles(hasScrolled, soundEnabled);

  const handleLinkClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSoundToggle = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    window.dispatchEvent(
      new CustomEvent("nature-sound-toggle", { detail: { enabled: nextState } })
    );
  };

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500",
          hasScrolled
            ? "bg-night-950/60 backdrop-blur-md md:backdrop-blur-xl border-b border-white/5"
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

          {/* Desktop Navigation & Equalizer Soundwave */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1">
              {navigationItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.08 + 0.3, duration: 0.3 }}
                >
                  <NavLink
                    href={item.href}
                    label={item.label}
                    hasScrolled={hasScrolled}
                    isActive={activeSection === item.href}
                    onClick={handleLinkClick}
                  />
                </motion.div>
              ))}
            </div>

            {/* Premium Soundwave Equalizer Toggle */}
            <motion.button
              onClick={handleSoundToggle}
              className={cn(
                "relative flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-wider transition-all duration-300 select-none",
                desktopButtonClass
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={
                soundEnabled ? "Mute ambient mountain sounds" : "Unmute ambient mountain sounds"
              }
              aria-label={
                soundEnabled ? "Mute ambient mountain sounds" : "Unmute ambient mountain sounds"
              }
              aria-pressed={soundEnabled}
            >
              <EqualizerBars
                soundEnabled={soundEnabled}
                barColorOn={desktopBarColorOn}
                barColorOff={desktopBarColorOff}
                isMobile={false}
              />
              <span className="uppercase text-[9px] font-bold">
                {soundEnabled ? "Sound ON" : "Sound OFF"}
              </span>
            </motion.button>
          </div>

          {/* Mobile Actions Container */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Equalizer Soundwave Toggle */}
            <motion.button
              onClick={handleSoundToggle}
              className={cn(
                "relative flex items-center justify-center gap-1.5 p-2 rounded-full border text-[9px] font-bold tracking-wider transition-all duration-300",
                mobileButtonClass
              )}
              whileTap={{ scale: 0.95 }}
              title={soundEnabled ? "Mute Soundscape" : "Unmute Soundscape"}
              aria-label={soundEnabled ? "Mute ambient soundscape" : "Unmute ambient soundscape"}
              aria-pressed={soundEnabled}
            >
              <EqualizerBars
                soundEnabled={soundEnabled}
                barColorOn={mobileBarColorOn}
                barColorOff={mobileBarColorOff}
                isMobile={true}
              />
            </motion.button>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                hasScrolled
                  ? "hover:bg-white/10 text-white/80"
                  : "hover:bg-forest-950/10 text-forest-950"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-drawer"
            >
              <MenuToggleIcon isOpen={isOpen} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} onLinkClick={handleLinkClick} />
    </>
  );
};
