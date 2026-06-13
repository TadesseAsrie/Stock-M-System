
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import MobileDrawer from "./MobileDrawer";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false); // sidebar stays closed on mobile
      } else {
        setSidebarOpen(true); // sidebar open on desktop
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      {/* Main content - margin adjusts only on desktop when sidebar is open */}
      <div
        className={`transition-all duration-300 ${sidebarOpen && window.innerWidth >= 1024 ? "lg:ml-64" : "lg:ml-20"}`}
      >
        <TopNavbar
          onMenuClick={() => {
            if (window.innerWidth < 1024) {
              setMobileDrawerOpen(true);
            } else {
              setSidebarOpen(!sidebarOpen);
            }
          }}
        />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;