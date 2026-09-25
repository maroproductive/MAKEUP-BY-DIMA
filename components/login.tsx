"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export function Login({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <main className="login-page">
      <Link href="/" className="wordmark">
        <span>Makeup by Dima</span>
        <small>THE ARTIST’S STUDIO</small>
      </Link>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const data = new FormData(e.currentTarget);
          try {
            const response = await fetch("/api/auth", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(Object.fromEntries(data)),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to sign in");
            setBusy(false);
          }
        }}
      >
        <p className="eyebrow">WELCOME BACK</p>
        <h1>Your beauty studio.</h1>
        <p>Sign in to manage your website.</p>
        {!configured && (
          <div className="notice">
            Add MongoDB and authentication environment variables, then run the
            seed script to create your admin account. See README.md.
          </div>
        )}
        <label>
          Email
          <input required type="email" name="email" autoComplete="username" />
        </label>
        <label>
          Password
          <input
            required
            type="password"
            name="password"
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p role="alert" className="error-text">
            {error}
          </p>
        )}
        <button className="button" disabled={busy || !configured}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <Link className="text-link" href="/">
        ← Back to website
      </Link>
    </main>
  );
}
