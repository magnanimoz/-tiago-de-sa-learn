export type CheckoutLanguage = "pt" | "en";

export type CheckoutLocale = "pt-br" | "en-us";

export type PaymentMethod = "card" | "pix" | null;

export type CheckoutStatus =
  | "choosing"
  | "processing"
  | "pending"
  | "approved"
  | "failure";

export type PixPaymentData = {
  qrCode?: string;
  qrCodeBase64?: string;
  ticketUrl?: string;
};

export type PaymentResponse = {
  paymentId?: number;
  status?: string;
  statusDetail?: string;
  pix?: PixPaymentData;
  error?: string;
};

export type PaymentStatusRow = {
  mercado_pago_payment_id: number;
  status: string;
  status_detail: string | null;
};
