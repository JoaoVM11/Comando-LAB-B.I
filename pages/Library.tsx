import React, { useState } from 'react';
import { DashboardTemplate } from '../types';
import { Modal } from '../components/Modal';
import { CheckCircle } from 'lucide-react';
import './Library.css';

const templates: DashboardTemplate[] = [
    { id: '1', name: 'Visão Comercial 360', category: 'Comercial', description: 'Pipeline, conversão e metas por vendedor.', previewColor: '#82D9F6' },
    { id: '2', name: 'CFO Overview', category: 'Financeiro', description: 'Cash flow, P&L resumido e EBITDA.', previewColor: '#16C47F' },
    { id: '3', name: 'Gestão de Estoque', category: 'Estoque', description: 'Giro, curva ABC e ruptura.', previewColor: '#F2C94C' },
    { id: '4', name: 'Marketing ROI', category: 'Marketing', description: 'CAC, LTV e performance de campanhas.', previewColor: '#EB5757' },
    { id: '5', name: 'SLA de Operações', category: 'Operações', description: 'Tempo de entrega e eficiência logística.', previewColor: '#A3A8B1' },
];

export const Library: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<DashboardTemplate | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    
    const handleViewTemplate = (template: DashboardTemplate) => {
        setSelectedTemplate(template);
        setIsViewModalOpen(true);
    };

    const handleUseTemplate = () => {
        if (selectedTemplate) {
            // Aqui você pode adicionar a lógica para utilizar o modelo
            // Por exemplo: redirecionar para uma página de configuração ou salvar no dashboard
            alert(`Modelo "${selectedTemplate.name}" será aplicado ao seu dashboard!`);
            setIsViewModalOpen(false);
            setSelectedTemplate(null);
        }
    };
    
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
                                <button 
                                    className="library-card-view-button"
                                    onClick={() => handleViewTemplate(template)}
                                >
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

            {/* Modal de Visualização do Modelo */}
            {selectedTemplate && (
                <Modal
                    isOpen={isViewModalOpen}
                    onClose={() => {
                        setIsViewModalOpen(false);
                        setSelectedTemplate(null);
                    }}
                    title={selectedTemplate.name}
                    footer={
                        <button
                            className="library-use-template-button"
                            onClick={handleUseTemplate}
                        >
                            <CheckCircle size={18} />
                            Utilizar Modelo
                        </button>
                    }
                >
                    <div className="library-view-modal-content">
                        <div className="library-view-modal-preview">
                            {renderMockup(selectedTemplate.category, selectedTemplate.previewColor)}
                        </div>
                        <div className="library-view-modal-info">
                            <div className="library-view-modal-category">
                                <span 
                                    className="library-view-modal-category-dot" 
                                    style={{ backgroundColor: selectedTemplate.previewColor }}
                                />
                                <span className="library-view-modal-category-label">
                                    {selectedTemplate.category}
                                </span>
                            </div>
                            <h3 className="library-view-modal-name">{selectedTemplate.name}</h3>
                            <p className="library-view-modal-description">
                                {selectedTemplate.description}
                            </p>
                            <div className="library-view-modal-features">
                                <h4>Recursos incluídos:</h4>
                                <ul>
                                    <li>Dashboard pré-configurado com métricas essenciais</li>
                                    <li>Gráficos e visualizações interativas</li>
                                    <li>Filtros e segmentações personalizáveis</li>
                                    <li>Integração com suas fontes de dados</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
