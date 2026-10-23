import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import GuestGuard from "@/components/auth/GuestGuard";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a RevoShop account to place orders.",
};

export default function RegisterPage() {
  return (
    <GuestGuard>
      <AuthShell
        title="Create an account"
        subtitle="It takes a minute. You will be logged in right after."
        footer={
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">
              Log in
            </Link>
          </>
        }
      >
        <RegisterForm />
      </AuthShell>
    </GuestGuard>
  );
}
