import React from "react";
import Header from "./Header";
import PlayerBar from "../player/PlayerBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        {children}
      </main>
      <PlayerBar />
    </div>
  );
};

export default Layout;
