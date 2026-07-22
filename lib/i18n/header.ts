import { TranslatedText } from "@/types/translated-text";

export const headerText = {
  home: {
    pt: "Início",
    en: "Home",
  },

  learn: {
    pt: "Aprenda",
    en: "Learn",
  },

  portfolio: {
    pt: "Portfólio",
    en: "Portfolio",
  },

  about: {
    pt: "Sobre",
    en: "About",
  },

  contact: {
    pt: "Contato",
    en: "Contact",
  },

  login: {
    pt: "Entrar",
    en: "Login",
  },

  openMenu: {
    pt: "Abrir menu",
    en: "Open menu",
  },

  closeMenu: {
    pt: "Fechar menu",
    en: "Close menu",
  },
} satisfies Record<string, TranslatedText>;
