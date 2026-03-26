"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Star, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

const DUMMY_PRODUCTS = [
  {
    id: "1",
    title: "Sillón Velvet Radiant Edition",
    slug: "sillon-velvet-radiant",
    price: 450,
    image: "https://picsum.photos/seed/sillon_radiant/800/800",
    badge: "Nuevo",
    rating: 5,
    category: "Mobiliario"
  },
  {
    id: "2",
    title: "Mesa Comedor Esencia Minimal",
    slug: "mesa-comedor-minimalista",
    price: 890,
    image: "https://picsum.photos/seed/mesa_esencia/800/800",
    badge: "Oferta",
    rating: 4.5,
    category: "Comedor"
  },
  {
    id: "3",
    title: "Lámpara de Pie Industrial Glow",
    slug: "lampara-pie-industrial",
    price: 120,
    image: "https://picsum.photos/seed/lampara_glow/800/800",
    badge: "-20%",
    rating: 4.8,
    category: "Iluminación"
  },
  {
    id: "4",
    title: "Estantería Modular Roble Vivo",
    slug: "estanteria-modular-roble",
    price: 340,
    image: "https://picsum.photos/seed/estanteria_roble/800/800",
    badge: "Popular",
    rating: 4.7,
    category: "Almacenaje"
  }
];

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .limit(4)
          .order("created_at", { ascending: false });

        if (error || !data || data.length === 0) {
          setProducts(DUMMY_PRODUCTS);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching featured products, using dummy data:", err);
        setProducts(DUMMY_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center bg-[#f7f6f5]">
        <Loader2 className="size-12 text-primary animate-spin mb-6" />
        <p className="text-[#2e2f2f]/40 font-black italic uppercase tracking-[0.3em] text-xs">Curando selección...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="py-32 px-8 bg-background border-t border-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-primary mb-4 block">
              Selección Exclusiva
            </span>
            <h2 className="display-md text-foreground mb-6 uppercase leading-[0.9]">
              Lo Más <br />
              <span className="italic text-primary">Deseado</span>
            </h2>
            <p className="text-foreground/60 text-lg md:text-xl font-medium max-w-md">
              Piezas icónicas que definen el carácter de tu hogar. Curaduría sin compromisos.
            </p>
          </div>
          <a 
            href="#" 
            className="group flex items-center gap-4 text-xs font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors"
          >
            Explorar Todo el Catálogo
            <div className="size-12 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </div>
          </a>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              variants={itemVariants}
              className="product-card group shadow-ambient hover:shadow-hover hover:-translate-y-2"
            >
              {/* Image Area */}
              <div className="aspect-[4/5] bg-surface-low relative overflow-hidden">
                <img
                  src={product.image || "https://picsum.photos/seed/placeholder/800/800"}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                
                {/* Category Badge */}
                <div className="absolute top-6 left-6 glass text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-foreground/60 border border-white/40">
                  {product.category || "Colección"}
                </div>

                {product.badge && (
                  <div className={`absolute top-6 right-6 ${product.badge.includes('%') ? 'bg-primary text-white' : 'bg-foreground text-white'} text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl`}>
                    {product.badge}
                  </div>
                )}

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <button className="h-14 px-8 bg-white text-primary rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    Vista Rápida
                  </button>
                </div>
              </div>

              {/* Details Area */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <a href="#">
                    <h3 className="text-xl font-black text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors uppercase tracking-tight">{product.title}</h3>
                  </a>
                </div>
                
                <div className="flex items-center gap-1 mb-8">
                  <div className="flex text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-3 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'opacity-20'}`} />
                    ))}
                  </div>
                  <span className="text-foreground/30 text-[8px] font-black uppercase tracking-widest ml-2">Verified Choice</span>
                </div>

                <div className="mt-auto flex justify-between items-center pt-6 border-t border-primary/5">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-foreground tracking-tighter">${product.price}</span>
                  </div>
                  
                  <button aria-label="Agregar al carrito" className="size-14 rounded-2xl bg-surface-low flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all duration-500 group/btn">
                    <div className="relative size-6">
                      <Plus className="absolute inset-0 size-6 transition-all duration-500 group-hover/btn:rotate-90 group-hover/btn:opacity-0" />
                      <ShoppingCart className="absolute inset-0 size-6 transition-all duration-500 -rotate-90 opacity-0 group-hover/btn:rotate-0 group-hover/btn:opacity-100" />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-20 flex justify-center md:hidden">
          <a href="#" className="rounded-full h-14 px-10 border-2 border-primary/10 text-foreground font-black uppercase tracking-widest text-[10px] hover:border-primary hover:text-primary transition-all flex items-center">
            Ver Catálogo Completo
          </a>
        </div>
      </div>
    </section>

  );
}
