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
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      <div
        className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}
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
