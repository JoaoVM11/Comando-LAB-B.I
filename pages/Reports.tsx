import React from 'react';
import { Card } from '../components/Card';
import { FileDown, FileText } from 'lucide-react';
import { Report } from '../types';
import './Reports.css';

const recentReports: Report[] = [
    { id: '1', name: 'Relatório de Fechamento Q3', date: '2023-10-01', format: 'PDF', size: '2.4 MB' },
    { id: '2', name: 'Performance de Vendedores - Set', date: '2023-10-02', format: 'XLSX', size: '1.1 MB' },
    { id: '3', name: 'Análise de Churn', date: '2023-09-28', format: 'CSV', size: '500 KB' },
];

export const Reports: React.FC = () => {
    return (
        <div className="reports-container">
             <div className="reports-header">
                <div>
                    <h2 className="reports-title">Relatórios</h2>
                    <p className="reports-subtitle">Exporte seus dados e compartilhe resultados.</p>
                </div>
             </div>

             <div className="reports-grid">
                 {/* Generate Report Form */}
                 <Card title="Gerar Novo Relatório" className="reports-form-card">
                     <form className="reports-form">
                         <div className="reports-form-field">
                             <label className="reports-form-label">Tipo de Relatório</label>
                             <select className="reports-form-select">
                                 <option>Performance de Vendas</option>
                                 <option>Financeiro Detalhado</option>
                                 <option>Inventário</option>
                             </select>
                         </div>
                         <div className="reports-form-field">
                             <label className="reports-form-label">Período</label>
                             <select className="reports-form-select">
                                 <option>Últimos 30 dias</option>
                                 <option>Este Trimestre</option>
                                 <option>Personalizado</option>
                             </select>
                         </div>
                         <div className="reports-form-field">
                             <label className="reports-form-label">Formato</label>
                             <div className="reports-form-radio-group">
                                 {['PDF', 'Excel', 'CSV'].map(fmt => (
                                     <label key={fmt} className="reports-form-radio">
                                         <input type="radio" name="format" />
                                         <span>{fmt}</span>
                                     </label>
                                 ))}
                             </div>
                         </div>
                         <button type="button" className="reports-form-button">
                             Gerar Relatório
                         </button>
                     </form>
                 </Card>

                 {/* History List */}
                 <Card title="Histórico de Exportações" className="reports-history-card">
                    <div className="reports-history-list">
                        {recentReports.map(report => (
                            <div key={report.id} className="reports-history-item">
                                <div className="reports-history-item-content">
                                    <div className="reports-history-item-icon">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="reports-history-item-title">{report.name}</h4>
                                        <p className="reports-history-item-meta">{report.date} • {report.size}</p>
                                    </div>
                                </div>
                                <div className="reports-history-item-actions">
                                    <span className="reports-history-item-format">{report.format}</span>
                                    <button className="reports-history-item-download">
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
