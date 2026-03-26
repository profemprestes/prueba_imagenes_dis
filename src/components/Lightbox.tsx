import React from 'react';
import { X, Download } from 'lucide-react';

interface Mockup {
  id: string;
  imageUrl: string;
  prompt: string;
}

interface LightboxProps {
  mockup: Mockup;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ mockup, onClose }) => (
  <div 
    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" 
    onClick={onClose}
  >
    <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 md:top-0 md:-right-12 p-2 bg-zinc-800 text-white rounded-full hover:bg-zinc-700 transition-colors z-50 border border-zinc-700"
      >
        <X size={24} />
      </button>

      {/* Image Container */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-lg">
        <img 
          src={mockup.imageUrl} 
          alt="Full size preview" 
          className="max-w-full max-h-[85vh] object-contain shadow-2xl" 
        />
      </div>

      {/* Caption / Actions */}
      <div className="mt-4 bg-zinc-900/90 backdrop-blur border border-zinc-700 px-6 py-3 rounded-full flex items-center gap-4">
          <p className="text-sm text-zinc-300 max-w-[200px] md:max-w-md truncate">
            {mockup.prompt || "Generated Mockup"}
          </p>
          <div className="h-4 w-px bg-zinc-700"></div>
          <a 
            href={mockup.imageUrl} 
            download={`mockup-${mockup.id}.png`}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-2"
          >
            <Download size={16} />
            Download
          </a>
      </div>
    </div>
  </div>
);
