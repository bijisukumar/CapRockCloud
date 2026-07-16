import { useState } from "react";
import Header from "./Header.jsx";
import Hero from "./Hero.jsx";
import CapabilitiesSection from "./CapabilitiesSection.jsx";
import Footer from "./Footer.jsx";
import GatedContentModal from "./GatedContentModal.jsx";

export default function MarketingPage() {
  const [gateOpen, setGateOpen] = useState(false);
  const openGate = () => setGateOpen(true);

  return (
    <div className="flex min-h-screen flex-col bg-base-950">
      <Header onOpenGate={openGate} />
      <main className="flex-1">
        <Hero onOpenGate={openGate} />
        <CapabilitiesSection />
      </main>
      <Footer />
      <GatedContentModal open={gateOpen} onClose={() => setGateOpen(false)} />
    </div>
  );
}
