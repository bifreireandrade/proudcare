import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/header";
import MobileBottomNav from "./components/mobile-bottom-nav";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ProudCare - Acolhimento durante a quimioterapia",
  description:
    "Acolhimento, informação confiável e organização para a sua jornada oncológica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-body bg-white">
        <ClerkProvider localization={ptBR}>
          <Header />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
          <MobileBottomNav />
        </ClerkProvider>
      </body>
    </html>
  );
}