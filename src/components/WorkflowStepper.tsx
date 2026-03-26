import React from 'react';
import { Box, Wand2, Download, ArrowRight } from 'lucide-react';

interface WorkflowStepperProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({ currentView, onViewChange }) => (
  <div className="flex items-center justify-center gap-4 md:gap-12 mb-20 bg-surface-low/30 p-8 rounded-[3rem] border border-outline-variant/10 backdrop-blur-sm">
    {[
      { id: 'assets', label: 'Curation', icon: <Box size={24} />, desc: 'Upload & Manage' },
      { id: 'studio', label: 'Optical Studio', icon: <Wand2 size={24} />, desc: 'Spatial Mapping' },
      { id: 'gallery', label: 'Exhibition', icon: <Download size={24} />, desc: 'Export Assets' }
    ].map((step, i, arr) => (
      <React.Fragment key={step.id}>
        <div 
          onClick={() => onViewChange(step.id)}
          className={`
            flex flex-col items-center gap-4 cursor-pointer group transition-all duration-700
            ${currentView === step.id ? 'scale-110' : 'opacity-40 hover:opacity-100'}
          `}
        >
          <div className={`
            w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-2xl
            ${currentView === step.id ? 'bg-primary text-white shadow-primary/30 rotate-12' : 'bg-surface-lowest text-on-surface/20 group-hover:bg-primary/10 group-hover:text-primary'}
          `}>
            {step.icon}
          </div>
          <div className="text-center">
            <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${currentView === step.id ? 'text-primary' : 'text-on-surface/20'}`}>{step.label}</p>
            <p className="text-[8px] font-black uppercase tracking-widest text-on-surface/10 hidden md:block">{step.desc}</p>
          </div>
        </div>
        {i < arr.length - 1 && (
          <div className="hidden md:block text-on-surface/5 animate-pulse">
            <ArrowRight size={24} strokeWidth={3} />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);
