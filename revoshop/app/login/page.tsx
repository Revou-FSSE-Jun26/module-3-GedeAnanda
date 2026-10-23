import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import GuestGuard from "@/components/auth/GuestGuard";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your RevoShop account.",
};

export default function LoginPage() {
  return (
    <GuestGuard>
      <AuthShell
        title="Log in"
        subtitle="Welcome back. Log in to check out and track your orders."
        footer={
          <>
            New to RevoShop?{" "}
            <Link href="/register" className="font-semibold text-accent hover:underline">
              Create an account
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthShell>
    </GuestGuard>
  );
}
