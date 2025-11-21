import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { ApiTemplate } from '../../types';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Database, Code, Copy, Trash2, Plus } from 'lucide-react';
import './ApiLibrary.css';

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
        <div className="api-library-container">
             <div className="api-library-header">
                <div>
                    <h1 className="api-library-title">Biblioteca de APIs</h1>
                    <p className="api-library-subtitle">Templates de integração reutilizáveis.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="api-library-add-button"
                >
                    <Plus size={20} /> Novo Template
                </button>
            </div>

            <div className="api-library-grid">
                {apis.map(api => (
                    <Card key={api.id} className="api-library-card">
                        <div className="api-library-card-header">
                            <div className="api-library-card-icon">
                                <Database size={24} />
                            </div>
                            <div className="api-library-card-actions">
                                <span className="api-library-card-type">{api.type}</span>
                                <button onClick={() => handleDelete(api.id)} className="api-library-card-delete"><Trash2 size={16}/></button>
                            </div>
                        </div>
                        <h3 className="api-library-card-title">{api.name}</h3>
                        <p className="api-library-card-description">{api.description}</p>
                        
                        <div className="api-library-card-url">
                            {api.baseUrl}
                        </div>
                        
                        <div className="api-library-card-buttons">
                            <button className="api-library-card-button-test">Testar</button>
                            <button className="api-library-card-button-copy">
                                <Copy size={12} /> Copiar Config
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Template de API">
                <div className="api-library-modal-content">
                    <input placeholder="Nome do Template" onChange={e => setNewApi({...newApi, name: e.target.value})} className="api-library-modal-input" />
                    <textarea placeholder="Descrição Técnica" onChange={e => setNewApi({...newApi, description: e.target.value})} className="api-library-modal-textarea" />
                    <div className="api-library-modal-row">
                        <select onChange={e => setNewApi({...newApi, type: e.target.value as any})} className="api-library-modal-select">
                            <option value="API">API REST</option> <option value="CRM">CRM</option> <option value="ERP">ERP</option>
                        </select>
                        <select onChange={e => setNewApi({...newApi, authType: e.target.value as any})} className="api-library-modal-select">
                            <option value="apikey">API Key</option> <option value="oauth2">OAuth 2.0</option> <option value="bearer">Bearer Token</option>
                        </select>
                    </div>
                    <input placeholder="Base URL" onChange={e => setNewApi({...newApi, baseUrl: e.target.value})} className="api-library-modal-input" />
                    <button onClick={handleSave} className="api-library-modal-button">Salvar Template</button>
                </div>
            </Modal>
        </div>
    );
};
