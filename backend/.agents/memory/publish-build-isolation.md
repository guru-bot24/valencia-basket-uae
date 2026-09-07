---
name: Publish build isolation
description: The production build must succeed without a development database schema.
---

The publish build should compile the application without running integration tests that assume database tables or installing test browsers. Keep those checks in the explicit test command; production publishing must use only build-time dependencies and code.

**Why:** The publishing environment ran the package prebuild test hook before production schema provisioning, so a database fixture query caused an otherwise valid build to fail.

**How to apply:** When a publish build fails on a test fixture, first inspect package lifecycle hooks. Remove database- or browser-dependent hooks from the production build command rather than weakening the fixture’s assertions.