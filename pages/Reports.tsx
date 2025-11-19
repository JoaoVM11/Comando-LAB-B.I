import React from 'react';
import { Card } from '../components/Card';
import { FileDown, FileText } from 'lucide-react';
import { Report } from '../types';

const recentReports: Report[] = [
    { id: '1', name: 'Relatório de Fechamento Q3', date: '2023-10-01', format: 'PDF', size: '2.4 MB' },
    { id: '2', name: 'Performance de Vendedores - Set', date: '2023-10-02', format: 'XLSX', size: '1.1 MB' },
    { id: '3', name: 'Análise de Churn', date: '2023-09-28', format: 'CSV', size: '500 KB' },
];

export const Reports: React.FC = () => {
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-display font-bold text-l-textPrimary dark:text-d-textPrimary">Relatórios</h2>
                    <p className="text-l-textSecondary dark:text-d-textSecondary">Exporte seus dados e compartilhe resultados.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Generate Report Form */}
                 <Card title="Gerar Novo Relatório" className="lg:col-span-1 h-fit">
                     <form className="space-y-4">
                         <div>
                             <label className="block text-sm font-medium text-l-textSecondary dark:text-d-textSecondary mb-1">Tipo de Relatório</label>
                             <select className="w-full p-2.5 rounded-lg bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary focus:border-comando-neon outline-none">
                                 <option>Performance de Vendas</option>
                                 <option>Financeiro Detalhado</option>
                                 <option>Inventário</option>
                             </select>
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-l-textSecondary dark:text-d-textSecondary mb-1">Período</label>
                             <select className="w-full p-2.5 rounded-lg bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary focus:border-comando-neon outline-none">
                                 <option>Últimos 30 dias</option>
                                 <option>Este Trimestre</option>
                                 <option>Personalizado</option>
                             </select>
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-l-textSecondary dark:text-d-textSecondary mb-1">Formato</label>
                             <div className="flex gap-4">
                                 {['PDF', 'Excel', 'CSV'].map(fmt => (
                                     <label key={fmt} className="flex items-center gap-2 cursor-pointer">
                                         <input type="radio" name="format" className="accent-comando-neon" />
                                         <span className="text-sm text-l-textPrimary dark:text-d-textPrimary">{fmt}</span>
                                     </label>
                                 ))}
                             </div>
                         </div>
                         <button type="button" className="w-full py-3 mt-2 rounded-lg bg-comando-neon text-comando-darkInst font-bold hover:bg-comando-hover transition-colors">
                             Gerar Relatório
                         </button>
                     </form>
                 </Card>

                 {/* History List */}
                 <Card title="Histórico de Exportações" className="lg:col-span-2">
                    <div className="space-y-3">
                        {recentReports.map(report => (
                            <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border hover:border-comando-neon/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-l-surface dark:bg-d-surface rounded-lg text-comando-neon">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-l-textPrimary dark:text-d-textPrimary">{report.name}</h4>
                                        <p className="text-xs text-l-textSecondary dark:text-d-textSecondary">{report.date} • {report.size}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-l-surface dark:bg-d-surface text-l-textSecondary dark:text-d-textSecondary border border-l-border dark:border-d-border">{report.format}</span>
                                    <button className="p-2 text-l-textSecondary dark:text-d-textSecondary hover:text-comando-neon transition-colors">
                                        <FileDown size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </Card>
             </div>
        </div>
    );
};