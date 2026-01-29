import React from "react";
import { useStore } from "../lib/store";

interface Props {
  onClose: () => void;
}

export const Settings: React.FC<Props> = ({ onClose }) => {
  const { demoMode, setDemoMode } = useStore();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
      role="dialog"
      aria-labelledby="settings-title"
      aria-modal="true"
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          minWidth: "400px",
          maxWidth: "600px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="settings-title" style={{ marginTop: 0, marginBottom: "1.5rem" }}>
          Settings
        </h2>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              style={{ marginTop: "0.25rem", accentColor: "#0b63ce", cursor: "pointer" }}
            />
            <div>
              <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                Demo Mode
              </div>
              <div style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: "1.5" }}>
                Use mock data instead of real API calls. Useful for testing and demonstrations without consuming API credits.
              </div>
            </div>
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "2rem" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
