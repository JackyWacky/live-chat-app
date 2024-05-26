import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const port = 9090;

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Create an HTTP server
const server = http.createServer(app);

// Initialize WebSocket server instance on the HTTP server
const wss = new WebSocketServer({ noServer: true });

// Handle WebSocket connections
wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (data) => {
    const message = JSON.parse(data);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });
});

// Upgrade HTTP server to WebSocket
server.on("upgrade", (request, socket, head) => {
  const pathname = request.url;

  if (pathname === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
