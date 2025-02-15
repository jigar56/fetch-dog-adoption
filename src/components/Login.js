import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import dogImage from "./dog.png";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    if (!name || !email) {
      setError("Both fields are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/auth/login`, { name, email }, { withCredentials: true });
      onLogin(name, email);
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="my-container">
      <div className="login-container">

        <div className="login-left">
          <h1 className="title">Fetch Dog Adoption</h1>
          <h2 className="subtitle">Login</h2>

          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`input ${error ? "error-border" : ""}`} />
          {error && <p className="error-message">{error}</p>}

          <button onClick={handleLogin} className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
        <div className="login-right">
          <img src={dogImage} alt="Dog" className="dog-image" />
        </div>
      </div>
    </div >
  );
};

export default Login;
