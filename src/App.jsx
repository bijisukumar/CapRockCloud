import { Routes, Route } from "react-router-dom";
import MarketingLayout from "./components/Marketing/MarketingLayout.jsx";
import MarketingPage from "./components/Marketing/MarketingPage.jsx";
import AboutPage from "./components/Marketing/AboutPage.jsx";
import PricingPage from "./components/Marketing/PricingPage.jsx";
import ContactPage from "./components/Marketing/ContactPage.jsx";
import BlogIndexPage from "./components/Marketing/BlogIndexPage.jsx";
import BlogPostPage from "./components/Marketing/BlogPostPage.jsx";
import ResourceLandingPage from "./components/Marketing/ResourceLandingPage.jsx";
import PortalLanding from "./components/Portal/PortalLanding.jsx";
import PortalPage from "./components/Portal/PortalPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/resources/:slug" element={<ResourceLandingPage />} />
        <Route path="/r/:slug" element={<ResourceLandingPage />} />
      </Route>
      <Route path="/portal" element={<PortalLanding />} />
      <Route path="/portal/dashboard/*" element={<PortalPage />} />
    </Routes>
  );
}
