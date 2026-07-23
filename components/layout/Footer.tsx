"use client";

import Link from "next/link";
import { FaInstagram, FaYoutube } from "react-icons/fa6";
import { useSettings } from "@/contexts/SettingsContext";
import { t } from "@/lib/t";
import { footerText } from "@/lib/i18n/footer";
import { footer } from "framer-motion/client";

export default function Footer() {
  const { language } = useSettings();

  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-8 py-16">
        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="text-3xl font-medium tracking-[-0.04em] text-white"
            >
              Tiago de Sá
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-muted">
              {t(footerText.description, language)}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:text-blue-400"
              >
                <FaInstagram className="h-5 w-5" />
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:text-blue-400"
              >
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium tracking-[-0.02em] text-white">
              {t(footerText.links, language)}
            </h3>

            <nav className="mt-5 flex flex-col gap-4 text-base text-muted">
              <Link
                href="/learn"
                className="inline-flex transition-all duration-500 ease-out hover:translate-x-[7px] hover:text-white"
              >
                {t(footerText.lessons, language)}
              </Link>

              <Link
                href="/about"
                className="inline-flex transition-all duration-500 ease-out hover:translate-x-[7px] hover:text-white"
              >
                {t(footerText.about, language)}
              </Link>

              <Link
                href="/contact"
                className="inline-flex transition-all duration-500 ease-out hover:translate-x-[7px] hover:text-white"
              >
                {t(footerText.contact, language)}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-medium tracking-[-0.02em] text-white">
              {t(footerText.account, language)}
            </h3>

            <nav className="mt-5 flex flex-col gap-4 text-base text-muted">
              <Link
                href="/login"
                className="inline-flex transition-all duration-500 ease-out hover:translate-x-[7px] hover:text-white"
              >
                {t(footerText.login, language)}
              </Link>

              <Link
                href="/account"
                className="inline-flex transition-all duration-500 ease-out hover:translate-x-[7px] hover:text-white"
              >
                {t(footerText.myAccount, language)}
              </Link>

              <Link
                href="/purchases"
                className="inline-flex transition-all duration-500 ease-out hover:translate-x-[7px] hover:text-white"
              >
                {t(footerText.myPurchases, language)}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-medium tracking-[-0.02em] text-white">
              {t(footerText.news, language)}
            </h3>

            <p className="mt-5 text-sm leading-6 text-muted">
              {t(footerText.receive, language)}
            </p>

            <div className="mt-5 flex border-b border-border pb-2">
              <input
                type="email"
                placeholder={t(footerText.yourEmail, language)}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-muted"
              />

              <button
                type="button"
                className="text-sm text-white transition-colors duration-300 hover:text-magenta"
              >
                {t(footerText.send, language)}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-2">
          <p className="text-center text-[13px] tracking-wide text-muted">
            © 2026 Tiago de Sá. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
