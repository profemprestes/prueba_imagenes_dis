"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-background flex items-center pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -30, 0], 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-[5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ 
            y: [0, 40, 0], 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 left-1/4 w-[700px] h-[700px] bg-orange-500/5 rounded-full blur-[140px]"
        />
      </div>

      <div className="container mx-auto px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[10px] font-black tracking-[0.2em] uppercase rounded-full bg-primary/5 text-primary border border-primary/10 backdrop-blur-sm">
              <Sparkles size={12} />
              <span>Nueva Colección 2024</span>
            </div>
            
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground mb-8 leading-[0.85] uppercase">
              Renueva Tu <br />
              <span className="bg-gradient-to-r from-primary via-orange-600 to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent italic">
                Espacio
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-xl leading-relaxed font-medium">
              Descubre muebles vibrantes y decoración de tendencia para hacer tu casa única. Precios increíbles, diseño excepcional.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <a 
                href="#" 
                className="h-16 px-10 flex items-center bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-[0_20px_40px_rgba(175,39,0,0.3)] hover:-translate-y-1 transition-all duration-500 group"
              >
                Comprar Ahora
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </a>
              <a 
                href="#" 
                className="h-16 px-10 flex items-center border-2 border-outline-variant/10 bg-surface-lowest/40 backdrop-blur-xl rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-surface-lowest/60 hover:border-primary/20 transition-all duration-500"
              >
                Ver Colección
              </a>
            </div>

            <div className="mt-16 flex items-center gap-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-background bg-surface-low overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-foreground">5k+ Clientes Felices</p>
                <p className="text-xs text-muted-foreground font-medium">Únete a nuestra comunidad vibrante</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative hidden lg:flex justify-center items-center h-[700px]">
          <motion.div
            initial={{ rotate: 12, y: 100, opacity: 0, scale: 0.8 }}
            animate={{ rotate: 6, y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-[400px] aspect-[3/4] rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.2)] border border-white/20 z-20 group"
          >
            <img 
              src="https://picsum.photos/seed/interior1/800/1200" 
              alt="Showcase" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
              <p className="text-white font-black uppercase tracking-widest text-lg">Sillón Nórdico</p>
              <p className="text-white/60 text-sm font-medium">Desde $299.00</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ rotate: -12, y: 150, opacity: 0, scale: 0.8 }}
            animate={{ rotate: -6, y: 60, opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="absolute w-[350px] aspect-square rounded-[3rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-white/10 z-10 brightness-90 translate-x-[-45%] group"
          >
            <img 
              src="https://picsum.photos/seed/interior2/800/800" 
              alt="Branding" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Floating Element */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-0 z-30 glass p-6 rounded-3xl border border-white/20 shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-on-surface/40">Calidad Premium</p>
                <p className="text-sm font-bold text-foreground">Diseño Certificado</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
