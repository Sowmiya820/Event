import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = { title: "EventFlow", description: "Full-stack event management system" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><AuthProvider><Navbar /><main className="mx-auto max-w-7xl px-4 py-8">{children}</main></AuthProvider></body></html>;
}
