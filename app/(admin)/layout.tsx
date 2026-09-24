import type { ReactNode } from "react";
import { getSessionUser } from "@/lib/auth";
import { AdminSidebar, AdminTopbar } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  return (
    <div className="sb-shell">
      <AdminSidebar username={user.username} />
      <main className="sb-main">
        <AdminTopbar />
        <div className="sb-content">{children}</div>
      </main>
    </div>
  );
}
