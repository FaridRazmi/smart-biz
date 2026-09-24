import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { rm, toNumber } from "@/lib/format";
import { DURATION_LABELS, isDurationType } from "@/lib/rental";
import PrintButton from "@/components/PrintButton";

export const metadata = { title: "Resit Pendapatan Bulanan — SmartBiz" };
export const dynamic = "force-dynamic";

function formatDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

function durationLabel(type: string) {
  return isDurationType(type) ? DURATION_LABELS[type] : type;
}

export default async function MonthlyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const user = await getSessionUser();

  const { month = "" } = await searchParams;
  const now = new Date();
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  const year = match ? Number(match[1]) : now.getFullYear();
  const monthIndex = match ? Number(match[2]) - 1 : now.getMonth();

  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 1);
  const monthValue = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
  const monthLabel = start.toLocaleDateString("en-MY", { month: "long", year: "numeric" });

  const [rentals, sales] = await Promise.all([
    prisma.rental.findMany({
      where: { userId: user.id, startAt: { gte: start, lt: end } },
      include: { product: { select: { name: true } } },
      orderBy: { startAt: "asc" },
    }),
    prisma.sale.findMany({
      where: { userId: user.id, createdAt: { gte: start, lt: end } },
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const rentalRevenue = rentals.reduce((sum, rental) => sum + toNumber(rental.price), 0);
  const salesRevenue = sales.reduce((sum, sale) => sum + toNumber(sale.totalPrice), 0);
  const totalRevenue = rentalRevenue + salesRevenue;
  const promoDiscount = rentals.reduce(
    (sum, rental) =>
      sum +
      (rental.isPromo && rental.originalPrice != null
        ? toNumber(rental.originalPrice) - toNumber(rental.price)
        : 0),
    0,
  );

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 8mm; }
          .sb-sidebar, .sb-topbar, .sb-mobile-bottom-bar, .no-print { display: none !important; }
          .sb-main { margin-left: 0 !important; }
          .sb-content { padding: 0 !important; max-width: 100% !important; }
          body { background: #fff !important; }
          .receipt-print { max-width: 260px; margin: 0 auto; font-size: 11px; line-height: 1.35; }
          .receipt-print table { border-collapse: collapse; }
          .receipt-print table td { padding: 2px 0; }
        }
      `}</style>

      <div className="d-none d-print-block receipt-print">
        <div className="text-center mb-2">
          <div className="fw-bold">{user.username}&apos;s Shop</div>
          <div>Resit Pendapatan — {monthLabel}</div>
          <div className="text-muted">Dijana {formatDateTime(now)}</div>
        </div>
        <table className="w-100">
          <tbody>
            <tr>
              <td>Sewaan ({rentals.length})</td>
              <td className="text-end">{rm(rentalRevenue)}</td>
            </tr>
            <tr>
              <td>Jualan ({sales.length})</td>
              <td className="text-end">{rm(salesRevenue)}</td>
            </tr>
            <tr>
              <td>Diskaun Promo</td>
              <td className="text-end">{rm(promoDiscount)}</td>
            </tr>
            <tr className="fw-bold">
              <td>Jumlah Pendapatan</td>
              <td className="text-end">{rm(totalRevenue)}</td>
            </tr>
          </tbody>
        </table>
        <div className="text-center mt-2">— Terima kasih —</div>
      </div>

      <div className="d-print-none">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Resit Pendapatan Bulanan</h1>
          <p className="text-muted small mb-0">
            {user.username}&apos;s Shop · {monthLabel}
          </p>
        </div>
        <div className="d-flex align-items-center gap-2 no-print">
          <form method="GET" action="/reports/monthly" className="d-flex align-items-center gap-2">
            <input
              type="month"
              name="month"
              defaultValue={monthValue}
              className="sb-input py-1"
              style={{ maxWidth: 180 }}
            />
            <button type="submit" className="sb-btn sb-btn-secondary">
              Lihat
            </button>
          </form>
          <PrintButton />
        </div>
      </div>

      <div className="sb-card mb-4">
        <div className="sb-card-body p-4">
          <div className="d-flex flex-wrap justify-content-between gap-3 mb-4 pb-3 border-bottom">
            <div>
              <div className="fw-bold text-dark fs-5">SmartBiz — Penyata Pendapatan</div>
              <div className="text-muted small">
                Bulan: {monthLabel} · Dijana pada {formatDateTime(now)}
              </div>
            </div>
            <div className="text-end">
              <div className="sb-stat-label mb-0">Jumlah Pendapatan</div>
              <div className="sb-stat-value text-success tabular">{rm(totalRevenue)}</div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-sm-4">
              <div className="p-3 border rounded h-100">
                <div className="small text-muted">Pendapatan Sewaan</div>
                <div className="fw-bold text-dark tabular fs-5">{rm(rentalRevenue)}</div>
                <div className="small text-muted">{rentals.length} transaksi sewa</div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="p-3 border rounded h-100">
                <div className="small text-muted">Pendapatan Jualan</div>
                <div className="fw-bold text-dark tabular fs-5">{rm(salesRevenue)}</div>
                <div className="small text-muted">{sales.length} transaksi jualan</div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="p-3 border rounded h-100">
                <div className="small text-muted">Jumlah Diskaun Promo</div>
                <div className="fw-bold text-dark tabular fs-5">{rm(promoDiscount)}</div>
                <div className="small text-muted">Nilai promo diberi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sb-card mb-4">
        <div className="sb-card-header">
          <h2 className="sb-card-title">Butiran Sewaan</h2>
          <span className="badge bg-dark text-white tabular">{rentals.length} rekod</span>
        </div>
        <div className="sb-card-body p-0">
          {rentals.length > 0 ? (
            <div className="sb-table-responsive">
              <table className="sb-table">
                <thead>
                  <tr>
                    <th>Tarikh</th>
                    <th>Item</th>
                    <th>Pelanggan</th>
                    <th>Tempoh</th>
                    <th className="col-right">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map((rental) => (
                    <tr key={rental.id}>
                      <td className="text-muted small tabular">{formatDateTime(rental.startAt)}</td>
                      <td className="fw-semibold text-dark">{rental.product.name}</td>
                      <td className="text-muted">{rental.customerName}</td>
                      <td>
                        <span className="sb-badge sb-badge-neutral">
                          {durationLabel(rental.durationType)}
                        </span>
                        {rental.isPromo && (
                          <span className="sb-badge sb-badge-low-stock ms-1">Promo</span>
                        )}
                      </td>
                      <td className="col-right tabular fw-bold text-dark">
                        {rm(rental.price)}
                        {rental.isPromo && rental.originalPrice != null && (
                          <span
                            className="text-muted small d-block"
                            style={{ textDecoration: "line-through" }}
                          >
                            {rm(rental.originalPrice)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="fw-semibold text-dark">
                      Jumlah Sewaan
                    </td>
                    <td className="col-right tabular fw-bold text-success">{rm(rentalRevenue)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-muted small">Tiada sewaan pada bulan ini.</div>
          )}
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-card-header">
          <h2 className="sb-card-title">Butiran Jualan</h2>
          <span className="badge bg-dark text-white tabular">{sales.length} rekod</span>
        </div>
        <div className="sb-card-body p-0">
          {sales.length > 0 ? (
            <div className="sb-table-responsive">
              <table className="sb-table">
                <thead>
                  <tr>
                    <th>Tarikh</th>
                    <th>Item</th>
                    <th className="col-center">Kuantiti</th>
                    <th className="col-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="text-muted small tabular">{formatDateTime(sale.createdAt)}</td>
                      <td className="fw-semibold text-dark">{sale.product.name}</td>
                      <td className="col-center tabular">{sale.quantitySold}</td>
                      <td className="col-right tabular fw-bold text-dark">
                        {rm(sale.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="fw-semibold text-dark">
                      Jumlah Jualan
                    </td>
                    <td className="col-right tabular fw-bold text-success">{rm(salesRevenue)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-muted small">Tiada jualan pada bulan ini.</div>
          )}
        </div>
      </div>

      <div className="text-center text-muted small mt-4 no-print">
        <Link href="/rentals" className="text-decoration-none text-muted">
          ← Kembali ke Sewaan
        </Link>
      </div>
      </div>
    </>
  );
}
