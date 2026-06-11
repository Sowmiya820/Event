import { EventForm } from "@/components/forms/event-form";
import type { EventItem } from "@/types";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
async function getEvent(id: string) { const response = await fetch(`${API_URL}/events/${id}`, { cache: "no-store" }); return response.ok ? ((await response.json()).event as EventItem) : undefined; }
export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const event = await getEvent(id); return event ? <EventForm event={event} /> : <p>Event not found.</p>; }
