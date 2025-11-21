import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/Card';
import { Bot, Send, Sparkles, Zap, AlertTriangle, Lightbulb } from 'lucide-react';
import { chatWithAnalyst, generateBusinessInsight } from '../services/geminiService';
import { Insight, ChatMessage } from '../types';
import './Intelligence.css';

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
    <div className="intelligence-container">
      {/* Left Column: Insights Feed */}
      <div className="intelligence-insights">
        <div className="intelligence-insights-header">
          <Sparkles className="intelligence-icon" size={20} />
          <h2 className="intelligence-title">Insights Automáticos</h2>
        </div>

        {loadingInsights ? (
          <div className="intelligence-loading">Gerando inteligência...</div>
        ) : (
          insights.map((insight) => (
            <div 
              key={insight.id} 
              className="intelligence-insight-card"
            >
              <div className="intelligence-insight-header">
                {insight.type === 'risk' && <AlertTriangle className="intelligence-insight-icon-error" size={20} />}
                {insight.type === 'opportunity' && <Zap className="intelligence-insight-icon-warning" size={20} />}
                {insight.type === 'neutral' && <Lightbulb className="intelligence-insight-icon-neutral" size={20} />}
                <h3 className="intelligence-insight-title">{insight.title}</h3>
              </div>
              <p className="intelligence-insight-description">
                {insight.description}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Right Column: Chat Interface */}
      <Card className="intelligence-chat-card">
        {/* Chat Header */}
        <div className="intelligence-chat-header">
            <div className="intelligence-chat-bot-icon">
                <Bot className="intelligence-chat-bot-icon-inner" size={24} />
            </div>
            <div>
                <h3 className="intelligence-chat-title">Assistente Comando Lab</h3>
                <span className="intelligence-chat-status">
                    <span className="intelligence-chat-status-dot" /> Online
                </span>
            </div>
        </div>

        {/* Messages Area */}
        <div className="intelligence-chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`intelligence-message-wrapper ${msg.role === 'user' ? 'user' : 'model'}`}>
                <div className={`intelligence-message ${msg.role === 'user' ? 'user-message' : 'model-message'}`}>
                    {msg.content}
                </div>
            </div>
          ))}
          {isThinking && (
             <div className="intelligence-message-wrapper model">
                 <div className="intelligence-thinking">
                     <span className="intelligence-thinking-dot" />
                     <span className="intelligence-thinking-dot delay-1" />
                     <span className="intelligence-thinking-dot delay-2" />
                 </div>
             </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="intelligence-chat-input-area">
            <div className="intelligence-chat-input-wrapper">
                <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pergunte sobre suas vendas, metas ou peça uma análise..."
                    className="intelligence-chat-input"
                />
                <button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isThinking}
                    className="intelligence-chat-send-button"
                >
                    <Send size={20} />
                </button>
            </div>
            <div className="intelligence-chat-footer">
                <p className="intelligence-chat-footer-text">Powered by Gemini 2.5 Flash</p>
            </div>
        </div>
      </Card>
    </div>
  );
};
