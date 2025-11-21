
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlatformUser, UserRole } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: PlatformUser | null;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<PlatformUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<PlatformUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persisted session
    const storedAuth = localStorage.getItem('comando-auth');
    const storedUser = localStorage.getItem('comando-user');
    
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    // 1. SUPER ADMIN CHECK (Hardcoded Founder Credentials)
    if (email === 'comando.oficial.ia@gmail.com' && password === 'ComandoLab25#') {
      const superAdmin: PlatformUser = {
        id: 'master-001',
        name: 'João Victor Batista',
        email: email,
        role: 'superadmin',
        companyId: 'comando-hq',
        avatar: 'JV',
        jobTitle: 'Founder & CEO'
      };
      
      setUser(superAdmin);
      setIsAuthenticated(true);
      localStorage.setItem('comando-auth', 'true');
      localStorage.setItem('comando-user', JSON.stringify(superAdmin));
      return true;
    }

    // 2. DATABASE CHECK (Simulated Users created by Admin)
    // Retrieves users stored by adminService
    const storedUsers = localStorage.getItem('comando_admin_users');
    if (storedUsers) {
        const users: PlatformUser[] = JSON.parse(storedUsers);
        const foundUser = users.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
            setUser(foundUser);
            setIsAuthenticated(true);
            localStorage.setItem('comando-auth', 'true');
            localStorage.setItem('comando-user', JSON.stringify(foundUser));
            return true;
        }
    }

    // 3. FALLBACK / LEGACY MOCK (Only if no DB user found, for testing simplicity if needed)
    if (email !== 'comando.oficial.ia@gmail.com' && password === 'demo123') {
       const normalUser: PlatformUser = {
        id: 'user-001',
        name: 'Alex Souza',
        email: email,
        role: 'supervisor', // Default to supervisor for demo
        companyId: 'company-001',
        avatar: 'AS',
        jobTitle: 'Gerente Comercial'
      };
      setUser(normalUser);
      setIsAuthenticated(true);
      localStorage.setItem('comando-auth', 'true');
      localStorage.setItem('comando-user', JSON.stringify(normalUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('comando-auth');
    localStorage.removeItem('comando-user');
  };

  const updateUser = (data: Partial<PlatformUser>) => {
    if (!user) return;

    // Update avatar initials if name changes
    let newAvatar = user.avatar;
    if (data.name) {
        newAvatar = data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    const updatedUser = { ...user, ...data, avatar: newAvatar };
    setUser(updatedUser);
    localStorage.setItem('comando-user', JSON.stringify(updatedUser));
  };

  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
