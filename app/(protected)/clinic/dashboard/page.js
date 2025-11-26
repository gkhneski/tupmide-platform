const mockPatients = [
  { id: "p1", name: "Ayşe Y.", surgeryDate: "2025-01-10", currentWeight: 92 },
  { id: "p2", name: "Mehmet K.", surgeryDate: "2025-02-03", currentWeight: 110 },
  { id: "p3", name: "Elif T.", surgeryDate: "2024-11-21", currentWeight: 78 },
];

export default function ClinicDashboard() {
  return (
    <main className="main-shell">
      <div className="card" style={{ maxWidth: 800 }}>
        <div className="badge">Klinik Doktor Paneli · Demo</div>
        <h1>Klinik Özeti</h1>
        <p>
          Burada kendi hastalarını, son ölçümleri ve lab sonuçlarını
          göreceksin. Şu an mock data ile çalışıyor.
        </p>

        <h3 style={{ marginTop: 20, fontSize: 14 }}>Aktif Hastalar</h3>
        <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
          {mockPatients.map((p) => (
            <div
              key={p.id}
              className="card"
              style={{
                boxShadow: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>
                  Ameliyat: {p.surgeryDate}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>Güncel kilo</div>
                <div style={{ fontSize: 20 }}>{p.currentWeight} kg</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
