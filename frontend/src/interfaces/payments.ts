export interface ICheckoutData {
  currency: string;
  amount: number;
}

export interface ICreateStripIntent {
  amount: number;
  currency: string;
  paymentMethodID: string;
}

export interface IConfirmPayment {
  amount: number | null;
  status: string | null;
}

export interface ITransferToPlatformUser {
  amount: number;
  receiverID: string;
}
