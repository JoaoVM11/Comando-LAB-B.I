import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action, glow }) => {
  return (
    <div className={`card ${glow ? 'card-glow' : ''} ${className}`}>
      {(title || action) && (
        <div className="card-header">
          {title && (
            <h3 className="card-title">
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};