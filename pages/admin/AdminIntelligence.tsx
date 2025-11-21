import React, { useState } from 'react';
import { chatWithAnalyst } from '../../services/geminiService';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/Card';
import { BrainCircuit, Send, Activity, Users, TrendingUp } from 'lucide-react';
import './AdminIntelligence.css';

export const AdminIntelligence: React.FC = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if(!query) return;
        setLoading(true);
        
        // Gather context from Admin Service
        const stats = adminService.getAdminStats();
        const context = `
            Contexto do Super Admin:
            - MRR Total: R$ ${stats.totalMRR}
            - Empresas Ativas: ${stats.activeCompanies}
            - Usuários Totais: ${stats.totalUsers}
            - Segmentos: ${JSON.stringify(stats.segments)}
            - Estados: ${JSON.stringify(stats.states)}
            
            Aja como um consultor de negócios Enterprise. Analise os dados acima e responda à pergunta: "${query}"
        `;

        try {
            const res = await chatWithAnalyst([{ role: 'user', parts: [{ text: context }] }], query);
            setResponse(res);
        } catch (error) {
            setResponse('Erro ao consultar a IA. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-intelligence-container">
             <div className="admin-intelligence-sidebar">
                 <Card className="admin-intelligence-info-card">
                     <h3 className="admin-intelligence-info-title"><BrainCircuit /> Enterprise Brain</h3>
                     <p className="admin-intelligence-info-text">
                         Use esta IA para detectar churn, oportunidades de upsell em massa e analisar a saúde da carteira de clientes.
                     </p>
                 </Card>
                 
                 <div className="admin-intelligence-suggestions">
                     <p className="admin-intelligence-suggestions-title">Sugestões de Análise</p>
                     {['Qual segmento tem maior MRR?', 'Existem empresas com risco de churn?', 'Sugira uma estratégia de crescimento'].map(q => (
                         <button key={q} onClick={() => setQuery(q)} className="admin-intelligence-suggestion-button">
                             {q}
                         </button>
                     ))}
                 </div>
             </div>

             <Card className="admin-intelligence-chat-card">
                 <div className="admin-intelligence-chat-content">
                     {response ? (
                         <div className="admin-intelligence-response">
                             <div className="admin-intelligence-response-header">
                                 <Activity size={20} />
                                 <span className="admin-intelligence-response-title">Análise Gerada</span>
                             </div>
                             <div className="admin-intelligence-response-text">
                                 {response}
                             </div>
                         </div>
                     ) : (
                         <div className="admin-intelligence-empty">
                             <BrainCircuit size={64} />
                             <p>Aguardando comando...</p>
                         </div>
                     )}
                 </div>
                 
                 <div className="admin-intelligence-input-wrapper">
                     <input 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Pergunte sobre a base de clientes..."
                        className="admin-intelligence-input"
                        onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                     />
                     <button 
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="admin-intelligence-send-button"
                     >
                         {loading ? <Activity className="spinning" size={20} /> : <Send size={20} />}
                     </button>
                 </div>
             </Card>
        </div>
    );
};
