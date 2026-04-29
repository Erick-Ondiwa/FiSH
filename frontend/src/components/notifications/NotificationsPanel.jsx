import { X, Bell } from "lucide-react";

const NotificationsPanel = ({ notifications, onClose }) => {
  return (
    <div className="h-full bg-[#0f172a] text-slate-100 p-6 md:p-10">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell size={18} />
          Notifications
        </h2>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No notifications yet.
          </p>
        ) : (
          notifications.map((n) => (
            <NotificationCard key={n.id || Math.random()} n={n} />
          ))
        )}
      </div>
    </div>
  );
};

const NotificationCard = ({ n }) => {
  const styles = {
    feeding: "border-teal-500/30 bg-teal-500/10 text-teal-400",
    water: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    alert: "border-red-500/30 bg-red-500/10 text-red-400",
  };

  return (
    <div
      className={`p-4 rounded-xl border text-sm ${
        styles[n.type] || "border-slate-700 bg-slate-800"
      }`}
    >
      <p>{n.message}</p>
      <span className="text-xs opacity-70 mt-1 block">
        {new Date(n.created_at).toLocaleString()}
      </span>
    </div>
  );
};

export default NotificationsPanel;