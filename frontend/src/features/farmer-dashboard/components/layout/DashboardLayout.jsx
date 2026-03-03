import React, { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";

const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
      <LeftSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <MainContent activeSection={activeSection} />
      
    </div>
  );
};

export default DashboardLayout;