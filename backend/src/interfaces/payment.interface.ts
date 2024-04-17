export interface ICreateStripIntent {
  paymentMethodID: string;
  amount: number;
  currency: string;
  ip: string;
  user_agent: string;
  user_id: string;
}
export interface ICreateStripeIntentSchema {
  paymentMethodID: string;
  amount: number;
  currency: string;
}

export interface IConfirmPaymentSchema {
  amount: number;
  status: string;
}

export interface IGetUserTransactionPayload {
  user_id: string;
}

export interface IConfirmPayment {
  amount: number;
  status: string;
  user_id: string;
}

export interface ITransferToPlatformUserPayload {
  receiverID: string;
  amount: number;
  user_id: string;
}

export interface ITransferToPlatformUserSchema {
  receiverID: string;
  amount: number;
}

export interface IResponse {
  code: number;
  message: string;
  data?: any;
}
