type AccountFieldProps = {
  label: string;
  value: string;
  editable?: boolean;
};

export default function AccountField({
  label,
  value,
  editable = false,
}: AccountFieldProps) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-6">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/60">{label}</p>

        <p className="mt-2 text-base text-white break-words">{value}</p>
      </div>

      {editable && (
        <button
          type="button"
          className="shrink-0 text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          Editar
        </button>
      )}
    </div>
  );
}
