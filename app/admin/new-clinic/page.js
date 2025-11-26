"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiPlusCircle } from "react-icons/fi";
import { supabase } from "../../../lib/supabaseClient";

export default function NewClinicPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    logoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccess(false);

    if (!form.name.trim()) {
      setErrorMsg("Klinik adı zorunludur.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("clinics").insert({
        name: form.name.trim(),
        phone: form.phone.trim() || null,
        logo_url: form.logoUrl.trim() || null,
      });

      if (error) {
        console.error(error);
        setErrorMsg(error.message || "Klinik oluşturulurken bir hata oluştu.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      // 1–2 saniye sonra dashboard'a dön
      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMsg("Beklenmeyen bir hata oluştu.");
      setLoading(false);
    }
  }

  return (
    <div className="admin-content">
      <div className="admin-form-header">
        <div>
          <h1>Yeni Klinik Ekle</h1>
          <p className="muted">
            Tüp mide / bariatrik kliniğin temel bilgilerini gir ve platforma ekle.
          </p>
        </div>
        <div className="admin-form-header-actions">
          <Link href="/admin" className="btn-secondary">
            <FiArrowLeft style={{ marginRight: 6 }} />
            Geri dön
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form-page">
        <div className="admin-form-grid">
          {/* Sol kart – Klinik bilgileri */}
          <section className="form-card">
            <h2>Klinik bilgileri</h2>
            <p className="muted small">
              Bu bilgiler sadece senin ve ekibinin panelinde görünecek.
            </p>

            <div className="form-field">
              <label className="form-label">
                Klinik adı <span className="required">*</span>
              </label>
              <input
                className="form-input"
                placeholder="Örn. İstanbul Bariatrik Center"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Telefon</label>
              <input
                className="form-input"
                placeholder="+90 ..."
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Logo URL (opsiyonel)</label>
              <input
                className="form-input"
                placeholder="https://..."
                value={form.logoUrl}
                onChange={(e) => updateField("logoUrl", e.target.value)}
              />
            </div>
          </section>

          {/* Sağ kart – Özet & kaydet */}
          <section className="form-card slim">
            <h2>Plan & kayıt özeti</h2>
            <p className="muted small">
              Klinik şu anda deneme modunda başlayacak. Plan & kredi kısmını
              sonra ekleriz.
            </p>

            <ul className="summary-list">
              <li>
                <span>Abonelik durumu</span>
                <span className="badge badge-gray">Deneme</span>
              </li>
              <li>
                <span>Başlangıç kredisi</span>
                <span>₺0,00</span>
              </li>
              <li>
                <span>Takip edilen hasta</span>
                <span>0</span>
              </li>
            </ul>

            {errorMsg && <div className="alert-error">{errorMsg}</div>}
            {success && (
              <div className="alert-success">
                Klinik başarıyla oluşturuldu. Yönlendiriliyorsun…
              </div>
            )}

            <button
              type="submit"
              className="btn-primary full"
              disabled={loading}
            >
              <FiPlusCircle style={{ marginRight: 6 }} />
              {loading ? "Kaydediliyor…" : "Klinik oluştur"}
            </button>
          </section>
        </div>
      </form>
    </div>
  );
}
