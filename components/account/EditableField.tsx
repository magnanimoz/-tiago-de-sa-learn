"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, X } from "lucide-react";

type EditableFieldProps = {
  label: string;
  value: string;
  onSave?: (value: string) => Promise<void>;
};

export default function EditableField({
  label,
  value,
  onSave,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    if (!isEditing) {
      setCurrentValue(value);
    }
  }, [value, isEditing]);

  const hasChanges = currentValue.trim() !== value.trim();

  async function handleSave() {
    const trimmedValue = currentValue.trim();

    if (!hasChanges || !trimmedValue) {
      return;
    }

    if (onSave) {
      await onSave(trimmedValue);
    }

    setCurrentValue(trimmedValue);
    setIsEditing(false);
  }

  function handleCancel() {
    setCurrentValue(value);
    setIsEditing(false);
  }

  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-white/60">{label}</p>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md p-1 text-white/40 transition hover:bg-white/5 hover:text-white"
            aria-label={`Editar ${label}`}
          >
            <Pencil size={14} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="relative mt-2">
          <input
            type="text"
            value={currentValue}
            onChange={(event) => setCurrentValue(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 pr-20 text-white outline-none transition focus:border-indigo-500"
          />

          <div className="absolute inset-y-0 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="text-white/50 transition hover:text-white"
              aria-label="Cancelar"
            >
              <X size={18} />
            </button>

            {hasChanges && currentValue.trim() && (
              <button
                type="button"
                onClick={handleSave}
                className="text-emerald-400 transition hover:text-emerald-300"
                aria-label="Salvar"
              >
                <Check size={18} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-2 break-words text-base text-white">{currentValue}</p>
      )}
    </div>
  );
}
