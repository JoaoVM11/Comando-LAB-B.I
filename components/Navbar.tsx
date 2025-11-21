import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bell, Search, UserCircle, AlertTriangle, Sparkles, Check, Trash2 } from 'lucide-react';
import { Notification } from '../types';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

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
      case 'alert': return <AlertTriangle size={16} className="notification-icon-error" />;
      case 'insight': return <Sparkles size={16} className="notification-icon-insight" />;
      default: return <Check size={16} className="notification-icon-success" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'alert': return 'notification-badge-error';
      case 'insight': return 'notification-badge-insight';
      default: return 'notification-badge-success';
    }
  };

  // Format User Role for Display
  const displayRole = user?.role === 'superadmin' ? 'Founder / Super Admin' : user?.role === 'supervisor' ? 'Supervisor' : 'Usuário';
  
  return (
    <header className="navbar">
      <h1 className="navbar-title">
        {title}
      </h1>

      <div className="navbar-actions">
        {/* Search Bar */}
        <div className="navbar-search">
          <Search size={18} className="navbar-search-icon" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="navbar-search-input"
          />
        </div>

        <div className="navbar-divider" />

        {/* Actions */}
        <button 
          onClick={toggleTheme} 
          className="navbar-theme-button"
          title="Alternar Tema"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notification Center */}
        <div className="navbar-notification-wrapper" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`navbar-notification-button ${showNotifications ? 'active' : ''}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="navbar-notification-badge"></span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifications && (
            <div className="navbar-notification-dropdown">
              <div className="navbar-notification-header">
                <h3 className="navbar-notification-title">Notificações</h3>
                {notifications.length > 0 && (
                  <button 
                    onClick={handleClearAll}
                    className="navbar-notification-clear"
                  >
                    <Trash2 size={12} /> Limpar
                  </button>
                )}
              </div>

              <div className="navbar-notification-list">
                {notifications.length === 0 ? (
                  <div className="navbar-notification-empty">
                    <p>Nenhuma notificação nova.</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => handleMarkAsRead(notification.id)}
                      className={`navbar-notification-item ${!notification.read ? 'unread' : ''}`}
                    >
                      <div className="navbar-notification-content">
                        <div className={`navbar-notification-icon-wrapper ${getBgColor(notification.type)}`}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="navbar-notification-text">
                          <div className="navbar-notification-text-header">
                            <h4 className={!notification.read ? 'unread' : ''}>
                              {notification.title}
                            </h4>
                            <span className="navbar-notification-time">
                              {notification.time}
                            </span>
                          </div>
                          <p className="navbar-notification-message">
                            {notification.message}
                          </p>
                        </div>
                         {!notification.read && (
                           <div className="navbar-notification-dot" />
                         )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="navbar-notification-footer">
                <button className="navbar-notification-view-all">
                  Ver todas as notificações
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="navbar-user">
          <div className="navbar-user-info">
            <span className="navbar-user-name">
                {user?.name || 'Usuário'}
            </span>
            <span className="navbar-user-role">
                {displayRole}
            </span>
          </div>
          <div className="navbar-user-avatar">
            {user?.avatar || <UserCircle />}
          </div>
        </div>
      </div>
    </header>
  );
};
