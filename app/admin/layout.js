"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaHospitalAlt,
  FaUserMd,
  FaUsers,
  FaMoneyBillWave,
  FaCog,
  FaBell,
} from "react-icons/fa";

const navItems = [
  { href: "/admin", icon: FaHome, label: "Dashboard", disabled: false },
  { href: "/admin/clinics", icon: FaHospitalAlt, label: "Klinikler", disabled: false },
  { href: "/admin/doctors", icon: FaUserMd, label: "Doktorlar" }, // ⬅️ BU
  { href: "/admin/billing", icon: FaMoneyBillWave, label: "Fiyatlandırma", disabled: false },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-shell">
      {/* LEFT SIDEBAR */}
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-sidebar-top">
          <div className="admin-logo-main">
            <div className="admin-logo-icon">IQ</div>
            {!collapsed && <span className="admin-logo-name">SlimIQ</span>}
          </div>

          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={() => setCollapsed((v) => !v)}
          >
            ☰
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.disabled ? "#" : item.href}
                className={`admin-nav-link ${active ? "active" : ""} ${
                  item.disabled ? "disabled" : ""
                }`}
              >
                <div className="admin-nav-left">
                  <Icon className="admin-nav-icon" />
                  {!collapsed && (
                    <span className="admin-nav-label">{item.label}</span>
                  )}
                </div>
                {item.disabled && !collapsed && (
                  <span className="admin-nav-pill">yakında</span>
                )}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="admin-sidebar-bottom">
            <div className="admin-help-card">
              <p>Yardıma mı ihtiyacın var?</p>
              <Link href="/admin/support" className="admin-help-link">
                Support
              </Link>
            </div>
            <Link href="/admin/settings" className="admin-nav-link settings-link">
              <FaCog className="admin-nav-icon" />
              <span className="admin-nav-label">Ayarlar</span>
            </Link>
          </div>
        )}
      </aside>

      {/* RIGHT MAIN AREA */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h1 className="admin-top-title">SlimIQ Tüp Mide Platformu</h1>
            <span className="admin-top-sub">
              Tüm klinik, doktor ve hasta akışını tek panelden yönet.
            </span>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-top-role-pill">Super Admin</div>

            <button type="button" className="icon-button">
              <FaBell />
              <span className="dot" />
            </button>

            <div className="admin-top-user">
              <div className="avatar">SA</div>
              <div className="info">
                <div className="name">Gökhan</div>
                <div className="role">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
