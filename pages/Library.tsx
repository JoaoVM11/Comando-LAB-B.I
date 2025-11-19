import React from 'react';
import { DashboardTemplate } from '../types';

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
                    <div className="p-3 h-full flex flex-col gap-2 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                         <div className="flex gap-2">
                             {[1, 2, 3].map(i => (
                                 <div key={i} className="flex-1 h-10 rounded bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border p-1.5 flex flex-col justify-between">
                                     <div className="w-3 h-3 rounded-full opacity-40" style={{ backgroundColor: color }}></div>
                                     <div className="w-8 h-1 bg-current opacity-20 rounded"></div>
                                 </div>
                             ))}
                         </div>
                         <div className="flex-1 rounded bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border flex items-end justify-between px-2 pb-2 gap-1">
                             {[40, 60, 45, 80, 50, 70, 90].map((h, i) => (
                                 <div key={i} className="flex-1 rounded-t opacity-60 hover:opacity-100 transition-opacity" style={{ height: `${h}%`, backgroundColor: color }}></div>
                             ))}
                         </div>
                    </div>
                );
            case 'Estoque':
                return (
                    <div className="p-3 h-full flex flex-col gap-2 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex-1 rounded bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border p-2 grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-l-bg dark:bg-d-bg rounded border border-l-border dark:border-d-border p-1 flex flex-col gap-1">
                                    <div className="w-full h-1.5 rounded bg-l-border dark:bg-d-border"></div>
                                    <div className="w-1/2 h-1.5 rounded opacity-50" style={{ backgroundColor: color }}></div>
                                </div>
                            ))}
                        </div>
                         <div className="h-8 rounded bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border flex items-center gap-2 px-2">
                             <div className="w-4 h-4 rounded bg-l-border dark:bg-d-border"></div>
                             <div className="flex-1 h-1.5 rounded bg-l-border dark:bg-d-border opacity-30"></div>
                         </div>
                    </div>
                );
            case 'Marketing':
                return (
                     <div className="p-3 h-full grid grid-cols-2 gap-2 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="rounded bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border flex items-center justify-center relative">
                            <div className="w-14 h-14 rounded-full border-[6px]" style={{ borderColor: `${color}33`, borderTopColor: color }}></div>
                        </div>
                        <div className="flex flex-col gap-1.5 justify-center">
                            {[100, 70, 40].map((w, i) => (
                                <div key={i} className="h-2 rounded-r-full opacity-60" style={{ width: `${w}%`, backgroundColor: color }}></div>
                            ))}
                        </div>
                        <div className="col-span-2 rounded bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border flex items-end px-2 gap-1 h-12">
                            <div className="flex-1 h-[30%] bg-l-border dark:bg-d-border rounded-t opacity-30"></div>
                            <div className="flex-1 h-[60%] rounded-t opacity-50" style={{ backgroundColor: color }}></div>
                            <div className="flex-1 h-[80%] rounded-t opacity-80" style={{ backgroundColor: color }}></div>
                            <div className="flex-1 h-[50%] bg-l-border dark:bg-d-border rounded-t opacity-30"></div>
                        </div>
                     </div>
                );
             case 'Operações':
                return (
                     <div className="p-3 h-full flex flex-col gap-2 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                         {[1, 2, 3].map((i) => (
                             <div key={i} className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 1 ? color : '#2B3443' }}></div>
                                 <div className="flex-1 h-2 rounded-full bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border relative overflow-hidden">
                                     <div className="absolute top-0 left-0 bottom-0 rounded-full opacity-60" style={{ width: `${100 - (i * 20)}%`, backgroundColor: color }}></div>
                                 </div>
                             </div>
                         ))}
                         <div className="mt-auto h-16 border-t border-l-border dark:border-d-border pt-2 flex items-end justify-between gap-1">
                            {[2, 5, 3, 6, 4, 7, 5].map((h, i) => (
                                <div key={i} className="w-1.5 rounded-t bg-l-border dark:bg-d-border" style={{ height: `${h * 10}%` }}></div>
                            ))}
                         </div>
                     </div>
                );
            default: // Comercial
                return (
                    <div className="p-3 h-full grid grid-cols-3 gap-2 opacity-75 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="col-span-2 flex flex-col gap-2">
                            <div className="flex gap-2">
                                <div className="flex-1 h-10 rounded bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border p-1.5">
                                    <div className="w-3 h-3 rounded-full mb-1 opacity-50" style={{ backgroundColor: color }}></div>
                                    <div className="w-8 h-1 bg-l-border dark:bg-d-border rounded"></div>
                                </div>
                                <div className="flex-1 h-10 rounded bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border p-1.5">
                                    <div className="w-6 h-3 mb-1 bg-l-border dark:bg-d-border rounded opacity-50"></div>
                                    <div className="w-4 h-1 bg-l-border dark:bg-d-border rounded"></div>
                                </div>
                            </div>
                            <div className="flex-1 rounded bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border relative overflow-hidden">
                                <div className="absolute bottom-0 left-0 right-0 h-12 flex items-end justify-around px-1 pb-1">
                                    {[40, 70, 50, 90, 60, 80].map((h, i) => (
                                        <div key={i} className="w-1.5 rounded-t opacity-60" style={{ height: `${h}%`, backgroundColor: color }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="h-16 rounded bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border flex items-center justify-center relative">
                                <div className="w-10 h-10 rounded-full border-2 border-l-border dark:border-d-border" style={{ borderTopColor: color, borderRightColor: color }}></div>
                            </div>
                            <div className="flex-1 rounded bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border p-1.5 space-y-1">
                                {[1,2,3].map(i => (
                                    <div key={i} className="flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-l-border dark:bg-d-border"></div>
                                        <div className="w-full h-0.5 bg-l-border dark:bg-d-border rounded opacity-30"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div>
            <div className="mb-8 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl font-display font-bold text-l-textPrimary dark:text-d-textPrimary mb-2">Biblioteca de Dashboards</h2>
                <p className="text-l-textSecondary dark:text-d-textSecondary">Escolha um modelo pré-configurado para iniciar sua análise de dados em segundos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map(template => (
                    <div key={template.id} className="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] border border-l-border dark:border-d-border bg-l-surface dark:bg-d-surface">
                         
                         {/* Visual Mockup Area */}
                         <div className="h-48 bg-l-bg dark:bg-d-bg border-b border-l-border dark:border-d-border relative overflow-hidden">
                            {/* Dynamic Mockup Content */}
                            {renderMockup(template.category, template.previewColor)}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-l-surface/10 to-transparent dark:from-d-surface/20 dark:to-transparent pointer-events-none" />
                            
                            {/* Hover Action */}
                            <div className="absolute inset-0 flex items-center justify-center bg-l-bg/40 dark:bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                <button className="px-6 py-2.5 bg-comando-neon text-comando-darkInst font-bold text-sm rounded-full shadow-[0_0_20px_rgba(130,217,246,0.6)] transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                                    Visualizar Modelo
                                </button>
                            </div>
                         </div>
                         
                         {/* Card Content */}
                         <div className="p-5 relative z-20 bg-l-surface dark:bg-d-surface">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full shadow-[0_0_8px_current]" style={{ backgroundColor: template.previewColor, color: template.previewColor }} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-l-textSecondary dark:text-d-textSecondary">{template.category}</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-display font-bold text-l-textPrimary dark:text-d-textPrimary mb-1 group-hover:text-comando-neon transition-colors">{template.name}</h3>
                            <p className="text-sm text-l-textSecondary dark:text-d-textSecondary leading-relaxed line-clamp-2">{template.description}</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
};