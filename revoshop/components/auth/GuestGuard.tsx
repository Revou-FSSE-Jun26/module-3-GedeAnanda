"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@/lib/types";

function landingPath(user: User): string {
  if (user.role === "admin") return "/dashboard";
  const next = new URLSearchParams(window.location.search).get("next");
  // Same site only
  return next && /^\/(?![/\\])/.test(next) ? next : "/";
}

export default function GuestGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(landingPath(user));
  }, [user, router]);

  if (user) {
    return (
      <p role="status" className="flex items-center justify-center gap-2 py-24 text-sm text-muted">
        <Spinner className="text-accent" />
        Redirecting
      </p>
    );
  }

  return children;
}
