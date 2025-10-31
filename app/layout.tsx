import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dulce Juerga - Halloween 2025",
  description:
    "Sistema completo de gestión para eventos: inventario, ventas, DJ requests y más.",
  icons: {
    icon: "dulce-juerga-logo.png",
    shortcut: "/dulce-juerga-logo.png",
    apple: "/dulce-juerga-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
