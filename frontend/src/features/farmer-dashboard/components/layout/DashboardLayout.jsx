import React, { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";

const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  return (
    <div className="flex h-screen 
      bg-gradient-to-br 
      from-cyan-200 
      via-blue-200 
      to-teal-300 
      relative overflow-hidden"
    >

      {/* Soft Water Overlay Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.3),transparent_40%)] pointer-events-none"></div>

      {/* Sidebar */}
      <LeftSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        <MainContent activeSection={activeSection} />
      </div>
    </div>
  );
};

export default DashboardLayout;