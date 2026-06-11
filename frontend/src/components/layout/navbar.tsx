"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { user, logout } = useAuth();
  return <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur"><nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4"><Link href="/" className="text-xl font-black text-primary">EventFlow</Link><div className="flex items-center gap-3 text-sm"><Link href="/events/create">Create</Link>{user && <Link href="/dashboard">Dashboard</Link>}{user?.role === "admin" && <Link href="/admin">Admin</Link>}{user ? <Button variant="outline" onClick={logout}>Logout</Button> : <><Link href="/login">Login</Link><Link href="/register"><Button>Register</Button></Link></>}</div></nav></header>;
}
