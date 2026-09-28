"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

interface ContentRow {
  key: string;
  page: string;
  label: string;
  type: "text" | "textarea" | "image";
  maxLength: number | null;
  default: string;
  value: string;
  isOverridden: boolean;
  lastModified: string | null;
}

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return data?.error || fallback;
  } catch {
    return fallback;
  }
}

function ContentFieldEditor({ row }: { row: ContentRow }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [value, setValue] = useState(row.value);
  const [uploading, setUploading] = useState(false);

  const save = useMutation({
    mutationFn: async (nextValue: string | null) => {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: row.key, value: nextValue }),
      });
      if (!res.ok) throw new Error(await readError(res, "Unable to save"));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-page-content"] });
      toast({ title: "Content saved" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  const handleReset = () => {
    setValue(row.default);
    save.mutate(null);
  };

  const uploadImage = async (file?: File) => {
    if (!file) return;
    if (!file.type.match(/^image\/(?:png|jpeg|webp|gif)$/) || file.size > 5 * 1024 * 1024) {
      toast({ title: "Use a PNG, JPEG, WebP, or GIF image no larger than 5 MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/blog/upload-image", { method: "POST", body });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Failed to upload image");
      setValue(result.url as string);
      save.mutate(result.url as string);
    } catch (error) {
      toast({ title: error instanceof Error ? error.message : "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-bold">{row.label}</span>
        {row.isOverridden && <span className="text-xs font-bold uppercase text-[#FF6C0E]">Customized</span>}
        <span className="text-[11px] text-gray-400">
          {row.lastModified ? `Last modified: ${new Date(row.lastModified).toLocaleDateString()}` : "Using site default"}
        </span>
      </div>

      {row.type === "image" ? (
        <div className="space-y-3">
          <img src={value} alt="" className="max-h-48 w-full max-w-md rounded object-cover" />
          <label className="inline-flex cursor-pointer items-center gap-2 border border-gray-300 px-3 py-2 text-sm font-bold">
            {uploading ? "Uploading…" : "Replace image"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => uploadImage(event.target.files?.[0])}
            />
          </label>
        </div>
      ) : (
        <>
          {row.type === "textarea" ? (
            <Textarea value={value} onChange={(event) => setValue(event.target.value)} rows={3} maxLength={row.maxLength ?? undefined} />
          ) : (
            <Input value={value} onChange={(event) => setValue(event.target.value)} maxLength={row.maxLength ?? undefined} />
          )}
          {row.maxLength && (
            <p className="text-xs text-gray-400">{value.length}/{row.maxLength} characters</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => save.mutate(value)} disabled={save.isPending || !value.trim()}>Save</Button>
            <Button type="button" variant="ghost" onClick={handleReset} disabled={save.isPending}>Reset to default</Button>
          </div>
        </>
      )}
    </div>
  );
}

export function PageContentManager() {
  const { data: rows = [], isLoading } = useQuery<ContentRow[]>({
    queryKey: ["admin-page-content"],
    queryFn: async () => {
      const res = await fetch("/api/admin/content");
      if (!res.ok) throw new Error(await readError(res, "Failed to load page content"));
      return res.json();
    },
  });

  if (isLoading) {
    return <div className="py-12 text-center text-gray-500">Loading page content...</div>;
  }

  const groups = new Map<string, ContentRow[]>();
  for (const row of rows) {
    const group = groups.get(row.page) ?? [];
    group.push(row);
    groups.set(row.page, group);
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Edit key text and images on the live site without touching code. Fields left untouched keep the site default.</p>
      <Accordion type="multiple" className="border border-gray-200">
        {[...groups.entries()].map(([page, fields]) => (
          <AccordionItem key={page} value={page} className="border-b border-gray-200 last:border-b-0">
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
              <span className="font-black uppercase tracking-tight">{page}</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 px-4 pb-4">
              {fields.map((row, index) => (
                <div key={row.key} className={index > 0 ? "border-t border-gray-100 pt-6" : ""}>
                  <ContentFieldEditor row={row} />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
