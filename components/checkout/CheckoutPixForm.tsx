"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";

import type {
  CheckoutLanguage,
  PixPaymentData,
} from "@/types/checkout-payment";
import type { PixFieldErrors } from "@/hooks/checkout/useCheckoutPix";

type CheckoutPixFormProps = {
  mode?: "form" | "qr";
  language: CheckoutLanguage;
  pixData: PixPaymentData | null;
  pixEmail: string;
  pixCpf: string;
  pixCopied: boolean;
  isLoading: boolean;
  isCancelling: boolean;
  fieldErrors: PixFieldErrors;
  onEmailChange: (value: string) => void;
  onCpfChange: (value: string) => void;
  onCreate: () => void;
  onCancel: () => void;
  onCopy: () => void;
};

const checkoutEase = [0.22, 1, 0.36, 1] as const;

export default function CheckoutPixForm({
  mode = "form",
  language,
  pixData,
  pixEmail,
  pixCpf,
  pixCopied,
  isLoading,
  isCancelling,
  fieldErrors,
  onEmailChange,
  onCpfChange,
  onCreate,
  onCancel,
  onCopy,
}: CheckoutPixFormProps) {
  return (
    <motion.div
      initial={
        mode === "form"
          ? {
              opacity: 0,
              height: 0,
            }
          : false
      }
      animate={
        mode === "form"
          ? {
              opacity: 1,
              height: "auto",
              transition: {
                height: {
                  duration: 1.2,
                  ease: checkoutEase,
                },
                opacity: {
                  duration: 0.8,
                },
              },
            }
          : {
              opacity: 1,
              transition: {
                duration: 0,
              },
            }
      }
      exit={
        mode === "form"
          ? {
              opacity: 0,
              height: 0,
              transition: {
                height: {
                  duration: 0.8,
                  ease: checkoutEase,
                },
                opacity: {
                  duration: 0.55,
                },
              },
            }
          : undefined
      }
      className={mode === "form" ? "overflow-hidden" : ""}
    >
      <div className={mode === "qr" ? "mt-1" : "mt-6"}>
        {mode === "form" ? (
          <div>
            <div className="px-6 pb-10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Icon
                    icon="simple-icons:pix"
                    className="h-5 w-5 text-emerald-400"
                  />
                </div>

                <div className="py-4">
                  <p className="text-sm font-semibold text-white">
                    {language === "pt" ? "Pagamento via Pix" : "Pix payment"}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-white/45">
                    {language === "pt"
                      ? "Gere o QR Code e pague pelo aplicativo do seu banco."
                      : "Generate the QR Code and pay using your banking app."}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <motion.div
                  animate={
                    fieldErrors.email
                      ? {
                          x: [0, -6, 6, -4, 4, 0],
                        }
                      : {
                          x: 0,
                        }
                  }
                  transition={{
                    duration: 0.4,
                  }}
                >
                  <label
                    htmlFor="pix-email"
                    className="mb-2 block text-xs font-medium text-white/55"
                  >
                    E-mail
                  </label>

                  <input
                    id="pix-email"
                    type="email"
                    value={pixEmail}
                    onChange={(event) => onEmailChange(event.target.value)}
                    placeholder="seu@email.com"
                    aria-invalid={Boolean(fieldErrors.email)}
                    className={[
                      "h-12 w-full rounded-xl border bg-white/[0.035] px-4 text-sm text-white",
                      "outline-none transition placeholder:text-white/25 focus:ring-4",
                      fieldErrors.email
                        ? "border-red-400/70 ring-4 ring-red-400/10"
                        : "border-white/10 focus:border-emerald-500/70 focus:ring-emerald-500/10",
                    ].join(" ")}
                  />

                  <AnimatePresence initial={false}>
                    {fieldErrors.email && (
                      <motion.p
                        key="pix-email-error"
                        role="alert"
                        initial={{
                          opacity: 0,
                          height: 0,
                          y: -4,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          y: -4,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: checkoutEase,
                        }}
                        className="mt-2 overflow-hidden text-xs text-red-300"
                      >
                        {fieldErrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  animate={
                    fieldErrors.cpf
                      ? {
                          x: [0, -6, 6, -4, 4, 0],
                        }
                      : {
                          x: 0,
                        }
                  }
                  transition={{
                    duration: 0.4,
                  }}
                >
                  <label
                    htmlFor="pix-cpf"
                    className="mb-2 block text-xs font-medium text-white/55"
                  >
                    CPF
                  </label>

                  <input
                    id="pix-cpf"
                    type="text"
                    inputMode="numeric"
                    value={pixCpf}
                    onChange={(event) => onCpfChange(event.target.value)}
                    placeholder="000.000.000-00"
                    aria-invalid={Boolean(fieldErrors.cpf)}
                    className={[
                      "h-12 w-full rounded-xl border bg-white/[0.035] px-4 text-sm text-white",
                      "outline-none transition placeholder:text-white/25 focus:ring-4",
                      fieldErrors.cpf
                        ? "border-red-400/70 ring-4 ring-red-400/10"
                        : "border-white/10 focus:border-emerald-500/70 focus:ring-emerald-500/10",
                    ].join(" ")}
                  />

                  <AnimatePresence initial={false}>
                    {fieldErrors.cpf && (
                      <motion.p
                        key="pix-cpf-error"
                        role="alert"
                        initial={{
                          opacity: 0,
                          height: 0,
                          y: -4,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                          y: -4,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: checkoutEase,
                        }}
                        className="mt-2 overflow-hidden text-xs text-red-300"
                      >
                        {fieldErrors.cpf}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <button
                type="button"
                onClick={onCreate}
                disabled={isLoading}
                className="mt-10 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/80" />
                )}

                {isLoading
                  ? language === "pt"
                    ? "Gerando Pix..."
                    : "Generating Pix..."
                  : language === "pt"
                    ? "Gerar QR Code Pix"
                    : "Generate Pix QR Code"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <Icon
                  icon="simple-icons:pix"
                  className="h-4 w-4 text-emerald-400"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  {language === "pt"
                    ? "Escaneie o QR Code"
                    : "Scan the QR Code"}
                </h3>

                <p className="mt-1 text-sm text-white/45">
                  {language === "pt"
                    ? "Use o aplicativo do seu banco para pagar."
                    : "Use your banking app to pay."}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-6 md:grid-cols-[232px_minmax(0,1fr)] md:items-start">
              <div className="flex justify-center md:justify-start">
                {pixData?.qrCodeBase64 && (
                  <div className="w-fit rounded-2xl bg-white p-3">
                    <img
                      src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                      alt={
                        language === "pt"
                          ? "QR Code do pagamento Pix"
                          : "Pix payment QR Code"
                      }
                      className="h-52 w-52"
                    />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-300" />

                    <p className="text-sm font-medium text-amber-100/80">
                      {language === "pt"
                        ? "Aguardando pagamento"
                        : "Waiting for payment"}
                    </p>
                  </div>

                  <p className="mt-2 text-xs leading-relaxed text-white/40">
                    {language === "pt"
                      ? "Após pagar, esta página será atualizada automaticamente."
                      : "After payment, this page will update automatically."}
                  </p>
                </div>

                {pixData?.qrCode && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-white/35">
                      {language === "pt"
                        ? "Pix copia e cola"
                        : "Pix copy and paste"}
                    </p>

                    <div className="relative">
                      <input
                        id="pix-copy-code"
                        type="text"
                        readOnly
                        value={pixData.qrCode}
                        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 pr-[110px] text-xs text-white/55 outline-none"
                      />

                      <button
                        type="button"
                        onClick={onCopy}
                        className={[
                          "absolute right-1 top-1 flex h-10 w-[96px] items-center justify-center overflow-hidden rounded-lg border px-3 text-sm font-medium transition-colors duration-200",
                          pixCopied
                            ? "border-emerald-400/25 bg-emerald-500/15 text-emerald-300"
                            : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]",
                        ].join(" ")}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {pixCopied ? (
                            <motion.span
                              key="copied"
                              initial={{
                                opacity: 0,
                                y: 5,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                y: -5,
                              }}
                              transition={{
                                duration: 0.18,
                                ease: checkoutEase,
                              }}
                              className="absolute flex items-center gap-1.5 whitespace-nowrap"
                            >
                              <span aria-hidden="true">✓</span>
                              <span>
                                {language === "pt" ? "Copiado" : "Copied"}
                              </span>
                            </motion.span>
                          ) : (
                            <motion.span
                              key="copy"
                              initial={{
                                opacity: 0,
                                y: 5,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                y: -5,
                              }}
                              transition={{
                                duration: 0.18,
                                ease: checkoutEase,
                              }}
                              className="absolute whitespace-nowrap"
                            >
                              {language === "pt" ? "Copiar" : "Copy"}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-center pb-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={isCancelling}
                className="group flex min-h-10 items-center justify-center gap-2 text-sm font-medium text-white/45 transition duration-200 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-white/60" />

                    <span>
                      {language === "pt"
                        ? "Cancelando pagamento..."
                        : "Cancelling payment..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:-translate-x-1"
                    >
                      ←
                    </span>

                    <span>
                      {language === "pt"
                        ? "Escolher outra forma de pagamento"
                        : "Choose another payment method"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
