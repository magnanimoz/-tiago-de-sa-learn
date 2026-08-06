"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useSettings } from "@/contexts/SettingsContext";
import { localePath } from "@/lib/locale-path";
import { modalText } from "@/lib/i18n/modal";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/t";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  isSignUp: boolean;
}

function getSafeRedirectPath(
  requestedPath: string | null,
  fallbackPath: string,
) {
  if (!requestedPath) {
    return fallbackPath;
  }

  const isInternalPath =
    requestedPath.startsWith("/") &&
    !requestedPath.startsWith("//") &&
    !requestedPath.includes("://") &&
    !requestedPath.includes("\\");

  return isInternalPath ? requestedPath : fallbackPath;
}

export default function LoginForm({ isSignUp }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, routeLocale } = useSettings();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (isSignUp && password !== confirmPassword) {
      setErrorMessage(t(modalText.passwordsDoNotMatch, language));
      return;
    }

    setIsSubmitting(true);

    const supabase = createClient();

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message || t(modalText.signUpError, language));
        setIsSubmitting(false);
        return;
      }

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsSubmitting(false);

      setSuccessMessage(t(modalText.checkYourEmail, language));
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(t(modalText.invalidCredentials, language));
      setIsSubmitting(false);
      return;
    }

    setEmail("");
    setPassword("");
    setIsSubmitting(false);

    const fallbackPath = localePath("/learn", routeLocale);

    const destination = getSafeRedirectPath(
      searchParams.get("next"),
      fallbackPath,
    );

    router.replace(destination);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isSignUp && (
        <div>
          <label
            htmlFor="signup-name"
            className="mb-2 block text-sm font-semibold text-white"
          >
            {t(modalText.name, language)}
          </label>

          <input
            id="signup-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t(modalText.name, language)}
            autoComplete="name"
            required
            className="
              h-12 w-full
              rounded-2xl
              border border-white/20
              bg-[#101012]/20
              px-4
              text-sm text-white
              outline-none
              transition duration-200
              placeholder:text-[#a1a1a1]/50
              focus:border-white/40
              focus:ring-1
              focus:ring-[#a1a1a1]/20
            "
          />
        </div>
      )}

      <div>
        <label
          htmlFor="auth-email"
          className="mb-2 block text-sm font-semibold text-white"
        >
          {t(modalText.Email, language)}
        </label>

        <input
          id="auth-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t(modalText.Email, language)}
          autoComplete="email"
          required
          className="
            h-12 w-full
            rounded-2xl
            border border-white/20
            bg-[#101012]/20
            px-4
            text-sm text-white
            outline-none
            transition duration-200
            placeholder:text-[#a1a1a1]/50
            focus:border-white/40
            focus:ring-1
            focus:ring-[#a1a1a1]/20
          "
        />
      </div>

      <div>
        <label
          htmlFor="auth-password"
          className="mb-2 block text-sm font-semibold text-white"
        >
          {t(modalText.password, language)}
        </label>

        <div className="relative">
          <input
            id="auth-password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            required
            minLength={6}
            className="
              h-12 w-full
              rounded-2xl
              border border-white/20
              bg-[#101012]/20
              px-4
              pr-12
              text-sm text-white
              outline-none
              transition duration-200
              placeholder:text-[#a1a1a1]/50
              focus:border-white/40
              focus:ring-1
              focus:ring-[#a1a1a1]/20
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-4 flex items-center text-white/40 transition hover:text-white"
            aria-label={
              showPassword
                ? language === "pt"
                  ? "Ocultar senha"
                  : "Hide password"
                : language === "pt"
                  ? "Mostrar senha"
                  : "Show password"
            }
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {isSignUp && (
        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm font-semibold text-white"
          >
            {t(modalText.confirmPassword, language)}
          </label>

          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            minLength={6}
            className="
              h-12 w-full
              rounded-2xl
              border border-white/20
              bg-[#101012]/20
              px-4
              text-sm text-white
              outline-none
              transition duration-200
              placeholder:text-[#a1a1a1]/50
              focus:border-white/40
              focus:ring-1
              focus:ring-[#a1a1a1]/20
            "
          />
        </div>
      )}

      {!isSignUp && (
        <div className="flex justify-end">
          <button
            type="button"
            className="
              text-sm
              text-white/50
              transition-colors
              hover:text-white
            "
          >
            {t(modalText.forgot, language)}
          </button>
        </div>
      )}

      {errorMessage && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p role="status" className="text-sm text-green-400">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          h-12 w-full
          rounded-md
          bg-[#e6007e]
          text-sm font-medium text-white
          transition duration-200
          hover:bg-[#71023f]
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {isSubmitting
          ? isSignUp
            ? t(modalText.creatingAccount, language)
            : t(modalText.signingIn, language)
          : isSignUp
            ? t(modalText.createAnAccount, language)
            : t(modalText.singIn, language)}
      </button>
    </form>
  );
}
