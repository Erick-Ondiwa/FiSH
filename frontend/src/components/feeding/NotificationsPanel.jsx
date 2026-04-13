import { AlertTriangle } from "lucide-react";

const NotificationsPanel = ({ alerts, onClose }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <AlertTriangle /> Notifications
        </h3>
        <button onClick={onClose} className="text-sm text-gray-500">
          Close
        </button>
      </div>

      {alerts.length === 0 ? (
        <p className="text-gray-500 text-sm">No alerts</p>
      ) : (
        <ul className="space-y-2">
          {alerts.map((alert, i) => (
            <li key={i} className="text-sm bg-yellow-50 p-2 rounded">
              ⚠ {alert.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPanel;