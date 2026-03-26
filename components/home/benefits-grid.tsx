"use client";

import { Truck, ShieldCheck, Headphones, Award } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  { icon: Truck, title: "Envío Global", desc: "Logística premium para cada rincón del mundo.", number: "01" },
  { icon: ShieldCheck, title: "Pago Seguro", desc: "Protocolos de seguridad de grado bancario.", number: "02" },
  { icon: Headphones, title: "Soporte VIP", desc: "Atención personalizada las 24 horas.", number: "03" },
  { icon: Award, title: "Garantía Elite", desc: "Certificación de calidad en cada pieza.", number: "04" },
];

export function BenefitsGrid() {
  return (
    <section className="py-24 px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-primary/10 rounded-[3rem] overflow-hidden bg-white shadow-ambient">
          {benefits.map((feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`p-12 flex flex-col items-start gap-8 hover:bg-primary group transition-all duration-700 relative overflow-hidden ${
                i !== benefits.length - 1 ? 'lg:border-r border-primary/10' : ''
              } ${i < 2 ? 'md:border-b lg:border-b-0' : ''} border-primary/10`}
            >
              {/* Background Number */}
              <span className="absolute -right-4 -bottom-4 text-[12rem] font-black text-primary/5 group-hover:text-white/10 transition-colors duration-700 select-none leading-none">
                {feature.number}
              </span>

              <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-white group-hover:text-primary transition-all duration-500 shadow-sm">
                <feature.icon className="size-8" />
              </div>

              <div className="relative z-10">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary group-hover:text-white/60 mb-3 block transition-colors">
                  Benefit {feature.number}
                </span>
                <h3 className="text-2xl font-black text-foreground group-hover:text-white uppercase tracking-tighter mb-4 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-foreground/60 group-hover:text-white/80 text-sm font-medium leading-relaxed transition-colors max-w-[200px]">
                  {feature.desc}
                </p>
              </div>

              {/* Decorative Line */}
              <div className="w-12 h-1 bg-primary/10 group-hover:bg-white/20 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
