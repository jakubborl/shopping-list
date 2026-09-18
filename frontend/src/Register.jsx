import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import logo from "./assets/logo.png";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Hesla se neshodují");
      return;
    }

    try {
      const response = await api.post("/register", {
        email,
        password,
      });

      console.log("REGISTRACE ÚSPĚŠNÁ:", response.data);

      navigate("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      setError(error.response?.data?.error || "Registrace se nepodařila");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1>Registrace</h1>
        <p className="login-subtitle">Zaregistruj se do aplikace</p>
        <form className="login-form" onSubmit={handleRegister}>
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

          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Potvrzení hesla"
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Registrovat</button>
        </form>
        <p className="login-register">
          Už máš účet? <Link to="/login">Přihlásit se</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
