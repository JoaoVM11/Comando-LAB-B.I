import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { Card } from './Card';
import { KPIData } from '../types';

export const StatCard: React.FC<KPIData> = ({ label, value, trend, isCurrency }) => {
  const isPositive = trend >= 0;

  return (
    <Card glow className="relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <TrendingUp size={48} />
      </div>
      
      <div className="flex flex-col gap-1 z-10 relative">
        <span className="text-sm font-medium text-l-textSecondary dark:text-d-textSecondary uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-l-textPrimary dark:text-d-textPrimary">
            {isCurrency ? `R$ ${value}` : value}
            </span>
        </div>
        
        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${isPositive ? 'text-func-success dark:text-func-successDark' : 'text-func-error dark:text-func-errorDark'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{Math.abs(trend)}%</span>
          <span className="text-l-textSecondary dark:text-d-textSecondary font-normal ml-1">vs. mês anterior</span>
        </div>
      </div>
    </Card>
  );
};