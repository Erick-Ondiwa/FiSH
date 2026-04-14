import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../api";

export const useFeedingData = () => {
  // -----------------------------
  // STATE
  // -----------------------------
  const [status, setStatus] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const [error, setError] = useState(null);

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const [startData, setStartData] = useState({
    species: "tilapia",
    age_group: "fingerlings",
  });

  const abortRef = useRef(null);
  const pollingRef = useRef(null);

  // -----------------------------
  // AXIOS INSTANCE (STABLE)
  // -----------------------------
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
    });

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, []);

  // -----------------------------
  // ERROR HANDLER
  // -----------------------------
  const handleError = useCallback((err, fallbackMessage) => {
    if (err.name === "CanceledError") return;

    if (err.response) {
      // Server responded
      const message =
        err.response.data?.error ||
        err.response.data?.detail ||
        fallbackMessage;
      setError(message);
    } else {
      // Network / unknown
      setError("Network error. Please check connection.");
    }
  }, []);

  // -----------------------------
  // FETCH STATUS
  // -----------------------------
  const fetchStatus = useCallback(async () => {
    setLoadingStatus(true);
    setError(null);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await axiosInstance.get("/feeding/status/", {
        signal: controller.signal,
      });

      setStatus(res.data);
    } catch (err) {
      if (err.name === "CanceledError") return;

      if (err.response?.status === 404) {
        setStatus(null);
        setError("No active feeding plan.");
      } else {
        handleError(err, "Failed to fetch feeding status");
      }
    } finally {
      setLoadingStatus(false);
    }
  }, [axiosInstance, handleError]);

    // -----------------------------
    // FETCH NOTIFICATIONS
    // -----------------------------
    const fetchNotifications = useCallback(async () => {
      try {
        const res = await axiosInstance.get("/feeding/notifications/");

        // ✅ FIXED: correct response shape
        const alerts = res.data?.data?.alerts || [];
        const count = res.data?.data?.count || 0;

        setNotifications(alerts);
        setNotificationCount(count);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Notification fetch failed:", err);
        }
      }
    }, [axiosInstance]);

  // -----------------------------
  // START FEEDING PLAN
  // -----------------------------
  const handleStart = useCallback(async () => {
    setLoadingAction(true);
    setError(null);

    try {
      const res = await axiosInstance.post("/feeding/start/", startData);
      setStatus(res.data);
      fetchNotifications();
    } catch (err) {
      handleError(err, "Failed to start feeding plan");
    } finally {
      setLoadingAction(false);
    }
  }, [axiosInstance, startData, handleError, fetchNotifications]);

  // -----------------------------
  // CONFIRM SESSION 
  // -----------------------------
  const handleConfirmSession = useCallback(
    async (sessionId) => {
      if (!sessionId) return;

      setLoadingAction(true);
      setError(null);

      try {
        await axiosInstance.post("/feeding/confirm-session/", {
          session_id: sessionId,
        });

        await fetchStatus(); // refresh state
        await fetchNotifications();
      } catch (err) {
        handleError(err, "Failed to confirm feeding session");
      } finally {
        setLoadingAction(false);
      }
    },
    [axiosInstance, fetchStatus, fetchNotifications, handleError]
  );

  // -----------------------------
  // DERIVED STATE
  // -----------------------------
  const currentSession = useMemo(
    () => status?.current_session || null,
    [status]
  );

  const upcomingSession = useMemo(
    () => status?.upcoming_session || null,
    [status]
  );

  const sessions = useMemo(() => {
    return [currentSession, upcomingSession].filter(Boolean);
  }, [currentSession, upcomingSession]);

  // -----------------------------
  // BUSINESS LOGIC HELPERS
  // -----------------------------
  const canConfirm = useCallback((session) => {
    return session?.is_confirmable === true;
  }, []);

  // -----------------------------
  // EFFECT: INITIAL LOAD + POLLING
  // -----------------------------
  useEffect(() => {
    fetchStatus();
    fetchNotifications();

    pollingRef.current = setInterval(() => {
      fetchNotifications();
    }, 15000);

    return () => {
      abortRef.current?.abort();
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [fetchStatus, fetchNotifications]);

  // -----------------------------
  // PUBLIC API
  // -----------------------------
  return {
    // raw state
    status,
    notifications,
    notificationCount,
    error,

    // derived
    currentSession,
    upcomingSession,
    sessions,

    // loading
    loadingStatus,
    loadingAction,

    // form
    startData,
    setStartData,

    // actions
    handleStart,
    handleConfirmSession,
    refreshStatus: fetchStatus,
    refreshNotifications: fetchNotifications,

    // helpers
    canConfirm,
  };
};