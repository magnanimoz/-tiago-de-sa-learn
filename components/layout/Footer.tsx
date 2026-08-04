"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaArrowRight, FaInstagram, FaYoutube } from "react-icons/fa6";

import { useSettings } from "@/contexts/SettingsContext";
import { footerText } from "@/lib/i18n/footer";
import { localePath } from "@/lib/locale-path";
import { t } from "@/lib/t";

type NewsletterStatus = "idle" | "loading" | "success" | "error";

const footerLinkClassName = `
  underline-offset-4
  transition-colors
  duration-200
  hover:text-white
  hover:underline
  focus-visible:outline-none
  focus-visible:text-white
  focus-visible:underline
  focus-visible:decoration-2
`;

const navigationItems = [
  {
    href: "/learn",
    translationKey: "lessons",
  },
  {
    href: "/about",
    translationKey: "about",
  },
  {
    href: "/contact",
    translationKey: "contact",
  },
  {
    href: "/account/profile",
    translationKey: "myAccount",
  },
  {
    href: "/account/purchases",
    translationKey: "myPurchases",
  },
] as const;

function hasHref<T extends { href?: string }>(
  item: T,
): item is T & { href: string } {
  return Boolean(item.href);
}

const socialLinks = [
  {
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    icon: FaInstagram,
  },
  {
    label: "YouTube",
    href: process.env.NEXT_PUBLIC_YOUTUBE_URL,
    icon: FaYoutube,
  },
].filter(hasHref);

