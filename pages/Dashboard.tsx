import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { useTheme } from '../context/ThemeContext';
import { KPIData } from '../types';
import { Filter, Calendar, Users, Target, Tag } from 'lucide-react';

const mockKpis: KPIData[] = [
  { label: 'Receita Total', value: '254.3k', trend: 12.5, isCurrency: true },
  { label: 'Novas Vendas', value: '142', trend: 5.2 },
  { label: 'Ticket Médio', value: '1.7k', trend: -2.1, isCurrency: true },
  { label: 'Conversão', value: '24%', trend: 8.4 },
];

const dataArea = [
  { name: 'Seg', uv: 4000, pv: 2400 },
  { name: 'Ter', uv: 3000, pv: 1398 },
  { name: 'Qua', uv: 2000, pv: 9800 },
  { name: 'Qui', uv: 2780, pv: 3908 },
  { name: 'Sex', uv: 1890, pv: 4800 },
  { name: 'Sáb', uv: 2390, pv: 3800 },
  { name: 'Dom', uv: 3490, pv: 4300 },
];

const dataBar = [
  { name: 'Tech', value: 400 },
  { name: 'Health', value: 300 },
  { name: 'Retail', value: 300 },
  { name: 'Gov', value: 200 },
  { name: 'Edu', value: 150 },
];

interface SalesPerson {
  id: string;
  name: string;
  avatar: string;
  total: number;
  target: number;
  progress: number;
}

const mockSalesTeam: SalesPerson[] = [
  { id: '1', name: 'Ricardo Silva', avatar: 'RS', total: 145000, target: 150000, progress: 96 },
  { id: '2', name: 'Amanda Costa', avatar: 'AC', total: 98000, target: 120000, progress: 81 },
  { id: '3', name: 'Bruno Dias', avatar: 'BD', total: 112000, target: 120000, progress: 93 },
  { id: '4', name: 'Carla Mello', avatar: 'CM', total: 45000, target: 100000, progress: 45 },
  { id: '5', name: 'Felipe Torres', avatar: 'FT', total: 160000, target: 150000, progress: 106 },
];

