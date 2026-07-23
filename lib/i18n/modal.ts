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
  signUp: {
    pt: "Cadastrar",
    en: "Sign Up",
  },
  alreadyHaveAccount: {
    pt: "Já possui uma conta?",
    en: "Already have an account?",
  },
  name: {
    pt: "Nome",
    en: "Name",
  },
  confirmPassword: {
    pt: "Confirmar senha",
    en: "Confirm password",
  },
  passwordsDoNotMatch: {
    pt: "As senhas não são iguais.",
    en: "The passwords do not match.",
  },
  creatingAccount: {
    pt: "Criando conta...",
    en: "Creating account...",
  },
  accountCreated: {
    pt: "Conta criada com sucesso.",
    en: "Account created successfully.",
  },
  checkYourEmail: {
    pt: "Verifique seu email para confirmar a conta.",
    en: "Check your email to confirm your account.",
  },
  invalidCredentials: {
    pt: "Email ou senha inválidos.",
    en: "Invalid email or password.",
  },
  signUpError: {
    pt: "Não foi possível criar a conta.",
    en: "Could not create the account.",
  },
  signingIn: {
    pt: "Entrando...",
    en: "Signing in...",
  },
} satisfies Record<string, TranslatedText>;
