import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const [loading, setLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================
  const login = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      console.log("FULL RESPONSE =>", res.data);

      const jwt = res.data.token;

      console.log("TOKEN =>", jwt);

      localStorage.setItem("token", jwt);
      setToken(jwt);
    } catch (err) {
      console.log("Login Error:", err);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setChat([]);
  };

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async () => {
    try {
      const jwt = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8080/api/chat/send",
        null,
        {
          params: {
            message: message,
          },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      setChat((prev) => [...prev, res.data]);
      setMessage("");
    } catch (err) {
      console.log("Chat Error:", err);
    }
  };

  // =========================
  // LOGIN UI
  // =========================
  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>🔐 Login</h2>

          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={login} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // CHAT UI
  // =========================
  return (
    <div style={styles.container}>
      <div style={styles.chatCard}>
        <div style={styles.header}>
          <h2>🤖 AI Chatbot</h2>

          <button onClick={logout} style={styles.logout}>
            Logout
          </button>
        </div>

        <div style={styles.chatBox}>
          {chat.map((c, i) => (
            <div key={i} style={styles.msgBlock}>
              <div>
                <b>You:</b> {c.message}
              </div>
              <div>
                <b>Bot:</b> {c.response}
              </div>
              <hr />
            </div>
          ))}
        </div>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="Type message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button style={styles.button} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================
// SIMPLE STYLES
// =========================
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "Arial",
    background: "#f5f5f5",
  },

  card: {
    padding: "30px",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "300px",
    textAlign: "center",
  },

  chatCard: {
    width: "700px",
    height: "600px",
    background: "#fff",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    borderBottom: "1px solid #ddd",
  },

  chatBox: {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
  },

  inputRow: {
    display: "flex",
    padding: "10px",
    gap: "10px",
    borderTop: "1px solid #ddd",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },

  button: {
    padding: "10px 15px",
    border: "none",
    background: "#007bff",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },

  logout: {
    padding: "6px 12px",
    border: "none",
    background: "red",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },

  msgBlock: {
    marginBottom: "10px",
  },
};

export default App;