export const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState('Mês');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const chartColor = '#82D9F6';
  const gridColor = theme === 'dark' ? '#2B3443' : '#E1E4EA';
  const textColor = theme === 'dark' ? '#9CA7B8' : '#A3A8B1';
  const tooltipBg = theme === 'dark' ? '#161D2A' : '#FFFFFF';
  const tooltipBorder = theme === 'dark' ? '#2B3443' : '#E1E4EA';

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-func-success shadow-[0_0_10px_rgba(22,196,127,0.6)]';
    if (progress >= 70) return 'bg-comando-neon shadow-[0_0_10px_rgba(130,217,246,0.6)]';
    return 'bg-func-error shadow-[0_0_10px_rgba(235,87,87,0.6)]';
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {['Dia', 'Semana', 'Mês', 'Bimestre', 'Ano'].map((period) => (
            <button 
              key={period} 
              onClick={() => setActiveFilter(period)}
              className={`
                px-4 py-1.5 rounded-md text-sm font-medium transition-all border whitespace-nowrap
                ${activeFilter === period 
                  ? 'bg-comando-neon/10 text-comando-darkInst dark:text-comando-neon border-comando-neon/50 shadow-[0_0_10px_rgba(130,217,246,0.2)]' 
                  : 'bg-l-surface dark:bg-d-surface border-l-border dark:border-d-border text-l-textSecondary dark:text-d-textSecondary hover:text-comando-neon hover:border-comando-neon/50'}
              `}
            >
              {period}
            </button>
          ))}
        </div>
        <button 
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-comando-darkInst text-white rounded-lg hover:bg-comando-darkInst/90 transition-all text-sm shadow-lg border border-comando-neon/20 group"
        >
            <Filter size={16} className="text-comando-neon group-hover:text-white transition-colors" /> 
            <span>Filtros Avançados</span>
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockKpis.map((kpi, idx) => (
          <StatCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Evolution */}
        <Card className="lg:col-span-2" title="Evolução da Receita">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataArea} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={textColor} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke={textColor} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px' }}
                  itemStyle={{ color: textColor }}
                />
                <Area type="monotone" dataKey="uv" stroke={chartColor} strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sales by Sector */}
        <Card title="Vendas por Setor">
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataBar} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
                <XAxis type="number" stroke={textColor} hide />
                <YAxis dataKey="name" type="category" stroke={textColor} tickLine={false} axisLine={false} width={60} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, borderRadius: '8px' }} />
                <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                    {dataBar.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? chartColor : '#5BBAD1'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Sales Team Performance Table */}
      <div className="grid grid-cols-1 gap-6">
        <Card title="Performance da Equipe de Vendas" glow>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-l-textSecondary dark:text-d-textSecondary uppercase tracking-wider border-b border-l-border dark:border-d-border">
                  <th className="py-4 pl-4 font-medium">Vendedor</th>
                  <th className="py-4 font-medium text-right">Valor Total</th>
                  <th className="py-4 font-medium text-right">Meta</th>
                  <th className="py-4 pr-4 font-medium w-1/3 pl-6">Progresso</th>
                </tr>
              </thead>
              <tbody className="text-sm text-l-textPrimary dark:text-d-textPrimary">
                {mockSalesTeam.map((person) => (
                  <tr key={person.id} className="border-b border-l-border dark:border-d-border last:border-none hover:bg-l-surface dark:hover:bg-d-bg/50 transition-colors group">
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-l-bg dark:bg-d-bg border border-comando-neon/30 group-hover:border-comando-neon flex items-center justify-center text-xs font-bold text-comando-neon transition-colors">
                          {person.avatar}
                        </div>
                        <span className="font-medium">{person.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-display font-medium tracking-tight">{formatCurrency(person.total)}</td>
                    <td className="py-4 text-right text-l-textSecondary dark:text-d-textSecondary">{formatCurrency(person.target)}</td>
                    <td className="py-4 pr-4 pl-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-end text-xs">
                          <span className={`font-bold ${
                            person.progress >= 100 ? 'text-func-success' : 
                            person.progress >= 70 ? 'text-comando-neon' : 
                            'text-func-error'
                          }`}>
                            {person.progress}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-l-bg dark:bg-d-bg rounded-full overflow-hidden border border-l-border dark:border-d-border">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(person.progress)}`} 
                            style={{ width: `${Math.min(person.progress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Advanced Filter Modal */}
      <Modal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)}
        title="Filtros Avançados"
        footer={
          <>
            <button 
              onClick={() => setIsFilterModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-l-textSecondary hover:text-l-textPrimary transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => setIsFilterModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-comando-neon text-comando-darkInst hover:bg-comando-hover shadow-[0_0_15px_rgba(130,217,246,0.4)] transition-all"
            >
              Aplicar Filtros
            </button>
          </>
        }
      >
        <div className="space-y-6">
          {/* Custom Date Range */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-l-textPrimary dark:text-d-textPrimary mb-2">
              <Calendar size={16} className="text-comando-neon" /> Período Personalizado
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-l-textSecondary">De</span>
                <input type="date" className="w-full p-2.5 rounded-lg bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary outline-none focus:border-comando-neon transition-colors" />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-l-textSecondary">Até</span>
                <input type="date" className="w-full p-2.5 rounded-lg bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary outline-none focus:border-comando-neon transition-colors" />
              </div>
            </div>
          </div>

          {/* Salesperson (Supervisor Only) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-l-textPrimary dark:text-d-textPrimary mb-2">
              <Users size={16} className="text-comando-neon" /> Vendedor (Visão Supervisor)
            </label>
            <select className="w-full p-3 rounded-lg bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary outline-none focus:border-comando-neon transition-colors cursor-pointer">
              <option value="all">Todos os Vendedores (Visão Macro)</option>
              {mockSalesTeam.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <p className="text-[10px] text-l-textSecondary mt-1 flex items-center gap-1">
               <span className="w-1 h-1 rounded-full bg-comando-neon"></span>
               Acesso exclusivo para perfil de supervisão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campaign */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-l-textPrimary dark:text-d-textPrimary mb-2">
                <Target size={16} className="text-comando-neon" /> Campanha / Origem
              </label>
              <select className="w-full p-3 rounded-lg bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary outline-none focus:border-comando-neon transition-colors cursor-pointer">
                <option value="all">Todas as Origens</option>
                <option value="ads">Ads (Meta/Google)</option>
                <option value="referral">Indicação</option>
                <option value="social">Mídias Sociais (Orgânico)</option>
                <option value="wallet">Carteira de Clientes</option>
                <option value="repurchase">Recompra</option>
              </select>
            </div>

             {/* Product Type */}
             <div>
              <label className="flex items-center gap-2 text-sm font-bold text-l-textPrimary dark:text-d-textPrimary mb-2">
                <Tag size={16} className="text-comando-neon" /> Tipo de Produto
              </label>
              <select className="w-full p-3 rounded-lg bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary outline-none focus:border-comando-neon transition-colors cursor-pointer">
                <option value="all">Todos os Produtos</option>
                <option value="saas">SaaS / Assinatura</option>
                <option value="consulting">Consultoria</option>
                <option value="implementation">Implementação</option>
                <option value="training">Treinamento</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};