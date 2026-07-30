"use client";

import { usePathname } from "next/navigation";

import Footer from "./Footer";
import Header from "./Header";

type SiteChromeProps = {
  children: React.ReactNode;
};

export default function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();

  const isCheckoutRoute =
    pathname === "/pt-br/checkout" ||
    pathname.startsWith("/pt-br/checkout/") ||
    pathname === "/en-us/checkout" ||
    pathname.startsWith("/en-us/checkout/");

  return (
    <>
      {!isCheckoutRoute && <Header />}

      {children}

      {!isCheckoutRoute && <Footer />}
    </>
  );
}
