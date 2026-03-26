"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Star } from 'lucide-react';
import { useRef } from 'react';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects for background and elements
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, 150]);
  const rotate = useTransform(scrollY, [0, 500], [6, 12]);

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section ref={containerRef} className="relative min-h-[100dvh] w-full overflow-hidden bg-background flex items-center pt-24 pb-12">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px]"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"
        />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-primary)_0.05,transparent_1px),linear-gradient(to_bottom,var(--color-primary)_0.05,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-[1.2fr,1fr] gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            <motion.div variants={itemVariants} className="flex flex-col mb-8">
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-primary mb-3">
                Luminous Merchant — Est. 2024
              </span>
              <div className="h-px w-12 bg-primary/30" />
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -top-12 -left-8 text-primary/10 select-none hidden md:block">
                <Zap size={120} strokeWidth={1} />
              </div>
              <h1 className="display-lg text-foreground mb-8 uppercase">
                Vibrante <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-primary via-primary-container to-primary bg-[length:200%_auto] animate-gradient-slow bg-clip-text text-transparent italic pr-4">
                    Esencia
                  </span>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1.2, duration: 1, ease: "easeInOut" }}
                    className="absolute -bottom-2 left-0 h-3 bg-primary/10 -z-10"
                  />
                </span>
              </h1>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-xl leading-relaxed font-medium">
              Curaduría experta de mobiliario que transforma lo cotidiano en algo extraordinario. Diseño con alma, espacios con luz.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-6">
              <a 
                href="#" 
                className="btn-primary group"
              >
                <span className="relative z-10 flex items-center">
                  Explorar Catálogo
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </span>
              </a>
              <a 
                href="#" 
                className="btn-glass border border-primary/10 hover:bg-white/60 hover:border-primary/30"
              >
                Nuestra Historia
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="mt-20 flex flex-wrap items-center gap-12">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-surface-low overflow-hidden shadow-sm">
                      <img 
                        src={`https://picsum.photos/seed/lm_user${i}/80/80`} 
                        alt="User" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-primary">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={10} fill="currentColor" />)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Top Rated Merchant</span>
                </div>
              </div>

              <div className="h-8 w-px bg-primary/10 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <Zap size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">Envío Express Global</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Showcase */}
          <div className="relative flex justify-center items-center h-[400px] sm:h-[500px] md:h-[600px] lg:h-[800px]">
            {/* Main Image Card */}
            <motion.div
              style={{ rotate }}
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="absolute w-[280px] sm:w-[320px] md:w-[420px] aspect-[3/4] rounded-[3rem] overflow-hidden shadow-ambient border border-white/40 z-20 group"
            >
              <img 
                src="https://picsum.photos/seed/luminous_hero/1200/1600" 
                alt="Editorial Showcase" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-12">
                <p className="text-white font-black uppercase tracking-[0.2em] text-xs mb-2">Featured Collection</p>
                <h3 className="text-white font-display text-4xl font-black italic tracking-tighter">Radiant Living</h3>
              </div>
            </motion.div>
            
            {/* Secondary Image Card */}
            <motion.div
              initial={{ rotate: -12, y: 150, opacity: 0, scale: 0.8 }}
              animate={{ rotate: -8, y: 80, opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="absolute w-[240px] sm:w-[280px] md:w-[380px] aspect-square rounded-[3rem] overflow-hidden shadow-ambient border border-white/20 z-10 brightness-95 translate-x-[-50%] group"
            >
              <img 
                src="https://picsum.photos/seed/luminous_detail/1000/1000" 
                alt="Detail View" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Floating Price Tag */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 sm:bottom-10 md:bottom-20 right-4 sm:right-0 lg:-right-12 z-30 bg-primary text-white p-4 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-ambient flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Desde</span>
              <span className="text-4xl font-black tracking-tighter">$2,499</span>
            </motion.div>

            {/* Floating Brand Badge */}
            <motion.div
              animate={{ 
                y: [0, 20, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-4 sm:top-8 md:top-12 left-4 sm:left-0 lg:-left-12 z-30 glass p-3 sm:p-4 md:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-white/40 shadow-ambient flex items-center gap-2 sm:gap-4"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Curated by</p>
                <p className="text-sm font-black text-foreground uppercase tracking-tighter">Radiant Team</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-foreground/30">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary/40 to-transparent" />
      </motion.div>
    </section>

  );
}
