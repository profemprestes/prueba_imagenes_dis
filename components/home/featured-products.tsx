"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Star, Plus, ShoppingCart, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const DUMMY_PRODUCTS = [
  {
    id: "1",
    title: "Sillón Velvet Radiant",
    slug: "sillon-velvet-radiant",
    price: 450,
    image: "https://picsum.photos/seed/sillon/600/600",
    badge: "Nuevo",
    rating: 5
  },
  {
    id: "2",
    title: "Mesa Comedor Minimalista",
    slug: "mesa-comedor-minimalista",
    price: 890,
    image: "https://picsum.photos/seed/mesa/600/600",
    badge: "Oferta",
    rating: 4.5
  },
  {
    id: "3",
    title: "Lámpara de Pie Industrial",
    slug: "lampara-pie-industrial",
    price: 120,
    image: "https://picsum.photos/seed/lampara/600/600",
    badge: "-20%",
    rating: 4.8
  },
  {
    id: "4",
    title: "Estantería Modular Roble",
    slug: "estanteria-modular-roble",
    price: 340,
    image: "https://picsum.photos/seed/estanteria/600/600",
    badge: "Popular",
    rating: 4.7
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
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="size-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-bold italic uppercase tracking-widest text-sm">Cargando destacados...</p>
      </div>
    );
  }

  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-5xl font-black text-foreground mb-4 uppercase tracking-tighter">Lo Más Deseado</h2>
          <p className="text-muted-foreground text-xl font-medium">Nuestros productos estrella para tu hogar.</p>
        </div>
        <a href="#" className="hidden md:flex items-center text-primary font-black uppercase tracking-widest text-sm hover:underline gap-2">
          Ver todos <ArrowRight className="size-5" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {products.map((product) => (
          <div key={product.id} className="group flex flex-col surface-lowest rounded-[2.5rem] overflow-hidden border border-outline-variant/10 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500">
            {/* Image Area */}
            <div className="h-[360px] bg-surface-low relative p-8 flex justify-center items-center overflow-hidden">
              <img
                src={product.image || "https://picsum.photos/seed/placeholder/600/600"}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              {product.badge && (
                <div className={`absolute top-6 left-6 ${product.badge.includes('%') ? 'bg-primary text-white' : 'bg-white text-foreground'} text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg`}>
                  {product.badge}
                </div>
              )}
            </div>

            {/* Details Area */}
            <div className="p-8 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-3">
                <a href="#">
                  <h3 className="text-lg font-bold text-foreground leading-tight line-clamp-2 hover:text-primary transition-colors">{product.title}</h3>
                </a>
              </div>
              <div className="flex items-center gap-1 mb-8 text-[#ffb400]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'opacity-20'}`} />
                ))}
                <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest ml-2">(Reseñas)</span>
              </div>
              <div className="mt-auto flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-primary tracking-tighter">${product.price}</span>
                </div>
                
                {/* Interactive Add Button */}
                <button aria-label="Agregar al carrito" className="size-14 rounded-full bg-surface-low flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all duration-500 shadow-sm overflow-hidden group/btn">
                  <div className="relative size-6">
                    <Plus className="absolute inset-0 size-6 transition-all duration-500 group-hover/btn:rotate-90 group-hover/btn:opacity-0" />
                    <ShoppingCart className="absolute inset-0 size-6 transition-all duration-500 -rotate-90 opacity-0 group-hover/btn:rotate-0 group-hover/btn:opacity-100" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex justify-center md:hidden">
        <a href="#" className="rounded-full h-14 px-10 border-2 border-outline-variant/20 text-foreground font-black uppercase tracking-widest text-xs hover:border-primary hover:text-primary transition-all flex items-center">
          Ver todos los productos
        </a>
      </div>
    </section>
  );
}