export default function Footer() {
  const { language, routeLocale } = useSettings();

  const pathname = usePathname();

  function handleInternalLinkClick(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (pathname === href) {
      event.preventDefault();
      window.location.href = href;
    }
  }

  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] =
    useState<NewsletterStatus>("idle");

  const currentYear = new Date().getFullYear();
  const isSubmitting = newsletterStatus === "loading";

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setNewsletterStatus("error");
      return;
    }

    try {
      setNewsletterStatus("loading");

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      if (!response.ok) {
        throw new Error("Não foi possível realizar a inscrição.");
      }

      setEmail("");
      setNewsletterStatus("success");
    } catch (error) {
      console.error("Erro ao realizar inscrição na newsletter:", error);
      setNewsletterStatus("error");
    }
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);

    if (newsletterStatus === "success" || newsletterStatus === "error") {
      setNewsletterStatus("idle");
    }
  }

  return (
    <footer
      className="
    relative
    z-10
    overflow-hidden
    border-t
    border-white/10
    bg-white/[0.03]
    backdrop-blur-[32px]
    backdrop-saturate-150
    [-webkit-backdrop-filter:blur(32px)_saturate(1.5)]
  "
    >
      <div
        aria-hidden="true"
        className="
      pointer-events-none
      absolute
      inset-0
      overflow-hidden
    "
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
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12 md:px-8 md:py-16">
        <div
          className="
            grid
            gap-14
            border-b
            border-white/10
            pb-14
            lg:grid-cols-[minmax(0,1fr)_540px]
            lg:gap-20
          "
        >
          <div className="flex max-w-xl flex-col lg:justify-between">
            <div>
              <h2 className="text-4xl font-medium leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl lg:text-[3rem] font-stretch-120%">
                {t(footerText.heroTitle, language)}
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
                {t(footerText.heroDescription, language)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col lg:pt-1">
            <nav aria-labelledby="footer-navigation-title">
              <p
                id="footer-navigation-title"
                className="
                  mb-5
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.22em]
                  text-white/90
                "
              >
                {t(footerText.explore, language)}
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  gap-x-5
                  gap-y-3
                  text-sm
                  text-white/40
                "
              >
                {navigationItems.map(({ href, translationKey }) => {
                  const localizedHref = localePath(href, routeLocale);

                  return (
                    <Link
                      key={href}
                      href={localizedHref}
                      onClick={(event) =>
                        handleInternalLinkClick(event, localizedHref)
                      }
                      className={`
                        ${footerLinkClassName}
                        w-fit
                      `}
                    >
                      {t(footerText[translationKey], language)}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div
              className="
                mt-8
                grid
                gap-8
                pt-8
                xl:grid-cols-[minmax(0,1fr)_200px]
                xl:items-start
              "
            >
              <div>
                <p className="mb-5 text-xs font-medium uppercase tracking-[0.22em] text-white/90">
                  {t(footerText.news, language)}
                </p>

                <p className="max-w-sm text-sm leading-6 text-white/40">
                  {t(footerText.receive, language)}
                </p>

                <form
                  className="
                    mt-6
                    flex
                    w-full
                    max-w-md
                    items-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.035]
                    p-1.5
                    transition-all
                    duration-300
                    focus-within:border-white/25
                    focus-within:bg-white/[0.05]
                  "
                  onSubmit={handleNewsletterSubmit}
                  aria-busy={isSubmitting}
                >
                  <label htmlFor="footer-newsletter-email" className="sr-only">
                    {t(footerText.yourEmail, language)}
                  </label>

                  <input
                    id="footer-newsletter-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={t(footerText.yourEmail, language)}
                    autoComplete="email"
                    autoCapitalize="none"
                    inputMode="email"
                    spellCheck={false}
                    maxLength={254}
                    required
                    disabled={isSubmitting}
                    aria-describedby="footer-newsletter-status"
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-4
                      text-sm
                      text-white
                      outline-none
                      placeholder:text-white/45
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-label={
                      isSubmitting
                        ? t(footerText.sending, language)
                        : t(footerText.send, language)
                    }
                    className="
                      group
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-white/10
                      text-white
                      transition-all
                      duration-300
                      ease-out
                      hover:scale-[1.03]
                      hover:bg-white
                      hover:text-black
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-white/70
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-[#070707]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      disabled:hover:scale-100
                      disabled:hover:bg-white/10
                      disabled:hover:text-white
                      motion-reduce:hover:scale-100
                    "
                  >
                    {isSubmitting ? (
                      <span
                        aria-hidden="true"
                        className="
                          h-4
                          w-4
                          animate-spin
                          rounded-full
                          border-2
                          border-white/25
                          border-t-white
                          motion-reduce:animate-none
                        "
                      />
                    ) : (
                      <FaArrowRight
                        aria-hidden="true"
                        className="
                          h-3.5
                          w-3.5
                          transition-transform
                          duration-200
                          group-hover:translate-x-0.5
                          motion-reduce:transform-none
                        "
                      />
                    )}
                  </button>
                </form>

                <p
                  id="footer-newsletter-status"
                  aria-live="polite"
                  role={newsletterStatus === "error" ? "alert" : "status"}
                  className="mt-2 min-h-4 text-xs leading-4"
                >
                  {newsletterStatus === "success" && (
                    <span className="text-emerald-300/80">
                      {t(footerText.newsletterSuccess, language)}
                    </span>
                  )}

                  {newsletterStatus === "error" && (
                    <span className="text-red-300/80">
                      {t(footerText.newsletterError, language)}
                    </span>
                  )}
                </p>
              </div>

              {socialLinks.length > 0 && (
                <nav aria-labelledby="footer-social-title" className="w-full">
                  <p
                    id="footer-social-title"
                    className="
                      mb-5
                      text-xs
                      font-medium
                      uppercase
                      tracking-[0.22em]
                      text-white/90
                    "
                  >
                    {t(footerText.follow, language)}
                  </p>

                  <div className="mt-5 flex flex-col items-start gap-4">
                    {socialLinks.map(({ label, href, icon: Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          group
                          inline-flex
                          items-center
                          gap-3
                          text-sm
                          font-medium
                          text-white/60
                          transition-colors
                          duration-200
                          hover:text-white
                          focus-visible:outline-none
                          focus-visible:text-white
                          focus-visible:underline
                          focus-visible:underline-offset-4
                        "
                      >
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.04]
                            text-white/70
                            transition-all
                            duration-200
                            group-hover:border-white/20
                            group-hover:bg-white/[0.08]
                            group-hover:text-white
                          "
                        >
                          <Icon aria-hidden="true" className="h-4 w-4" />
                        </span>

                        <span>{label}</span>

                        <FaArrowRight
                          aria-hidden="true"
                          className="
                            h-3
                            w-3
                            -rotate-45
                            text-white/30
                            transition-all
                            duration-200
                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                            group-hover:text-white/70
                            motion-reduce:transform-none
                          "
                        />

                        <span className="sr-only">
                          {t(footerText.opensNewTab, language)}
                        </span>
                      </a>
                    ))}
                  </div>
                </nav>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} Tiago de Sá. {t(footerText.rights, language)}
          </p>

          <nav
            aria-label={t(footerText.legalNavigationLabel, language)}
            className="flex items-center gap-5"
          >
            <Link
              href={localePath("/privacy", routeLocale)}
              onClick={(event) =>
                handleInternalLinkClick(
                  event,
                  localePath("/privacy", routeLocale),
                )
              }
              className={footerLinkClassName}
            >
              {t(footerText.privacy, language)}
            </Link>

            <Link
              href={localePath("/terms", routeLocale)}
              onClick={(event) =>
                handleInternalLinkClick(
                  event,
                  localePath("/terms", routeLocale),
                )
              }
              className={footerLinkClassName}
            >
              {t(footerText.terms, language)}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
