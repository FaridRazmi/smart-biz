import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { rm, toNumber } from "@/lib/format";
import { DURATION_LABELS, formatRemaining, isDurationType } from "@/lib/rental";
import { deleteRental, endRental } from "@/app/actions/rentals";

export const metadata = { title: "Sewaan | ReidBiz" };
export const dynamic = "force-dynamic";

function durationLabel(type: string) {
  return isDurationType(type) ? DURATION_LABELS[type] : type;
}

function formatDateTime(date: Date) {
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month} ${day}, ${hours}:${minutes}`;
}

export default async function RentalsPage() {
  const user = await getSessionUser();
  const now = new Date();

  const rentals = await prisma.rental.findMany({
    where: { userId: user.id },
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const isActive = (rental: (typeof rentals)[number]) =>
    rental.status === "active" && rental.endAt > now;

  const active = rentals.filter(isActive);
  const past = rentals.filter((rental) => !isActive(rental));

  const activeRevenue = active.reduce((sum, rental) => sum + toNumber(rental.price), 0);
  const totalRevenue = rentals.reduce((sum, rental) => sum + toNumber(rental.price), 0);

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Sewaan Aktif &amp; Sejarah</h1>
          <p className="text-muted small mb-0">
            Pantau slot yang sedang disewa, baki masa, dan rekod sewa lampau.
          </p>
        </div>
        <Link href="/products" className="sb-btn sb-btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>Sewa Item Baru</span>
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="sb-stat-card p-3">
            <span className="sb-stat-label">Sedang Disewa</span>
            <div className="sb-stat-value tabular fs-4">{active.length} Slot</div>
            <span className="sb-stat-meta">Aktif sekarang</span>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="sb-stat-card p-3">
            <span className="sb-stat-label">Nilai Sewaan Aktif</span>
            <div className="sb-stat-value tabular text-success fs-4">{rm(activeRevenue)}</div>
            <span className="sb-stat-meta positive">Belum tamat</span>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="sb-stat-card p-3">
            <span className="sb-stat-label">Jumlah Pendapatan Sewa</span>
            <div className="sb-stat-value tabular fs-4">{rm(totalRevenue)}</div>
            <span className="sb-stat-meta">{rentals.length} rekod</span>
          </div>
        </div>
      </div>

      <div className="sb-card mb-4">
        <div className="sb-card-header">
          <h2 className="sb-card-title">Sewaan Aktif</h2>
          <span className="badge bg-dark text-white tabular">{active.length} aktif</span>
        </div>
        <div className="sb-card-body p-0">
          {active.length > 0 ? (
            <div className="sb-table-responsive">
              <table className="sb-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Pelanggan</th>
                    <th>Tempoh</th>
                    <th>Mula</th>
                    <th>Tamat</th>
                    <th className="col-center">Baki</th>
                    <th className="col-right">Harga</th>
                    <th className="col-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {active.map((rental) => (
                    <tr key={rental.id}>
                      <td data-label="Item" className="fw-semibold text-dark">{rental.product.name}</td>
                      <td data-label="Pelanggan">
                        <div className="fw-semibold text-dark">{rental.customerName}</div>
                        {rental.customerPhone && (
                          <span className="text-muted small">{rental.customerPhone}</span>
                        )}
                      </td>
                      <td data-label="Tempoh">
                        <span className="sb-badge sb-badge-neutral">
                          {durationLabel(rental.durationType)}
                        </span>
                        {rental.isPromo && (
                          <span className="sb-badge sb-badge-low-stock ms-1">Promo</span>
                        )}
                      </td>
                      <td data-label="Mula" className="text-muted small tabular">
                        {formatDateTime(rental.startAt)}
                      </td>
                      <td data-label="Tamat" className="text-muted small tabular">{formatDateTime(rental.endAt)}</td>
                      <td data-label="Baki" className="col-center tabular fw-semibold text-dark">
                        {formatRemaining(rental.endAt, now)}
                      </td>
                      <td data-label="Harga" className="col-right tabular fw-bold text-success">
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
                      <td data-label="Tindakan" className="col-right">
                        <form method="POST" action={endRental} className="m-0">
                          <input type="hidden" name="id" value={rental.id} />
                          <button type="submit" className="sb-btn sb-btn-secondary sb-btn-sm py-1 px-2">
                            Tamatkan
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-muted small">
              <p className="mb-2">Tiada sewaan aktif sekarang.</p>
              <Link href="/products" className="sb-btn sb-btn-secondary sb-btn-sm">
                Mula sewa item
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="sb-card">
        <div className="sb-card-header">
          <h2 className="sb-card-title">Sejarah Sewaan</h2>
          <span className="text-muted small">Rekod lampau</span>
        </div>
        <div className="sb-card-body p-0">
          {past.length > 0 ? (
            <div className="sb-table-responsive">
              <table className="sb-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Pelanggan</th>
                    <th>Tempoh</th>
                    <th>Mula</th>
                    <th>Tamat</th>
                    <th className="col-right">Harga</th>
                    <th className="col-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {past.map((rental) => (
                    <tr key={rental.id}>
                      <td data-label="Item" className="fw-semibold text-dark">{rental.product.name}</td>
                      <td data-label="Pelanggan" className="text-muted">{rental.customerName}</td>
                      <td data-label="Tempoh">
                        <span className="sb-badge sb-badge-neutral">
                          {durationLabel(rental.durationType)}
                        </span>
                        {rental.isPromo && (
                          <span className="sb-badge sb-badge-low-stock ms-1">Promo</span>
                        )}
                      </td>
                      <td data-label="Mula" className="text-muted small tabular">
                        {formatDateTime(rental.startAt)}
                      </td>
                      <td data-label="Tamat" className="text-muted small tabular">{formatDateTime(rental.endAt)}</td>
                      <td data-label="Harga" className="col-right tabular fw-bold text-dark">
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
                      <td data-label="Tindakan" className="col-right">
                        <form method="POST" action={deleteRental} className="m-0">
                          <input type="hidden" name="id" value={rental.id} />
                          <button
                            type="submit"
                            className="sb-btn sb-btn-outline-danger sb-btn-sm py-1 px-2"
                            title="Padam rekod sewa ini"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-muted small">Tiada rekod sewaan lampau.</div>
          )}
        </div>
      </div>
    </>
  );
}
