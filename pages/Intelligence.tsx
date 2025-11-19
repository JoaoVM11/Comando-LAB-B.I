import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/Card';
import { Bot, Send, Sparkles, Zap, AlertTriangle, Lightbulb } from 'lucide-react';
import { chatWithAnalyst, generateBusinessInsight } from '../services/geminiService';
import { Insight, ChatMessage } from '../types';

const mockContext = "As vendas caíram 12% na última semana no setor de varejo. O produto 'Enterprise X' teve um aumento de 5% na margem de lucro. A equipe de São Paulo está 20% abaixo da meta mensal.";

export const Intelligence: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', content: 'Olá, sou a IA do Comando Lab. Como posso ajudar na análise dos seus dados hoje?', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Generate insights on mount
  useEffect(() => {
    const fetchInsights = async () => {
      const generatedText = await generateBusinessInsight(mockContext);
      
      // Mocking parsing logic as Gemini returns raw text. 
      // In production, we would ask for JSON schema.
      const newInsight: Insight = {
        id: Date.now().toString(),
        title: 'Análise de Tendência',
        description: generatedText,
        type: 'risk',
      };
      
      setInsights([
        newInsight,
        { id: '2', title: 'Oportunidade de Upsell', description: 'Clientes do plano básico com uso >80% são candidatos ideais para upgrade.', type: 'opportunity' }
      ]);
      setLoadingInsights(false);
    };

    fetchInsights();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const responseText = await chatWithAnalyst(history, newUserMsg.content);

      const newModelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newModelMsg]);
    } catch (error) {
      console.error(error);
      // Error handling UI could go here
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Insights Feed */}
      <div className="space-y-4 overflow-y-auto pr-2">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-comando-neon" size={20} />
          <h2 className="font-display font-bold text-lg text-l-textPrimary dark:text-d-textPrimary">Insights Automáticos</h2>
        </div>

        {loadingInsights ? (
          <div className="text-center py-10 text-l-textSecondary dark:text-d-textSecondary animate-pulse">Gerando inteligência...</div>
        ) : (
          insights.map((insight) => (
            <div 
              key={insight.id} 
              className={`
                p-5 rounded-xl border border-l-border dark:border-d-border 
                bg-gradient-to-br from-l-surface to-white dark:from-d-surface dark:to-[#1A2433]
                hover:border-comando-neon/50 transition-all shadow-sm
              `}
            >
              <div className="flex items-start gap-3 mb-2">
                {insight.type === 'risk' && <AlertTriangle className="text-func-error" size={20} />}
                {insight.type === 'opportunity' && <Zap className="text-func-warning" size={20} />}
                {insight.type === 'neutral' && <Lightbulb className="text-comando-neon" size={20} />}
                <h3 className="font-bold text-l-textPrimary dark:text-d-textPrimary">{insight.title}</h3>
              </div>
              <p className="text-sm text-l-textSecondary dark:text-d-textSecondary leading-relaxed">
                {insight.description}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Right Column: Chat Interface */}
      <Card className="lg:col-span-2 flex flex-col h-full p-0 overflow-hidden border-comando-neon/30 shadow-[0_0_20px_rgba(130,217,246,0.05)]">
        {/* Chat Header */}
        <div className="p-4 border-b border-l-border dark:border-d-border bg-l-surface/50 dark:bg-d-surface/50 flex items-center gap-3">
            <div className="p-2 bg-comando-neon/20 rounded-lg">
                <Bot className="text-comando-darkInst dark:text-comando-neon" size={24} />
            </div>
            <div>
                <h3 className="font-display font-bold text-l-textPrimary dark:text-d-textPrimary">Assistente Comando Lab</h3>
                <span className="text-xs text-func-success dark:text-func-successDark flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" /> Online
                </span>
            </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-l-bg/50 dark:bg-d-bg/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                    max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user' 
                        ? 'bg-comando-neon text-comando-darkInst rounded-tr-none' 
                        : 'bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary rounded-tl-none'}
                `}>
                    {msg.content}
                </div>
            </div>
          ))}
          {isThinking && (
             <div className="flex justify-start">
                 <div className="bg-l-surface dark:bg-d-surface p-4 rounded-2xl rounded-tl-none border border-l-border dark:border-d-border flex gap-2">
                     <span className="w-2 h-2 bg-comando-neon/50 rounded-full animate-bounce" />
                     <span className="w-2 h-2 bg-comando-neon/50 rounded-full animate-bounce delay-75" />
                     <span className="w-2 h-2 bg-comando-neon/50 rounded-full animate-bounce delay-150" />
                 </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-l-surface dark:bg-d-surface border-t border-l-border dark:border-d-border">
            <div className="flex gap-2 relative">
                <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pergunte sobre suas vendas, metas ou peça uma análise..."
                    className="w-full bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-comando-neon transition-colors text-l-textPrimary dark:text-d-textPrimary placeholder-l-textSecondary dark:placeholder-d-textSecondary"
                />
                <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isThinking}
                    className="absolute right-2 top-1.5 p-1.5 bg-comando-neon text-comando-darkInst rounded-lg hover:bg-comando-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send size={20} />
                </button>
            </div>
            <div className="mt-2 text-center">
                <p className="text-[10px] text-l-textSecondary dark:text-d-textSecondary uppercase tracking-widest opacity-60">Powered by Gemini 2.5 Flash</p>
            </div>
        </div>
      </Card>
    </div>
  );
};