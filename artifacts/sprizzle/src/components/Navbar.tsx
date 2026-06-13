import { motion } from 'framer-motion';
import Logo3D from './SprizzleLogo';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring" as const, stiffness: 100, damping: 20, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 md:px-12 bg-white/5 backdrop-blur-[20px] border-b border-white/20 border-t border-t-white/40 shadow-[0_4px_30px_rgba(147,51,234,0.3)]"
      data-testid="navbar"
    >
      <div className="flex items-center gap-3">
        <Logo3D size={48} scale={2.2} autoRotate={true} />
      </div>

      <div className="hidden md:flex items-center gap-8 font-medium">
        <a href="#features" className="text-white/90 hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] relative group">
          Features
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-accent group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#community" className="text-white/90 hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] relative group">
          Community
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-accent group-hover:w-full transition-all duration-300"></span>
        </a>
        <a href="#pricing" className="text-white/90 hover:text-white transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] relative group">
          Pricing
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-accent group-hover:w-full transition-all duration-300"></span>
        </a>
      </div>

      <div>
        <button
          className="btn-aero px-6 py-2.5 rounded-full font-bold text-white transition-all hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: 'linear-gradient(180deg, hsl(272 60% 60%), hsl(272 60% 40%))',
            boxShadow: '0 8px 16px -4px rgba(147, 51, 234, 0.6), inset 0 -2px 6px rgba(0, 0, 0, 0.2)'
          }}
          data-testid="button-nav-login"
        >
          Log In
        </button>
      </div>
    </motion.nav>
  );
}
