import React from 'react';
import { Wand2, X, Shirt } from 'lucide-react';
import { Button } from '@/components/Button';
import { useStudioCanvas, PlacedLayer } from '@/hooks/useStudioCanvas';

import { Asset } from '@/types';

interface StudioViewProps {
  assets: Asset[];
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: (layers: PlacedLayer[]) => void;
  isGenerating: boolean;
  loadingMessage: string;
}

export const StudioView: React.FC<StudioViewProps> = ({
  assets,
  selectedProductId,
  setSelectedProductId,
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  loadingMessage
}) => {
  const {
    placedLogos,
    canvasRef,
    addLogoToCanvas,
    removeLogoFromCanvas,
    handleMouseDown,
    handleTouchStart,
    handleWheel
  } = useStudioCanvas();

  const products = assets.filter(a => a.type === 'product');
  const logos = assets.filter(a => a.type === 'logo');

  return (
    <div className="animate-fade-in h-[calc(100vh-12rem)] flex flex-col-reverse lg:flex-row gap-8">
      {/* Left Controls (Bottom on Mobile) */}
      <div className="w-full lg:w-96 flex flex-col gap-8 glass p-8 rounded-[2rem] overflow-y-auto flex-1 lg:flex-none border border-outline-variant/10 shadow-xl shadow-on-surface/5">
        <div>
          <h3 className="text-[10px] font-black text-on-surface/40 uppercase tracking-[0.2em] mb-6">1. Select Product</h3>
          <div className="grid grid-cols-3 gap-3">
            {products.map(a => (
              <div 
                key={a.id} 
                onClick={() => setSelectedProductId(selectedProductId === a.id ? null : a.id)}
                className={`aspect-square rounded-2xl border-2 cursor-pointer p-2 transition-all duration-300 ${selectedProductId === a.id ? 'border-primary bg-primary/5' : 'border-outline-variant/10 hover:border-primary/30 bg-surface-low'}`}
              >
                <img src={a.data} className="w-full h-full object-contain" alt={a.name} />
              </div>
            ))}
            {products.length === 0 && <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/20 col-span-3">No products uploaded</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-on-surface/40 uppercase tracking-[0.2em]">2. Add Logos</h3>
            {placedLogos.length > 0 && (
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{placedLogos.length} Active</span>
            )}
          </div>
          <p className="text-[10px] font-medium text-on-surface/40 mb-4 leading-relaxed">Click to add. Drag on canvas to move. Scroll to resize.</p>
          <div className="grid grid-cols-3 gap-3">
            {logos.map(a => (
              <div 
                key={a.id} 
                onClick={() => addLogoToCanvas(a.id)}
                className={`relative aspect-square rounded-2xl border-2 cursor-pointer p-2 transition-all duration-300 border-outline-variant/10 hover:border-primary/30 bg-surface-low`}
              >
                <img src={a.data} className="w-full h-full object-contain" alt={a.name} />
                {/* Count badge */}
                {placedLogos.filter(l => l.assetId === a.id).length > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-surface-lowest shadow-lg">
                    {placedLogos.filter(l => l.assetId === a.id).length}
                  </div>
                )}
              </div>
            ))}
            {logos.length === 0 && <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/20 col-span-3">No logos uploaded</p>}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black text-on-surface/40 uppercase tracking-[0.2em] mb-6">3. Instructions</h3>
          <textarea 
            className="w-full bg-surface-low border border-outline-variant/10 rounded-2xl p-6 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none h-32 placeholder:text-on-surface/20 transition-all"
            placeholder="E.g. Embed the logos into the fabric texture..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <Button 
          onClick={() => onGenerate(placedLogos)} 
          isLoading={isGenerating} 
          disabled={!selectedProductId || placedLogos.length === 0} 
          size="lg" 
          className="mt-auto py-6 text-lg"
          icon={<Wand2 size={20} />}
        >
          Generate Mockup
        </Button>
      </div>

      {/* Right Preview - Canvas (Top on Mobile) */}
      <div className="h-[50vh] lg:h-auto lg:flex-1 glass rounded-[2.5rem] flex items-center justify-center bg-surface-low relative overflow-hidden select-none flex-shrink-0 border border-outline-variant/10 shadow-inner">
        {isGenerating && (
          <div className="absolute inset-0 z-20 bg-surface-lowest/80 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-primary font-black uppercase tracking-widest text-xs animate-pulse">{loadingMessage}</p>
          </div>
        )}
        
        {selectedProductId ? (
          <div 
            ref={canvasRef}
            className="relative w-full h-full max-h-[700px] p-8"
          >
            {/* Product Base */}
            <img 
              src={assets.find(a => a.id === selectedProductId)?.data} 
              className="w-full h-full object-contain drop-shadow-2xl pointer-events-none select-none" 
              alt="Preview" 
              draggable={false}
            />

            {/* Overlay Layers */}
            {placedLogos.map((layer) => {
              const logoAsset = assets.find(a => a.id === layer.assetId);
              if (!logoAsset) return null;

              return (
                <div
                  key={layer.uid}
                  className="absolute cursor-move group z-10"
                  style={{
                    left: `${layer.x}%`,
                    top: `${layer.y}%`,
                    transform: `translate(-50%, -50%) scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                    width: '18%', 
                    aspectRatio: '1/1'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, layer)}
                  onTouchStart={(e) => handleTouchStart(e, layer)}
                  onWheel={(e) => handleWheel(e, layer.uid)}
                >
                  {/* Selection Border */}
                  <div className="absolute -inset-4 border-2 border-primary/0 group-hover:border-primary/40 rounded-2xl transition-all duration-300 pointer-events-none"></div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={(e) => removeLogoFromCanvas(layer.uid, e)}
                    className="absolute -top-6 -right-6 bg-primary text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl z-50 border-2 border-surface-lowest"
                    title="Remove"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>

                  <img 
                    src={logoAsset.data} 
                    className="w-full h-full object-contain drop-shadow-xl pointer-events-none"
                    draggable={false}
                    alt="layer"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 bg-surface-lowest rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-outline-variant/10">
              <Shirt size={40} className="text-on-surface/10" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Studio Canvas</h3>
            <p className="text-on-surface/40 max-w-xs mx-auto">Select a product to begin spatial compositing.</p>
          </div>
        )}
      </div>
    </div>
  );
};
