import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Utensils,
  Loader2,
  Lock,
  Clock,
} from "lucide-react";

const SessionCard = ({ session, onConfirm, loading }) => {
  if (!session) return null;

  const isDone = session.status === "completed";
  const isMissed = session.status === "missed";
  const isCurrent = session.is_current;
  const isUpcoming = session.is_upcoming;
  const canConfirm = session.can_confirm;
  const hasFeeds = session.feeds && session.feeds.length > 0;

  const [timeLeft, setTimeLeft] = useState(null);
  const [startsIn, setStartsIn] = useState(null);

  useEffect(() => {
    const start = new Date(session.time).getTime();
    const end = start + 60 * 60 * 1000;

    const updateTimer = () => {
      const now = Date.now();

      if (isCurrent) {
        const diff = end - now;
        if (diff <= 0) return setTimeLeft("00:00:00");

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        setTimeLeft(
          `${String(h).padStart(2, "0")}:${String(m).padStart(
            2,
            "0"
          )}:${String(s).padStart(2, "0")}`
        );
      }

      if (isUpcoming) {
        const diff = start - now;
        if (diff <= 0) return setStartsIn("Starting...");

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        setStartsIn(
          `${String(h).padStart(2, "0")}:${String(m).padStart(
            2,
            "0"
          )}:${String(s).padStart(2, "0")}`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isCurrent, isUpcoming, session.time]);

  const handleClick = () => {
    if (!canConfirm || loading) return;
    onConfirm(session.id);
  };

  // -----------------------------
  // DYNAMIC STYLES
  // -----------------------------
  const cardStyle = `
    relative rounded-2xl p-5 backdrop-blur-md border transition-all duration-300
    bg-gradient-to-br from-slate-800/80 to-slate-900/90
    hover:scale-[1.02] hover:shadow-xl
  `;

  const stateStyle = isCurrent
    ? "border-teal-500/60 shadow-teal-500/20 shadow-lg"
    : isDone
    ? "border-green-500/30 opacity-80"
    : isMissed
    ? "border-red-500/40"
    : isUpcoming
    ? "border-slate-700 opacity-60"
    : "border-slate-700";

  return (
    <div className={`${cardStyle} ${stateStyle}`}>

      {/* GLOW */}
      {isCurrent && (
        <div className="absolute inset-0 rounded-2xl bg-teal-500/5 blur-xl opacity-60" />
      )}

      {/* CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col h-full justify-between">

        {/* =========================
            TOP SECTION
        ========================= */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-white font-semibold text-base">
              Session {session.session}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Feeding session
            </p>
          </div>

          {/* STATUS ICON */}
          <div className="shrink-0">
            {isDone ? (
              <CheckCircle2 className="text-green-400" size={20} />
            ) : isMissed ? (
              <Circle className="text-red-400" size={20} />
            ) : isUpcoming && !hasFeeds ? (
              <Lock className="text-slate-500" size={18} />
            ) : (
              <Circle className="text-slate-500" size={20} />
            )}
          </div>
        </div>

        {/* =========================
            MIDDLE SECTION
        ========================= */}
        <div className="mt-4 space-y-4">

          {/* TIME */}
          {/* TIME + STATE */}
          <div className="flex items-center justify-between text-xs text-slate-400">

            {/* LEFT: TIME */}
            <div className="flex items-center gap-2">
              <Clock size={13} />
              {session.time}
            </div>

            {/* RIGHT: STATE + TIMER */}
            <div className="flex items-center gap-2">

              {/* 🔥 STATE LABEL */}
              {isCurrent && (
                <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-[10px] font-semibold">
                  Current
                </span>
              )}

              {isUpcoming && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold">
                  Upcoming
                </span>
              )}

              {/* ⏳ COUNTDOWN */}
              {isCurrent && timeLeft && (
                <span className="text-teal-400 font-medium">
                  ⏳ {timeLeft}
                </span>
              )}

              {/* 🚀 START TIMER */}
              {isUpcoming && startsIn && (
                <span className="text-blue-400 font-medium">
                  🚀 {startsIn}
                </span>
              )}
            </div>
          </div>
          {/* FEEDS */}
          {hasFeeds && (
            <div className="flex flex-wrap gap-2">
              {session.feeds.map((feed, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium
                  bg-teal-500/10 text-teal-400 border border-teal-500/20"
                >
                  {feed}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* =========================
            BOTTOM SECTION
        ========================= */}
        <div className="mt-5">

          {isCurrent && !isDone && !isMissed && (
            <button
              onClick={handleClick}
              disabled={!canConfirm || loading}
              className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition
              ${
                !canConfirm
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : loading
                  ? "bg-slate-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Utensils size={14} />
                  Confirm Feeding
                </>
              )}
            </button>
          )}

          {isDone && (
            <p className="text-xs text-green-400">
              ✔ Feeding completed
            </p>
          )}

          {isMissed && (
            <p className="text-xs text-red-400">
              ⚠ Session missed
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;