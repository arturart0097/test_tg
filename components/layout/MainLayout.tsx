import Header from "./Header";
import { Outlet } from "react-router-dom";
import React from "react";
import Footer from "./Footer";

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden ">
      <div className="absolute inset-0 animated-bg" />
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-purple-900/50 via-transparent to-transparent -translate-x-1/2 blur-3xl opacity-50"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-tl from-pink-900/50 via-transparent to-transparent translate-x-1/2 blur-3xl opacity-50"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
