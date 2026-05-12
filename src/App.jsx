import { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API = "http://localhost:8080";

export default function App() {

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [message, setMessage] = useState("");

  const [chat, setChat] = useState([]);

  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [chat]);

  // ================= REGISTER =================

  const register = async () => {

    if (!name || !email || !password) {
      toast.error("Fill all fields");
      return;
    }

    try {

      await axios.post(`${API}/api/auth/register`, {
        name,
        email,
        password
      });

      toast.success("Registration Successful");

      setIsLogin(true);

    } catch (err) {

      console.log(err);

      toast.error("Registration Failed");
    }
  };

  // ================= LOGIN =================

  const login = async () => {

    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }

    try {

      const response = await axios.post(
        `${API}/api/auth/login`,
        {
          email,
          password
        }
      );

      const jwt = response.data.token;

      if (!jwt) {
        toast.error("Token not received");
        return;
      }

      localStorage.setItem("token", jwt);

      setToken(jwt);

      toast.success("Login Success");

    } catch (error) {

      console.log(error);

      toast.error("Invalid Credentials");
    }
  };

  // ================= LOGOUT =================

  const logout = () => {

    localStorage.removeItem("token");

    setToken("");

    setChat([]);

    toast.success("Logged out");
  };

  // ================= SEND MESSAGE =================

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      message,
      response: "Typing..."
    };

    setChat((prev) => [...prev, userMessage]);

    const jwt = localStorage.getItem("token");

    try {

      setLoading(true);

      const response = await axios.post(
        `${API}/api/chat/send`,
        null,
        {
          params: {
            message
          },

          headers: {
            Authorization: `Bearer ${jwt}`
          }
        }
      );

      setChat((prev) => {

        const updated = [...prev];

        updated[updated.length - 1] = response.data;

        return updated;
      });

      setMessage("");

    } catch (error) {

      console.log(error);

      toast.error("Message failed");
    } finally {

      setLoading(false);
    }
  };

  // ================= ENTER =================

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // ================= AUTH PAGE =================

  if (!token) {

    return (

      <div style={styles.authContainer}>

        <Toaster position="top-right" />

        <div style={styles.authCard}>

          <h1 style={styles.title}>
            🤖 Smart AI Assistant
          </h1>

          <p style={styles.subtitle}>
            Friendly chatbot for everyone
          </p>

          {!isLogin && (

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={isLogin ? login : register}
            style={styles.mainButton}
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <p style={styles.switchText}>

            {isLogin
              ? "Don't have account?"
              : "Already have account?"}

            <span
              style={styles.switchBtn}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? " Register" : " Login"}
            </span>

          </p>

        </div>

      </div>
    );
  }

  // ================= CHAT PAGE =================

  return (

    <div style={styles.appContainer}>

      <Toaster position="top-right" />

      <div style={styles.chatContainer}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>
            <h2 style={{ margin: 0 }}>
              🤖 AI Assistant
            </h2>

            <small>
              Always here to help
            </small>
          </div>

          <button
            onClick={logout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

        {/* CHAT BODY */}

        <div style={styles.chatBody}>

          {chat.length === 0 && (

            <div style={styles.welcomeBox}>

              <h2>👋 Welcome</h2>

              <p>
                Ask anything. I'm here to help everyone.
              </p>

            </div>
          )}

          {chat.map((c, index) => (

            <div key={index}>

              <div style={styles.userWrapper}>

                <div style={styles.userBubble}>
                  {c.message}
                </div>

              </div>

              <div style={styles.botWrapper}>

                <div style={styles.botBubble}>
                  {c.response}
                </div>

              </div>

            </div>
          ))}

          <div ref={chatEndRef}></div>

        </div>

        {/* INPUT */}

        <div style={styles.inputArea}>

          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.chatInput}
          />

          <button
            onClick={sendMessage}
            style={styles.sendButton}
          >
            {loading ? "..." : "Send"}
          </button>

        </div>

      </div>

    </div>
  );
}

const styles = {

  appContainer: {
    height: "100vh",
    background: "#ececf1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial"
  },

  chatContainer: {
    width: "430px",
    height: "90vh",
    background: "#fff",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
  },

  header: {
    background: "#4f46e5",
    color: "#fff",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logoutButton: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer"
  },

  chatBody: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    background: "#f8fafc"
  },

  welcomeBox: {
    textAlign: "center",
    marginTop: "100px",
    color: "#555"
  },

  userWrapper: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "15px"
  },

  botWrapper: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "20px"
  },

  userBubble: {
    background: "#4f46e5",
    color: "#fff",
    padding: "14px",
    borderRadius: "18px",
    maxWidth: "75%"
  },

  botBubble: {
    background: "#e2e8f0",
    color: "#111",
    padding: "14px",
    borderRadius: "18px",
    maxWidth: "75%"
  },

  inputArea: {
    display: "flex",
    gap: "10px",
    padding: "15px",
    borderTop: "1px solid #ddd",
    background: "#fff"
  },

  chatInput: {
    flex: 1,
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #ccc",
    outline: "none"
  },

  sendButton: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 18px",
    cursor: "pointer"
  },

  authContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#4f46e5,#7c3aed)"
  },

  authCard: {
    width: "340px",
    background: "#fff",
    padding: "35px",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  title: {
    marginBottom: "10px"
  },

  subtitle: {
    color: "#666",
    marginBottom: "25px"
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "12px",
    border: "1px solid #ccc",
    outline: "none"
  },

  mainButton: {
    width: "100%",
    padding: "14px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px"
  },

  switchText: {
    marginTop: "18px",
    color: "#555"
  },

  switchBtn: {
    color: "#4f46e5",
    cursor: "pointer",
    fontWeight: "bold"
  }
};
