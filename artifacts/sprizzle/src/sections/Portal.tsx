import { motion } from "framer-motion";
import SprizzleLogo from "../components/SprizzleLogo";
import BackgroundBubbles from "../components/BackgroundBubbles";
import Navbar from "../components/Navbar";
import { WebGLErrorBoundary } from "../components/WebGLErrorBoundary";

interface Props {
  className?: string;
}

export default function Portal({ className = "" }: Props) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className={`relative min-h-[100dvh] w-full overflow-hidden flex flex-col font-sans ${className}`}>
      <BackgroundBubbles />
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pt-20 pb-12 w-full max-w-7xl mx-auto">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" as const, duration: 1.5, bounce: 0.4 }}
            className="w-full lg:w-1/2 flex items-center justify-center relative"
          >
            {/* Small decorative orbs */}
            <div className="absolute top-8 right-12 w-14 h-14 rounded-full pointer-events-none" style={{
              background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9) 0%, hsl(350 75% 55%) 22%, hsl(350 80% 22%) 68%, hsl(350 90% 10%) 100%)",
              boxShadow: "0 0 18px hsl(350 75% 50%), inset 0 0 8px rgba(255,255,255,0.5)",
              animation: "floatDrift 6s infinite ease-in-out",
            }} />
            <div className="absolute bottom-8 left-8 w-10 h-10 rounded-full pointer-events-none" style={{
              background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9) 0%, hsl(225 70% 55%) 22%, hsl(225 80% 22%) 68%, hsl(225 90% 10%) 100%)",
              boxShadow: "0 0 14px hsl(225 70% 50%), inset 0 0 6px rgba(255,255,255,0.5)",
              animation: "floatDrift 7s infinite ease-in-out 1.5s",
            }} />
            <div className="absolute top-1/2 left-4 w-8 h-8 rounded-full pointer-events-none" style={{
              background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9) 0%, hsl(272 60% 55%) 22%, hsl(272 80% 22%) 68%, hsl(272 90% 10%) 100%)",
              boxShadow: "0 0 12px hsl(272 60% 50%), inset 0 0 6px rgba(255,255,255,0.5)",
              animation: "floatDrift 5s infinite ease-in-out 0.5s",
            }} />

            {/* The big Aero bubble */}
            <div className="relative flex items-center justify-center" style={{ width: "360px", height: "360px" }}>
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                boxShadow: "0 0 80px 20px rgba(120, 60, 220, 0.45), 0 0 40px 8px rgba(60, 80, 220, 0.3)",
              }} />
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{
                background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.18) 0%, rgba(100,50,200,0.25) 40%, rgba(30,20,120,0.55) 80%, rgba(10,5,60,0.7) 100%)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                boxShadow: "inset 0 0 40px rgba(255,255,255,0.08)",
              }} />
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  height: "48%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.04) 100%)",
                  borderRadius: "50% 50% 0 0 / 48% 48% 0 0",
                }} />
              </div>
              <div className="relative z-10 w-full h-full">
                <WebGLErrorBoundary>
                  <SprizzleLogo />
                </WebGLErrorBoundary>
              </div>
            </div>
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
                textShadow: "0 4px 0 hsl(272 60% 30%), 0 8px 10px rgba(0,0,0,0.5), 0 0 40px rgba(147, 51, 234, 0.5)",
                WebkitTextStroke: "2px hsl(272 60% 70%)",
              }}
            >
              Sprizzle
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/80 mb-10 max-w-lg leading-relaxed font-medium drop-shadow-md"
            >
              Enter the Sprizzle Realm. A digital world shaped by three forces: Web, Design, and Security.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col w-full sm:w-auto items-center"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <button
                  className="btn-aero w-full sm:w-auto px-8 py-4 text-xl font-bold transition-transform duration-300 hover:-translate-y-0.5"
                  data-testid="button-enter-realm"
                >
                  Enter the Realm
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
