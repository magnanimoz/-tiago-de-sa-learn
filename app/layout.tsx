import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/auth/LoginModal";
import Providers from "./providers";

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
        <Providers>
          {children}
          <Footer />
          <LoginModal />

          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
