import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../api";

// ✅ IMPORT REAL-TIME HOOK
import { useNotifications } from "./useNotifications";

export const useFeedingData = () => {
  // -----------------------------
  // STATE
  // -----------------------------
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const [startData, setStartData] = useState({
    species: "tilapia",
    age_group: "fingerlings",
  });

  const abortRef = useRef(null);

  // -----------------------------
  // 🔥 REAL-TIME NOTIFICATIONS
  // -----------------------------
  const {
    notifications,
    unreadCount,
    setNotifications,
  } = useNotifications();

  // -----------------------------
  // AXIOS INSTANCE
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
      const message =
        err.response.data?.error ||
        err.response.data?.detail ||
        fallbackMessage;
      setError(message);
    } else {
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
  // 🔹 INITIAL NOTIFICATIONS FETCH (ONLY ONCE)
  // -----------------------------
  const fetchNotificationsOnce = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/notifications/");

      const alerts = res.data?.data?.alerts || [];

      // 🔥 seed initial state before WebSocket kicks in
      setNotifications(alerts);
    } catch (err) {
      console.error("Initial notification fetch failed:", err);
    }
  }, [axiosInstance, setNotifications]);

  // -----------------------------
  // START FEEDING PLAN
  // -----------------------------
  const handleStart = useCallback(async () => {
    setLoadingAction(true);
    setError(null);

    try {
      const res = await axiosInstance.post("/feeding/start/", startData);
      setStatus(res.data);
    } catch (err) {
      handleError(err, "Failed to start feeding plan");
    } finally {
      setLoadingAction(false);
    }
  }, [axiosInstance, startData, handleError]);

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

        await fetchStatus();
      } catch (err) {
        handleError(err, "Failed to confirm feeding session");
      } finally {
        setLoadingAction(false);
      }
    },
    [axiosInstance, fetchStatus, handleError]
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
  // HELPERS
  // -----------------------------
  const canConfirm = useCallback((session) => {
    return session?.is_confirmable === true;
  }, []);

  // -----------------------------
  // EFFECT: INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    fetchStatus();
    fetchNotificationsOnce();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchStatus, fetchNotificationsOnce]);

  // -----------------------------
  // PUBLIC API
  // -----------------------------
  return {
    // raw
    status,
    notifications,
    notificationCount: unreadCount,
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

    // helpers
    canConfirm,
  };
};