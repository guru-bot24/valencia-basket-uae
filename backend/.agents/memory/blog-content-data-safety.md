---
name: Blog content data safety
description: Protects the live site's blog tables from invented seed and test content.
---

Do not add sample or invented blog categories, posts, or tags to the development seed.

**Why:** This project is a live site, and development may contain operational data. Invented blog content must never persist as published or draft records.

**How to apply:** Test blog queries with fixtures created inside a database transaction, always roll the transaction back, and verify the database returns to its pre-test state.

Schema migrations must not contain standalone `DELETE` or `TRUNCATE` statements. Put intentional data cleanup in a clearly marked manual SQL script under `scripts/sql/`.

**Why:** An unconditional cleanup migration can replay in a fresh environment, including production, and erase real content.

**How to apply:** Keep migrations schema-only; manually review and run cleanup scripts against an explicitly selected environment.