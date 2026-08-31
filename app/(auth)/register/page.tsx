"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Error al registrar.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      name,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.error) {
      router.push("/login");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--surface)" }}
    >
      <div className="w-full max-w-sm card raised" style={{ padding: 28 }}>
        <div className="brand" style={{ fontSize: 34, textAlign: "center" }}>
          ENER<span>JIMMY</span>
        </div>
        <p
          className="eyebrow"
          style={{ textAlign: "center", marginTop: 4, marginBottom: 24 }}
        >
          Crea tu cuenta
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="field-label">Nombre</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              autoFocus
            />
          </div>

          <div>
            <label className="field-label">Contraseña</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p style={{ color: "#c0392b", fontSize: 13 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-accent btn-block"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p
          className="ex-meta"
          style={{ textAlign: "center", marginTop: 16 }}
        >
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600 }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
