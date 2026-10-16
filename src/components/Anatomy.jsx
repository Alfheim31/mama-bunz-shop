import { PRODUCTS } from "../config";
import { Sprig } from "./Garden";

const LEFT = [
  { title: "Handshaped flowers", text: "Daisies, sunflowers and anthuriums twisted petal by petal from soft chenille." },
  { title: "Memorial plaque", text: "An In Loving Memory card with a short verse, set behind the light." },
];
const RIGHT = [
  { title: "Flameless candle", text: "A warm LED glow. No fire, no melting wax, safe to leave lit." },
  { title: "A basket that stands", text: "Sized for a home altar, a shelf, or beside a resting place." },
];

const Part = ({ title, text }) => (
  <li className="part">
    <h3>{title}</h3>
    <p>{text}</p>
  </li>
);

export default function Anatomy() {
  const example = PRODUCTS.find((p) => p.id === "garden-white") || PRODUCTS[0];
  return (
    <section className="anatomy" aria-labelledby="anatomyTitle">
      <div className="container">
        <div className="section-head">
          <Sprig />
          <h2 id="anatomyTitle">What's in every basket</h2>
          <p>Fresh flowers fade within days. These stay, so the people we miss keep a light and a few flowers long after the visit.</p>
        </div>
        <figure className="anatomy-figure">
          <ul className="parts left">{LEFT.map((p) => <Part key={p.title} {...p} />)}</ul>
          <img src={example.cutout} alt={`${example.name} basket, showing the flowers, candle, plaque and basket`} loading="lazy" />
          <ul className="parts right">{RIGHT.map((p) => <Part key={p.title} {...p} />)}</ul>
        </figure>
      </div>
    </section>
  );
}
