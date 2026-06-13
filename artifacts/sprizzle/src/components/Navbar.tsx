import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-background/50 backdrop-blur-md border-b border-border/50"
      data-testid="navbar"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg">
          S
        </div>
        <span className="font-bold text-2xl tracking-tight text-foreground">Sprizzle</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 font-medium">
        <a href="#features" className="text-foreground/80 hover:text-primary transition-colors">Features</a>
        <a href="#community" className="text-foreground/80 hover:text-primary transition-colors">Community</a>
        <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors">Pricing</a>
      </div>
      
      <div>
        <button 
          className="px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          data-testid="button-nav-login"
        >
          Log In
        </button>
      </div>
    </motion.nav>
  );
}
