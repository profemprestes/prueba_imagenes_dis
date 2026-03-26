import React, { useState, useEffect } from 'react';
import { Layout, Box, Image as ImageIcon, Wand2, Layers, Plus, Trash2, Download, History, Sparkles, Shirt, Move, Maximize, RotateCcw, Zap, Cpu, ArrowRight, Globe, Scan, Camera, Aperture, Repeat, SprayCan, Triangle, Package, Menu, X, Check, MousePointer2 } from 'lucide-react';
import { Button } from './components/Button';
import { generateMockup, generateAsset, generatePrompts } from './services/geminiService';
import { Asset, GeneratedMockup, AppView, LoadingState } from './types';
import PromptBuilderPage from './PromptBuilderPage';
import { Toaster } from './components/ui/sonner';

// Import Home Components
import { HeroSection } from './components/home/hero-section';
import { BenefitsGrid } from './components/home/benefits-grid';
import { FeaturedProducts } from './components/home/featured-products';
import { PromoBanner } from './components/home/promo-banner';
import { Newsletter } from './components/home/newsletter';

// Import Refactored Components
import { IntroSequence } from './src/components/IntroSequence';
import { NavButton } from './src/components/NavButton';
import { WorkflowStepper } from './src/components/WorkflowStepper';
import { AssetSection } from './src/components/AssetSection';
import { ForgeView } from './src/components/ForgeView';
import { StudioView } from './src/components/StudioView';
import { DashboardView } from './src/components/DashboardView';
import { GalleryView } from './src/components/GalleryView';
import { Lightbox } from './src/components/Lightbox';

