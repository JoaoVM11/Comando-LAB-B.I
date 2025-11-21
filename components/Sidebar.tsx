import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  PlugZap, 
  Library, 
  FileBarChart, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  Building,
  Database,
  LineChart
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import "./Sidebar.css";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  setCollapsed, 
  mobileMenuOpen = false, 
  setMobileMenuOpen 
}) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isSuperAdmin = user?.role === 'superadmin';

  const userMenuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/intelligence', label: 'Central I.A.', icon: BrainCircuit },
    { path: '/integrations', label: 'Integrações', icon: PlugZap },
    { path: '/library', label: 'Biblioteca', icon: Library },
    { path: '/reports', label: 'Relatórios', icon: FileBarChart },
  ];

  const adminItems = [
    { path: '/admin', label: 'Super Dashboard', icon: LineChart },
    { path: '/admin/companies', label: 'Gestão Empresas', icon: Building },
    { path: '/admin/apis', label: 'Biblioteca APIs', icon: Database },
    { path: '/admin/intelligence', label: 'Admin I.A.', icon: BrainCircuit },
  ];

  const commonItems = [
      { path: '/settings', label: 'Configurações', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleItemClick = () => {
    if (setMobileMenuOpen && window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Backdrop Mobile */}
      <div 
        className={`sidebar-backdrop ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
      />

      <aside 
        className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileMenuOpen ? "open" : ""}`}
      >
        <div className="sidebar-header">
          <Logo collapsed={collapsed} />

          <button 
            className="sidebar-close-mobile"
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          
          {isSuperAdmin ? (
            <>
              {!collapsed && (
                <div className="sidebar-admin-label">
                    <Shield size={12} /> Admin Zone
                </div>
              )}

              {adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleItemClick}
                  className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
                >
                  <item.icon size={20} className="sidebar-icon" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
              {!collapsed && <div className="sidebar-divider"></div>}
            </>
          ) : (
            <>
              {userMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleItemClick}
                  className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
                >
                  <item.icon size={20} className="sidebar-icon" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
              {!collapsed && <div className="sidebar-divider"></div>}
            </>
          )}

          {commonItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleItemClick}
              className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
            >
              <item.icon size={20} className="sidebar-icon" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}

        </nav>

        <div className="sidebar-footer">
          
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="collapse-btn"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!collapsed && <span>Recolher</span>}
          </button>

          <button 
            onClick={logout}
            className="logout-btn"
          >
            <LogOut size={20} />
            {!collapsed && <span>Sair</span>}
          </button>

        </div>
      </aside>
    </>
  );
};
