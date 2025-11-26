"use client";

import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";

const formatDate = (date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("tr-TR");
};

const emptyClinic = {
  id: "",
  name: "",
  type: "clinic",
  country: "Türkiye",
  city: "",
  address: "",
  zip: "",
  website: "",
  email: "",
  phone: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  status: "trial",
  notes: "",
};

export default function ClinicsPage() {
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [currentClinic, setCurrentClinic] = useState(emptyClinic);

  // İlk yüklemede DB'den çek
  const loadClinics = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/clinics");
      if (!res.ok) throw new Error("Load failed");
      const data = await res.json();
      setClinics(data);
    } catch (err) {
      console.error("Klinik yükleme hatası", err);
      alert("Klinikler yüklenirken hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClinics();
  }, []);

  const openCreateForm = () => {
    setMode("create");
    setCurrentClinic(emptyClinic);
    setIsFormOpen(true);
  };

  const openEditForm = (clinic) => {
    setMode("edit");
    setCurrentClinic({
      ...emptyClinic,
      ...clinic,
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentClinic((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = currentClinic.name.trim();
    if (!trimmedName) {
      alert("Lütfen klinik adını girin.");
      return;
    }

    const payload = {
      ...currentClinic,
      name: trimmedName,
    };

    try {
      let res;
      if (mode === "create") {
        res = await fetch("/api/clinics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/clinics/${currentClinic.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();

      if (mode === "create") {
        setClinics((prev) => [saved, ...prev]);
      } else {
        setClinics((prev) =>
          prev.map((c) => (c.id === saved.id ? saved : c))
        );
      }

      setIsFormOpen(false);
    } catch (err) {
      console.error("Klinik kaydetme hatası", err);
      alert("Klinik kaydedilirken hata oluştu.");
    }
  };

  const handleDelete = async (id) => {
    const clinic = clinics.find((c) => c.id === id);
    const ok = window.confirm(
      `"${clinic?.name}" kliniğini silmek istediğine emin misin?`
    );
    if (!ok) return;

    try {
      const res = await fetch(`/api/clinics/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Delete failed");
      setClinics((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Klinik silme hatası", err);
      alert("Klinik silinirken hata oluştu.");
    }
  };

  const handleRefresh = () => {
    loadClinics();
  };

  return (
    <main className="clinics-page">
      {/* Başlık */}
      <section className="clinics-header">
        <h1 className="clinics-title">Klinikler</h1>
        <p className="clinics-subtitle">
          Platforma bağlı tüm tüp mide kliniklerini buradan yönetebilirsin.
        </p>

        <div className="clinics-actions">
          <button type="button" onClick={handleRefresh} className="btn-ghost">
            <FiRefreshCw className="btn-icon" />
            {isLoading ? "Yükleniyor..." : "Yenile"}
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className="btn-primary"
          >
            <FiPlus className="btn-icon" />
            Klinik ekle
          </button>
        </div>
      </section>

      {/* Liste */}
      <section className="clinics-card">
        <div className="clinics-card-header">
          <h2 className="clinics-card-title">Klinik listesi</h2>
        </div>

        <div className="clinics-card-body">
          {clinics.length === 0 && !isLoading ? (
            <div className="clinics-empty">
              <span>Henüz kayıtlı klinik yok.</span>
              <button
                type="button"
                onClick={openCreateForm}
                className="btn-primary"
              >
                İlk kliniği ekle
              </button>
            </div>
          ) : (
            <div className="clinics-table-wrapper">
              <table className="clinics-table">
                <thead>
                  <tr>
                    <th>Klinik</th>
                    <th>Şehir</th>
                    <th>Yetkili kişi</th>
                    <th>E-posta</th>
                    <th>Telefon</th>
                    <th>Durum</th>
                    <th className="text-right">Oluşturulma</th>
                    <th className="text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {clinics.map((clinic) => (
                    <tr key={clinic.id}>
                      <td>{clinic.name}</td>
                      <td>{clinic.city || "-"}</td>
                      <td>{clinic.contactName || "-"}</td>
                      <td>{clinic.email || clinic.contactEmail || "-"}</td>
                      <td>{clinic.phone || clinic.contactPhone || "-"}</td>
                      <td>
                        {clinic.status === "trial"
                          ? "Deneme"
                          : clinic.status === "active"
                          ? "Aktif"
                          : clinic.status === "paused"
                          ? "Askıda"
                          : clinic.status}
                      </td>
                      <td className="text-right">
                        {clinic.createdAt
                          ? formatDate(clinic.createdAt)
                          : "-"}
                      </td>
                      <td className="text-right">
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn-icon-only"
                            onClick={() => openEditForm(clinic)}
                            aria-label="Düzenle"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-only danger"
                            onClick={() => handleDelete(clinic.id)}
                            aria-label="Sil"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {clinics.length === 0 && isLoading && (
                    <tr>
                      <td colSpan={8} style={{ padding: "12px 8px" }}>
                        Yükleniyor...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Form */}
      {isFormOpen && (
        <section className="clinics-card clinics-form">
          <div className="clinics-form-header">
            <h3 className="clinics-card-title">
              {mode === "create" ? "Yeni Klinik Ekle" : "Klinik Düzenle"}
            </h3>
            <button
              type="button"
              className="btn-icon-only"
              onClick={handleCloseForm}
              aria-label="Formu kapat"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="clinics-form-grid">
            {/* Klinik temel */}
            <div className="form-field">
              <label htmlFor="name">Klinik adı *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={currentClinic.name}
                onChange={handleChange}
                placeholder="Örn. SlimIQ Klinik İstanbul"
                autoFocus
              />
            </div>

            <div className="form-field">
              <label htmlFor="type">Klinik türü</label>
              <select
                id="type"
                name="type"
                value={currentClinic.type}
                onChange={handleChange}
              >
                <option value="clinic">Klinik</option>
                <option value="hospital">Özel Hastane</option>
                <option value="office">Muayenehane</option>
                <option value="other">Diğer</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="country">Ülke</label>
              <input
                id="country"
                name="country"
                type="text"
                value={currentClinic.country}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="city">Şehir</label>
              <input
                id="city"
                name="city"
                type="text"
                value={currentClinic.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="address">Adres</label>
              <input
                id="address"
                name="address"
                type="text"
                value={currentClinic.address}
                onChange={handleChange}
                placeholder="Cadde, sokak, no"
              />
            </div>

            <div className="form-field">
              <label htmlFor="zip">Posta kodu</label>
              <input
                id="zip"
                name="zip"
                type="text"
                value={currentClinic.zip}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                value={currentClinic.website}
                onChange={handleChange}
                placeholder="https://"
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Genel e-posta</label>
              <input
                id="email"
                name="email"
                type="email"
                value={currentClinic.email}
                onChange={handleChange}
                placeholder="info@..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="phone">Genel telefon</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={currentClinic.phone}
                onChange={handleChange}
                placeholder="+90 ..."
              />
            </div>

            {/* Yetkili kişi */}
            <div className="form-field">
              <label htmlFor="contactName">Yetkili kişi adı soyadı</label>
              <input
                id="contactName"
                name="contactName"
                type="text"
                value={currentClinic.contactName}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contactEmail">Yetkili e-posta</label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={currentClinic.contactEmail}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="contactPhone">Yetkili telefon</label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="text"
                value={currentClinic.contactPhone}
                onChange={handleChange}
              />
            </div>

            {/* Üyelik + not */}
            <div className="form-field">
              <label htmlFor="status">Üyelik durumu</label>
              <select
                id="status"
                name="status"
                value={currentClinic.status}
                onChange={handleChange}
              >
                <option value="trial">Deneme</option>
                <option value="active">Aktif</option>
                <option value="paused">Askıda</option>
              </select>
            </div>

            <div className="form-field form-field--full">
              <label htmlFor="notes">Notlar</label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={currentClinic.notes}
                onChange={handleChange}
                placeholder="Örn. sözleşme tarihi, özel anlaşmalar, ödeme notları..."
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleCloseForm}
                className="btn-ghost"
              >
                İptal
              </button>
              <button type="submit" className="btn-primary">
                {mode === "create" ? "Kaydet" : "Güncelle"}
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
