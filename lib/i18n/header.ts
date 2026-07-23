import { TranslatedText } from "@/types/translated-text";

export const headerText = {
  home: {
    pt: "Início",
    en: "Home",
  },

  learn: {
    pt: "Learn",
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
  myAccount: {
    pt: "Minha conta",
    en: "My account",
  },
  myPurchases: {
    pt: "Minhas compras",
    en: "My purchases",
  },
  signOut: {
    pt: "Sair",
    en: "Sign out",
  },
  accountMenu: {
    pt: "Menu da conta",
    en: "Account menu",
  },
  userFallback: {
    pt: "Usuário",
    en: "User",
  },
} satisfies Record<string, TranslatedText>;
