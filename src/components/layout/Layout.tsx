import React from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import BetSlipPanel from "@/components/BetSlipPanel";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BetSlipPanel />
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
