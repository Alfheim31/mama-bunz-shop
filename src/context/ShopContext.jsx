import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CUSTOM, SHOP } from "../config";
import { byId, storage } from "../utils";
import { watchStock } from "../services/backend";

const ShopContext = createContext(null);
const CART_KEY = "mamabunz-cart-v2";

/* A basket line is either a ready-made keepsake:
     { key: "sunflower-glow", productId, qty }
   or a custom one (made to order, so no stock limit):
     { key: "custom-…", productId: <colour base>, qty, custom: { colorName, plaqueName, dates, message } }
*/
function loadCart() {
  const saved = storage.get(CART_KEY, []);
  return Array.isArray(saved) ? saved.filter((l) => byId(l.productId) && l.qty > 0) : [];
}

export function describeLine(line) {
  const p = byId(line.productId);
  const price = line.custom ? SHOP.customPrice : p.price;
  return {
    ...line,
    product: p,
    name: line.custom ? CUSTOM.name : p.name,
    price,
    lineTotal: price * line.qty,
  };
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [stock, setStock] = useState(null); // null until first load
  const [cartOpen, setCartOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [bumpKey, setBumpKey] = useState(0);
  const toastTimer = useRef();

  useEffect(() => storage.set(CART_KEY, cart), [cart]);
  useEffect(() => watchStock(setStock), []);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 3400);
  }, []);

  const inCart = useCallback(
    (productId) => cart.filter((l) => !l.custom && l.productId === productId).reduce((s, l) => s + l.qty, 0),
    [cart]
  );

  /** How many more of a ready-made keepsake can still go in the basket. */
  const available = useCallback(
    (productId) => (stock ? Math.max(0, (stock[productId] ?? 0) - inCart(productId)) : 0),
    [stock, inCart]
  );

  const addToCart = useCallback(
    (productId, qty = 1) => {
      const p = byId(productId);
      const room = available(productId);
      if (room <= 0) {
        toast(stock?.[productId] ? `All ${stock[productId]} ${p.name} are already in your basket` : `${p.name} is sold out`);
        return;
      }
      const add = Math.min(qty, room);
      setCart((c) => {
        const existing = c.find((l) => l.key === productId);
        return existing
          ? c.map((l) => (l.key === productId ? { ...l, qty: l.qty + add } : l))
          : [...c, { key: productId, productId, qty: add }];
      });
      setBumpKey((k) => k + 1);
      toast(add < qty ? `Only ${add} more ${p.name} available. Added ${add}.` : `${p.name} added to your basket`);
    },
    [available, stock, toast]
  );

  const addCustom = useCallback(
    (productId, custom) => {
      setCart((c) => [...c, { key: `custom-${Date.now()}`, productId, qty: 1, custom }]);
      setBumpKey((k) => k + 1);
      toast("Custom keepsake added to your basket");
    },
    [toast]
  );

  const setQty = useCallback(
    (key, qty) => {
      setCart((c) =>
        c
          .map((l) => {
            if (l.key !== key) return l;
            if (l.custom) return { ...l, qty: Math.min(20, qty) };
            const max = (stock?.[l.productId] ?? 0);
            return { ...l, qty: Math.min(qty, max) };
          })
          .filter((l) => l.qty > 0)
      );
    },
    [stock]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const lines = useMemo(() => cart.map(describeLine), [cart]);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.lineTotal, 0);

  const value = {
    lines, count, total, stock, setStock,
    available, addToCart, addCustom, setQty, clearCart,
    cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
    viewing, openProduct: (p) => setViewing(p), closeProduct: () => setViewing(null),
    toastMsg, toast, bumpKey,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
