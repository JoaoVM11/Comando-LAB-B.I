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
import './Integrations.css';

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
      case IntegrationStatus.CONNECTED: return 'integration-status-connected';
      case IntegrationStatus.ERROR: return 'integration-status-error';
      case IntegrationStatus.SYNCING: return 'integration-status-syncing';
      default: return 'integration-status-disconnected';
    }
  };

  return (
    <div className="integrations-container">
      
      {/* Left Column: Integrations Grid */}
      <div className="integrations-main">
        <div className="integrations-header">
          <div>
            <h2 className="integrations-title">
              Central de <span className="integrations-title-accent">Integrações</span>
            </h2>
            <p className="integrations-subtitle">
              Gerencie APIs, CRMs e fontes de dados.
            </p>
          </div>
          <button 
            onClick={() => {
              setSelectedIntegration({ id: 'new', name: 'Nova API Custom', type: 'API', status: IntegrationStatus.DISCONNECTED, logo: 'code' });
              setIsModalOpen(true);
            }}
            className="integrations-add-button"
          >
            + Adicionar Fonte
          </button>
        </div>

        <div className="integrations-grid">
          {integrations.map((item) => (
            <div 
              key={item.id} 
              className="integration-card"
            >
              <div className="integration-card-header">
                <div className="integration-card-icon-wrapper">
                  <div className="integration-card-icon">
                    {getIcon(item.type, item.logo)}
                  </div>
                  <div>
                    <h3 className="integration-card-name">{item.name}</h3>
                    <span className="integration-card-type">{item.type}</span>
                  </div>
                </div>
                <span className={`integration-status-badge ${getStatusColor(item.status)}`}>
                  {item.status === IntegrationStatus.SYNCING ? 'Sincronizando...' : item.status}
                </span>
              </div>

              <p className="integration-card-description">{item.description}</p>

              <div className="integration-card-actions">
                {(item.status === IntegrationStatus.CONNECTED || item.status === IntegrationStatus.SYNCING) ? (
                  <>
                     <button 
                       onClick={() => handleSync(item.id)}
                       disabled={item.status === IntegrationStatus.SYNCING}
                       className={`integration-action-button sync ${item.status === IntegrationStatus.SYNCING ? 'spinning' : ''}`}
                     >
                       <RotateCw size={14} /> Sincronizar
                     </button>
                     <button 
                       onClick={() => handleDisconnect(item.id)}
                       className="integration-action-button disconnect"
                     >
                       <Power size={14} /> Desconectar
                     </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleOpenConnect(item)}
                    className="integration-action-button connect"
                  >
                    <Power size={14} /> Conectar Agora
                  </button>
                )}
              </div>

              {item.status === IntegrationStatus.CONNECTED && (
                 <button 
                    onClick={() => handleTestConnection(item.id)}
                    className="integration-test-button"
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
      <div className="integrations-logs">
        <div className="integrations-logs-sticky">
           <div className="integrations-terminal">
              {/* Terminal Header */}
              <div className="integrations-terminal-header">
                 <div className="integrations-terminal-header-left">
                    <Terminal size={16} className="integrations-terminal-icon" />
                    <span className="integrations-terminal-title">System Logs</span>
                 </div>
                 <div className="integrations-terminal-dots">
                    <div className="integrations-terminal-dot red"></div>
                    <div className="integrations-terminal-dot yellow"></div>
                    <div className="integrations-terminal-dot green"></div>
                 </div>
              </div>

              {/* Logs Content */}
              <div className="integrations-terminal-content">
                 {logs.length === 0 && <div className="integrations-terminal-empty">Aguardando eventos...</div>}
                 {logs.map((log) => (
                    <div key={log.id} className="integrations-log-item">
                       <span className="integrations-log-timestamp">[{log.timestamp}]</span>
                       <span className={`integrations-log-message ${log.level}`}>
                          <span className="integrations-log-level">{log.level}:</span>
                          {log.message}
                       </span>
                    </div>
                 ))}
                 <div ref={logsEndRef} />
              </div>
              
              {/* Footer Status */}
              <div className="integrations-terminal-footer">
                  <span>Status: Online</span>
                  <span className="integrations-terminal-live">● Live</span>
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
          <div className="integrations-modal-upload">
             <div className="integrations-upload-icon-wrapper">
                <UploadCloud size={32} className="integrations-upload-icon" />
             </div>
             <div>
               <h4 className="integrations-upload-title">Arraste sua planilha .xlsx</h4>
               <p className="integrations-upload-subtitle">Ou clique para selecionar do computador</p>
             </div>
             <input 
               type="file" 
               accept=".xlsx, .xls" 
               onChange={handleFileUpload}
               className="integrations-file-input"
             />
             {isProcessing && <p className="integrations-processing">Processando arquivo...</p>}
          </div>
        ) : (
          <div className="integrations-modal-form">
            <div className="integrations-security-notice">
              <Shield size={20} className="integrations-security-icon" />
              <div className="integrations-security-text">
                <strong className="integrations-security-title">Conexão Segura</strong>
                Suas credenciais são criptografadas localmente (Mock) e usadas apenas para sincronização.
              </div>
            </div>

            <div className="integrations-auth-method">
              <label className="integrations-form-label">Método de Autenticação</label>
              <div className="integrations-auth-buttons">
                {['apikey', 'oauth2', 'webhook'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setAuthType(type)}
                    className={`integrations-auth-button ${authType === type ? 'active' : ''}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            {authType !== 'oauth2' && (
              <>
                <div className="integrations-form-field">
                  <label className="integrations-form-label">Base URL (Opcional)</label>
                  <input 
                    type="text" 
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://api.seucrm.com/v2"
                    className="integrations-form-input"
                  />
                </div>
                <div className="integrations-form-field">
                  <label className="integrations-form-label">API Key / Token</label>
                  <div className="integrations-form-input-wrapper">
                    <Lock size={16} className="integrations-form-input-icon" />
                    <input 
                      type="password" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Cole sua chave aqui"
                      className="integrations-form-input with-icon"
                    />
                  </div>
                </div>
              </>
            )}

            {authType === 'oauth2' && (
               <div className="integrations-oauth-section">
                  <button 
                    onClick={handleConnect}
                    className="integrations-oauth-button"
                  >
                    <img src="https://www.google.com/favicon.ico" className="integrations-oauth-icon" alt="Google" />
                    Entrar com {selectedIntegration?.name}
                  </button>
                  <p className="integrations-oauth-note">Você será redirecionado para a página de consentimento.</p>
               </div>
            )}

            {authType !== 'oauth2' && (
               <div className="integrations-modal-actions">
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="integrations-modal-cancel"
                 >
                   Cancelar
                 </button>
                 <button 
                   onClick={handleConnect}
                   disabled={isProcessing}
                   className="integrations-modal-save"
                 >
                   {isProcessing ? 'Conectando...' : 'Salvar e Conectar'} {isProcessing && <Activity size={16} className="spinning" />}
                 </button>
               </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
};
