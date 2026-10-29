import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import Toast from "@/components/ui/Toast";
import SheetWrapper from "@/components/sheets/SheetWrapper";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "SPORA — Surabaya Sport Matchmaking & Venue Booking",
  description: "Platform matchmaking olahraga mahasiswa dan pemuda Surabaya: cari teman main, sewa lapangan kampus dan komersial, patungan otomatis, dan kumpulkan stempel Sport Passport.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.className} antialiased min-h-screen bg-[#f2f0eb] text-[rgba(0,0,0,0.87)]`}>
        <AppProvider>
          {children}
          <SheetWrapper />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
