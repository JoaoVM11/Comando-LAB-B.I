import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Company, PlatformUser } from '../../types';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Building, Plus, Trash2, Users, Upload, FileSpreadsheet, Download } from 'lucide-react';

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
                    avatar: 'U'
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
        <div className="pb-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-futuristic font-bold text-white">Gestão de Empresas</h1>
                    <p className="text-gray-400">Cadastre e gerencie contas corporativas.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-login-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(0,168,232,0.3)] transition-all"
                >
                    <Plus size={20} /> Nova Empresa
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {companies.map(company => (
                    <Card key={company.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-login-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-login-primary/10 text-login-primary">
                                <Building size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{company.name}</h3>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <span>{company.site}</span>
                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                    <span>{company.segment} - {company.state}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-8">
                             <div className="text-center">
                                 <p className="text-[10px] uppercase text-gray-500 font-bold">Pacote</p>
                                 <span className="text-login-detail font-bold">{company.package}</span>
                             </div>
                             <div className="text-center">
                                 <p className="text-[10px] uppercase text-gray-500 font-bold">Usuários</p>
                                 <span className={`${company.userCount >= company.maxUsers ? 'text-red-500' : 'text-white'} font-bold`}>
                                     {company.userCount} / {company.maxUsers}
                                 </span>
                             </div>
                             <div className="text-center">
                                 <p className="text-[10px] uppercase text-gray-500 font-bold">MRR</p>
                                 <span className="text-green-400 font-bold">R$ {company.recurringValue}</span>
                             </div>
                             
                             <div className="flex gap-2">
                                 <button 
                                    onClick={() => openUsersModal(company)}
                                    className="p-2 rounded bg-gray-800 hover:bg-login-primary hover:text-white text-gray-400 transition-colors" title="Gerenciar Usuários"
                                 >
                                     <Users size={18} />
                                 </button>
                                 <button 
                                    onClick={() => handleDeleteCompany(company.id)}
                                    className="p-2 rounded bg-gray-800 hover:bg-red-500 hover:text-white text-gray-400 transition-colors" title="Excluir Empresa"
                                 >
                                     <Trash2 size={18} />
                                 </button>
                             </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Create Company Modal */}
            <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Nova Empresa Enterprise">
                <div className="space-y-4">
                    <input placeholder="Nome da Empresa" onChange={e => setNewCompany({...newCompany, name: e.target.value})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white" />
                    <input placeholder="Site (ex: empresa.com.br)" onChange={e => setNewCompany({...newCompany, site: e.target.value})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white" />
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Segmento" onChange={e => setNewCompany({...newCompany, segment: e.target.value})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white" />
                        <select onChange={e => setNewCompany({...newCompany, state: e.target.value})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white">
                            <option value="">Selecione UF</option>
                            <option value="SP">SP</option> <option value="RJ">RJ</option> <option value="MG">MG</option> <option value="RS">RS</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select onChange={e => setNewCompany({...newCompany, package: e.target.value as any})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white">
                            <option value="Basic">Basic</option> <option value="Pro">Pro</option> <option value="Enterprise">Enterprise</option>
                        </select>
                        <input type="number" placeholder="Valor Recorrente (R$)" onChange={e => setNewCompany({...newCompany, recurringValue: parseFloat(e.target.value)})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white" />
                    </div>
                    <input type="number" placeholder="Max Usuários" onChange={e => setNewCompany({...newCompany, maxUsers: parseInt(e.target.value)})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white" />
                    <button onClick={handleCreateCompany} className="w-full py-3 bg-login-primary text-white font-bold rounded hover:bg-blue-600">Salvar Empresa</button>
                </div>
            </Modal>

            {/* Manage Users Modal */}
            <Modal isOpen={isUsersModalOpen} onClose={() => setIsUsersModalOpen(false)} title={`Usuários: ${selectedCompany?.name}`}>
                <div className="space-y-6">
                    {/* Add Single User */}
                    <form onSubmit={handleCreateUser} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3">
                        <h4 className="text-xs font-bold text-login-primary uppercase">Adicionar Manualmente</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <input name="name" placeholder="Nome" required className="p-2 bg-black/40 border border-gray-700 rounded text-sm text-white" />
                            <input name="email" type="email" placeholder="Email" required className="p-2 bg-black/40 border border-gray-700 rounded text-sm text-white" />
                            <select name="role" className="p-2 bg-black/40 border border-gray-700 rounded text-sm text-white">
                                <option value="user">Usuário</option>
                                <option value="supervisor">Supervisor</option>
                            </select>
                        </div>
                        <button className="w-full py-2 bg-gray-700 hover:bg-login-primary text-white text-xs font-bold rounded transition-colors">Adicionar Usuário</button>
                    </form>

                    {/* Bulk Import */}
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 space-y-3">
                         <h4 className="text-xs font-bold text-login-detail uppercase flex items-center gap-2"><FileSpreadsheet size={14}/> Importação em Massa</h4>
                         <input 
                            type="file" 
                            accept=".xlsx" 
                            onChange={(e) => setImportFile(e.target.files ? e.target.files[0] : null)} 
                            className="block w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-700 file:text-white"
                         />
                         <button onClick={handleExcelUpload} className="w-full py-2 bg-gray-700 hover:bg-login-detail hover:text-black text-white text-xs font-bold rounded transition-colors flex justify-center gap-2">
                             <Upload size={14} /> Upload Excel
                         </button>
                         {importStatus && <p className="text-xs text-yellow-400 font-mono">{importStatus}</p>}
                    </div>

                    {/* Users List */}
                    <div className="max-h-60 overflow-y-auto border-t border-gray-700 pt-2">
                         <table className="w-full text-left text-sm text-gray-300">
                             <thead>
                                 <tr className="text-xs uppercase text-gray-500 border-b border-gray-700">
                                     <th className="py-2">Nome</th>
                                     <th>Email</th>
                                     <th>Cargo</th>
                                     <th></th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {companyUsers.map(u => (
                                     <tr key={u.id} className="border-b border-gray-800">
                                         <td className="py-2">{u.name}</td>
                                         <td>{u.email}</td>
                                         <td>
                                             <span className={`text-[10px] px-1.5 py-0.5 rounded ${u.role === 'supervisor' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-400'}`}>
                                                 {u.role}
                                             </span>
                                         </td>
                                         <td className="text-right">
                                             <button onClick={() => { adminService.deleteUser(u.id); setCompanyUsers(adminService.getUsersByCompany(selectedCompany!.id)); }} className="text-red-500 hover:text-red-400">
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
