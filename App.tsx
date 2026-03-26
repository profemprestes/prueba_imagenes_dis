/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Box, Image as ImageIcon, Wand2, Layers, Plus, Trash2, Download, History, Sparkles, Shirt, Move, Maximize, RotateCcw, Zap, Cpu, ArrowRight, Globe, Scan, Camera, Aperture, Repeat, SprayCan, Triangle, Package, Menu, X, Check, MousePointer2 } from 'lucide-react';
import { Button } from './components/Button';
import { FileUploader } from './components/FileUploader';
import { generateMockup, generateAsset, generatePrompts } from './services/geminiService';
import { Asset, GeneratedMockup, AppView, LoadingState, PlacedLayer } from './types';
import PromptBuilderPage from './PromptBuilderPage';
import { Toaster } from './components/ui/sonner';

// Import Home Components
import { HeroSection } from './components/home/hero-section';
import { BenefitsGrid } from './components/home/benefits-grid';
import { FeaturedProducts } from './components/home/featured-products';
import { PromoBanner } from './components/home/promo-banner';
import { Newsletter } from './components/home/newsletter';

import '@google/model-viewer';

// --- Intro Animation Component ---

const IntroSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'enter' | 'wait' | 'spray' | 'admire' | 'exit' | 'prism' | 'explode'>('enter');

  useEffect(() => {
    // Cinematic Timeline
    const schedule = [
      { t: 100, fn: () => setPhase('enter') },      // Bot walks in
      { t: 1800, fn: () => setPhase('wait') },      // Stops, looks around
      { t: 2400, fn: () => setPhase('spray') },     // Spray can enters & sprays
      { t: 4000, fn: () => setPhase('admire') },    // Spray done, bot looks at self
      { t: 5000, fn: () => setPhase('exit') },      // Bot runs away
      { t: 5600, fn: () => setPhase('prism') },     // Logo forms
      { t: 7800, fn: () => setPhase('explode') },   // Boom
      { t: 8500, fn: () => onComplete() }           // Done
    ];

    const timers = schedule.map(s => setTimeout(s.fn, s.t));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden font-sans select-none
      ${phase === 'explode' ? 'animate-[fadeOut_1s_ease-out_forwards] pointer-events-none' : ''}
    `}>
      {/* Flash Overlay for Explosion */}
      <div className={`absolute inset-0 bg-white pointer-events-none z-50 transition-opacity duration-300 ease-out ${phase === 'explode' ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(175,39,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(175,39,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"></div>

      {/* STAGE AREA - Scaled for mobile */}
      <div className="relative w-full max-w-4xl h-96 flex items-center justify-center scale-[0.6] md:scale-100">

        {/* --- CHARACTER: THE BOX BOT --- */}
        {(phase !== 'prism' && phase !== 'explode') && (
          <div className={`relative z-10 flex flex-col items-center transition-transform will-change-transform
             ${phase === 'enter' ? 'animate-[hopIn_1.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]' : ''}
             ${phase === 'exit' ? 'animate-[anticipateSprint_0.8s_ease-in_forwards]' : ''}
          `}>
             {/* Body */}
             <div className={`w-32 h-36 bg-surface-lowest rounded-xl relative overflow-hidden shadow-2xl transition-all duration-300 border-4
                ${phase === 'spray' || phase === 'admire' || phase === 'exit' 
                  ? 'border-primary shadow-[0_0_40px_rgba(175,39,0,0.3)]' 
                  : 'border-outline-variant/20'}
             `}>
                
                {/* Blank Package Tape (Hidden after spray) */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-surface-low transition-opacity duration-200 ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-0' : 'opacity-100'}`}></div>

                {/* Face Screen */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-10 bg-on-surface rounded-md flex items-center justify-center gap-4 overflow-hidden border border-outline-variant shadow-inner z-20">
                   {/* Eyes */}
                   <div className={`w-2 h-2 bg-primary-container rounded-full transition-all duration-300 ${phase === 'spray' ? 'scale-y-10 bg-yellow-400' : 'animate-pulse'}`}></div>
                   <div className={`w-2 h-2 bg-primary-container rounded-full transition-all duration-300 ${phase === 'spray' ? 'scale-y-10 bg-yellow-400' : 'animate-pulse'}`}></div>
                </div>

                {/* BRAND REVEAL: Logo & Color Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-orange-400 transition-opacity duration-500 ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-100' : 'opacity-0'}`}></div>
                
                {/* White Flash on Transform */}
                <div className={`absolute inset-0 bg-white mix-blend-overlay pointer-events-none ${phase === 'spray' ? 'animate-[flash_0.2s_ease-out]' : 'opacity-0'}`}></div>

                {/* Logo Icon */}
                <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-500 transform z-20
                   ${phase === 'spray' || phase === 'admire' || phase === 'exit' ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'}
                `}>
                   <div className="w-10 h-10 bg-white text-primary rounded flex items-center justify-center shadow-lg">
                      <Package size={24} strokeWidth={3} />
                   </div>
                </div>
             </div>

             {/* Legs */}
             <div className="flex gap-10 -mt-1 z-0">
                <div className={`w-3 h-8 bg-on-surface rounded-b-full origin-top ${phase === 'enter' ? 'animate-[legMove_0.2s_infinite_alternate]' : ''} ${phase === 'exit' ? 'animate-[legMove_0.1s_infinite_alternate]' : ''}`}></div>
                <div className={`w-3 h-8 bg-on-surface rounded-b-full origin-top ${phase === 'enter' ? 'animate-[legMove_0.2s_infinite_alternate-reverse]' : ''} ${phase === 'exit' ? 'animate-[legMove_0.1s_infinite_alternate-reverse]' : ''}`}></div>
             </div>
          </div>
        )}

        {/* --- SPRAY CAN ACTOR --- */}
        {phase === 'spray' && (
          <div className="absolute z-20 animate-[swoopIn_0.4s_cubic-bezier(0.17,0.67,0.83,0.67)_forwards]" style={{ right: '22%', top: '5%' }}>
             <div className="relative animate-[shake_0.15s_infinite]">
                <SprayCan size={80} className="text-on-surface/20 fill-on-surface rotate-[-15deg] drop-shadow-2xl" />
                
                {/* Spray Nozzle Mist */}
                <div className="absolute top-0 -left-4 w-6 h-6 bg-white rounded-full blur-md animate-ping"></div>
                
                {/* Particle Stream */}
                <div className="absolute top-4 -left-8 w-40 h-40 pointer-events-none overflow-visible">
                   {[...Array(20)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-primary to-primary-container rounded-full animate-[sprayParticle_0.4s_linear_forwards]"
                        style={{ 
                           top: Math.random() * 20, 
                           left: 0,
                           animationDelay: `${Math.random() * 0.3}s`,
                        }}
                      />
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* --- FINALE --- */}
        {(phase === 'prism' || phase === 'explode') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
             {/* Logo Icon */}
             <div className={`relative w-32 h-32 animate-[spinAppear_1.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards]`}>
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_50px_rgba(175,39,0,0.3)]">
                   <defs>
                      <linearGradient id="prismStroke" x1="0" y1="0" x2="1" y2="1">
                         <stop offset="0%" stopColor="#af2700" />
                         <stop offset="100%" stopColor="#ff7856" />
                      </linearGradient>
                   </defs>
                   <path 
                      d="M50 10 L90 85 L10 85 Z" 
                      fill="none" 
                      stroke="url(#prismStroke)" 
                      strokeWidth="4" 
                      strokeLinejoin="round"
                      className="animate-[drawStroke_1s_ease-out_forwards]"
                   />
                   <path 
                      d="M50 10 L50 85 M50 50 L90 85 M50 50 L10 85" 
                      stroke="url(#prismStroke)" 
                      strokeWidth="1.5" 
                      className="opacity-40"
                   />
                </svg>
             </div>
             
             {/* Text Reveal */}
             <div className="text-center animate-[popIn_0.8s_cubic-bezier(0.17,0.67,0.83,0.67)_0.5s_forwards] opacity-0">
                <h1 className="text-5xl font-black text-on-surface tracking-tighter mb-2">THE LUMINOUS MERCHANT</h1>
                <p className="text-sm text-primary font-sans tracking-[0.3em] uppercase font-bold">Radiant Curation</p>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

// --- UI Components ---

const NavButton = ({ icon, label, active, onClick, number }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, number?: number }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-4 px-6 py-4 rounded-[2rem] transition-all duration-500 group relative overflow-hidden
      ${active ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105 z-10' : 'text-on-surface/40 hover:bg-surface-low hover:text-on-surface'}`}
  >
    <span className={`${active ? 'text-white' : 'text-on-surface/20 group-hover:text-primary'} transition-colors duration-500`}>
      {icon}
    </span>
    <span className="font-display font-black text-xs uppercase tracking-widest flex-1 text-left">{label}</span>
    {number !== undefined && (
      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full min-w-[1.5rem] text-center transition-all duration-500 ${active ? 'bg-white text-primary' : 'bg-surface-low text-on-surface/20'}`}>
        {number}
      </span>
    )}
  </button>
);

const WorkflowStepper = ({ currentView, onViewChange }: { currentView: AppView, onViewChange: (view: AppView) => void }) => {
  const steps = [
    { id: 'assets', label: 'Curation', number: 1 },
    { id: 'studio', label: 'Optical Studio', number: 2 },
    { id: 'gallery', label: 'Exhibition', number: 3 },
  ];

  const viewOrder = ['assets', 'studio', 'gallery'];
  const currentIndex = viewOrder.indexOf(currentView);
  const progress = Math.max(0, (currentIndex / (steps.length - 1)) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto mb-24 hidden md:block animate-fade-in px-8">
      <div className="relative">
         {/* Background Track */}
         <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-surface-low -translate-y-1/2 rounded-full"></div>
         
         {/* Active Progress Bar */}
         <div 
            className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000 ease-in-out"
            style={{ width: `${progress}%` }}
         ></div>

         <div className="relative flex justify-between w-full">
            {steps.map((step, index) => {
               const isCompleted = currentIndex > index;
               const isCurrent = currentIndex === index;
               
               return (
                  <button 
                    key={step.id}
                    onClick={() => onViewChange(step.id as AppView)}
                    className={`group flex flex-col items-center focus:outline-none relative z-10 cursor-pointer`}
                  >
                     <div className={`
                        w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-700 bg-background
                        ${isCurrent 
                           ? 'border-primary text-primary shadow-[0_0_40px_rgba(175,39,0,0.15)] scale-110' 
                           : isCompleted 
                              ? 'border-primary bg-primary text-white' 
                              : 'border-surface-low text-on-surface/10 group-hover:border-primary/30 group-hover:text-on-surface/30'}
                     `}>
                        {isCompleted ? (
                           <Check size={24} strokeWidth={4} />
                        ) : (
                           <span className="text-base font-black">{step.number}</span>
                        )}
                     </div>
                     <span className={`
                        absolute top-20 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 whitespace-nowrap
                        ${isCurrent ? 'text-primary opacity-100 transform translate-y-0' : isCompleted ? 'text-on-surface/30 opacity-80' : 'text-on-surface/10 opacity-60 group-hover:opacity-100'}
                     `}>
                        {step.label}
                     </span>
                  </button>
               )
            })}
         </div>
      </div>
    </div>
  )
};

// Helper component for Asset Sections
const AssetSection = ({ 
  title, 
  icon, 
  type, 
  assets, 
  onAdd, 
  onRemove,
  onApiError
}: { 
  title: string, 
  icon: React.ReactNode, 
  type: 'logo' | 'product' | 'model3d', 
  assets: Asset[], 
  onAdd: (a: Asset) => void, 
  onRemove: (id: string) => void,
  onApiError: (e: any) => void
}) => {
  const [mode, setMode] = useState<'upload' | 'generate'>('upload');
  const [genPrompt, setGenPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!genPrompt) return;
    
    setIsGenerating(true);
    try {
      const b64 = await generateAsset(genPrompt, type);
      onAdd({
        id: Math.random().toString(36).substring(7),
        type,
        name: `AI Generated ${type}`,
        data: b64,
        mimeType: 'image/png'
      });
      setGenPrompt('');
    } catch (e: any) {
      console.error(e);
      onApiError(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass p-10 rounded-[2.5rem] h-full flex flex-col border border-outline-variant/10 shadow-xl shadow-on-surface/5">
      <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-4 uppercase">{icon} {title}</h2>
          <span className="text-[10px] font-black bg-primary/10 px-3 py-1.5 rounded-full text-primary uppercase tracking-widest">{assets.length} items</span>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10 overflow-y-auto max-h-[450px] pr-4 custom-scrollbar">
          {assets.map(asset => (
            <div key={asset.id} className="relative group aspect-square bg-surface-low rounded-[2rem] overflow-hidden border border-outline-variant/10 hover:border-primary/30 transition-all duration-500">
                {asset.type === 'model3d' ? (
                  /* @ts-ignore */
                  <model-viewer
                    src={asset.data}
                    camera-controls
                    auto-rotate
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <img src={asset.data} className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110" alt={asset.name} />
                )}
                <button onClick={() => onRemove(asset.id)} className="absolute top-4 right-4 p-2 bg-primary text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl border-2 border-surface-lowest z-10">
                  <Trash2 size={16} strokeWidth={3} />
                </button>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="col-span-2 sm:col-span-3 flex flex-col items-center justify-center h-56 text-on-surface/10 border-2 border-dashed border-outline-variant/10 rounded-[2rem]">
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Curation</p>
            </div>
          )}
      </div>

      {/* Creation Area */}
      <div className="mt-auto pt-8 border-t border-outline-variant/10">
        <div className="flex gap-8 mb-8">
           <button 
             onClick={() => setMode('upload')}
             className={`text-[10px] font-black uppercase tracking-[0.25em] pb-3 border-b-2 transition-all duration-500 ${mode === 'upload' ? 'border-primary text-primary' : 'border-transparent text-on-surface/20 hover:text-on-surface/40'}`}
           >
             Curation
           </button>
           <button 
             onClick={() => setMode('generate')}
             disabled={type === 'model3d'}
             className={`text-[10px] font-black uppercase tracking-[0.25em] pb-3 border-b-2 transition-all duration-500 ${mode === 'generate' ? 'border-primary text-primary' : 'border-transparent text-on-surface/20 hover:text-on-surface/40'} ${type === 'model3d' ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
             AI Synthesis
           </button>
        </div>

        {mode === 'upload' ? (
           <FileUploader 
             label={`Upload ${type === 'model3d' ? '3D Model (.glb, .gltf)' : type}`} 
             accept={type === 'model3d' ? '.glb,.gltf' : 'image/*'}
             onFileSelect={(f) => {
              const reader = new FileReader();
              reader.onload = (e) => {
                onAdd({
                  id: Math.random().toString(36).substring(7),
                  type,
                  name: f.name,
                  data: e.target?.result as string,
                  mimeType: f.type
                });
              };
              if (type === 'model3d') {
                // For 3D models, we can also use URL.createObjectURL for better performance, 
                // but DataURL is consistent with current implementation.
                reader.readAsDataURL(f);
              } else {
                reader.readAsDataURL(f);
              }
           }} />
        ) : (
           <div className="space-y-6">
              <textarea 
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                placeholder={`Describe the ${type} to synthesize...`}
                className="w-full bg-surface-low border border-outline-variant/10 rounded-2xl p-6 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none h-36 placeholder:text-on-surface/20 transition-all"
              />
              <Button 
                onClick={handleGenerate} 
                isLoading={isGenerating} 
                disabled={!genPrompt}
                className="w-full py-6"
                icon={<Sparkles size={20} />}
              >
                Synthesize {type}
              </Button>
           </div>
        )}
      </div>
    </div>
  );
};


// --- Forge View Component ---

const ForgeView = ({ 
  assets, 
  onApiError 
}: { 
  assets: Asset[], 
  onApiError: (e: any) => void 
}) => {
  const [sourceCode, setSourceCode] = useState('');
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [targetType, setTargetType] = useState<'image' | 'animation' | 'video' | 'code'>('image');
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);
  const [isForging, setIsForging] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleForge = async () => {
    if (!sourceCode && selectedAssetIds.length === 0) return;
    
    setIsForging(true);
    try {
      const selectedAssets = assets.filter(a => selectedAssetIds.includes(a.id));
      const prompts = await generatePrompts(sourceCode, selectedAssets, targetType);
      setSuggestedPrompts(prompts);
    } catch (e: any) {
      onApiError(e);
    } finally {
      setIsForging(false);
    }
  };

  const toggleAsset = (id: string) => {
    setSelectedAssetIds(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="animate-fade-in space-y-12">
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Input Side */}
        <div className="flex-1 space-y-8">
          <div className="glass p-8 rounded-3xl space-y-6 border border-outline-variant/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
                <Zap className="text-primary" /> PROMPT FORGE
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setSourceCode(''); setSelectedAssetIds([]); setSuggestedPrompts([]); }}
                className="text-[10px] font-black uppercase tracking-widest"
              >
                Clear All
              </Button>
            </div>
            <p className="text-on-surface/60 text-lg leading-relaxed">
              Paste code (TSX/HTML) or describe your vision. Attach images to refine the prompt.
            </p>
            
            <textarea 
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="Paste TSX, HTML, or a detailed description here..."
              className="w-full bg-surface-low border border-outline-variant/10 rounded-2xl p-6 text-sm font-mono text-primary focus:ring-2 focus:ring-primary/20 focus:outline-none h-80 resize-none placeholder:text-on-surface/20 transition-all"
            />

            <div className="flex flex-wrap items-center gap-6">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-on-surface/40">Target Output:</span>
              <div className="flex bg-surface-low p-1 rounded-full border border-outline-variant/10">
                {(['image', 'animation', 'video', 'code'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setTargetType(type)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                      ${targetType === type ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-on-surface/40 hover:text-on-surface'}
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleForge} 
              isLoading={isForging} 
              disabled={!sourceCode && selectedAssetIds.length === 0}
              className="w-full py-6 text-lg"
              icon={<Zap size={24} />}
            >
              {targetType === 'code' ? 'Forge Improved Code' : 'Forge Prompts'}
            </Button>
          </div>
        </div>

        {/* Asset Selection Side */}
        <div className="w-full xl:w-96 space-y-8">
          <div className="glass p-8 rounded-3xl h-full flex flex-col border border-outline-variant/10">
            <h3 className="text-xs font-black text-on-surface/40 uppercase tracking-[0.2em] mb-6">Reference Assets</h3>
            <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {assets.map(asset => (
                <div 
                  key={asset.id} 
                  onClick={() => toggleAsset(asset.id)}
                  className={`relative aspect-square rounded-2xl border-2 cursor-pointer p-2 transition-all duration-300
                    ${selectedAssetIds.includes(asset.id) ? 'border-primary bg-primary/5' : 'border-outline-variant/10 hover:border-primary/30 bg-surface-low'}
                  `}
                >
                  <img src={asset.data} className="w-full h-full object-contain transition-transform duration-500 hover:scale-110" alt={asset.name} />
                  {selectedAssetIds.includes(asset.id) && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-lg">
                      <Check size={12} strokeWidth={4} />
                    </div>
                  )}
                </div>
              ))}
              {assets.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center py-20 text-on-surface/20">
                  <p className="text-xs font-black uppercase tracking-widest">No assets yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {suggestedPrompts.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
          <h3 className="text-3xl font-black tracking-tighter flex items-center gap-4 uppercase">
            <Sparkles className="text-primary" /> {targetType === 'code' ? 'Forged Code Suggestions' : 'Forged Prompts'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {suggestedPrompts.map((p, i) => (
              <div key={i} className="glass p-8 rounded-[2.5rem] border-l-8 border-primary flex flex-col justify-between shadow-xl shadow-on-surface/5 hover:shadow-primary/10 transition-all duration-500 border-y border-r border-outline-variant/10">
                <div className="mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 block">Option {i + 1}</span>
                  <p className={`text-on-surface/70 leading-relaxed ${targetType === 'code' ? 'font-mono text-xs bg-surface-low p-4 rounded-xl overflow-x-auto whitespace-pre-wrap' : 'italic text-lg'}`}>
                    {targetType === 'code' ? p : `"${p}"`}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="w-full py-4 text-[10px] font-black uppercase tracking-widest"
                  onClick={() => copyToClipboard(p, i)}
                  icon={copiedIndex === i ? <Check size={18} className="text-green-600" /> : <Download size={18} />}
                >
                  {copiedIndex === i ? 'Copied to Clipboard' : (targetType === 'code' ? 'Copy Code' : 'Copy Prompt')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- App Component ---

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<AppView>('dashboard');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [generatedMockups, setGeneratedMockups] = useState<GeneratedMockup[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedMockup, setSelectedMockup] = useState<GeneratedMockup | null>(null); // State for lightbox

  // Form states for generation
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [placedLogos, setPlacedLogos] = useState<PlacedLayer[]>([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState<LoadingState>({ isGenerating: false, message: '' });

  // API Error Handling Logic
  const handleApiError = (error: any) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Operation failed: ${errorMessage}`);
  };

  // State for Dragging
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedItem, setDraggedItem] = useState<{ uid: string, startX: number, startY: number, initX: number, initY: number } | null>(null);

  // Demo assets on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 9000);
    return () => clearTimeout(timer);
  }, []);

  // -- LOGO PLACEMENT HANDLERS --

  const addLogoToCanvas = (assetId: string) => {
    // Add new instance of logo to canvas at center
    const newLayer: PlacedLayer = {
      uid: Math.random().toString(36).substr(2, 9),
      assetId,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    };
    setPlacedLogos(prev => [...prev, newLayer]);
  };

  const removeLogoFromCanvas = (uid: string, e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setPlacedLogos(prev => prev.filter(l => l.uid !== uid));
  };

  const handleStart = (clientX: number, clientY: number, layer: PlacedLayer) => {
    setDraggedItem({
      uid: layer.uid,
      startX: clientX,
      startY: clientY,
      initX: layer.x,
      initY: layer.y
    });
  };

  const handleMouseDown = (e: React.MouseEvent, layer: PlacedLayer) => {
    e.preventDefault();
    e.stopPropagation();
    handleStart(e.clientX, e.clientY, layer);
  };

  const handleTouchStart = (e: React.TouchEvent, layer: PlacedLayer) => {
    e.stopPropagation(); // Prevent scrolling initiation if possible
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY, layer);
  };

  const handleWheel = (e: React.WheelEvent, layerId: string) => {
     e.stopPropagation();
     // Simple scale on scroll
     const delta = e.deltaY > 0 ? -0.1 : 0.1;
     setPlacedLogos(prev => prev.map(l => {
        if (l.uid !== layerId) return l;
        const newScale = Math.max(0.2, Math.min(3.0, l.scale + delta));
        return { ...l, scale: newScale };
     }));
  };

  // Global mouse/touch move for dragging
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!draggedItem || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaX = clientX - draggedItem.startX;
      const deltaY = clientY - draggedItem.startY;

      // Convert pixels to percentage
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;

      setPlacedLogos(prev => prev.map(l => {
        if (l.uid !== draggedItem.uid) return l;
        return {
          ...l,
          x: Math.max(0, Math.min(100, draggedItem.initX + deltaXPercent)),
          y: Math.max(0, Math.min(100, draggedItem.initY + deltaYPercent))
        };
      }));
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      setDraggedItem(null);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (draggedItem) {
         e.preventDefault(); // Prevent scrolling while dragging
         handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchEnd = () => {
      setDraggedItem(null);
    };

    if (draggedItem) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false }); // passive: false needed for preventDefault
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [draggedItem]);


  const handleGenerate = async () => {
    // We don't return early for empty selections here so we can give better user feedback
    if (!selectedProductId && placedLogos.length === 0) {
        // Although button is disabled, safety check
        return;
    }
    
    const product = assets.find(a => a.id === selectedProductId);
    if (!product) {
        alert("Selected product not found. Please select a product.");
        // Deselect the invalid ID so the UI updates
        setSelectedProductId(null);
        return;
    }

    // Prepare all layers
    const layers = placedLogos.map(layer => {
        const asset = assets.find(a => a.id === layer.assetId);
        return asset ? { asset, placement: layer } : null;
    }).filter(Boolean) as { asset: Asset, placement: PlacedLayer }[];

    if (layers.length === 0) {
         alert("No valid logos found on canvas. Please add a logo.");
         return;
    }

    const currentPrompt = prompt;

    setLoading({ isGenerating: true, message: 'Analyzing composite geometry...' });
    try {
      const resultImage = await generateMockup(product, layers, currentPrompt);
      
      const newMockup: GeneratedMockup = {
        id: Math.random().toString(36).substring(7),
        imageUrl: resultImage,
        prompt: currentPrompt,
        createdAt: Date.now(),
        layers: placedLogos, // Save the layout
        productId: selectedProductId
      };
      
      setGeneratedMockups(prev => [newMockup, ...prev]);
      setView('gallery');
    } catch (e: any) {
      console.error(e);
      handleApiError(e);
    } finally {
      setLoading({ isGenerating: false, message: '' });
    }
  };

  if (showIntro) {
    return <IntroSequence onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans flex overflow-hidden relative">
      
      {/* Sidebar Navigation (Desktop) */}
      <aside className="w-64 border-r border-outline-variant/20 bg-surface-lowest/50 hidden md:flex flex-col">
        <div className="h-20 border-b border-outline-variant/20 flex items-center px-8">
          <Package className="text-primary mr-3" size={24} />
          <span className="font-display font-black text-xl tracking-tighter uppercase">LUMINOUS</span>
        </div>

        <div className="p-6 space-y-3 flex-1">
          <NavButton 
            icon={<Layout size={20} />} 
            label="Dashboard" 
            active={view === 'dashboard'} 
            onClick={() => setView('dashboard')} 
          />
          <NavButton 
            icon={<Box size={20} />} 
            label="Assets" 
            active={view === 'assets'} 
            number={assets.length}
            onClick={() => setView('assets')} 
          />
          <NavButton 
            icon={<Wand2 size={20} />} 
            label="Studio" 
            active={view === 'studio'} 
            number={generatedMockups.length}
            onClick={() => setView('studio')} 
          />
          <NavButton 
            icon={<ImageIcon size={20} />} 
            label="Gallery" 
            active={view === 'gallery'} 
            onClick={() => setView('gallery')} 
          />
          <NavButton 
            icon={<Zap size={20} />} 
            label="Prompt Forge" 
            active={view === 'forge'} 
            onClick={() => setView('forge')} 
          />
          <NavButton 
            icon={<Sparkles size={20} />} 
            label="Prompt Studio" 
            active={view === 'prompt-builder'} 
            onClick={() => setView('prompt-builder')} 
          />
          <NavButton 
            icon={<Globe size={20} />} 
            label="Nueva Versión" 
            active={view === 'nuevaversion'} 
            onClick={() => setView('nuevaversion')} 
          />
        </div>

        <div className="p-6 border-t border-outline-variant/10">
          <div className="p-6 rounded-3xl bg-surface-low/50 border border-outline-variant/10 text-center">
             <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-4">Merchant Support</p>
             <Button size="sm" variant="outline" className="w-full text-[10px] font-black uppercase tracking-widest">Documentation</Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface-lowest/80 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-6 z-50">
        <div className="flex items-center">
          <Package className="text-primary mr-2" size={20} />
          <span className="font-display font-black text-lg tracking-tighter uppercase">LUMINOUS</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-on-surface/60 hover:text-primary transition-colors">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-surface-lowest/95 backdrop-blur-2xl p-6 animate-fade-in flex flex-col">
          <div className="space-y-3">
            <NavButton 
              icon={<Layout size={20} />} 
              label="Dashboard" 
              active={view === 'dashboard'} 
              onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<Box size={20} />} 
              label="Assets" 
              active={view === 'assets'} 
              onClick={() => { setView('assets'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<Wand2 size={20} />} 
              label="Studio" 
              active={view === 'studio'} 
              onClick={() => { setView('studio'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<ImageIcon size={20} />} 
              label="Gallery" 
              active={view === 'gallery'} 
              onClick={() => { setView('gallery'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<Zap size={20} />} 
              label="Prompt Forge" 
              active={view === 'forge'} 
              onClick={() => { setView('forge'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<Sparkles size={20} />} 
              label="Prompt Studio" 
              active={view === 'prompt-builder'} 
              onClick={() => { setView('prompt-builder'); setIsMobileMenuOpen(false); }} 
            />
            <NavButton 
              icon={<Globe size={20} />} 
              label="Nueva Versión" 
              active={view === 'nuevaversion'} 
              onClick={() => { setView('nuevaversion'); setIsMobileMenuOpen(false); }} 
            />
          </div>
          
          <div className="mt-auto pb-12 border-t border-outline-variant/10 pt-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/20 text-center">Luminous Merchant v2.5</p>
          </div>
        </div>
      )}


      {/* Lightbox Modal */}
      {selectedMockup && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setSelectedMockup(null)}
        >
          <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMockup(null)}
              className="absolute top-4 right-4 md:top-0 md:-right-12 p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-colors z-50 border border-zinc-700"
            >
              <X size={24} />
            </button>

            {/* Image Container */}
            <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-lg">
              <img 
                src={selectedMockup.imageUrl} 
                alt="Full size preview" 
                className="max-w-full max-h-[85vh] object-contain shadow-2xl" 
              />
            </div>

            {/* Caption / Actions */}
            <div className="mt-4 bg-zinc-900/90 backdrop-blur border border-zinc-700 px-6 py-3 rounded-full flex items-center gap-4">
               <p className="text-sm text-zinc-300 max-w-[200px] md:max-w-md truncate">
                 {selectedMockup.prompt || "Generated Mockup"}
               </p>
               <div className="h-4 w-px bg-zinc-700"></div>
               <a 
                 href={selectedMockup.imageUrl} 
                 download={`mockup-${selectedMockup.id}.png`}
                 className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-2"
               >
                 <Download size={16} />
                 Download
               </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0 bg-background">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 h-16 bg-background/80 backdrop-blur-md border-b border-outline-variant/10 flex items-center justify-between px-8">
           <div className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">
              <span className="opacity-50">App</span> 
              <span className="mx-2">/</span> 
              <span className="text-on-surface">{view}</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-low border border-outline-variant/10 text-[10px] font-black uppercase tracking-widest text-on-surface/60">
                <Sparkles size={12} className="text-primary" />
                Credits: ∞
              </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto p-8 md:p-16">
           
           {/* --- DASHBOARD VIEW --- */}
           {view === 'dashboard' && (
              <div className="animate-fade-in space-y-16">
                 <div className="text-center py-20">
                    <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
                       Luminous <br/>
                       <span className="text-primary">Merchant</span>
                    </h1>
                    <p className="text-on-surface/60 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                       The definitive suite for high-fidelity merchandise visualization. Forge reality from code and light.
                    </p>
                    <Button size="lg" onClick={() => setView('assets')} icon={<ArrowRight size={20} />} className="px-12 py-8 text-xl">
                       Enter the Forge
                    </Button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                       { icon: <Box className="text-primary" />, title: 'Asset Foundry', desc: 'Curate your collection of base products and brand identifiers.' },
                       { icon: <Wand2 className="text-primary" />, title: 'Optical Studio', desc: 'Advanced spatial compositing with realistic surface mapping.' },
                       { icon: <Download className="text-primary" />, title: 'Export Engine', desc: 'High-resolution production assets for immediate deployment.' }
                    ].map((feat, i) => (
                       <div key={i} className="p-10 rounded-[2.5rem] bg-surface-lowest border border-outline-variant/10 hover:border-primary/20 transition-all duration-500 group">
                          <div className="mb-8 p-4 bg-surface-low w-fit rounded-2xl group-hover:scale-110 transition-transform">{feat.icon}</div>
                          <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{feat.title}</h3>
                          <p className="text-on-surface/50 leading-relaxed">{feat.desc}</p>
                       </div>
                    ))}
                 </div>
                 
                 <footer className="mt-32 pt-12 border-t border-outline-variant/10 text-center">
                    <p className="text-on-surface/30 text-[10px] font-black uppercase tracking-[0.2em] max-w-3xl mx-auto leading-loose">
                       "By using this app, you confirm that you have the necessary rights to any content that you upload. Do not generate content that infringes on others’ intellectual property or privacy rights. Your use of this generative AI service is subject to our Prohibited Use Policy.
                       <br className="hidden md:block" />
                       Please note that uploads from Google Workspace may be used to develop and improve Google products and services in accordance with our terms."
                    </p>
                 </footer>
              </div>
           )}


           {/* --- ASSETS VIEW --- */}
           {view === 'assets' && (
              <div className="animate-fade-in">
                <WorkflowStepper currentView="assets" onViewChange={setView} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Products Section */}
                  <AssetSection 
                    title="Products" 
                    icon={<Box size={20} />}
                    type="product"
                    assets={assets.filter(a => a.type === 'product')}
                    onAdd={(a) => setAssets(prev => [...prev, a])}
                    onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))}
                    onApiError={handleApiError}
                  />

                  {/* Logos Section */}
                  <AssetSection 
                    title="Logos & Graphics" 
                    icon={<Layers size={20} />}
                    type="logo"
                    assets={assets.filter(a => a.type === 'logo')}
                    onAdd={(a) => setAssets(prev => [...prev, a])}
                    onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))}
                    onApiError={handleApiError}
                  />

                  {/* 3D Models Section */}
                  <AssetSection 
                    title="3D Models" 
                    icon={<Package size={20} />}
                    type="model3d"
                    assets={assets.filter(a => a.type === 'model3d')}
                    onAdd={(a) => setAssets(prev => [...prev, a])}
                    onRemove={(id) => setAssets(prev => prev.filter(a => a.id !== id))}
                    onApiError={handleApiError}
                  />
                </div>

                <div className="mt-8 flex justify-end">
                   <Button onClick={() => setView('studio')} disabled={assets.length < 2} icon={<ArrowRight size={16} />}>
                      Continue to Studio
                   </Button>
                </div>
              </div>
           )}

           {/* --- STUDIO VIEW --- */}
           {view === 'studio' && (
             <div className="animate-fade-in h-[calc(100vh-12rem)] flex flex-col-reverse lg:flex-row gap-8">
                {/* Left Controls (Bottom on Mobile) */}
                <div className="w-full lg:w-96 flex flex-col gap-8 glass p-8 rounded-[2rem] overflow-y-auto flex-1 lg:flex-none border border-outline-variant/10 shadow-xl shadow-on-surface/5">
                   <div>
                      <h3 className="text-[10px] font-black text-on-surface/40 uppercase tracking-[0.2em] mb-6">1. Select Product</h3>
                      <div className="grid grid-cols-3 gap-3">
                         {assets.filter(a => a.type === 'product').map(a => (
                            <div 
                               key={a.id} 
                               onClick={() => setSelectedProductId(selectedProductId === a.id ? null : a.id)}
                               className={`aspect-square rounded-2xl border-2 cursor-pointer p-2 transition-all duration-300 ${selectedProductId === a.id ? 'border-primary bg-primary/5' : 'border-outline-variant/10 hover:border-primary/30 bg-surface-low'}`}
                            >
                               <img src={a.data} className="w-full h-full object-contain" alt={a.name} />
                            </div>
                         ))}
                         {assets.filter(a => a.type === 'product').length === 0 && <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/20 col-span-3">No products uploaded</p>}
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
                         {assets.filter(a => a.type === 'logo').map(a => (
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
                         {assets.filter(a => a.type === 'logo').length === 0 && <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/20 col-span-3">No logos uploaded</p>}
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
                      onClick={handleGenerate} 
                      isLoading={loading.isGenerating} 
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
                   {loading.isGenerating && (
                      <div className="absolute inset-0 z-20 bg-surface-lowest/80 backdrop-blur-md flex flex-col items-center justify-center">
                         <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                         <p className="text-primary font-black uppercase tracking-widest text-xs animate-pulse">{loading.message}</p>
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
                            const isDraggingThis = draggedItem?.uid === layer.uid;

                            return (
                               <div
                                  key={layer.uid}
                                  className={`absolute cursor-move group ${isDraggingThis ? 'z-50 opacity-80' : 'z-10'}`}
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
                                    onTouchEnd={(e) => removeLogoFromCanvas(layer.uid, e)}
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
                         <p className="text-on-surface/20 font-black uppercase tracking-widest text-xs">Select a product to begin</p>
                      </div>
                   )}
                </div>
             </div>
           )}


           {/* --- FORGE VIEW --- */}
           {view === 'forge' && (
              <ForgeView 
                assets={assets} 
                onApiError={handleApiError} 
              />
           )}

           {/* --- PROMPT BUILDER VIEW --- */}
           {view === 'prompt-builder' && (
              <PromptBuilderPage />
           )}

           {/* --- NUEVA VERSION VIEW --- */}
           {view === 'nuevaversion' && (
              <div className="animate-fade-in space-y-0 -m-8 md:-m-12 overflow-x-hidden">
                 <HeroSection />
                 <BenefitsGrid />
                 <FeaturedProducts />
                 <PromoBanner />
                 <Newsletter />
              </div>
           )}

           {/* --- GALLERY VIEW --- */}
           {view === 'gallery' && (
              <div className="animate-fade-in space-y-12">
                 <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Exhibition</h2>
                    <Button variant="outline" onClick={() => setView('studio')} icon={<Plus size={16}/>}>New Creation</Button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {generatedMockups.map(mockup => (
                       <div key={mockup.id} className="group glass p-4 rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-xl shadow-on-surface/5 transition-all duration-500 hover:shadow-primary/10">
                          <div className="aspect-square bg-surface-low rounded-[2rem] relative overflow-hidden">
                             <img src={mockup.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Mockup" />
                             <div className="absolute inset-0 bg-surface-lowest/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                                <Button 
                                  size="sm" 
                                  variant="secondary" 
                                  icon={<Maximize size={18}/>}
                                  onClick={() => setSelectedMockup(mockup)}
                                  className="shadow-xl"
                                >
                                  Inspect
                                </Button>
                                <a href={mockup.imageUrl} download={`mockup-${mockup.id}.png`}>
                                  <Button size="sm" variant="primary" icon={<Download size={18}/>} className="shadow-xl">Save</Button>
                                </a>
                             </div>
                          </div>
                          <div className="p-6">
                             <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/20 mb-3">{new Date(mockup.createdAt).toLocaleDateString()}</p>
                             <p className="text-sm text-on-surface/60 line-clamp-2 leading-relaxed italic">"{mockup.prompt || "Optical synthesis result"}"</p>
                             {mockup.layers && mockup.layers.length > 0 && (
                                 <div className="mt-4 flex gap-2">
                                     <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-surface-low rounded-full text-on-surface/40 border border-outline-variant/10">{mockup.layers.length} identifiers</span>
                                 </div>
                             )}
                          </div>
                       </div>
                    ))}
                    {generatedMockups.length === 0 && (
                       <div className="col-span-full py-32 text-center glass rounded-[3rem] border border-outline-variant/10">
                          <div className="w-24 h-24 bg-surface-low rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <ImageIcon size={40} className="text-on-surface/10" />
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Gallery Empty</h3>
                          <p className="text-on-surface/40 mb-10 max-w-sm mx-auto">Your optical experiments will appear here once synthesized in the studio.</p>
                          <Button onClick={() => setView('studio')} size="lg">Go to Studio</Button>
                       </div>
                    )}
                 </div>
              </div>
           )}
        </div>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}