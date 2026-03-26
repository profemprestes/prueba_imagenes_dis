import React, { useState } from 'react';
import { Zap, Sparkles, Check, Download } from 'lucide-react';
import { Button } from '@/components/Button';

import { Asset } from '@/types';

interface ForgeViewProps {
  assets: Asset[];
  onApiError: (e: any) => void;
  onGeneratePrompts: (source: string, assets: Asset[], type: 'image' | 'animation' | 'video' | 'code') => Promise<string[]>;
}

export const ForgeView: React.FC<ForgeViewProps> = ({ assets, onApiError, onGeneratePrompts }) => {
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
      const prompts = await onGeneratePrompts(sourceCode, selectedAssets, targetType);
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
                  className={`relative aspect-square rounded-2xl border-2 cursor-pointer p-2 transition-all duration-500
                    ${selectedAssetIds.includes(asset.id) ? 'border-primary bg-primary/5' : 'border-outline-variant/10 hover:border-primary/30 bg-surface-low'}
                  `}
                >
                {asset.type === 'model3d' ? (
                  /* @ts-ignore */
                  <model-viewer
                    src={asset.data}
                    camera-controls
                    auto-rotate
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <img src={asset.data} className="w-full h-full object-contain transition-transform duration-500 hover:scale-110" alt={asset.name} />
                )}
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
