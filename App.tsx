import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Intelligence } from './pages/Intelligence';
import { Integrations } from './pages/Integrations';
import { Library } from './pages/Library';
import { Settings } from './pages/Settings';
import { Reports } from './pages/Reports';
import { Login } from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CompanyManagement } from './pages/admin/CompanyManagement';
import { ApiLibrary } from './pages/admin/ApiLibrary';
import { AdminIntelligence } from './pages/admin/AdminIntelligence';

const AuthenticatedLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <div className="flex h-screen overflow-hidden bg-l-bg dark:bg-d-bg transition-colors duration-300">
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar 
          title={isSuperAdmin ? "Comando Enterprise Admin" : "Plataforma Sales Intelligence"} 
          
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 scroll-smooth">
           <div className="max-w-7xl mx-auto w-full pb-10">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/intelligence" element={<Intelligence />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/library" element={<Library />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* Admin Routes - Protected by Role Logic in components/display but routed here */}
                {isSuperAdmin && (
                  <>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/companies" element={<CompanyManagement />} />
                    <Route path="/admin/apis" element={<ApiLibrary />} />
                    <Route path="/admin/intelligence" element={<AdminIntelligence />} />
                  </>
                )}
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
           </div>
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return <AuthenticatedLayout />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
