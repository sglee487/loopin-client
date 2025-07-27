import React, { useState } from "react";
import Header from "./Header";
import LastSessionLoader from "../player/LastSessionLoader";
import PlayerBar from "../player/PlayerBar";
import { NavLink } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";
import { ToastContainer } from "react-toastify";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const sidebarClasses = [
    "bg-white border-r border-gray-200 h-full transition-all duration-200 ease-in-out flex-shrink-0",
    isSidebarCollapsed ? "w-20" : "w-48",
  ].join(" ");

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Auto-load latest session (invisible helper) */}
      <LastSessionLoader />
      <Header onToggleSidebar={handleToggleSidebar} />

      {/* Body area: sidebar + main content */}
      <div className="flex flex-1 overflow-hidden">
        <aside className={sidebarClasses}>
          <nav className="mt-6 flex flex-col gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                [
                  "flex mx-2 p-2 rounded text-gray-700 hover:bg-gray-100",
                  isSidebarCollapsed
                    ? "flex-col items-center gap-1"
                    : "items-center gap-3",
                  isActive && "bg-brand/10 text-brand font-semibold",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <HomeIcon className="h-6 w-6 flex-shrink-0" />
              <span
                className={
                  isSidebarCollapsed
                    ? "text-[10px] leading-tight text-center w-full"
                    : "text-sm"
                }
              >
                홈
              </span>
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
          {children}
        </main>
      </div>

      <PlayerBar />
      {/* Global toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
};

export default Layout;
