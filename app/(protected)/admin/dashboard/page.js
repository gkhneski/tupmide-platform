export default function AdminDashboard() {
  return (
    <main className="main-shell">
      <div className="card" style={{ maxWidth: 720 }}>
        <div className="badge">Süper Admin Panel · Demo</div>
        <h1>Genel Sistem Özeti</h1>
        <p>
          Buradan tüm klinikleri, doktorları, hasta sayılarını ve faturaları
          kontrol edeceksin. Şu an sadece placeholder metinler var.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
            marginTop: 18,
          }}
        >
          <div className="card" style={{ boxShadow: "none" }}>
            <h3 style={{ marginTop: 0, fontSize: 14 }}>Toplam Klinik</h3>
            <p style={{ fontSize: 24, margin: 0 }}>10</p>
          </div>
          <div className="card" style={{ boxShadow: "none" }}>
            <h3 style={{ marginTop: 0, fontSize: 14 }}>Toplam Doktor</h3>
            <p style={{ fontSize: 24, margin: 0 }}>30</p>
          </div>
          <div className="card" style={{ boxShadow: "none" }}>
            <h3 style={{ marginTop: 0, fontSize: 14 }}>Aktif Hasta</h3>
            <p style={{ fontSize: 24, margin: 0 }}>1000</p>
          </div>
        </div>
      </div>
    </main>
  );
}
