var ws_uri = "ws://10.10.0.101:9090";
var websocket = new WebSocket(ws_uri);

// on websocket open
websocket.onopen = function (_event) {
  MessageAdd('<h2 class="message green">You have entered the chat room.</h2>');
};

// on websocket close
websocket.close = function (_event) {
  MessageAdd('<h2 class="message blue">You have been disconnected.</h2>');
};

// on websocket error
websocket.onerror = function (_event) {
  MessageAdd('<h2 class="message blue">You have been disconnected.</h2>');
};

websocket.onmessage = function (event) {
  var data = JSON.parse(event.data);

  if (data.type == "message") {
    MessageAdd(
      '<h3 class="message">' + data.username + ": " + data.message + "</h3>",
    );
  }
};

document.getElementById("chat-form").addEventListener(
  "submit",
  function (event) {
    event.preventDefault();

    var message_element = document.getElementsByTagName("input")[0];
    var message = message_element.value;

    if (message.toString().length) {
      var username = localStorage.getItem("username");

      var data = {
        type: "message",
        username: username,
        message: message,
      };

      websocket.send(JSON.stringify(data));
      message_element.value = "";
    }
  },
  false,
);

function Username() {
  var username = window.prompt("Enter your username:", "");

  if (username.toString().length > 2) {
    localStorage.setItem("username", username);
  } else {
    alert("You username must be at least two characters.");
    Username();
  }
}

function MessageAdd(message) {
  var chat_messages = document.getElementById("chat-messages");

  chat_messages.insertAdjacentHTML("beforeend", message);
  chat_messages.scrollTo(0, chat_messages.scrollHeight);
}

Username();
