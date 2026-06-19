import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Logo3D from './SprizzleLogo';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollContext } from '../ScrollContext';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

interface SectionLink {
  label: string;
  pct: number;
}

const sections: SectionLink[] = [
  { label: "Portal", pct: 0 },
  { label: "The Grid", pct: 25 },
  { label: "The Canvas", pct: 50 },
  { label: "The Fortress", pct: 60 },
  { label: "The Nexus", pct: 90 },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollContainer = useContext(ScrollContext);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;
    const onScroll = () => {
      if (menuOpen) setMenuOpen(false);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [menuOpen, scrollContainer]);

  const smoothScrollToPct = (pct: number) => {
    const container = scrollContainer.current;
    if (!container) return;
    const docHeight = container.scrollHeight - container.clientHeight;
    const targetY = (pct / 100) * docHeight;
    gsap.to(container, {
      duration: 1.2,
      scrollTo: { y: targetY },
      ease: "power2.inOut",
    });
  };

  const handleClick = (pct: number) => {
    setMenuOpen(false);
    smoothScrollToPct(pct);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring" as const, stiffness: 100, damping: 20, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 md:px-12 md:py-3 bg-white/5 backdrop-blur-[20px] border-b border-white/20 border-t border-t-white/40 shadow-[0_4px_30px_rgba(147,51,234,0.3)]"
      data-testid="navbar"
    >
      {/* Logo */}
      <div className="flex items-center">
        {mounted && (
          <Logo3D size={44} scale={2.0} autoRotate={false} spinOnScroll={true} />
        )}
      </div>

      {/* Hamburger */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col items-center justify-center gap-1.5 w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Menu"
        >
          <span
            className="block w-6 h-0.5 bg-white rounded-full transition-transform duration-300"
            style={{
              transform: menuOpen ? 'translateY(4px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className="block w-6 h-0.5 bg-white rounded-full transition-opacity duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-0.5 bg-white rounded-full transition-transform duration-300"
            style={{
              transform: menuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none',
            }}
          />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div
            className="absolute right-0 top-12 z-50 min-w-[180px]"
            style={{
              background: 'rgba(5,2,20,0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.12)',
              borderTop: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 12px 40px -8px rgba(100,50,220,0.3)',
              overflow: 'hidden',
            }}
          >
            {sections.map((section, i) => (
              <button
                key={section.label}
                onClick={() => handleClick(section.pct)}
                className="w-full text-left px-5 py-3 text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 transition-all flex items-center gap-3"
                style={{
                  borderBottom: i < sections.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background:
                      i === 0
                        ? '#cc55ff'
                        : i === 1
                          ? '#44ff88'
                          : i === 2
                            ? '#ffaa33'
                            : i === 3
                              ? '#ff3333'
                              : '#cc55ff',
                  }}
                />
                {section.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.nav>
  );
}
