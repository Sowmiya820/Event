import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import type { EventItem } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

async function getEvents(searchParams: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => { if (typeof value === "string") query.set(key, value); });
  const response = await fetch(`${API_URL}/events?${query}`, { cache: "no-store" });
  if (!response.ok) return { events: [] as EventItem[] };
  return response.json() as Promise<{ events: EventItem[] }>;
}

async function getCategories() {
  const response = await fetch(`${API_URL}/events/categories`, { cache: "no-store" });
  if (!response.ok) return { categories: [] as string[] };
  return response.json() as Promise<{ categories: string[] }>;
}

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedParams = await searchParams;
  const [{ events }, { categories }] = await Promise.all([getEvents(resolvedParams), getCategories()]);
  return <section><div className="mb-10 rounded-3xl bg-gradient-to-br from-primary to-indigo-700 p-8 text-white md:p-14"><p className="mb-3 font-semibold uppercase tracking-wider">Discover. Book. Attend.</p><h1 className="max-w-3xl text-4xl font-black md:text-6xl">Manage and book unforgettable events in one place.</h1><p className="mt-4 max-w-2xl text-white/80">Search conferences, concerts, meetups, and workshops with secure test-mode payments.</p></div><EventFilters categories={categories} /><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{events.map((event) => <EventCard key={event._id} event={event} />)}</div>{events.length === 0 && <p className="rounded-2xl border p-8 text-center text-muted-foreground">No events found.</p>}</section>;
}
