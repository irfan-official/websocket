const express = require('express');
const http = require('http');
const cors = require('cors');
const { stablishSocketConnection } = require('./websocket/ws.connection.js');  // Import WebSocket connection code

const app = express();
const server = http.createServer(app); // Create an HTTP server with Express

// Middleware (optional, if needed)
app.use(cors());

// Serve regular HTTP routes (e.g., homepage, login, etc.)
app.get("/", (req, res) => {
  res.send("Dashboard Page");
});

app.get("/login", (req, res) => {
  res.send("Login Page");
});

// Call the function to set up WebSocket connection
stablishSocketConnection(server);

// Start the server
server.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});

