import { Integration, IntegrationConfig, IntegrationLog, IntegrationStatus } from '../types';
import * as XLSX from 'xlsx';

// --- Constants & Mock Data ---
const INTEGRATIONS_STORAGE_KEY = 'comando_integrations_v1';
const LOGS_STORAGE_KEY = 'comando_logs_v1';

// --- Helper Functions ---
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

const saveIntegrations = (integrations: Integration[]) => {
  localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(integrations));
};

const saveLogs = (logs: IntegrationLog[]) => {
  // Keep only last 50 logs to prevent storage bloat
  const trimmedLogs = logs.slice(-50);
  localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(trimmedLogs));
};

// --- Core Service Class ---
class IntegrationService {
  private integrations: Integration[] = [];
  private logs: IntegrationLog[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const storedInt = localStorage.getItem(INTEGRATIONS_STORAGE_KEY);
    const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);

    if (storedInt) {
      this.integrations = JSON.parse(storedInt);
    } else {
      // Initialize with default list if empty
      this.integrations = [
        { id: '1', name: 'Salesforce', logo: 'cloud', type: 'CRM', status: IntegrationStatus.DISCONNECTED, description: 'CRM líder mundial.' },
        { id: '2', name: 'HubSpot', logo: 'target', type: 'CRM', status: IntegrationStatus.DISCONNECTED, description: 'Marketing e Vendas inbound.' },
        { id: '3', name: 'Bitrix24', logo: 'briefcase', type: 'CRM', status: IntegrationStatus.DISCONNECTED, description: 'Colaboração e CRM.' },
        { id: '4', name: 'Google Sheets', logo: 'sheet', type: 'Spreadsheet', status: IntegrationStatus.DISCONNECTED, description: 'Planilhas em nuvem.' },
        { id: '5', name: 'Totvs Protheus', logo: 'building', type: 'ERP', status: IntegrationStatus.DISCONNECTED, description: 'ERP robusto para grandes empresas.' },
        { id: '6', name: 'Omie', logo: 'layers', type: 'ERP', status: IntegrationStatus.DISCONNECTED, description: 'ERP em nuvem para PMEs.' },
        { id: '7', name: 'API Customizada', logo: 'code', type: 'API', status: IntegrationStatus.DISCONNECTED, description: 'Conexão REST Genérica.' },
        { id: '8', name: 'Excel Upload', logo: 'file-spreadsheet', type: 'Spreadsheet', status: IntegrationStatus.DISCONNECTED, description: 'Importação de arquivos locais.' },
      ];
      saveIntegrations(this.integrations);
    }

