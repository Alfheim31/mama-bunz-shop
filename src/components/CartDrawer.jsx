import { cloneElement, useEffect, useRef, useState } from "react";
import { SHOP } from "../config";
import { useShop } from "../context/ShopContext";
import { absoluteUrl, copyText, money } from "../utils";
import { firebaseEnabled, placeOrder, StockError } from "../services/backend";
import { emailEnabled, sendReceipt } from "../services/email";
import { buildReceiptHtml, orderNumber } from "../services/receipt";
import QtyStepper from "./QtyStepper";
import ReceiptDialog from "./ReceiptDialog";

const EMPTY_FORM = { name: "", email: "", contact: "", method: "Pickup", address: "", neededBy: "", notes: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function messengerText(order) {
  return [
    `Hi Mama Bunz! I just placed order ${order.number} on your website.`,
    "",
    ...order.items.map((it) => `• ${it.qty} × ${it.name}${it.custom ? ` (${it.custom.colorName}, ${it.custom.plaqueDesign} plaque: ${it.custom.plaqueName})` : ""}`),
    "",
    `Total: ${money(order.total)}`,
    `Name: ${order.customer.name}`,
    `${order.customer.method}${order.customer.method === "Delivery" ? `: ${order.customer.address}` : ""}`,
    "",
    "How can I pay?",
  ].join("\n");
}

export default function CartDrawer() {
  const { lines, total, setQty, cartOpen, closeCart, toast, stock, setStock, clearCart } = useShop();
  const [form, setForm] = useState(EMPTY_FORM);
  const [invalid, setInvalid] = useState({});
  const [status, setStatus] = useState("idle"); // idle | placing | done
  const [problem, setProblem] = useState("");
  const [order, setOrder] = useState(null); // { ...order, html, emailed }
  const [showReceipt, setShowReceipt] = useState(false);
  const closeBtn = useRef(null);
  const formRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    if (!cartOpen) return;
    lastFocus.current = document.activeElement;
    closeBtn.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && !showReceipt && closeCart();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [cartOpen, closeCart, showReceipt]);

  // after a finished order, opening the basket again starts fresh
  useEffect(() => {
    if (!cartOpen && status === "done") {
      setStatus("idle");
      setOrder(null);
    }
  }, [cartOpen, status]);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setInvalid((v) => ({ ...v, [name]: undefined }));
  };

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Add your name.";
    if (!EMAIL_RE.test(form.email.trim())) errs.email = "Add an email address like name@gmail.com. Your receipt goes there.";
    if (!form.contact.trim()) errs.contact = "Add a mobile number or Facebook name so Mama Bunz can reach you.";
    if (form.method === "Delivery" && !form.address.trim()) errs.address = "Add the delivery address.";
    setInvalid(errs);
    const first = Object.keys(errs)[0];
    if (first) formRef.current?.elements[first]?.focus();
    return !first;
  }

  async function submit(e) {
    e.preventDefault();
    setProblem("");
    if (!validate()) return;

    // quick check against the latest stock we know about
    const over = lines.filter((l) => !l.custom && stock && l.qty > (stock[l.productId] ?? 0));
    if (over.length) {
      over.forEach((l) => setQty(l.key, stock[l.productId] ?? 0));
      setProblem("Some keepsakes sold out while you were shopping. We've updated your basket. Please check it and place the order again.");
      return;
    }

    const now = new Date();
    const newOrder = {
      number: orderNumber(now),
      date: now.toISOString(),
      customer: {
        name: form.name.trim(),
        email: form.email.trim(),
        contact: form.contact.trim(),
        method: form.method,
        address: form.method === "Delivery" ? form.address.trim() : "",
        neededBy: form.neededBy,
        notes: form.notes.trim(),
      },
      items: lines.map((l) => ({
        productId: l.productId,
        name: l.name,
        flowers: l.product.flowers,
        qty: l.qty,
        price: l.price,
        lineTotal: l.lineTotal,
        image: absoluteUrl(l.product.photo),
        ...(l.custom ? { custom: l.custom } : {}),
      })),
      total,
    };

    setStatus("placing");
    try {
      const result = await placeOrder(newOrder);
      if (result.stock) setStock(result.stock); // demo mode; Firebase updates itself
    } catch (err) {
      setStatus("idle");
      if (err instanceof StockError) {
        err.shortages.forEach((s) => setQty(s.id, s.left));
        setProblem(
          err.shortages.map((s) => (s.left ? `Only ${s.left} ${s.name} left.` : `${s.name} just sold out.`)).join(" ") +
            " We've updated your basket. Please place the order again."
        );
      } else {
        console.error(err);
        setProblem("The order couldn't be saved. Check your internet connection and try again.");
      }
      return;
    }

    const html = buildReceiptHtml(newOrder);
    let emailed = false;
    try {
      emailed = (await sendReceipt(newOrder, html)).sent;
    } catch (err) {
      console.error("Receipt email failed", err);
    }

    setOrder({ ...newOrder, html, emailed });
    clearCart();
    setForm((f) => ({ ...EMPTY_FORM, name: f.name, email: f.email, contact: f.contact }));
    setStatus("done");
  }

  async function messageToPay() {
    const copied = await copyText(messengerText(order));
    if (SHOP.messengerUsername) {
      window.open(`https://m.me/${encodeURIComponent(SHOP.messengerUsername)}`, "_blank", "noopener");
      toast(copied ? "Order details copied. Paste them in the chat." : "Messenger opened.");
    } else {
      toast(copied ? "Order details copied. Paste them in a message to Mama Bunz." : "Couldn't copy on this browser.");
    }
  }

  const err = (name) => invalid[name];
  const demo = !firebaseEnabled || !emailEnabled;

  return (
    <>
      {cartOpen && <div className="scrim" onClick={closeCart} />}
      <aside className={`cart${cartOpen ? " open" : ""}`} aria-label="Your basket" aria-hidden={!cartOpen} inert={cartOpen ? undefined : ""}>
        <div className="cart-head">
          <h2>{status === "done" ? "Order placed" : "Your basket"}</h2>
          <button ref={closeBtn} className="close-btn" onClick={closeCart} aria-label="Close basket">×</button>
        </div>

        <div className="cart-body">
          {status === "done" && order ? (
            <div className="order-done">
              <p className="order-number">Order {order.number}</p>
              <h3>Thank you, {order.customer.name.split(" ")[0]}.</h3>
              <p>
                {order.emailed
                  ? <>Your receipt is on its way to <strong>{order.customer.email}</strong>.</>
                  : <>Your receipt is ready to view.{!emailEnabled && " (Emails are off in demo mode.)"}</>}
              </p>
              <p>Next, message Mama Bunz to pay. Your keepsake is prepared once payment is confirmed.</p>
              <div className="order-actions">
                <button className="btn btn-leaf wide" onClick={messageToPay}>Message Mama Bunz to pay</button>
                <button className="btn btn-quiet wide" onClick={() => setShowReceipt(true)}>View receipt</button>
              </div>
            </div>
          ) : lines.length === 0 ? (
            <p className="cart-empty">
              Your basket is empty. <a href="#keepsakes" onClick={closeCart}>Choose a keepsake</a>.
            </p>
          ) : (
            <>
              <ul className="cart-items">
                {lines.map((l) => {
                  const max = l.custom ? 20 : stock?.[l.productId] ?? l.qty;
                  return (
                    <li className="cart-item" key={l.key}>
                      <div className="cart-thumb" style={{ "--tint": l.product.bg }}>
                        <img src={l.product.cutout} alt="" />
                      </div>
                      <div>
                        <h3>{l.name}</h3>
                        {l.custom ? (
                          <p className="cart-custom">
                            {l.custom.colorName} · {l.custom.plaqueDesign} plaque · “{l.custom.plaqueName}”
                            {l.custom.dates && <> · {l.custom.dates}</>}
                          </p>
                        ) : (
                          max <= 3 && <p className="cart-custom">Only {max} left</p>
                        )}
                        <p className="cart-line">{money(l.price)} × {l.qty} = <strong>{money(l.lineTotal)}</strong></p>
                        <QtyStepper value={l.qty} min={0} max={max} onChange={(q) => setQty(l.key, q)} label={`Quantity of ${l.name}`} />
                      </div>
                      <button className="remove" type="button" onClick={() => setQty(l.key, 0)}>Remove</button>
                    </li>
                  );
                })}
              </ul>

              <form className="checkout" ref={formRef} onSubmit={submit} noValidate>
                <div className="subtotal"><span>Total</span><strong>{money(total)}</strong></div>

                <Field label="Your name" name="name" error={err("name")}>
                  <input name="name" autoComplete="name" value={form.name} onChange={update} />
                </Field>
                <Field label="Email for your receipt" name="email" error={err("email")}>
                  <input name="email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={update} />
                </Field>
                <Field label="Mobile number or Facebook name" name="contact" error={err("contact")}>
                  <input name="contact" autoComplete="tel" value={form.contact} onChange={update} />
                </Field>

                <fieldset className="segmented">
                  <legend>How will you get it?</legend>
                  {["Pickup", "Delivery"].map((m) => (
                    <label key={m}>
                      <input type="radio" name="method" value={m} checked={form.method === m} onChange={update} /> {m}
                    </label>
                  ))}
                </fieldset>

                {form.method === "Delivery" && (
                  <Field label="Delivery address" name="address" error={err("address")}>
                    <textarea name="address" rows="2" autoComplete="street-address" value={form.address} onChange={update} />
                  </Field>
                )}
                <Field label="Needed by (optional)" name="neededBy">
                  <input name="neededBy" type="date" value={form.neededBy} onChange={update} />
                </Field>
                <Field label="Notes for Mama Bunz (optional)" name="notes">
                  <textarea name="notes" rows="2" value={form.notes} onChange={update} />
                </Field>

                {problem && <p className="form-problem" role="alert">{problem}</p>}
                <button className="btn btn-sun wide" type="submit" disabled={status === "placing"}>
                  {status === "placing" ? "Placing order…" : `Place order · ${money(total)}`}
                </button>
                <p className="fine">
                  You'll get a receipt by email, then pay Mama Bunz on Messenger. Nothing is charged on this site.
                  {demo && " Demo mode: stock is saved in this browser only."}
                </p>
              </form>
            </>
          )}
        </div>
      </aside>

      {order && <ReceiptDialog open={showReceipt} html={order.html} number={order.number} onClose={() => setShowReceipt(false)} />}
    </>
  );
}

function Field({ label, name, error, children }) {
  const id = `f-${name}`;
  const child = cloneElement(children, { id, "aria-invalid": error ? "true" : undefined, "aria-describedby": error ? `${id}-err` : undefined });
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {child}
      {error && <p className="field-error" id={`${id}-err`}>{error}</p>}
    </div>
  );
}
