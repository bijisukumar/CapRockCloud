import { useState } from "react";
import Hero from "./Hero.jsx";
import CapabilitiesSection from "./CapabilitiesSection.jsx";
import GatedContentModal from "./GatedContentModal.jsx";

export default function MarketingPage() {
  const [gateOpen, setGateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-950">
      <Hero onOpenGate={() => setGateOpen(true)} />
      <CapabilitiesSection />
      <GatedContentModal open={gateOpen} onClose={() => setGateOpen(false)} />
    </div>
  );
}
