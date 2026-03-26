import React from 'react';
import { Trash2 } from 'lucide-react';
import { FileUploader } from '@/components/FileUploader';

import { Asset } from '@/types';

interface AssetSectionProps {
  description?: string;
  title: string;
  icon?: React.ReactNode;
  type?: 'product' | 'logo' | 'model3d';
  assets: Asset[];
  onAdd: (data: string) => void;
  onRemove: (id: string) => void;
  onApiError?: (error: any, operation: string, path: string) => void;
  onSynthesize?: (prompt: string) => Promise<void>;
  isGenerating?: boolean;
}

export const AssetSection: React.FC<AssetSectionProps> = ({ title, icon, type, assets, onAdd, onRemove, onApiError }) => {
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

      <div className="mt-auto">
        <FileUploader 
          onFileSelect={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                onAdd(e.target.result as string);
              }
            };
            reader.readAsDataURL(file);
          }}
          accept={type === 'model3d' ? '.glb,.gltf' : 'image/*'}
          label={`Add ${title}`}
        />
      </div>
    </div>
  );
};
