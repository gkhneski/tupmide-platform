"use client";

import { FiCreditCard, FiActivity, FiUsers } from "react-icons/fi";

export default function AdminDashboardPage() {
  const today = new Date().toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="admin-dashboard">
      {/* TOP KPIs – sadece üç kart */}
      <section className="admin-kpi-row">
        <div className="kpi-card">
          <div className="kpi-icon kpi-blue">
            <FiCreditCard />
          </div>
          <div className="kpi-text">
            <span className="kpi-label">Aylık Abonelik Geliri</span>
            <span className="kpi-value">₺0,00</span>
            <span className="kpi-sub">Başlangıç aşamasında</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-green">
            <FiActivity />
          </div>
          <div className="kpi-text">
            <span className="kpi-label">Aktif Klinik</span>
            <span className="kpi-value">0</span>
            <span className="kpi-sub">Hedef: 50 klinik</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-pink">
            <FiUsers />
          </div>
          <div className="kpi-text">
            <span className="kpi-label">Takip Edilen Hasta</span>
            <span className="kpi-value">0</span>
            <span className="kpi-sub">Ameliyat sonrası süreç</span>
          </div>
        </div>
      </section>

      {/* ALT – sadece Son Aktivite tablosu */}
      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <div>
            <h2>Son Aktivite</h2>
            <span className="muted">
              Sisteme eklenen klinik ve doktor kayıtlarının özeti
            </span>
          </div>
          <select className="input small">
            <option>Son 30 gün</option>
            <option>Son 7 gün</option>
            <option>Tümü</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kayıt</th>
                <th>Tip</th>
                <th>Klinik</th>
                <th>Doktor</th>
                <th>Oluşturulma</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#0001</td>
                <td>Klinik</td>
                <td>-</td>
                <td>-</td>
                <td>{today}</td>
                <td>Beklemede</td>
              </tr>
              <tr>
                <td>#0002</td>
                <td>Doktor</td>
                <td>-</td>
                <td>-</td>
                <td>{today}</td>
                <td>Beklemede</td>
              </tr>
              <tr>
                <td>#0003</td>
                <td>Hasta</td>
                <td>-</td>
                <td>-</td>
                <td>{today}</td>
                <td>Beklemede</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
