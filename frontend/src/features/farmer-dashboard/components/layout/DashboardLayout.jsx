import React, { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";

const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState({
    slug: "getting-started",
    name: "Getting Started",
    type: "guide",
  });

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-100">
      {/* Sidebar */}
      <LeftSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <MainContent activeSection={activeSection} />
      </main>
    </div>
  );
};

export default DashboardLayout;