import WebSocket, { WebSocketServer } from "ws";

var port = 9090;

var wss = new WebSocketServer({ port });

console.log("Server running on port: ", port);

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    var message = JSON.parse(data);
    console.log("received: %s", message);

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });
});
