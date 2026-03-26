"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, Sparkles } from "lucide-react";

export function Newsletter() {
  return (
    <section className="py-32 px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[4rem] p-12 md:p-24 text-center flex flex-col items-center justify-center relative overflow-hidden min-h-[600px] shadow-ambient border border-primary/5 group">
          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-1/2 -left-1/4 w-full h-full bg-primary rounded-full blur-[140px]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:30px_30px]" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 max-w-3xl w-full"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/5 rounded-[2rem] text-primary mb-12 shadow-inner border border-primary/10 group-hover:rotate-12 transition-transform duration-700">
              <Mail size={40} strokeWidth={1.5} />
            </div>
            
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-primary mb-6 block">
              Comunidad Luminous
            </span>

            <h2 className="display-lg text-foreground mb-8 leading-[0.85] uppercase tracking-tighter">
              Únete a la <br />
              <span className="italic text-primary">Inspiración</span>
            </h2>
            
            <p className="text-foreground/60 text-xl md:text-2xl mb-16 max-w-xl mx-auto font-medium leading-relaxed">
              Suscríbete para recibir curaduría exclusiva, lanzamientos limitados y un <span className="text-primary font-black">10% de cortesía</span> en tu primera pieza.
            </p>
            
            {/* Unified Input Pill */}
            <form 
              className="flex flex-col sm:flex-row w-full max-w-2xl mx-auto gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative flex-grow group/input">
                <input 
                  className="input-field w-full px-10 py-6" 
                  placeholder="Tu correo electrónico..." 
                  required 
                  type="email"
                />
              </div>
              <button 
                className="btn-primary h-[76px] px-12 flex items-center justify-center group/btn" 
                type="submit"
              >
                Suscribirse
                <ArrowRight className="ml-3 size-5 transition-transform group-hover/btn:translate-x-2" />
              </button>
            </form>
            
            <div className="mt-12 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Sin Spam</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-primary/20" />
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Cancela cuando quieras</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
