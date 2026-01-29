import React from "react";
import { useStore } from "../lib/store";

interface Props {
  onClose: () => void;
}

export const Settings: React.FC<Props> = ({ onClose }) => {
  const { demoMode, setDemoMode, theme, setTheme } = useStore();

  return (
    <div
        className="modal-backdrop"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
      role="dialog"
      aria-labelledby="settings-title"
      aria-modal="true"
    >
        className="modal-content"
      <div
        style={{
          minWidth: "400px",
          maxWidth: "600px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="settings-title" className="modal-title">
          Settings
        </h2>

        <div className="settings-section">
          <h3 className="settings-section-title">Appearance</h3>
          <div className="settings-option">
            <label className="settings-label">
              <span className="settings-label-text">
                <strong>Theme</strong>
              </span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark")}
                className="settings-select"
              >
                <option value="light">☀️ Light</option>
                <option value="dark">🌙 Dark</option>
              </select>
            </label>
            <p className="settings-description">
              Choose your preferred color scheme. Changes apply immediately.
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h3 className="settings-section-title">Developer</h3>
          <div className="settings-option">
            <label className="settings-checkbox-label">
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              className="settings-checkbox"
            />
              <span className="settings-label-text">
                <strong>
                Demo Mode
                </strong>
              </span>
          </label>
                    <p className="settings-description">
                      Use mock data instead of real API calls. Useful for testing without consuming API credits.
                    </p>
          </div>
        </div>

        <div className="modal-actions">
          <button
            onClick={onClose}
            className="button button--secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
