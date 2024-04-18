const express = require("express");
const http = require("http");
const { Server } = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const wss = new Server({ server });

wss.on("connection", (ws) => {
  const clientId = uuidv4();
  console.log(`Client connected: ID ${clientId}`);

  ws.on("message", (data) => {
    console.log(`Received message from client ${clientId}: ${data}`);
    // Broadcast the message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on("close", () => {
    console.log(`Client disconnected: ID ${clientId}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
