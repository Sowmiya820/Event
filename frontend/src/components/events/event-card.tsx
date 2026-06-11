import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { EventItem } from "@/types";

export function EventCard({ event }: { event: EventItem }) {
  return <Card className="flex h-full flex-col gap-3"><div className="rounded-xl bg-muted px-3 py-1 text-xs font-semibold text-primary w-fit">{event.category}</div><CardTitle>{event.title}</CardTitle><p className="line-clamp-3 text-sm text-muted-foreground">{event.description}</p><div className="mt-auto space-y-2 text-sm"><p className="flex gap-2"><Calendar size={16} />{formatDate(event.startsAt)}</p><p className="flex gap-2"><MapPin size={16} />{event.venue}, {event.city}</p><p className="font-bold">{formatCurrency(event.ticketPrice)}</p></div><Link href={`/events/${event._id}`} className="rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground">View details</Link></Card>;
}
