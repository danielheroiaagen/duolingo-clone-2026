import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Duolingo 2026 | Idiomas del Futuro",
  description: "Aprende idiomas con el ecosistema de desarrollo más avanzado de 2026.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Longo 2026",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.className} bg-zinc-950 text-white min-h-screen selection:bg-cyan-500/30 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
