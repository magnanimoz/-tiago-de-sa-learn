"use client";

import { useEffect, useState } from "react";
import { Check, LoaderCircle, Pencil, X } from "lucide-react";
import { toast } from "sonner";

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
  const [isSaving, setIsSaving] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    if (!isEditing) {
      setCurrentValue(value);
    }
  }, [value, isEditing]);

  const trimmedValue = currentValue.trim();
  const hasChanges = trimmedValue !== value.trim();
  const canSave = hasChanges && Boolean(trimmedValue);

  async function handleSave() {
    if (!canSave || isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      if (onSave) {
        await onSave(trimmedValue);
      }

      setCurrentValue(trimmedValue);
      setIsEditing(false);

      toast.success("Nome atualizado com sucesso.");
    } catch (error) {
      console.error(`Erro ao salvar ${label}:`, error);

      toast.error("Não foi possível atualizar o nome.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    if (isSaving) {
      return;
    }

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
            disabled={isSaving}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 pr-20 text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="absolute inset-y-0 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="text-white/50 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Cancelar"
            >
              <X size={18} />
            </button>

            {canSave && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="text-emerald-400 transition hover:text-emerald-300 disabled:cursor-not-allowed"
                aria-label={isSaving ? "Salvando" : "Salvar"}
              >
                {isSaving ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
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
