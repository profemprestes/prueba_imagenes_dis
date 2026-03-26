import React from 'react';
import { ImageIcon, Plus, Maximize, Download } from 'lucide-react';
import { Button } from '../../components/Button';

interface GeneratedMockup {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: string;
  layers?: any[];
}

interface GalleryViewProps {
  mockups: GeneratedMockup[];
  onNewCreation: () => void;
  onInspect: (mockup: GeneratedMockup) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ mockups, onNewCreation, onInspect }) => (
  <div className="animate-fade-in space-y-12">
    <div className="flex items-center justify-between">
      <h2 className="text-4xl font-black tracking-tighter uppercase">Exhibition</h2>
      <Button variant="outline" onClick={onNewCreation} icon={<Plus size={16}/>}>New Creation</Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {mockups.map(mockup => (
          <div key={mockup.id} className="group glass p-4 rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-xl shadow-on-surface/5 transition-all duration-500 hover:shadow-primary/10">
            <div className="aspect-square bg-surface-low rounded-[2rem] relative overflow-hidden">
                <img src={mockup.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Mockup" />
                <div className="absolute inset-0 bg-surface-lowest/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    icon={<Maximize size={18}/>}
                    onClick={() => onInspect(mockup)}
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
      {mockups.length === 0 && (
          <div className="col-span-full py-32 text-center glass rounded-[3rem] border border-outline-variant/10">
            <div className="w-24 h-24 bg-surface-low rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <ImageIcon size={40} className="text-on-surface/10" />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4">Gallery Empty</h3>
            <p className="text-on-surface/40 mb-10 max-w-sm mx-auto">Your optical experiments will appear here once synthesized in the studio.</p>
            <Button onClick={onNewCreation} size="lg">Go to Studio</Button>
          </div>
      )}
    </div>
  </div>
);
