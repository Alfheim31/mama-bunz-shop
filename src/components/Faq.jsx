import { useState } from "react";
import { FAQS, SHOP } from "../config";
import { FacebookIcon, InstagramIcon, MessengerIcon } from "./Icons";
import { Sprig } from "./Garden";

function Socials() {
  const links = [
    { url: SHOP.facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { url: SHOP.instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { url: SHOP.messengerUsername ? `https://m.me/${SHOP.messengerUsername}` : "", label: "Messenger", Icon: MessengerIcon },
  ].filter((l) => l.url);
  if (!links.length) return null;
  return (
    <div className="socials">
      {links.map(({ url, label, Icon }) => (
        <a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon /></a>
      ))}
    </div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(-1);
  return (
    <section className="questions" id="questions" aria-labelledby="faqTitle">
      <div className="container">
        <div className="questions-intro">
          <Sprig />
          <h2 id="faqTitle">Questions</h2>
          <p>What people usually ask before ordering. For anything else, send us a message.</p>
          <Socials />
        </div>
        <div>
          {FAQS.map((f, i) => (
            <div className="qa" key={f.q}>
              <button
                className="qa-q"
                id={`qa-q-${i}`}
                aria-expanded={open === i}
                aria-controls={`qa-a-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                {f.q}
                <span className="qa-icon" aria-hidden="true" />
              </button>
              <div className="qa-a" id={`qa-a-${i}`} role="region" aria-labelledby={`qa-q-${i}`}>
                <div><p>{f.a}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
