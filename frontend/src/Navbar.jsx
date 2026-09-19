import { Link } from "react-router-dom";
import logo from "./assets/logo.png";

function Navbar({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="TodoList" />
          <span>To-do Lists</span>
        </Link>

        <div className="navbar-actions">
          <button onClick={handleLogout} className="logout-button">
            Odhlásit se
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
