"use client";

import { useActionState, useState } from "react";
import { createRental, type RentState } from "@/app/actions/rentals";
import { DURATION_LABELS, DURATION_TYPES, type DurationType } from "@/lib/rental";

const initialState: RentState = {};

export default function RecordRentForm({
  product,
}: {
  product: {
    id: number;
    name: string;
    prices: Record<DurationType, number>;
    available: boolean;
    slots: number;
    activeCount: number;
  };
}) {
  const [state, formAction, pending] = useActionState(createRental, initialState);
  const [duration, setDuration] = useState<DurationType>("3h");
  const price = product.prices[duration];

  return (
    <>
      {state.error && (
        <div className="sb-alert sb-alert-danger mb-4 p-2 small" role="alert">
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction}>
        <input type="hidden" name="id" value={product.id} />

        <div className="sb-form-group">
          <label className="sb-label">Tempoh Sewa</label>
          <div className="row g-2">
            {DURATION_TYPES.map((type) => (
              <div className="col-6" key={type}>
                <label
                  className="sb-card p-3 d-block mb-0"
                  style={{
                    cursor: "pointer",
                    borderColor:
                      duration === type ? "var(--sb-border-focus)" : "var(--sb-border)",
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="radio"
                      name="duration_type"
                      value={type}
                      checked={duration === type}
                      onChange={() => setDuration(type)}
                      className="form-check-input mt-0"
                    />
                    <div>
                      <div className="fw-semibold text-dark">{DURATION_LABELS[type]}</div>
                      <div className="small text-muted tabular">
                        RM {product.prices[type].toFixed(2)}
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="sb-form-group">
          <label htmlFor="customer_name" className="sb-label">
            Nama Pelanggan
          </label>
          <input
            type="text"
            name="customer_name"
            id="customer_name"
            className="sb-input"
            required
            placeholder="cth. Ahmad"
          />
        </div>

        <div className="sb-form-group">
          <label htmlFor="customer_phone" className="sb-label">
            No. Telefon (pilihan)
          </label>
          <input
            type="text"
            name="customer_phone"
            id="customer_phone"
            className="sb-input"
            placeholder="cth. 0123456789"
          />
        </div>

        <div className="p-3 bg-light border rounded mb-4 d-flex justify-content-between align-items-center">
          <span className="small fw-semibold text-dark">Jumlah Bayaran</span>
          <span className="fs-4 fw-bold text-success tabular">RM {price.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={pending || !product.available}
          className="sb-btn sb-btn-primary w-100 sb-btn-lg"
        >
          {pending ? "Memproses..." : "Mula Sewa"}
        </button>
      </form>
    </>
  );
}
