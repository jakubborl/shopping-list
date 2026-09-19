import { useState } from "react";
import axios from "axios";
import api from "./api";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(`${import.meta.env.VITE_API_URL}/login`, {
        email,
        password,
      });

      console.log("LOGIN:", response.data);

      localStorage.setItem("token", response.data.token);
      onLogin();
    } catch (error) {
      console.error("LOGIN ERROR:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>To-Do Lists</h1>
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>Přihlášení</h2>

        <p className="login-subtitle">Přihlas se ke svým seznamům</p>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Heslo"
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Přihlásit</button>
        </form>

        <p className="login-register">
          Nemáš účet? <Link to="/register">Registrovat se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
