import React from 'react';
import './Logo.css';

export const Logo: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => {
  return (
    <div className="logo-container">
      <div className="logo-icon-wrapper">
        <div className="logo-icon-inner">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
             <polyline points="16 18 22 12 16 6"></polyline>
             <polyline points="8 6 2 12 8 18"></polyline>
           </svg>
        </div>
      </div>
      
      {!collapsed && (
        <div className="logo-text">
          <span className="logo-text-main">
            Comando <span className="logo-text-accent">Lab</span>
          </span>
          <span className="logo-text-subtitle">
            Sales Intelligence
          </span>
        </div>
      )}
    </div>
  );
};
