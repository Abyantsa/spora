import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import Toast from "@/components/ui/Toast";
import SheetWrapper from "@/components/sheets/SheetWrapper";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "SPORA — Prototype",
  description: "Surabaya Pusat & Timur Sports Venue Booking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${archivo.className} antialiased h-full`}>
        <AppProvider>
          <div className="flex min-h-screen">
            {children}
          </div>
          <SheetWrapper />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
