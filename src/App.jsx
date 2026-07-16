import { Routes, Route } from "react-router-dom";
import MarketingPage from "./components/Marketing/MarketingPage.jsx";
import PortalPage from "./components/Portal/PortalPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketingPage />} />
      <Route path="/portal/*" element={<PortalPage />} />
    </Routes>
  );
}
