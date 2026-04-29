import {
  Bell,
  History,
  Activity,
  AlertTriangle,
} from "lucide-react";

const DashboardHeader = ({
  title,
  subtitle,
  onShowNotifications,
  onShowHistory,
  onShowDiseaseLog,
  notificationCount = 0,
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 md:px-10 py-6">

      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* =========================
            LEFT: CONTEXT
        ========================= */}
        <div className="flex items-center gap-4">

          <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
            <Activity size={22} />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {title}
            </h1>

            {subtitle && (
              <p className="text-sm text-slate-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* =========================
            RIGHT: GLOBAL ACTIONS
        ========================= */}
        <div className="flex items-center gap-3">

          {/* 🔔 NOTIFICATIONS */}
          <button
            onClick={onShowNotifications}
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-sm font-medium transition"
          >
            <Bell size={16} />
            Notifications

            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {notificationCount}
              </span>
            )}
          </button>

          {/* 📜 FEEDING HISTORY */}
          <button
            onClick={onShowHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-400 text-sm font-medium transition"
          >
            <History size={16} />
            History
          </button>

          {/* 🦠 DISEASE LOG */}
          <button
            onClick={onShowDiseaseLog}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition"
          >
            <AlertTriangle size={16} />
            Disease Log
          </button>

        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;