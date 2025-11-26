import Link from "next/link";

export default function Home() {
  return (
    <main className="main-shell">
      <div className="card">
        <div className="badge">Admin & Klinik SaaS · Tüp Mide</div>
        <h1>Tüp Mide Klinik Platformu</h1>
        <p>
          Bu bir demo iskelettir. Giriş ekranına giderek doktor / hasta arayüzlerini test edebilirsin.
        </p>
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <Link href="/login" className="button">
            Giriş yap
          </Link>
        </div>
      </div>
    </main>
  );
}
