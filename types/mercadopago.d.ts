export {};

type MercadoPagoLocale = "pt-BR" | "en-US";

type MercadoPagoCardFormData = {
  token: string;
  issuerId: string;
  paymentMethodId: string;
  installments: string;
  identificationType: string;
  identificationNumber: string;
  cardholderName: string;
  cardholderEmail: string;
};

type MercadoPagoCardFormConfiguration = {
  amount: string;
  iframe?: boolean;

  form: {
    id: string;

    cardNumber: {
      id: string;
      placeholder?: string;
    };

    expirationDate: {
      id: string;
      placeholder?: string;
    };

    securityCode: {
      id: string;
      placeholder?: string;
    };

    cardholderName: {
      id: string;
      placeholder?: string;
    };

    issuer: {
      id: string;
      placeholder?: string;
    };

    installments: {
      id: string;
      placeholder?: string;
    };

    identificationType: {
      id: string;
      placeholder?: string;
    };

    identificationNumber: {
      id: string;
      placeholder?: string;
    };

    cardholderEmail: {
      id: string;
      placeholder?: string;
    };
  };

  callbacks: {
    onFormMounted?: (error?: unknown) => void;

    onSubmit?: (event: SubmitEvent) => void | Promise<void>;

    onFetching?: (resource: string) => void | (() => void);
  };
};

declare global {
  type MercadoPagoCardForm = {
    getCardFormData: () => MercadoPagoCardFormData;
    unmount?: () => void;
  };

  interface Window {
    MercadoPago?: MercadoPagoConstructor;
  }
}

type MercadoPagoConstructorOptions = {
  locale?: MercadoPagoLocale;
  advancedFraudPrevention?: boolean;
};

type MercadoPagoInstance = {
  cardForm: (
    configuration: MercadoPagoCardFormConfiguration,
  ) => MercadoPagoCardForm;
};

type MercadoPagoConstructor = new (
  publicKey: string,
  options?: MercadoPagoConstructorOptions,
) => MercadoPagoInstance;

declare global {
  interface Window {
    MercadoPago?: MercadoPagoConstructor;
  }
}
