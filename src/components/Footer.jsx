import { firebaseEnabled, resetDemoStock } from "../services/backend";
import { useShop } from "../context/ShopContext";
import { Blossom, Hedge } from "./Garden";

export default function Footer() {
  const { setStock, toast } = useShop();
  const reset = () => {
    setStock(resetDemoStock());
    toast("Demo stock refilled");
  };
  return (
    <footer className="footer">
      <Hedge seed={23} className="hedge hedge-top" flip />
      <div className="container footer-row">
        <div>
          <a href="#top" className="wordmark">
            <svg viewBox="-12 -12 24 24" aria-hidden="true"><Blossom x={0} y={0} r={7} /></svg>
            Mama Bunz'
          </a>
          <p>Handcrafted memorial keepsakes.</p>
        </div>
        <div className="footer-meta">
          <small>© {new Date().getFullYear()} Mama Bunz' Shop. Website by <a href="https://github.com/Alfheim31">Amiere</a>.</small>
          {!firebaseEnabled && (
            <button className="link-btn" onClick={reset}>Demo mode: refill stock</button>
          )}
        </div>
      </div>
    </footer>
  );
}
