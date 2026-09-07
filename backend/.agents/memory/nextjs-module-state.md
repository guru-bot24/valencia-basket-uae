---
name: Next.js App Router module state
description: Why in-process caches in shared lib modules cannot be invalidated from API route handlers.
---

# In-process caches cannot be invalidated across route handlers and page renders

A module-level cache in a shared `lib/` module does **not** behave like a single
process-wide singleton. Route handlers and page/layout renders are compiled into
separate server bundles, so each gets its own copy of the module and its own
copy of the cache. Calling an `invalidateX()` helper from an API route clears
the route handler's copy and leaves the renderer serving stale data until the
TTL expires.

**Why:** an admin save that returned 200 kept rendering the old page metadata,
and it only corrected itself after the cache TTL — the invalidation call was a
silent no-op. It looked like it worked in testing purely because more than one
TTL had elapsed between the write and the check.

**How to apply:** for anything an admin edits and then immediately views, read
per request (React `cache()` gives per-request dedup, which is enough). Reserve
TTL caches for reads where staleness is acceptable and the request volume
justifies it — middleware is the main case, since it fires on every request —
and state the propagation delay in the UI rather than pretending it is instant.
Cross-bundle invalidation needs shared state (database, `revalidateTag`), never
a module variable.
