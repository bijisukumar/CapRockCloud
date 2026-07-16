import { Routes, Route } from "react-router-dom";
import MarketingLayout from "./components/Marketing/MarketingLayout.jsx";
import MarketingPage from "./components/Marketing/MarketingPage.jsx";
import AboutPage from "./components/Marketing/AboutPage.jsx";
import PricingPage from "./components/Marketing/PricingPage.jsx";
import ContactPage from "./components/Marketing/ContactPage.jsx";
import PortalPage from "./components/Portal/PortalPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="/portal/*" element={<PortalPage />} />
    </Routes>
  );
}
