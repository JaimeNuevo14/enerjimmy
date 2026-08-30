"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const tabs = [
  {
    href: "/",
    label: "Hoy",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 21V9l8-6 8 6v12h-5v-7H9v7z" />
      </svg>
    ),
  },
  {
    href: "/exercises",
    label: "Ejercicios",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    ),
  },
  {
    href: "/routines",
    label: "Rutinas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 6h16M4 12h16M4 18h10" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "Historial",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19h16M7 19V9m5 10V5m5 14v-7" />
      </svg>
    ),
  },
];

export function TopBar() {
  const { data: session } = useSession();
  const initial = session?.user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="topbar">
      <div className="brand">
        ENER<span>JIMMY</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs font-semibold"
          style={{ color: "var(--ink-faint)" }}
          title="Cerrar sesión"
        >
          Salir
        </button>
        <div className="avatar">{initial}</div>
      </div>
    </div>
  );
}

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="tabbar">
      {tabs.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`tab ${active ? "active" : ""}`}
          >
            {t.icon}
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function NavBar() {
  return (
    <>
      <TopBar />
      <TabBar />
    </>
  );
}
