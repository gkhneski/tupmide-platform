// app/admin/page.jsx
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // her istekte güncel veri al

export default async function AdminDashboardPage() {
  // Şimdilik TÜM klinikleri sayalım (filtre yok)
  const [clinicCount, doctorCount] = await Promise.all([
    prisma.clinic.count(),
    prisma.doctor.count(),
  ]);

  const recentClinics = await prisma.clinic.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      createdAt: true,
      status: true,
    },
  });

  return (
    <main className="admin-dashboard">
      <section className="dashboard-header">
        <h1 className="clinics-title">SlimIQ Tüp Mide Platformu</h1>
        <p className="clinics-subtitle">
          Tüm klinik, doktor ve hasta akışını tek panelden yönet.
        </p>
      </section>

      {/* Üst kartlar */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Aylık Abonelik Geliri</div>
          <div className="stat-value">€0,00</div>
          <div className="stat-sub">Başlangıç aşamasında</div>
        </div>

        {/* 🔥 Burada artık DB'den gelen sayı */}
        <div className="stat-card">
          <div className="stat-label">Klinik sayısı</div>
          <div className="stat-value">{clinicCount}</div>
          <div className="stat-sub">Hedef: 50 klinik</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Doktor sayısı</div>
          <div className="stat-value">{doctorCount}</div>
          <div className="stat-sub">Platforma kayıtlı</div>
        </div>
      </section>

      {/* Son Aktivite */}
      <section className="clinics-card" style={{ marginTop: 24 }}>
        <div className="clinics-card-header">
          <h2 className="clinics-card-title">Son Aktivite</h2>
        </div>

        <div className="clinics-card-body">
          <table className="clinics-table">
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
              {recentClinics.map((c, index) => (
                <tr key={c.id}>
                  <td>{`#${String(index + 1).padStart(3, "0")}`}</td>
                  <td>Klinik</td>
                  <td>{c.name}</td>
                  <td>-</td>
                  <td>
                    {new Date(c.createdAt).toLocaleDateString("tr-TR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </td>
                  <td>
                    {c.status === "active"
                      ? "Aktif"
                      : c.status === "trial"
                      ? "Deneme"
                      : c.status === "paused"
                      ? "Askıda"
                      : c.status}
                  </td>
                </tr>
              ))}

              {recentClinics.length === 0 && (
                <tr>
                  <td colSpan={6}>Henüz kayıt yok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
