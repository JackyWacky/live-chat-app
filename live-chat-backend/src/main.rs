use tokio::net::TcpListener;
use tokio_tungstenite::accept_async;
use tungstenite::protocol::Message;
use futures_util::StreamExt;
use serde_json::Value;

#[tokio::main]
async fn main() {
    let listener = TcpListener::bind("127.0.0.1:9090").await.unwrap();
    println!("Server running on ws://127.0.0.1:9090");

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(handle_connection(stream));
    }
}

async fn handle_connection(stream: tokio::net::TcpStream) {
    let ws = accept_async(stream).await.expect("Error during WebSocket handshake");
    
    // Process incoming messages
    let (mut sender, mut receiver) = ws.split();
    while let Some(Ok(message)) = receiver.next().await {
        if let Message::Text(text) = message {
            // Process the text message
            let json: Value = serde_json::from_str(&text).expect("REASON");
            println!("Message {} sent by {}",json["message"], json["username"],);
        }
    }
}


