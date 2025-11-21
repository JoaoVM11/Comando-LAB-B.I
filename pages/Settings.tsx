import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Save, Lock, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

export const Settings: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        companyId: ''
    });
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role === 'superadmin' ? 'Founder / Super Admin' : user.role,
                companyId: user.companyId || ''
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateUser({
            name: formData.name,
            email: formData.email,
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h2 className="settings-title">Configurações da Conta</h2>
                <p className="settings-subtitle">Gerencie suas informações pessoais e preferências de segurança.</p>
            </div>
            
            <div className="settings-content">
                <Card title="Perfil do Usuário">
                    <div className="settings-form-grid">
                        <div className="settings-form-field">
                            <label className="settings-form-label">Nome Completo</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name} 
                                onChange={handleChange}
                                className="settings-form-input" 
                            />
                        </div>
                        <div className="settings-form-field">
                            <label className="settings-form-label">E-mail Corporativo</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email} 
                                onChange={handleChange}
                                className="settings-form-input" 
                            />
                        </div>
                         <div className="settings-form-field">
                            <label className="settings-form-label">Cargo / Função</label>
                            <input 
                                type="text" 
                                value={formData.role} 
                                disabled
                                className="settings-form-input disabled" 
                            />
                        </div>
                         <div className="settings-form-field">
                            <label className="settings-form-label">ID Empresa</label>
                            <input 
                                type="text" 
                                value={formData.companyId} 
                                disabled
                                className="settings-form-input disabled" 
                            />
                        </div>
                    </div>

                    <div className="settings-section-divider">
                        <div className="settings-section-header">
                            <div className="settings-section-icon">
                                <Lock size={20} />
                            </div>
                            <div>
                                <h3 className="settings-section-title">Segurança e Senha</h3>
                                <p className="settings-section-description">Para alterar sua senha, confirme a atual e defina a nova.</p>
                            </div>
                        </div>

                        <div className="settings-password-grid">
                            <div className="settings-form-field">
                                <label className="settings-form-label">Senha Atual</label>
                                <input 
                                    type="password" 
                                    placeholder="Digite sua senha atual" 
                                    className="settings-form-input" 
                                />
                            </div>
                            
                            <div className="settings-password-new">
                                <div className="settings-form-field">
                                    <label className="settings-form-label">Nova Senha</label>
                                    <input 
                                        type="password" 
                                        placeholder="Digite a nova senha" 
                                        className="settings-form-input" 
                                    />
                                </div>
                                <div className="settings-form-field">
                                    <label className="settings-form-label">Confirmar Nova Senha</label>
                                    <input 
                                        type="password" 
                                        placeholder="Repita a nova senha" 
                                        className="settings-form-input" 
                                    />
                                </div>
                                <div className="settings-password-hint">
                                    <ShieldCheck size={14} />
                                    <span>Recomendamos usar letras maiúsculas, números e símbolos.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Preferências da Plataforma">
                     <div className="settings-preference-item">
                         <div className="settings-preference-content">
                             <div className="settings-toggle active">
                                 <div className="settings-toggle-slider"></div>
                             </div>
                             <div>
                                 <h4 className="settings-preference-title">Notificações de Insights</h4>
                                 <p className="settings-preference-description">Receber alertas diários via e-mail sobre KPIs críticos.</p>
                             </div>
                         </div>
                     </div>
                     <div className="settings-preference-item">
                         <div className="settings-preference-content">
                            <div className="settings-toggle">
                                 <div className="settings-toggle-slider"></div>
                             </div>
                             <div>
                                 <h4 className="settings-preference-title">Autenticação de Dois Fatores (2FA)</h4>
                                 <p className="settings-preference-description">Adicionar camada extra de segurança no login.</p>
                             </div>
                         </div>
                     </div>
                </Card>

                <div className="settings-actions">
                    <button className="settings-button-cancel">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        className={`settings-button-save ${isSaved ? 'saved' : ''}`}
                    >
                        {isSaved ? <><Check size={18} /> Salvo!</> : <><Save size={18} /> Salvar Alterações</>}
                    </button>
                </div>
            </div>
        </div>
    );
};
