import Link from "next/link";

export default function Home() {
  return (
    <main className="main-shell">
      <div className="card">
        <div className="badge">SlimIQ · Klinik & Hasta Takip SaaS</div>
        <h1>SlimIQ Klinik Platformu</h1>
        <p>
          Tüp mide ve bariatrik cerrahi hastaları için akıllı takip sistemi. 
          Doktor ekibiniz ve hastalarınız kilo, kan değerleri ve kontrolleri tek 
          bir yerden güvenli şekilde yönetebilir.
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
