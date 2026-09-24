import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-5 text-center">
      <h2 className="h5 mb-2">Halaman tidak dijumpai</h2>
      <p className="text-muted small mb-3">
        Rekod ini tiada atau telah dipadam.
      </p>
      <Link href="/dashboard" className="sb-btn sb-btn-primary">
        Ke Dashboard
      </Link>
    </div>
  );
}
