import { useState, useEffect, useContext, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { baseURL } from "../apiConfig";
import "./ChatBox.css";

const socket = io(baseURL, {
  transports: ["websocket"],
  autoConnect: false,
});

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeUsers, setActiveUsers] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      socket.connect();

      socket.emit("joinWhiteboard", {
        whiteboardId: id,
        username: user.username,
      });

      socket.on("chatMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on("updateActiveUsers", (count) => {
        setActiveUsers(count);
      });
    }

    return () => {
      if (user) {
        socket.emit("leaveWhiteboard", {
          whiteboardId: id,
          username: user.username,
        });
        socket.disconnect();
      }
      socket.off("chatMessage");
      socket.off("updateActiveUsers");
    };
  }, [id, user]);

  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const message = {
        text: input,
        sender: user.username,
        whiteboardId: id,
      };
      socket.emit("sendMessage", message);
      setInput("");
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="chat-container">
      <div className="chat-header" onClick={toggleChat}>
        Chat (Active users: {activeUsers / 2})
      </div>
      {isChatOpen && (
        <div className="chat-content">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${
                  message.sender === user.username ? "sent" : "received"
                }`}
              >
                <div className="message-sender">
                  {message.sender === user.username ? "You" : message.sender}
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
