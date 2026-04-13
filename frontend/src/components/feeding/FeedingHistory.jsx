import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../api";

const FeedingHistory = ({ token, onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/feeding/history/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to load history");
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow border space-y-4">
      <div className="flex justify-between">
        <h3 className="font-bold">Feeding History</h3>
        <button onClick={onClose} className="text-sm text-gray-500">
          Close
        </button>
      </div>

      {history.length === 0 ? (
        <p className="text-gray-500 text-sm">No history available</p>
      ) : (
        <div className="space-y-3">
          {history.map((item, i) => (
            <div key={i} className="border p-3 rounded">
              <p className="text-sm">
                Day {item.day} - Session {item.session}
              </p>
              <p className="text-xs text-gray-500">
                Feeds: {item.feeds.join(", ")}
              </p>
              <p className="text-xs text-gray-400">{item.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedingHistory;