import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../api";

import {
  X,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock3,
} from "lucide-react";

const NotificationsPanel = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------------
  // FETCH NOTIFICATIONS
  // -----------------------------------
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(
          `${API_URL}/notifications/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // -----------------------------------
  // LOADING
  // -----------------------------------
  if (loading) {
    return (
      <div className="h-full bg-[#0f172a] text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">
          Loading notifications...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0f172a] text-slate-100 p-6 md:p-10 overflow-y-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-3">
            <Bell size={22} className="text-teal-400" />
            Notifications
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Feeding alerts and farm activity updates
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center"
        >
          <X size={18} />
        </button>
      </div>

      {/* EMPTY STATE */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Bell size={40} className="text-slate-600 mb-4" />

          <h3 className="text-lg font-medium text-white">
            No Notifications
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            You currently have no alerts or updates.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ===================================
// NOTIFICATION CARD
// ===================================
const NotificationCard = ({ notification }) => {

  // -----------------------------------
  // TYPE CONFIG
  // -----------------------------------
  const typeConfig = {
    feeding_completed: {
      icon: <CheckCircle2 size={18} />,
      style:
        "border-green-500/20 bg-green-500/10 text-green-400",
      label: "Feeding Completed",
    },

    feeding_missed: {
      icon: <AlertTriangle size={18} />,
      style:
        "border-red-500/20 bg-red-500/10 text-red-400",
      label: "Missed Feeding",
    },

    water_quality_reminder: {
      icon: <Clock3 size={18} />,
      style:
        "border-blue-500/20 bg-blue-500/10 text-blue-400",
      label: "Water Quality Reminder",
    },
  };

  const config =
    typeConfig[notification.type] || {
      icon: <Bell size={18} />,
      style:
        "border-slate-700 bg-slate-800 text-slate-300",
      label: "Notification",
    };

  return (
    <div
      className={`
        rounded-2xl border p-5 transition-all
        ${config.style}
      `}
    >
      <div className="flex items-start gap-4">

        {/* ICON */}
        <div className="mt-0.5">
          {config.icon}
        </div>

        {/* CONTENT */}
        <div className="flex-1">

          {/* TOP */}
          <div className="flex items-center justify-between gap-4">
            <h4 className="text-sm font-semibold">
              {config.label}
            </h4>

            {!notification.is_read && (
              <span className="px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-white/10">
                New
              </span>
            )}
          </div>

          {/* MESSAGE */}
          <p className="text-sm mt-2 leading-relaxed text-slate-200">
            {notification.message}
          </p>

          {/* DATE */}
          <p className="text-xs text-slate-400 mt-3">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;