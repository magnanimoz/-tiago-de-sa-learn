"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react";

import type {
  CheckoutLanguage,
  PixPaymentData,
} from "@/types/checkout-payment";

type CheckoutPixFormProps = {
  language: CheckoutLanguage;
  pixData: PixPaymentData | null;
  pixPaymentId: number | null;
  pixStatus: string | null;
  pixEmail: string;
  pixCpf: string;
  pixCopied: boolean;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onCpfChange: (value: string) => void;
  onCreate: () => void;
  onCopy: () => void;
};

const checkoutEase = [0.22, 1, 0.36, 1] as const;

export default function CheckoutPixForm({
  language,
  pixData,
  pixPaymentId,
  pixStatus,
  pixEmail,
  pixCpf,
  pixCopied,
  isLoading,
  onEmailChange,
  onCpfChange,
  onCreate,
  onCopy,
}: CheckoutPixFormProps) {
  return (
    <motion.div
      key="pix-payment"
      initial={{
        opacity: 0,
        height: 0,
        y: -12,
        scale: 0.985,
      }}
      animate={{
        opacity: 1,
        height: "auto",
        y: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        height: 0,
        y: -8,
        scale: 0.985,
      }}
      transition={{
        height: {
          duration: 0.35,
          ease: checkoutEase,
        },
        opacity: {
          duration: 0.22,
        },
        y: {
          duration: 0.35,
          ease: checkoutEase,
        },
        scale: {
          duration: 0.35,
          ease: checkoutEase,
        },
      }}
      className="overflow-hidden"
    >
      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <AnimatePresence mode="wait" initial={false}>
          {!pixData ? (
            <motion.div
              key="pix-start"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: 0.25,
                ease: checkoutEase,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Icon
                    icon="simple-icons:pix"
                    className="h-5 w-5 text-emerald-400"
                  />
                </div>

                <div>
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
                <div>
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
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
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
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={onCreate}
                disabled={isLoading}
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
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
            </motion.div>
          ) : (
            <motion.div
              key="pix-created"
              initial={{ opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.985 }}
              transition={{
                duration: 0.4,
                ease: checkoutEase,
              }}
            >
              <div className="text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Icon
                    icon="simple-icons:pix"
                    className="h-5 w-5 text-emerald-400"
                  />
                </div>

                <h3 className="mt-3 text-base font-semibold text-white">
                  {language === "pt" ? "Escaneie para pagar" : "Scan to pay"}
                </h3>

                <p className="mt-1 text-xs text-white/45">
                  {language === "pt"
                    ? "Abra o aplicativo do seu banco e escaneie o QR Code."
                    : "Open your banking app and scan the QR Code."}
                </p>
              </div>

              {pixData.qrCodeBase64 && (
                <div className="mx-auto mt-5 w-fit rounded-2xl bg-white p-3">
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

              {pixData.qrCode && (
                <div className="mt-5">
                  <label
                    htmlFor="pix-copy-code"
                    className="mb-2 block text-xs font-medium text-white/55"
                  >
                    {language === "pt"
                      ? "Pix copia e cola"
                      : "Pix copy and paste"}
                  </label>

                  <div className="flex gap-2">
                    <input
                      id="pix-copy-code"
                      type="text"
                      readOnly
                      value={pixData.qrCode}
                      className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.035] px-4 text-xs text-white/60 outline-none"
                    />

                    <button
                      type="button"
                      onClick={onCopy}
                      className="h-12 shrink-0 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-white transition hover:bg-white/[0.09]"
                    >
                      {pixCopied
                        ? language === "pt"
                          ? "Copiado"
                          : "Copied"
                        : language === "pt"
                          ? "Copiar"
                          : "Copy"}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-5 rounded-xl border border-amber-400/15 bg-amber-400/[0.06] px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-amber-300" />

                  <p className="text-xs font-medium text-amber-100/80">
                    {language === "pt"
                      ? "Aguardando pagamento"
                      : "Waiting for payment"}
                  </p>
                </div>

                {pixPaymentId && (
                  <p className="mt-1 pl-4 text-[11px] text-white/30">
                    {language === "pt" ? "Pagamento" : "Payment"} #
                    {pixPaymentId}
                  </p>
                )}

                {pixStatus && (
                  <p className="mt-1 pl-4 text-[11px] text-white/25">
                    {pixStatus}
                  </p>
                )}
              </div>

              {pixData.ticketUrl && (
                <a
                  href={pixData.ticketUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex h-11 w-full items-center justify-center rounded-xl border border-white/10 text-sm font-medium text-white/70 transition hover:bg-white/[0.05] hover:text-white"
                >
                  {language === "pt"
                    ? "Abrir instruções do Mercado Pago"
                    : "Open Mercado Pago instructions"}
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
