"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// useSearchParams() (needed to read ?callbackUrl=... for shared-routine
// links — see the share flow) opts a page out of static prerendering
// unless it's wrapped in Suspense, so the actual form lives in LoginForm
// and this default export just supplies that boundary.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Only ever follow a same-site relative path (e.g. a shared-routine
  // link) — never an absolute/external URL, so this can't be turned into
  // an open redirect.
  const rawCallbackUrl = searchParams.get("callbackUrl") ?? "/";
  const callbackUrl = rawCallbackUrl.startsWith("/") ? rawCallbackUrl : "/";
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      name,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Nombre o contraseña incorrectos.");
      return;
    }

    router.push(callbackUrl);
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
          Inicia sesión para continuar
        </p>
        <p
          className="ex-meta"
          style={{ textAlign: "center", marginTop: -12, marginBottom: 20 }}
        >
          ¿Primera vez con contraseña? Escribe la que quieras usar a partir
          de ahora.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="field-label">Nombre</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
              autoComplete="current-password"
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
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p
          className="ex-meta"
          style={{ textAlign: "center", marginTop: 16 }}
        >
          ¿No tienes cuenta?{" "}
          <Link
            href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
