export {};

type MercadoPagoLocale = "pt-BR" | "en-US";

type MercadoPagoCardFormFieldStyle = {
  color?: string;
  fontSize?: string;
  fontFamily?: string;
};

type MercadoPagoCardFormField = {
  id: string;
  placeholder?: string;
  style?: MercadoPagoCardFormFieldStyle;
};

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

type MercadoPagoPaymentMethod = {
  id?: string;
};

type MercadoPagoPaymentMethodsResponse = {
  results?: MercadoPagoPaymentMethod[];
};

type MercadoPagoCardFormConfiguration = {
  amount: string;
  iframe?: boolean;

  form: {
    id: string;
    cardNumber: MercadoPagoCardFormField;
    expirationDate: MercadoPagoCardFormField;
    securityCode: MercadoPagoCardFormField;
    cardholderName: MercadoPagoCardFormField;
    issuer: MercadoPagoCardFormField;
    installments: MercadoPagoCardFormField;
    identificationType: MercadoPagoCardFormField;
    identificationNumber: MercadoPagoCardFormField;
    cardholderEmail: MercadoPagoCardFormField;
  };

  callbacks: {
    onBinChange?: (bin: string) => void | Promise<void>;
    onFormMounted?: (error?: unknown) => void;
    onSubmit?: (event: Event) => void | Promise<void>;
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

  getPaymentMethods: (params: {
    bin: string;
  }) => Promise<MercadoPagoPaymentMethodsResponse>;
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
