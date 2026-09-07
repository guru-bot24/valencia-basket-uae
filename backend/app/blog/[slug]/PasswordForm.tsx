"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form className="mx-auto max-w-md border border-gray-200 bg-white p-7 shadow-sm" onSubmit={async (event) => {
      event.preventDefault();
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/blog/${slug}/unlock`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ password }),
        });
        const body = await response.json();
        if (!response.ok) {
          setError(body.error || "Unable to unlock article");
          return;
        }
        router.refresh();
      } finally {
        setLoading(false);
      }
    }}>
      <Lock className="mb-4 h-8 w-8 text-primary" />
      <h2 className="text-2xl font-black uppercase">Protected article</h2>
      <p className="mt-2 text-sm text-gray-600">Enter the article password to continue.</p>
      <div className="mt-5"><Label htmlFor="article-password">Password</Label><Input id="article-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <Button className="mt-5 w-full" disabled={loading}>{loading ? "Checking..." : "Unlock article"}</Button>
    </form>
  );
}