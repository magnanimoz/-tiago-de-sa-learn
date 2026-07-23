"use client";

import { useSettings } from "@/contexts/SettingsContext";
import { modalText } from "@/lib/i18n/modal";
import { t } from "@/lib/t";

export default function SocialLoginButton() {
  const { language } = useSettings();

  return (
    <button
      type="button"
      className="
        flex
        h-14
        w-full
        items-center
        justify-center
        gap-3
        rounded-xl
        border
        border-[#a1a1a1]/50
        bg-[#ffffff]
        text-black
        transition-all
        duration-200
        hover:border-black/50
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5"
      >
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.7 15 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2c-2.1 1.6-4.7 2.4-7.3 2.4-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.4 5.7l6.2 5.2C36.7 38.5 44 33 44 24c0-1.3-.1-2.4-.4-3.5z"
        />
      </svg>

      <span className="font-medium">
        {t(modalText.continueGoogle, language)}
      </span>
    </button>
  );
}
