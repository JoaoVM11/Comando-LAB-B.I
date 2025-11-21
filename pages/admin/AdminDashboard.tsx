import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Card } from '../../components/Card';
import { StatCard } from '../../components/StatCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { Building, Users, DollarSign } from 'lucide-react';
import './AdminDashboard.css';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        setStats(adminService.getAdminStats());
    }, []);

    if (!stats) return <div>Carregando...</div>;

    // Transform data for charts
    const segmentData = Object.entries(stats.segments).map(([name, value]) => ({ name, value }));
    const stateData = Object.entries(stats.states).map(([name, value]) => ({ name, value }));

    const COLORS = ['#00A8E8', '#7B2FF7', '#4DF0FF', '#82D9F6', '#00E6A6'];

    return (
        <div className="admin-dashboard-container">
            <div className="admin-dashboard-header">
                <div>   
                    <h1 className="admin-dashboard-title">
                        Super Admin <span>Dashboard</span>
                    </h1>
                    <p className="admin-dashboard-subtitle">Visão macro da plataforma Enterprise.</p>
                </div>
            </div>

            <div className="admin-dashboard-stats">
                <StatCard label="MRR Total (Recorrente)" value={stats.totalMRR} trend={15} isCurrency />
                <StatCard label="Empresas Ativas" value={stats.activeCompanies} trend={5} />
                <StatCard label="Usuários na Plataforma" value={stats.totalUsers} trend={22} />
            </div>

            <div className="admin-dashboard-charts">
                <Card title="Distribuição por Segmento">
                    <div className="admin-dashboard-chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={segmentData} 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={60} 
                                    outerRadius={100} 
                                    fill="#8884d8" 
                                    paddingAngle={5} 
                                    dataKey="value"
                                >
                                    {segmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0F1623', borderColor: '#2B3443' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Empresas por Estado (UF)">
                     <div className="admin-dashboard-chart-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stateData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#2B3443" horizontal={false} />
                                <XAxis type="number" stroke="#9CA7B8" hide />
                                <YAxis dataKey="name" type="category" stroke="#9CA7B8" width={40} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#0F1623', borderColor: '#2B3443' }} />
                                <Bar dataKey="value" barSize={20} fill="#00A8E8" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </Card>
            </div>
        </div>
    );
};
