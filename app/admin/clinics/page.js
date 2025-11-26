"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  firstName: "",
  lastName: "",
  speciality: "",
  clinicName: "",
  country: "Türkiye",
  city: "",
  email: "",
  phone: "",
  whatsapp: "",
  licenseNo: "",
  status: "active",
  notes: "",
};

export default function ClinicsPage() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // İlk yüklemede DB'den klinikleri çek
  useEffect(() => {
    async function loadClinics() {
      try {
        const res = await fetch("/api/clinics");
        const data = await res.json();
        setClinics(data);
      } catch (e) {
        console.error("Klinikler yüklenirken hata:", e);
      } finally {
        setLoading(false);
      }
    }
    loadClinics();
  }, []);

  function openNewClinic() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditClinic(clinic) {
    setEditingId(clinic.id);
    setForm({
      firstName: clinic.contactName?.split(" ")[0] || "",
      lastName: clinic.contactName?.split(" ").slice(1).join(" ") || "",
      speciality: clinic.type || "",
      clinicName: clinic.name || "",
      country: clinic.country || "Türkiye",
      city: clinic.city || "",
      email: clinic.email || "",
      phone: clinic.phone || "",
      whatsapp: clinic.contactPhone || "",
      licenseNo: "",
      status: clinic.status || "active",
      notes: clinic.notes || "",
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = { ...form };

      if (editingId) {
        const res = await fetch(`/api/clinics/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Update failed");
      } else {
        const res = await fetch("/api/clinics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Create failed");
      }

      // Kayıt sonrası listeyi yeniden yükle
      const res = await fetch("/api/clinics");
      const data = await res.json();
      setClinics(data);
      setShowForm(false);
    } catch (err) {
      console.error("Kayıt hatası", err);
      alert("Kayıt sırasında bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Bu kliniği silmek istiyor musun?")) return;
    try {
      await fetch(`/api/clinics/${id}`, { method: "DELETE" });
      setClinics((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Silme hatası", err);
      alert("Silme sırasında hata oluştu.");
    }
  }

  return (
    <main className="admin-page">
      <section className="clinics-header">
        <h1 className="clinics-title">Klinikler</h1>
        <p className="clinics-subtitle">
          Platforma kayıtlı tüm doktor üyeliklerini buradan yönetebilirsin.
        </p>
        <div style={{ marginTop: 16 }}>
          <button
            className="btn-secondary"
            type="button"
            onClick={() => {
              setLoading(true);
              fetch("/api/clinics")
                .then((r) => r.json())
                .then(setClinics)
                .finally(() => setLoading(false));
            }}
          >
            ↻ Yenile
          </button>
          <button
            className="btn-primary"
            style={{ marginLeft: 8 }}
            type="button"
            onClick={openNewClinic}
          >
            + Klinik ekle
          </button>
        </div>
      </section>

      <section className="clinics-card">
        <div className="clinics-card-header">
          <h2 className="clinics-card-title">Klinik listesi</h2>
        </div>

        <div className="clinics-card-body">
          {loading ? (
            <div>Yükleniyor…</div>
          ) : clinics.length === 0 ? (
            <div>Henüz kayıtlı klinik yok.</div>
          ) : (
            <table className="clinics-table">
              <thead>
                <tr>
                  <th>Doktor</th>
                  <th>Uzmanlık</th>
                  <th>Klinik</th>
                  <th>E-posta</th>
                  <th>Telefon</th>
                  <th>Durum</th>
                  <th>Oluşturulma</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((c) => (
                  <tr key={c.id}>
                    <td>{c.contactName}</td>
                    <td>{c.type}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.status === "active" ? "Aktif" : c.status}</td>
                    <td>
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString("tr-TR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td>
                      <button onClick={() => openEditClinic(c)}>Düzenle</button>
                      <button
                        style={{ marginLeft: 8 }}
                        onClick={() => handleDelete(c.id)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Form modal / panel */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="clinics-card-title">
              {editingId ? "Klinik düzenle" : "Yeni Klinik Ekle"}
            </h2>
            <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
              <div className="form-grid">
                <div>
                  <label>Ad *</label>
                  <input
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label>Soyad *</label>
                  <input
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label>Uzmanlık alanı</label>
                  <input
                    value={form.speciality}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, speciality: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label>Bağlı olduğu klinik</label>
                  <input
                    value={form.clinicName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, clinicName: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label>Ülke</label>
                  <input
                    value={form.country}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, country: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label>Şehir</label>
                  <input
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label>E-posta</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label>Telefon</label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label>WhatsApp (opsiyonel)</label>
                  <input
                    value={form.whatsapp}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, whatsapp: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label>Üyelik durumu</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, status: e.target.value }))
                    }
                  >
                    <option value="active">Aktif</option>
                    <option value="trial">Deneme</option>
                    <option value="paused">Askıda</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label>Notlar</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                />
              </div>

              <div style={{ marginTop: 16, textAlign: "right" }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{ marginRight: 8 }}
                >
                  İptal
                </button>
                <button type="submit" disabled={saving}>
                  {saving ? "Kaydediliyor…" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
