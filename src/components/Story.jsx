import groupPhoto from "../assets/img/group.jpg";

const STEPS = [
  { title: "Choose your keepsakes", text: "Pick ready-made baskets, or make a custom one with their name." },
  { title: "Place your order", text: "Add your email and you'll get a receipt right away." },
  { title: "Pay on Messenger", text: "Mama Bunz confirms your order, sends payment details, and arranges pickup or delivery." },
];

export default function Story() {
  return (
    <section className="story" id="how-to-order" aria-labelledby="storyTitle">
      <div className="container">
        <figure className="story-photo">
          <img
            src={groupPhoto}
            alt="Five memorial baskets in sunflower, white, pink and lavender, each with a glowing candle"
            loading="lazy"
          />
        </figure>
        <div className="story-copy">
          <h2 id="storyTitle">Grown by hand, one petal at a time</h2>
          {/* TODO: replace with Mama Bunz' own story */}
          <p>Every flower and leaf is shaped by hand at home, then gathered into a basket around the candle and plaque.</p>
          <ol className="order-steps">
            {STEPS.map((s) => (
              <li key={s.title}>
                <div><strong>{s.title}</strong><span>{s.text}</span></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
