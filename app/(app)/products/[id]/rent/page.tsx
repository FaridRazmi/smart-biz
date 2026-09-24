import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { rentalPrices, toLocalInputValue } from "@/lib/rental";
import RecordRentForm from "@/components/RecordRentForm";

export const metadata = { title: "Sewa Item | ReidBiz" };
export const dynamic = "force-dynamic";

export default async function RentProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: { id: Number(id), userId: user.id },
  });
  if (!product || !product.isRentable) notFound();

  const slots = Math.max(product.quantity, 1);
  const activeCount = await prisma.rental.count({
    where: { productId: product.id, status: "active", endAt: { gt: new Date() } },
  });
  const available = activeCount < slots;

  return (
    <div className="py-2" style={{ maxWidth: 640, margin: "0 auto" }}>
      <div className="mb-3">
        <Link
          href="/products"
          className="text-decoration-none text-muted small d-inline-flex align-items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Inventory Catalog
        </Link>
      </div>

      <div className="sb-card">
        <div className="sb-card-header">
          <div>
            <h1 className="h5 mb-0">Sewa: {product.name}</h1>
            <span className="text-muted small">
              Pilih tempoh dan simpan maklumat pelanggan
            </span>
          </div>
          {available ? (
            <span className="sb-badge sb-badge-in-stock">Tersedia</span>
          ) : (
            <span className="sb-badge sb-badge-out-of-stock">Sedang Disewa</span>
          )}
        </div>

        <div className="sb-card-body p-4">
          {!available && (
            <div className="sb-alert sb-alert-warning mb-4">
              <span>
                Item ini sedang disewa ({activeCount}/{slots} slot). Tamatkan sewa semasa
                sebelum mula sewaan baru.
              </span>
              <Link href="/rentals" className="sb-btn sb-btn-secondary sb-btn-sm">
                Lihat Sewaan
              </Link>
            </div>
          )}

          <RecordRentForm
            product={{
              id: product.id,
              name: product.name,
              prices: rentalPrices(product),
              available,
              slots,
              activeCount,
            }}
            defaultStartAt={toLocalInputValue(new Date())}
          />
        </div>
      </div>
    </div>
  );
}
