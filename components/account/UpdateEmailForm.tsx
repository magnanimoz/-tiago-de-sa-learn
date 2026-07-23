"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";

export default function UpdateEmailForm() {
  const { user, updateEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit =
    email.trim().length > 0 &&
    email.trim().toLowerCase() !== user?.email?.toLowerCase();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      await updateEmail(email);

      toast.success(`Enviamos um e-mail de confirmação para ${email}.`);

      setEmail("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível atualizar o e-mail.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div>
        <p className="text-sm font-medium text-white/60">E-mail atual</p>

        <p className="mt-1 text-white">{user?.email}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label
            htmlFor="new-email"
            className="mb-2 block text-sm font-medium text-white/60"
          >
            Novo e-mail
          </label>

          <input
            id="new-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSaving}
            autoComplete="email"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSaving}
          className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <LoaderCircle size={18} className="animate-spin" />
          ) : (
            "Atualizar e-mail"
          )}
        </button>
      </form>
    </div>
  );
}
