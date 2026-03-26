"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Copy, 
  Check, 
  Sparkles, 
  Layout, 
  Code2 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { toast } from "sonner";

// Mapeo de componentes actuales detectados en el repositorio
const PROJECT_COMPONENTS = [
  { id: "Navbar", label: "Layout: Navbar", category: "Global" },
  { id: "Footer", label: "Layout: Footer", category: "Global" },
  { id: "HeroSection", label: "Home: Hero Section", category: "Home" },
  { id: "BenefitsGrid", label: "Home: Benefits Grid", category: "Home" },
  { id: "FeaturedProducts", label: "Home: Featured Products", category: "Home" },
  { id: "ProductCard", label: "Product: Card", category: "Catalog" },
  { id: "ProductGrid", label: "Product: Grid", category: "Catalog" },
  { id: "CartPage", label: "Page: Shopping Cart", category: "Pages" },
  { id: "CheckoutPage", label: "Page: Checkout", category: "Pages" },
];

export default function PromptBuilderPage() {
  const [selectedComponent, setSelectedComponent] = useState<string>("");
  const [currentCode, setCurrentCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    const componentName = PROJECT_COMPONENTS.find(c => c.id === selectedComponent)?.label || "[NOMBRE DEL COMPONENTE]";
    
    return `Actúa como un Senior UI/UX Designer y Desarrollador Frontend experto. Necesito mejorar este componente específico de mi proyecto "PrecioHogar": ${componentName}.

Por favor, aplica las siguientes mejoras integrales:

1. DISEÑO GRÁFICO (The Radiant Curator):
- Refina la jerarquía visual y el uso de espacios negativos.
- Aplica efectos de glassmorphism sofisticados y sombras ambientales.
- Asegura que el uso del color primario (#af2700) y los gradientes sea impactante pero equilibrado.
- Mejora la iconografía y el tratamiento de imágenes.

2. ANIMACIONES Y MICROINTERACCIONES:
- Añade transiciones suaves de entrada (fade-ins, slide-ups) usando staggered animations si hay listas.
- Implementa microinteracciones en estados de hover y active (escalado 1.02x, cambios de elevación).
- Incluye animaciones de carga (skeletons) o transiciones de estado elegantes.

3. FUNCIONALIDAD Y UX:
- Optimiza los flujos de usuario y la claridad de los Call to Action (CTA).
- Mejora la accesibilidad y la legibilidad de la tipografía (Epilogue/Plus Jakarta Sans).
- Asegura que los elementos interactivos tengan feedback visual claro.

4. RESPONSIVIDAD:
- Garantiza un comportamiento impecable en desktop, tablet y mobile.
- Ajusta grids y paddings para que el contenido respire en pantallas pequeñas.

${currentCode ? `\nESTADO ACTUAL / CÓDIGO:\n\`\`\`tsx\n${currentCode}\n\`\`\`` : ""}`;
  };

  const handleCopy = async () => {
    if (!selectedComponent) {
      toast.error("Por favor selecciona un componente primero.");
      return;
    }
    await navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    toast.success("El prompt ha sido copiado al portapapeles.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container max-w-4xl py-10 mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-primary/20 shadow-xl overflow-hidden bg-surface-lowest/50 backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-container" />
          <CardHeader>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-bold tracking-widest uppercase">AI Design Assistant</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Prompt Studio</CardTitle>
            <CardDescription>
              Genera instrucciones detalladas para mejorar la interfaz de PrecioHogar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-on-surface/70">
                  <Layout className="w-4 h-4 text-primary" />
                  Seleccionar Componente/Página
                </label>
                <Select onValueChange={setSelectedComponent} value={selectedComponent}>
                  <SelectTrigger className="bg-surface-low/50 border-none h-12 rounded-xl">
                    <SelectValue placeholder="Selecciona para mejorar..." />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-lowest border-outline-variant/10">
                    {PROJECT_COMPONENTS.map((comp) => (
                      <SelectItem key={comp.id} value={comp.id} className="focus:bg-primary/10 focus:text-primary">
                        {comp.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-on-surface/70">
                  <Code2 className="w-4 h-4 text-primary" />
                  Código Actual (Opcional)
                </label>
                <Textarea 
                  placeholder="Pega el código TSX aquí para dar más contexto..." 
                  className="min-h-[120px] bg-surface-low/30 border-none font-mono text-xs resize-none rounded-xl focus:ring-2 focus:ring-primary/20"
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/10">
              <div className="bg-on-surface rounded-2xl p-6 relative group shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-surface-low/40 text-[10px] font-black uppercase tracking-widest">Vista Previa del Prompt</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopy}
                    className="text-surface-low/60 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copiado" : "Copiar Prompt"}
                  </Button>
                </div>
                <div className="max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                  <p className="text-sm text-surface-low/80 whitespace-pre-wrap leading-relaxed font-sans italic">
                    {selectedComponent ? generatePrompt() : "Selecciona un componente arriba para ver el resultado..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleCopy} 
                className="btn-primary h-12 px-10"
                disabled={!selectedComponent}
              >
                {copied ? <Check className="w-5 h-5 mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                Generar y Copiar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
