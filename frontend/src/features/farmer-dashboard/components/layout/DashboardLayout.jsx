import React, { useState } from "react";
import LeftSidebar from "./LeftSidebar";
import MainContent from "./MainContent";

const DashboardLayout = () => {
  // Initializing with an object to match the structure used in Sidebar/MainContent
  const [activeSection, setActiveSection] = useState({
    slug: "getting-started",
    name: "Getting Started",
    type: "guide"
  });

  return (
    <div className="flex h-screen w-full 
      bg-gradient-to-br 
      from-blue-900 
      via-blue-700 
      to-teal-600 
      relative overflow-hidden selection:bg-teal-500/30"
    >
      {/* --- ADVANCED WATER & DEPTH OVERLAY --- */}
      {/* This creates a professional "glass" feel by adding subtle light refractions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-Left Ambient Light */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[120px]" />
        
        {/* Bottom-Right Deep Teal Glow */}
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-teal-400/20 rounded-full blur-[100px]" />
        
        {/* Subtle Mesh Texture Layer */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] shadow-inner" />
      </div>

      {/* --- SIDEBAR --- */}
      {/* Sidebar is dark, so it blends beautifully with the blue-900 start of the gradient */}
      <LeftSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* --- MAIN CONTENT AREA --- */}
      {/* We use a backdrop-blur and a slight tint on the container 
          to make the white cards inside MainContent feel "docked" */}
      <main className="flex-1 relative z-10 flex flex-col min-w-0 bg-white/5 backdrop-blur-[2px]">
        <MainContent activeSection={activeSection} />
      </main>
    </div>
  );
};

export default DashboardLayout;