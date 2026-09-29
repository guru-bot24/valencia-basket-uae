"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SocialIcon } from "@/components/SocialIcons";
import { SOCIAL_PLATFORMS, normalizeSocialUrl, type SocialPlatform } from "@/lib/content/socialLinks";

type Links = Record<SocialPlatform, string>;

interface StaffSocialRow {
  slug: string;
  name: string;
  role: string;
  group: string;
  image: string;
  links: Links;
  lastModified: string | null;
}

const EMPTY_LINKS: Links = { instagram: "", facebook: "", tiktok: "" };

function StaffSocialEditor({ row }: { row: StaffSocialRow }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [links, setLinks] = useState<Links>(row.links);
  const [errors, setErrors] = useState<Partial<Links>>({});

  const save = useMutation({
    mutationFn: async (next: Links) => {
      const res = await fetch("/api/admin/staff-social", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: row.slug, links: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.platform) setErrors({ [data.platform]: data.error });
        throw new Error(data.error ?? "Unable to save links");
      }
      return data.links as Links;
    },
    onSuccess: (saved) => {
      setLinks(saved);
      queryClient.invalidateQueries({ queryKey: ["admin-staff-social"] });
      toast({ title: `Links saved for ${row.name}` });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  const submit = (next: Links) => {
    const found: Partial<Links> = {};
    for (const platform of SOCIAL_PLATFORMS) {
      const result = normalizeSocialUrl(platform.id, next[platform.id]);
      if ("error" in result) found[platform.id] = result.error;
    }
    setErrors(found);
    if (Object.keys(found).length === 0) save.mutate(next);
  };

  const dirty = SOCIAL_PLATFORMS.some((platform) => links[platform.id].trim() !== row.links[platform.id]);
  const hasAny = SOCIAL_PLATFORMS.some((platform) => row.links[platform.id]);

  return (
    <div className="space-y-3" data-testid={`staff-social-${row.slug}`}>
      <div className="flex items-center gap-3">
        <img src={row.image} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover object-top" />
        <div className="min-w-0">
          <p className="font-bold">{row.name}</p>
          <p className="text-xs text-gray-500">{row.role} · {row.group}</p>
        </div>
      </div>
      {SOCIAL_PLATFORMS.map((platform) => (
        <div key={platform.id}>
          <div className="grid grid-cols-1 items-center gap-1 sm:grid-cols-[110px_1fr] sm:gap-3">
            <label htmlFor={`${row.slug}-${platform.id}`} className="flex items-center gap-2 text-sm font-semibold">
              <SocialIcon platform={platform.id} className="h-3.5 w-3.5" /> {platform.label}
            </label>
            <Input
              id={`${row.slug}-${platform.id}`}
              value={links[platform.id]}
              placeholder={platform.example.replace("username", "…")}
              onChange={(event) => {
                setLinks({ ...links, [platform.id]: event.target.value });
                setErrors({ ...errors, [platform.id]: undefined });
              }}
            />
          </div>
          {errors[platform.id] && <p className="mt-1 text-xs text-red-600 sm:ml-[122px]">{errors[platform.id]}</p>}
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => submit(links)} disabled={save.isPending || !dirty}>Save</Button>
        {hasAny && (
          <Button type="button" variant="ghost" onClick={() => { setLinks(EMPTY_LINKS); submit(EMPTY_LINKS); }} disabled={save.isPending}>
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}

/** Body of the "Staff Social Links" section in Page Content. */
export function StaffSocialManager() {
  const { data: rows = [], isLoading } = useQuery<StaffSocialRow[]>({
    queryKey: ["admin-staff-social"],
    queryFn: async () => {
      const res = await fetch("/api/admin/staff-social");
      if (!res.ok) throw new Error("Failed to load staff social links");
      return res.json();
    },
  });

  if (isLoading) return <p className="text-sm text-gray-500">Loading staff…</p>;

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Paste each coach&apos;s public profile link. Only filled boxes show an icon on the Staff page (and on Maros&apos;s and Martin&apos;s author pages). Leave a box empty to hide that icon.
      </p>
      {rows.map((row, index) => (
        <div key={`${row.slug}:${row.lastModified ?? "none"}`} className={index > 0 ? "border-t border-gray-100 pt-6" : ""}>
          <StaffSocialEditor row={row} />
        </div>
      ))}
    </div>
  );
}
