/**
 * @file payment service.
 */

import {
  IConfirmPayment,
  ICreateStripIntent,
  IGetUserTransactionPayload,
  IResponse,
  ITransferToPlatformUserPayload,
} from 'src/interfaces/payment.interface';

import * as repo from '../repositories/payment.repository';

/**
 * Get all user transactions.
 *
 * @returns Promise
 */
export const getUserTransaction = async (
  data: IGetUserTransactionPayload
): Promise<IResponse | []> => {
  return await repo.getUserTransactions(data);
};

/**
 * Creates stripe payment intent.
 *
 * @returns Promise
 */
export const createStripePaymentIntent = async (
  data: ICreateStripIntent
): Promise<IResponse | []> => {
  return await repo.createPaymentIntent(data);
};

/**
 * Transfer to platform user
 *
 * @returns Promise
 */
export const transferToPlatformUser = async (
  data: ITransferToPlatformUserPayload
): Promise<IResponse | []> => {
  return await repo.transferToPlatformUser(data);
};

/**
 * Confirm payment.
 *
 * @returns Promise
 */
export const confirmPayment = async (
  data: IConfirmPayment
): Promise<IResponse | []> => {
  return await repo.confirmPayment(data);
};
