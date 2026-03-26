import React from 'react';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  number?: number;
}

export const NavButton: React.FC<NavButtonProps> = ({ icon, label, active, onClick, number }) => (
  <button 
    onClick={onClick}
    className={`
      w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group
      ${active 
        ? 'bg-primary text-white shadow-2xl shadow-primary/20 scale-[1.02] z-10' 
        : 'text-on-surface/40 hover:text-primary hover:bg-primary/5 hover:translate-x-1'
      }
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    {number !== undefined && number > 0 && (
      <span className={`
        text-[10px] font-black px-2.5 py-1 rounded-full transition-colors duration-500
        ${active ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}
      `}>
        {number}
      </span>
    )}
  </button>
);
