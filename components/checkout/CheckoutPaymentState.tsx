"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, LoaderCircle, RotateCcw, X } from "lucide-react";

type CheckoutPaymentStateProps = {
  language: "pt" | "en";
  status: "processing" | "pending" | "approved" | "failure";
  paymentId?: string;
  onRetry?: () => void;
  onStartLesson?: () => void;
};

export default function CheckoutPaymentState({
  language,
  status,
  paymentId,
  onRetry,
  onStartLesson,
}: CheckoutPaymentStateProps) {
  const isProcessing = status === "processing";
  const isApproved = status === "approved";
  const isPending = status === "pending";

  const title = isApproved
    ? language === "pt"
      ? "Sua aula já está disponível"
      : "Your lesson is now available"
    : isProcessing
      ? language === "pt"
        ? "Só um instante"
        : "Just a moment"
      : isPending
        ? language === "pt"
          ? "Aguardando a confirmação"
          : "We are waiting for confirmation"
        : language === "pt"
          ? "Não foi possível concluir o pagamento"
          : "The payment could not be completed";

  const description = isApproved
    ? language === "pt"
      ? "O acesso foi liberado e você já pode começar"
      : "Access has been released and you can start now"
    : isProcessing
      ? language === "pt"
        ? "Estamos processando o pagamento com segurança"
        : "We are securely processing your payment"
      : isPending
        ? language === "pt"
          ? "Assim que o seu pagamento for confirmado, o acesso será liberado automaticamente"
          : "As soon as your payment is confirmed, access will be granted automatically"
        : language === "pt"
          ? "Você pode revisar os dados e tentar novamente"
          : "You can review the details and try again";

  const statusLabel = isApproved
    ? language === "pt"
      ? "Pagamento aprovado"
      : "Payment approved"
    : isProcessing
      ? language === "pt"
        ? "Processando"
        : "Processing"
      : isPending
        ? language === "pt"
          ? "Pagamento pendente"
          : "Payment pending"
        : language === "pt"
          ? "Pagamento recusado"
          : "Payment failed";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={status}
        initial={{
          opacity: 0,
          y: 8,
          filter: "blur(4px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            delay: 0.08,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        exit={{
          opacity: 0,
          y: -6,
          filter: "blur(4px)",
          transition: {
            duration: 0.35,
            ease: "easeIn",
          },
        }}
        className="flex min-h-[360px] flex-col items-center justify-center px-5 py-10 text-center sm:px-8"
      >
        <div
          className={[
            "flex h-16 w-16 items-center justify-center rounded-full border",
            isApproved
              ? "border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
              : isProcessing || isPending
                ? "border-sky-200/10 bg-sky-200/[0.04] text-sky-200/90"
                : "border-red-400/20 bg-red-400/10 text-red-300",
          ].join(" ")}
        >
          {isApproved ? (
            <Check className="h-7 w-7" strokeWidth={1.8} />
          ) : isProcessing || isPending ? (
            <LoaderCircle
              className="h-6 w-6 animate-[spin_1.8s_linear_infinite]"
              strokeWidth={1.7}
            />
          ) : (
            <X className="h-6 w-6" strokeWidth={1.8} />
          )}
        </div>

        <p
          className={[
            "mt-6 text-[11px] font-semibold uppercase tracking-[0.22em]",
            isApproved
              ? "text-emerald-300"
              : isProcessing || isPending
                ? "text-sky-200/90"
                : "text-red-200/70",
          ].join(" ")}
        >
          {statusLabel}
        </p>

        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-white">
          {title}
        </h3>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/45">
          {description}
        </p>

        <div className="mt-8 w-full max-w-sm">
          {isApproved && onStartLesson && (
            <button
              type="button"
              onClick={onStartLesson}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/85"
            >
              {language === "pt" ? "Começar a aula" : "Start lesson"}
            </button>
          )}

          {!isApproved && !isProcessing && !isPending && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/85"
            >
              <RotateCcw className="h-4 w-4" />

              {language === "pt" ? "Tentar novamente" : "Try again"}
            </button>
          )}
        </div>

        {paymentId && (
          <p className="mt-6 text-[11px] text-white/20">
            {language === "pt" ? "Pagamento" : "Payment"} #{paymentId}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
