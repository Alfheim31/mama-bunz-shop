import { useCallback, useState } from "react";
import { PRODUCTS } from "./config";
import groupPhoto from "./assets/img/group.jpg";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UndasBand from "./components/UndasBand";
import Anatomy from "./components/Anatomy";
import Shop from "./components/Shop";
import CustomBuilder from "./components/CustomBuilder";
import Story from "./components/Story";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import ProductDialog from "./components/ProductDialog";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";

// photos the first screens need; the loader waits for these
const PRELOAD = [...PRODUCTS.map((p) => p.cutout), groupPhoto];

export default function App() {
  const [loading, setLoading] = useState(true);
  const done = useCallback(() => setLoading(false), []);

  return (
    <>
      {loading && <Loader images={PRELOAD} onDone={done} />}
      <a className="skip-link" href="#keepsakes">Skip to the keepsakes</a>
      <Navbar />
      <main>
        <Hero ready={!loading} />
        <UndasBand />
        <Anatomy />
        <Shop />
        <CustomBuilder />
        <Story />
        <Faq />
      </main>
      <Footer />
      <ProductDialog />
      <CartDrawer />
      <Toast />
    </>
  );
}
