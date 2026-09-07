"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlignCenter, AlignLeft, AlignRight, ArrowLeft, Bold, ChevronDown, ChevronUp,
  Code2, Expand, ImagePlus, Italic, Link2, List, ListOrdered, Maximize2,
  Minus, Palette, Quote, Redo2, RotateCcw, Search, Star, Trash2, Undo2, X,
  Monitor, Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sanitizeBlogContent, sanitizeBlogHtml } from "@/lib/blog";
import type { SafeBlogPost } from "@/lib/storage";

type Visibility = "public" | "private" | "password";
type Status = "draft" | "published" | "scheduled";
type TaxonomyItem = { id: number; name: string; slug: string; usage: number };
type TaxonomyResponse = { categories: TaxonomyItem[]; tags: TaxonomyItem[] };

type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageSrc: string;
  featuredImageAlt: string;
  authorName: string;
  status: Status;
  visibility: Visibility;
  password: string;
  publishedAt: string;
  lockModifiedDate: boolean;
  isFeatured: boolean;
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  focusKeywords: string[];
  noIndex: boolean;
  categoryNames: string[];
  tagNames: string[];
};

const emptyForm: BlogForm = {
  title: "", slug: "", excerpt: "", content: "", featuredImageSrc: "",
  featuredImageAlt: "", authorName: "Valencia Basket Academy UAE", status: "draft",
  visibility: "public", password: "", publishedAt: "", lockModifiedDate: false,
  isFeatured: false, metaTitle: "", metaDescription: "", ogTitle: "",
  ogDescription: "", ogImage: "", focusKeywords: [], noIndex: false,
  categoryNames: [], tagNames: [],
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toLocalDateTime(value: Date | string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

function fromPost(post: SafeBlogPost | null): BlogForm {
  if (!post) return emptyForm;
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    featuredImageSrc: post.featuredImageSrc ?? "",
    featuredImageAlt: post.featuredImageAlt ?? "",
    authorName: post.authorName,
    status: post.status as Status,
    visibility: post.visibility as Visibility,
    password: "",
    publishedAt: toLocalDateTime(post.publishedAt),
    lockModifiedDate: post.lockModifiedDate,
    isFeatured: post.isFeatured,
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    ogTitle: post.ogTitle ?? "",
    ogDescription: post.ogDescription ?? "",
    ogImage: post.ogImage ?? "",
    focusKeywords: (post.focusKeyword ?? "").split(",").map((value) => value.trim()).filter(Boolean),
    noIndex: post.noIndex,
    categoryNames: post.categories.map((category) => category.name),
    tagNames: post.tags.map((tag) => tag.name),
  };
}

function plainText(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function Panel({ title, children, defaultOpen = true, badge }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; badge?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden rounded-none border-gray-200 shadow-none">
      <CardHeader className="p-0">
        <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left">
          <span className="flex items-center gap-2 text-sm font-black uppercase tracking-wide">{title}{badge}</span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </CardHeader>
      {open && <CardContent className="border-t p-4">{children}</CardContent>}
    </Card>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? "bg-green-100 text-green-800" : score >= 45 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${color}`}>{score}/100</span>;
}

function LengthMeter({ value, recommended }: { value: string; recommended: number }) {
  const ratio = Math.min(value.length / recommended, 1);
  const color = value.length > recommended ? "bg-red-500" : value.length >= recommended * 0.7 ? "bg-green-500" : "bg-yellow-500";
  return (
    <div className="mt-1">
      <div className="mb-1 flex justify-between text-xs text-gray-500"><span>{value.length}/{recommended}</span><span>{value.length * 8}px/{recommended * 8}px</span></div>
      <div className="h-1.5 bg-gray-100"><div className={`h-full ${color}`} style={{ width: `${ratio * 100}%` }} /></div>
    </div>
  );
}

function RichEditor({ value, onChange, onBlur }: { value: string; onChange: (value: string) => void; onBlur: () => void }) {
  const [codeMode, setCodeMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!codeMode && editorRef.current) editorRef.current.innerHTML = sanitizeBlogHtml(value);
  }, [codeMode]);

  const command = (name: string, argument?: string) => {
    editorRef.current?.focus();
    document.execCommand(name, false, argument);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const switchMode = () => {
    if (codeMode) {
      const safe = sanitizeBlogContent(value);
      onChange(safe);
      setCodeMode(false);
      window.requestAnimationFrame(() => {
        if (editorRef.current) editorRef.current.innerHTML = sanitizeBlogHtml(safe);
      });
    } else {
      if (editorRef.current) onChange(editorRef.current.innerHTML);
      setCodeMode(true);
    }
  };

  const insertLink = () => {
    const url = window.prompt("Enter an HTTPS, mailto, site, or anchor URL");
    if (url && /^(?:https?:\/\/|mailto:|\/|#)/i.test(url)) command("createLink", url);
  };

  const insertImage = () => {
    const url = window.prompt("Enter an HTTPS image URL or site image path");
    if (url && /^(?:https:\/\/|\/)/i.test(url)) command("insertImage", url);
  };

  const toolbarButton = (label: string, icon: React.ReactNode, action: () => void) => (
    <button type="button" title={label} aria-label={label} onMouseDown={(event) => { event.preventDefault(); action(); }} className="flex h-8 w-8 items-center justify-center border-r border-gray-200 text-gray-700 hover:bg-gray-100">
      {icon}
    </button>
  );

  return (
    <div className={fullscreen ? "fixed inset-0 z-50 flex flex-col bg-white p-4" : "border border-gray-300 bg-white"}>
      <div className="sticky top-0 z-10 flex flex-wrap items-center border-b bg-gray-50">
        <button type="button" onClick={insertImage} className="flex h-8 items-center gap-1 border-r px-2 text-xs font-bold"><ImagePlus className="h-4 w-4" /> Add Media</button>
        <select aria-label="Block format" className="h-8 border-r bg-white px-2 text-xs" defaultValue="p" onChange={(event) => command("formatBlock", event.target.value)}>
          <option value="p">Paragraph</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="h4">Heading 4</option><option value="blockquote">Quote</option>
        </select>
        {toolbarButton("Bold", <Bold className="h-4 w-4" />, () => command("bold"))}
        {toolbarButton("Italic", <Italic className="h-4 w-4" />, () => command("italic"))}
        {toolbarButton("Bullet list", <List className="h-4 w-4" />, () => command("insertUnorderedList"))}
        {toolbarButton("Numbered list", <ListOrdered className="h-4 w-4" />, () => command("insertOrderedList"))}
        {toolbarButton("Blockquote", <Quote className="h-4 w-4" />, () => command("formatBlock", "blockquote"))}
        {toolbarButton("Align left", <AlignLeft className="h-4 w-4" />, () => command("justifyLeft"))}
        {toolbarButton("Align center", <AlignCenter className="h-4 w-4" />, () => command("justifyCenter"))}
        {toolbarButton("Align right", <AlignRight className="h-4 w-4" />, () => command("justifyRight"))}
        {toolbarButton("Insert link", <Link2 className="h-4 w-4" />, insertLink)}
        {toolbarButton("Text color", <Palette className="h-4 w-4" />, () => { const color = window.prompt("Enter a color name or hex value", "#ff6c0e"); if (color) command("foreColor", color); })}
        {toolbarButton("Special character", <Star className="h-4 w-4" />, () => { const character = window.prompt("Enter a special character", "★"); if (character) command("insertText", character); })}
        {toolbarButton("Undo", <Undo2 className="h-4 w-4" />, () => command("undo"))}
        {toolbarButton("Redo", <Redo2 className="h-4 w-4" />, () => command("redo"))}
        <button type="button" onClick={switchMode} className={`ml-auto flex h-8 items-center gap-1 border-l px-2 text-xs font-bold ${codeMode ? "bg-black text-white" : ""}`}><Code2 className="h-4 w-4" /> {codeMode ? "Visual" : "Code"}</button>
        <button type="button" onClick={() => setFullscreen((value) => !value)} className="flex h-8 items-center border-l px-2" title="Fullscreen"><Maximize2 className="h-4 w-4" /></button>
      </div>
      {codeMode ? (
        <Textarea aria-label="Article HTML code" className="min-h-[420px] flex-1 resize-y rounded-none border-0 font-mono focus-visible:ring-0" value={value} onChange={(event) => onChange(event.target.value)} onBlur={onBlur} />
      ) : (
        <div ref={editorRef} contentEditable suppressContentEditableWarning aria-label="Article content" className="prose min-h-[420px] max-w-none flex-1 resize-y overflow-auto p-5 outline-none" onInput={(event) => onChange(event.currentTarget.innerHTML)} onBlur={onBlur} />
      )}
    </div>
  );
}

export function BlogEditor({ post, adminName, onClose, onSaved, onDelete }: {
  post: SafeBlogPost | null;
  adminName: string;
  onClose: () => void;
  onSaved: (post: SafeBlogPost) => void;
  onDelete?: () => void;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<BlogForm>(() => fromPost(post));
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [editingSlug, setEditingSlug] = useState(false);
  const [slugDraft, setSlugDraft] = useState(form.slug);
  const [statusEditing, setStatusEditing] = useState(false);
  const [visibilityEditing, setVisibilityEditing] = useState(false);
  const [dateEditing, setDateEditing] = useState(false);
  const [seoEditing, setSeoEditing] = useState(false);
  const [seoTab, setSeoTab] = useState<"general" | "social" | "advanced">("general");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [categoryTab, setCategoryTab] = useState<"all" | "most">("all");
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [tagDraft, setTagDraft] = useState("");
  const [dirty, setDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(post ? new Date(post.updatedAt) : null);
  const dirtyRef = useRef(false);

  const taxonomy = useQuery<TaxonomyResponse>({
    queryKey: ["admin-blog-meta"],
    queryFn: async () => {
      const response = await fetch("/api/admin/blog/meta");
      if (!response.ok) throw new Error("Failed to load categories and tags");
      return response.json();
    },
  });

  const updateField = <K extends keyof BlogForm>(field: K, value: BlogForm[K]) => {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "title" && !slugTouched) next.slug = slugify(String(value));
      return next;
    });
    setDirty(true);
    dirtyRef.current = true;
  };

  const scheduleValid = form.status !== "scheduled" || !!form.publishedAt;
  const passwordValid = form.visibility !== "password" || !!post || form.password.length >= 8;
  const hasRequired = form.title.trim().length >= 3 && plainText(form.content).length > 0 && form.categoryNames.length > 0 && !!form.slug && scheduleValid && passwordValid;
  const validationMessage = !form.title.trim() ? "Add a title." : !plainText(form.content) ? "Add article content." : !form.categoryNames.length ? "Select at least one category." : !form.slug ? "Add a permalink slug." : !scheduleValid ? "Choose a scheduled publish date." : !passwordValid ? "Use at least 8 characters for the protected-post password." : "";
  const primaryKeyword = form.focusKeywords[0]?.toLowerCase() ?? "";
  const firstParagraph = plainText(form.content).split(/\n|[.!?]/)[0]?.toLowerCase() ?? "";
  const seoScore = useMemo(() => {
    let score = 0;
    const title = form.metaTitle || form.title;
    if (primaryKeyword) score += 10;
    if (primaryKeyword && title.toLowerCase().includes(primaryKeyword)) score += 15;
    if (primaryKeyword && form.metaDescription.toLowerCase().includes(primaryKeyword)) score += 15;
    if (primaryKeyword && form.slug.includes(slugify(primaryKeyword))) score += 10;
    if (primaryKeyword && firstParagraph.includes(primaryKeyword)) score += 10;
    score += title.length >= 30 && title.length <= 60 ? 20 : title.length ? 8 : 0;
    score += form.metaDescription.length >= 100 && form.metaDescription.length <= 160 ? 20 : form.metaDescription.length ? 8 : 0;
    return Math.min(score, 100);
  }, [form.title, form.metaTitle, form.metaDescription, form.slug, primaryKeyword, firstParagraph]);

  const saveMutation = useMutation({
    mutationFn: async ({ intent }: { intent: "draft" | "primary" | "autosave" }) => {
      const status: Status = intent === "draft" || intent === "autosave" ? "draft" : form.status === "draft" ? "published" : form.status;
      const payload = {
        ...form,
        status,
        excerpt: form.excerpt || null,
        content: sanitizeBlogContent(form.content),
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        featuredImageSrc: form.featuredImageSrc || null,
        featuredImageAlt: form.featuredImageAlt || null,
        metaTitle: form.metaTitle || null,
        metaDescription: form.metaDescription || null,
        ogTitle: form.ogTitle || null,
        ogDescription: form.ogDescription || null,
        ogImage: form.ogImage || null,
        focusKeyword: form.focusKeywords.join(", ") || null,
        password: form.password || null,
        tagNames: form.tagNames,
      };
      const response = await fetch(post ? `/api/admin/blog/${post.id}` : "/api/admin/blog", {
        method: post ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Unable to save article");
      return { body: body as SafeBlogPost, intent };
    },
    onSuccess: ({ body, intent }) => {
      setDirty(false);
      dirtyRef.current = false;
      setLastSavedAt(new Date());
      setForm(fromPost(body));
      setSlugTouched(true);
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-meta"] });
      onSaved(body);
      if (intent !== "autosave") toast({ title: intent === "draft" ? "Draft saved" : "Article saved" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  const taxonomyMutation = useMutation({
    mutationFn: async ({ kind, name }: { kind: "category" | "tag"; name: string }) => {
      const response = await fetch("/api/admin/blog/meta", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind, name }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? `Unable to add ${kind}`);
      return { kind, item: body as TaxonomyItem };
    },
    onSuccess: ({ kind, item }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-meta"] });
      if (kind === "category") updateField("categoryNames", [...new Set([...form.categoryNames, item.name])]);
      else updateField("tagNames", [...new Set([...form.tagNames, item.name])]);
      setNewCategory("");
      setTagDraft("");
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (dirtyRef.current && form.status === "draft" && hasRequired && !saveMutation.isPending) saveMutation.mutate({ intent: "autosave" });
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [form, hasRequired, saveMutation.isPending]);

  const autosaveOnBlur = () => {
    if (post && dirtyRef.current && form.status === "draft" && hasRequired && !saveMutation.isPending) saveMutation.mutate({ intent: "autosave" });
  };

  const uploadFeaturedImage = (file?: File) => {
    if (!file) return;
    if (!file.type.match(/^image\/(?:png|jpeg|webp|gif)$/) || file.size > 2 * 1024 * 1024) {
      toast({ title: "Use a PNG, JPEG, WebP, or GIF image no larger than 2 MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateField("featuredImageSrc", String(reader.result));
      if (!form.featuredImageAlt) updateField("featuredImageAlt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
    };
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    const names = tagDraft.split(",").map((value) => value.trim()).filter(Boolean);
    if (!names.length) return;
    updateField("tagNames", [...new Set([...form.tagNames, ...names])]);
    setTagDraft("");
  };

  const categories = [...(taxonomy.data?.categories ?? [])].sort((a, b) => categoryTab === "most" ? b.usage - a.usage : a.name.localeCompare(b.name));
  const visibleCategories = categoryTab === "most" ? categories.slice(0, 10) : categories;
  const primaryLabel = post && post.status !== "draft" ? "Update" : form.status === "scheduled" ? "Schedule" : "Publish";

  return (
    <div className="space-y-5" data-testid="blog-post-editor">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
        <Button variant="ghost" onClick={onClose}><ArrowLeft className="mr-2 h-4 w-4" /> Back to posts</Button>
        <div className="text-xs text-gray-500">{dirty ? "Unsaved changes" : lastSavedAt ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "New article"}</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(300px,3fr)]">
        <main className="min-w-0 space-y-4">
          <Input aria-label="Post title" data-testid="input-blog-title" className="h-auto rounded-none border-0 border-b-2 px-0 py-3 text-4xl font-black shadow-none focus-visible:border-primary focus-visible:ring-0" placeholder="Add title" value={form.title} onChange={(event) => updateField("title", event.target.value)} onBlur={autosaveOnBlur} />
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>Permalink: https://valenciabasket.ae/blog/</span>
            {editingSlug ? (
              <>
                <Input className="h-8 w-52" value={slugDraft} onChange={(event) => setSlugDraft(slugify(event.target.value))} />
                <Button size="sm" onClick={() => { updateField("slug", slugDraft); setSlugTouched(true); setEditingSlug(false); }}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => { setSlugDraft(form.slug); setEditingSlug(false); }}>Cancel</Button>
              </>
            ) : (
              <><strong className="text-gray-800">{form.slug || "post-slug"}</strong><button type="button" className="font-bold text-primary underline" onClick={() => { setSlugDraft(form.slug); setEditingSlug(true); }}>Edit</button></>
            )}
          </div>
          <RichEditor value={form.content} onChange={(value) => updateField("content", value)} onBlur={autosaveOnBlur} />
          <div className="flex flex-wrap justify-between gap-2 text-xs text-gray-500">
            <span>Word count: {plainText(form.content).split(/\s+/).filter(Boolean).length}</span>
            <span>Last edited by {adminName}{lastSavedAt ? ` on ${lastSavedAt.toLocaleDateString()} at ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}</span>
          </div>
          <div><Label htmlFor="blog-excerpt">Excerpt</Label><Textarea id="blog-excerpt" value={form.excerpt} maxLength={320} onChange={(event) => updateField("excerpt", event.target.value)} onBlur={autosaveOnBlur} placeholder="Short summary for listings and social previews." /></div>
        </main>

        <aside className="space-y-4">
          <Panel title="Publish" badge={<ScoreBadge score={seoScore} />}>
            <div className="space-y-4 text-sm">
              <div><div className="flex justify-between"><span>Status: <strong>{form.status}</strong></span><button className="text-primary underline" onClick={() => setStatusEditing((value) => !value)}>Edit</button></div>{statusEditing && <select className="mt-2 h-9 w-full border px-2" value={form.status} onChange={(event) => updateField("status", event.target.value as Status)}><option value="draft">Draft</option><option value="published">Published</option><option value="scheduled">Scheduled</option></select>}</div>
              <div><div className="flex justify-between"><span>Visibility: <strong>{form.visibility === "password" ? "Password Protected" : form.visibility}</strong></span><button className="text-primary underline" onClick={() => setVisibilityEditing((value) => !value)}>Edit</button></div>{visibilityEditing && <div className="mt-2 space-y-2"><select className="h-9 w-full border px-2" value={form.visibility} onChange={(event) => updateField("visibility", event.target.value as Visibility)}><option value="public">Public</option><option value="private">Private</option><option value="password">Password Protected</option></select>{form.visibility === "password" && <Input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} placeholder={post ? "Leave blank to keep current password" : "Enter password"} />}</div>}</div>
              <div><div className="flex justify-between"><span>Publish: <strong>{form.publishedAt ? new Date(form.publishedAt).toLocaleString() : "Immediately"}</strong></span><button className="text-primary underline" onClick={() => setDateEditing((value) => !value)}>Edit</button></div>{dateEditing && <Input className="mt-2" type="datetime-local" value={form.publishedAt} onChange={(event) => updateField("publishedAt", event.target.value)} />}</div>
              <label className="flex items-center gap-2"><Checkbox checked={form.lockModifiedDate} onCheckedChange={(value) => updateField("lockModifiedDate", value === true)} /> Lock modified date</label>
              {validationMessage && <p className="border-l-2 border-red-500 pl-2 text-xs text-red-600">{validationMessage}</p>}
              <div className="flex items-center justify-between border-t pt-4">
                {post ? <button type="button" className="flex items-center gap-1 text-red-600 underline" onClick={() => window.confirm("Move this article to trash?") && onDelete?.()}><Trash2 className="h-4 w-4" /> Move to Trash</button> : <span />}
                <div className="flex gap-2"><Button size="sm" variant="outline" disabled={!hasRequired || saveMutation.isPending} onClick={() => saveMutation.mutate({ intent: "draft" })}>Save Draft</Button><Button size="sm" disabled={!hasRequired || saveMutation.isPending} onClick={() => saveMutation.mutate({ intent: "primary" })}>{primaryLabel}</Button></div>
              </div>
            </div>
          </Panel>

          <Panel title="Featured Image">
            {!form.featuredImageSrc ? (
              <label className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-8 text-sm font-bold text-primary"><ImagePlus className="mb-2 h-7 w-7" /> Set featured image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(event) => uploadFeaturedImage(event.target.files?.[0])} /></label>
            ) : (
              <div className="space-y-3"><label className="block cursor-pointer"><img src={form.featuredImageSrc} alt={form.featuredImageAlt || "Featured image preview"} className="max-h-52 w-full object-cover" /><span className="mt-1 block text-xs text-gray-500">Click the image to edit or update</span><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(event) => uploadFeaturedImage(event.target.files?.[0])} /></label><Input value={form.featuredImageAlt} onChange={(event) => updateField("featuredImageAlt", event.target.value)} placeholder="Required image alt text" /><button className="text-sm text-red-600 underline" onClick={() => { updateField("featuredImageSrc", ""); updateField("featuredImageAlt", ""); }}>Remove featured image</button></div>
            )}
          </Panel>

          <Panel title="SEO" badge={<ScoreBadge score={seoScore} />}>
            <div className="space-y-4">
              <div className="rounded border p-3">
                <div className="text-xs text-green-700">https://valenciabasket.ae/blog/{form.slug || "post-slug"}</div>
                <div className="text-lg text-blue-700">{form.metaTitle || form.title || "Post title"}</div>
                <p className="text-sm text-gray-600">{form.metaDescription || form.excerpt || "Add a meta description to control this search preview."}</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSeoEditing((value) => !value)}><Search className="mr-2 h-4 w-4" /> Edit Snippet</Button>
              {seoEditing && <div className="space-y-4 border-t pt-4">
                <div className="flex border-b">{(["general", "social", "advanced"] as const).map((tab) => <button key={tab} className={`flex-1 px-2 py-2 text-xs font-bold uppercase ${seoTab === tab ? "border-b-2 border-primary text-primary" : ""}`} onClick={() => setSeoTab(tab)}>{tab}</button>)}</div>
                {seoTab === "general" && <>
                  <div className="flex justify-end gap-1"><button type="button" aria-label="Desktop preview" onClick={() => setPreviewDevice("desktop")} className={`p-2 ${previewDevice === "desktop" ? "bg-black text-white" : "bg-gray-100"}`}><Monitor className="h-4 w-4" /></button><button type="button" aria-label="Mobile preview" onClick={() => setPreviewDevice("mobile")} className={`p-2 ${previewDevice === "mobile" ? "bg-black text-white" : "bg-gray-100"}`}><Smartphone className="h-4 w-4" /></button></div>
                  <div className={`rounded border p-3 transition-all ${previewDevice === "mobile" ? "max-w-[280px]" : "w-full"}`}><div className="text-xs text-green-700">valenciabasket.ae/blog/{form.slug || "post-slug"}</div><div className="text-base text-blue-700">{form.metaTitle || form.title || "Post title"}</div><p className="text-xs text-gray-600">{form.metaDescription || "Meta description preview"}</p></div>
                  <div><Label>SEO title</Label><Input value={form.metaTitle} onChange={(event) => updateField("metaTitle", event.target.value)} /><LengthMeter value={form.metaTitle || form.title} recommended={60} /></div>
                  <div><Label>Permalink</Label><Input value={form.slug} onChange={(event) => { setSlugTouched(true); updateField("slug", slugify(event.target.value)); }} /><LengthMeter value={form.slug} recommended={75} /></div>
                  <div><Label>Meta description</Label><Textarea value={form.metaDescription} onChange={(event) => updateField("metaDescription", event.target.value)} /><LengthMeter value={form.metaDescription} recommended={160} /></div>
                </>}
                {seoTab === "social" && <>
                  <div><Label>Open Graph title</Label><Input value={form.ogTitle} onChange={(event) => updateField("ogTitle", event.target.value)} /></div>
                  <div><Label>Open Graph description</Label><Textarea value={form.ogDescription} onChange={(event) => updateField("ogDescription", event.target.value)} /></div>
                  <div><Label>Open Graph image</Label><Input value={form.ogImage} onChange={(event) => updateField("ogImage", event.target.value)} placeholder="https://..." /></div>
                </>}
                {seoTab === "advanced" && <label className="flex items-center gap-2 text-sm"><Checkbox checked={form.noIndex} onCheckedChange={(value) => updateField("noIndex", value === true)} /> Hide from search engines</label>}
              </div>}
              <div><Label>Focus Keywords</Label><div className="mt-2 flex flex-wrap gap-2">{form.focusKeywords.map((keyword) => <span key={keyword} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs"><Star className="h-3 w-3 text-primary" />{keyword}<button onClick={() => updateField("focusKeywords", form.focusKeywords.filter((value) => value !== keyword))}><X className="h-3 w-3" /></button></span>)}</div><Input className="mt-2" placeholder="Type keyword and press Enter" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); const value = event.currentTarget.value.trim(); if (value) { updateField("focusKeywords", [...new Set([...form.focusKeywords, value])]); event.currentTarget.value = ""; } } }} /></div>
            </div>
          </Panel>

          <Panel title="Categories">
            <div className="flex border-b">{(["all", "most"] as const).map((tab) => <button key={tab} onClick={() => setCategoryTab(tab)} className={`flex-1 py-2 text-xs font-bold ${categoryTab === tab ? "border-b-2 border-primary" : ""}`}>{tab === "all" ? "All Categories" : "Most Used"}</button>)}</div>
            <div className="max-h-48 space-y-2 overflow-y-auto py-3">{visibleCategories.map((category) => <label key={category.id} className="flex items-center gap-2 text-sm"><Checkbox checked={form.categoryNames.includes(category.name)} onCheckedChange={(checked) => updateField("categoryNames", checked ? [...form.categoryNames, category.name] : form.categoryNames.filter((name) => name !== category.name))} />{category.name}</label>)}{!visibleCategories.length && <p className="text-xs text-gray-500">No categories yet. Add the first one below.</p>}</div>
            <button className="text-sm font-bold text-primary" onClick={() => setAddingCategory((value) => !value)}>+ Add Category</button>
            {addingCategory && <div className="mt-2 flex gap-2"><Input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Category name" /><Button size="sm" disabled={!newCategory.trim()} onClick={() => taxonomyMutation.mutate({ kind: "category", name: newCategory.trim() })}>Add new category</Button></div>}
          </Panel>

          <Panel title="Tags">
            <div className="flex gap-2"><Input value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(); } }} placeholder="Add tags" /><Button size="sm" onClick={addTag}>Add</Button></div>
            <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
            <div className="mt-3 flex flex-wrap gap-2">{form.tagNames.map((tag) => <span key={tag} className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs">{tag}<button onClick={() => updateField("tagNames", form.tagNames.filter((value) => value !== tag))}><X className="h-3 w-3" /></button></span>)}</div>
            <details className="mt-4"><summary className="cursor-pointer text-sm text-primary">Choose from the most used tags</summary><div className="mt-2 flex flex-wrap gap-2">{(taxonomy.data?.tags ?? []).slice(0, 15).map((tag) => <button key={tag.id} className="text-xs underline" onClick={() => updateField("tagNames", [...new Set([...form.tagNames, tag.name])])}>{tag.name}</button>)}</div></details>
          </Panel>

          <Panel title="Post settings" defaultOpen={false}>
            <div className="space-y-3"><div><Label>Author</Label><Input value={form.authorName} onChange={(event) => updateField("authorName", event.target.value)} /></div><label className="flex items-center gap-2 text-sm"><Checkbox checked={form.isFeatured} onCheckedChange={(value) => updateField("isFeatured", value === true)} /> Feature this article</label></div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}