"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Copy, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SITE_ORIGIN = "https://valenciabasket.ae";

// ─────────────────────────── types ───────────────────────────

interface SeoPageRow {
  path: string;
  label: string;
  group: string;
  defaults: {
    title: string;
    description: string;
    canonical: string;
    ogTitle: string;
    ogDescription: string;
    noIndex: boolean;
    noFollow: boolean;
    focusKeyword: string | null;
  };
  override: {
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    noIndex: boolean | null;
    noFollow: boolean | null;
    focusKeyword: string | null;
    updatedAt: string;
  } | null;
  resolved: {
    title: string;
    description: string;
    canonical: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string | null;
    noIndex: boolean;
    noFollow: boolean;
    focusKeyword: string | null;
  };
}

interface ManagedImageAssetRow {
  src: string;
  defaultAlt: string;
  override: string | null;
  isDecorative: boolean;
  resolved: string;
  placements: Array<{
    key: string;
    page: string;
  }>;
}

interface EventImageRow {
  id: string;
  title: string;
  slug: string;
  src: string;
  usesFallbackImage: boolean;
  altText: string | null;
  fallbackAlt: string;
  placements: string[];
}

interface ImageAltConflictReviewRow {
  src: string;
  sharedDescription: string;
  previousValues: Array<{
    key: string;
    page: string;
    description: string;
    updatedAt: string;
  }>;
}

interface ImageAltResponse {
  assets: ManagedImageAssetRow[];
  conflicts: ImageAltConflictReviewRow[];
  eventImages: EventImageRow[];
}

interface RedirectRow {
  id: string;
  source: string;
  destination: string;
  enabled: boolean;
  updatedAt: string;
}

interface SchemaRow {
  key: string;
  path: string;
  label: string;
  type: string;
  note: string;
  json: unknown;
  lastModified?: string | null;
  enabled?: boolean;
  override?: Record<string, string> | null;
  fields?: Array<{ key: string; label: string; type: "text" | "url" | "email" | "date"; required?: boolean }>;
  lockedFields?: string[];
  schemaTypes?: string[];
}

// ─────────────────────────── helpers ───────────────────────────

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return data?.error || fallback;
  } catch {
    return fallback;
  }
}

function absoluteUrl(pathOrUrl: string): string {
  return pathOrUrl.startsWith("http") ? pathOrUrl : `${SITE_ORIGIN}${pathOrUrl}`;
}

function CharCount({ value, min, max }: { value: string; min: number; max: number }) {
  const length = value.length;
  const state = length === 0 ? "empty" : length < min || length > max ? "warn" : "ok";
  return (
    <span
      className={
        state === "warn" ? "text-amber-600" : state === "ok" ? "text-green-600" : "text-gray-400"
      }
    >
      {length} chars{" "}
      <span className="text-gray-400">
        (ideal {min}–{max})
      </span>
    </span>
  );
}

