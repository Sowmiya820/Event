export type Role = "user" | "organizer" | "admin";

export interface User { id?: string; _id?: string; name: string; email: string; role: Role; createdAt?: string; }
export interface EventItem {
  _id: string; title: string; description: string; category: string; imageUrl?: string; venue: string; city: string;
  startsAt: string; endsAt: string; ticketPrice: number; totalTickets: number; availableTickets: number; status: string;
  organizer?: User; createdAt?: string;
}
export interface Payment { _id: string; status: "Pending" | "Success" | "Failed"; amount: number; currency: string; }
export interface Booking { _id: string; event: EventItem; payment: Payment; quantity: number; totalAmount: number; status: string; confirmationCode: string; createdAt: string; }
