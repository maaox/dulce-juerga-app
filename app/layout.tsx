import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dulce Juerga - Halloween 2025",
  description:
    "La fiesta de Halloween más terrorífica del año. ¡No te la pierdas!",
  icons: {
    icon: "dulce-juerga-logo.png",
    shortcut: "/dulce-juerga-logo.png",
    apple: "/dulce-juerga-logo.png",
  },
  keywords:
    "halloween, fiesta halloween, dulce juerga, halloween 2025, fiesta octubre, evento halloween",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
