import { SHOP, PRODUCTS } from "./config";

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: SHOP.currency,
  maximumFractionDigits: 0,
});

export const money = (n) => peso.format(n);

export const byId = (id) => PRODUCTS.find((p) => p.id === id);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* localStorage can throw (private mode, blocked storage), so wrap it. */
export const storage = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      const parsed = v ? JSON.parse(v) : null;
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* won't persist */
    }
  },
};

/** "8 left", "Only 2 left", "Sold out" */
export function stockLabel(left) {
  if (left == null) return "Checking stock…";
  if (left <= 0) return "Sold out";
  if (left <= 3) return `Only ${left} left`;
  return `${left} left`;
}

export const absoluteUrl = (src) => new URL(src, window.location.href).href;

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}
