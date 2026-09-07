---
name: Drizzle migration ordering
description: Why a valid new migration can be silently skipped in an existing Replit database.
---

Drizzle applies migrations by the `when` timestamp in its journal, not only by filename or journal index. A newly generated migration must have a timestamp later than every migration already recorded in the target database, including historical migrations later removed from the repository.

**Why:** A schema-only migration reported success but was skipped because the development database retained a removed migration whose timestamp was later than the new generated entry.

**How to apply:** When migration reports success but the expected schema is absent, compare the new journal timestamp with the maximum timestamp in the database migration history. Preserve chronological ordering rather than repeatedly rerunning the same migration.

Drizzle Kit can also reuse an existing numeric filename prefix and overwrite that prefix's snapshot when hand-authored migrations make filenames diverge from journal indexes. Before generation, preserve the latest snapshot; afterward, give the SQL and new snapshot a unique next prefix, restore the prior snapshot, and update the journal tag without changing its generated timestamp.