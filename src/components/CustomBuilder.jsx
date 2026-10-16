import { useState } from "react";
import { CUSTOM, PLAQUES, PRODUCTS, SHOP } from "../config";
import { money } from "../utils";
import { useShop } from "../context/ShopContext";
import { Hedge } from "./Garden";

/* Short colour names for the custom picker. */
const COLOURS = {
  "sunflower-glow": "Sunflower yellow",
  "garden-white": "White with green",
  "daisy-gold": "White with gold",
  "blush-pink": "Blush pink",
  "lavender-peace": "Lavender",
};

const EMPTY = { plaqueName: "", dates: "", message: "" };

/* The chosen plaque photo, with the customer's words shown
   where the printed verse normally sits. */
function PlaquePreview({ plaque, name, dates, message }) {
  const { top, bottom } = plaque.verse;
  return (
    <div className="plaque-preview">
      <img src={plaque.cutout} alt="" />
      <div
        className="plaque-words"
        style={{ top: `${top * 100}%`, height: `${(bottom - top) * 100}%`, "--paper": plaque.paper }}
      >
        <span className="pw-name">{name || "Their name"}</span>
        {dates && <span className="pw-dates">{dates}</span>}
        {message && <span className="pw-msg">{message}</span>}
      </div>
    </div>
  );
}

export default function CustomBuilder() {
  const { addCustom } = useShop();
  const [colorId, setColorId] = useState(PRODUCTS[0].id);
  const [plaqueId, setPlaqueId] = useState(PLAQUES[0].id);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const base = PRODUCTS.find((p) => p.id === colorId);
  const plaque = PLAQUES.find((p) => p.id === plaqueId);

  const update = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (e.target.name === "plaqueName") setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.plaqueName.trim()) {
      setError("Add the name that should go on the plaque.");
      e.currentTarget.elements.plaqueName.focus();
      return;
    }
    addCustom(colorId, {
      colorName: COLOURS[colorId],
      plaqueDesign: plaque.name,
      plaqueName: form.plaqueName.trim(),
      dates: form.dates.trim(),
      message: form.message.trim(),
    });
    setForm(EMPTY);
  };

  return (
    <section className="custom" id="custom" aria-labelledby="customTitle">
      <Hedge seed={17} className="hedge hedge-top" flip />
      <div className="container custom-grid">
        <div className="custom-preview" aria-hidden="true">
          <div className="custom-arch" style={{ "--tint": base.bg }}>
            <img src={base.cutout} alt="" />
          </div>
          <PlaquePreview plaque={plaque} name={form.plaqueName} dates={form.dates} message={form.message} />
        </div>

        <form className="custom-form" onSubmit={submit} noValidate>
          <h2 id="customTitle">Make one with their name</h2>
          <p className="custom-intro">
            Choose the flowers and the plaque, then write what it should say. Their name replaces the printed verse.
            Custom keepsakes are made to order, and Mama Bunz will confirm the details with you before she starts.
          </p>

          <fieldset className="colour-pick">
            <legend>Flower colours</legend>
            <div className="colour-options">
              {PRODUCTS.map((p) => (
                <label key={p.id} className="colour-option" style={{ "--sw": p.bg }}>
                  <input type="radio" name="colour" value={p.id} checked={colorId === p.id} onChange={() => setColorId(p.id)} />
                  <span className="colour-dot" aria-hidden="true" />
                  {COLOURS[p.id]}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="plaque-pick">
            <legend>Plaque design</legend>
            <div className="plaque-options">
              {PLAQUES.map((p) => (
                <label key={p.id} className="plaque-option">
                  <input type="radio" name="plaque" value={p.id} checked={plaqueId === p.id} onChange={() => setPlaqueId(p.id)} />
                  <img src={p.cutout} alt="" />
                  <span>
                    <strong>{p.name}</strong>
                    <small>{p.description}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label>
            Name on the plaque
            <input name="plaqueName" value={form.plaqueName} onChange={update} maxLength={CUSTOM.maxName} placeholder="e.g. Lola Ising" aria-invalid={error ? "true" : undefined} aria-describedby="customError" />
          </label>
          <label>
            Dates (optional)
            <input name="dates" value={form.dates} onChange={update} maxLength={CUSTOM.maxDates} placeholder="e.g. 1941 – 2024" />
          </label>
          <label>
            Short message (optional)
            <input name="message" value={form.message} onChange={update} maxLength={CUSTOM.maxMessage} placeholder="e.g. Forever in our hearts" />
            <small>{form.message.length}/{CUSTOM.maxMessage}</small>
          </label>
          <p className="form-error" id="customError" role="alert">{error}</p>

          <div className="custom-buy">
            <span className="custom-price">{money(SHOP.customPrice)}</span>
            <button className="btn btn-sun" type="submit">Add custom keepsake</button>
          </div>
        </form>
      </div>
    </section>
  );
}
