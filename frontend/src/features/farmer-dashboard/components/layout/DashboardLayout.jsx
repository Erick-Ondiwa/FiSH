import React, { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";

const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState("GettingStarted");

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-teal-50 to-cyan-100">
      {/* Left Sidebar */}
      <LeftSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <MainContent activeSection={activeSection} />
      </main>
    </div>
  );
};

export default DashboardLayout;
