/* =========================================================
   Stock and orders.
   With Firebase configured, stock is shared by every visitor
   and an order lowers it inside a Firestore transaction, so
   two people can't buy the last piece at the same time.
   Without Firebase, everything runs in this browser only
   (demo mode), which is handy for a portfolio preview.
   ========================================================= */
import { PRODUCTS, SERVICES } from "../config";
import { storage } from "../utils";

export const firebaseEnabled = Boolean(SERVICES.firebase.apiKey && SERVICES.firebase.projectId);

const DEMO_STOCK_KEY = "mamabunz-demo-stock";
const DEMO_ORDERS_KEY = "mamabunz-demo-orders";

/* ---------- Firebase (loaded only when configured) ---------- */
let fbPromise = null;
function firebase() {
  if (!fbPromise) {
    fbPromise = Promise.all([import("firebase/app"), import("firebase/firestore")]).then(
      ([app, fs]) => {
        const instance = app.initializeApp(SERVICES.firebase);
        return { fs, db: fs.getFirestore(instance) };
      }
    );
  }
  return fbPromise;
}

/* ---------- Demo stock ---------- */
function demoStock() {
  const saved = storage.get(DEMO_STOCK_KEY, null);
  const base = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock]));
  return saved ? { ...base, ...saved } : base;
}

/**
 * Calls onChange({ [productId]: stock }) now and whenever stock changes.
 * Returns an unsubscribe function.
 */
export function watchStock(onChange) {
  if (!firebaseEnabled) {
    onChange(demoStock());
    const onStorage = (e) => e.key === DEMO_STOCK_KEY && onChange(demoStock());
    window.addEventListener("storage", onStorage); // keeps other tabs in sync
    return () => window.removeEventListener("storage", onStorage);
  }

  let unsub = () => {};
  let cancelled = false;
  firebase().then(({ fs, db }) => {
    if (cancelled) return;
    unsub = fs.onSnapshot(
      fs.collection(db, "products"),
      (snap) => {
        const stock = Object.fromEntries(PRODUCTS.map((p) => [p.id, 0]));
        snap.forEach((d) => {
          if (d.id in stock) stock[d.id] = Number(d.data().stock) || 0;
        });
        onChange(stock);
      },
      (err) => console.error("Could not load stock", err)
    );
  });
  return () => {
    cancelled = true;
    unsub();
  };
}

export class StockError extends Error {
  constructor(shortages) {
    super("Not enough stock");
    this.shortages = shortages; // [{ id, name, wanted, left }]
  }
}

/**
 * Saves the order and lowers stock for ready-made items.
 * Throws StockError if any item no longer has enough left.
 */
export async function placeOrder(order) {
  // total quantity per ready-made product (custom items are made to order)
  const needed = {};
  order.items.forEach((it) => {
    if (!it.custom) needed[it.productId] = (needed[it.productId] || 0) + it.qty;
  });

  if (!firebaseEnabled) {
    const stock = demoStock();
    const shortages = Object.entries(needed)
      .filter(([id, qty]) => (stock[id] ?? 0) < qty)
      .map(([id, qty]) => ({ id, name: PRODUCTS.find((p) => p.id === id)?.name, wanted: qty, left: stock[id] ?? 0 }));
    if (shortages.length) throw new StockError(shortages);
    Object.entries(needed).forEach(([id, qty]) => (stock[id] -= qty));
    storage.set(DEMO_STOCK_KEY, stock);
    storage.set(DEMO_ORDERS_KEY, [...storage.get(DEMO_ORDERS_KEY, []), order]);
    return { stock };
  }

  const { fs, db } = await firebase();
  await fs.runTransaction(db, async (tx) => {
    const refs = Object.keys(needed).map((id) => fs.doc(db, "products", id));
    const snaps = await Promise.all(refs.map((r) => tx.get(r)));
    const shortages = [];
    snaps.forEach((snap, i) => {
      const id = refs[i].id;
      const left = snap.exists() ? Number(snap.data().stock) || 0 : 0;
      if (left < needed[id]) {
        shortages.push({ id, name: PRODUCTS.find((p) => p.id === id)?.name, wanted: needed[id], left });
      }
    });
    if (shortages.length) throw new StockError(shortages);
    snaps.forEach((snap, i) => {
      tx.update(refs[i], { stock: (Number(snap.data().stock) || 0) - needed[refs[i].id] });
    });
    tx.set(fs.doc(db, "orders", order.number), {
      ...order,
      status: "awaiting-payment",
      createdAt: fs.serverTimestamp(),
    });
  });
  return {};
}

/** Demo-mode helper so a portfolio visitor can refill stock. */
export function resetDemoStock() {
  storage.set(DEMO_STOCK_KEY, null);
  return demoStock();
}
