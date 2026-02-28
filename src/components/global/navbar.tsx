"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { authClient } from "@/server/better-auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
      <nav className="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/20 backdrop-blur-xl">
        {/* ── desktop row ──────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 px-4 py-2.5">
          {/* brand */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-105 overflow-hidden">
              <span
                className="font-serif text-primary-foreground font-black leading-none select-none"
                style={{
                  fontSize: "1.1rem",
                  transform: "skewX(-8deg) skewY(-4deg)",
                  display: "inline-block",
                  letterSpacing: "-0.05em",
                }}
              >
                ✳
              </span>
            </div>
            <span className="text-sm font-serif font-semibold text-zinc-50">
              StudyRot
            </span>
          </Link>

          {/* nav links — desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {navigation.map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
              >
                {nav.label}
              </Link>
            ))}
          </div>

          {/* right side */}
          <div className="flex items-center gap-2">
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 px-3 py-1.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700/80"
              >
                <Avatar className="h-5 w-5">
                  <AvatarImage src={session.user?.image ?? ""} />
                  <AvatarFallback className="bg-primary text-[9px] font-semibold text-primary-foreground">
                    {session.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth"
                className="hidden rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-1.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700/80 md:block"
              >
                Sign in
              </Link>
            )}

            {/* hamburger — mobile only */}
            <button
              onClick={() => setIsOpen((o) => !o)}
              className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50 md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* ── mobile menu ───────────────────────────────────────── */}
        <div
          className={cn(
            "overflow-hidden border-t border-zinc-800 transition-all duration-300 ease-in-out md:hidden",
            isOpen
              ? "max-h-64 opacity-100"
              : "max-h-0 opacity-0 border-transparent",
          )}
        >
          <div className="flex flex-col gap-1 p-3">
            {navigation.map((nav) => (
              <Link
                key={nav.href}
                href={nav.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
              >
                {nav.label}
              </Link>
            ))}
            {!session && (
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="mt-1 rounded-lg border border-zinc-700 px-3 py-2 text-center text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
