"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [stats, setStats] = useState({
    clinics: 0,
    doctors: 0,
    patients: 0,
    activeToday: 0,
  });
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setErrorMsg("");

      try {
        // Klinik listesi
        const {
  data: clinicsData,
  error: clinicsError,
} = await supabase
  .from("clinics")
  .select("id, name, city")
  .order("created_at", { ascending: true });

        if (clinicsError) throw clinicsError;
        setClinics(clinicsData || []);

        // Sayılar (toplam klinik / doktor / hasta)
        const [{ count: clinicsCount }, { count: doctorsCount }, { count: patientsCount }] =
          await Promise.all([
            supabase
              .from("clinics")
              .select("*", { head: true, count: "exact" }),
            supabase
              .from("doctors")
              .select("*", { head: true, count: "exact" }),
            supabase
              .from("patients")
              .select("*", { head: true, count: "exact" }),
          ]);

        setStats({
          clinics: clinicsCount ?? 0,
          doctors: doctorsCount ?? 0,
          patients: patientsCount ?? 0,
          activeToday: 0, // TODO: ileride "bugün aktif" için ayrı logic
        });
      } catch (err) {
        console.error(err);
        setErrorMsg("Klinik verileri yüklenirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Üst başlık */}
      <header className="admin-header">
        <div>
          <h1>SlimIQ Süper Admin Paneli</h1>
          <p>Tüm klinikleri, doktorları ve hasta akışını tek yerden yönet.</p>
        </div>
        <Link href="/admin/new-clinic" className="button">
          Yeni Klinik Ekle
        </Link>
      </header>

      {/* İstatistik kartları */}
      <section className="admin-stats">
        <div className="stat-card">
          <div className="stat-label">Toplam Klinik</div>
          <div className="stat-value">{stats.clinics}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Toplam Doktor</div>
          <div className="stat-value">{stats.doctors}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Toplam Hasta</div>
          <div className="stat-value">{stats.patients}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Bugün Aktif Hasta</div>
          <div className="stat-value">{stats.activeToday}</div>
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

        {errorMsg && (
          <div style={{ marginBottom: 12, color: "#f97373", fontSize: 13 }}>
            {errorMsg}
          </div>
        )}

        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Klinik adı</th>
                <th>Şehir</th>
                <th>Durum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: 16 }}>
                    Veriler yükleniyor…
                  </td>
                </tr>
              ) : clinics.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 16 }}>
                    Henüz kayıtlı klinik yok. İlk kliniği oluşturmak için{" "}
                    <Link href="/admin/new-clinic" className="link-small">
                      buraya tıkla.
                    </Link>
                  </td>
                </tr>
              ) : (
                clinics.map((clinic) => (
                  <tr key={clinic.id}>
                    <td>{clinic.name}</td>
                    <td>{clinic.city || "-"}</td>
                    <td>Aktif</td>
                    <td>
                      <Link
                        href={`/admin/clinics/${clinic.id}`}
                        className="link-small"
                      >
                        Detay
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
