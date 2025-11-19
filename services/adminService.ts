import { Company, PlatformUser, ApiTemplate, UserRole } from '../types';
import * as XLSX from 'xlsx';

const COMPANIES_KEY = 'comando_admin_companies';
const USERS_KEY = 'comando_admin_users';
const APIS_KEY = 'comando_admin_apis';

class AdminService {
  private companies: Company[] = [];
  private users: PlatformUser[] = [];
  private apis: ApiTemplate[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    const c = localStorage.getItem(COMPANIES_KEY);
    const u = localStorage.getItem(USERS_KEY);
    const a = localStorage.getItem(APIS_KEY);

    if (c) this.companies = JSON.parse(c);
    else {
        this.companies = [
            { id: '1', name: 'Tech Solutions', site: 'techsol.com.br', segment: 'Tecnologia', state: 'SP', package: 'Enterprise', recurringValue: 4990, maxUsers: 50, userCount: 12, status: 'Active' },
            { id: '2', name: 'Varejo Norte', site: 'varejonorte.com.br', segment: 'Varejo', state: 'AM', package: 'Pro', recurringValue: 2490, maxUsers: 20, userCount: 8, status: 'Active' },
        ];
        this.saveCompanies();
    }

    if (u) this.users = JSON.parse(u);
    else {
        // Mock initial users linked to companies
        this.users = [
            { id: 'u1', name: 'Carlos CEO', email: 'carlos@techsol.com.br', role: 'supervisor', companyId: '1' },
            { id: 'u2', name: 'Ana Vendas', email: 'ana@techsol.com.br', role: 'user', companyId: '1' }
        ];
        this.saveUsers();
    }

    if (a) this.apis = JSON.parse(a);
    else {
        this.apis = [
            { id: 'api1', name: 'Salesforce V2', description: 'Integração padrão Salesforce via OAuth2', type: 'CRM', baseUrl: 'https://login.salesforce.com', authType: 'oauth2', defaultHeaders: '{}', isActive: true }
        ];
        this.saveApis();
    }
  }

  private saveCompanies() { localStorage.setItem(COMPANIES_KEY, JSON.stringify(this.companies)); }
  private saveUsers() { localStorage.setItem(USERS_KEY, JSON.stringify(this.users)); }
  private saveApis() { localStorage.setItem(APIS_KEY, JSON.stringify(this.apis)); }

  // --- Company Management ---
  getCompanies() { return this.companies; }
  
  createCompany(data: Omit<Company, 'id' | 'userCount'>) {
    const newCompany: Company = {
        ...data,
        id: Date.now().toString(),
        userCount: 0
    };
    this.companies.push(newCompany);
    this.saveCompanies();
    return newCompany;
  }

  deleteCompany(id: string) {
      this.companies = this.companies.filter(c => c.id !== id);
      this.users = this.users.filter(u => u.companyId !== id); // Cascade delete users
      this.saveCompanies();
      this.saveUsers();
  }

  // --- User Management ---
  getUsersByCompany(companyId: string) { return this.users.filter(u => u.companyId === companyId); }

  createUser(data: Omit<PlatformUser, 'id'>) {
      const company = this.companies.find(c => c.id === data.companyId);
      if (!company) throw new Error('Empresa não encontrada');
      if (company.userCount >= company.maxUsers) throw new Error('Limite de usuários excedido para este pacote.');

      const newUser: PlatformUser = {
          ...data,
          id: Date.now().toString() + Math.random().toString(36).substr(2,5)
      };
      
      this.users.push(newUser);
      company.userCount++;
      
      this.saveUsers();
      this.saveCompanies();
      return newUser;
  }

  deleteUser(userId: string) {
      const user = this.users.find(u => u.id === userId);
      if(user) {
          const company = this.companies.find(c => c.id === user.companyId);
          if(company) {
              company.userCount = Math.max(0, company.userCount - 1);
              this.saveCompanies();
          }
      }
      this.users = this.users.filter(u => u.id !== userId);
      this.saveUsers();
  }

  // --- Excel Import ---
  async importUsersFromExcel(companyId: string, file: File): Promise<{ added: number, errors: number, details: string[] }> {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
              try {
                  const data = e.target?.result;
                  const workbook = XLSX.read(data, { type: 'binary' });
                  const sheet = workbook.Sheets[workbook.SheetNames[0]];
                  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

                  let added = 0;
                  let errors = 0;
                  const details: string[] = [];
                  const company = this.companies.find(c => c.id === companyId);
                  
                  if(!company) { reject('Empresa inválida'); return; }

                  for(const row of rows) {
                      // Validate Columns: Name, Email, Role
                      if(!row.Nome || !row.Email || !row.Cargo) {
                          errors++;
                          details.push(`Linha inválida: Falta Nome, Email ou Cargo.`);
                          continue;
                      }

                      // Check duplicate
                      if(this.users.find(u => u.email === row.Email)) {
                          errors++;
                          details.push(`Duplicado: ${row.Email} já existe.`);
                          continue;
                      }

                      // Check limit
                      if(company.userCount >= company.maxUsers) {
                          errors++;
                          details.push(`Limite excedido: Pacote da empresa cheio.`);
                          continue;
                      }

                      this.createUser({
                          name: row.Nome,
                          email: row.Email,
                          role: (row.Funcao === 'Supervisor' || row.Funcao === 'supervisor') ? 'supervisor' : 'user',
                          companyId: companyId,
                          avatar: row.Nome.substr(0,2).toUpperCase()
                      });
                      added++;
                  }
                  resolve({ added, errors, details });
              } catch (err) {
                  reject(err);
              }
          };
          reader.readAsBinaryString(file);
      });
  }

  // --- API Library ---
  getApis() { return this.apis; }
  
  createApi(data: Omit<ApiTemplate, 'id'>) {
      const newApi: ApiTemplate = { ...data, id: Date.now().toString() };
      this.apis.push(newApi);
      this.saveApis();
  }

  deleteApi(id: string) {
      this.apis = this.apis.filter(a => a.id !== id);
      this.saveApis();
  }

  // --- Dashboard Stats ---
  getAdminStats() {
      const totalMRR = this.companies.reduce((acc, c) => acc + c.recurringValue, 0);
      const totalUsers = this.users.length;
      const activeCompanies = this.companies.filter(c => c.status === 'Active').length;
      
      // Segment Data
      const segments: Record<string, number> = {};
      this.companies.forEach(c => {
          segments[c.segment] = (segments[c.segment] || 0) + 1;
      });

      // State Data
      const states: Record<string, number> = {};
      this.companies.forEach(c => {
          states[c.state] = (states[c.state] || 0) + 1;
      });

      return { totalMRR, totalUsers, activeCompanies, segments, states };
  }
}

export const adminService = new AdminService();
