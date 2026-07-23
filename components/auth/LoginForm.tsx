"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { modalText } from "@/lib/i18n/modal";
import { t } from "@/lib/t";

export default function LoginForm() {
  const { language } = useSettings();
  return (
    <form className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-[#ffffff]"
        >
          {t(modalText.Email, language)}
        </label>

        <input
          id="email"
          type="email"
          placeholder={t(modalText.Email, language)}
          className="
            h-12 w-full
            rounded-2xl
            border border-white/20
            bg-[#101012]/20
            px-4
            text-sm text-[#ffffff]
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
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-[#ffffff]"
        >
          {t(modalText.password, language)}
        </label>

        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className="
            h-12 w-full
            rounded-2xl
            border border-white/20
          bg-[#101012]/20
            px-4
            text-sm text-[#ffffff]
            outline-none
            transition duration-200
            placeholder:text-[#a1a1a1]/50
            focus:border-white/40
            focus:ring-1
            focus:ring-[#a1a1a1]/20
          "
        />
      </div>

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

      <button
        type="submit"
        className="
          h-12 w-full
          rounded-md
          bg-[#e6007e]
          text-sm font-medium text-white
          transition duration-200
          hover:bg-[#71023f]
          active:scale-[0.99]
        "
      >
        {t(modalText.singIn, language)}
      </button>
    </form>
  );
}
