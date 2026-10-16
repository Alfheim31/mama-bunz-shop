import { money, stockLabel } from "../utils";
import { useShop } from "../context/ShopContext";

export default function ProductCard({ product }) {
  const { addToCart, openProduct, stock, available } = useShop();
  const left = stock ? stock[product.id] : null;
  const room = stock ? available(product.id) : 0;
  const soldOut = left === 0;

  return (
    <li className={`tile${soldOut ? " is-sold-out" : ""}`} style={{ "--tint": product.bg }}>
      <button className="tile-media" onClick={() => openProduct(product)} aria-label={`See ${product.name} up close`}>
        <img src={product.cutout} alt="" loading="lazy" />
        <span className={`stock-pill${soldOut ? " is-out" : left != null && left <= 3 ? " is-low" : ""}`}>{stockLabel(left)}</span>
      </button>
      <h3>{product.name}</h3>
      <p className="tile-flowers">{product.flowers}</p>
      <div className="tile-foot">
        <span className="tile-price">{money(product.price)}</span>
        <button className="btn btn-leaf" onClick={() => addToCart(product.id)} disabled={!room}>
          {soldOut ? "Sold out" : room ? "Add to basket" : "All in basket"}
        </button>
      </div>
    </li>
  );
}
