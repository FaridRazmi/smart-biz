"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-5 text-center">
      <h2 className="h5 mb-2">Gagal memuatkan halaman ini</h2>
      <p className="text-muted small mb-3">
        Cuba semula. Kalau masih gagal, kembali ke dashboard.
      </p>
      <div className="d-flex justify-content-center gap-2">
        <button type="button" className="sb-btn sb-btn-primary" onClick={() => reset()}>
          Cuba Semula
        </button>
        <Link href="/dashboard" className="sb-btn sb-btn-secondary">
          Ke Dashboard
        </Link>
      </div>
    </div>
  );
}
