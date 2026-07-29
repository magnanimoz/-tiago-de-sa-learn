"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Dropdown from "@/components/ui/Dropdown";
import UserMenu from "@/components/layout/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { headerText } from "@/lib/i18n/header";
import { localePath } from "@/lib/locale-path";
import { t } from "@/lib/t";

const links = [
  { href: "/", label: headerText.home },
  { href: "/learn", label: headerText.learn },
  { href: "/about", label: headerText.about },
  { href: "/contact", label: headerText.contact },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { language, routeLocale, setLanguage } = useSettings();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const start = 8;
      const end = 120;

      const progress = Math.min(
        Math.max((window.scrollY - start) / (end - start), 0),
        1,
      );

      setScrollProgress(progress);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className="
          fixed
          inset-x-0
          top-0
          z-50
          h-20
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            border-b
            border-white/10
            bg-black/80
            backdrop-blur-md
          "
          style={{
            opacity: scrollProgress,
          }}
        />

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            h-full
            w-full
            max-w-7xl
            items-center
            px-5
            sm:px-6
            lg:px-8
          "
        >
          {/* Logo */}
          <Link
            href={localePath("/", routeLocale)}
            className="
              relative
              z-10
              shrink-0
              text-lg
              font-semibold
              tracking-[-0.03em]
              text-white
              transition-opacity
              hover:opacity-70
            "
          >
            Tiago de Sá
          </Link>

          {/* Navegação desktop */}
          <nav
            aria-label="Navegação principal"
            className="
              ml-12
              hidden
              items-center
              gap-8
              min-[992px]:flex
            "
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={localePath(link.href, routeLocale)}
                className="
                  text-[15px]
                  font-medium
                  text-white/60
                  transition-colors
                  duration-300
                  hover:text-white
                "
              >
                {t(link.label, language)}
              </Link>
            ))}
          </nav>

          {/* Ações desktop */}
          <div
            className="
              ml-auto
              hidden
              items-center
              gap-5
              min-[992px]:flex
            "
          >
            <Dropdown
              width="w-52"
              trigger={
                <button
                  type="button"
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    text-sm
                    font-medium
                    text-white/55
                    transition-colors
                    duration-300
                    hover:text-white
                  "
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M12 2C17.52 2 22 6.48 22 12S17.52 22 12 22 2 17.52 2 12 6.48 2 12 2Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M2 12H22"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 2C14.5 4.8 16 8.3 16 12S14.5 19.2 12 22"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12 2C9.5 4.8 8 8.3 8 12S9.5 19.2 12 22"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>

                  <span>{language === "pt" ? "PT" : "EN"}</span>

                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-3 w-3 opacity-40"
                  >
                    <path
                      d="M6 8L10 12L14 8"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              }
            >
              <Dropdown.Item onClick={() => setLanguage("pt")}>
                <span>🇧🇷 Português</span>
                {language === "pt" && <span>✓</span>}
              </Dropdown.Item>

              <Dropdown.Item onClick={() => setLanguage("en")}>
                <span>🇺🇸 English</span>
                {language === "en" && <span>✓</span>}
              </Dropdown.Item>
            </Dropdown>

            {isLoading ? (
              <div
                aria-hidden="true"
                className="
                  h-10
                  w-10
                  animate-pulse
                  rounded-full
                  bg-white/10
                "
              />
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link
                href={localePath("/login", routeLocale)}
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  px-5
                  text-sm
                  font-semibold
                  text-black
                  transition
                  duration-300
                  hover:bg-white/85
                "
              >
                {t(headerText.login, language)}
              </Link>
            )}
          </div>

          {/* Ações mobile */}
          <div
            className="
              relative
              z-10
              ml-auto
              flex
              items-center
              gap-4
              min-[992px]:hidden
            "
          >
            {isLoading ? (
              <div
                aria-hidden="true"
                className="
                  h-9
                  w-9
                  animate-pulse
                  rounded-full
                  bg-white/10
                "
              />
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link
                href={localePath("/login", routeLocale)}
                onClick={() => setMenuOpen(false)}
                className="
                  text-sm
                  font-medium
                  text-white/70
                  transition-colors
                  hover:text-white
                "
              >
                {t(headerText.login, language)}
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label={
                menuOpen
                  ? t(headerText.closeMenu, language)
                  : t(headerText.openMenu, language)
              }
              aria-expanded={menuOpen}
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
              "
            >
              <span
                className={`
                  absolute
                  h-px
                  w-6
                  bg-white
                  transition-transform
                  duration-300
                  ${menuOpen ? "translate-y-0 rotate-45" : "-translate-y-[4px]"}
                `}
              />

              <span
                className={`
                  absolute
                  h-px
                  w-6
                  bg-white
                  transition-transform
                  duration-300
                  ${menuOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px]"}
                `}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        className={`
          fixed
          inset-0
          z-40
          bg-[#101012]
          transition
          duration-500
          min-[992px]:hidden
          ${
            menuOpen
              ? "pointer-events-auto visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          }
        `}
      >
        <nav
          aria-label="Navegação mobile"
          className="
            flex
            min-h-screen
            flex-col
            justify-center
            px-6
            pt-20
            sm:px-8
          "
        >
          {links.map((link, index) => (
            <Link
              key={link.href}
              href={localePath(link.href, routeLocale)}
              onClick={() => setMenuOpen(false)}
              className={`
                border-b
                border-white/10
                py-5
                text-4xl
                font-medium
                tracking-[-0.04em]
                text-white
                transition
                duration-500
                hover:text-[#e6007e]
                ${
                  menuOpen
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-5 opacity-0"
                }
              `}
              style={{
                transitionDelay: menuOpen ? `${index * 70}ms` : "0ms",
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