export function CopyValueButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    if (!value) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setCopied(true);
      toast({ title: "Copied to clipboard" });
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast({ title: "Could not copy this value", variant: "destructive" });
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="rounded-none text-xs"
      onClick={copyValue}
      disabled={!value}
      aria-label={`${label} value`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

// ─────────────────────────── previews ───────────────────────────

function GooglePreview({ title, description, url }: { title: string; description: string; url: string }) {
  const crumb = url.replace(/^https?:\/\//, "").replace(/\//g, " › ");
  return (
    <div className="border border-gray-200 bg-white p-4" data-testid="preview-google">
      <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-3">
        Google result preview
      </p>
      <div className="max-w-xl">
        <div className="text-[13px] text-[#202124] leading-tight mb-1 truncate">{crumb}</div>
        <div className="text-[#1a0dab] text-xl leading-snug hover:underline cursor-default line-clamp-2">
          {title}
        </div>
        <div className="text-sm text-[#4d5156] leading-snug mt-1 line-clamp-2">{description}</div>
      </div>
    </div>
  );
}

function SocialPreview({
  title,
  description,
  image,
  url,
}: {
  title: string;
  description: string;
  image: string | null;
  url: string;
}) {
  return (
    <div className="border border-gray-200 bg-white p-4" data-testid="preview-social">
      <p className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-3">
        Social share preview
      </p>
      <div className="max-w-md border border-gray-200 overflow-hidden">
        <div className="bg-gray-100 aspect-[1.91/1] flex items-center justify-center overflow-hidden">
          {image ? (
            // Preview only — arbitrary admin-supplied URLs are not run through next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400 px-4 text-center">
              No OG image set — platforms fall back to the site default
            </span>
          )}
        </div>
        <div className="p-3 bg-gray-50">
          <div className="text-[11px] uppercase text-gray-500 truncate">
            {url.replace(/^https?:\/\//, "").split("/")[0]}
          </div>
          <div className="font-bold text-sm leading-snug mt-1 line-clamp-2">{title}</div>
          <div className="text-xs text-gray-600 leading-snug mt-1 line-clamp-2">{description}</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── pages tab ───────────────────────────

function PageEditor({ page }: { page: SeoPageRow }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const defaultOgTitle = page.defaults.ogTitle || page.defaults.title;
  const defaultOgDescription = page.defaults.ogDescription || page.defaults.description;
  const [metaTitle, setMetaTitle] = useState(page.override?.metaTitle ?? page.defaults.title);
  const [metaDescription, setMetaDescription] = useState(
    page.override?.metaDescription ?? page.defaults.description
  );
  const [canonicalUrl, setCanonicalUrl] = useState(
    page.override?.canonicalUrl ?? page.defaults.canonical
  );
  const [ogTitle, setOgTitle] = useState(page.override?.ogTitle ?? defaultOgTitle);
  const [ogDescription, setOgDescription] = useState(
    page.override?.ogDescription ?? defaultOgDescription
  );
  const [ogImage, setOgImage] = useState(page.override?.ogImage ?? "");
  const [noIndex, setNoIndex] = useState<boolean>(page.override?.noIndex ?? page.defaults.noIndex);
  const [noFollow, setNoFollow] = useState<boolean>(page.override?.noFollow ?? page.defaults.noFollow ?? false);
  const [focusKeyword, setFocusKeyword] = useState(page.override?.focusKeyword ?? "");

  const effective = {
    title: metaTitle.trim() || page.defaults.title,
    description: metaDescription.trim() || page.defaults.description,
    canonical: canonicalUrl.trim() || page.defaults.canonical,
    ogTitle: ogTitle.trim() || metaTitle.trim() || page.defaults.ogTitle,
    ogDescription: ogDescription.trim() || metaDescription.trim() || page.defaults.ogDescription,
    ogImage: ogImage.trim() || null,
  };

  const restoreBuiltInValues = () => {
    setMetaTitle(page.defaults.title);
    setMetaDescription(page.defaults.description);
    setCanonicalUrl(page.defaults.canonical);
    setOgTitle(defaultOgTitle);
    setOgDescription(defaultOgDescription);
    setOgImage("");
    setNoIndex(page.defaults.noIndex);
    setNoFollow(page.defaults.noFollow ?? false);
    setFocusKeyword("");
  };

  const inheritUnlessChanged = (value: string, builtIn: string) =>
    value.trim() === builtIn.trim() ? "" : value;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/seo/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: page.path,
          metaTitle: inheritUnlessChanged(metaTitle, page.defaults.title),
          metaDescription: inheritUnlessChanged(metaDescription, page.defaults.description),
          canonicalUrl: inheritUnlessChanged(canonicalUrl, page.defaults.canonical),
          ogTitle: inheritUnlessChanged(ogTitle, defaultOgTitle),
          ogDescription: inheritUnlessChanged(ogDescription, defaultOgDescription),
          ogImage: ogImage.trim(),
          noIndex: noIndex === page.defaults.noIndex ? null : noIndex,
          noFollow: noFollow === (page.defaults.noFollow ?? false) ? null : noFollow,
          focusKeyword: focusKeyword.trim() || null,
        }),
      });
      if (!res.ok) throw new Error(await readError(res, "Failed to save SEO settings"));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-pages"] });
      toast({ title: "SEO settings saved" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/seo/pages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: page.path }),
      });
      if (!res.ok) throw new Error(await readError(res, "Failed to reset SEO settings"));
      return res.json();
    },
    onSuccess: () => {
      restoreBuiltInValues();
      queryClient.invalidateQueries({ queryKey: ["seo-pages"] });
      toast({ title: "Reverted to the built-in defaults" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider">Meta title</Label>
            <span className="flex items-center gap-2 text-xs">
              <CharCount value={effective.title} min={30} max={60} />
              <CopyValueButton value={metaTitle} />
            </span>
          </div>
          <Input
            className="rounded-none mt-1"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            data-testid="input-seo-meta-title"
          />
          <p className="text-xs text-gray-400 mt-1">Leave blank to keep the built-in title.</p>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider">Meta description</Label>
            <span className="flex items-center gap-2 text-xs">
              <CharCount value={effective.description} min={70} max={160} />
              <CopyValueButton value={metaDescription} />
            </span>
          </div>
          <Textarea
            className="rounded-none mt-1"
            rows={3}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            data-testid="input-seo-meta-description"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold uppercase tracking-wider">Canonical URL</Label>
            <CopyValueButton value={canonicalUrl} label="Copy URL" />
          </div>
          <Input
            className="rounded-none mt-1"
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            data-testid="input-seo-canonical"
          />
          <p className="text-xs text-gray-400 mt-1">
            Internal path (e.g. /programs) or a full https URL. Blank keeps {page.defaults.canonical}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider">Social title</Label>
              <CopyValueButton value={ogTitle} />
            </div>
            <Input
              className="rounded-none mt-1"
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              data-testid="input-seo-og-title"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider">Social image URL</Label>
              <CopyValueButton value={ogImage} label="Copy URL" />
            </div>
            <Input
              className="rounded-none mt-1"
              value={ogImage}
              placeholder="https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/share-card.jpg"
              onChange={(e) => setOgImage(e.target.value)}
              data-testid="input-seo-og-image"
            />
          </div>
        </div>

        <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider">Social description</Label>
              <CopyValueButton value={ogDescription} />
            </div>
          <Textarea
            className="rounded-none mt-1"
            rows={2}
            value={ogDescription}
            onChange={(e) => setOgDescription(e.target.value)}
            data-testid="input-seo-og-description"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 border border-gray-200 p-3 md:grid-cols-2">
          <div><Label htmlFor={`index-${page.path}`}>Indexing</Label><select id={`index-${page.path}`} className="mt-1 h-9 w-full border px-2 text-sm" value={noIndex ? "noindex" : "index"} onChange={(event) => setNoIndex(event.target.value === "noindex")} data-testid="select-seo-index"><option value="index">Index</option><option value="noindex">Noindex</option></select></div>
          <div><Label htmlFor={`follow-${page.path}`}>Link following</Label><select id={`follow-${page.path}`} className="mt-1 h-9 w-full border px-2 text-sm" value={noFollow ? "nofollow" : "follow"} onChange={(event) => setNoFollow(event.target.value === "nofollow")} data-testid="select-seo-follow"><option value="follow">Follow</option><option value="nofollow">Nofollow</option></select></div>
        </div>
        <div><Label htmlFor={`focus-keyword-${page.path}`}>Focus keyword</Label><Input id={`focus-keyword-${page.path}`} className="mt-1 rounded-none" value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder="Internal scoring only, e.g. basketball academy Dubai" /><p className="mt-1 text-xs text-gray-400">Used for internal SEO guidance; it is not published as a meta tag.</p></div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            className="bg-[#FF6C0E] hover:bg-[#ff8534] rounded-none uppercase font-bold text-xs"
            disabled={saveMutation.isPending}
            onClick={() => saveMutation.mutate()}
            data-testid="button-save-seo-page"
          >
            {saveMutation.isPending ? "Saving..." : "Save SEO settings"}
          </Button>
          <Button
            variant="outline"
            className="rounded-none uppercase font-bold text-xs"
            disabled={resetMutation.isPending}
            onClick={() => {
              if (page.override) {
                if (confirm(`Remove all SEO overrides for ${page.path}?`)) {
                  restoreBuiltInValues();
                  resetMutation.mutate();
                }
              } else {
                restoreBuiltInValues();
                toast({ title: "Restored the built-in values" });
              }
            }}
            data-testid="button-reset-seo-page"
          >
            <RotateCcw className="h-4 w-4 mr-1" /> Restore built-in values
          </Button>
          <a
            href={page.path}
            target="_blank"
            rel="noreferrer"
            className="text-xs uppercase font-bold tracking-wider self-center underline text-gray-500"
          >
            View page
          </a>
        </div>
        {page.override && (
          <p className="text-xs text-gray-400">
            Custom values saved {new Date(page.override.updatedAt).toLocaleString()}.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <GooglePreview
          title={effective.title}
          description={effective.description}
          url={absoluteUrl(effective.canonical)}
        />
        <SocialPreview
          title={effective.ogTitle}
          description={effective.ogDescription}
          image={effective.ogImage}
          url={absoluteUrl(effective.canonical)}
        />
        {noIndex && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3">
            This page is set to noindex. Search engines will drop it from results and it is left out
            of the sitemap.
          </p>
        )}
      </div>
    </div>
  );
}

function PagesTab() {
  const {
    data: pages = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<SeoPageRow[]>({
    queryKey: ["seo-pages"],
    queryFn: async () => {
      const res = await fetch("/api/admin/seo/pages");
      if (!res.ok) throw new Error(await readError(res, "Failed to load SEO pages"));
      return res.json();
    },
  });

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const selected = useMemo(
    () => pages.find((page) => page.path === (selectedPath ?? pages[0]?.path)),
    [pages, selectedPath]
  );

  const groups = useMemo(() => {
    const map = new Map<string, SeoPageRow[]>();
    for (const page of pages) {
      const list = map.get(page.group) ?? [];
      list.push(page);
      map.set(page.group, list);
    }
    return [...map.entries()];
  }, [pages]);

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading SEO settings...</div>;
  }

  if (isError) {
    return (
      <div className="border border-red-200 bg-red-50 p-6 text-center" data-testid="seo-pages-error">
        <p className="font-bold text-red-800">Couldn&apos;t load SEO pages</p>
        <p className="mt-1 text-sm text-red-700">
          {error instanceof Error ? error.message : "The current SEO settings could not be loaded."}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-none uppercase text-xs font-bold"
          onClick={() => refetch()}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      <div className="border border-gray-200 divide-y max-h-[70vh] overflow-y-auto">
        {groups.map(([group, groupPages]) => (
          <div key={group}>
            <div className="px-3 py-2 bg-gray-100 text-xs font-bold uppercase tracking-widest text-gray-500">
              {group}
            </div>
            {groupPages.map((page) => (
              <button
                key={page.path}
                type="button"
                onClick={() => setSelectedPath(page.path)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between gap-2 ${
                  selected?.path === page.path ? "bg-gray-100 font-bold" : ""
                }`}
                data-testid={`button-seo-page-${page.path}`}
              >
                <span className="truncate">{page.label}</span>
                {page.override && (
                  <span className="text-[10px] uppercase font-bold text-[#FF6C0E] shrink-0">
                    Custom
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div>
        {selected ? (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-black uppercase tracking-tight">{selected.label}</h3>
              <p className="text-sm text-gray-500">{selected.path}</p>
            </div>
            <PageEditor key={selected.path} page={selected} />
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">No pages available</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── images tab ───────────────────────────

function normaliseAltText(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getAltWarnings(
  value: string,
  imageSrc: string,
  assets: ManagedImageAssetRow[]
): string[] {
  const text = value.trim();
  if (!text) return [];

  const warnings: string[] = [];
  if (/^(image|photo|picture)\s+of\b/i.test(text)) {
    warnings.push('Start with what matters, rather than "image of" or "photo of".');
  }
  const filename = imageSrc.split("/").pop() ?? imageSrc;
  if (normaliseAltText(text) === normaliseAltText(filename)) {
    warnings.push("This looks like the filename rather than a useful description.");
  }
  if (text.length < 15) {
    warnings.push("This is very short. Add enough context to explain the image.");
  }
  if (text.length > 125) {
    warnings.push("This is long. Keep the description focused and under 125 characters.");
  }

  const duplicate = assets.some((asset) => {
    if (asset.src === imageSrc || asset.isDecorative) return false;
    const comparison = asset.override?.trim() || asset.defaultAlt;
    return normaliseAltText(comparison) === normaliseAltText(text);
  });
  if (duplicate) {
    warnings.push("Another image currently uses the same alt text.");
  }
  return warnings;
}

function ImagesTab({ onEditEvent }: { onEditEvent?: (eventId: string) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<
    Record<string, { altText: string; isDecorative: boolean }>
  >({});

  const { data, isLoading } = useQuery<ImageAltResponse>({
    queryKey: ["seo-images"],
    queryFn: async () => {
      const res = await fetch("/api/admin/seo/images");
      if (!res.ok) throw new Error(await readError(res, "Failed to load image alt text"));
      return res.json();
    },
  });
  const assets = data?.assets ?? [];
  const conflicts = data?.conflicts ?? [];
  const eventImages = data?.eventImages ?? [];

  const saveMutation = useMutation({
    mutationFn: async ({
      imageSrc,
      altText,
      isDecorative,
      reviewConflict = false,
    }: {
      imageSrc: string;
      altText: string;
      isDecorative: boolean;
      reviewConflict?: boolean;
    }) => {
      const res = await fetch("/api/admin/seo/images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageSrc, altText, isDecorative, reviewConflict }),
      });
      if (!res.ok) throw new Error(await readError(res, "Failed to save alt text"));
      return res.json();
    },
    onSuccess: (result: {
      affectedPlacements: number;
      affectedPages: number;
      reviewed?: boolean;
    }) => {
      queryClient.invalidateQueries({ queryKey: ["seo-images"] });
      toast({
        title: result.reviewed ? "Description reviewed" : "Alt text saved",
        description: result.reviewed
          ? "The migration conflict has been resolved."
          : `Updated on ${result.affectedPlacements} placement${
              result.affectedPlacements === 1 ? "" : "s"
            } across ${result.affectedPages} page${result.affectedPages === 1 ? "" : "s"}.`,
      });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading images...</div>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Each static image file has one shared description everywhere it is used. Leave a
        non-decorative field blank to restore its built-in description. Event images remain
        editable from their event details.
      </p>
      {conflicts.length > 0 && (
        <section
          className="border border-amber-300 bg-amber-50/40 overflow-hidden"
          data-testid="section-seo-image-conflict-review"
        >
          <div className="border-b border-amber-200 bg-amber-100 px-4 py-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-amber-950">
              Description review needed
            </h3>
            <p className="mt-1 text-xs text-amber-900">
              These files had different saved descriptions across older placements. The newest
              value is currently shared site-wide; compare the preserved values, then confirm or
              replace it.
            </p>
          </div>
          <div className="divide-y divide-amber-200">
            {conflicts.map((conflict) => {
              const draft = drafts[conflict.src] ?? {
                altText: conflict.sharedDescription,
                isDecorative: false,
              };
              const hasReplacement = draft.altText.trim() !== conflict.sharedDescription;
              return (
                <div
                  key={conflict.src}
                  className="grid gap-4 p-4 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)]"
                  data-testid={`row-seo-image-conflict-${conflict.src}`}
                >
                  <div className="h-20 w-28 shrink-0 overflow-hidden border border-amber-200 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={conflict.src}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="break-all text-xs text-gray-600">{conflict.src}</p>
                    <Label
                      htmlFor={`input-seo-image-conflict-${conflict.src}`}
                      className="mt-3 block text-xs font-bold uppercase tracking-wide"
                    >
                      Chosen shared description
                    </Label>
                    <Textarea
                      id={`input-seo-image-conflict-${conflict.src}`}
                      value={draft.altText}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [conflict.src]: {
                            altText: event.target.value,
                            isDecorative: false,
                          },
                        }))
                      }
                      className="mt-1 min-h-20 rounded-none bg-white text-sm"
                      data-testid={`input-seo-image-conflict-${conflict.src}`}
                    />
                    <Button
                      size="sm"
                      className="mt-3 rounded-none uppercase text-xs font-bold"
                      disabled={saveMutation.isPending}
                      onClick={() =>
                        saveMutation.mutate({
                          imageSrc: conflict.src,
                          altText: draft.altText,
                          isDecorative: false,
                          reviewConflict: true,
                        })
                      }
                      data-testid={`button-confirm-seo-image-conflict-${conflict.src}`}
                    >
                      {hasReplacement ? "Save and confirm" : "Confirm description"}
                    </Button>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-700">
                      Preserved placement values
                    </p>
                    <ul className="mt-2 space-y-2">
                      {conflict.previousValues.map((value) => (
                        <li key={value.key} className="border border-amber-200 bg-white px-3 py-2">
                          <p className="text-sm text-gray-900">{value.description}</p>
                          <p className="mt-1 text-[11px] text-gray-500">
                            {value.page} · {value.key}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      <section className="border border-gray-200 overflow-hidden">
        <h3 className="bg-gray-100 px-4 py-3 text-sm font-black uppercase tracking-wide">
          Static image files
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Image</TableHead>
              <TableHead className="font-bold">Used on</TableHead>
              <TableHead className="font-bold">Shared alt text</TableHead>
              <TableHead className="font-bold text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
              const draft =
                drafts[asset.src] ?? {
                  altText: asset.isDecorative ? "" : asset.override ?? asset.defaultAlt,
                  isDecorative: asset.isDecorative,
                };
              const warnings = draft.isDecorative
                ? []
                : getAltWarnings(draft.altText, asset.src, assets);
              const stateLabel = draft.isDecorative
                ? "Decorative"
                : asset.override?.trim()
                  ? "Custom alt text"
                  : "Using built-in alt text";
              return (
                <TableRow key={asset.src} data-testid={`row-seo-image-${asset.src}`}>
                  <TableCell>
                    <div className="flex min-w-[210px] items-center gap-3">
                      <div className="h-16 w-20 shrink-0 overflow-hidden border border-gray-200 bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="min-w-0">
                        <p className="break-all text-xs text-gray-600">{asset.src}</p>
                        <p
                          className={`mt-1 text-[10px] font-bold uppercase tracking-wide ${
                            draft.isDecorative
                              ? "text-gray-500"
                              : asset.override?.trim()
                                ? "text-green-600"
                                : "text-amber-600"
                          }`}
                        >
                          {stateLabel}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ul className="space-y-1 text-xs text-gray-600">
                      {asset.placements.map((placement) => (
                        <li key={placement.key}>
                          {placement.page} <span className="text-gray-400">({placement.key})</span>
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-start gap-2">
                        <Input
                          className="rounded-none"
                          value={draft.altText}
                          disabled={draft.isDecorative}
                          onChange={(e) =>
                            setDrafts((current) => ({
                              ...current,
                              [asset.src]: { ...draft, altText: e.target.value },
                            }))
                          }
                          data-testid={`input-seo-image-alt-${asset.src}`}
                        />
                        <CopyValueButton
                          value={draft.isDecorative ? "" : draft.altText}
                          label="Copy"
                        />
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Checkbox
                          id={`decorative-${asset.src}`}
                          checked={draft.isDecorative}
                          onCheckedChange={(checked) =>
                            setDrafts((current) => ({
                              ...current,
                              [asset.src]: { ...draft, isDecorative: checked === true },
                            }))
                          }
                        />
                        <Label htmlFor={`decorative-${asset.src}`} className="text-xs">
                          Decorative image (render with empty alt text)
                        </Label>
                      </div>
                      {!draft.isDecorative && (
                        <>
                          <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
                            <span className="text-gray-400">Built-in: {asset.defaultAlt}</span>
                            <span className={draft.altText.length > 125 ? "text-amber-600" : "text-gray-400"}>
                              {draft.altText.length}/125
                            </span>
                          </div>
                          {warnings.length > 0 ? (
                            <ul className="mt-2 space-y-1 text-[11px] text-amber-700">
                              {warnings.map((warning) => <li key={warning}>• {warning}</li>)}
                            </ul>
                          ) : (
                            <p className="mt-1 text-[11px] text-gray-400">
                              Describe what is shown and its purpose; avoid starting with “image of”.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-none uppercase text-xs font-bold"
                      disabled={saveMutation.isPending}
                      onClick={() =>
                        saveMutation.mutate({
                          imageSrc: asset.src,
                          altText:
                            !draft.isDecorative &&
                            draft.altText.trim() === asset.defaultAlt.trim()
                              ? ""
                              : draft.altText,
                          isDecorative: draft.isDecorative,
                        })
                      }
                      data-testid={`button-save-seo-image-${asset.src}`}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2 rounded-none text-xs"
                      disabled={saveMutation.isPending || (!asset.override && !asset.isDecorative)}
                      onClick={() =>
                        saveMutation.mutate({
                          imageSrc: asset.src,
                          altText: "",
                          isDecorative: false,
                        })
                      }
                      data-testid={`button-reset-seo-image-${asset.src}`}
                    >
                      Restore built-in
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>

      <section className="border border-gray-200 overflow-hidden">
        <h3 className="bg-gray-100 px-4 py-3 text-sm font-black uppercase tracking-wide">
          Event-managed images
        </h3>
        {eventImages.length === 0 ? (
          <p className="px-4 py-6 text-sm text-gray-500">No events are currently available.</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {eventImages.map((event) => (
              <div key={event.id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                <div className="h-16 w-20 shrink-0 overflow-hidden border border-gray-200 bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={event.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{event.title}</p>
                  <p className="break-all text-xs text-gray-500">{event.src}</p>
                  {event.usesFallbackImage && (
                    <p className="mt-1 text-xs text-amber-700">
                      This event uses the site fallback image until an event image is added.
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-600">
                    Used on: {event.placements.join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {event.altText ? `Current alt text: ${event.altText}` : `Uses event title: ${event.fallbackAlt}`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-none uppercase text-xs font-bold"
                  onClick={() => onEditEvent?.(event.id)}
                  disabled={!onEditEvent}
                  data-testid={`button-edit-seo-event-image-${event.id}`}
                >
                  Edit event image
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─────────────────────────── redirects tab ───────────────────────────

function RedirectsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const clearForm = () => {
    setEditingId(null);
    setSource("");
    setDestination("");
  };

  const { data: redirects = [], isLoading } = useQuery<RedirectRow[]>({
    queryKey: ["seo-redirects"],
    queryFn: async () => {
      const res = await fetch("/api/admin/seo/redirects");
      if (!res.ok) throw new Error(await readError(res, "Failed to load redirects"));
      return res.json();
    },
  });

  // One mutation for both modes: POST creates, PUT edits the selected row.
  const saveMutation = useMutation({
    mutationFn: async () => {
      const editing = redirects.find((row) => row.id === editingId);
      const res = await fetch("/api/admin/seo/redirects", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          source,
          destination,
          enabled: editing ? editing.enabled : true,
        }),
      });
      if (!res.ok) {
        throw new Error(await readError(res, editingId ? "Failed to update redirect" : "Failed to create redirect"));
      }
      return res.json();
    },
    onSuccess: () => {
      const wasEditing = editingId !== null;
      clearForm();
      queryClient.invalidateQueries({ queryKey: ["seo-redirects"] });
      toast({ title: wasEditing ? "Redirect updated" : "Redirect created" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  const toggleMutation = useMutation({
    mutationFn: async (row: RedirectRow) => {
      const res = await fetch("/api/admin/seo/redirects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          source: row.source,
          destination: row.destination,
          enabled: !row.enabled,
        }),
      });
      if (!res.ok) throw new Error(await readError(res, "Failed to update redirect"));
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seo-redirects"] });
      toast({ title: "Redirect updated" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/admin/seo/redirects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error(await readError(res, "Failed to delete redirect"));
      return res.json();
    },
    onSuccess: (_data, id) => {
      if (editingId === id) clearForm();
      queryClient.invalidateQueries({ queryKey: ["seo-redirects"] });
      toast({ title: "Redirect deleted" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Permanent (301) redirects for retired content URLs. Domain-level rules — www to non-www and
        the legacy domains — stay in the site configuration and are not listed here. Existing pages
        cannot be used as a source. Changes go live within about 10 seconds.
      </p>

      <form
        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end border border-gray-200 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!source || !destination) return;
          saveMutation.mutate();
        }}
      >
        {editingId && (
          <p className="md:col-span-3 text-xs font-bold uppercase tracking-wider text-[#FF6C0E]">
            Editing an existing redirect
          </p>
        )}
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider">Old path</Label>
          <Input
            className="rounded-none mt-1"
            value={source}
            placeholder="/old-page"
            onChange={(e) => setSource(e.target.value)}
            data-testid="input-redirect-source"
          />
        </div>
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider">Redirects to</Label>
          <Input
            className="rounded-none mt-1"
            value={destination}
            placeholder="/programs"
            onChange={(e) => setDestination(e.target.value)}
            data-testid="input-redirect-destination"
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            className="bg-[#FF6C0E] hover:bg-[#ff8534] rounded-none uppercase font-bold text-xs"
            disabled={saveMutation.isPending}
            data-testid="button-add-redirect"
          >
            {editingId ? (
              "Save changes"
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" /> Add redirect
              </>
            )}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              className="rounded-none uppercase font-bold text-xs"
              onClick={clearForm}
              data-testid="button-cancel-edit-redirect"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading redirects...</div>
      ) : redirects.length === 0 ? (
        <div className="text-center py-12 text-gray-500" data-testid="text-no-redirects">
          No redirects yet
        </div>
      ) : (
        <div className="border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="font-bold">Old path</TableHead>
                <TableHead className="font-bold">Redirects to</TableHead>
                <TableHead className="font-bold">Type</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {redirects.map((row) => (
                <TableRow key={row.id} data-testid={`row-redirect-${row.id}`}>
                  <TableCell className="font-medium">{row.source}</TableCell>
                  <TableCell>{row.destination}</TableCell>
                  <TableCell>301 permanent</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {row.enabled ? "Active" : "Paused"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingId(row.id);
                        setSource(row.source);
                        setDestination(row.destination);
                      }}
                      data-testid={`button-edit-redirect-${row.id}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="uppercase text-xs font-bold"
                      onClick={() => toggleMutation.mutate(row)}
                      data-testid={`button-toggle-redirect-${row.id}`}
                    >
                      {row.enabled ? "Pause" : "Activate"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => {
                        if (confirm(`Delete the redirect for ${row.source}?`)) {
                          deleteMutation.mutate(row.id);
                        }
                      }}
                      data-testid={`button-delete-redirect-${row.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────── structured data tab ───────────────────────────

function SchemaTab() {
  const { data: entries = [], isLoading } = useQuery<SchemaRow[]>({
    queryKey: ["seo-schema"],
    queryFn: async () => {
      const res = await fetch("/api/admin/seo/schema");
      if (!res.ok) throw new Error(await readError(res, "Failed to load structured data"));
      return res.json();
    },
  });

  if (isLoading) {
    return <div className="text-center py-12 text-gray-500">Loading structured data...</div>;
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">Edit only the supported fields below. Empty fields inherit the verified code default; live page content remains locked.</p>
      <Accordion type="multiple" className="border border-gray-200">
        {entries.map((entry) => (
          <AccordionItem
            key={entry.key}
            value={entry.key}
            className="border-b border-gray-200 last:border-b-0"
              data-testid={`schema-${entry.key.replace(/[^a-z0-9]+/gi, "-")}`}
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50">
              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-left">
                <span className="font-black uppercase tracking-tight">{entry.label}</span>
                <span className="text-xs text-gray-500">{entry.path}</span>
                <span className="text-xs font-bold uppercase text-[#FF6C0E]">{entry.type}</span>
                <span className="text-[11px] text-gray-400">
                  Last modified:{" "}
                  {entry.lastModified
                    ? new Date(entry.lastModified).toLocaleDateString()
                    : "Not available"}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <SchemaEditor key={`${entry.key}:${entry.lastModified ?? "default"}`} entry={entry} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function SchemaEditor({ entry }: { entry: SchemaRow }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(entry.enabled ?? true);
  const [values, setValues] = useState<Record<string, string>>(entry.override ?? {});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const save = useMutation({
    mutationFn: async () => {
       const res = await fetch("/api/admin/seo/schema", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ key: entry.key, schemaType: entry.type, enabled, overrides: values }) });
      const body = await res.json();
      if (!res.ok) { setErrors(body.fields ?? {}); throw new Error(body.error ?? "Unable to save"); }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["seo-schema"] }); toast({ title: "Structured data saved" }); },
    onError: (error) => toast({ title: error.message, variant: "destructive" }),
  });
  const meaningfulValues = Object.fromEntries(
    Object.entries(values).filter(([, value]) => value.trim())
  );
  const json =
    typeof entry.json === "object" && entry.json
      ? { ...(entry.json as Record<string, unknown>), ...meaningfulValues }
      : entry.json;
   return <div className="space-y-3">
    <p className="text-xs text-gray-500">{entry.note}</p>
     {(entry.schemaTypes?.length ?? 0) > 1 && <div><Label htmlFor={`schema-type-${entry.key}`}>Schema type</Label><select id={`schema-type-${entry.key}`} className="mt-1 h-9 w-full border px-2 text-sm" value={entry.type} onChange={(event) => {
       const schemaType = event.target.value;
       fetch("/api/admin/seo/schema", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ key: entry.key, schemaType, enabled, overrides: values }) }).then((res) => { if (!res.ok) throw new Error("Unable to save schema type"); queryClient.invalidateQueries({ queryKey: ["seo-schema"] }); toast({ title: "Schema type saved" }); }).catch((error: Error) => toast({ title: error.message, variant: "destructive" }));
     }}>{entry.schemaTypes?.map((type) => <option key={type} value={type}>{type}</option>)}</select><p className="mt-1 text-xs text-gray-500">Choose the structured-data type for this editable entry.</p></div>}
    <label className="flex items-center gap-2 text-sm font-medium"><Checkbox checked={enabled} onCheckedChange={(value) => setEnabled(value === true)} /> Publish this schema {enabled ? "" : "(disabled)"}</label>
    {(entry.fields ?? []).map((field) => <div key={field.key}><Label htmlFor={`schema-${entry.key}-${field.key}`}>{field.label}{field.required ? " *" : ""}</Label><div className="flex gap-2"><Input id={`schema-${entry.key}-${field.key}`} type={field.type === "url" ? "url" : field.type === "email" ? "email" : field.type === "date" ? "date" : "text"} value={values[field.key] ?? ""} placeholder={`Inherited: ${(entry.json as Record<string, unknown>)[field.key] ?? ""}`} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })} /><Button type="button" variant="ghost" onClick={() => { const next = { ...values }; delete next[field.key]; setValues(next); }}>Reset</Button></div>{errors[field.key]?.map((error) => <p key={error} className="text-xs text-red-600">{error}</p>)}</div>)}
    {!!entry.lockedFields?.length && <p className="text-xs text-gray-500">Locked, follows verified page content: {entry.lockedFields.join(", ")}.</p>}
    <Button type="button" onClick={() => save.mutate()} disabled={save.isPending}>Save</Button>
    <div className="mb-2 flex justify-end"><CopyValueButton value={JSON.stringify(json, null, 2)} label="Copy JSON" /></div>
    <pre className="max-h-80 overflow-x-auto whitespace-pre-wrap break-all bg-gray-50 p-4 text-xs">{JSON.stringify(json, null, 2)}</pre>
  </div>;
}

// ─────────────────────────── shell ───────────────────────────

export function SeoManager({ onEditEvent }: { onEditEvent?: (eventId: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold uppercase tracking-tight" data-testid="text-seo-heading">
          Website SEO
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Current values are editable and copyable. Saving an unchanged built-in value keeps it
          inherited from the site defaults.
        </p>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pages" data-testid="tab-trigger-seo-pages">
            Pages
          </TabsTrigger>
          <TabsTrigger value="images" data-testid="tab-trigger-seo-images">
            Image Alt Text
          </TabsTrigger>
          <TabsTrigger value="redirects" data-testid="tab-trigger-seo-redirects">
            Redirects
          </TabsTrigger>
          <TabsTrigger value="schema" data-testid="tab-trigger-seo-schema">
            Structured Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="mt-6">
          <PagesTab />
        </TabsContent>
        <TabsContent value="images" className="mt-6">
          <ImagesTab onEditEvent={onEditEvent} />
        </TabsContent>
        <TabsContent value="redirects" className="mt-6">
          <RedirectsTab />
        </TabsContent>
        <TabsContent value="schema" className="mt-6">
          <SchemaTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
