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

export function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const isDashboard = pathname.includes("admin-dashboard");
  const isUsers = pathname.includes("admin-users");

  return (
    <aside className="sb-sidebar">
      <Link href="/admin-dashboard" className="sb-sidebar-brand">
        <div className="sb-brand-mark" style={{ background: "#0284c7" }}>
          AD
        </div>
        <span className="sb-brand-title">ReidBiz</span>
        <span className="sb-brand-badge" style={{ background: "#e0f2fe", color: "#0369a1" }}>
          ADMIN
        </span>
      </Link>

      <div className="sb-sidebar-nav">
        <span className="sb-nav-section-label">Platform Control</span>
        <Link
          href="/admin-dashboard"
          className={`sb-nav-link ${isDashboard ? "active" : ""}`}
        >
          <span className="sb-nav-icon">
            {icon(
              <>
                <rect x="3" y="3" width="7" height="9" />
                <rect x="14" y="3" width="7" height="5" />
                <rect x="14" y="12" width="7" height="9" />
                <rect x="3" y="16" width="7" height="5" />
              </>,
            )}
          </span>
          <span>Admin Overview</span>
        </Link>
        <Link href="/admin-users" className={`sb-nav-link ${isUsers ? "active" : ""}`}>
          <span className="sb-nav-icon">
            {icon(
              <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </>,
            )}
          </span>
          <span>Merchant Accounts</span>
        </Link>

        <span className="sb-nav-section-label" style={{ marginTop: "1.5rem" }}>
          Quick Switch
        </span>
        <Link href="/dashboard" className="sb-nav-link">
          <span className="sb-nav-icon">
            {icon(
              <>
                <polyline points="9 14 4 9 9 4" />
                <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
              </>,
            )}
          </span>
          <span>Back to Shop View</span>
        </Link>
      </div>

      <div className="sb-sidebar-footer">
        <div className="sb-user-info">
          <div className="sb-user-name">{username}</div>
          <div className="sb-user-role">Superuser / Staff</div>
        </div>
      </div>
    </aside>
  );
}

export function AdminStatusFilter({ status, count }: { status: string; count: number }) {
  return (
    <form method="GET" className="d-flex align-items-center gap-3">
      <label className="small text-muted fw-semibold text-nowrap">Filter Status:</label>
      <select
        name="status"
        className="sb-select py-1"
        style={{ maxWidth: "200px" }}
        defaultValue={status}
        onChange={(event) => event.currentTarget.form?.submit()}
      >
        <option value="all">All Accounts ({count})</option>
        <option value="active">Active Only</option>
        <option value="inactive">Inactive / Deactivated Only</option>
      </select>
    </form>
  );
}

export function AdminTopbar() {
  return (
    <header className="sb-topbar">
      <div className="sb-topbar-left">
        <span className="badge bg-secondary-subtle text-secondary border px-2 py-1">
          Platform Admin Console
        </span>
      </div>
      <div className="sb-topbar-right">
        <Link href="/dashboard" className="sb-btn sb-btn-secondary sb-btn-sm">
          Switch to Store
        </Link>
      </div>
    </header>
  );
}
