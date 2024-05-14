import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 9090 });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    //var message = JSON.parse(data);
    console.log("received: %s", data);
    ws.send(data);
  });
});
