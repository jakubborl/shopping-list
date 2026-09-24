import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import { LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "./api";

function Navbar({ onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };
  const fetchUser = async () => {
    const response = await api.get(`${import.meta.env.VITE_API_URL}/me`);

    setUser(response.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="TodoList" />
          <span>To-do Lists</span>
        </Link>
        <div ref={menuRef} className="user-menu-container">
          <div className="navbar-actions">
            <button
              className="user-button"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User size={24} />
            </button>
            {showUserMenu && (
              <div className="user-menu">
                <span className="user-email">{user.email}</span>
                <Link
                  to="/settings"
                  className="logout-button"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings /> Nastavení
                </Link>
                <button onClick={handleLogout} className="logout-button">
                  <LogOut /> Odhlásit se
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
