"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/lib/types";

interface AuthGuardProps {
  role?: Role;
  children: ReactNode;
}

export default function AuthGuard({ role, children }: AuthGuardProps) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const wasAllowed = useRef(false);
  const allowed = Boolean(user && (!role || user.role === role));

  useEffect(() => {
    if (!ready) return;
    if (allowed) {
      wasAllowed.current = true;
      return;
    }
    // Logged out here
    if (user || wasAllowed.current) {
      router.replace("/");
    } else {
      const next = window.location.pathname + window.location.search;
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    }
  }, [ready, allowed, user, router]);

  if (!allowed) {
    return (
      <p role="status" className="flex items-center justify-center gap-2 py-24 text-sm text-muted">
        <Spinner className="text-accent" />
        Checking your account
      </p>
    );
  }

  return children;
}
