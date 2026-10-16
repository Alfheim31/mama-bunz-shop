# Mama Bunz' Shop

An online shop, built with **React + Vite**, for **Mama Bunz' Shop**, which sells handcrafted memorial keepsakes: chenille flower baskets with a flameless candle and an *In Loving Memory* plaque.

Visitors choose ready-made keepsakes or design a custom one with a name on the plaque, place an order with their email, get a designed receipt, and pay Mama Bunz on Messenger.

## Features

- **Opening animation.** A flower turns and gains a petal as each product photo loads. When everything is ready, vines grow from it to the edges of the screen and the shop appears. Visitors can skip it, and it is simplified for people who prefer reduced motion.
- **Garden design.** A vine-wrapped garden arch in the hero, hedges between sections, and leaf-green, sunlight and petal colours.
- **Header that stays visible** with the name, section links and basket while scrolling.
- **Live stock.** Each keepsake shows how many are left ("8 left", "Only 2 left", "Sold out"). Placing an order lowers stock for everyone, and you can't add more to the basket than is available.
- **Custom keepsakes.** Pick flower colours and a plaque design (Rose or Calla lily), then type the name, dates and message. The preview shows the real plaque with their words where the printed verse usually goes.
- **Checkout with email receipt.** The order is saved, stock is lowered, and a receipt in the site's garden style is emailed to the customer. The customer then messages Mama Bunz to pay.
- **Accessible:** keyboard navigation, visible focus, labelled form errors, reduced-motion support.

## Run it locally

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

## Demo mode vs. live mode

Out of the box the site runs in **demo mode**, so it works as a portfolio piece with no setup:

| | Demo mode | Live mode |
|---|---|---|
| Stock | Saved in each visitor's own browser | Shared by everyone (Firebase) |
| Orders | Saved in the browser | Saved in Firebase for Mama Bunz to see |
| Receipt | Shown on screen, can be printed | Emailed to the customer (EmailJS) and shown on screen |

In demo mode the footer has a "refill stock" link.

## Going live

### 1. Firebase: shared stock and orders (free)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project. Google Analytics isn't needed.
2. **Build → Firestore Database → Create database**, choose a location near the Philippines (e.g. `asia-southeast1`), and start in **production mode**.
3. Open the **Rules** tab, paste in everything from `firestore.rules`, and click **Publish**.
4. In **Data**, create a collection called `products`. Add one document per keepsake, using the product id as the **Document ID** and a field `stock` (type *number*):

   | Document ID | stock |
   |---|---|
   | `sunflower-glow` | 8 |
   | `garden-white` | 8 |
   | `daisy-gold` | 8 |
   | `blush-pink` | 8 |
   | `lavender-peace` | 8 |

5. **Project settings (gear icon) → Your apps → Web (`</>`)**, register the app, and copy `apiKey`, `authDomain`, `projectId` and `appId` into `SERVICES.firebase` in `src/config.js`.

To restock, Mama Bunz changes the `stock` numbers in the Firebase console. New orders appear in the `orders` collection, with status `awaiting-payment`.

### 2. EmailJS: receipt emails (free up to 200 a month)

1. Sign up at [emailjs.com](https://www.emailjs.com).
2. **Email Services → Add New Service** and connect the shop's Gmail. Copy the **Service ID**.
3. **Email Templates → Create New Template** and set:
   - **To Email:** `{{to_email}}`
   - **Subject:** `Your Mama Bunz' receipt · {{order_number}}`
   - **Content:** switch the editor to code view and put only `{{{receipt_html}}}` (three braces, so the HTML isn't escaped)
   - Optional: add the shop's email under **BCC** so Mama Bunz gets a copy of every order.

   Copy the **Template ID**.
4. **Account → General** and copy the **Public Key**.
5. Put the three values in `SERVICES.emailjs` in `src/config.js`.

The Firebase web config and the EmailJS public key are designed to be public, so they are safe to commit. The Firestore rules are what protect the data.

**Note on security:** the rules let the website lower stock and create orders, but never read orders or raise stock. That's fine for a small shop. If the shop grows, moving order placement into a Firebase Cloud Function would stop anyone from lowering stock without ordering.

## Make it the real shop

Everything the owner might change is in **`src/config.js`**:

| Setting | What to put |
|---|---|
| `price` on each product | Currently ₱160 |
| `customPrice` | Price of a custom keepsake, currently ₱160 |
| `PLAQUES` | Plaque designs for custom keepsakes. To add one, drop a photo and its cutout in `src/assets/img/` and set where its verse sits |
| `stock` on each product | Starting stock in demo mode |
| `messengerUsername`, `facebookUrl`, `instagramUrl` | The shop's links |
| `shopEmail` | Shown on receipts so customers can reply |
| `FAQS`, `announcement` | Wording on the page |

The story in `src/components/Story.jsx` is marked `TODO`, so replace it with Mama Bunz' own words.

## Publish on GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes the site every time you push to `main`. On GitHub, set **Settings → Pages → Source** to **GitHub Actions** once.

## Project structure

```
index.html                    HTML shell (fonts, meta tags)
firestore.rules               database security rules for Firebase
src/
  config.js                   shop settings, products, services  ← edit this
  App.jsx                     page layout + opening animation
  styles.css                  all styling (colours and fonts at the top)
  utils.js                    money, storage, stock labels, clipboard
  context/ShopContext.jsx     basket, stock, dialogs, messages
  services/
    backend.js                stock + orders (Firebase or demo mode)
    email.js                  receipt emails (EmailJS)
    receipt.js                the receipt's HTML design
  components/
    Loader.jsx                flower + vines opening screen
    Garden.jsx                leaves, blossoms, arch vine, hedges
    Navbar.jsx, Hero.jsx, UndasBand.jsx, Anatomy.jsx
    Shop.jsx, ProductCard.jsx, ProductDialog.jsx
    CustomBuilder.jsx         custom keepsake with plaque preview
    Story.jsx, Faq.jsx, Footer.jsx
    CartDrawer.jsx            basket, checkout, order confirmation
    ReceiptDialog.jsx         on-screen receipt with print
    QtyStepper.jsx, Toast.jsx, Icons.jsx
  assets/img/                 product photos + cutouts
```

## Credits

Product photos © Mama Bunz' Shop. Built by [Amiere](https://github.com/Alfheim31).
