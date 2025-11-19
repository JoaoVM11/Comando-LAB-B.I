import React, { useState, useEffect, useRef } from 'react';
import { Integration, IntegrationConfig, IntegrationLog, IntegrationStatus } from '../types';
import { integrationService } from '../services/integrationService';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { 
  CheckCircle2, AlertCircle, Power, RotateCw, Database, 
  FileSpreadsheet, Code, Shield, Server, X, Activity, Terminal, 
  UploadCloud, Lock, Play
} from 'lucide-react';

export const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [logs, setLogs] = useState<IntegrationLog[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Form States
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [authType, setAuthType] = useState('apikey');

  // Refresh Data
  const refreshData = () => {
    setIntegrations([...integrationService.getAllIntegrations()]);
    setLogs([...integrationService.getLogs()]);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Poll logs/status
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleOpenConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setApiKey('');
    setBaseUrl('');
    setIsModalOpen(true);
  };

  const handleConnect = async () => {
    if (!selectedIntegration) return;
    setIsProcessing(true);

    const config: IntegrationConfig = {
      apiKey,
      baseUrl,
      authType: authType as any
    };

    await integrationService.connectIntegration(selectedIntegration.id, config);
    
    setIsProcessing(false);
    setIsModalOpen(false);
    refreshData();
  };

  const handleDisconnect = async (id: string) => {
    await integrationService.disconnectIntegration(id);
    refreshData();
  };

  const handleSync = async (id: string) => {
    await integrationService.syncData(id);
    refreshData();
  };

  const handleTestConnection = async (id: string) => {
    await integrationService.testConnection(id);
    refreshData();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsProcessing(true);
      await integrationService.processExcelFile(e.target.files[0]);
      setIsProcessing(false);
      setIsModalOpen(false);
      refreshData();
    }
  };

  // Helper for Icons
  const getIcon = (type: string, logo: string) => {
    if (logo === 'sheet' || logo === 'file-spreadsheet') return <FileSpreadsheet size={24} />;
    if (type === 'API') return <Code size={24} />;
    if (type === 'ERP') return <Server size={24} />;
    return <Database size={24} />;
  };

  // Helper for Status Color
  const getStatusColor = (status: IntegrationStatus) => {
    switch (status) {
      case IntegrationStatus.CONNECTED: return 'text-func-success border-func-success/30 bg-func-success/10';
      case IntegrationStatus.ERROR: return 'text-func-error border-func-error/30 bg-func-error/10';
      case IntegrationStatus.SYNCING: return 'text-comando-neon border-comando-neon/30 bg-comando-neon/10';
      default: return 'text-gray-500 border-gray-700 bg-gray-800/50';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-10 min-h-screen">
      
      {/* Left Column: Integrations Grid */}
      <div className="xl:col-span-2 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-display font-bold text-l-textPrimary dark:text-d-textPrimary uppercase tracking-wider">
              Central de <span className="text-comando-neon">Integrações</span>
            </h2>
            <p className="text-l-textSecondary dark:text-d-textSecondary text-sm mt-1">
              Gerencie APIs, CRMs e fontes de dados.
            </p>
          </div>
          <button 
            onClick={() => {
              setSelectedIntegration({ id: 'new', name: 'Nova API Custom', type: 'API', status: IntegrationStatus.DISCONNECTED, logo: 'code' });
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-comando-darkInst border border-comando-neon text-comando-neon rounded-lg hover:bg-comando-neon hover:text-comando-darkInst transition-all text-sm font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(130,217,246,0.2)]"
          >
            + Adicionar Fonte
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((item) => (
            <div 
              key={item.id} 
              className={`
                relative group overflow-hidden rounded-xl bg-l-surface dark:bg-[#0b101b] border border-l-border dark:border-[#1e2736] p-6 transition-all duration-300
                hover:border-comando-neon/50 hover:shadow-[0_0_20px_rgba(130,217,246,0.1)]
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-black/40 text-comando-neon border border-white/5">
                    {getIcon(item.type, item.logo)}
                  </div>
                  <div>
                    <h3 className="font-bold text-l-textPrimary dark:text-d-textPrimary">{item.name}</h3>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500">{item.type}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(item.status)}`}>
                  {item.status === IntegrationStatus.SYNCING ? 'Sincronizando...' : item.status}
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-6 min-h-[2.5em]">{item.description}</p>

              <div className="grid grid-cols-2 gap-2">
                {item.status === IntegrationStatus.CONNECTED ? (
                  <>
                     <button 
                       onClick={() => handleSync(item.id)}
                       disabled={item.status === IntegrationStatus.SYNCING}
                       className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-comando-neon/10 text-comando-neon border border-comando-neon/20 hover:bg-comando-neon/20 transition-colors text-xs font-bold uppercase"
                     >
                       <RotateCw size={14} className={item.status === IntegrationStatus.SYNCING ? 'animate-spin' : ''} /> Sincronizar
                     </button>
                     <button 
                       onClick={() => handleDisconnect(item.id)}
                       className="flex items-center justify-center gap-2 px-3 py-2 rounded bg-func-error/10 text-func-error border border-func-error/20 hover:bg-func-error/20 transition-colors text-xs font-bold uppercase"
                     >
                       <Power size={14} /> Desconectar
                     </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleOpenConnect(item)}
                    className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 rounded bg-comando-neon text-comando-darkInst font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(130,217,246,0.4)] transition-all text-xs"
                  >
                    <Power size={14} /> Conectar Agora
                  </button>
                )}
              </div>

              {item.status === IntegrationStatus.CONNECTED && (
                 <button 
                    onClick={() => handleTestConnection(item.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-comando-neon transition-all"
                    title="Testar Conexão"
                 >
                    <Activity size={14} />
                 </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Logs Terminal */}
      <div className="xl:col-span-1">
        <div className="sticky top-24">
           <div className="bg-[#080a0f] border border-[#1e2736] rounded-xl overflow-hidden flex flex-col h-[calc(100vh-10rem)] shadow-2xl">
              {/* Terminal Header */}
              <div className="bg-[#161d2a] p-3 border-b border-[#1e2736] flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-comando-neon" />
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">System Logs</span>
                 </div>
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500"></div>
                 </div>
              </div>

              {/* Logs Content */}
              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 bg-black/50 backdrop-blur-sm">
                 {logs.length === 0 && <div className="text-gray-600 italic">Aguardando eventos...</div>}
                 {logs.map((log) => (
                    <div key={log.id} className="flex gap-2 animate-fade-in">
                       <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                       <span className={`
                          break-all
                          ${log.level === 'error' ? 'text-func-error' : ''}
                          ${log.level === 'success' ? 'text-func-success' : ''}
                          ${log.level === 'warning' ? 'text-func-warning' : ''}
                          ${log.level === 'info' ? 'text-blue-300' : ''}
                       `}>
                          <span className="uppercase font-bold mr-1">{log.level}:</span>
                          {log.message}
                       </span>
                    </div>
                 ))}
                 <div ref={logsEndRef} />
              </div>
              
              {/* Footer Status */}
              <div className="p-2 bg-[#0b101b] border-t border-[#1e2736] text-[10px] text-gray-500 flex justify-between">
                  <span>Status: Online</span>
                  <span className="animate-pulse text-comando-neon">● Live</span>
              </div>
           </div>
        </div>
      </div>

      {/* Connection Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Conectar ${selectedIntegration?.name || 'Fonte'}`}
      >
        {selectedIntegration?.name === 'Excel Upload' ? (
          <div className="space-y-6 text-center py-8">
             <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-600">
                <UploadCloud size={32} className="text-gray-400" />
             </div>
             <div>
               <h4 className="text-white font-bold mb-2">Arraste sua planilha .xlsx</h4>
               <p className="text-gray-500 text-sm">Ou clique para selecionar do computador</p>
             </div>
             <input 
               type="file" 
               accept=".xlsx, .xls" 
               onChange={handleFileUpload}
               className="block w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-comando-neon file:text-comando-darkInst
                 hover:file:bg-comando-hover cursor-pointer"
             />
             {isProcessing && <p className="text-comando-neon animate-pulse text-sm">Processando arquivo...</p>}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-3">
              <Shield size={20} className="text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200">
                <strong className="block text-blue-400 mb-1">Conexão Segura</strong>
                Suas credenciais são criptografadas localmente (Mock) e usadas apenas para sincronização.
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Método de Autenticação</label>
              <div className="flex gap-2 p-1 bg-[#0b101b] rounded-lg border border-[#1e2736]">
                {['apikey', 'oauth2', 'webhook'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setAuthType(type)}
                    className={`flex-1 py-2 rounded text-xs font-bold uppercase transition-all ${authType === type ? 'bg-comando-neon text-comando-darkInst' : 'text-gray-500 hover:text-white'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            {authType !== 'oauth2' && (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Base URL (Opcional)</label>
                  <input 
                    type="text" 
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://api.seucrm.com/v2"
                    className="w-full bg-[#0b101b] border border-[#1e2736] rounded-lg p-3 text-white placeholder-gray-600 focus:border-comando-neon focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">API Key / Token</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3.5 text-gray-500" />
                    <input 
                      type="password" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Cole sua chave aqui"
                      className="w-full bg-[#0b101b] border border-[#1e2736] rounded-lg p-3 pl-10 text-white placeholder-gray-600 focus:border-comando-neon focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {authType === 'oauth2' && (
               <div className="text-center py-4">
                  <button 
                    onClick={handleConnect}
                    className="w-full py-3 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200"
                  >
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                    Entrar com {selectedIntegration?.name}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Você será redirecionado para a página de consentimento.</p>
               </div>
            )}

            {authType !== 'oauth2' && (
               <div className="flex justify-end gap-3 pt-4 border-t border-[#1e2736]">
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="px-4 py-2 rounded text-gray-400 hover:text-white transition-colors"
                 >
                   Cancelar
                 </button>
                 <button 
                   onClick={handleConnect}
                   disabled={isProcessing}
                   className="px-6 py-2 rounded bg-comando-neon text-comando-darkInst font-bold uppercase tracking-wider hover:shadow-[0_0_15px_rgba(130,217,246,0.4)] transition-all flex items-center gap-2"
                 >
                   {isProcessing ? 'Conectando...' : 'Salvar e Conectar'} {isProcessing && <Activity size={16} className="animate-spin" />}
                 </button>
               </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
};