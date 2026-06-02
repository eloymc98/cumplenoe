"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopBar({ sealed }: { sealed: boolean }) {
  const pathname = usePathname();

  const teamTab = sealed
    ? { href: "/sobre", label: "equipo" }
    : { href: "/test", label: "test" };

  const tabs = [
    { href: "/", label: "muro" },
    teamTab,
    { href: "/quiz", label: "quiz" },
    { href: "/ranking", label: "ranking" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/test" || href === "/sobre")
      return pathname === "/test" || pathname === "/sobre";
    return pathname.startsWith(href);
  };

  return (
    <div className="nw-topbar">
      <Link href="/" className="nw-topbar-brand">
        noe&apos;s world
      </Link>
      <div className="nw-tabbar">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={"nw-tab" + (isActive(t.href) ? " on" : "")}
          >
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
