/* − 1 + control, shared by the product dialog and the basket. */
export default function QtyStepper({ value, onChange, label = "Quantity", min = 1, max = 99 }) {
  return (
    <div className="qty" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="One less">−</button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="One more">+</button>
    </div>
  );
}
