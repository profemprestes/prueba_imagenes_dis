"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export function PromoBanner() {
  return (
    <section className="py-24 px-8 bg-background">
      <div className="max-w-7xl mx-auto overflow-hidden relative rounded-[4rem] bg-foreground group shadow-ambient">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/2 -right-1/4 w-full h-full bg-primary rounded-full blur-[160px]"
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        </div>

        <div className="flex flex-col lg:flex-row items-stretch min-h-[600px] relative z-10">
          {/* Content Area */}
          <div className="w-full lg:w-1/2 p-12 md:p-24 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Zap size={20} fill="currentColor" />
                </div>
                <span className="text-primary font-black tracking-[0.4em] uppercase text-[10px]">Venta de Temporada</span>
              </div>

              <h2 className="display-lg text-white mb-10 uppercase leading-[0.85]">
                Hasta <span className="text-primary italic">40% OFF</span> <br />
                en Colección <br />
                <span className="relative">
                  Invierno
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="absolute -bottom-2 left-0 h-2 bg-primary/40"
                  />
                </span>
              </h2>

              <p className="text-white/60 text-xl font-medium mb-12 max-w-md leading-relaxed">
                Redefine tu espacio con piezas de diseño exclusivo a precios irrepetibles. Solo por tiempo limitado.
              </p>

              <div className="flex flex-wrap gap-6">
                <a 
                  href="#" 
                  className="btn-primary h-16 px-10 flex items-center group"
                >
                  Explorar Ofertas
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                </a>
                <div className="flex items-center gap-3 px-6 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="size-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Quedan 12 horas</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image Area */}
          <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[400px]">
            <motion.div
              initial={{ scale: 1.2, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img
                src="https://picsum.photos/seed/promo_radiant/1200/1200"
                alt="Interior de lujo"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-foreground via-transparent to-transparent lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-transparent to-transparent lg:hidden block" />
            </motion.div>

            {/* Floating Detail Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute bottom-12 right-12 glass p-8 rounded-[2.5rem] border border-white/20 shadow-2xl max-w-[240px] hidden md:block"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Featured Piece</p>
              <h4 className="text-white text-2xl font-black italic tracking-tighter mb-4">Sillón Velvet</h4>
              <p className="text-white/60 text-xs font-medium leading-relaxed">Artesanía pura en cada costura. Disponible en 5 colores exclusivos.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
