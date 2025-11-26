"use client";

import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi";

const formatDate = (date) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("tr-TR");
};

const initialDoctors = [];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"

  const emptyDoctor = {
    id: "",
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
    status: "trial", // trial | active | paused
    notes: "",
  };

  const [currentDoctor, setCurrentDoctor] = useState(emptyDoctor);

  const openCreateForm = () => {
    setMode("create");
    setCurrentDoctor(emptyDoctor);
    setIsFormOpen(true);
  };

  const openEditForm = (doctor) => {
    setMode("edit");
    setCurrentDoctor({
      ...emptyDoctor,
      ...doctor,
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullName =
      (currentDoctor.firstName + " " + currentDoctor.lastName).trim();
    if (!fullName) {
      alert("Lütfen doktor adını girin.");
      return;
    }

    if (mode === "create") {
      const newDoctor = {
        ...currentDoctor,
        id:
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(),
        createdAt: new Date(),
      };
      setDoctors((prev) => [newDoctor, ...prev]);
    } else {
      setDoctors((prev) =>
        prev.map((d) =>
          d.id === currentDoctor.id ? { ...d, ...currentDoctor } : d
        )
      );
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    const doctor = doctors.find((d) => d.id === id);
    const ok = window.confirm(
      `"${doctor?.firstName} ${doctor?.lastName}" kaydını silmek istediğine emin misin?`
    );
    if (!ok) return;

    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const handleRefresh = () => {
    console.log("Doktor listesi yenile (ileride API'den çekilecek)");
  };

  return (
    <main className="clinics-page">
      {/* Başlık */}
      <section className="clinics-header">
        <h1 className="clinics-title">Klinikler</h1>
        <p className="clinics-subtitle">
          Platforma kayıtlı tüm doktor üyeliklerini buradan yönetebilirsin.
        </p>

        <div className="clinics-actions">
          <button type="button" onClick={handleRefresh} className="btn-ghost">
            <FiRefreshCw className="btn-icon" />
            Yenile
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
          {doctors.length === 0 ? (
            <div className="clinics-empty">
              <span>Henüz kayıtlı Klinik yok.</span>
              <button
                type="button"
                onClick={openCreateForm}
                className="btn-primary"
              >
                İlk Klinigi ekle
              </button>
            </div>
          ) : (
            <div className="clinics-table-wrapper">
              <table className="clinics-table">
                <thead>
                  <tr>
                    <th>Doktor</th>
                    <th>Uzmanlık</th>
                    <th>Klinik</th>
                    <th>E-posta</th>
                    <th>Telefon</th>
                    <th>Durum</th>
                    <th className="text-right">Oluşturulma</th>
                    <th className="text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>
                        {(doctor.firstName + " " + doctor.lastName).trim() ||
                          "-"}
                      </td>
                      <td>{doctor.speciality || "-"}</td>
                      <td>{doctor.clinicName || "-"}</td>
                      <td>{doctor.email || "-"}</td>
                      <td>{doctor.phone || doctor.whatsapp || "-"}</td>
                      <td>
                        {doctor.status === "trial"
                          ? "Deneme"
                          : doctor.status === "active"
                          ? "Aktif"
                          : "Askıda"}
                      </td>
                      <td className="text-right">
                        {doctor.createdAt ? formatDate(doctor.createdAt) : "-"}
                      </td>
                      <td className="text-right">
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn-icon-only"
                            onClick={() => openEditForm(doctor)}
                            aria-label="Düzenle"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            className="btn-icon-only danger"
                            onClick={() => handleDelete(doctor.id)}
                            aria-label="Sil"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
            <div className="form-field">
              <label htmlFor="firstName">Ad *</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={currentDoctor.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="lastName">Soyad *</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={currentDoctor.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="speciality">Uzmanlık alanı</label>
              <input
                id="speciality"
                name="speciality"
                type="text"
                value={currentDoctor.speciality}
                onChange={handleChange}
                placeholder="Genel cerrahi, bariatrik cerrahi..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="clinicName">Bağlı olduğu klinik</label>
              <input
                id="clinicName"
                name="clinicName"
                type="text"
                value={currentDoctor.clinicName}
                onChange={handleChange}
                placeholder="Klinik adı (opsiyonel)"
              />
            </div>

            <div className="form-field">
              <label htmlFor="country">Ülke</label>
              <input
                id="country"
                name="country"
                type="text"
                value={currentDoctor.country}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="city">Şehir</label>
              <input
                id="city"
                name="city"
                type="text"
                value={currentDoctor.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">E-posta</label>
              <input
                id="email"
                name="email"
                type="email"
                value={currentDoctor.email}
                onChange={handleChange}
                placeholder="doktor@..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="phone">Telefon</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={currentDoctor.phone}
                onChange={handleChange}
                placeholder="+90 ..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="whatsapp">WhatsApp (opsiyonel)</label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="text"
                value={currentDoctor.whatsapp}
                onChange={handleChange}
                placeholder="+90 ..."
              />
            </div>

            <div className="form-field">
              <label htmlFor="licenseNo">Lisans / diploma no</label>
              <input
                id="licenseNo"
                name="licenseNo"
                type="text"
                value={currentDoctor.licenseNo}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="status">Üyelik durumu</label>
              <select
                id="status"
                name="status"
                value={currentDoctor.status}
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
                value={currentDoctor.notes}
                onChange={handleChange}
                placeholder="Sözleşme, ödeme, sosyal medya linkleri vs."
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
