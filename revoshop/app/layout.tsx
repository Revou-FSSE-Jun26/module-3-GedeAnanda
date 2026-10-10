import type { Metadata } from "next";
import { Suspense } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import AddedToast from "@/components/AddedToast";
import BottomNav from "@/components/BottomNav";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { CartProvider } from "@/components/CartProvider";
import { CatalogProvider } from "@/components/CatalogProvider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RevoShop",
    template: "%s | RevoShop",
  },
  description: "Shop electronics, fashion, home goods and books on RevoShop.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col pb-16 font-sans md:pb-0">
        <CartProvider>
          <CatalogProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Suspense fallback={null}>
              <BottomNav />
            </Suspense>
            <CartDrawer />
            <AddedToast />
          </CatalogProvider>
        </CartProvider>
      </body>
    </html>
  );
}
