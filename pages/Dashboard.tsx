// Dashboard.tsx (refatorado, sem Tailwind)
import React, { useState, useEffect, useRef } from "react";
import { Modal } from "../components/Modal";
import { Download, FileSpreadsheet, FileText, Plus, PlugZap, Database } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "./Dashboard.css";

export const Dashboard = () => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addType, setAddType] = useState<"mockup" | "integration">("mockup");
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Fechar menu de exportação ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node)
      ) {
        setIsExportMenuOpen(false);
      }
    };

    if (isExportMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExportMenuOpen]);

  // Dados do dashboard para exportação
  const dashboardData = {
    kpis: [
      { title: "Leads gerados", value: "1.240" },
      { title: "Conversões", value: "312" },
      { title: "Taxa%", value: "25,1%" },
    ],
    activities: [
      { description: "Novo lead cadastrado", time: "Há 2 horas" },
      { description: "Reunião marcada", time: "Há 5 horas" },
      { description: "Follow-up enviado", time: "Há 1 dia" },
    ],
  };

  const handleExportExcel = () => {
    // Preparar dados para Excel
    const wsData = [
      ["Relatório Dashboard - Comando Lab"],
      [""],
      ["KPIs"],
      ["Métrica", "Valor"],
      ...dashboardData.kpis.map((kpi) => [kpi.title, kpi.value]),
      [""],
      ["Atividades Recentes"],
      ["Descrição", "Tempo"],
      ...dashboardData.activities.map((act) => [act.description, act.time]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dashboard");

    // Ajustar largura das colunas
    ws["!cols"] = [{ wch: 30 }, { wch: 15 }];

    // Gerar e baixar arquivo
    const fileName = `dashboard-relatorio-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    setIsExportMenuOpen(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = margin;

    // Título
    doc.setFontSize(18);
    doc.setTextColor(130, 217, 246);
    doc.text("Relatório Dashboard - Comando Lab", margin, yPos);
    yPos += 15;

    // Data
    doc.setFontSize(10);
    doc.setTextColor(156, 167, 184);
    doc.text(
      `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
      margin,
      yPos
    );
    yPos += 20;

    // KPIs
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(22, 29, 42);
    doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, "F");
    doc.text("KPIs", margin + 5, yPos);
    yPos += 12;

    doc.setFontSize(11);
    dashboardData.kpis.forEach((kpi) => {
      doc.setTextColor(156, 167, 184);
      doc.text(`${kpi.title}:`, margin + 5, yPos);
      doc.setTextColor(130, 217, 246);
      doc.text(kpi.value, pageWidth - margin - 50, yPos);
      yPos += 8;
    });

    yPos += 10;

    // Atividades
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(22, 29, 42);
    doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 8, "F");
    doc.text("Atividades Recentes", margin + 5, yPos);
    yPos += 12;

    doc.setFontSize(11);
    dashboardData.activities.forEach((act) => {
      doc.setTextColor(255, 255, 255);
      doc.text(act.description, margin + 5, yPos);
      doc.setTextColor(156, 167, 184);
      doc.text(act.time, pageWidth - margin - 50, yPos);
      yPos += 8;

      // Verificar se precisa de nova página
      if (yPos > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        yPos = margin;
      }
    });

    // Salvar PDF
    const fileName = `dashboard-relatorio-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
    setIsExportMenuOpen(false);
  };

  const handleAddMockup = () => {
    // Aqui você pode adicionar lógica para criar um mockup
    alert("Funcionalidade de adicionar mockup será implementada aqui.");
    setIsAddModalOpen(false);
  };

  const handleAddIntegration = () => {
    // Aqui você pode redirecionar para página de integrações ou abrir modal específico
    alert("Redirecionando para página de integrações...");
    setIsAddModalOpen(false);
    // Exemplo: window.location.href = '/integrations';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-actions">
          <div className="export-menu-wrapper" ref={exportMenuRef}>
            <button
              className="button outline"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            >
              <Download size={16} />
              Exportar
            </button>
            {isExportMenuOpen && (
              <div className="export-menu">
                <button
                  className="export-menu-item"
                  onClick={handleExportExcel}
                >
                  <FileSpreadsheet size={16} />
                  Exportar Excel
                </button>
                <button
                  className="export-menu-item"
                  onClick={handleExportPDF}
                >
                  <FileText size={16} />
                  Exportar PDF
                </button>
              </div>
            )}
          </div>
          <button
            className="button primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            Adicionar
          </button>
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

      {/* Modal de Adicionar */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Adicionar Novo Item"
      >
        <div className="add-modal-content">
          <div className="add-type-selector">
            <button
              className={`add-type-button ${addType === "mockup" ? "active" : ""}`}
              onClick={() => setAddType("mockup")}
            >
              <Database size={20} />
              <span>Adicionar Mockup</span>
            </button>
            <button
              className={`add-type-button ${addType === "integration" ? "active" : ""}`}
              onClick={() => setAddType("integration")}
            >
              <PlugZap size={20} />
              <span>Nova Integração</span>
            </button>
          </div>

          {addType === "mockup" && (
            <div className="add-mockup-form">
              <p className="add-form-description">
                Crie um mockup de dados para testes e desenvolvimento.
              </p>
              <button
                className="add-form-button"
                onClick={handleAddMockup}
              >
                Criar Mockup
              </button>
            </div>
          )}

          {addType === "integration" && (
            <div className="add-integration-form">
              <p className="add-form-description">
                Configure uma nova integração com APIs externas, CRMs ou outras fontes de dados.
              </p>
              <button
                className="add-form-button"
                onClick={handleAddIntegration}
              >
                Configurar Integração
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
