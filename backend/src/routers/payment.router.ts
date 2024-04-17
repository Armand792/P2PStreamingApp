/**
 * @file payment routes
 */
import { Router } from 'express';
import { authorization } from '../middlewares/app.middleware';
import {
  confirmPayment,
  createStripeIntent,
  getUserTransactions,
  transferToPlatformUser,
} from '../controllers/payment.controller';
import {
  ConfirmPaymentSchema,
  CreateStripePaymentIntentSchema,
  TransferToPlatformUserSchema,
} from '../schemas/payment.schema';
import { validateSchema, whitelist } from '../utils/utils';

const router = Router();

router
  .route('/create-intent')
  .post(
    [authorization, validateSchema(CreateStripePaymentIntentSchema)],
    createStripeIntent
  );

router
  .route('/get-user-transaction')
  .get(
    [authorization], 
    getUserTransactions
  );

router
  .route('/confirm-payment')
  .post([authorization, validateSchema(ConfirmPaymentSchema)], 
  confirmPayment
  );

router
  .route('/transfer-to-platform-user')
  .post(
    [authorization, validateSchema(TransferToPlatformUserSchema)],
    transferToPlatformUser
  );

export default router;
