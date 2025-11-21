import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import './Login.css'; // <-- IMPORTANTE
import { Logo } from '../components/Logo';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(async () => {
      const success = await login(email, password);
      if (!success) {
        setError('Credenciais inválidas. Tente novamente.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="login-container">

      {/* Background */}
      <div className="login-bg-effects"></div>

      <div className="login-wrapper">

        {/* Header */}
        <div className="login-header">
          <div className="login-logo-wrapper">
            <Logo />
          </div>

          <h1 className="login-title">
            COMANDO <span>LAB</span>
          </h1>

          <p className="login-subtitle">SALES INTELLIGENCE PLATFORM</p>
        </div>

        {/* Card */}
        <div className="login-card">
          <div className="login-card-header">
            <h2>Bem-vindo</h2>
            <p>Conecte-se para acessar seus dashboards.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">

            {/* Email */}
            <div className="input-group">
              <label>E-mail Corporativo</label>
              <div className="input-field">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@comandolab.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label>Senha</label>
              <div className="input-field">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <CheckCircle2 size={12} className="remember-icon" />
                Lembrar-me
              </label>

              <a href="#" className="forgot-password">Esqueci a senha</a>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? (
                <span className="loader"></span>
              ) : (
                <>Entrar na Plataforma <ArrowRight size={18} /></>
              )}
            </button>

          </form>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2025 — Comando Lab Sales Intelligence.</p>
          <p>Acesso restrito a colaboradores autorizados.</p>
        </div>

      </div>
    </div>
  );
};

export default Login;
