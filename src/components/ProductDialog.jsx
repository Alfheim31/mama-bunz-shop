import { useEffect, useRef, useState } from "react";
import { useShop } from "../context/ShopContext";
import { money, stockLabel } from "../utils";
import QtyStepper from "./QtyStepper";

export default function ProductDialog() {
  const { viewing: p, closeProduct, addToCart, stock, available } = useShop();
  const ref = useRef(null);
  const [qty, setQty] = useState(1);
  const left = p && stock ? stock[p.id] : null;
  const room = p && stock ? available(p.id) : 0;

  useEffect(() => {
    const d = ref.current;
    if (p && !d.open) {
      setQty(1);
      d.showModal();
    } else if (!p && d.open) {
      d.close();
    }
  }, [p]);

  const add = () => {
    addToCart(p.id, qty);
    closeProduct();
  };

  return (
    <dialog
      ref={ref}
      className="product-dialog"
      aria-labelledby="pdName"
      onClose={closeProduct}
      onClick={(e) => e.target === ref.current && closeProduct()}
    >
      {p && (
        <>
          <button className="close-btn" onClick={closeProduct} aria-label="Close">×</button>
          <div className="pd-media">
            <img src={p.photo} alt={`${p.name}: ${p.flowers}, with a flameless candle and In Loving Memory plaque`} />
          </div>
          <div className="pd-info">
            <h3 id="pdName">{p.name}</h3>
            <p className="pd-flowers">{p.flowers}</p>
            <div className="pd-price-row">
              <span className="pd-price">{money(p.price)}</span>
              <span className={`stock-pill${left === 0 ? " is-out" : left != null && left <= 3 ? " is-low" : ""}`}>{stockLabel(left)}</span>
            </div>
            <p className="pd-desc">{p.description}</p>
            <ul className="pd-includes">
              <li>Handshaped chenille flowers</li>
              <li>Flameless LED candle</li>
              <li>In Loving Memory plaque</li>
            </ul>
            <div className="pd-buy">
              {room > 0 && <QtyStepper value={Math.min(qty, room)} onChange={setQty} max={room} />}
              <button className="btn btn-leaf" onClick={add} disabled={room <= 0}>
                {left === 0 ? "Sold out" : room > 0 ? "Add to basket" : "All available are in your basket"}
              </button>
            </div>
            <a className="pd-custom" href="#custom" onClick={closeProduct}>Want a name on the plaque? Make a custom one.</a>
          </div>
        </>
      )}
    </dialog>
  );
}
