"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = {};

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <>
      <div className="text-center mb-4">
        <h1 className="h4 mb-1">Create your store account</h1>
        <p className="text-muted small mb-0">
          Start recording daily sales and inventory in seconds
        </p>
      </div>

      {state.error && (
        <div className="sb-alert sb-alert-danger mb-3 p-2 small" role="alert">
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction}>
        <div className="sb-form-group">
          <label htmlFor="username" className="sb-label">
            Shop / Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            className="sb-input"
            required
            autoFocus
            placeholder="e.g. nairobibiz"
          />
          <div className="sb-input-hint">Your unique store identifier</div>
        </div>

        <div className="sb-form-group">
          <label htmlFor="email" className="sb-label">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="sb-input"
            placeholder="e.g. store@example.com"
          />
        </div>

        <div className="sb-form-group">
          <label htmlFor="password1" className="sb-label">
            Create Password
          </label>
          <input
            type="password"
            name="password1"
            id="password1"
            className="sb-input"
            required
            placeholder="At least 6 characters"
          />
        </div>

        <div className="sb-form-group">
          <label htmlFor="password2" className="sb-label">
            Confirm Password
          </label>
          <input
            type="password"
            name="password2"
            id="password2"
            className="sb-input"
            required
            placeholder="Repeat password"
          />
        </div>

        <button type="submit" disabled={pending} className="sb-btn sb-btn-primary w-100 mt-2 mb-3">
          Create Account &amp; Open Ledger
        </button>
      </form>

      <div className="text-center text-muted small">
        Already have a store account?{" "}
        <Link href="/login" className="text-dark fw-semibold text-decoration-none">
          Sign in here
        </Link>
      </div>
    </>
  );
}
