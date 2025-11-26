// app/admin/page.js
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // immer frische Daten holen

export default async function AdminDashboardPage() {
  // DB'den sayılar
  const [activeClinicCount, doctorCount] = await Promise.all([
    prisma.clinic.count({
      where: { status: "active" }, // status: "active" olanlar = Aktif Klinik
    }),
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
      {/* Üst başlık */}
      <section className="dashboard-header">
        <h1 className="clinics-title">SlimIQ Tüp Mide Platformu</h1>
        <p className="clinics-subtitle">
          Tüm klinik, doktor ve hasta akışını tek panelden yönet.
        </p>
      </section>

      {/* 3’lü istatistik kartları */}
      <section className="dashboard-stats">
        {/* Aylık abonelik geliri – şimdilik sabit */}
        <div className="stat-card">
          <div className="stat-label">Aylık Abonelik Geliri</div>
          <div className="stat-value">€0,00</div>
          <div className="stat-sub">Başlangıç aşamasında</div>
        </div>

        {/* 🔥 Aktif Klinik – ARTIK DB’DEN */}
        <div className="stat-card">
          <div className="stat-label">Aktif Klinik</div>
          <div className="stat-value">{activeClinicCount}</div>
          <div className="stat-sub">Hedef: 50 klinik</div>
        </div>

        {/* Doktor sayısı – ileride kullanışlı olur */}
        <div className="stat-card">
          <div className="stat-label">Doktor sayısı</div>
          <div className="stat-value">{doctorCount}</div>
          <div className="stat-sub">Platforma kayıtlı</div>
        </div>
      </section>

      {/* Son Aktivite – şimdilik sadece klinikler */}
      <section className="clinics-card" style={{ marginTop: 24 }}>
        <div className="clinics-card-header">
          <h2 className="clinics-card-title">Son Aktivite</h2>
          <p className="clinics-subtitle">
            Sisteme eklenen klinik kayıtlarının özeti.
          </p>
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
