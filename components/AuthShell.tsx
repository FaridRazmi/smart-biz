import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthShell({
  children,
  maxWidth = 420,
}: {
  children: ReactNode;
  maxWidth?: number;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background: "var(--sb-bg)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth,
          background: "var(--sb-surface)",
          border: "1px solid var(--sb-border)",
          borderRadius: "var(--sb-radius-lg)",
          boxShadow: "var(--sb-shadow-sm)",
          padding: "2rem",
        }}
      >
        <Link
          href="/"
          className="d-flex align-items-center justify-content-center gap-2 mb-4 text-decoration-none"
        >
          <div className="sb-brand-mark">SB</div>
          <span className="sb-brand-title">SmartBiz</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
