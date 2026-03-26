import React from 'react';
import { Box, Wand2, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/Button';

interface DashboardViewProps {
  onEnterForge: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onEnterForge }) => (
  <div className="animate-fade-in space-y-16">
    <div className="text-center py-20">
      <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase">
          Luminous <br/>
          <span className="text-primary">Merchant</span>
      </h1>
      <p className="text-on-surface/60 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          The definitive suite for high-fidelity merchandise visualization. Forge reality from code and light.
      </p>
      <Button size="lg" onClick={onEnterForge} icon={<ArrowRight size={20} />} className="px-12 py-8 text-xl">
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
);
