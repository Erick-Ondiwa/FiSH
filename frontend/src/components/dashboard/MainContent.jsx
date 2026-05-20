import React, { useState } from "react";
import { motion } from "framer-motion";
import { MODULE_REGISTRY } from "../../modules";
import { useFeedingData } from "../../hooks/useFeedingData";

import FeedingHistory from "../feeding/FeedingHistory";
import NotificationsPanel from "../notifications/NotificationsPanel";
import DiseaseLog from "../disease/DiseaseLog";

import {
  Layout,
  Activity,
} from "lucide-react";

import DashboardHeader from "./DashboardHeader";
const MainContent = ({ activeSection }) => {
  const [view, setView] = useState("main");
  const [feedingView, setFeedingView] = useState("main");

  const moduleEntry = MODULE_REGISTRY[activeSection?.slug];
  const ModuleComponent = moduleEntry?.Component;
  const title = moduleEntry?.title || "Dashboard";
  const subtitle = moduleEntry?.subtitle || "";

    // 🔥 Notifications (from hook)
  const { notificationCount } = useFeedingData();

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
      <DashboardHeader
        title={title}
        subtitle={subtitle}
        notificationCount={notificationCount}
        onShowNotifications={() => setView("notifications")}
        onShowHistory={() => setView("history")}
        onShowDiseaseLog={() => setView("disease-log")}
      />

      {/* CONTENT */}
      <ContentWrapper>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >

          {/* 🔥 GLOBAL OVERLAYS INSIDE CONTENT */}
          {view === "notifications" && (
            <NotificationsPanel onClose={() => setView("main")} />
          )}

          {view === "history" && (
            <FeedingHistory onClose={() => setView("main")} />
          )}

          {view === "disease-log" && (
            <DiseaseLog onClose={() => setView("main")} />
          )}

          {/* 🔥 DEFAULT MODULE VIEW */}
          {view === "main" && (
            <ModuleComponent
              view={feedingView}
              setView={setFeedingView}
            />
          )}

        </motion.div>
      </ContentWrapper>

    </div>
  );
};

export default MainContent;