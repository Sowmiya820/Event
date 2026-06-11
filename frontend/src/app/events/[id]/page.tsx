import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { EventItem } from "@/types";
import { BookingWidget } from "./booking-widget";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

async function getEvent(id: string) {
  const response = await fetch(`${API_URL}/events/${id}`, { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()).event as EventItem;
}

export default async function EventDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return <p>Event not found.</p>;
  return <div className="grid gap-8 lg:grid-cols-[1fr_360px]"><section><div className="mb-4 rounded-xl bg-muted px-3 py-1 text-sm font-semibold text-primary w-fit">{event.category}</div><h1 className="text-4xl font-black">{event.title}</h1><p className="mt-4 text-muted-foreground">{event.description}</p><div className="mt-8 grid gap-4 md:grid-cols-2"><Card><strong>Date</strong><p>{formatDate(event.startsAt)}</p></Card><Card><strong>Venue</strong><p>{event.venue}, {event.city}</p></Card><Card><strong>Price</strong><p>{formatCurrency(event.ticketPrice)}</p></Card><Card><strong>Tickets left</strong><p>{event.availableTickets}</p></Card></div><div className="mt-6 flex gap-3"><Link href={`/events/${event._id}/edit`}><Button variant="outline">Edit event</Button></Link></div></section><BookingWidget event={event} /></div>;
}
