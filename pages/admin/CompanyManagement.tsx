import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Company, PlatformUser } from '../../types';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Building, Plus, Trash2, Users, Upload, FileSpreadsheet, Download } from 'lucide-react';
import './CompanyManagement.css';

// Lista completa de estados brasileiros
const BR_STATES = [
    { value: 'AC', label: 'Acre' }, 
    { value: 'AL', label: 'Alagoas' }, 
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' }, 
    { value: 'BA', label: 'Bahia' }, 
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' }, 
    { value: 'ES', label: 'Espírito Santo' }, 
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' }, 
    { value: 'MT', label: 'Mato Grosso' }, 
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' }, 
    { value: 'PA', label: 'Pará' }, 
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' }, 
    { value: 'PE', label: 'Pernambuco' }, 
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' }, 
    { value: 'RN', label: 'Rio Grande do Norte' }, 
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' }, 
    { value: 'RR', label: 'Roraima' }, 
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' }, 
    { value: 'SE', label: 'Sergipe' }, 
    { value: 'TO', label: 'Tocantins' }
];

export const CompanyManagement: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
    const [companyUsers, setCompanyUsers] = useState<PlatformUser[]>([]);
    
    // Create Company Form
    const [newCompany, setNewCompany] = useState<Partial<Company>>({ package: 'Pro', maxUsers: 10 });

    // Excel Import
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importStatus, setImportStatus] = useState<string | null>(null);

    useEffect(() => {
        setCompanies(adminService.getCompanies());
    }, []);

    const handleCreateCompany = () => {
        if(newCompany.name && newCompany.site) {
            adminService.createCompany(newCompany as any);
            setCompanies([...adminService.getCompanies()]);
            setIsCreateModalOpen(false);
        }
    };

    const handleDeleteCompany = (id: string) => {
        if(confirm('Tem certeza? Isso apagará todos os usuários desta empresa.')) {
            adminService.deleteCompany(id);
            setCompanies([...adminService.getCompanies()]);
        }
    };

    const openUsersModal = (company: Company) => {
        setSelectedCompany(company);
        setCompanyUsers(adminService.getUsersByCompany(company.id));
        setIsUsersModalOpen(true);
        setImportStatus(null);
    };

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        if(selectedCompany) {
             try {
                adminService.createUser({
                    name: formData.get('name') as string,
                    email: formData.get('email') as string,
                    role: formData.get('role') as any,
                    companyId: selectedCompany.id,
                    avatar: 'U',
                    jobTitle: formData.get('jobTitle') as string,
                    password: formData.get('password') as string
                });
                setCompanyUsers(adminService.getUsersByCompany(selectedCompany.id));
                setCompanies([...adminService.getCompanies()]); // Update user count
                (e.target as HTMLFormElement).reset();
             } catch (err: any) {
                 alert(err.message);
             }
        }
    };

    const handleExcelUpload = async () => {
        if(importFile && selectedCompany) {
            setImportStatus('Processando...');
            try {
                const result = await adminService.importUsersFromExcel(selectedCompany.id, importFile);
                setImportStatus(`Sucesso: ${result.added} adicionados. Erros: ${result.errors}.`);
                setCompanyUsers(adminService.getUsersByCompany(selectedCompany.id));
                setCompanies([...adminService.getCompanies()]); // Update user count
            } catch (err: any) {
                setImportStatus(`Erro: ${err}`);
            }
        }
    };

    return (
        <div className="company-management-container">
            <div className="company-management-header">
                <div>
                    <h1 className="company-management-title">Gestão de Empresas</h1>
                    <p className="company-management-subtitle">Cadastre e gerencie contas corporativas.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="company-management-add-button"
                >
                    <Plus size={20} /> Nova Empresa
                </button>
            </div>

            <div className="company-management-list">
                {companies.map(company => (
                    <Card key={company.id} className="company-card">
                        <div className="company-card-content">
                            <div className="company-card-info">
                                <div className="company-card-icon">
                                    <Building size={24} />
                                </div>
                                <div>
                                    <h3 className="company-card-name">{company.name}</h3>
                                    <div className="company-card-meta">
                                        <span>{company.site}</span>
                                        <span className="company-card-separator"></span>
                                        <span>{company.segment} - {company.state}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="company-card-stats">
                                 <div className="company-stat">
                                     <p className="company-stat-label">Pacote</p>
                                     <span className="company-stat-value package">{company.package}</span>
                                 </div>
                                 <div className="company-stat">
                                     <p className="company-stat-label">Usuários</p>
                                     <span className={`company-stat-value users ${company.userCount >= company.maxUsers ? 'limit' : ''}`}>
                                         {company.userCount} / {company.maxUsers}
                                     </span>
                                 </div>
                                 <div className="company-stat">
                                     <p className="company-stat-label">MRR</p>
                                     <span className="company-stat-value mrr">R$ {company.recurringValue}</span>
                                 </div>
                                 
                                 <div className="company-card-actions">
                                     <button 
                                        onClick={() => openUsersModal(company)}
                                        className="company-action-button users"
                                        title="Gerenciar Usuários"
                                     >
                                         <Users size={18} />
                                     </button>
                                     <button 
                                        onClick={() => handleDeleteCompany(company.id)}
                                        className="company-action-button delete"
                                        title="Excluir Empresa"
                                     >
                                         <Trash2 size={18} />
                                     </button>
                                 </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Create Company Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nova Empresa Enterprise">
                <div className="company-modal-form">
                    <input 
                        placeholder="Nome da Empresa" 
                        onChange={e => setNewCompany({...newCompany, name: e.target.value})} 
                        className="company-modal-input" 
                    />
                    <input 
                        placeholder="Site (ex: empresa.com.br)" 
                        onChange={e => setNewCompany({...newCompany, site: e.target.value})} 
                        className="company-modal-input" 
                    />
                    <div className="company-modal-row">
                        <input 
                            placeholder="Segmento" 
                            onChange={e => setNewCompany({...newCompany, segment: e.target.value})} 
                            className="company-modal-input" 
                        />
                        
                        <select 
                            onChange={e => setNewCompany({...newCompany, state: e.target.value})} 
                            className="company-modal-select"
                        >
                            <option value="">Selecione UF</option>
                            {BR_STATES.map(state => (
                                <option key={state.value} value={state.value}>{state.value} - {state.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="company-modal-row">
                        <select 
                            onChange={e => setNewCompany({...newCompany, package: e.target.value as any})} 
                            className="company-modal-select"
                        >
                            <option value="Basic">Basic</option> 
                            <option value="Pro">Pro</option> 
                            <option value="Enterprise">Enterprise</option>
                        </select>
                        <input 
                            type="number" 
                            placeholder="Valor Recorrente (R$)" 
                            onChange={e => setNewCompany({...newCompany, recurringValue: parseFloat(e.target.value)})} 
                            className="company-modal-input" 
                        />
                    </div>
                    <input 
                        type="number" 
                        placeholder="Max Usuários" 
                        onChange={e => setNewCompany({...newCompany, maxUsers: parseInt(e.target.value)})} 
                        className="company-modal-input" 
                    />
                    <button 
                        onClick={handleCreateCompany} 
                        className="company-modal-save-button"
                    >
                        Salvar Empresa
                    </button>
                </div>
            </Modal>

            {/* Manage Users Modal */}
            <Modal isOpen={isUsersModalOpen} onClose={() => setIsUsersModalOpen(false)} title={`Usuários: ${selectedCompany?.name}`}>
                <div className="users-modal-content">
                    {/* Add Single User */}
                    <form onSubmit={handleCreateUser} className="users-modal-form">
                        <h4 className="users-modal-form-title">Adicionar Manualmente</h4>
                        <div className="users-modal-form-row">
                            <input name="name" placeholder="Nome Completo" required className="users-modal-input" />
                            <input name="email" type="email" placeholder="Email" required className="users-modal-input" />
                        </div>
                        <div className="users-modal-form-row-three">
                             <input name="jobTitle" placeholder="Cargo" required className="users-modal-input" />
                             <input name="password" type="text" placeholder="Senha Provisória" required className="users-modal-input" />
                             <select name="role" className="users-modal-select">
                                <option value="user">Usuário</option>
                                <option value="supervisor">Supervisor</option>
                            </select>
                        </div>
                        <button className="users-modal-submit">Adicionar Usuário</button>
                    </form>

                    {/* Bulk Import */}
                    <div className="users-modal-import">
                         <h4 className="users-modal-import-title">
                            <FileSpreadsheet size={14}/> Importação em Massa
                         </h4>
                         <input 
                            type="file" 
                            accept=".xlsx" 
                            onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)} 
                            className="users-modal-file-input"
                         />
                         <button 
                            onClick={handleExcelUpload} 
                            className="users-modal-import-button"
                         >
                             <Upload size={14} /> Upload Excel
                         </button>
                         {importStatus && <p className="users-modal-import-status">{importStatus}</p>}
                    </div>

                    {/* Users List */}
                    <div className="users-modal-list">
                         <table className="users-table">
                             <thead>
                                 <tr className="users-table-header">
                                     <th>Nome</th>
                                     <th>Email</th>
                                     <th>Cargo</th>
                                     <th>Função</th>
                                     <th></th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {companyUsers.map(u => (
                                     <tr key={u.id} className="users-table-row">
                                         <td>{u.name}</td>
                                         <td>{u.email}</td>
                                         <td>{u.jobTitle || '-'}</td>
                                         <td>
                                             <span className={`users-table-role ${u.role === 'supervisor' ? 'supervisor' : 'user'}`}>
                                                 {u.role}
                                             </span>
                                         </td>
                                         <td className="users-table-actions">
                                             <button 
                                                onClick={() => { 
                                                    adminService.deleteUser(u.id); 
                                                    setCompanyUsers(adminService.getUsersByCompany(selectedCompany!.id)); 
                                                }} 
                                                className="users-table-delete"
                                             >
                                                 <Trash2 size={14} />
                                             </button>
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
