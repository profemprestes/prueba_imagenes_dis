"use client";

import { ArrowRight, Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto mt-12 mb-20">
      <div className="bg-surface-low rounded-[3rem] p-12 md:p-24 text-center flex flex-col items-center justify-center relative overflow-hidden min-h-[500px] shadow-ambient group border border-outline-variant/10">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 opacity-50"></div>
        
        <div className="relative z-10 max-w-3xl w-full">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl text-primary mb-10 shadow-inner border border-primary/10">
            <Mail size={32} />
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-foreground mb-6 leading-tight uppercase tracking-tighter">
            Únete a la familia
          </h2>
          <p className="text-muted-foreground text-xl mb-12 max-w-lg mx-auto font-medium leading-relaxed">
            Suscríbete para recibir inspiración, ofertas exclusivas y un <span className="text-primary font-black">10% de descuento</span> en tu primera compra.
          </p>
          
          {/* Unified Input Pill */}
          <form 
            className="flex flex-col sm:flex-row w-full max-w-xl mx-auto gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="relative flex-grow group/input">
              <input 
                className="w-full bg-surface-lowest rounded-2xl border-2 border-outline-variant/10 focus:border-primary/40 focus:ring-0 text-foreground px-8 py-5 placeholder:text-muted-foreground font-bold text-lg transition-all outline-none" 
                placeholder="Tu correo electrónico..." 
                required 
                type="email"
              />
            </div>
            <button 
              className="h-16 px-10 flex items-center justify-center bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-500 group/btn" 
              type="submit"
            >
              Suscribirse
              <ArrowRight className="ml-2 size-5 transition-transform group-hover/btn:translate-x-2" />
            </button>
          </form>
          
          <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
            Respetamos tu privacidad. Cancela en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  );
}
