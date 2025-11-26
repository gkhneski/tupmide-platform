// app/admin/layout.js
import Link from "next/link";

export const metadata = {
  title: "SlimIQ · Super Admin",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <div className="admin-shell">
          {/* Sidebar */}
          <aside className="admin-sidebar">
            <div className="logo">
              <span className="logo-mark">IQ</span>
              <span className="logo-text">SlimIQ</span>
              <span className="logo-sub">Super Admin</span>
            </div>

            <nav className="admin-nav">
              <Link href="/admin" className="nav-item">
                Klinikler
              </Link>
              <Link href="/admin/doctors" className="nav-item nav-item-disabled">
                Doktorlar (yakında)
              </Link>
              <Link href="/admin/patients" className="nav-item nav-item-disabled">
                Hastalar (yakında)
              </Link>
              <Link href="/admin/billing" className="nav-item nav-item-disabled">
                Fiyatlandırma (yakında)
              </Link>
            </nav>

            <div className="admin-footer">
              <Link href="/login" className="nav-item small">
                Çıkış yap
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <main className="admin-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
