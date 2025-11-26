// app/admin/page.js
import Link from "next/link";

const mockStats = {
  clinics: 3,
  doctors: 12,
  patients: 240,
  activeToday: 58,
};

const mockClinics = [
  {
    id: "1",
    name: "İstanbul Bariatrik Center",
    city: "İstanbul",
    doctors: 5,
    patients: 120,
    status: "Aktif",
  },
  {
    id: "2",
    name: "Ankara Tüp Mide Kliniği",
    city: "Ankara",
    doctors: 4,
    patients: 80,
    status: "Aktif",
  },
  {
    id: "3",
    name: "İzmir SlimIQ Partner",
    city: "İzmir",
    doctors: 3,
    patients: 40,
    status: "Test",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="admin-dashboard">
      {/* Üst başlık */}
      <header className="admin-header">
        <div>
          <h1>SlimIQ Süper Admin Paneli</h1>
          <p>
            Tüm klinikleri, doktorları ve hasta akışını tek yerden yönet.
          </p>
        </div>
        <Link href="/admin/new-clinic" className="button">
          Yeni Klinik Ekle
        </Link>
      </header>

      {/* İstatistik kartları */}
      <section className="admin-stats">
        <div className="stat-card">
          <div className="stat-label">Toplam Klinik</div>
          <div className="stat-value">{mockStats.clinics}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Toplam Doktor</div>
          <div className="stat-value">{mockStats.doctors}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Toplam Hasta</div>
          <div className="stat-value">{mockStats.patients}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bugün Aktif Hasta</div>
          <div className="stat-value">{mockStats.activeToday}</div>
        </div>
      </section>

      {/* Klinik listesi */}
      <section className="admin-section">
        <div className="section-header">
          <h2>Klinik Listesi</h2>
          <span className="section-sub">
            Süper admin olarak tüm klinikleri buradan takip edebilirsin.
          </span>
        </div>

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Klinik adı</th>
                <th>Şehir</th>
                <th>Doktor</th>
                <th>Hasta</th>
                <th>Durum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mockClinics.map((clinic) => (
                <tr key={clinic.id}>
                  <td>{clinic.name}</td>
                  <td>{clinic.city}</td>
                  <td>{clinic.doctors}</td>
                  <td>{clinic.patients}</td>
                  <td>{clinic.status}</td>
                  <td>
                    <Link href={`/admin/clinics/${clinic.id}`} className="link-small">
                      Detay
                    </Link>
                  </td>
                </tr>
              ))}
              {mockClinics.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 16 }}>
                    Henüz klinik yok. İlk kliniği oluşturmak için{" "}
                    <Link href="/admin/new-clinic" className="link-small">
                      buraya tıkla.
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
