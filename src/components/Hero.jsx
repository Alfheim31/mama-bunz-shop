import { useCallback, useEffect, useRef, useState } from "react";
import { PRODUCTS } from "../config";
import { money, prefersReducedMotion, stockLabel } from "../utils";
import { useShop } from "../context/ShopContext";
import { ArchVine, Hedge } from "./Garden";

const AUTOPLAY_MS = 7000;

export default function Hero({ ready }) {
  const { addToCart, openProduct, stock, available } = useShop();
  const [featured, setFeatured] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const n = PRODUCTS.length;
  const product = PRODUCTS[featured];
  const left = stock ? stock[product.id] : null;
  const canAdd = stock && available(product.id) > 0;

  const go = useCallback((i) => setFeatured(((i % n) + n) % n), [n]);

  useEffect(() => {
    if (!ready || paused || prefersReducedMotion()) return;
    const t = setTimeout(() => go(featured + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [featured, paused, go, ready]);

  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(featured + (dx < 0 ? 1 : -1));
    touchX.current = null;
  };

  return (
    <section
      className="hero"
      id="top"
      aria-labelledby="heroTitle"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 id="heroTitle">Flowers that stay in bloom for the ones we miss.</h1>
          <p className="hero-intro">
            Handmade memorial baskets with chenille flowers, a flameless candle and an
            In Loving Memory plaque. {money(PRODUCTS[0].price)} each, or make one with their name on it.
          </p>

          <div className="featured" aria-live="polite">
            <div className="featured-top">
              <span className="featured-name">{product.name}</span>
              <span className="featured-price">{money(product.price)}</span>
            </div>
            <p className="featured-flowers">{product.flowers}</p>
            <p className={`stock-note${left === 0 ? " is-out" : left != null && left <= 3 ? " is-low" : ""}`}>{stockLabel(left)}</p>
            <div className="featured-actions">
              <button className="btn btn-leaf" onClick={() => addToCart(product.id)} disabled={!canAdd}>
                {left === 0 ? "Sold out" : "Add to basket"}
              </button>
              <button className="btn btn-quiet" onClick={() => openProduct(product)}>See it up close</button>
            </div>
          </div>
        </div>

        <div className="garden-arch">
          <div
            className="arch"
            style={{ "--tint": product.bg }}
            aria-roledescription="carousel"
            aria-label="Featured keepsake"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {PRODUCTS.map((p, i) => (
              <div key={p.id} className={`arch-slide${i === featured ? " is-active" : ""}`} aria-hidden={i !== featured}>
                <img src={p.cutout} alt={i === featured ? `${p.name} memorial basket` : ""} />
              </div>
            ))}
            <ArchVine />
          </div>

          <ul className="picker" role="tablist" aria-label="Choose a keepsake">
            {PRODUCTS.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  role="tab"
                  className="pick"
                  aria-selected={i === featured}
                  aria-label={p.name}
                  style={{ "--sw": p.bg }}
                  onClick={() => go(i)}
                >
                  <img src={p.cutout} alt="" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Hedge seed={5} className="hedge hedge-hero" />
    </section>
  );
}
