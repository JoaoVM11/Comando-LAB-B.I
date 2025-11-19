import React from 'react';

export const Logo: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-comando-neon animate-spin-slow">
        <div className="absolute inset-0 flex items-center justify-center">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-comando-neon transform -rotate-12">
             <polyline points="16 18 22 12 16 6"></polyline>
             <polyline points="8 6 2 12 8 18"></polyline>
           </svg>
        </div>
      </div>
      
      {!collapsed && (
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg leading-none tracking-wide uppercase text-l-textPrimary dark:text-d-textPrimary">
            Comando <span className="text-comando-neon">Lab</span>
          </span>
          <span className="text-[0.55rem] tracking-[0.2em] text-l-textSecondary dark:text-d-textSecondary uppercase font-medium">
            Sales Intelligence
          </span>
        </div>
      )}
    </div>
  );
};