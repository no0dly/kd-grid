"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { navClass } from "@/components/app/navClass";

type AppHeaderProps = {
  variant: "light" | "dark";
  children?: ReactNode;
};

export function AppHeader({ variant, children }: AppHeaderProps) {
  const pathname = usePathname();
  const isSheet = pathname === "/";
  const isGear = pathname.startsWith("/survivors");
  const isDark = variant === "dark";

  return (
    <header
      className={
        isDark
          ? "flex flex-wrap items-center gap-3 border-b border-[#2d2d2d] bg-[#141414]/95 px-4 py-3 text-[#e8e4d9] backdrop-blur"
          : "flex flex-wrap items-center gap-3 border-b border-[#d0d8d5] bg-[#f3f6f5]/90 px-4 py-3 text-[#14201c] backdrop-blur"
      }
    >
      <h1
        className={
          isDark
            ? "text-lg font-semibold tracking-[0.28em] text-[#c8b273]"
            : "text-lg font-semibold tracking-tight text-[#0a4b47]"
        }
      >
        KD GRID
      </h1>
      <nav className="flex items-center gap-1 text-sm">
        <Link
          href="/"
          className={navClass(isSheet, isDark)}
          aria-current={isSheet ? "page" : undefined}
        >
          Sheet
        </Link>
        <Link
          href="/survivors"
          className={navClass(isGear, isDark)}
          aria-current={isGear ? "page" : undefined}
        >
          Gear Grid
        </Link>
      </nav>
      <div className="ml-auto flex flex-wrap items-center gap-2">{children}</div>
    </header>
  );
}
