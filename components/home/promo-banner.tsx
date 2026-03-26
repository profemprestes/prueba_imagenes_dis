export function PromoBanner() {
  return (
    <section className="w-full bg-surface-low mt-24 mb-12 overflow-hidden relative rounded-[3rem] max-w-7xl mx-auto shadow-ambient group border border-outline-variant/10">
      <div className="flex flex-col md:flex-row items-center min-h-[500px]">
        <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center relative z-20">
          <span className="text-primary font-black tracking-[0.3em] uppercase text-[10px] mb-8 block">Oferta Especial</span>
          <h2 className="text-5xl md:text-6xl font-black text-foreground mb-10 uppercase tracking-tighter leading-[0.9]">
            Hasta 40% OFF en<br/> <span className="text-primary italic">Salas de Estar</span>
          </h2>
          <div className="flex">
            <a href="#" className="h-14 px-10 flex items-center bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-primary/20 transition-all duration-500">
              Descubrir Ofertas
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-[400px] md:h-[500px] relative overflow-hidden">
          {/* Subtle overlay to blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-low via-transparent to-transparent z-10"></div>
          <img
            src="https://picsum.photos/seed/promo-new/1200/800"
            alt="Interior de lujo"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </section>
  );
}
