import { NextResponse } from 'next/server'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

if (!process.env.STRIPE_PREMIUM_PLAN_PRICE_ID) {
  throw new Error('STRIPE_PREMIUM_PLAN_PRICE_ID is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
} as Stripe.StripeConfig);

export async function POST(req: Request) {
  try {
    const { email, userId } = await req.json();

    console.log('Creating checkout session with:');
    console.log('Email:', email);
    console.log('User ID:', userId);
    console.log('Price ID:', process.env.STRIPE_PREMIUM_PLAN_PRICE_ID);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      client_reference_id: userId,
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PLAN_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/signup/premium/cancel`,
    });

    console.log('Checkout session created successfully');
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error('Error in create-checkout-session:', err);
    if (err instanceof Stripe.errors.StripeError) {
      console.error('Stripe error type:', err.type);
      console.error('Stripe error message:', err.message);
    }
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}















