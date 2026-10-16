import { useEffect, useRef, useState } from "react";
import { useShop } from "../context/ShopContext";
import { BagIcon } from "./Icons";
import { Blossom } from "./Garden";

const LINKS = [
  { id: "keepsakes", label: "Keepsakes" },
  { id: "custom", label: "Custom" },
  { id: "how-to-order", label: "How to order" },
  { id: "questions", label: "Questions" },
];

/* Stays at the top of the screen the whole time. */
export default function Navbar() {
  const { count, openCart, bumpKey } = useShop();
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const countRef = useRef(null);

  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (window.scrollY < 200) setActive("");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      spy.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const el = countRef.current;
    if (!el || bumpKey === 0) return;
    el.classList.remove("bump");
    void el.offsetWidth;
    el.classList.add("bump");
  }, [bumpKey]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="container header-row">
        <a href="#top" className="wordmark">
          <svg viewBox="-12 -12 24 24" aria-hidden="true"><Blossom x={0} y={0} r={7} /></svg>
          Mama Bunz'
        </a>
        <nav aria-label="Main" className="nav">
          <ul className="nav-links">
            {LINKS.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className={active === id ? "active" : undefined} aria-current={active === id ? "true" : undefined}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button className="basket-btn" onClick={openCart} aria-label={`Open basket, ${count} items`}>
          <BagIcon />
          <span className="basket-label">Basket</span>
          <span className="basket-count" ref={countRef}>{count}</span>
        </button>
      </div>
    </header>
  );
}
