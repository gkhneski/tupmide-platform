"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@slimiq.info");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    // 1) Supabase email / password login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message || "Giriş yapılamadı.");
      setLoading(false);
      return;
    }

    const user = data?.user;
    if (!user) {
      setErrorMsg("Kullanıcı bulunamadı.");
      setLoading(false);
      return;
    }

    try {
      // 2) Önce super_admins tablosuna bak
      const { data: superAdmin } = await supabase
        .from("super_admins")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (superAdmin) {
        router.push("/admin");
        return;
      }

      // 3) Doktor mu?
      const { data: doctor } = await supabase
        .from("doctors")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (doctor) {
        router.push("/doctor"); // doktor panelini sonra yapacağız
        return;
      }

      // 4) Asistan mı?
      const { data: assistant } = await supabase
        .from("assistants")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (assistant) {
        router.push("/assistant"); // assistant paneli sonra
        return;
      }

      // 5) Hasta mı?
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (patient) {
        router.push("/patient"); // hasta paneli sonra
        return;
      }

      // Hiçbiri değilse:
      setErrorMsg(
        "Hesap başarıyla giriş yaptı, fakat rol atanmadı. Lütfen yöneticiyle iletişime geçin."
      );
    } catch (err) {
      console.error(err);
      setErrorMsg("Rol kontrolü sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="main-shell">
      <div
        className="card"
        style={{
          maxWidth: 420,
          margin: "0 auto",
        }}
      >
        <div className="badge">SlimIQ · Klinik & Hasta Takip</div>
        <h1>Giriş</h1>
        <p>
          Email ve şifren ile giriş yap. Rolüne göre otomatik olarak ilgili
          panele yönlendirileceksin.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}
        >
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>E-posta</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="ornek@slimiq.info"
              required
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span>Şifre</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Şifreniz"
              required
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
            {loading ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>
      </div>
    </main>
  );
}
