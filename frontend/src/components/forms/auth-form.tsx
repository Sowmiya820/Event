"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";

const schema = z.object({ name: z.string().min(2).optional(), email: z.string().email(), password: z.string().min(8) });
type FormValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, register: registerUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setError("");
    try {
      if (mode === "login") await login(values.email, values.password);
      else await registerUser(values.name ?? "", values.email, values.password);
      router.push("/dashboard");
    } catch (error) { setError(error instanceof Error ? error.message : "Authentication failed"); }
  }

  return <Card className="mx-auto max-w-md"><CardTitle>{mode === "login" ? "Login" : "Create account"}</CardTitle><form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">{mode === "register" && <div><Input placeholder="Name" {...register("name")} />{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}</div>}<div><Input placeholder="Email" type="email" {...register("email")} />{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}</div><div><Input placeholder="Password" type="password" {...register("password")} />{errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}</div>{error && <p className="text-sm text-red-600">{error}</p>}<Button className="w-full" disabled={isSubmitting}>{isSubmitting ? "Please wait..." : "Submit"}</Button></form></Card>;
}
