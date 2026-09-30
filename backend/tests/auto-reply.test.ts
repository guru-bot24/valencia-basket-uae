import assert from "node:assert/strict";
import test from "node:test";
import { AUTO_REPLY_SUBJECT, buildAutoReply, firstNameOf } from "@/lib/emailTemplates/autoReply";
import { isAutoReplyEnabled, shouldSendAutoReply } from "@/lib/email";

test("greets by first name, tidied", () => {
  assert.equal(firstNameOf("sara al-hassan"), "Sara");
  assert.equal(firstNameOf("  Mohammed   Khan "), "Mohammed");
  assert.equal(firstNameOf(""), "there");
  assert.equal(firstNameOf(null), "there");
});

test("the email has the agreed content in both HTML and plain text", () => {
  const { subject, html, text } = buildAutoReply("Sara Ahmed");
  assert.equal(subject, AUTO_REPLY_SUBJECT);
  for (const part of [html, text]) {
    assert.match(part, /Thanks, Sara\. We've got your message!/);
    assert.match(part, /within (<b[^>]*>)?24 hours/);
    assert.match(part, /\+971 54 438 6838/);
    assert.match(part, /wa\.me\/971544386838/);
    assert.match(part, /valenciabasket\.ae\/programs/);
    assert.match(part, /AllSports Arena, Al Quoz, Dubai/);
  }
  assert.match(html, /pub-b2680f6e721d4a92b41f30395b8feb3c\.r2\.dev\/logo\.png/, "logo from R2 (the /images path is only a redirect)");
});

test("a name can't inject HTML into the email", () => {
  const { html } = buildAutoReply("<img src=x onerror=alert(1)> Evil");
  assert.doesNotMatch(html, /<img src=x/);
  assert.match(html, /Thanks, &lt;img\. /);
});

test("auto-reply is off unless AUTO_REPLY_ENABLED=true", () => {
  const saved = { flag: process.env.AUTO_REPLY_ENABLED, user: process.env.SMTP_USER, pass: process.env.SMTP_PASS };
  try {
    process.env.SMTP_USER = "u"; process.env.SMTP_PASS = "p";
    delete process.env.AUTO_REPLY_ENABLED;
    assert.equal(isAutoReplyEnabled(), false);
    process.env.AUTO_REPLY_ENABLED = "true";
    assert.equal(isAutoReplyEnabled(), true);
  } finally {
    for (const [key, value] of [["AUTO_REPLY_ENABLED", saved.flag], ["SMTP_USER", saved.user], ["SMTP_PASS", saved.pass]] as const) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

test("one auto-reply per address per 10 minutes", () => {
  const t0 = 1_000_000_000_000;
  assert.equal(shouldSendAutoReply("Parent@Example.com", t0), true);
  assert.equal(shouldSendAutoReply("parent@example.com", t0 + 60_000), false, "same address, different case");
  assert.equal(shouldSendAutoReply("other@example.com", t0 + 60_000), true);
  assert.equal(shouldSendAutoReply("parent@example.com", t0 + 11 * 60_000), true, "allowed again after 10 minutes");
});
