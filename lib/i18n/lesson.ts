import type { TranslatedText } from "@/types/translated-text";

export const lessonText = {
  preview: {
    pt: "Prévia da aula",
    en: "Lesson preview",
  },

  fullLesson: {
    pt: "Aula completa",
    en: "Full lesson",
  },

  unlockLesson: {
    pt: "Desbloquear aula",
    en: "Unlock lesson",
  },

  oneTimePayment: {
    pt: "Pagamento único",
    en: "One-time payment",
  },

  lifetimeAccess: {
    pt: "Acesso vitalício",
    en: "Lifetime access",
  },

  key: {
    pt: "Tom",
    en: "Key",
  },

  beginner: {
    pt: "Iniciante",
    en: "Beginner",
  },

  intermediate: {
    pt: "Intermediário",
    en: "Intermediate",
  },

  advanced: {
    pt: "Avançado",
    en: "Advanced",
  },

  noCapo: {
    pt: "Sem capo",
    en: "No capo",
  },

  lessonUnlocked: {
    pt: "Aula adquirida",
    en: "Lesson unlocked",
  },

  lesson: {
    pt: "Aula",
    en: "Lesson",
  },
} satisfies Record<string, TranslatedText>;
