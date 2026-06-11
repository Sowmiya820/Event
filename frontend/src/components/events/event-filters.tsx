"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EventFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [category, setCategory] = useState(params.get("category") ?? "");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (category) query.set("category", category);
    router.push(`/?${query.toString()}`);
  }

  return <form onSubmit={submit} className="mb-8 grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-[1fr_220px_auto]"><Input placeholder="Search events..." value={search} onChange={(event) => setSearch(event.target.value)} /><select className="rounded-lg border px-3 py-2" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select><Button>Filter</Button></form>;
}
