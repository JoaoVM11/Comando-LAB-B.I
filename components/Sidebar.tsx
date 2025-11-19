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

  // Items for regular users
  const userMenuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/intelligence', label: 'Central I.A.', icon: BrainCircuit },
    { path: '/integrations', label: 'Integrações', icon: PlugZap },
    { path: '/library', label: 'Biblioteca', icon: Library },
    { path: '/reports', label: 'Relatórios', icon: FileBarChart },
  ];

  // Items for Super Admin only
  const adminItems = [
    { path: '/admin', label: 'Super Dashboard', icon: LineChart },
    { path: '/admin/companies', label: 'Gestão Empresas', icon: Building },
    { path: '/admin/apis', label: 'Biblioteca APIs', icon: Database },
    { path: '/admin/intelligence', label: 'Admin I.A.', icon: BrainCircuit },
  ];

  // Common items (Settings)
  const commonItems = [
      { path: '/settings', label: 'Configurações', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleItemClick = () => {
    if (setMobileMenuOpen && window.innerWidth < 768) {
      setMobileMenuOpen(false);
    }
  };

  // Responsive sidebar classes
  const sidebarClasses = `
    fixed md:relative z-30
    flex flex-col h-full 
    bg-l-surface dark:bg-d-surface 
    border-r border-l-border dark:border-d-border 
    transition-all duration-300
    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    ${collapsed ? 'md:w-20' : 'md:w-64'}
    w-64
  `;

  const backdropClasses = `
    fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300
    ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  `;

  const renderMenuItem = (item: any) => (
    <Link
      key={item.path}
      to={item.path}
      onClick={handleItemClick}
      className={`
        flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group
        ${isActive(item.path) 
          ? 'bg-comando-neon/10 text-comando-darkInst dark:text-comando-neon shadow-[0_0_10px_rgba(130,217,246,0.2)]' 
          : 'text-l-textSecondary dark:text-d-textSecondary hover:bg-gray-100 dark:hover:bg-white/5 hover:text-l-textPrimary dark:hover:text-d-textPrimary'}
      `}
    >
      <item.icon 
        size={22} 
        className={`${isActive(item.path) ? 'text-comando-darkInst dark:text-comando-neon' : ''}`} 
      />
      <span className={`font-medium font-display tracking-wide text-sm ${collapsed ? 'md:hidden' : 'block'}`}>
        {item.label}
      </span>
      
      {collapsed && isActive(item.path) && (
          <div className="absolute left-0 w-1 h-8 bg-comando-neon rounded-r-full hidden md:block" />
      )}
    </Link>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      <div className={backdropClasses} onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)} />

      <aside className={sidebarClasses}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between px-6'} h-20 border-b border-l-border dark:border-d-border`}>
          <Logo collapsed={collapsed} />
          {/* Mobile Close Button */}
          <button 
            className="md:hidden text-l-textSecondary dark:text-d-textSecondary"
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          
          {isSuperAdmin ? (
            <>
              <div className={`px-3 mb-2 ${collapsed ? 'hidden' : 'block'}`}>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-comando-neon flex items-center gap-2">
                    <Shield size={12} /> Admin Zone
                 </span>
              </div>
              {adminItems.map(renderMenuItem)}
              <div className={`my-4 border-b border-l-border dark:border-d-border mx-3 ${collapsed ? 'hidden' : 'block'}`}></div>
            </>
          ) : (
             // Standard User Menu
             <>
                {userMenuItems.map(renderMenuItem)}
                <div className={`my-4 border-b border-l-border dark:border-d-border mx-3 ${collapsed ? 'hidden' : 'block'}`}></div>
             </>
          )}

          {/* Common Items (Settings) */}
          {commonItems.map(renderMenuItem)}

        </nav>

        <div className="p-4 border-t border-l-border dark:border-d-border bg-l-surface dark:bg-d-surface">
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-full p-2 mb-4 text-l-textSecondary dark:text-d-textSecondary hover:text-comando-neon transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span className="text-xs uppercase tracking-widest">Recolher</span></div>}
          </button>
          
          <button 
            onClick={logout}
            className={`
              flex items-center gap-3 px-3 py-2 w-full rounded-lg text-func-error hover:bg-func-error/10 transition-all
              ${collapsed ? 'md:justify-center' : ''}
            `}
          >
            <LogOut size={20} />
            <span className={`text-sm font-medium ${collapsed ? 'md:hidden' : 'block'}`}>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};