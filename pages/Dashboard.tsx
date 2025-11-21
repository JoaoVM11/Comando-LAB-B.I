// Dashboard.tsx (refatorado, sem Tailwind)
import React from "react";
import "./Dashboard.css";

export const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-actions">
          <button className="button outline">Exportar</button>
          <button className="button primary">Adicionar</button>
        </div>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h3 className="kpi-title">Leads gerados</h3>
          <p className="kpi-value">1.240</p>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-title">Conversões</h3>
          <p className="kpi-value">312</p>
        </div>
        <div className="kpi-card">
          <h3 className="kpi-title">Taxa%</h3>
          <p className="kpi-value">25,1%</p>
        </div>
      </div>

      <section className="dashboard-section">
        <h2 className="section-title">Atividades Recentes</h2>
        <div className="activities-list">
          <div className="activity-item">
            <p>Novo lead cadastrado</p>
            <span>Há 2 horas</span>
          </div>
          <div className="activity-item">
            <p>Reunião marcada</p>
            <span>Há 5 horas</span>
          </div>
          <div className="activity-item">
            <p>Follow-up enviado</p>
            <span>Há 1 dia</span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===================== Dashboard.css ===================== */
