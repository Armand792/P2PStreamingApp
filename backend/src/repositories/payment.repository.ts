/**
 * @file Payment repository.
 */

import { UserModel } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { RequestError } from '../utils/errors';
import {
  IConfirmPayment,
  ICreateStripIntent,
  IGetUserTransactionPayload,
  IResponse,
  ITransferToPlatformUserPayload,
} from 'src/interfaces/payment.interface';
import stripe from '../services/stripe.services';
import { TransactionModel } from '../models/transaction.model';

/**
 * Get user transactions.
 *
 * @returns Promise
 */
export const getUserTransactions = async (
  data: IGetUserTransactionPayload
): Promise<IResponse> => {
  const transactions = await TransactionModel.getUserTransactionById({
    user_id: data.user_id,
    columns: ['trans_id', 'sender_id', 'amount', 'user_email'],
  });

  try {
    return {
      code: 200,
      message: 'User transactions',
      data: {
        transactions,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Creates a stripe payment intent.
 *
 * @returns Promise
 */
export const createPaymentIntent = async (
  data: ICreateStripIntent
): Promise<IResponse> => {
  try {
    const intent = await stripe.paymentIntents.create({
      amount: data.amount * 100,
      currency: data.currency,
      automatic_payment_methods: { enabled: true },
      payment_method: data.paymentMethodID,
    });

    return {
      code: 200,
      message: 'stripe payment intent created successfully',
      data: {
        client_secret: intent.client_secret,
        status: intent.status,
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Transfer to platform user
 *
 * @returns Promise
 */
export const transferToPlatformUser = async (
  data: ITransferToPlatformUserPayload
): Promise<IResponse> => {
  try {
    const { receiverID, user_id, amount } = data;

    const receiver = await UserModel.findUserById(receiverID, [
      'user_email',
      'user_id',
    ]);

    const sender = await UserModel.findUserById(user_id, [
      'user_id',
      'user_email',
    ]);

    if (receiverID === user_id) {
      throw new RequestError({
        code: 400,
        message:
          'Unable to process the credit transfer,sending credit to current user as receiver',
      });
    }

    if (receiver.length === 0 || sender.length === 0) {
      throw new RequestError({
        code: 400,
        message:
          'Unable to process the credit transfer,No receiver for the credit found',
      });
    }

    const senderWallet = await UserModel.findUserPaymentAccountById(user_id, [
      'wallet_balance',
    ]);

    const { wallet_balance } = senderWallet[0];

    if (wallet_balance < amount) {
      throw new RequestError({
        code: 400,
        message: 'Insufficient credit',
      });
    }

    await UserModel.updateTransfer({ receiverID, senderID: user_id, amount });
    await TransactionModel.insertTransaction({
      senderID: user_id,
      amount,
      transID: uuidv4(),
    });

    return {
      code: 200,
      message: 'Credited transferred successfully',
      data: {},
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Confirm payment.
 *
 * @returns Promise
 */
export const confirmPayment = async (
  data: IConfirmPayment
): Promise<IResponse> => {
  try {
    const userAccount = await UserModel.findUserPaymentAccountById(
      data.user_id,
      ['wallet_balance']
    );

    await UserModel.updateUserAccountPayment(
      {
        wallet_balance:
          userAccount.length > 0
            ? userAccount[0].wallet_balance + data.amount
            : data.amount,
      },
      ['wallet_balance'],
      data.user_id
    );

    return {
      code: 200,
      message: 'Payment confirmed successfully',
    };
  } catch (error) {
    throw error;
  }
};
