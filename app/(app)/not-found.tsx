import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-5 text-center">
      <h2 className="h5 mb-2">Page not found</h2>
      <p className="text-muted small mb-3">
        This record does not exist or was deleted.
      </p>
      <Link href="/dashboard" className="sb-btn sb-btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}
