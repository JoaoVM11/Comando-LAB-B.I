import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/Logo';

export const Login: React.FC = () => {
  const { login } = useAuth();
  // Set default email empty or placeholder to encourage typing
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call/Network delay
    setTimeout(async () => {
      const success = await login(email, password);
      if (!success) {
        setError('Credenciais inválidas. Tente novamente.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-login-bg flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-login-primary/10 via-transparent to-transparent opacity-40"></div>
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-login-primary/20 to-transparent"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-login-secondary/20 to-transparent"></div>
      
      {/* Floating Particles (Simulated with divs) */}
      <div className="absolute top-10 left-10 w-1 h-1 bg-login-detail rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-2 h-2 bg-login-secondary rounded-full animate-pulse delay-700"></div>
      
      <div className="relative z-10 w-full max-w-md px-6">
        
        {/* Header / Branding */}
        <div className="mb-8 text-center animate-fade-in">
           <div className="flex justify-center mb-4">
              {/* Custom Logo for Login Screen - ensuring visibility on black */}
               <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-dashed border-login-primary animate-spin-slow">
                <div className="absolute inset-0 flex items-center justify-center">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-login-detail transform -rotate-12">
                     <polyline points="16 18 22 12 16 6"></polyline>
                     <polyline points="8 6 2 12 8 18"></polyline>
                   </svg>
                </div>
              </div>
           </div>
           <h1 className="font-futuristic font-bold text-2xl text-white tracking-wider mb-2 uppercase">
             Comando <span className="text-login-primary">Lab</span>
           </h1>
           <p className="text-gray-400 text-xs tracking-[0.2em] uppercase">Sales Intelligence Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,168,232,0.1)] animate-slide-up">
          <div className="mb-8">
            <h2 className="text-xl font-display font-bold text-white mb-1">Bem-vindo</h2>
            <p className="text-sm text-gray-400">Conecte-se para acessar seus dashboards.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-login-primary uppercase tracking-wider ml-1">E-mail Corporativo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500 group-focus-within:text-login-detail transition-colors" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-login-primary focus:shadow-[0_0_15px_rgba(0,168,232,0.3)] transition-all"
                  placeholder="seu.email@comandolab.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-login-primary uppercase tracking-wider ml-1">Senha</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500 group-focus-within:text-login-detail transition-colors" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-login-primary focus:shadow-[0_0_15px_rgba(0,168,232,0.3)] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                   <input type="checkbox" className="peer sr-only" />
                   <div className="w-4 h-4 border border-gray-600 rounded bg-transparent peer-checked:bg-login-primary peer-checked:border-login-primary transition-all"></div>
                   <CheckCircle2 size={12} className="absolute top-0.5 left-0.5 text-black opacity-0 peer-checked:opacity-100 pointer-events-none" />
                </div>
                <span className="text-gray-400 group-hover:text-white transition-colors">Lembrar-me</span>
              </label>
              <a href="#" className="text-login-detail hover:text-white hover:underline transition-colors">Esqueci a senha</a>
            </div>

            {error && (
              <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-login-primary to-blue-600 text-white font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,168,232,0.6)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>Entrar na Plataforma <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
           <p className="text-[10px] text-gray-600 uppercase">© 2025 — Comando Lab Sales Intelligence.</p>
           <p className="text-[10px] text-gray-700 mt-1">Acesso restrito a colaboradores autorizados.</p>
        </div>

      </div>
    </div>
  );
};