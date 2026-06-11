"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Booking } from "@/types";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { api<{ bookings: Booking[] }>("/bookings/my").then((data) => setBookings(data.bookings)).catch((error) => setError(error.message)); }, []);
  return <section><h1 className="mb-6 text-3xl font-black">My booked events</h1>{error && <p className="text-red-600">{error}</p>}<div className="grid gap-4">{bookings.map((booking) => <Card key={booking._id}><CardTitle>{booking.event.title}</CardTitle><p className="text-sm text-muted-foreground">{formatDate(booking.event.startsAt)} · {booking.quantity} ticket(s) · {formatCurrency(booking.totalAmount)}</p><p className="mt-2 font-mono text-sm">Confirmation: {booking.confirmationCode}</p><Link className="text-primary" href={`/booking-confirmation/${booking._id}`}>View confirmation</Link></Card>)}</div></section>;
}
