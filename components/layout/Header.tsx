"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import Dropdown from "@/components/ui/Dropdown";
import { t } from "@/lib/t";
import { headerText } from "@/lib/i18n/header";
import { useAuthModal } from "@/contexts/AuthModalContext";

const links = [
  { href: "/", label: headerText.home },
  { href: "/learn", label: headerText.learn },
  { href: "/portfolio", label: headerText.portfolio },
  { href: "/about", label: headerText.about },
  { href: "/contact", label: headerText.contact },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { language, setLanguage } = useSettings();
  const { openLoginModal } = useAuthModal();

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / 320, 1);
      setScrollProgress(progress);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const backgroundOpacity = 0.88 * scrollProgress;
  const borderOpacity = 0.1 * scrollProgress;
  const blurAmount = 18 * scrollProgress;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-shadow duration-300"
        style={{
          backgroundColor: `rgba(16, 16, 18, ${backgroundOpacity})`,
          borderBottom: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          boxShadow:
            scrollProgress > 0.7 ? "0 12px 40px rgba(0, 0, 0, 0.18)" : "none",
        }}
      >
        <div className="relative mx-auto flex h-20 max-w-300 items-center px-6 lg:px-8">
          {/* Desktop: logo */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-[-0.03em] text-white max-[991px]:hidden"
          >
            Tiago de Sá
          </Link>

          {/* Desktop: menu centralizado */}
          <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8 max-[991px]:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex text-base text-white/70 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] hover:text-white"
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
                  className="text-sm text-white/70 transition-colors hover:text-white"
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
            <button
              type="button"
              onClick={openLoginModal}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/20 px-6 py-2.5 text-base font-medium text-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] max-[991px]:hidden"
            >
              <span
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  h-full
                  translate-y-full
                  bg-white/10
                  transition-transform
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:translate-y-0
                "
              />

              <span className="relative z-10">
                {t(headerText.login, language)}
              </span>
            </button>
          </div>

          {/* Tablet/mobile */}
          <div className="ml-auto hidden items-center gap-5 max-[991px]:flex max-[991px]:animate-header-enter">
            <button
              type="button"
              onClick={openLoginModal}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {t(headerText.login, language)}
            </button>

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
                className={`absolute h-px w-6 bg-white transition duration-300 ${
                  menuOpen ? "translate-y-0 rotate-45" : "-translate-y-1"
                }`}
              />

              <span
                className={`absolute h-px w-6 bg-white transition duration-300 ${
                  menuOpen ? "translate-y-0 -rotate-45" : "translate-y-1"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        className={`fixed inset-0 z-40 bg-[#101012] transition-all duration-500 min-[992px]:hidden ${
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
              className="border-b border-white/10 py-5 text-4xl tracking-[-0.04em] text-white transition-colors hover:text-[#e6007e]"
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
