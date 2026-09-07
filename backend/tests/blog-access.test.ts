import assert from "node:assert/strict";
import test from "node:test";
import { createBlogAccessToken, verifyBlogAccessToken } from "@/lib/blogAccess";

test("protected article access tokens are scoped, signed, and expiring", () => {
  const secret = "test-only-secret";
  const token = createBlogAccessToken(42, secret, 60);
  assert.equal(verifyBlogAccessToken(token, 42, secret), true);
  assert.equal(verifyBlogAccessToken(token, 43, secret), false);
  assert.equal(verifyBlogAccessToken(token, 42, "different-secret"), false);
  assert.equal(verifyBlogAccessToken(createBlogAccessToken(42, secret, -1), 42, secret), false);
  assert.equal(verifyBlogAccessToken("invalid", 42, secret), false);
});