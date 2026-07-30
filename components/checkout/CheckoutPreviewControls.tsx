type CheckoutPreviewControlsProps = {
  currentStatus: string | null;
  buttonLabel: string;
  onStart: () => void;
};

export default function CheckoutPreviewControls({
  currentStatus,
  buttonLabel,
  onStart,
}: CheckoutPreviewControlsProps) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-3 pt-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-violet-400" />

        <p className="truncate text-xs text-white/45">
          {currentStatus === null
            ? "Ferramentas de desenvolvimento"
            : `Estado atual: ${currentStatus}`}
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/[0.05] hover:text-white"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
