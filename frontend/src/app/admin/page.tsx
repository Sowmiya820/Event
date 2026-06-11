"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import type { User } from "@/types";

interface Stats { users: number; events: number; bookings: number; revenue: number; }
export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { Promise.all([api<Stats>("/admin/stats"), api<{ users: User[] }>("/admin/users")]).then(([stats, users]) => { setStats(stats); setUsers(users.users); }).catch((error) => setError(error.message)); }, []);
  return <section><h1 className="mb-6 text-3xl font-black">Admin dashboard</h1>{error && <p className="text-red-600">{error}</p>}<div className="mb-8 grid gap-4 md:grid-cols-4">{stats && Object.entries(stats).map(([key, value]) => <Card key={key}><p className="text-sm capitalize text-muted-foreground">{key}</p><CardTitle>{value}</CardTitle></Card>)}</div><Card><CardTitle>Users</CardTitle><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{users.map((user) => <tr key={user._id ?? user.id} className="border-t"><td className="py-3">{user.name}</td><td>{user.email}</td><td>{user.role}</td></tr>)}</tbody></table></div></Card></section>;
}
