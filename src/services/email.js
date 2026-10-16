/* =========================================================
   Emailed receipts through EmailJS (emailjs.com).
   The EmailJS template only needs:
     To email:  {{to_email}}
     Subject:   Your Mama Bunz' receipt · {{order_number}}
     Content:   {{{receipt_html}}}   ← three braces = raw HTML
   ========================================================= */
import { SERVICES, SHOP } from "../config";

export const emailEnabled = Boolean(
  SERVICES.emailjs.publicKey && SERVICES.emailjs.serviceId && SERVICES.emailjs.templateId
);

export async function sendReceipt(order, html) {
  if (!emailEnabled) return { sent: false, reason: "demo" };
  const { default: emailjs } = await import("@emailjs/browser");
  await emailjs.send(
    SERVICES.emailjs.serviceId,
    SERVICES.emailjs.templateId,
    {
      to_email: order.customer.email,
      to_name: order.customer.name,
      order_number: order.number,
      order_total: order.total,
      reply_to: SHOP.shopEmail || undefined,
      receipt_html: html,
    },
    { publicKey: SERVICES.emailjs.publicKey }
  );
  return { sent: true };
}
