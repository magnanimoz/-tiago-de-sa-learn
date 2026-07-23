import { TranslatedText } from "@/types/translated-text";

export const modalText = {
  login: {
    pt: "Entrar",
    en: "Login",
  },
  Email: {
    pt: "Email",
    en: "Email",
  },
  password: {
    pt: "Senha",
    en: "Password",
  },
  forgot: {
    pt: "Esqueceu a senha?",
    en: "Forgot password?",
  },
  singIn: {
    pt: "Entrar",
    en: "Sign in",
  },
  or: {
    pt: "OU",
    en: "OR",
  },
  continueGoogle: {
    pt: "Continuar com Google",
    en: "Continue with Google",
  },
  newUser: {
    pt: "Novo usuário?",
    en: "New user?",
  },
  createAnAccount: {
    pt: "Criar uma conta",
    en: "Create an account",
  },
} satisfies Record<string, TranslatedText>;
