"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { CaretDown, SignOut, SquaresFour, Receipt, UserCircle } from "@phosphor-icons/react";
import { useAuth } from "@/hooks/useAuth";

const itemClass =
  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors duration-150";

export default function UserMenu() {
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointer(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // Avoid flash
  if (!ready) return <span aria-hidden className="h-10 w-10 shrink-0 sm:w-32" />;

  if (!user) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/login"
          className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-ink transition-colors duration-150 hover:bg-sunken sm:px-3"
        >
          <UserCircle size={22} className="sm:hidden" aria-hidden />
          <span className="sr-only sm:not-sr-only">Log in</span>
        </Link>
        <Link
          href="/register"
          className="hidden h-10 items-center rounded-lg border border-accent px-4 text-sm font-semibold text-accent transition-colors duration-150 hover:bg-accent-soft sm:inline-flex"
        >
          Register
        </Link>
      </div>
    );
  }

  function handleLogout() {
    setOpen(false);
    logout();
    toast.success("You are logged out.");
  }

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="user-menu"
        className="flex h-10 items-center gap-2 rounded-lg px-1.5 text-sm text-ink transition-colors duration-150 hover:bg-sunken sm:px-2"
      >
        <span
          aria-hidden
          className="grid size-8 place-items-center rounded-full bg-accent-soft text-sm font-bold text-on-accent-soft uppercase"
        >
          {user.username.charAt(0)}
        </span>
        <span data-testid="header-username" className="hidden max-w-[12ch] truncate font-semibold sm:block">
          {user.username}
        </span>
        <span className="sr-only sm:hidden">Account menu for {user.username}</span>
        <CaretDown size={14} className="hidden text-subtle sm:block" aria-hidden />
      </button>

      {open && (
        <div
          id="user-menu"
          className="absolute top-full right-0 z-50 mt-2 w-60 rounded-lg bg-surface p-1.5 shadow-lift ring-1 ring-line"
        >
          <div className="border-b border-line px-3 pt-2 pb-3">
            <p className="truncate text-sm font-semibold text-ink">{user.username}</p>
            <p className="truncate text-xs text-subtle">{user.email}</p>
            {user.role === "admin" && (
              <span className="mt-1.5 inline-block rounded bg-accent-soft px-1.5 py-0.5 text-[11px] font-semibold text-on-accent-soft">
                Admin
              </span>
            )}
          </div>
          <ul className="space-y-0.5 pt-1.5">
            {user.role === "admin" && (
              <li>
                <Link href="/dashboard" onClick={() => setOpen(false)} className={`${itemClass} text-ink hover:bg-sunken`}>
                  <SquaresFour size={18} className="text-subtle" aria-hidden />
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link href="/orders" onClick={() => setOpen(false)} className={`${itemClass} text-ink hover:bg-sunken`}>
                <Receipt size={18} className="text-subtle" aria-hidden />
                My orders
              </Link>
            </li>
            <li>
              <button type="button" onClick={handleLogout} className={`${itemClass} text-danger hover:bg-danger-soft`}>
                <SignOut size={18} aria-hidden />
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
