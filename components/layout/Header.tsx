"use client";

import Link from "next/link";
import { useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import Dropdown from "@/components/ui/Dropdown";
import { t } from "@/lib/t";
import { headerText } from "@/lib/i18n/header";

const links = [
  { href: "/", label: headerText.home },
  { href: "/learn", label: headerText.learn },
  { href: "/portfolio", label: headerText.portfolio },
  { href: "/about", label: headerText.about },
  { href: "/contact", label: headerText.contact },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useSettings();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="relative mx-auto flex h-20 max-w-300 items-center px-6 lg:px-8">
          {/* Desktop: logo */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-[-0.03em] max-[991px]:hidden"
          >
            Tiago de Sá
          </Link>

          {/* Desktop: menu centralizado */}
          <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8 max-[991px]:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex text-base text-muted transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] hover:text-foreground"
              >
                {t(link.label, language)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-4 min-[992px]:flex">
            <Dropdown
              width="w-52"
              trigger={
                <button
                  type="button"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {language === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
                </button>
              }
            >
              <Dropdown.Item onClick={() => setLanguage("pt")}>
                <span>🇧🇷 Português</span>
                {language === "pt" && "✓"}
              </Dropdown.Item>

              <Dropdown.Item onClick={() => setLanguage("en")}>
                <span>🇺🇸 English</span>
                {language === "en" && "✓"}
              </Dropdown.Item>
            </Dropdown>

            {/* Desktop: login */}
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-border px-6 py-2.5 text-base font-medium transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] max-[991px]:hidden"
            >
              <span
                className="
              absolute
              inset-x-0
              bottom-0
              h-full
              translate-y-full
              bg-white/5
              transition-transform
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:translate-y-0
            "
              />
              <span className="relative z-10">
                {t(headerText.login, language)}
              </span>
            </Link>
          </div>

          {/* Tablet/mobile */}
          <div className="ml-auto hidden items-center gap-5 max-[991px]:flex max-[991px]:animate-header-enter">
            <Link
              href="/login"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {t(headerText.login, language)}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="relative flex h-10 w-10 items-center justify-center"
              aria-label={
                menuOpen
                  ? t(headerText.closeMenu, language)
                  : t(headerText.openMenu, language)
              }
              aria-expanded={menuOpen}
            >
              <span
                className={`absolute h-px w-6 bg-foreground transition duration-300 ${
                  menuOpen ? "translate-y-0 rotate-45" : "-translate-y-1"
                }`}
              />

              <span
                className={`absolute h-px w-6 bg-foreground transition duration-300 ${
                  menuOpen ? "translate-y-0 -rotate-45" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-all duration-500 min-[992px]:hidden ${
          menuOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      >
        <nav
          className={`flex min-h-screen flex-col justify-center px-8 transition-all duration-500 ${
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
          }`}
        >
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-border py-5 text-4xl tracking-[-0.04em] transition-colors hover:text-magenta"
              style={{
                transitionDelay: menuOpen ? `${index * 60}ms` : "0ms",
              }}
            >
              {t(link.label, language)}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
