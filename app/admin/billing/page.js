"use client";

import { useState } from "react";
import { FiSave, FiRefreshCw } from "react-icons/fi";

export default function BillingPage() {
  const [settings, setSettings] = useState({
    clinic: {
      monthlyPrice: 149,      // € veya ₺ sen karar verirsin
      yearlyPrice: 1490,
      includedDoctors: 3,
      extraDoctorPrice: 29,
    },
    doctor: {
      monthlyPrice: 69,
      yearlyPrice: 690,
      includedPatients: 300,
      extraPatientPrice: 0.5, // örn. hasta başı
    },
  });

  const handleChange = (group, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [field]: value,
      },
    }));
  };

  const handleReset = () => {
    // ileride buraya API'den GET koyarsın
    console.log("Fiyatlandırma ayarlarını yenile (API'den okunacak)");
  };

  const handleSave = (e) => {
    e.preventDefault();
    // şimdilik sadece log – sonra /api/billing/update vs.
    console.log("Kaydedilen ayarlar:", settings);
    alert("Fiyatlandırma ayarları (şimdilik local) kaydedildi.");
  };

  return (
    <main className="clinics-page">
      {/* Başlık */}
      <section className="clinics-header">
        <h1 className="clinics-title">Fiyatlandırma</h1>
        <p className="clinics-subtitle">
          Klinik ve doktor lisans fiyatlarını, paketleri ve ek ücretleri buradan
          yönetebilirsin. Bu ayarlar tüm yeni üyelikler için temel alınır.
        </p>

        <div className="clinics-actions">
          <button type="button" onClick={handleReset} className="btn-ghost">
            <FiRefreshCw className="btn-icon" />
            Yenile
          </button>
          <button type="submit" form="billing-form" className="btn-primary">
            <FiSave className="btn-icon" />
            Kaydet
          </button>
        </div>
      </section>

      {/* Ayarlar kartı */}
      <section className="clinics-card">
        <div className="clinics-card-header">
          <h2 className="clinics-card-title">Varsayılan lisans fiyatları</h2>
        </div>

        <form
          id="billing-form"
          onSubmit={handleSave}
          className="clinics-form-grid"
          style={{ marginTop: 12 }}
        >
          {/* Klinik lisansı */}
          <div className="form-field form-field--full">
            <label className="font-medium">Klinik lisansı</label>
          </div>

          <div className="form-field">
            <label htmlFor="clinic-monthly">Aylık ücret</label>
            <input
              id="clinic-monthly"
              type="number"
              min="0"
              step="0.01"
              value={settings.clinic.monthlyPrice}
              onChange={(e) =>
                handleChange("clinic", "monthlyPrice", Number(e.target.value))
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="clinic-yearly">Yıllık ücret</label>
            <input
              id="clinic-yearly"
              type="number"
              min="0"
              step="0.01"
              value={settings.clinic.yearlyPrice}
              onChange={(e) =>
                handleChange("clinic", "yearlyPrice", Number(e.target.value))
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="clinic-included-doctors">
              Dahil doktor sayısı
            </label>
            <input
              id="clinic-included-doctors"
              type="number"
              min="0"
              step="1"
              value={settings.clinic.includedDoctors}
              onChange={(e) =>
                handleChange(
                  "clinic",
                  "includedDoctors",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="clinic-extra-doctor">
              Ek doktor ücreti (aylık)
            </label>
            <input
              id="clinic-extra-doctor"
              type="number"
              min="0"
              step="0.01"
              value={settings.clinic.extraDoctorPrice}
              onChange={(e) =>
                handleChange(
                  "clinic",
                  "extraDoctorPrice",
                  Number(e.target.value)
                )
              }
            />
          </div>

          {/* Doktor lisansı */}
          <div className="form-field form-field--full" style={{ marginTop: 12 }}>
            <label className="font-medium">Doktor lisansı (tek doktor)</label>
          </div>

          <div className="form-field">
            <label htmlFor="doctor-monthly">Aylık ücret</label>
            <input
              id="doctor-monthly"
              type="number"
              min="0"
              step="0.01"
              value={settings.doctor.monthlyPrice}
              onChange={(e) =>
                handleChange("doctor", "monthlyPrice", Number(e.target.value))
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="doctor-yearly">Yıllık ücret</label>
            <input
              id="doctor-yearly"
              type="number"
              min="0"
              step="0.01"
              value={settings.doctor.yearlyPrice}
              onChange={(e) =>
                handleChange("doctor", "yearlyPrice", Number(e.target.value))
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="doctor-included-patients">
              Dahil hasta sayısı (opsiyonel)
            </label>
            <input
              id="doctor-included-patients"
              type="number"
              min="0"
              step="1"
              value={settings.doctor.includedPatients}
              onChange={(e) =>
                handleChange(
                  "doctor",
                  "includedPatients",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="doctor-extra-patient">
              Ek hasta ücreti (örneğin hasta başı)
            </label>
            <input
              id="doctor-extra-patient"
              type="number"
              min="0"
              step="0.01"
              value={settings.doctor.extraPatientPrice}
              onChange={(e) =>
                handleChange(
                  "doctor",
                  "extraPatientPrice",
                  Number(e.target.value)
                )
              }
            />
          </div>

          {/* Alt butonlar (mobilde de görünsün diye) */}
          <div className="form-actions form-field--full" style={{ marginTop: 12 }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn-ghost"
            >
              Yenile
            </button>
            <button type="submit" className="btn-primary">
              Kaydet
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
