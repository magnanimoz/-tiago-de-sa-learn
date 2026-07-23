"use client";

import { useState } from "react";
import { Eye, EyeOff, LoaderCircle, Check, X } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";

export default function UpdatePasswordForm() {
  const { updatePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const passwordRequirements = [
    {
      label: "Pelo menos 8 caracteres",
      isValid: password.length >= 8,
    },
    {
      label: "Uma letra maiúscula",
      isValid: /[A-Z]/.test(password),
    },
    {
      label: "Uma letra minúscula",
      isValid: /[a-z]/.test(password),
    },
    {
      label: "Um número",
      isValid: /\d/.test(password),
    },
    {
      label: "Um caractere especial",
      isValid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const passwordIsValid = passwordRequirements.every(
    (requirement) => requirement.isValid,
  );

  const passwordsMatch = password === confirmPassword;

  const canSubmit =
    currentPassword.length > 0 && passwordIsValid && passwordsMatch;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      await updatePassword(currentPassword, password);

      toast.success("Senha atualizada com sucesso.");

      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setShowCurrentPassword(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível atualizar a senha.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="current-password"
            className="mb-2 block text-sm font-medium text-white/60"
          >
            Senha atual
          </label>

          <div className="relative">
            <input
              id="current-password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              disabled={isSaving}
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 pr-11 text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() => setShowCurrentPassword((current) => !current)}
              disabled={isSaving}
              className="absolute inset-y-0 right-3 flex items-center text-white/40 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={
                showCurrentPassword
                  ? "Ocultar senha atual"
                  : "Mostrar senha atual"
              }
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div>
          <label
            htmlFor="new-password"
            className="mb-2 block text-sm font-medium text-white/60"
          >
            Nova senha
          </label>

          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSaving}
              autoComplete="new-password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 pr-11 text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              disabled={isSaving}
              className="absolute inset-y-0 right-3 flex items-center text-white/40 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={
                showPassword ? "Ocultar nova senha" : "Mostrar nova senha"
              }
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {passwordRequirements.map((requirement) => (
            <li
              key={requirement.label}
              className="flex items-center gap-2 text-xs"
            >
              {requirement.isValid ? (
                <Check size={14} className="text-emerald-400" />
              ) : (
                <X size={14} className="text-red-400" />
              )}

              <span
                className={
                  requirement.isValid ? "text-emerald-400" : "text-white/60"
                }
              >
                {requirement.label}
              </span>
            </li>
          ))}
        </ul>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm font-medium text-white/60"
          >
            Confirmar senha
          </label>

          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={isSaving}
              autoComplete="new-password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 pr-11 text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              disabled={isSaving}
              className="absolute inset-y-0 right-3 flex items-center text-white/40 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={
                showConfirmPassword
                  ? "Ocultar confirmação da senha"
                  : "Mostrar confirmação da senha"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSaving}
          className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            "Atualizar senha"
          )}
        </button>
      </form>
    </div>
  );
}
