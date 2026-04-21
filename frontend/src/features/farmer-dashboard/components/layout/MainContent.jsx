import React, { useState } from "react";
import { motion } from "framer-motion";
import { MODULE_REGISTRY } from "../../modules";
import {
  Layout,
  Activity,
} from "lucide-react";

const MainContent = ({ activeSection }) => {
  const [feedingView, setFeedingView] = useState("main");

  const moduleEntry = MODULE_REGISTRY[activeSection?.slug];
  const ModuleComponent = moduleEntry?.Component;
  const ModuleHeader = moduleEntry?.Header;

  // 🔹 CONTENT WRAPPER
  const ContentWrapper = ({ children }) => (
    <div className="flex-1 overflow-y-auto bg-[#0f172a]">
      <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
    </div>
  );

  // ===========================
  // EMPTY STATE
  // ===========================
  if (!activeSection) {
    return (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Layout size={40} className="text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white">
            Advisory Dashboard
          </h3>
          <p className="text-slate-400 mt-2 max-w-sm">
            Select a module from the sidebar.
          </p>
        </div>
      </ContentWrapper>
    );
  }

  // ===========================
  // MODULE NOT FOUND (SAFEGUARD)
  // ===========================
  if (!ModuleComponent) {
    return (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Activity size={40} className="text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white">
            Module Not Available
          </h3>
          <p className="text-slate-400 mt-2 max-w-sm">
            This section is not yet implemented in the system.
          </p>
        </div>
      </ContentWrapper>
    );
  }

  // ===========================
  // MODULE VIEW (PRIMARY FLOW)
  // ===========================
  return (
    <div className="flex flex-col h-full">
      
      {/* HEADER */}
      {ModuleHeader && (
        <ModuleHeader
          onShowNotifications={() => setFeedingView("notifications")}
          onShowHistory={() => setFeedingView("history")}
        />
      )}

      {/* CONTENT */}
      <ContentWrapper>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <ModuleComponent
            view={feedingView}
            setView={setFeedingView}
          />
        </motion.div>
      </ContentWrapper>

    </div>
  );
};

export default MainContent;