import React, { useState } from 'react';
import { chatWithAnalyst } from '../../services/geminiService';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/Card';
import { BrainCircuit, Send, Activity, Users, TrendingUp } from 'lucide-react';

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
        <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
             <div className="lg:col-span-1 space-y-6">
                 <Card className="bg-gradient-to-br from-login-primary/20 to-transparent border-login-primary/30">
                     <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><BrainCircuit /> Enterprise Brain</h3>
                     <p className="text-sm text-blue-200">
                         Use esta IA para detectar churn, oportunidades de upsell em massa e analisar a saúde da carteira de clientes.
                     </p>
                 </Card>
                 
                 <div className="space-y-2">
                     <p className="text-xs font-bold text-gray-500 uppercase">Sugestões de Análise</p>
                     {['Qual segmento tem maior MRR?', 'Existem empresas com risco de churn?', 'Sugira uma estratégia de crescimento'].map(q => (
                         <button key={q} onClick={() => setQuery(q)} className="w-full text-left p-3 rounded bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition-colors">
                             {q}
                         </button>
                     ))}
                 </div>
             </div>

             <Card className="lg:col-span-2 flex flex-col h-full">
                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
                     {response ? (
                         <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                             <div className="flex items-center gap-2 mb-4 text-login-detail">
                                 <Activity size={20} />
                                 <span className="font-bold uppercase">Análise Gerada</span>
                             </div>
                             <div className="prose prose-invert text-sm leading-relaxed whitespace-pre-wrap">
                                 {response}
                             </div>
                         </div>
                     ) : (
                         <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                             <BrainCircuit size={64} />
                             <p className="mt-4">Aguardando comando...</p>
                         </div>
                     )}
                 </div>
                 
                 <div className="mt-4 relative">
                     <input 
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Pergunte sobre a base de clientes..."
                        className="w-full p-4 pr-12 bg-black/30 border border-gray-700 rounded-xl text-white focus:border-login-primary outline-none"
                        onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                     />
                     <button 
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="absolute right-2 top-2 p-2 bg-login-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                     >
                         {loading ? <Activity className="animate-spin" size={20} /> : <Send size={20} />}
                     </button>
                 </div>
             </Card>
        </div>
    );
};
