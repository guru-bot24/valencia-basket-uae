---
name: Blog image persistence
description: Why blog featured-image uploads are stored as validated data URLs.
---

Blog featured-image uploads are persisted as validated image data URLs in the blog record, with a strict size cap and required alt text. Do not switch them to deployment-local filesystem uploads.

**Why:** The app has no durable object-storage integration, and files written to an autoscaled deployment filesystem would disappear across instances or releases. Database-backed images are less scalable but reliably persistent for the current low-volume admin workflow.

**How to apply:** Keep the validation and size limit in place. If blog image volume grows, migrate to durable object storage and replace existing data URLs through an explicit, lossless migration.