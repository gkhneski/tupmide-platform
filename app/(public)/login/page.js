"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("doctor");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Buraya Supabase Auth bağlanacak.
    // Şimdilik rol'e göre dummy yönlendirme yapıyoruz.
    if (role === "admin") router.push("/admin/dashboard");
    else if (role === "doctor") router.push("/clinic/dashboard");
    else if (role === "patient") router.push("/patient/dashboard");
  };

  return (
    <main className="main-shell">
      <div className="card">
        <div className="badge">Demo Login · Sadece iskelet</div>
        <h1>Giriş</h1>
        <p>
          Buraya Supabase Auth entegre edilecek. Şimdilik rol seçip demo
          panellere gidebilirsin.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
              E-posta
            </label>
            <input
              className="input"
              type="email"
              placeholder="doktor@klinik.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
              Rol
            </label>
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Süper Admin (Sen)</option>
              <option value="doctor">Doktor / Klinik</option>
              <option value="patient">Hasta</option>
            </select>
          </div>

          <button className="button" type="submit">
            Devam et
          </button>
        </form>
      </div>
    </main>
  );
}
