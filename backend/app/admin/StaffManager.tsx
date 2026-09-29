"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, ArrowLeft, Lock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { SocialIcon } from "@/components/SocialIcons";
import { SOCIAL_PLATFORMS, normalizeSocialUrl } from "@/lib/content/socialLinks";
import { STAFF_LIMITS, STAFF_SECTIONS, authorDisplayName, type StaffMember, type StaffSection } from "@/lib/content/staff";

interface StaffResponse {
  members: StaffMember[];
  hero: { key: string; value: string; default: string; maxLength: number | null; isOverridden: boolean };
}

interface Draft {
  section: StaffSection;
  name: string;
  role: string;
  bio: string;
  image: string;
  visible: boolean;
  authorBio: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

type FieldErrors = Partial<Record<keyof Draft, string>>;

const NEW = "new" as const;

function toDraft(member: StaffMember | null): Draft {
  return {
    section: member?.section ?? "Coaching Staff",
    name: member?.name ?? "",
    role: member?.role ?? "",
    bio: member?.bio ?? "",
    image: member?.image ?? "",
    // New people start hidden so a half-filled entry never shows on the site.
    visible: member?.visible ?? false,
    authorBio: member?.authorBio ?? "",
    instagram: member?.instagram ?? "",
    facebook: member?.facebook ?? "",
    tiktok: member?.tiktok ?? "",
  };
}

async function readError(res: Response, fallback: string) {
  const data = await res.json().catch(() => ({}));
  const error = new Error(data?.error || fallback) as Error & { field?: string };
  error.field = data?.field ?? undefined;
  return error;
}

function initials(name: string) {
  return (name || "?").replace(/^coach\s+/i, "").split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase();
}

function Avatar({ member, size = "h-10 w-10" }: { member: { name: string; image: string }; size?: string }) {
  return member.image ? (
    <img src={member.image} alt="" className={`${size} shrink-0 rounded-full object-cover object-top`} />
  ) : (
    <div className={`${size} flex shrink-0 items-center justify-center rounded-full bg-gray-300 text-xs font-black text-white`}>{initials(member.name)}</div>
  );
}

function Counter({ value, max }: { value: string; max: number }) {
  return <p className="mt-1 text-xs text-gray-400">{value.length}/{max} characters</p>;
}

function HeroEditor({ hero }: { hero: StaffResponse["hero"] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [value, setValue] = useState(hero.value);
  const save = useMutation({
    mutationFn: async (next: string | null) => {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: hero.key, value: next }),
      });
      if (!res.ok) throw await readError(res, "Unable to save");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast({ title: "Staff page header saved" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });
  return (
    <section className="border border-gray-200 bg-white" data-testid="staff-hero">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
        <span className="font-black uppercase tracking-tight">Staff page header</span>
        <span className="text-xs text-gray-500">Text under &quot;Our Team&quot;</span>
      </div>
      <div className="space-y-2 p-4">
        <Textarea value={value} onChange={(event) => setValue(event.target.value)} rows={2} maxLength={hero.maxLength ?? undefined} />
        {hero.maxLength && <Counter value={value} max={hero.maxLength} />}
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => save.mutate(value)} disabled={save.isPending || !value.trim() || value === hero.value}>Save</Button>
          {hero.isOverridden && (
            <Button type="button" variant="ghost" onClick={() => { setValue(hero.default); save.mutate(null); }} disabled={save.isPending}>Reset to default</Button>
          )}
        </div>
      </div>
    </section>
  );
}

