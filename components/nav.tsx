"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function icon(children: ReactNode, viewBox = "0 0 24 24") {
  return (
    <svg
      width="18"
      height="18"
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function Sidebar({ username, isStaff }: { username: string; isStaff: boolean }) {
  const pathname = usePathname();
  const isProducts = pathname.startsWith("/products");
  const isNew = pathname.startsWith("/products/new");

  const link = (href: string, active: boolean, iconNode: ReactNode, label: string) => (
    <Link href={href} className={`sb-nav-link ${active ? "active" : ""}`}>
      <span className="sb-nav-icon">{iconNode}</span>
      <span>{label}</span>
    </Link>
  );

  return (
    <aside className="sb-sidebar">
      <Link href="/dashboard" className="sb-sidebar-brand">
        <div className="sb-brand-mark">SB</div>
        <span className="sb-brand-title">SmartBiz</span>
        {isStaff && <span className="sb-brand-badge">ADMIN</span>}
      </Link>

      <div className="sb-sidebar-nav">
        <span className="sb-nav-section-label">Operations</span>
        {link(
          "/dashboard",
          pathname === "/dashboard",
          icon(
            <>
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </>,
          ),
          "Dashboard",
        )}
        {link(
          "/products",
          isProducts && !isNew,
          icon(
            <>
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
              <path d="m3.3 7 8.7 5 8.7-5" />
              <path d="M12 22V12" />
            </>,
          ),
          "Inventory",
        )}
        {link(
          "/products/new",
          isNew,
          icon(
            <>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </>,
          ),
          "Add Product",
        )}
        {link(
          "/sales/history",
          pathname.startsWith("/sales/history"),
          icon(<path d="M12 20v-6M6 20V10M18 20V4" />),
          "Sales Ledger",
        )}
        {link(
          "/rentals",
          pathname.startsWith("/rentals"),
          icon(
            <>
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15.5 14" />
            </>,
          ),
          "Sewaan",
        )}

        {isStaff && (
          <>
            <span className="sb-nav-section-label" style={{ marginTop: "1rem" }}>
              Management
            </span>
            {link(
              "/admin-dashboard",
              pathname.startsWith("/admin"),
              icon(
                <>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </>,
              ),
              "Admin Panel",
            )}
          </>
        )}
      </div>

      <div className="sb-sidebar-footer">
        <div className="sb-user-info">
          <div className="sb-user-name">{username}</div>
          <div className="sb-user-role">Shop Manager</div>
        </div>
      </div>
    </aside>
  );
}

export function Topbar({ username }: { username: string }) {
  return (
    <header className="sb-topbar">
      <div className="sb-topbar-left">
        <Link
          href="/dashboard"
          className="d-lg-none text-decoration-none text-dark d-flex align-items-center gap-2"
        >
          <div className="sb-brand-mark">SB</div>
          <span className="fw-bold fs-6">SmartBiz</span>
        </Link>
        <span className="d-none d-lg-inline text-muted small">
          Store: <strong className="text-dark">{username}&apos;s Shop</strong>
        </span>
      </div>
    </header>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const isProducts = pathname.startsWith("/products");
  const isNew = pathname.startsWith("/products/new");

  return (
    <nav className="sb-mobile-bottom-bar" aria-label="Mobile Navigation">
      <Link
        href="/dashboard"
        className={`sb-mobile-tab ${pathname === "/dashboard" ? "active" : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
        <span>Overview</span>
      </Link>
      <Link
        href="/products"
        className={`sb-mobile-tab ${isProducts && !isNew ? "active" : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        </svg>
        <span>Stock</span>
      </Link>
      <Link href="/products" className="sb-mobile-tab text-dark fw-bold">
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#0f172a",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <span style={{ color: "#0f172a" }}>Sale</span>
      </Link>
      <Link
        href="/sales/history"
        className={`sb-mobile-tab ${pathname.startsWith("/sales/history") ? "active" : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20v-6M6 20V10M18 20V4" />
        </svg>
        <span>Ledger</span>
      </Link>
      <Link
        href="/rentals"
        className={`sb-mobile-tab ${pathname.startsWith("/rentals") ? "active" : ""}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <polyline points="12 7 12 12 15.5 14" />
        </svg>
        <span>Sewa</span>
      </Link>
      <Link href="/products/new" className={`sb-mobile-tab ${isNew ? "active" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
        <span>Add Item</span>
      </Link>
    </nav>
  );
}
