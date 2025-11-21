import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { Card } from './Card';
import { KPIData } from '../types';
import './StatCard.css';

export const StatCard: React.FC<KPIData> = ({ label, value, trend, isCurrency }) => {
  const isPositive = trend >= 0;

  return (
    <Card glow className="stat-card">
      <div className="stat-card-icon">
        <TrendingUp size={48} />
      </div>
      
      <div className="stat-card-content">
        <span className="stat-card-label">
          {label}
        </span>
        <div className="stat-card-value-wrapper">
            <span className="stat-card-value">
            {isCurrency ? `R$ ${value}` : value}
            </span>
        </div>
        
        <div className={`stat-card-trend ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{Math.abs(trend)}%</span>
          <span className="stat-card-trend-label">vs. mês anterior</span>
        </div>
      </div>
    </Card>
  );
};
