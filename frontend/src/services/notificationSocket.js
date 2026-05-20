let socket = null;

export const connectNotificationSocket = (token, onMessage) => {
  if (socket) return socket;

  socket = new WebSocket(
    `ws://localhost:8000/ws/notifications/?token=${token}`
  );

  socket.onopen = () => {
    console.log("✅ Notification socket connected");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onclose = () => {
    console.log("❌ Notification socket disconnected");
    socket = null;
  };

  socket.onerror = (err) => {
    console.error("Socket error:", err);
  };

  return socket;
};

export const disconnectNotificationSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};