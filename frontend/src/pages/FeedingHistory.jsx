import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../api";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Calendar,
} from "lucide-react";

const FeedingHistory = ({ onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState(null);

  const token = localStorage.getItem("access_token");

  // -----------------------------
  // FETCH HISTORY
  // -----------------------------
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/feeding/history/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(res.data);
      } catch (err) {
        console.error("History fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  // -----------------------------
  // HELPERS
  // -----------------------------
  const toggleDay = (day) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  };

  const getStatusIcon = (status) => {
    if (status === "completed") {
      return <CheckCircle2 className="text-green-400" size={18} />;
    }
    if (status === "missed") {
      return <Circle className="text-red-400" size={18} />;
    }
    return <Circle className="text-slate-500" size={18} />;
  };

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading feeding history...
      </div>
    );
  }

  // -----------------------------
  // EMPTY STATE
  // -----------------------------
  if (!data || !data.days.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-400">
        <p>No feeding history available.</p>
        <button
          onClick={onClose}
          className="mt-4 text-teal-400 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 px-4 md:px-8 py-8">

      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <h1 className="text-xl font-semibold">
            Feeding History
          </h1>
        </div>

        {/* -----------------------------
            OVERALL SUMMARY
        ----------------------------- */}
        <div className="grid md:grid-cols-3 gap-4">

          <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl">
            <p className="text-sm text-slate-400">Total Sessions</p>
            <h3 className="text-2xl font-bold mt-1">
              {data.overall.total_sessions}
            </h3>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl">
            <p className="text-sm text-slate-400">Completed</p>
            <h3 className="text-2xl font-bold mt-1 text-green-400">
              {data.overall.completed_sessions}
            </h3>
          </div>

          <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl">
            <p className="text-sm text-slate-400">Completion Rate</p>
            <h3 className="text-2xl font-bold mt-1 text-teal-400">
              {data.overall.completion_rate}%
            </h3>
          </div>
        </div>

        {/* -----------------------------
            DAYS TIMELINE
        ----------------------------- */}
        <div className="space-y-4">

          {data.days.map((day) => {
            const isOpen = expandedDay === day.day;

            return (
              <div
                key={day.day}
                className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden"
              >
                {/* DAY HEADER */}
                <div
                  onClick={() => toggleDay(day.day)}
                  className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-700/40 transition"
                >
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-slate-400" />

                    <div>
                      <p className="font-medium">
                        Day {day.day}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(day.date).toDateString()}
                      </p>
                    </div>
                  </div>

                  {/* SUMMARY */}
                  <div className="text-sm text-slate-400 flex items-center gap-4">
                    <span className="text-green-400">
                      ✔ {day.summary.completed}
                    </span>
                    <span className="text-red-400">
                      ✖ {day.summary.missed}
                    </span>
                    <span className="text-teal-400">
                      {day.summary.completion_rate}%
                    </span>
                  </div>
                </div>

                {/* EXPANDED SESSIONS */}
                {isOpen && (
                  <div className="px-5 pb-5 space-y-3 border-t border-slate-700">

                    {day.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between bg-slate-900/60 border border-slate-700 p-4 rounded-xl"
                      >
                        {/* LEFT */}
                        <div className="flex items-center gap-3">
                          {getStatusIcon(session.status)}

                          <div>
                            <p className="text-sm font-medium">
                              Session {session.session}
                            </p>
                            <p className="text-xs text-slate-400">
                              {session.time}
                            </p>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="text-right">
                          <p
                            className={`text-xs font-medium capitalize ${
                              session.status === "completed"
                                ? "text-green-400"
                                : session.status === "missed"
                                ? "text-red-400"
                                : "text-slate-400"
                            }`}
                          >
                            {session.status}
                          </p>

                          {/* FEEDS */}
                          {session.feeds?.length > 0 && (
                            <div className="mt-1 flex flex-wrap justify-end gap-1">
                              {session.feeds.map((feed, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 text-[10px] rounded bg-teal-500/10 text-teal-400 border border-teal-500/20"
                                >
                                  {feed}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeedingHistory;