import { useState } from "react";
import axios from "axios";

function App() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {

    if (!message) return;

    try {

      const response = await axios.post(
        `http://localhost:8080/api/chat/send?userId=1&message=${message}`
      );

      setChat([...chat, response.data]);

      setMessage("");

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{
      maxWidth: "700px",
      margin: "40px auto",
      fontFamily: "Arial"
    }}>

      <h1 style={{ textAlign: "center" }}>
        🤖 AI Chatbot
      </h1>

      <div style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "20px",
        height: "400px",
        overflowY: "auto",
        marginBottom: "20px"
      }}>

        {chat.map((c, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>

            <div>
              <strong>You:</strong> {c.message}
            </div>

            <div>
              <strong>Bot:</strong> {c.response}
            </div>

          </div>
        ))}

      </div>

      <div style={{
        display: "flex",
        gap: "10px"
      }}>

        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default App;