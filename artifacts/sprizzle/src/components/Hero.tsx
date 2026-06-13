import { motion } from 'framer-motion';
import SprizzleLogo from './SprizzleLogo';
import BackgroundBubbles from './BackgroundBubbles';
import Navbar from './Navbar';
import { Button } from './ui/button';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-background overflow-hidden flex flex-col font-sans">
      <BackgroundBubbles />
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-20 pb-12 w-full max-w-7xl mx-auto">
        
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
            className="w-full lg:w-1/2 flex items-center justify-center relative"
          >
            {/* Soft glow behind the logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
            
            <WebGLErrorBoundary>
              <SprizzleLogo />
            </WebGLErrorBoundary>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
          >
            <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full bg-white/50 border border-primary/20 text-primary font-semibold text-sm mb-6 shadow-sm backdrop-blur-sm">
              Welcome to the party
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-6"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                Sprizzle
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-lg leading-relaxed"
            >
              Where every moment pops. Bring joy, color, and a little extra bounce to everything you do.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Button 
                size="lg" 
                className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 py-6 shadow-[0_8px_16px_-6px_rgba(255,51,153,0.5)] hover:shadow-[0_12px_20px_-8px_rgba(255,51,153,0.6)] hover:-translate-y-1 transition-all duration-300"
                data-testid="button-get-started"
              >
                Get Started Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto rounded-full border-2 border-primary/20 bg-white/50 hover:bg-white hover:border-primary/40 text-foreground font-bold text-lg px-8 py-6 backdrop-blur-sm transition-all duration-300"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
          
        </div>
      </main>
    </div>
  );
}
