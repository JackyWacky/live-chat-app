var ws_uri = `ws://${window.location.host}/ws`;
var websocket = new WebSocket(ws_uri);

// on websocket open
websocket.onopen = function (_event) {
  MessageAdd('<h2 class="message green">You have entered the chat room.</h2>');
};

// on websocket close
websocket.onclose = function (_event) {
  MessageAdd('<h2 class="message blue">You have been disconnected.</h2>');
};

// on websocket error
websocket.onerror = function (_event) {
  MessageAdd('<h2 class="message red">You have been disconnected.</h2>');
};

// when a new websocket message is received, add the message to the chat
websocket.onmessage = function (event) {
  var data = JSON.parse(event.data);

  if (data.type == "message") {
    MessageAdd(
      '<h3 class="message">' + data.username + ": " + data.message + "</h3>",
    );
  }
};

// on chat form submit, parse message data to json and send to server on websocket
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

//prompt user for username that must be longer than 2 characters
function Username() {
  var username = window.prompt("Enter your username:", "");

  if (username.toString().length > 2) {
    localStorage.setItem("username", username);
  } else {
    alert("You username must be at least two characters.");
    Username();
  }
}

// add message to end of message queue, scroll down to bottom of the messages
function MessageAdd(message) {
  var chat_messages = document.getElementById("chat-messages");

  chat_messages.insertAdjacentHTML("beforeend", message);
  chat_messages.scrollTo(0, chat_messages.scrollHeight);
}

Username();
