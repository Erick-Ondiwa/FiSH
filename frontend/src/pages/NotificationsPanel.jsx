import { Bell, ArrowLeft, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

const NotificationsPanel = ({ alerts = [], onClose }) => {
  
  // -----------------------------
  // STYLE MAPPER
  // -----------------------------
  const getStyle = (type) => {
    switch (type) {
      case "missed":
        return {
          icon: <AlertTriangle size={18} />,
          color: "text-red-400",
          bg: "bg-red-500/10 border-red-500/20",
          label: "Missed",
        };
      case "current":
        return {
          icon: <Bell size={18} />,
          color: "text-teal-400",
          bg: "bg-teal-500/10 border-teal-500/20",
          label: "Now",
        };
      case "upcoming":
        return {
          icon: <Clock size={18} />,
          color: "text-yellow-400",
          bg: "bg-yellow-500/10 border-yellow-500/20",
          label: "Upcoming",
        };
      case "completed":
        return {
          icon: <CheckCircle2 size={18} />,
          color: "text-green-400",
          bg: "bg-green-500/10 border-green-500/20",
          label: "Completed",
        };
      default:
        return {
          icon: <Bell size={18} />,
          color: "text-slate-400",
          bg: "bg-slate-700 border-slate-600",
          label: "Info",
        };
    }
  };

  return (
    <div className="min-h-full bg-[#0f172a] text-slate-100">

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* -----------------------------
            HEADER
        ----------------------------- */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
              <Bell size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold">
                Notifications
              </h1>
              <p className="text-sm text-slate-400">
                Stay updated with feeding activities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-sm text-slate-300 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* -----------------------------
            SUMMARY BAR
        ----------------------------- */}
        <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-400">
          <span>Total Alerts</span>
          <span className="font-semibold text-white">
            {alerts.length}
          </span>
        </div>

        {/* -----------------------------
            EMPTY STATE
        ----------------------------- */}
        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-slate-500">
            <Bell size={40} className="mb-4 opacity-40" />
            <p className="text-lg">No notifications</p>
            <p className="text-sm mt-1">
              You're all caught up 🎉
            </p>
          </div>
        )}

        {/* -----------------------------
            NOTIFICATION LIST
        ----------------------------- */}
        <div className="space-y-4">

          {alerts.map((alert, index) => {
            const style = getStyle(alert.type);

            return (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-xl border backdrop-blur-md transition hover:scale-[1.01] ${style.bg}`}
              >
                {/* ICON */}
                <div className={`mt-1 ${style.color}`}>
                  {style.icon}
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">

                    <p className="text-sm font-medium text-white">
                      {alert.message}
                    </p>

                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${style.color} bg-black/20`}>
                      {style.label}
                    </span>
                  </div>

                  {/* OPTIONAL TIME (future-ready) */}
                  {alert.time && (
                    <p className="text-xs text-slate-500 mt-1">
                      {alert.time}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* -----------------------------
            FOOTER ACTIONS (OPTIONAL)
        ----------------------------- */}
        {alerts.length > 0 && (
          <div className="flex justify-end pt-4">
            <button className="text-xs text-slate-400 hover:text-white transition">
              Clear notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;