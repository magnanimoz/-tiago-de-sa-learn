import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { SettingsProvider } from "@/contexts/SettingsContext";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "Tiago de Sá",
  description:
    "Guitarrista, artista e professor. Aulas de guitarra, música e timbres.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={spaceGrotesk.variable}>
        <SettingsProvider>
          {children}
          <Footer />
        </SettingsProvider>
      </body>
    </html>
  );
}
