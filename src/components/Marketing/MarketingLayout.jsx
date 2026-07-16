import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { GateProvider } from "./GateContext.jsx";

export default function MarketingLayout() {
  return (
    <GateProvider>
      <div className="flex min-h-screen flex-col bg-base-950">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </GateProvider>
  );
}
