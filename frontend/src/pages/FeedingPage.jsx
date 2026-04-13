import React, { useState, useMemo } from "react";
import { useFeedingData } from "../components/hooks/useFeedingData";
import { Clock, AlertCircle } from "lucide-react";

// Components
import NotificationsPanel from "../components/feeding/NotificationsPanel";
import FeedingHistory from "../components/feeding/FeedingHistory";
import SessionCard from "../components/feeding/SessionCard";
import FeedingForm from "../components/feeding/FeedingForm";

const FeedingPage = () => {
  const [view, setView] = useState("main");

  const {
    status,
    alerts,
    error,
    loadingStatus,
    loadingAction,
    startData,
    setStartData,
    handleStart,
    handleConfirmSession,
  } = useFeedingData();

  const hasActivePlan = !!status;
  const displaySessions = useMemo(() => {
    const sessions = status?.data?.sessions || [];

    const current = sessions.find((s) => s.is_current);
    const upcoming = sessions.find((s) => s.is_upcoming);

    const result = [];

    if (current) result.push(current);
    if (upcoming) result.push(upcoming);

    return result;
  }, [status]);

  // -------------------------
  // VIEW SWITCHING
  // -------------------------
  if (view === "notifications") {
    return (
      <NotificationsPanel
        alerts={alerts}
        onClose={() => setView("main")}
      />
    );
  }

  if (view === "history") {
    return (
      <FeedingHistory
        onClose={() => setView("main")}
      />
    );
  }

  // -------------------------
  // MAIN UI
  // -------------------------
  return (
    <div className="min-h-full bg-[#0f172a] text-slate-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10">

        {/* -------------------------
            HERO STATEMENT
        ------------------------- */}
        {hasActivePlan && (
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
              Feeding Plan in Progress — Day {status.data.day}
            </h1>

            <p className="text-slate-400 max-w-2xl">
              Kindly Follow the System's recommended Feeding Plan. Your Fish will grow faster and healthy
            </p>
          </div>
        )}

        {/* -------------------------
            PROGRESS BAR (CLEAN)
        ------------------------- */}
        {hasActivePlan && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Progress</span>
              <span>Day {status.data.day}</span>
            </div>

            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${Math.min((status.data.day / 30) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* -------------------------
            LOADING
        ------------------------- */}
        {loadingStatus && (
          <div className="text-sm text-slate-400">
            Loading feeding data...
          </div>
        )}

        {/* -------------------------
            NO PLAN
        ------------------------- */}
        {!loadingStatus && !hasActivePlan && (
          <FeedingForm
            data={startData}
            setData={setStartData}
            onStart={handleStart}
            loading={loadingAction}
          />
        )}

        {/* -------------------------
            SESSIONS (MAIN FOCUS)
        ------------------------- */}
        {!loadingStatus && hasActivePlan && (
          <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center gap-2 text-slate-300">
              <Clock size={18} />
              <h3 className="text-lg font-medium">
                Today’s Feeding Sessions
              </h3>
            </div>

            {/* SESSIONS GRID */}
            {displaySessions.length === 0 ? (
              <div className="text-sm text-slate-400">
                No sessions available.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {displaySessions.map((session) => (
                  <SessionCard
                    key={session.id}   // ✅ FIXED
                    session={session}
                    onConfirm={handleConfirmSession}
                    loading={loadingAction}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------------
            ERROR
        ------------------------- */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
            <AlertCircle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedingPage;


