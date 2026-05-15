import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RutaB2B MVP",
  description: "Plataforma SaaS B2B para vendedores viajantes"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
