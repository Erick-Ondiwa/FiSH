import React, { useMemo } from "react";
import { useFeedingData } from "../components/hooks/useFeedingData";
import { Clock, AlertCircle } from "lucide-react";

// Components
import NotificationsPanel from "./NotificationsPanel";
import FeedingHistory from "./FeedingHistory";
import SessionCard from "../components/feeding/SessionCard";
import FeedingForm from "../components/feeding/FeedingForm";

const FeedingPage = ({ view, setView }) => {
  const {
    status,
    notifications,
    error,
    loadingStatus,
    loadingAction,
    startData,
    setStartData,
    handleStart,
    handleConfirmSession,
  } = useFeedingData();

  // -----------------------------------
  // SAFE DATA ACCESS
  // -----------------------------------
  const data = status?.data || null;
  // console.log(data)
  const hasActivePlan = !!data;

  // -----------------------------------
  // ONLY CURRENT + UPCOMING
  // -----------------------------------
  const displaySessions = useMemo(() => {
    if (!data?.sessions) return [];

    const current = data.sessions.find((s) => s.is_current);
    const upcoming = data.sessions.find((s) => s.is_upcoming);

    return [current, upcoming].filter(Boolean);
  }, [data]);

  // -----------------------------------
  // VIEW SWITCHING (CONTROLLED BY HEADER)
  // -----------------------------------
  if (view === "notifications") {
    return (
      <NotificationsPanel
        notifications={notifications}
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

  // -----------------------------------
  // MAIN UI
  // -----------------------------------
  return (
    <div className="min-h-full bg-[#0f172a] text-slate-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10">

        {/* -----------------------------------
            HERO
        ----------------------------------- */}
        {hasActivePlan && (
          <div className="space-y-3">
            <h1 className="text-2xl md:text-3xl font-semibold leading-tight">
              Feeding Plan in Progress — Day {data.day}
            </h1>

            <p className="text-slate-400 max-w-2xl">
              Follow the recommended feeding plan to ensure optimal fish growth and health.
            </p>
          </div>
        )}

        {/* -----------------------------------
            PROGRESS
        ----------------------------------- */}
        {hasActivePlan && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Progress</span>
              <span>{data.progress}%</span>
            </div>

            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 transition-all duration-500"
                style={{ width: `${data.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* -----------------------------------
            LOADING
        ----------------------------------- */}
        {loadingStatus && (
          <div className="text-sm text-slate-400">
            Loading feeding data...
          </div>
        )}

        {/* -----------------------------------
            NO PLAN
        ----------------------------------- */}
        {!loadingStatus && !hasActivePlan && (
          <FeedingForm
            data={startData}
            setData={setStartData}
            onStart={handleStart}
            loading={loadingAction}
          />
        )}

        {/* -----------------------------------
            SESSIONS
        ----------------------------------- */}
        {!loadingStatus && hasActivePlan && (
          <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center gap-2 text-slate-300">
              <Clock size={18} />
              <h3 className="text-lg font-medium">
                Current & Upcoming Sessions
              </h3>
            </div>

            {/* GRID */}
            {displaySessions.length === 0 ? (
              <div className="text-sm text-slate-400">
                No active sessions right now.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {displaySessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onConfirm={handleConfirmSession}
                    loading={loadingAction}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* -----------------------------------
            ERROR
        ----------------------------------- */}
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
