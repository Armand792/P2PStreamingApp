import { JSONSchemaType } from 'ajv';
import {
  IConfirmPaymentSchema,
  ICreateStripeIntentSchema,
  ITransferToPlatformUserSchema,
} from 'src/interfaces/payment.interface';

export const CreateStripePaymentIntentSchema: JSONSchemaType<ICreateStripeIntentSchema> =
  {
    type: 'object',
    properties: {
      amount: { type: 'number' },
      currency: { type: 'string' },
      paymentMethodID: { type: 'string' },
    },
    required: ['amount', 'currency', 'paymentMethodID'],
    additionalProperties: false,
  };

export const ConfirmPaymentSchema: JSONSchemaType<IConfirmPaymentSchema> = {
  type: 'object',
  properties: {
    amount: { type: 'number' },
    status: { type: 'string' },
  },
  required: ['amount', 'status'],
  additionalProperties: false,
};

export const TransferToPlatformUserSchema: JSONSchemaType<ITransferToPlatformUserSchema> =
  {
    type: 'object',
    properties: {
      amount: { type: 'number' },
      receiverID: { type: 'string' },
    },
    required: ['amount', 'receiverID'],
    additionalProperties: false,
  };
