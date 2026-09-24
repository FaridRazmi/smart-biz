import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const metadata = { title: "Welcome to SmartBiz — Getting Started" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const hasProducts = await prisma.product.count({ where: { userId: user.id } });
  if (hasProducts > 0) redirect("/dashboard");

  return (
    <div className="py-4" style={{ maxWidth: 680, margin: "0 auto" }}>
      <div className="sb-card p-4 p-md-5">
        <div className="text-center mb-4">
          <div
            className="sb-brand-mark mx-auto mb-3"
            style={{ width: 48, height: 48, fontSize: "1.25rem" }}
          >
            SB
          </div>
          <h1 className="h3 mb-2">Welcome to SmartBiz, {user.username}!</h1>
          <p className="text-muted">
            Your sales ledger is ready. Let&apos;s get your store set up in two quick steps.
          </p>
        </div>

        <div className="row g-3 my-4">
          <div className="col-md-6">
            <div className="p-3 border rounded h-100 bg-light">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span
                  className="badge bg-dark text-white rounded-circle"
                  style={{
                    width: 24,
                    height: 24,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  1
                </span>
                <h4 className="h6 mb-0 fw-bold">Stock Your Shelves</h4>
              </div>
              <p className="text-muted small mb-0">
                Add your product names, how many units you have, your wholesale buying
                cost, and your selling price.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-3 border rounded h-100 bg-light">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span
                  className="badge bg-dark text-white rounded-circle"
                  style={{
                    width: 24,
                    height: 24,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  2
                </span>
                <h4 className="h6 mb-0 fw-bold">Record Daily Sales</h4>
              </div>
              <p className="text-muted small mb-0">
                Whenever a customer buys, log the quantity in two taps. The ledger
                automatically calculates revenue and alerts you when stock is low.
              </p>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
          <Link
            href="/products/new"
            className="sb-btn sb-btn-primary sb-btn-lg flex-grow-1 text-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            Add Your First Product
          </Link>
          <Link href="/dashboard" className="sb-btn sb-btn-secondary sb-btn-lg text-center">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
