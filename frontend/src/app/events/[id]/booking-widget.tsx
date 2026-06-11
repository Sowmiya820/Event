"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { EventItem } from "@/types";

export function BookingWidget({ event }: { event: EventItem }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  async function book() {
    if (!user) return router.push("/login");
    setLoading(true);
    setMessage("Creating Stripe test payment...");
    try {
      const payment = await api<{ clientSecret: string; paymentIntentId: string }>("/bookings/payment-intent", { method: "POST", body: JSON.stringify({ eventId: event._id, quantity }) });
      setMessage("Redirecting to Stripe test checkout. Use card 4242 4242 4242 4242.");
      router.push(`/checkout?client_secret=${encodeURIComponent(payment.clientSecret)}&payment_intent=${payment.paymentIntentId}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Booking failed"); }
    setLoading(false);
  }

  return <Card className="h-fit"><CardTitle>Book tickets</CardTitle><p className="mt-2 text-sm text-muted-foreground">Stripe test mode integration creates a pending payment and confirms successful payments in MongoDB.</p><label className="mt-6 block text-sm font-semibold">Quantity</label><Input type="number" min={1} max={event.availableTickets} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /><p className="mt-4 text-2xl font-black">{formatCurrency(event.ticketPrice * quantity)}</p><Button className="mt-4 w-full" disabled={loading || event.availableTickets < 1} onClick={book}>{loading ? "Processing..." : "Pay in test mode"}</Button>{message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}</Card>;
}
