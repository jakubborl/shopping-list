import { useEffect, useState } from "react";
import api from "./api";
import "./Nastaveni.css";
import ChangePassword from "./ChangePassword";

function Nastaveni() {
  const [user, setUser] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const fetchUser = async () => {
    const response = await api.get(`${import.meta.env.VITE_API_URL}/me`);

    setUser(response.data);
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="settings">
      <h1>Nastavení</h1>

      <section className="settings-section">
        <h2>Účet</h2>

        <div className="settings-row">
          <div>
            <h3>Email</h3>
            <p>{user.email}</p>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>Zabezpečení</h2>

        <div className="settings-row">
          <div>
            <h3>Heslo</h3>
            <p>Změna hesla účtu</p>
          </div>

          <button onClick={() => setShowPasswordModal(true)}>Změnit</button>
        </div>
      </section>

      <section className="settings-section">
        <h2>Vzhled</h2>

        <div className="darkmode-section">
          <div>
            <h3>Vzhled</h3>
            <p>Vyberte vzhled aplikace</p>
          </div>

          <button
            className={`theme-toggle ${darkMode ? "dark" : ""}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className="toggle-circle"></div>
          </button>
        </div>
      </section>

      <section className="settings-section danger">
        <h2>Nebezpečná zóna</h2>

        <div className="settings-row">
          <div>
            <h3>Smazat účet</h3>
            <p>Trvale odstraní účet a jeho data.</p>
          </div>

          <button className="delete-account-button">Smazat</button>
        </div>
      </section>
      {showPasswordModal && (
        <ChangePassword onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}
export default Nastaveni;
