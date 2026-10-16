/* =========================================================
   Receipt
   One HTML builder used for both the emailed receipt and the
   on-screen copy. Email clients ignore <style> tags and most
   modern CSS, so this uses tables and inline styles only.
   ========================================================= */
import { SHOP } from "../config";
import { money } from "../utils";

const C = {
  leaf: "#2F4A35",
  moss: "#5C7A4E",
  sage: "#E4EBDC",
  paper: "#FBF8F0",
  gold: "#E2B04A",
  ink: "#22301F",
  muted: "#5E6B5A",
  line: "#D6DECD",
};
const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const sans = "Figtree, -apple-system, 'Segoe UI', Arial, sans-serif";

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function orderNumber(date = new Date()) {
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MB-${y}${m}${d}-${rand}`;
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString("en-PH", { dateStyle: "long", timeStyle: "short" });
}

function itemRow(it) {
  const details = it.custom
    ? [
        `Flowers: ${esc(it.custom.colorName)}`,
        it.custom.plaqueDesign && `Plaque design: ${esc(it.custom.plaqueDesign)}`,
        it.custom.plaqueName && `Name: ${esc(it.custom.plaqueName)}`,
        it.custom.dates && `Dates: ${esc(it.custom.dates)}`,
        it.custom.message && `Message: “${esc(it.custom.message)}”`,
      ].filter(Boolean).join("<br>")
    : esc(it.flowers);

  return `
  <tr>
    <td width="76" valign="top" style="padding:14px 0;border-bottom:1px solid ${C.line};">
      <img src="${esc(it.image)}" width="64" height="76" alt="" style="display:block;width:64px;height:76px;object-fit:cover;border-radius:32px 32px 8px 8px;background:${C.sage};">
    </td>
    <td valign="top" style="padding:14px 12px;border-bottom:1px solid ${C.line};font-family:${sans};font-size:14px;color:${C.muted};line-height:1.5;">
      <div style="font-family:${serif};font-size:20px;font-weight:600;color:${C.ink};line-height:1.2;">${esc(it.name)}</div>
      ${details}<br>
      ${it.qty} × ${money(it.price)}
    </td>
    <td valign="top" align="right" style="padding:14px 0;border-bottom:1px solid ${C.line};font-family:${sans};font-size:15px;font-weight:700;color:${C.ink};white-space:nowrap;">
      ${money(it.lineTotal)}
    </td>
  </tr>`;
}

export function buildReceiptHtml(order) {
  const c = order.customer;
  const delivery =
    c.method === "Delivery"
      ? `Delivery to:<br>${esc(c.address).replace(/\n/g, "<br>")}`
      : "Pickup (we will message you the details)";
  const contactLine = SHOP.shopEmail
    ? `Questions? Reply to this email or write to <a href="mailto:${esc(SHOP.shopEmail)}" style="color:${C.moss};">${esc(SHOP.shopEmail)}</a>.`
    : "Questions? Message Mama Bunz on Facebook.";

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Receipt ${esc(order.number)}</title></head>
<body style="margin:0;padding:0;background:${C.sage};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sage};">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.paper};border-radius:24px;overflow:hidden;">

    <!-- header -->
    <tr><td align="center" style="background:${C.leaf};padding:34px 24px 26px;">
      <div style="font-size:22px;letter-spacing:10px;color:${C.gold};line-height:1;">❦ ✿ ❦</div>
      <div style="font-family:${serif};font-size:34px;font-weight:600;color:${C.paper};margin-top:10px;">Mama Bunz'</div>
      <div style="font-family:${sans};font-size:13px;color:#C9D8C0;margin-top:4px;">Handcrafted memorial keepsakes</div>
    </td></tr>
    <tr><td style="height:6px;background:${C.gold};line-height:6px;font-size:0;">&nbsp;</td></tr>

    <!-- greeting -->
    <tr><td style="padding:32px 32px 8px;font-family:${sans};color:${C.ink};">
      <div style="font-family:${serif};font-size:30px;font-weight:600;line-height:1.15;">Thank you, ${esc(c.name.split(" ")[0])}.</div>
      <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${C.muted};">
        We've received your order. Mama Bunz will message you on ${esc(c.contact)} with payment details, and your keepsake will be prepared once payment is confirmed.
      </p>
    </td></tr>

    <!-- order meta -->
    <tr><td style="padding:20px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.sage};border-radius:14px;">
        <tr>
          <td style="padding:14px 18px;font-family:${sans};font-size:13px;color:${C.muted};">Order<br><strong style="font-size:16px;color:${C.ink};white-space:nowrap;">${esc(order.number)}</strong></td>
          <td style="padding:14px 18px;font-family:${sans};font-size:13px;color:${C.muted};">Placed<br><strong style="font-size:15px;color:${C.ink};">${esc(formatDate(order.date))}</strong></td>
          <td align="right" style="padding:14px 18px;font-family:${sans};font-size:13px;color:${C.muted};">Payment<br><strong style="font-size:15px;color:#9A6A12;">Awaiting payment</strong></td>
        </tr>
      </table>
    </td></tr>

    <!-- items -->
    <tr><td style="padding:12px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${order.items.map(itemRow).join("")}
        <tr>
          <td></td>
          <td style="padding:18px 12px 0;font-family:${sans};font-size:15px;color:${C.muted};">Total</td>
          <td align="right" style="padding:18px 0 0;font-family:${serif};font-size:30px;font-weight:600;color:${C.leaf};white-space:nowrap;">${money(order.total)}</td>
        </tr>
      </table>
    </td></tr>

    <!-- details -->
    <tr><td style="padding:28px 32px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td valign="top" width="50%" style="padding-right:12px;font-family:${sans};font-size:14px;line-height:1.6;color:${C.muted};">
            <div style="font-family:${serif};font-size:19px;font-weight:600;color:${C.ink};">Getting it to you</div>
            ${delivery}${c.neededBy ? `<br>Needed by ${esc(c.neededBy)}` : ""}
          </td>
          <td valign="top" width="50%" style="font-family:${sans};font-size:14px;line-height:1.6;color:${C.muted};">
            <div style="font-family:${serif};font-size:19px;font-weight:600;color:${C.ink};">Your details</div>
            ${esc(c.name)}<br>${esc(c.contact)}<br>${esc(c.email)}
          </td>
        </tr>
        ${c.notes ? `<tr><td colspan="2" style="padding-top:16px;font-family:${sans};font-size:14px;line-height:1.6;color:${C.muted};"><div style="font-family:${serif};font-size:19px;font-weight:600;color:${C.ink};">Your note</div>${esc(c.notes)}</td></tr>` : ""}
      </table>
    </td></tr>

    <!-- footer -->
    <tr><td align="center" style="padding:28px 32px 34px;font-family:${sans};font-size:13px;line-height:1.6;color:${C.muted};">
      <div style="font-size:16px;letter-spacing:8px;color:${C.moss};">❧ ❦ ☙</div>
      <p style="margin:10px 0 0;">${contactLine}</p>
      <p style="margin:6px 0 0;">Keep this email as your receipt.</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}
