"use client";

import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "pk_test_51DummyTestKeyReplaceMe");

function CheckoutForm({ clientSecret, paymentIntentId }: { clientSecret: string; paymentIntentId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [message, setMessage] = useState("Use Stripe test card 4242 4242 4242 4242 with any future expiry and CVC.");
  const [loading, setLoading] = useState(false);

  async function pay() {
    if (!stripe || !elements) return;
    const card = elements.getElement(CardElement);
    if (!card) return;
    setLoading(true);
    const result = await stripe.confirmCardPayment(clientSecret, { payment_method: { card } });
    if (result.error) {
      setMessage(result.error.message ?? "Payment failed");
      setLoading(false);
      return;
    }
    const booking = await api<{ booking: { _id: string } }>("/bookings/confirm", { method: "POST", body: JSON.stringify({ paymentIntentId }) });
    router.push(`/booking-confirmation/${booking.booking._id}`);
  }

  return <Card className="mx-auto max-w-lg"><CardTitle>Stripe test checkout</CardTitle><p className="mt-2 text-sm text-muted-foreground">{message}</p><div className="my-6 rounded-lg border p-4"><CardElement options={{ hidePostalCode: true }} /></div><Button className="w-full" disabled={!stripe || loading} onClick={pay}>{loading ? "Confirming..." : "Pay and confirm booking"}</Button></Card>;
}

function CheckoutContent() {
  const params = useSearchParams();
  const clientSecret = params.get("client_secret");
  const paymentIntentId = params.get("payment_intent");
  if (!clientSecret || !paymentIntentId) return <p>Missing payment details.</p>;
  return <Elements stripe={stripePromise}><CheckoutForm clientSecret={clientSecret} paymentIntentId={paymentIntentId} /></Elements>;
}

export default function CheckoutPage() {
  return <Suspense fallback={<p>Loading checkout...</p>}><CheckoutContent /></Suspense>;
}
