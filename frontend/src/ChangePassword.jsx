import { useState } from "react";
import "./ChangePassword.css";
import api from "./api";

export default function ChangePassword({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    if (newPassword !== passwordConfirm) {
      setLoading(false);
      setError("Hesla se neshodují");
      return;
    }
    try {
      await api.patch(`/me/password`, {
        currentPassword,
        newPassword,
      });
      setSuccess("Heslo bylo úspěšně změněno.");
      setError("");
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.error || "Změna hesla se nepodařila");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="list-dialog" onClick={(e) => e.stopPropagation()}>
        <h2>Změna hesla</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            changePassword(currentPassword, password);
          }}
        >
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Zadej stávájící heslo"
            autoComplete="current-password"
          />

          <input
            value={password}
            onChange={(e) => (setPassword(e.target.value), setError(false))}
            type="password"
            placeholder="Zadej nové heslo"
            autoComplete="new-password"
          />
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => (
              setPasswordConfirm(e.target.value), setError(false)
            )}
            placeholder="Potvrzení nového hesla"
            autoComplete="new-password"
          />
          {error && <p className="login-error">{error}</p>}
          {loading ? (
            <div className="spinner"></div>
          ) : success ? (
            <p className="success-message">{success}</p>
          ) : (
            <button type="submit" className="create-btn">
              Změnit heslo
            </button>
          )}

          <div className="dialog-buttons">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Zavřít
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
