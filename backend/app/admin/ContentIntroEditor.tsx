"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ContentField {
  key: string;
  value: string;
  default: string;
  maxLength: number | null;
  isOverridden: boolean;
}

async function readError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  return new Error(data?.error || fallback);
}

function IntroForm({ field, title, hint }: { field: ContentField; title: string; hint: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [value, setValue] = useState(field.value);

  const save = useMutation({
    mutationFn: async (next: string | null) => {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: field.key, value: next }),
      });
      if (!res.ok) throw await readError(res, "Unable to save");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content-field", field.key] });
      toast({ title: `${title} saved` });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-2 p-4">
      <Textarea value={value} onChange={(event) => setValue(event.target.value)} rows={2} maxLength={field.maxLength ?? undefined} />
      {field.maxLength && <p className="text-xs text-gray-400">{value.length}/{field.maxLength} characters</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => save.mutate(value)} disabled={save.isPending || !value.trim() || value === field.value}>Save</Button>
        {field.isOverridden && (
          <Button type="button" variant="ghost" onClick={() => { setValue(field.default); save.mutate(null); }} disabled={save.isPending}>Reset to default</Button>
        )}
      </div>
      <p className="sr-only">{hint}</p>
    </div>
  );
}

/**
 * The one-line intro under a page's title, edited at the top of that page's
 * own admin tab (Staff, Events, Blog) instead of in Page Content.
 */
export function ContentIntroEditor({ contentKey, title, hint }: { contentKey: string; title: string; hint: string }) {
  const { data: field, isLoading } = useQuery<ContentField | null>({
    queryKey: ["admin-content-field", contentKey],
    queryFn: async () => {
      const res = await fetch(`/api/admin/content?key=${encodeURIComponent(contentKey)}`);
      if (!res.ok) throw await readError(res, "Failed to load");
      const rows: ContentField[] = await res.json();
      return rows[0] ?? null;
    },
  });

  return (
    <section className="border border-gray-200 bg-white" data-testid={`intro-${contentKey}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
        <span className="font-black uppercase tracking-tight">{title}</span>
        <span className="text-xs text-gray-500">{hint}</span>
      </div>
      {isLoading || !field ? (
        <p className="p-4 text-sm text-gray-500">{isLoading ? "Loading…" : "Couldn't load this text."}</p>
      ) : (
        <IntroForm key={`${field.value}:${field.isOverridden}`} field={field} title={title} hint={hint} />
      )}
    </section>
  );
}