import '@google/model-viewer';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [showIntro, setShowIntro] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [mockups, setMockups] = useState<GeneratedMockup[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState<LoadingState>({ isGenerating: false, message: '' });
  const [inspectingMockup, setInspectingMockup] = useState<GeneratedMockup | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Demo assets on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  const handleApiError = (e: any) => {
    console.error("API Error:", e);
    const errorMsg = e instanceof Error ? e.message : "An unexpected error occurred.";
    alert(`Forge Error: ${errorMsg}`);
  };

  const handleGenerateMockup = async (layers: any[]) => {
    if (!selectedProductId) return;
    
    const product = assets.find(a => a.id === selectedProductId);
    if (!product) return;

    const layerAssets = layers.map(layer => {
      const asset = assets.find(a => a.id === layer.assetId);
      return asset ? { asset, placement: layer } : null;
    }).filter(Boolean) as { asset: Asset, placement: any }[];

    setLoading({ isGenerating: true, message: 'Analyzing composite geometry...' });
    try {
      const result = await generateMockup(product, layerAssets, prompt);
      const newMockup: GeneratedMockup = {
        id: Math.random().toString(36).substr(2, 9),
        imageUrl: result,
        prompt: prompt,
        createdAt: Date.now(),
        layers: layers
      };
      setMockups(prev => [newMockup, ...prev]);
      setView('gallery');
    } catch (e: any) {
      handleApiError(e);
    } finally {
      setLoading({ isGenerating: false, message: '' });
    }
  };

  const handleAddAsset = (newAsset: Asset) => {
    setAssets(prev => [...prev, newAsset]);
  };

  const handleRemoveAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleSynthesizeAsset = async (type: 'product' | 'logo' | 'model3d', prompt: string) => {
    setLoading({ isGenerating: true, message: `Synthesizing ${type}...` });
    try {
      const result = await generateAsset(prompt, type);
      const newAsset: Asset = {
        id: Math.random().toString(36).substr(2, 9),
        type,
        name: `AI ${type}`,
        data: result,
        mimeType: 'image/png'
      };
      handleAddAsset(newAsset);
    } catch (e: any) {
      handleApiError(e);
    } finally {
      setLoading({ isGenerating: false, message: '' });
    }
  };

  if (showIntro) return <IntroSequence onComplete={() => setShowIntro(false)} />;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary">
      <Toaster />
      
      {/* --- NAVIGATION RAIL --- */}
      <nav className="fixed left-0 top-0 bottom-0 w-24 bg-surface-lowest border-r border-outline-variant/10 z-50 hidden xl:flex flex-col items-center py-12 gap-12">
        <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 hover:scale-110 transition-transform cursor-pointer" onClick={() => setView('dashboard')}>
          <Package size={28} strokeWidth={2.5} />
        </div>
        
        <div className="flex flex-col gap-6">
          <NavButton icon={<Layout size={22} />} label="Home" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavButton icon={<Box size={22} />} label="Assets" active={view === 'assets'} onClick={() => setView('assets')} number={assets.length} />
          <NavButton icon={<Wand2 size={22} />} label="Forge" active={view === 'forge'} onClick={() => setView('forge')} />
          <NavButton icon={<Shirt size={22} />} label="Studio" active={view === 'studio'} onClick={() => setView('studio')} />
          <NavButton icon={<ImageIcon size={22} />} label="Gallery" active={view === 'gallery'} onClick={() => setView('gallery')} number={mockups.length} />
          <NavButton icon={<Sparkles size={22} />} label="Prompts" active={view === 'prompt-builder'} onClick={() => setView('prompt-builder')} />
        </div>

        <div className="mt-auto flex flex-col gap-6">
          <button className="p-3 text-on-surface/30 hover:text-primary transition-colors"><Globe size={20}/></button>
          <div className="w-10 h-10 rounded-full bg-surface-low border border-outline-variant/20 flex items-center justify-center text-[10px] font-black">MP</div>
        </div>
      </nav>

      {/* --- MOBILE HEADER --- */}
      <header className="xl:hidden fixed top-0 left-0 right-0 h-20 bg-surface-lowest/80 backdrop-blur-xl border-b border-outline-variant/10 z-[60] px-6 flex items-center justify-between">
        <div className="flex items-center gap-3" onClick={() => setView('dashboard')}>
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
            <Package size={22} strokeWidth={2.5} />
          </div>
          <span className="font-black tracking-tighter text-xl uppercase">Luminous</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-on-surface">
          {mobileMenuOpen ? <X size={28}/> : <Menu size={28}/>}
        </button>
      </header>

      {/* --- MOBILE MENU --- */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[55] bg-surface-lowest pt-24 px-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            {[
              { id: 'dashboard', label: 'Home', icon: <Layout/> },
              { id: 'assets', label: 'Assets', icon: <Box/> },
              { id: 'forge', label: 'Forge', icon: <Wand2/> },
              { id: 'studio', label: 'Studio', icon: <Shirt/> },
              { id: 'gallery', label: 'Gallery', icon: <ImageIcon/> },
              { id: 'prompt-builder', label: 'Prompts', icon: <Sparkles/> }
            ].map(item => (
              <button 
                key={item.id}
                onClick={() => { setView(item.id as AppView); setMobileMenuOpen(false); }}
                className={`flex items-center gap-6 p-6 rounded-3xl text-xl font-black uppercase tracking-widest transition-all
                  ${view === item.id ? 'bg-primary text-white' : 'bg-surface-low text-on-surface/60'}
                `}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="xl:pl-24 pt-20 xl:pt-0 min-h-screen">
        <div className="max-w-[1600px] mx-auto p-6 md:p-12 xl:p-20">
          
          {/* View Header / Stepper */}
          {view !== 'dashboard' && view !== 'prompt-builder' && view !== 'nuevaversion' && (
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-2">
                <p className="text-primary font-black uppercase tracking-[0.4em] text-xs">The Radiant Curator</p>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                  {view === 'assets' && 'Foundry'}
                  {view === 'forge' && 'Optical Forge'}
                  {view === 'studio' && 'Spatial Studio'}
                  {view === 'gallery' && 'Exhibition'}
                </h1>
              </div>
              <WorkflowStepper currentView={view} onViewChange={setView} />
            </div>
          )}

          {/* --- VIEW ROUTER --- */}
          <div className="relative">
            {view === 'dashboard' && (
              <div className="space-y-24">
                <DashboardView onEnterForge={() => setView('assets')} />
                <HeroSection />
                <BenefitsGrid />
                <FeaturedProducts />
                <PromoBanner />
                <Newsletter />
              </div>
            )}

            {view === 'assets' && (
              <div className="space-y-12">
                <AssetSection 
                  title="Product Foundry" 
                  description="Base merchandise for optical synthesis." 
                  assets={assets.filter(a => a.type === 'product')} 
                  onAdd={(data) => handleAddAsset({ id: Math.random().toString(36).substr(2, 9), type: 'product', name: 'Product', data, mimeType: 'image/png' })}
                  onRemove={handleRemoveAsset}
                  onSynthesize={(p) => handleSynthesizeAsset('product', p)}
                  isGenerating={loading.isGenerating}
                />
                <AssetSection 
                  title="Identifier Forge" 
                  description="Logos and brand marks for projection." 
                  assets={assets.filter(a => a.type === 'logo')} 
                  onAdd={(data) => handleAddAsset({ id: Math.random().toString(36).substr(2, 9), type: 'logo', name: 'Logo', data, mimeType: 'image/png' })}
                  onRemove={handleRemoveAsset}
                  onSynthesize={(p) => handleSynthesizeAsset('logo', p)}
                  isGenerating={loading.isGenerating}
                />
                <AssetSection 
                  title="Spatial Models" 
                  description="3D geometries for multi-angle visualization." 
                  assets={assets.filter(a => a.type === 'model3d')} 
                  onAdd={(data) => handleAddAsset({ id: Math.random().toString(36).substr(2, 9), type: 'model3d', name: '3D Model', data, mimeType: 'model/gltf-binary' })}
                  onRemove={handleRemoveAsset}
                  onSynthesize={(p) => handleSynthesizeAsset('model3d', p)}
                  isGenerating={loading.isGenerating}
                />
              </div>
            )}

            {view === 'forge' && (
              <ForgeView assets={assets} onApiError={handleApiError} onGeneratePrompts={generatePrompts} />
            )}

            {view === 'studio' && (
              <StudioView 
                assets={assets}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerateMockup}
                isGenerating={loading.isGenerating}
                loadingMessage={loading.message}
              />
            )}

            {view === 'gallery' && (
              <GalleryView 
                mockups={mockups} 
                onNewCreation={() => setView('studio')} 
                onInspect={setInspectingMockup} 
              />
            )}

            {view === 'prompt-builder' && <PromptBuilderPage />}
          </div>
        </div>
      </main>

      {/* --- LIGHTBOX --- */}
      {inspectingMockup && (
        <Lightbox mockup={inspectingMockup} onClose={() => setInspectingMockup(null)} />
      )}
    </div>
  );
};

export default App;
