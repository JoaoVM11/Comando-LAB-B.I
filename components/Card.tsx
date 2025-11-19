import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action, glow }) => {
  return (
    <div className={`
      bg-l-surface dark:bg-d-surface 
      border border-l-border dark:border-d-border 
      rounded-xl p-6 
      transition-all duration-300
      ${glow ? 'hover:shadow-[0_0_15px_rgba(130,217,246,0.15)] hover:border-comando-neon/50' : ''}
      ${className}
    `}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h3 className="font-display font-semibold text-lg text-l-textPrimary dark:text-d-textPrimary tracking-tight">
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="h-full">
        {children}
      </div>
    </div>
  );
};