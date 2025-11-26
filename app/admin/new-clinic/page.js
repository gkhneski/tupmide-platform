"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function NewClinicPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    city: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.from("clinics").insert({
  name: form.name,
  city: form.city,
});


      if (error) throw error;

      // Başarılı → admin dashboard'a dön
      router.push("/admin");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Klinik kaydedilirken hata oluştu.");
      setLoading(false);
    }
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Yeni Klinik Ekle</h1>
          <p>SlimIQ platformuna yeni bir tüp mide / bariatrik klinik ekle.</p>
        </div>
        <Link href="/admin" className="button">
          Geri dön
        </Link>
      </header>

      <section className="admin-section">
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: 520,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Klinik adı</span>
            <input
              className="input"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Örn. İstanbul Bariatrik Center"
              required
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Şehir</span>
            <input
              className="input"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="İstanbul / Ankara / İzmir..."
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Not (iç kullanım)</span>
            <textarea
              className="input"
              rows={3}
              value={form.note}
              onChange={(e) => updateField("note", e.target.value)}
              placeholder="Örn. Bu klinik 3 doktorla çalışıyor, aylık 200 hasta limiti vs."
            />
          </label>

          {errorMsg && (
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                color: "#f97373",
              }}
            >
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="button"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? "Kaydediliyor..." : "Klinik oluştur"}
          </button>
        </form>
      </section>
    </div>
  );
}
