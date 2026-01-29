import React, { useState } from "react";
import { clearStoredApiKey, persistApiKey, readApiKeyState } from "../lib/llm/apiKeyStorage";
import { useStore, type ProviderType } from "../lib/store";

interface Props {
  onClose: () => void;
}
export const ProviderConfig: React.FC<Props> = ({ onClose }) => {
  const { providerConfig, setProviderConfig } = useStore();
  const [type, setType] = useState<ProviderType>(providerConfig.type);
  const { apiKey: storedKey, remembered } = readApiKeyState();
  const [apiKey, setApiKey] = useState(storedKey);
  const [rememberApiKey, setRememberApiKey] = useState(remembered);
  const [baseUrl, setBaseUrl] = useState(providerConfig.byokBaseUrl);
  const [model, setModel] = useState(providerConfig.byokModel);

  const handleTypeChange = (value: ProviderType) => {
    setType(value);
    if (value === "mock") {
      clearStoredApiKey();
      setApiKey("");
      setRememberApiKey(false);
    }
  };

  const handleSave = () => {
    if (type === "byok") {
      persistApiKey(apiKey, rememberApiKey);
    } else {
      clearStoredApiKey();
    }

    setProviderConfig({
      type,
      byokBaseUrl: baseUrl,
      byokModel: model,
    });
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          padding: "2rem",
          minWidth: "400px",
          maxWidth: "600px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title">Provider Configuration</h2>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Provider Type
          </label>
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as ProviderType)}
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "0.9rem",
              borderRadius: "4px",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text)",
            }}
          >
            <option value="mock">Mock (deterministic for testing)</option>
            <option value="byok">BYOK (bring your own key)</option>
          </select>
        </div>

        {type === "byok" && (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                API Base URL
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.deepseek.com/v1"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.9rem",
                  borderRadius: "4px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk_..."
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.9rem",
                  borderRadius: "4px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <input
                id="remember-api-key"
                type="checkbox"
                checked={rememberApiKey}
                onChange={(e) => setRememberApiKey(e.target.checked)}
              />
              <label htmlFor="remember-api-key" style={{ fontSize: "0.9rem" }}>
                Remember API key on this device (stores in localStorage)
              </label>
            </div>

            <div style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
              If you hit CORS, use a local proxy http://localhost:...
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Model Name
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="deepseek-chat"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.9rem",
                  borderRadius: "4px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </>
        )}

        <div className="modal-actions">
          <button onClick={onClose} className="button button--secondary">Cancel</button>
          <button onClick={handleSave} className="button button--primary">Save</button>
        </div>
      </div>
    </div>
  );
};
