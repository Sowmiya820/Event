import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" }) {
  return <button className={cn("inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50", variant === "default" && "bg-primary text-primary-foreground hover:opacity-90", variant === "outline" && "border border-border bg-white hover:bg-muted", variant === "ghost" && "hover:bg-muted", className)} {...props} />;
}
