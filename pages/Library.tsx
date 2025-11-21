import React from 'react';
import { DashboardTemplate } from '../types';
import './Library.css';

const templates: DashboardTemplate[] = [
    { id: '1', name: 'Visão Comercial 360', category: 'Comercial', description: 'Pipeline, conversão e metas por vendedor.', previewColor: '#82D9F6' },
    { id: '2', name: 'CFO Overview', category: 'Financeiro', description: 'Cash flow, P&L resumido e EBITDA.', previewColor: '#16C47F' },
    { id: '3', name: 'Gestão de Estoque', category: 'Estoque', description: 'Giro, curva ABC e ruptura.', previewColor: '#F2C94C' },
    { id: '4', name: 'Marketing ROI', category: 'Marketing', description: 'CAC, LTV e performance de campanhas.', previewColor: '#EB5757' },
    { id: '5', name: 'SLA de Operações', category: 'Operações', description: 'Tempo de entrega e eficiência logística.', previewColor: '#A3A8B1' },
];

export const Library: React.FC = () => {
    
    const renderMockup = (category: string, color: string) => {
        switch(category) {
            case 'Financeiro':
                return (
                    <div className="library-mockup-financial">
                         <div className="library-mockup-row">
                             {[1, 2, 3].map(i => (
                                 <div key={i} className="library-mockup-card">
                                     <div className="library-mockup-dot" style={{ backgroundColor: color }}></div>
                                     <div className="library-mockup-line"></div>
                                 </div>
                             ))}
                         </div>
                         <div className="library-mockup-chart">
                             {[40, 60, 45, 80, 50, 70, 90].map((h, i) => (
                                 <div key={i} className="library-mockup-bar" style={{ height: `${h}%`, backgroundColor: color }}></div>
                             ))}
                         </div>
                    </div>
                );
            case 'Estoque':
                return (
                    <div className="library-mockup-inventory">
                        <div className="library-mockup-grid">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="library-mockup-item">
                                    <div className="library-mockup-progress-full"></div>
                                    <div className="library-mockup-progress-partial" style={{ backgroundColor: color }}></div>
                                </div>
                            ))}
                        </div>
                         <div className="library-mockup-search">
                             <div className="library-mockup-search-icon"></div>
                             <div className="library-mockup-search-bar"></div>
                         </div>
                    </div>
                );
            case 'Marketing':
                return (
                     <div className="library-mockup-marketing">
                        <div className="library-mockup-circle-wrapper">
                            <div className="library-mockup-circle" style={{ borderColor: `${color}33`, borderTopColor: color }}></div>
                        </div>
                        <div className="library-mockup-bars">
                            {[100, 70, 40].map((w, i) => (
                                <div key={i} className="library-mockup-bar-horizontal" style={{ width: `${w}%`, backgroundColor: color }}></div>
                            ))}
                        </div>
                        <div className="library-mockup-chart-horizontal">
                            <div className="library-mockup-bar-small"></div>
                            <div className="library-mockup-bar-medium" style={{ backgroundColor: color }}></div>
                            <div className="library-mockup-bar-large" style={{ backgroundColor: color }}></div>
                            <div className="library-mockup-bar-small"></div>
                        </div>
                     </div>
                );
             case 'Operações':
                return (
                     <div className="library-mockup-operations">
                         {[1, 2, 3].map((i) => (
                             <div key={i} className="library-mockup-progress-row">
                                 <div className="library-mockup-progress-dot" style={{ backgroundColor: i === 1 ? color : '#2B3443' }}></div>
                                 <div className="library-mockup-progress-bar">
                                     <div className="library-mockup-progress-fill" style={{ width: `${100 - (i * 20)}%`, backgroundColor: color }}></div>
                                 </div>
                             </div>
                         ))}
                         <div className="library-mockup-footer">
                            {[2, 5, 3, 6, 4, 7, 5].map((h, i) => (
                                <div key={i} className="library-mockup-footer-bar" style={{ height: `${h * 10}%` }}></div>
                            ))}
                         </div>
                     </div>
                );
            default: // Comercial
                return (
                    <div className="library-mockup-commercial">
                        <div className="library-mockup-commercial-main">
                            <div className="library-mockup-commercial-top">
                                <div className="library-mockup-commercial-card">
                                    <div className="library-mockup-commercial-dot" style={{ backgroundColor: color }}></div>
                                    <div className="library-mockup-commercial-line"></div>
                                </div>
                                <div className="library-mockup-commercial-card">
                                    <div className="library-mockup-commercial-rect"></div>
                                    <div className="library-mockup-commercial-line-small"></div>
                                </div>
                            </div>
                            <div className="library-mockup-commercial-chart">
                                {[40, 70, 50, 90, 60, 80].map((h, i) => (
                                    <div key={i} className="library-mockup-commercial-bar" style={{ height: `${h}%`, backgroundColor: color }}></div>
                                ))}
                            </div>
                        </div>
                        <div className="library-mockup-commercial-side">
                            <div className="library-mockup-commercial-circle-wrapper">
                                <div className="library-mockup-commercial-circle" style={{ borderTopColor: color, borderRightColor: color }}></div>
                            </div>
                            <div className="library-mockup-commercial-list">
                                {[1,2,3].map(i => (
                                    <div key={i} className="library-mockup-commercial-list-item">
                                        <div className="library-mockup-commercial-list-dot"></div>
                                        <div className="library-mockup-commercial-list-line"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="library-container">
            <div className="library-header">
                <h2 className="library-title">Biblioteca de Dashboards</h2>
                <p className="library-subtitle">Escolha um modelo pré-configurado para iniciar sua análise de dados em segundos.</p>
            </div>

            <div className="library-grid">
                {templates.map(template => (
                    <div key={template.id} className="library-card">
                         
                         {/* Visual Mockup Area */}
                         <div className="library-card-preview">
                            {/* Dynamic Mockup Content */}
                            {renderMockup(template.category, template.previewColor)}

                            {/* Overlay Gradient */}
                            <div className="library-card-overlay" />
                            
                            {/* Hover Action */}
                            <div className="library-card-hover-action">
                                <button className="library-card-view-button">
                                    Visualizar Modelo
                                </button>
                            </div>
                         </div>
                         
                         {/* Card Content */}
                         <div className="library-card-content">
                            <div className="library-card-header">
                                <div className="library-card-category">
                                    <span className="library-card-category-dot" style={{ backgroundColor: template.previewColor }} />
                                    <span className="library-card-category-label">{template.category}</span>
                                </div>
                            </div>
                            <h3 className="library-card-name">{template.name}</h3>
                            <p className="library-card-description">{template.description}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
