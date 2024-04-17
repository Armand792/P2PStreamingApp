import stripeModule from 'stripe';

const stripe = new stripeModule(process.env.STRIPE_SECRET_KEY ?? '');
export default stripe;
