import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Save, Lock, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
            // Note: Role and Company usually shouldn't be editable by self in a real app, but for this demo/admin profile usage:
            // We preserve the original role/company ID in logic, just updating display name/email for now or allow update if needed.
            // Here we only update name and email primarily for the request.
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="mb-6">
                <h2 className="text-2xl font-display font-bold text-l-textPrimary dark:text-d-textPrimary">Configurações da Conta</h2>
                <p className="text-l-textSecondary dark:text-d-textSecondary">Gerencie suas informações pessoais e preferências de segurança.</p>
            </div>
            
            <div className="space-y-6">
                <Card title="Perfil do Usuário">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-l-textSecondary dark:text-d-textSecondary uppercase tracking-wider">Nome Completo</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name} 
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary focus:border-comando-neon outline-none transition-colors" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-l-textSecondary dark:text-d-textSecondary uppercase tracking-wider">E-mail Corporativo</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email} 
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary focus:border-comando-neon outline-none transition-colors" 
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-l-textSecondary dark:text-d-textSecondary uppercase tracking-wider">Cargo / Função</label>
                            <input 
                                type="text" 
                                value={formData.role} 
                                disabled
                                className="w-full p-3 rounded-lg bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary focus:border-comando-neon outline-none transition-colors opacity-70 cursor-not-allowed" 
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-bold text-l-textSecondary dark:text-d-textSecondary uppercase tracking-wider">ID Empresa</label>
                            <input 
                                type="text" 
                                value={formData.companyId} 
                                disabled
                                className="w-full p-3 rounded-lg bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary focus:border-comando-neon outline-none transition-colors opacity-70 cursor-not-allowed" 
                            />
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-l-border dark:border-d-border">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="p-2 bg-comando-neon/10 rounded-lg">
                                <Lock size={20} className="text-comando-neon" />
                            </div>
                            <div>
                                <h3 className="font-bold text-l-textPrimary dark:text-d-textPrimary">Segurança e Senha</h3>
                                <p className="text-xs text-l-textSecondary dark:text-d-textSecondary">Para alterar sua senha, confirme a atual e defina a nova.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-l-textSecondary dark:text-d-textSecondary">Senha Atual</label>
                                <input 
                                    type="password" 
                                    placeholder="Digite sua senha atual" 
                                    className="w-full p-3 rounded-lg bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary focus:border-comando-neon outline-none transition-colors placeholder-opacity-50" 
                                />
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-l-textSecondary dark:text-d-textSecondary">Nova Senha</label>
                                    <input 
                                        type="password" 
                                        placeholder="Digite a nova senha" 
                                        className="w-full p-3 rounded-lg bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary focus:border-comando-neon outline-none transition-colors placeholder-opacity-50" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-l-textSecondary dark:text-d-textSecondary">Confirmar Nova Senha</label>
                                    <input 
                                        type="password" 
                                        placeholder="Repita a nova senha" 
                                        className="w-full p-3 rounded-lg bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary focus:border-comando-neon outline-none transition-colors placeholder-opacity-50" 
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-xs text-l-textSecondary dark:text-d-textSecondary opacity-70">
                                    <ShieldCheck size={14} className="text-func-success" />
                                    <span>Recomendamos usar letras maiúsculas, números e símbolos.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Preferências da Plataforma">
                     <div className="flex items-center justify-between py-4 border-b border-l-border dark:border-d-border">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-6 rounded-full bg-comando-neon flex items-center p-1 cursor-pointer">
                                 <div className="w-4 h-4 rounded-full bg-white shadow-md transform translate-x-4 transition-transform"></div>
                             </div>
                             <div>
                                 <h4 className="font-medium text-l-textPrimary dark:text-d-textPrimary">Notificações de Insights</h4>
                                 <p className="text-xs text-l-textSecondary dark:text-d-textSecondary">Receber alertas diários via e-mail sobre KPIs críticos.</p>
                             </div>
                         </div>
                     </div>
                     <div className="flex items-center justify-between py-4 pt-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-6 rounded-full bg-l-border dark:bg-d-border flex items-center p-1 cursor-pointer">
                                 <div className="w-4 h-4 rounded-full bg-white shadow-md transition-transform"></div>
                             </div>
                             <div>
                                 <h4 className="font-medium text-l-textPrimary dark:text-d-textPrimary">Autenticação de Dois Fatores (2FA)</h4>
                                 <p className="text-xs text-l-textSecondary dark:text-d-textSecondary">Adicionar camada extra de segurança no login.</p>
                             </div>
                         </div>
                     </div>
                </Card>

                <div className="flex justify-end gap-4 pt-4">
                    <button className="px-6 py-3 rounded-lg border border-l-border dark:border-d-border text-l-textPrimary dark:text-d-textPrimary font-medium hover:bg-l-surface dark:hover:bg-d-surface transition-colors">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        className={`
                            px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(130,217,246,0.4)] transition-all
                            ${isSaved ? 'bg-func-success text-white' : 'bg-comando-neon text-comando-darkInst hover:bg-comando-hover'}
                        `}
                    >
                        {isSaved ? <><Check size={18} /> Salvo!</> : <><Save size={18} /> Salvar Alterações</>}
                    </button>
                </div>
            </div>
        </div>
    );
};