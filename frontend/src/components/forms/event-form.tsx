"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { EventItem } from "@/types";

const schema = z.object({ title: z.string().min(3), description: z.string().min(20), category: z.string().min(2), imageUrl: z.string().optional(), venue: z.string().min(2), city: z.string().min(2), startsAt: z.string().min(1), endsAt: z.string().min(1), ticketPrice: z.coerce.number().min(0), totalTickets: z.coerce.number().min(1) });
type EventFormValues = z.infer<typeof schema>;

export function EventForm({ event }: { event?: EventItem }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventFormValues>({ resolver: zodResolver(schema), defaultValues: event ? { ...event, startsAt: event.startsAt.slice(0, 16), endsAt: event.endsAt.slice(0, 16) } : undefined });
  async function onSubmit(values: EventFormValues) {
    setError("");
    try {
      const response = await api<{ event: EventItem }>(event ? `/events/${event._id}` : "/events", { method: event ? "PUT" : "POST", body: JSON.stringify(values) });
      router.push(`/events/${response.event._id}`);
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to save event"); }
  }
  return <Card className="mx-auto max-w-3xl"><CardTitle>{event ? "Edit event" : "Create event"}</CardTitle><form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>{[["title","Title"],["category","Category"],["venue","Venue"],["city","City"],["startsAt","Starts at"],["endsAt","Ends at"],["ticketPrice","Ticket price"],["totalTickets","Total tickets"],["imageUrl","Image URL"]].map(([name,label]) => <label key={name} className="space-y-1 text-sm font-semibold">{label}<Input type={name.includes("At") ? "datetime-local" : name.includes("Price") || name.includes("Tickets") ? "number" : "text"} {...register(name as keyof EventFormValues)} />{errors[name as keyof EventFormValues] && <p className="text-sm text-red-600">Invalid value</p>}</label>)}<label className="space-y-1 text-sm font-semibold md:col-span-2">Description<Textarea {...register("description")} />{errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}</label>{error && <p className="text-sm text-red-600 md:col-span-2">{error}</p>}<Button disabled={isSubmitting} className="md:col-span-2">{isSubmitting ? "Saving..." : "Save event"}</Button></form></Card>;
}
