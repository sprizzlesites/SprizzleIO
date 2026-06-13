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
    <div className="relative min-h-[100dvh] w-full bg-transparent overflow-hidden flex flex-col font-sans">
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/40 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-accent/40 blur-[80px] rounded-full pointer-events-none" />
            
            {/* Decorative Orbs */}
            <div className="absolute top-10 left-10 w-16 h-16 aero-orb opacity-80" style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, hsl(350 75% 50%) 25%, hsl(350 80% 20%) 70%, hsl(350 90% 10%) 100%)',
              boxShadow: '0 0 20px hsl(350 75% 50%), inset 0 0 10px rgba(255,255,255,0.6)',
              animation: 'floatDrift 6s infinite ease-in-out'
            }}></div>
            <div className="absolute bottom-10 right-10 w-24 h-24 aero-orb opacity-90" style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, hsl(225 70% 50%) 25%, hsl(225 80% 20%) 70%, hsl(225 90% 10%) 100%)',
              boxShadow: '0 0 30px hsl(225 70% 50%), inset 0 0 15px rgba(255,255,255,0.6)',
              animation: 'floatDrift 8s infinite ease-in-out 1s'
            }}></div>
            <div className="absolute bottom-1/4 left-0 w-12 h-12 aero-orb opacity-70" style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, hsl(272 60% 50%) 25%, hsl(272 80% 20%) 70%, hsl(272 90% 10%) 100%)',
              boxShadow: '0 0 15px hsl(272 60% 50%), inset 0 0 10px rgba(255,255,255,0.6)',
              animation: 'floatDrift 5s infinite ease-in-out 2s'
            }}></div>

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
            <motion.div variants={itemVariants} className="glass-card flex items-center px-4 py-1.5 rounded-full text-white font-semibold text-sm mb-6 overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-secondary mr-2 shadow-[0_0_8px_hsl(350,75%,50%)]"></span>
              Welcome to the party
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 relative"
              style={{
                textShadow: '0 4px 0 hsl(272 60% 30%), 0 8px 10px rgba(0,0,0,0.5), 0 0 40px rgba(147, 51, 234, 0.5)',
                WebkitTextStroke: '2px hsl(272 60% 70%)'
              }}
            >
              Sprizzle
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/80 mb-10 max-w-lg leading-relaxed font-medium drop-shadow-md"
            >
              Where every moment pops. Bring joy, color, and a little extra bounce to everything you do.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col w-full sm:w-auto items-center"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <button 
                  className="btn-aero w-full sm:w-auto px-8 py-4 text-xl font-bold transition-transform duration-300"
                  data-testid="button-get-started"
                >
                  Get Started Now
                </button>
                <button 
                  className="glass-card w-full sm:w-auto px-8 py-4 text-xl font-bold text-white hover:bg-white/20 transition-all duration-300"
                  data-testid="button-learn-more"
                >
                  Learn More
                </button>
              </div>
              <div className="mt-8 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary to-accent opacity-70"></div>
            </motion.div>
          </motion.div>
          
        </div>
      </main>
    </div>
  );
}
