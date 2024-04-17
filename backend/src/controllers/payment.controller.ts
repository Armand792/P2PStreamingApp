import { Request, Response } from 'express';
import * as apiUtils from '../utils/utils';
import * as paymentServices from '../services/payment.services';
import { DataBaseError, RequestError } from '../utils/errors';
import stripe from '../services/stripe.services';

/**
 * Post handler.
 *
 * @param  {Request} req
 * @param  {Response} res
 */

export const getUserTransactions = async (
  req: Request | any,
  res: Response
) => {
  try {
    const payload = {
      user_id: req?.user?.user_id,
    };

    const intent_information =
      await paymentServices.getUserTransaction(payload);

    res.status(200).json(apiUtils.buildSuccessResponse(intent_information));
  } catch (error) {
    if (error instanceof DataBaseError) {
      return res
        .status(422)
        .json(apiUtils.buildErrorResponse(['Server error']));
    } else if (error instanceof RequestError) {
      return res
        .status(error.code ?? 200)
        .json(apiUtils.buildErrorResponse(error));
    } else {
      return res
        .status(500)
        .json(apiUtils.buildErrorResponse(['Server error']));
    }
  }
};

/**
 * Post handler.
 *
 * @param  {Request} req
 * @param  {Response} res
 */

export const transferToPlatformUser = async (
  req: Request | any,
  res: Response
) => {
  try {
    const { receiverID, amount } = req.body;

    const payload = {
      receiverID,
      amount,
      user_id: req?.user?.user_id,
    };

    const transfer_information =
      await paymentServices.transferToPlatformUser(payload);

    res.status(200).json(apiUtils.buildSuccessResponse(transfer_information));
  } catch (error) {
    if (error instanceof DataBaseError) {
      return res
        .status(422)
        .json(apiUtils.buildErrorResponse(['Server error']));
    } else if (error instanceof RequestError) {
      return res
        .status(error.code ?? 200)
        .json(apiUtils.buildErrorResponse(error));
    } else {
      return res
        .status(500)
        .json(apiUtils.buildErrorResponse(['Server error']));
    }
  }
};

/**
 * Post handler.
 *
 * @param  {Request} req
 * @param  {Response} res
 */

export const createStripeIntent = async (req: Request | any, res: Response) => {
  try {
    const { paymentMethodID, amount, currency } = req.body;
    const payload = {
      paymentMethodID,
      amount,
      currency,
      ip: req.ip ?? '',
      user_agent: req.get('user-agent') ?? '',
      user_id: req?.user?.user_id,
    };
    const intent_information =
      await paymentServices.createStripePaymentIntent(payload);

    res.status(200).json(apiUtils.buildSuccessResponse(intent_information));
  } catch (error) {
    if (error instanceof DataBaseError) {
      return res
        .status(422)
        .json(apiUtils.buildErrorResponse(['Server error']));
    } else if (error instanceof RequestError) {
      return res
        .status(error.code ?? 200)
        .json(apiUtils.buildErrorResponse(error));
    } else {
      return res
        .status(500)
        .json(apiUtils.buildErrorResponse(['Server error']));
    }
  }
};

/**
 * Post handler.
 *
 * @param  {Request} req
 * @param  {Response} res
 */

const endpointSecret =
  'whsec_92287da3ff95e743a4d6f983fe44ec3f0c04a26d51596b3c594289ab5a0bca89'; //local secret
  
export const confirmPayment = async (req: Request | any, res: Response) => {
  try {
    let intent_information = {};

    if (process.env.NODE_ENV === 'production') {
      const sig = req.headers['stripe-signature'];
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          const payload = {
            amount: paymentIntent.amount / 100,
            status: 'succeeded',
            user_id: req?.user?.user_id,
          };

          intent_information = await paymentServices.confirmPayment(payload);

          return res
            .status(200)
            .json(apiUtils.buildSuccessResponse(intent_information));

        case 'payment_intent.payment_failed':
          intent_information = {
            message: 'Payment failed',
          };

          return res
            .status(400)
            .json(apiUtils.buildSuccessResponse(intent_information));
        default:
          intent_information = {
            message: 'Payment processing error',
          };

          return res
            .status(400)
            .json(apiUtils.buildSuccessResponse(intent_information));
      }
    } else {
      const { amount, status } = req.body;

      const payload = {
        amount,
        status,
        user_id: req?.user?.user_id,
      };

      intent_information = await paymentServices.confirmPayment(payload);

      return res
        .status(200)
        .json(apiUtils.buildSuccessResponse(intent_information));
    }
  } catch (error) {
    if (error instanceof DataBaseError) {
      return res
        .status(422)
        .json(apiUtils.buildErrorResponse(['Server error']));
    } else if (error instanceof RequestError) {
      return res
        .status(error.code ?? 200)
        .json(apiUtils.buildErrorResponse(error));
    } else {
      return res
        .status(500)
        .json(apiUtils.buildErrorResponse(['Server error']));
    }
  }
};
