'use client';
import React from 'react';
import * as apiServer from '@/services/api.server';
import { ICheckoutData } from '@/interfaces/payments';
import { Button } from '@/components/index';
import notification from '@/utils/notification';
import errorFormmatter from '@/utils/errorFormatter';

import { loadStripe, StripeElements, StripePaymentElementOptions } from '@stripe/stripe-js';
import { useElements, useStripe, PaymentElement, Elements} from '@stripe/react-stripe-js';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY ?? '');

const options: StripePaymentElementOptions | undefined = {
  layout: 'auto',
};

export const StripeCheckout = ({
  checkoutData,
}: {
  checkoutData: ICheckoutData;
}) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: 'setup',
        paymentMethodCreation: 'manual',
        currency: checkoutData.currency,
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <Checkout checkoutData={checkoutData} />
    </Elements>
  );
};

const Checkout = ({ checkoutData }: { checkoutData: ICheckoutData }) => {
  const stripe = useStripe();
  const elements = useElements() as StripeElements;

  const handleSubmit = async () => {
    try {
      if (!stripe) {
        notification({
          title: 'Payment',
          message: 'Unavailable to process to the payment',
          type: 'danger',
        });
        return;
      }

      // Trigger form validation and wallet collection
      const { error: submitError } = await elements?.submit();
      if (submitError) {
        notification({
          title: 'Payment',
          message: submitError?.message ?? '',
          type: 'danger',
        });
        return;
      }

      // create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        elements,
      });

      if (error) {
        notification({
          title: 'Payment',
          message: error?.message ?? '',
          type: 'danger',
        });
        return;
      }

      // Create the PaymentIntent and obtain clientSecret
      const response = await apiServer.createStripIntent({
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        paymentMethodID: paymentMethod.id,
      });

      // Confirm the PaymentIntent using the details collected by the Payment Element
      const { error: errorConfirmation } = await stripe.confirmPayment({
        elements,
        clientSecret: response.result.data.client_secret,
        confirmParams: {
          return_url: `http://localhost:3000/completed-payment?user=${'tester'}&amount=${
            checkoutData.amount
          }&currency=${checkoutData.currency}`,
        },
      });
      
      if (errorConfirmation) {
        notification({
          title: 'Payment',
          message: errorConfirmation.message ?? '',
          type: 'danger',
        });
      } else {
        notification({
          title: 'Payment',
          message: 'Payment completed successfully',
        });
      }

    } catch (error) {
      notification({
        title: 'Payment',
        message:
          errorFormmatter(error) ?? 'Unavailable to process to the payment',
        type: 'danger',
      });
    }
  };

  return (
    <div>
      <PaymentElement options={options} />
      <Button onClick={handleSubmit}>Pay</Button>
    </div>
  );
};
