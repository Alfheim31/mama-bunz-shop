/* Images are imported so Vite can bundle and fingerprint them. */
import sunflowerCutout from "./assets/img/sunflower-cutout.webp";
import sunflowerPhoto from "./assets/img/sunflower.jpg";
import gardenwhiteCutout from "./assets/img/garden-white-cutout.webp";
import gardenwhitePhoto from "./assets/img/garden-white.jpg";
import daisygoldCutout from "./assets/img/daisy-gold-cutout.webp";
import daisygoldPhoto from "./assets/img/daisy-gold.jpg";
import blushpinkCutout from "./assets/img/blush-pink-cutout.webp";
import blushpinkPhoto from "./assets/img/blush-pink.jpg";
import lavenderCutout from "./assets/img/lavender-cutout.webp";
import lavenderPhoto from "./assets/img/lavender.jpg";
import plaqueRoseCutout from "./assets/img/plaque-rose-cutout.webp";
import plaqueRosePhoto from "./assets/img/plaque-rose.jpg";
import plaqueCallaCutout from "./assets/img/plaque-calla-cutout.webp";
import plaqueCallaPhoto from "./assets/img/plaque-calla.jpg";

/* =========================================================
   MAMA BUNZ' SHOP — EDIT THIS FILE FIRST
   Everything the shop owner might change lives here.
   Lines marked TODO are placeholders to replace.
   ========================================================= */

export const SHOP = {
  name: "Mama Bunz' Shop",

  // TODO: the Facebook Page username, e.g. "mamabunzshop" → https://m.me/mamabunzshop
  messengerUsername: "",

  // TODO: real links (leave "" to hide an icon)
  facebookUrl: "",
  instagramUrl: "",

  // Shown on receipts so customers can reply. TODO: Mama Bunz' email
  shopEmail: "",

  // Band under the hero. Set to "" to hide.
  announcement: "Undas is on November 1–2. Order early so your keepsake is ready in time.",

  currency: "PHP",

  // Price of a custom keepsake (own flower colours + a name on the plaque).
  // TODO: raise this if custom pieces cost Mama Bunz more to make.
  customPrice: 160,
};

/* =========================================================
   ONLINE SERVICES
   Leave these empty and the site runs in DEMO MODE:
   - stock is tracked in each visitor's own browser
   - receipts are shown on screen instead of emailed
   Fill them in (see README) to make stock shared and emails real.
   These values are safe to keep in public code.
   ========================================================= */
export const SERVICES = {
  // From Firebase console → Project settings → Your apps → Web app config
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: "",
  },
  // From emailjs.com → Account (public key), Email Services, Email Templates
  emailjs: {
    publicKey: "",
    serviceId: "",
    templateId: "",
  },
};

/* Each product:
   - price: in pesos
   - stock: starting stock for DEMO MODE only. With Firebase on,
     the real numbers live in the Firestore "products" collection.
   - bg: the colour behind the basket
*/
export const PRODUCTS = [
  {
    id: "sunflower-glow",
    name: "Sunflower Glow",
    flowers: "Sunflowers and a golden anthurium",
    description:
      "Warm sunflowers and a golden anthurium around a flameless candle. For someone who brightened every room.",
    price: 160,
    stock: 8, // TODO
    bg: "#D9A441",
    cutout: sunflowerCutout,
    photo: sunflowerPhoto,
  },
  {
    id: "garden-white",
    name: "Garden White",
    flowers: "White daisies with green hearts and a white anthurium",
    description:
      "Soft white daisies with deep green centres and a white anthurium. Quiet, clean and peaceful.",
    price: 160,
    stock: 8, // TODO
    bg: "#9DB5A0",
    cutout: gardenwhiteCutout,
    photo: gardenwhitePhoto,
  },
  {
    id: "daisy-gold",
    name: "Daisy Gold",
    flowers: "White daisies with gold hearts and a white anthurium",
    description:
      "White daisies with sunny gold centres. A gentle, hopeful way to say they are remembered.",
    price: 160,
    stock: 8, // TODO
    bg: "#B7BE79",
    cutout: daisygoldCutout,
    photo: daisygoldPhoto,
  },
  {
    id: "blush-pink",
    name: "Blush Pink",
    flowers: "Pink daisies and a pink anthurium",
    description:
      "Tender pink blooms for a mother, a grandmother, a daughter, or anyone who loved softly.",
    price: 160,
    stock: 8, // TODO
    bg: "#DDA0A3",
    cutout: blushpinkCutout,
    photo: blushpinkPhoto,
  },
  {
    id: "lavender-peace",
    name: "Lavender Peace",
    flowers: "Lavender daisies and a lavender anthurium",
    description:
      "Calm lavender flowers that bring a sense of rest. A soothing keepsake for the home altar.",
    price: 160,
    stock: 8, // TODO
    bg: "#A9A0CC",
    cutout: lavenderCutout,
    photo: lavenderPhoto,
  },
];

/* Plaque designs for custom keepsakes.
   verse: where the printed verse sits on the cutout (fractions of its height),
   so the preview can show the customer's own words in that space instead.
   paper: the plaque's background colour around the verse. */
export const PLAQUES = [
  {
    id: "rose",
    name: "Rose",
    description: "Pink roses and white lilies",
    cutout: plaqueRoseCutout,
    photo: plaqueRosePhoto,
    verse: { top: 0.57, bottom: 0.725 },
    paper: "#F3E4DF",
  },
  {
    id: "calla",
    name: "Calla lily",
    description: "White calla lilies on warm cream",
    cutout: plaqueCallaCutout,
    photo: plaqueCallaPhoto,
    verse: { top: 0.612, bottom: 0.765 },
    paper: "#F4EADB",
  },
];

/* The custom keepsake is made to order, so it has no stock limit. */
export const CUSTOM = {
  id: "custom",
  name: "Custom keepsake",
  maxName: 32,
  maxDates: 24,
  maxMessage: 70,
};

/* TODO: check every answer with Mama Bunz before publishing. */
export const FAQS = [
  {
    q: "What is each keepsake made of?",
    a: "Every flower, leaf and basket is shaped by hand from soft chenille wire. Each basket holds a flameless LED candle and an \"In Loving Memory\" plaque.",
  },
  {
    q: "Is the candle safe to leave on?",
    a: "Yes. It is a flameless LED candle, so there is no fire or melting wax. It is safe on home altars, tables and at the cemetery.",
  },
  {
    q: "Can I put a name on the plaque?",
    a: "Yes. Order a custom keepsake, choose the flower colours and a plaque design, then type the name, dates and a short message. They are printed where the verse usually goes. Mama Bunz will confirm the details with you on Messenger before making it.",
  },
  {
    q: "What does \"left\" mean on each keepsake?",
    a: "It is how many ready-made pieces are available right now. When it reaches zero, that colour is sold out until Mama Bunz makes more. Custom keepsakes are made to order.",
  },
  {
    q: "How do I pay?",
    a: "After you place your order, you get a receipt by email. Mama Bunz will message you with payment details, and your keepsake is prepared once payment is confirmed.",
  },
  {
    q: "Do you deliver?",
    a: "Choose pickup or delivery when you order and add your address. We will arrange the details with you.",
  },
];
