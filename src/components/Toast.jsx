import { useShop } from "../context/ShopContext";

export default function Toast() {
  const { toastMsg } = useShop();
  return (
    <div className={`toast${toastMsg ? " show" : ""}`} role="status" aria-live="polite">
      {toastMsg}
    </div>
  );
}
