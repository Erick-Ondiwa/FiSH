import React, { useState } from "react";
import LeftSidebar from "../components/dashboard/LeftSidebar";
import MainContent from "../components/dashboard/MainContent";

const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState({
    slug: "farm-conditions",
    // name: "Getting Started",
    // type: "guide",
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