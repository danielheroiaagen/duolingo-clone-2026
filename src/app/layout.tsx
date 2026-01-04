import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Duolingo 2026 | Idiomas del Futuro",
  description: "Aprende idiomas con el ecosistema de desarrollo más avanzado de 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-[#0A0A0A] text-white min-h-screen selection:bg-cyan-500/30`}>
        {children}
       body>
    </html>
  );
}
