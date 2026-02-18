import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../../../../../api";

const MainContent = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(`${API_URL}/guidence/tasks/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTasks(res.data);
        console.log("Tasks from API:", res.data);
      } catch (err) {
        console.log("Failed to load tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Onboarding Guide</h1>
      <p className="text-gray-600 mb-6">
        Follow the steps below to get started with your fish farming journey.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              {task.icon && <span className="text-3xl">{task.icon}</span>}
              <h2 className="text-lg font-bold">{task.title}</h2>
            </div>

            <p className="text-gray-600 mb-3">{task.short_description}</p>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${(task.completed_steps / task.total_steps) * 100}%`,
                }}
              ></div>
            </div>

            <p className="text-sm text-gray-700 mb-4">
              {task.completed_steps} / {task.total_steps} steps completed
            </p>

            <Link
              to={`/guidence/tasks/${task.id}`}
              className="inline-block bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
            >
              View Steps
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;
