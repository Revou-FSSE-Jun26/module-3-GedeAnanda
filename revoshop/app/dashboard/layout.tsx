import type { Metadata } from "next";
import Container from "@/components/Container";
import AuthGuard from "@/components/auth/AuthGuard";
import DashboardNav from "@/components/dashboard/DashboardNav";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Dashboard | RevoShop" },
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <Container className="py-4 sm:py-6">
      <AuthGuard role="admin">
        <p className="text-xs font-semibold tracking-wide text-accent uppercase">Admin dashboard</p>
        <DashboardNav />
        <div className="mt-5">{children}</div>
      </AuthGuard>
    </Container>
  );
}
