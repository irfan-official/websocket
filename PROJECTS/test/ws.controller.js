export const handleNotificationSocket = (socket) => {
  console.log("Notification channel connected!");

  socket.on("sendNotification", (data) => {
    console.log("Notification received:", data);
    socket.nsp.emit("newNotification", data); // socket.nsp refers to namespace
  });

  socket.on("disconnect", () => {
    console.log("Notification channel disconnected");
  });
};

export const handleAdminSocket = (socket) => {
  console.log("Admin connected!");

  socket.on("adminMessage", (data) => {
    console.log("Admin message:", data);
    socket.nsp.emit("adminResponse", `Server received: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("Admin disconnected");
  });
};
