/**
 * The automatic "thanks, we've got your message" email sent to whoever
 * submits a form on the site (trial booking — also used by Contact Us — and
 * event registration). One shared message; only the first name varies.
 *
 * Email-client friendly: table layout with inline styles (Gmail strips
 * <style> blocks), plus a plain-text version.
 */

const SITE = "https://valenciabasket.ae";
const LOGO_URL = "https://pub-b2680f6e721d4a92b41f30395b8feb3c.r2.dev/logo.png";
const ORANGE = "#ff6c0e";
const PHONE_DISPLAY = "+971 54 438 6838";
const WHATSAPP_URL = "https://wa.me/971544386838?text=" + encodeURIComponent("Hi! I just filled in the form on your website.");
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=AllSports+Arena+Al+Quoz+Dubai";
const SOCIALS = [
  ["Website", SITE],
  ["Instagram", "https://www.instagram.com/valenciabasketuae/"],
  ["TikTok", "https://www.tiktok.com/@valenciabasketuae"],
  ["Facebook", "https://www.facebook.com/profile.php?id=61587608243652"],
] as const;

export const AUTO_REPLY_SUBJECT = "Thank you for contacting Valencia Basket Academy UAE";

function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** "sara al-hassan" → "Sara"; falls back to "there" ("Thanks, there") if nothing usable. */
export function firstNameOf(fullName: string | null | undefined): string {
  const first = (fullName ?? "").trim().split(/\s+/)[0] ?? "";
  if (!first) return "there";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function button(label: string, href: string, background: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 8px 10px 0;"><tr><td style="background:${background};border-radius:4px;">
    <a href="${href}" target="_blank" style="display:inline-block;padding:12px 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#ffffff;text-decoration:none;">${label}</a>
  </td></tr></table>`;
}

export function buildAutoReply(fullName: string | null | undefined): { subject: string; html: string; text: string } {
  const name = firstNameOf(fullName);
  const safeName = esc(name);
  const font = "font-family:Arial,Helvetica,sans-serif;";

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(AUTO_REPLY_SUBJECT)}</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">We've received your details. Our team will contact you within 24 hours.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f4f5;"><tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#ffffff;border-radius:6px;overflow:hidden;">
    <tr><td style="background:#000000;padding:22px 28px;">
      <img src="${LOGO_URL}" alt="Valencia Basket Academy UAE" height="44" style="height:44px;width:auto;vertical-align:middle;border:0;">
      <span style="display:inline-block;vertical-align:middle;margin-left:12px;${font}color:#ffffff;font-weight:bold;font-size:16px;letter-spacing:1px;text-transform:uppercase;line-height:1.1;">Valencia Basket<br><span style="color:${ORANGE};font-size:10px;letter-spacing:3px;">Academy UAE</span></span>
    </td></tr>
    <tr><td style="height:5px;line-height:5px;font-size:0;background:${ORANGE};">&nbsp;</td></tr>
    <tr><td style="padding:30px 28px 8px;${font}font-size:16px;line-height:1.6;color:#1f2937;">
      <h1 style="margin:0 0 14px;${font}font-size:22px;line-height:1.25;color:#111111;font-weight:bold;">Thanks, ${safeName}. We've got your message!</h1>
      <p style="margin:0 0 16px;">Thank you for getting in touch with Valencia Basket Academy UAE. We've received your details and our team is already on it.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 22px;"><tr>
        <td style="background:#fff7ed;border-left:4px solid ${ORANGE};padding:14px 16px;${font}font-size:15px;line-height:1.55;color:#1f2937;">
          <b style="color:#c2410c;">What happens next:</b> a member of our team will contact you within <b style="color:#c2410c;">24 hours</b> by phone or WhatsApp to help with your request.
        </td></tr></table>
      <p style="margin:0 0 16px;">Need us sooner? Message us on WhatsApp and we'll get straight back to you.</p>
      <div style="margin:4px 0 14px;">${button("Chat on WhatsApp", WHATSAPP_URL, "#25d366")}${button("Explore our programs", `${SITE}/programs`, ORANGE)}</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid #eeeeee;padding:18px 0 6px;${font}font-size:14px;line-height:1.7;color:#4b5563;">
        <b>Where we train:</b> AllSports Arena, Al Quoz, Dubai &middot; <a href="${MAPS_URL}" target="_blank" style="color:${ORANGE};font-weight:bold;text-decoration:none;">Open in Maps</a><br>
        <b>Call or WhatsApp:</b> <a href="tel:+971544386838" style="color:#1f2937;text-decoration:none;">${PHONE_DISPLAY}</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="padding:4px 28px 26px;${font}font-size:16px;line-height:1.6;color:#1f2937;">See you on court,<br><b>The Valencia Basket Academy UAE team</b></td></tr>
    <tr><td style="background:#111111;padding:20px 28px;${font}font-size:12px;line-height:1.6;color:#9ca3af;">
      ${SOCIALS.map(([label, href]) => `<a href="${href}" target="_blank" style="color:#ffffff;text-decoration:none;font-weight:bold;margin-right:14px;">${label}</a>`).join("")}
      <div style="margin-top:10px;color:#6b7280;">You're receiving this because you filled in a form on valenciabasket.ae. Just reply to this email if you have any questions.</div>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;

  const text = [
    `Thanks, ${name}. We've got your message!`,
    "",
    "Thank you for getting in touch with Valencia Basket Academy UAE. We've received your details and our team is already on it.",
    "",
    "What happens next: a member of our team will contact you within 24 hours by phone or WhatsApp to help with your request.",
    "",
    `Need us sooner? Chat with us on WhatsApp: ${WHATSAPP_URL}`,
    `Explore our programs: ${SITE}/programs`,
    "",
    `Where we train: AllSports Arena, Al Quoz, Dubai (${MAPS_URL})`,
    `Call or WhatsApp: ${PHONE_DISPLAY}`,
    "",
    "See you on court,",
    "The Valencia Basket Academy UAE team",
    "",
    SOCIALS.map(([label, href]) => `${label}: ${href}`).join("\n"),
    "",
    "You're receiving this because you filled in a form on valenciabasket.ae. Just reply to this email if you have any questions.",
  ].join("\n");

  return { subject: AUTO_REPLY_SUBJECT, html, text };
}