    if (storedLogs) {
      this.logs = JSON.parse(storedLogs);
    }
  }

  // --- Logging System ---
  public addLog(integrationId: string, level: 'info' | 'success' | 'error' | 'warning', message: string) {
    const newLog: IntegrationLog = {
      id: generateId(),
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      level,
      message,
      integrationId
    };
    this.logs.push(newLog);
    saveLogs(this.logs);
    return newLog;
  }

  public getLogs(integrationId?: string): IntegrationLog[] {
    if (integrationId) {
      return this.logs.filter(l => l.integrationId === integrationId).reverse();
    }
    return [...this.logs].reverse();
  }

  public getAllIntegrations(): Integration[] {
    return this.integrations;
  }

  // --- Connection Logic ---

  public async connectIntegration(id: string, config: IntegrationConfig): Promise<{ success: boolean; message: string }> {
    const integration = this.integrations.find(i => i.id === id);
    if (!integration) return { success: false, message: 'Integração não encontrada.' };

    this.addLog(id, 'info', `Iniciando conexão com ${integration.name}...`);
    
    // Simulate Network Delay
    await wait(1500);

    // Validation Logic (Mock)
    if (integration.type === 'CRM' || integration.type === 'ERP' || integration.type === 'API') {
      if (!config.apiKey && !config.clientId) {
         this.addLog(id, 'error', `Falha na autenticação: Credenciais ausentes.`);
         return { success: false, message: 'Credenciais inválidas.' };
      }
    }

    // Specific logic for "Excel" which doesn't really "connect" persistently in this context, but we simulate state
    if (integration.name === 'Excel Upload') {
        this.addLog(id, 'success', 'Módulo de upload pronto.');
    }

    // Mock Authentication Success
    integration.status = IntegrationStatus.CONNECTED;
    integration.config = config; // Save config (In real app, encrypt this!)
    integration.lastSync = new Date().toISOString();
    
    this.integrations = this.integrations.map(i => i.id === id ? integration : i);
    saveIntegrations(this.integrations);

    this.addLog(id, 'success', `Conexão estabelecida com sucesso via ${config.authType || 'API Key'}.`);
    return { success: true, message: 'Conectado com sucesso.' };
  }

  public async disconnectIntegration(id: string): Promise<void> {
    const integration = this.integrations.find(i => i.id === id);
    if (!integration) return;

    this.addLog(id, 'warning', `Encerrando conexão com ${integration.name}...`);
    await wait(800);

    integration.status = IntegrationStatus.DISCONNECTED;
    integration.config = undefined;
    
    this.integrations = this.integrations.map(i => i.id === id ? integration : i);
    saveIntegrations(this.integrations);
    this.addLog(id, 'info', `Conexão encerrada.`);
  }

  public async testConnection(id: string): Promise<'OK' | 'TIMEOUT' | 'AUTH_FAIL'> {
    const integration = this.integrations.find(i => i.id === id);
    this.addLog(id, 'info', `Testando ping para ${integration?.name || 'Endpoint'}...`);
    
    await wait(1000);

    // Randomly simulate issues for demo purposes if configured, otherwise success
    const rand = Math.random();
    if (rand > 0.9) {
        this.addLog(id, 'error', 'Timeout: O servidor não respondeu em 3000ms.');
        return 'TIMEOUT';
    } else if (rand > 0.8) {
        this.addLog(id, 'error', 'Erro 401: Token expirado ou inválido.');
        return 'AUTH_FAIL';
    }

    this.addLog(id, 'success', 'Ping OK (124ms).');
    return 'OK';
  }

  // --- Data Syncing Simulation ---

  public async syncData(id: string): Promise<void> {
    const integration = this.integrations.find(i => i.id === id);
    if (!integration || integration.status !== IntegrationStatus.CONNECTED) return;

    integration.status = IntegrationStatus.SYNCING;
    this.integrations = [...this.integrations]; // Trigger update
    this.addLog(id, 'info', 'Iniciando sincronização de dados...');

    await wait(2500); // Sync time

    // Update entities count mock
    this.addLog(id, 'success', `Sincronização concluída. 142 Negócios, 58 Empresas importados.`);
    
    integration.status = IntegrationStatus.CONNECTED;
    integration.lastSync = new Date().toISOString();
    saveIntegrations(this.integrations);
  }

  // --- Excel Parser ---
  public async processExcelFile(file: File): Promise<void> {
     const integrationId = this.integrations.find(i => i.name === 'Excel Upload')?.id || '8';
     this.addLog(integrationId, 'info', `Lendo arquivo: ${file.name} (${(file.size/1024).toFixed(2)} KB)`);

     return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = (e) => {
             try {
                 const data = e.target?.result;
                 const workbook = XLSX.read(data, { type: 'binary' });
                 const firstSheetName = workbook.SheetNames[0];
                 const worksheet = workbook.Sheets[firstSheetName];
                 const json = XLSX.utils.sheet_to_json(worksheet);
                 
                 this.addLog(integrationId, 'success', `Arquivo processado. ${json.length} linhas encontradas na aba "${firstSheetName}".`);
                 
                 // Update status
                 const excelInt = this.integrations.find(i => i.id === integrationId);
                 if(excelInt) {
                     excelInt.status = IntegrationStatus.CONNECTED;
                     excelInt.lastSync = new Date().toISOString();
                     saveIntegrations(this.integrations);
                 }
                 
                 resolve();
             } catch (err) {
                 this.addLog(integrationId, 'error', 'Falha ao processar arquivo .xlsx. Verifique o formato.');
                 reject(err);
             }
         };
         reader.readAsBinaryString(file);
     });
  }
}

export const integrationService = new IntegrationService();