function MemberEditor({
  member,
  onSaved,
  onDeleted,
  onBack,
}: {
  member: StaffMember | null;
  onSaved: (member: StaffMember) => void;
  onDeleted: () => void;
  onBack: () => void;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [draft, setDraft] = useState<Draft>(() => toDraft(member));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [uploading, setUploading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const isNew = member === null;

  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const save = useMutation({
    mutationFn: async (payload: Draft) => {
      const res = await fetch(isNew ? "/api/admin/staff" : `/api/admin/staff/${member!.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...payload, authorBio: member?.isAuthor ? payload.authorBio : undefined }),
      });
      if (!res.ok) throw await readError(res, "Unable to save");
      return (await res.json()) as StaffMember;
    },
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast({ title: isNew ? `${saved.name} added${saved.visible ? "" : " (hidden until you switch on Show on site)"}` : `${saved.name} saved. Live within a minute.` });
      onSaved(saved);
    },
    onError: (error: Error & { field?: string }) => {
      if (error.field) setErrors({ [error.field]: error.message } as FieldErrors);
      toast({ title: error.message, variant: "destructive" });
    },
  });

  const remove = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/admin/staff/${member!.id}`, { method: "DELETE" });
      if (!res.ok) throw await readError(res, "Unable to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast({ title: `${member!.name} deleted` });
      onDeleted();
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  const submit = () => {
    const found: FieldErrors = {};
    if (!draft.name.trim()) found.name = "Name is required";
    if (!draft.role.trim()) found.role = "Title is required";
    for (const platform of SOCIAL_PLATFORMS) {
      const result = normalizeSocialUrl(platform.id, draft[platform.id]);
      if ("error" in result) found[platform.id] = result.error;
    }
    setErrors(found);
    if (Object.keys(found).length) {
      toast({ title: "Please fix the highlighted fields", variant: "destructive" });
      return;
    }
    save.mutate(draft);
  };

  const uploadPhoto = async (file?: File) => {
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
      if (!res.ok) throw new Error(result.error ?? "Failed to upload photo");
      update("image", result.url as string);
      toast({ title: "Photo uploaded. Click Save changes to publish it." });
    } catch (error) {
      toast({ title: error instanceof Error ? error.message : "Failed to upload photo", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const errorText = (key: keyof Draft) => errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>;
  const label = "mb-1.5 mt-4 block text-sm font-semibold";

  return (
    <div data-testid="staff-editor">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
        <span className="font-black uppercase tracking-tight">{isNew ? "New staff member" : member.name}</span>
        <Button type="button" variant="outline" size="sm" className="lg:hidden" onClick={onBack}><ArrowLeft className="mr-1 h-4 w-4" /> Back to list</Button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-4">
          {draft.image ? (
            <img src={draft.image} alt="" className="h-32 w-24 shrink-0 object-cover object-top" />
          ) : (
            <div className="flex h-32 w-24 shrink-0 items-center justify-center bg-gray-300 text-2xl font-black text-white">{initials(draft.name)}</div>
          )}
          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 border border-gray-300 px-3 py-2 text-sm font-bold">
              {uploading ? "Uploading…" : draft.image ? "Replace photo" : "Upload photo"}
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" disabled={uploading} onChange={(event) => uploadPhoto(event.target.files?.[0])} data-testid="staff-photo-input" />
            </label>
            <p className="mt-2 text-xs text-gray-500">PNG, JPEG, WebP or GIF, up to 5 MB. Portrait photos look best.</p>
          </div>
        </div>

        <label htmlFor="staff-name" className={label}>Name *</label>
        <Input id="staff-name" value={draft.name} maxLength={STAFF_LIMITS.name} onChange={(event) => update("name", event.target.value)} />
        <Counter value={draft.name} max={STAFF_LIMITS.name} />
        {errorText("name")}

        <label htmlFor="staff-role" className={label}>Title *</label>
        <Input id="staff-role" value={draft.role} maxLength={STAFF_LIMITS.role} onChange={(event) => update("role", event.target.value)} />
        <Counter value={draft.role} max={STAFF_LIMITS.role} />
        {errorText("role")}

        <label htmlFor="staff-bio" className={label}>Bio (shown on the Staff page)</label>
        <Textarea id="staff-bio" value={draft.bio} rows={4} maxLength={STAFF_LIMITS.bio} onChange={(event) => update("bio", event.target.value)} />
        <Counter value={draft.bio} max={STAFF_LIMITS.bio} />

        <label htmlFor="staff-section" className={label}>Section</label>
        <select
          id="staff-section"
          value={draft.section}
          onChange={(event) => update("section", event.target.value as StaffSection)}
          className="h-9 w-full border border-input bg-transparent px-3 text-sm"
        >
          {STAFF_SECTIONS.map((section) => <option key={section} value={section}>{section}</option>)}
        </select>
        <p className="mt-1 text-xs text-gray-500">Alumni Coaches show in black and white, as on the site today. Moving someone puts them at the end of the new section.</p>

        <label className="mt-5 flex items-center gap-2 text-sm font-semibold">
          <Checkbox checked={draft.visible} onCheckedChange={(value) => update("visible", value === true)} data-testid="staff-visible" /> Show on site
        </label>
        <p className="mt-1 text-xs text-gray-500">
          {member?.isAuthor ? "Turning this off also hides their blog author page." : "Turn off to hide someone without deleting them."}
        </p>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-sm font-black uppercase">Social links</p>
          <p className="mb-3 text-xs text-gray-500">Only filled boxes show an icon.</p>
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform.id} className="mb-2">
              <div className="grid grid-cols-1 items-center gap-1 sm:grid-cols-[110px_1fr] sm:gap-3">
                <label htmlFor={`staff-${platform.id}`} className="flex items-center gap-2 text-sm font-semibold">
                  <SocialIcon platform={platform.id} className="h-3.5 w-3.5" /> {platform.label}
                </label>
                <Input id={`staff-${platform.id}`} value={draft[platform.id]} placeholder={platform.example.replace("username", "…")} onChange={(event) => update(platform.id, event.target.value)} />
              </div>
              {errors[platform.id] && <p className="mt-1 text-xs text-red-600 sm:ml-[122px]">{errors[platform.id]}</p>}
            </div>
          ))}
        </div>

        {member?.isAuthor && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-sm font-black uppercase">Blog author page</p>
            <label htmlFor="staff-author-bio" className={label}>Author page bio (blank line = new paragraph)</label>
            <Textarea id="staff-author-bio" value={draft.authorBio} rows={7} maxLength={STAFF_LIMITS.authorBio} onChange={(event) => update("authorBio", event.target.value)} />
            <Counter value={draft.authorBio} max={STAFF_LIMITS.authorBio} />
            <p className="mt-1 text-xs text-gray-500">Shown on /blog/author/{member.slug} with {authorDisplayName(member).split(" ")[0]}&apos;s articles. Leave empty to use the bio above.</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={submit} disabled={save.isPending || uploading}>{isNew ? "Add staff member" : "Save changes"}</Button>
          {!isNew && !member.isAuthor && (
            <Button type="button" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => setConfirmingDelete(true)} disabled={remove.isPending}>Delete</Button>
          )}
          {isNew && <Button type="button" variant="ghost" onClick={onBack}>Cancel</Button>}
        </div>

        {member?.isAuthor && (
          <p className="mt-4 flex items-start gap-2 border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {authorDisplayName(member).split(" ")[0]} is a blog author, so they can be edited or hidden but not deleted. Their articles and author page depend on this entry.
          </p>
        )}

        {confirmingDelete && member && (
          <div className="mt-4 space-y-3 border border-red-200 bg-red-50 p-4" data-testid="staff-delete-confirm">
            <p className="text-sm font-bold">Delete {member.name} permanently? This removes them from the Staff page. To keep them for later, switch off &quot;Show on site&quot; instead.</p>
            <div className="flex gap-2">
              <Button type="button" className="bg-red-600 hover:bg-red-700" onClick={() => remove.mutate()} disabled={remove.isPending}>Yes, delete</Button>
              <Button type="button" variant="ghost" onClick={() => setConfirmingDelete(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function StaffManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState<number | typeof NEW | null>(null);
  const [mobileEditing, setMobileEditing] = useState(false);

  const { data, isLoading, isError } = useQuery<StaffResponse>({
    queryKey: ["admin-staff"],
    queryFn: async () => {
      const res = await fetch("/api/admin/staff");
      if (!res.ok) throw new Error("Failed to load staff");
      return res.json();
    },
  });

  const reorder = useMutation({
    mutationFn: async ({ section, ids }: { section: StaffSection; ids: number[] }) => {
      const res = await fetch("/api/admin/staff/reorder", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ section, ids }),
      });
      if (!res.ok) throw await readError(res, "Unable to save the order");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast({ title: "Order saved" });
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff"] });
      toast({ title: error.message, variant: "destructive" });
    },
  });

  if (isLoading) return <div className="py-12 text-center text-gray-500">Loading staff...</div>;
  if (isError || !data) return <div className="py-12 text-center text-red-600">Couldn&apos;t load staff. Refresh to try again.</div>;

  const members = data.members;
  const current = typeof selected === "number" ? members.find((member) => member.id === selected) ?? null : null;
  const editorOpen = selected === NEW || current !== null;

  const open = (id: number | typeof NEW) => {
    setSelected(id);
    setMobileEditing(true);
  };
  const close = () => {
    setSelected(null);
    setMobileEditing(false);
  };

  const move = (member: StaffMember, direction: -1 | 1) => {
    const ids = members.filter((candidate) => candidate.section === member.section).map((candidate) => candidate.id!);
    const index = ids.indexOf(member.id!);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    // Show the new order right away; the server confirms it.
    queryClient.setQueryData<StaffResponse>(["admin-staff"], (old) =>
      old && {
        ...old,
        members: old.members.map((candidate) =>
          candidate.section === member.section ? { ...candidate, sortOrder: ids.indexOf(candidate.id!) } : candidate,
        ).sort((a, b) => STAFF_SECTIONS.indexOf(a.section) - STAFF_SECTIONS.indexOf(b.section) || a.sortOrder - b.sortOrder),
      },
    );
    reorder.mutate({ section: member.section, ids });
  };

  const socialCount = (member: StaffMember) => SOCIAL_PLATFORMS.filter((platform) => member[platform.id]).length;

  return (
    <div className="space-y-6" data-testid="staff-manager">
      <HeroEditor key={data.hero.value} hero={data.hero} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <section className={`border border-gray-200 bg-white ${mobileEditing ? "hidden lg:block" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-4 py-3">
            <span className="font-black uppercase tracking-tight">Staff members</span>
            <Button type="button" onClick={() => open(NEW)} data-testid="button-add-staff"><Plus className="mr-1 h-4 w-4" /> Add staff member</Button>
          </div>
          {STAFF_SECTIONS.map((section) => {
            const inSection = members.filter((member) => member.section === section);
            return (
              <div key={section}>
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-500">{section} · {inSection.length}</div>
                {inSection.length === 0 && <p className="border-b border-gray-100 px-4 py-3 text-xs text-gray-500">No one here, so this section is hidden on the site.</p>}
                {inSection.map((member, index) => (
                  <div
                    key={member.id}
                    className={`flex items-center gap-3 border-b border-gray-100 px-4 py-2.5 ${selected === member.id ? "bg-orange-50 shadow-[inset_3px_0_0_#FF6C0E]" : "hover:bg-orange-50/50"}`}
                    data-testid={`staff-row-${member.slug}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <button type="button" aria-label={`Move ${member.name} up`} className="flex h-5 w-6 items-center justify-center border border-gray-200 bg-white disabled:opacity-30" disabled={index === 0 || reorder.isPending} onClick={() => move(member, -1)}><ArrowUp className="h-3 w-3" /></button>
                      <button type="button" aria-label={`Move ${member.name} down`} className="flex h-5 w-6 items-center justify-center border border-gray-200 bg-white disabled:opacity-30" disabled={index === inSection.length - 1 || reorder.isPending} onClick={() => move(member, 1)}><ArrowDown className="h-3 w-3" /></button>
                    </div>
                    <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => open(member.id!)}>
                      <span className={member.visible ? "" : "opacity-45"}><Avatar member={member} /></span>
                      <span className="min-w-0">
                        <span className={`block truncate font-bold ${member.visible ? "" : "text-gray-400"}`}>{member.name}</span>
                        <span className="block truncate text-xs text-gray-500">{member.role}</span>
                        <span className="mt-0.5 flex flex-wrap gap-1">
                          {member.isAuthor && <span className="rounded bg-orange-100 px-1.5 text-[10px] font-bold uppercase text-orange-700">Blog author</span>}
                          {!member.visible && <span className="rounded bg-red-100 px-1.5 text-[10px] font-bold uppercase text-red-600">Hidden</span>}
                          {socialCount(member) > 0 && <span className="rounded bg-gray-100 px-1.5 text-[10px] font-bold uppercase text-gray-500">{socialCount(member)} social</span>}
                        </span>
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </section>

        <section className={`border border-gray-200 bg-white ${mobileEditing ? "" : "hidden lg:block"}`}>
          {editorOpen ? (
            <MemberEditor
              key={selected === NEW ? "new" : `${current!.id}`}
              member={selected === NEW ? null : current}
              onSaved={(saved) => setSelected(saved.id)}
              onDeleted={close}
              onBack={close}
            />
          ) : (
            <div className="px-4 py-16 text-center text-sm text-gray-500">Select someone on the left to edit them, or add a new staff member.</div>
          )}
        </section>
      </div>
    </div>
  );
}
