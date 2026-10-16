import { SHOP } from "../config";

export default function UndasBand() {
  if (!SHOP.announcement) return null;
  return (
    <div className="undas">
      <div className="container">
        <p>{SHOP.announcement}</p>
        <a href="#keepsakes">Choose a keepsake</a>
      </div>
    </div>
  );
}
