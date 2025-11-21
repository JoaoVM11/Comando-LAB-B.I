
// Integration Types
export enum IntegrationStatus {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  ERROR = 'Error',
  SYNCING = 'Syncing'
}

export interface IntegrationConfig {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  baseUrl?: string;
  authType?: 'oauth2' | 'apikey' | 'bearer' | 'basic';
  permissions?: string[];
}

export interface IntegrationLog {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
  integrationId: string;
}

export interface Integration {
  id: string;
  name: string;
  logo: string; // Using lucide icon name or url
  type: 'CRM' | 'ERP' | 'Spreadsheet' | 'API';
  status: IntegrationStatus;
  lastSync?: string;
  config?: IntegrationConfig;
  description?: string;
}

// Intelligence/AI Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'risk' | 'opportunity' | 'neutral';
  metric?: string;
  change?: number; // percentage
}

// Dashboard Types
export interface KPIData {
  label: string;
  value: string | number;
  trend: number; // percentage
  isCurrency?: boolean;
}

export interface SalesData {
  name: string;
  value: number;
  target: number;
}

// Mockup Library
export interface DashboardTemplate {
  id: string;
  name: string;
  category: 'Comercial' | 'Financeiro' | 'Estoque' | 'Marketing' | 'Operações';
  description: string;
  previewColor: string;
}

export interface Report {
  id: string;
  name: string;
  date: string;
  format: 'PDF' | 'CSV' | 'XLSX';
  size: string;
}

// Notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'insight' | 'info';
  time: string;
  read: boolean;
}

// --- SUPER ADMIN TYPES ---

export type UserRole = 'superadmin' | 'supervisor' | 'user';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  avatar?: string;
  jobTitle?: string; // Novo campo: Cargo
  password?: string; // Novo campo: Senha (simulação de DB)
}

export interface Company {
  id: string;
  name: string;
  site: string;
  segment: string;
  state: string; // UF
  package: 'Basic' | 'Pro' | 'Enterprise';
  recurringValue: number;
  maxUsers: number;
  userCount: number;
  status: 'Active' | 'Churned' | 'Trial';
}

export interface ApiTemplate {
  id: string;
  name: string;
  description: string;
  type: 'CRM' | 'ERP' | 'Sheets' | 'API';
  baseUrl: string;
  authType: 'oauth2' | 'apikey' | 'bearer';
  defaultHeaders: string; // JSON string
  isActive: boolean;
}
