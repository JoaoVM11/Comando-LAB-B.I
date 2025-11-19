import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { ApiTemplate } from '../../types';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Database, Code, Copy, Trash2, Plus } from 'lucide-react';

export const ApiLibrary: React.FC = () => {
    const [apis, setApis] = useState<ApiTemplate[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newApi, setNewApi] = useState<Partial<ApiTemplate>>({ type: 'API', authType: 'apikey', isActive: true });

    useEffect(() => {
        setApis(adminService.getApis());
    }, []);

    const handleSave = () => {
        if(newApi.name) {
            adminService.createApi(newApi as any);
            setApis([...adminService.getApis()]);
            setIsModalOpen(false);
        }
    };

    const handleDelete = (id: string) => {
        if(confirm('Excluir este template?')) {
            adminService.deleteApi(id);
            setApis([...adminService.getApis()]);
        }
    };

    return (
        <div className="pb-10">
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-futuristic font-bold text-white">Biblioteca de APIs</h1>
                    <p className="text-gray-400">Templates de integração reutilizáveis.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-login-secondary hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-[0_0_15px_rgba(123,47,247,0.3)] transition-all"
                >
                    <Plus size={20} /> Novo Template
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {apis.map(api => (
                    <Card key={api.id} className="hover:border-login-secondary/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-lg bg-gray-800 text-login-detail border border-gray-700">
                                <Database size={24} />
                            </div>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 rounded text-[10px] bg-gray-700 text-gray-300 uppercase font-bold">{api.type}</span>
                                <button onClick={() => handleDelete(api.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{api.name}</h3>
                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{api.description}</p>
                        
                        <div className="bg-black/30 p-2 rounded border border-gray-800 font-mono text-[10px] text-gray-500 break-all">
                            {api.baseUrl}
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                            <button className="flex-1 py-2 rounded bg-gray-700 hover:bg-white hover:text-black text-white text-xs font-bold transition-colors">Testar</button>
                            <button className="flex-1 py-2 rounded bg-login-secondary/20 text-login-secondary border border-login-secondary/30 hover:bg-login-secondary hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1">
                                <Copy size={12} /> Copiar Config
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Template de API">
                <div className="space-y-4">
                    <input placeholder="Nome do Template" onChange={e => setNewApi({...newApi, name: e.target.value})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white" />
                    <textarea placeholder="Descrição Técnica" onChange={e => setNewApi({...newApi, description: e.target.value})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white h-20" />
                    <div className="grid grid-cols-2 gap-4">
                        <select onChange={e => setNewApi({...newApi, type: e.target.value as any})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white">
                            <option value="API">API REST</option> <option value="CRM">CRM</option> <option value="ERP">ERP</option>
                        </select>
                        <select onChange={e => setNewApi({...newApi, authType: e.target.value as any})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white">
                            <option value="apikey">API Key</option> <option value="oauth2">OAuth 2.0</option> <option value="bearer">Bearer Token</option>
                        </select>
                    </div>
                    <input placeholder="Base URL" onChange={e => setNewApi({...newApi, baseUrl: e.target.value})} className="w-full p-3 bg-black/20 border border-gray-700 rounded text-white" />
                    <button onClick={handleSave} className="w-full py-3 bg-login-secondary text-white font-bold rounded hover:bg-purple-600">Salvar Template</button>
                </div>
            </Modal>
        </div>
    );
};
