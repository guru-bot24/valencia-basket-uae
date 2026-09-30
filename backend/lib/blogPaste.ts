/**
 * Browser-only helpers for the blog editor: tidy HTML pasted from Google Docs,
 * Word or other websites, and turn images pasted "inside the text" (data: URLs)
 * into uploaded files.
 */

const UPLOADABLE_IMAGE = /^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=\s]+)$/i;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Keeps only an element's text alignment from pasted inline styles. */
function keepAlignmentOnly(element: HTMLElement) {
  const align = element.style.textAlign;
  element.removeAttribute("style");
  if (/^(?:left|center|right)$/.test(align) && /^(?:P|H[1-4]|DIV|LI|TD|TH|BLOCKQUOTE)$/.test(element.tagName)) {
    element.style.textAlign = align;
  }
}

function unwrap(element: Element) {
  element.replaceWith(...Array.from(element.childNodes));
}

/**
 * Normalises pasted HTML before the site's sanitizer runs: Google Docs'
 * all-bold wrapper is removed, styled spans become real bold/italic, and
 * source colours, fonts, widths and borders are dropped so pasted tables and
 * text pick up the site's own styling.
 */
export function cleanPastedHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("style, meta, title, link, script, colgroup, col").forEach((node) => node.remove());

  // Google Docs wraps everything in <b style="font-weight:normal" id="docs-internal-guid-…">.
  doc.querySelectorAll('b[id^="docs-internal-guid"]').forEach(unwrap);

  doc.querySelectorAll<HTMLElement>("span").forEach((span) => {
    const bold = /^(?:bold|[6-9]00)$/.test(span.style.fontWeight);
    const italic = span.style.fontStyle === "italic";
    if (!bold && !italic) return;
    let inner: Node = doc.createDocumentFragment();
    inner.appendChild(doc.createRange().createContextualFragment(span.innerHTML));
    if (italic) { const em = doc.createElement("em"); em.appendChild(inner); inner = em; }
    if (bold) { const strong = doc.createElement("strong"); strong.appendChild(inner); inner = strong; }
    span.replaceWith(inner);
  });

  doc.body.querySelectorAll<HTMLElement>("[style]").forEach(keepAlignmentOnly);

  // A header row pasted as ordinary cells inside <thead> should still be header cells.
  doc.querySelectorAll("thead td").forEach((cell) => {
    const th = doc.createElement("th");
    th.innerHTML = cell.innerHTML;
    for (const name of ["colspan", "rowspan"]) {
      const value = cell.getAttribute(name);
      if (value) th.setAttribute(name, value);
    }
    cell.replaceWith(th);
  });

  return doc.body.innerHTML;
}

/** True when pasted HTML is nothing but images (e.g. "Copy image"), so the image file itself should be used. */
export function isImageOnlyHtml(html: string): boolean {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return !!doc.querySelector("img") && !doc.body.textContent?.trim() && !doc.querySelector("table");
}

export function dataUrlToFile(dataUrl: string, index: number): File | null {
  const match = UPLOADABLE_IMAGE.exec(dataUrl.trim());
  if (!match) return null;
  const [, type, base64] = match;
  const binary = atob(base64.replace(/\s+/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const extension = type.split("/")[1].replace("jpeg", "jpg");
  return new File([bytes], `pasted-${Date.now()}-${index}.${extension}`, { type });
}

/** Images still stored inside the editor as data: URLs (pasted, not uploaded). */
export function findInlineImages(root: ParentNode): HTMLImageElement[] {
  return Array.from(root.querySelectorAll("img")).filter((image) => /^data:image\//i.test(image.getAttribute("src") ?? ""));
}
