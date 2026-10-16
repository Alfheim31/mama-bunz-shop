import { PRODUCTS } from "../config";
import ProductCard from "./ProductCard";
import { Sprig } from "./Garden";

export default function Shop() {
  return (
    <section className="collection" id="keepsakes" aria-labelledby="shopTitle">
      <div className="container">
        <div className="section-head">
          <Sprig />
          <h2 id="shopTitle">Choose a keepsake</h2>
          <p>Each one is made by hand, so only a few of each colour are ready at a time. Tap a basket to see the full photo.</p>
        </div>
        <ul className="tiles">
          {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
        </ul>
      </div>
    </section>
  );
}
