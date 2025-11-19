import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, Search, UserCircle, AlertTriangle, Sparkles, Check, Trash2 } from 'lucide-react';
import { Notification } from '../types';
import { useAuth } from '../context/AuthContext';

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Queda Brusca de Faturamento',
    message: 'A receita diária caiu 35% em relação à média das últimas 4 terças-feiras.',
    type: 'alert',
    time: 'Há 15 min',
    read: false,
  },
  {
    id: '2',
    title: 'Novo Insight de IA',
    message: 'O Gemini identificou uma oportunidade de upsell na carteira "Varejo Sul".',
    type: 'insight',
    time: 'Há 45 min',
    read: false,
  },
  {
    id: '3',
    title: 'Meta Batida!',
    message: 'A equipe "Inside Sales" atingiu 100% da meta mensal.',
    type: 'info',
    time: 'Há 2 horas',
    read: true,
  },
];

export const Navbar: React.FC<{ title: string }> = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle size={16} className="text-func-error" />;
      case 'insight': return <Sparkles size={16} className="text-comando-neon" />;
      default: return <Check size={16} className="text-func-success" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-func-error/10 border-func-error/20';
      case 'insight': return 'bg-comando-neon/10 border-comando-neon/20';
      default: return 'bg-func-success/10 border-func-success/20';
    }
  };

  // Format User Role for Display
  const displayRole = user?.role === 'superadmin' ? 'Founder / Super Admin' : user?.role === 'supervisor' ? 'Supervisor' : 'Usuário';
  
  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-l-border dark:border-d-border bg-l-bg/80 dark:bg-d-bg/80 backdrop-blur-md sticky top-0 z-20">
      <h1 className="text-2xl font-display font-bold text-l-textPrimary dark:text-d-textPrimary uppercase tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-l-surface dark:bg-d-surface border border-l-border dark:border-d-border rounded-full w-64 focus-within:border-comando-neon focus-within:shadow-[0_0_8px_rgba(130,217,246,0.3)] transition-all">
          <Search size={18} className="text-l-textSecondary dark:text-d-textSecondary" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-transparent border-none outline-none text-sm text-l-textPrimary dark:text-d-textPrimary w-full placeholder-l-textSecondary dark:placeholder-d-textSecondary"
          />
        </div>

        <div className="h-6 w-px bg-l-border dark:bg-d-border mx-2" />

        {/* Actions */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-l-surface dark:hover:bg-d-surface text-l-textSecondary dark:text-d-textSecondary transition-colors"
          title="Alternar Tema"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification Center */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`
              relative p-2 rounded-full transition-colors
              ${showNotifications 
                ? 'bg-comando-neon/10 text-comando-neon' 
                : 'hover:bg-l-surface dark:hover:bg-d-surface text-l-textSecondary dark:text-d-textSecondary'}
            `}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-func-error rounded-full border-2 border-l-bg dark:border-d-bg animate-pulse"></span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-4 w-80 sm:w-96 bg-l-bg dark:bg-d-bg border border-l-border dark:border-d-border rounded-xl shadow-2xl overflow-hidden z-50 transform origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between p-4 border-b border-l-border dark:border-d-border bg-l-surface/50 dark:bg-d-surface/50 backdrop-blur-sm">
                <h3 className="font-display font-bold text-sm text-l-textPrimary dark:text-d-textPrimary">Notificações</h3>
                {notifications.length > 0 && (
                  <button 
                    onClick={handleClearAll}
                    className="text-xs flex items-center gap-1 text-l-textSecondary hover:text-func-error transition-colors"
                  >
                    <Trash2 size={12} /> Limpar
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-l-textSecondary dark:text-d-textSecondary">
                    <p className="text-sm">Nenhuma notificação nova.</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => handleMarkAsRead(notification.id)}
                      className={`
                        p-4 border-b border-l-border dark:border-d-border last:border-none hover:bg-l-surface dark:hover:bg-d-surface transition-colors cursor-pointer
                        ${!notification.read ? 'bg-l-surface/30 dark:bg-d-surface/20' : ''}
                      `}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${getBgColor(notification.type)}`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-bold ${!notification.read ? 'text-l-textPrimary dark:text-d-textPrimary' : 'text-l-textSecondary dark:text-d-textSecondary'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-[10px] text-l-textSecondary dark:text-d-textSecondary whitespace-nowrap ml-2">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-xs text-l-textSecondary dark:text-d-textSecondary leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                         {!notification.read && (
                           <div className="w-2 h-2 rounded-full bg-comando-neon mt-2 shrink-0" />
                         )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="p-3 border-t border-l-border dark:border-d-border bg-l-surface/30 dark:bg-d-surface/30 text-center">
                <button className="text-xs font-bold text-comando-darkInst dark:text-comando-neon hover:underline">
                  Ver todas as notificações
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 cursor-pointer group">
          <div className="flex flex-col text-right hidden sm:block">
            <span className="text-sm font-bold text-l-textPrimary dark:text-d-textPrimary group-hover:text-comando-neon transition-colors">
                {user?.name || 'Usuário'}
            </span>
            <span className="text-xs text-l-textSecondary dark:text-d-textSecondary">
                {displayRole}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-comando-darkInst to-comando-neon flex items-center justify-center text-white font-bold border-2 border-l-surface dark:border-d-surface shadow-lg">
            {user?.avatar || <UserCircle />}
          </div>
        </div>
      </div>
    </header>
  );
};