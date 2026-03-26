import { Truck, ShieldCheck, Headphones, Award } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  { icon: Truck, title: "Envío Gratis", desc: "En pedidos superiores a $99" },
  { icon: ShieldCheck, title: "Pago Seguro", desc: "Transacciones 100% protegidas" },
  { icon: Headphones, title: "Soporte 24/7", desc: "Asistencia cuando la necesites" },
  { icon: Award, title: "Garantía Total", desc: "30 días de retorno sin costo" },
];

export function BenefitsGrid() {
  return (
    <section className="py-16 px-8 max-w-7xl mx-auto -mt-20 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {benefits.map((feature, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-lowest rounded-[2.5rem] p-10 shadow-ambient flex flex-col items-center text-center gap-6 hover:-translate-y-3 transition-all duration-500 border border-outline-variant/5 group"
          >
            <div className="size-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mb-2 shadow-inner border border-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-6">
              <feature.icon className="size-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground uppercase tracking-tighter mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
