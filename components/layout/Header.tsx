"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import UserMenu from "@/components/layout/UserMenu";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
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
  const [headerVisible, setHeaderVisible] = useState(false);

  const { language, routeLocale } = useSettings();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderVisible(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className="
          fixed
          inset-x-0
          top-0
          z-50
          h-20
          border-b
          transition-[background-color,border-color,backdrop-filter]
          duration-[400ms]
          ease-[cubic-bezier(0,0,1,1)]
        "
        style={{
          transition:
            "background-color 400ms cubic-bezier(0,0,1,1), border-color 400ms cubic-bezier(0,0,1,1), backdrop-filter 400ms cubic-bezier(0,0,1,1), -webkit-backdrop-filter 400ms cubic-bezier(0,0,1,1)",

          backgroundColor: headerVisible ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0)",

          borderColor: headerVisible
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0)",

          backdropFilter: headerVisible
            ? "blur(24px) saturate(1.25)"
            : "blur(0px) saturate(1)",

          WebkitBackdropFilter: headerVisible
            ? "blur(24px) saturate(1.25)"
            : "blur(0px) saturate(1)",
        }}
      >
        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
            transition-opacity
            duration-[400ms]
            ${headerVisible ? "opacity-100" : "opacity-0"}
          `}
        >
          <div
            className="
              absolute
              inset-0
              bg-repeat
              opacity-[0.025]
            "
            style={{
              backgroundImage: "url('/textures/noise.svg')",
              backgroundSize: "220px",
            }}
          />

          <div
            className="
              absolute
              inset-0
              shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
            "
          />
        </div>

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
            <LanguageSwitcher />

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
          {menuOpen && (
            <div className="mb-8 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                {language === "pt" ? "Idioma" : "Language"}
              </p>

              <LanguageSwitcher />
            </div>
          )}
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
