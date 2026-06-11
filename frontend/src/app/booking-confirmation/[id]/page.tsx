"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Booking } from "@/types";

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api<{ booking: Booking }>(`/bookings/${id}`).then((data) => setBooking(data.booking)).catch((error) => setError(error.message)); }, [id]);
  if (error) return <p className="text-red-600">{error}</p>;
  if (!booking) return <p>Loading confirmation...</p>;
  return <Card className="mx-auto max-w-2xl text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">✓</div><CardTitle>Booking confirmed</CardTitle><p className="mt-2 text-muted-foreground">Your payment status is {booking.payment.status}.</p><div className="my-6 rounded-xl bg-muted p-4 text-left"><p><strong>Event:</strong> {booking.event.title}</p><p><strong>Date:</strong> {formatDate(booking.event.startsAt)}</p><p><strong>Tickets:</strong> {booking.quantity}</p><p><strong>Total:</strong> {formatCurrency(booking.totalAmount)}</p><p><strong>Confirmation code:</strong> <span className="font-mono">{booking.confirmationCode}</span></p></div><Link href="/dashboard"><Button>Go to dashboard</Button></Link></Card>;
}
