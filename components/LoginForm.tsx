"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <>
      <div className="text-center mb-4">
        <h1 className="h4 mb-1">Sign in to your store</h1>
        <p className="text-muted small mb-0">Enter your merchant username and password</p>
      </div>

      {state.error && (
        <div className="sb-alert sb-alert-danger mb-3 p-2 small" role="alert">
          <span>{state.error}</span>
        </div>
      )}

      <form action={formAction}>
        <div className="sb-form-group">
          <label htmlFor="id_username" className="sb-label">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="id_username"
            className="sb-input"
            required
            autoFocus
            placeholder="e.g. shopowner"
            autoComplete="username"
          />
        </div>

        <div className="sb-form-group">
          <label htmlFor="id_password" className="sb-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="id_password"
            className="sb-input"
            required
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={pending} className="sb-btn sb-btn-primary w-100 mt-2 mb-3">
          Sign In
        </button>
      </form>

      <div className="p-3 bg-light border rounded small mb-3 text-muted">
        <div className="fw-semibold text-dark mb-1">Administrator Demo Account:</div>
        <div>
          Username: <code>admin</code>
        </div>
        <div>
          Password: <code>admin123</code>
        </div>
      </div>

      <div className="text-center text-muted small">
        Don&apos;t have a shop account?{" "}
        <Link href="/register" className="text-dark fw-semibold text-decoration-none">
          Register here
        </Link>
      </div>
    </>
  );
}
