import React, { useRef, useState } from "react";
import { ArtifactSelector } from "../components/ArtifactSelector";
import { BriefInput } from "../components/BriefInput";
import { GenerateButton } from "../components/GenerateButton";
import { OutputViewer } from "../components/OutputViewer";
import { ProviderConfig } from "../components/ProviderConfig";
import { useStore } from "../lib/store";
import { generateArtifact } from "../lib/llm/generator";
import { createProvider } from "../lib/llm/providerFactory";
import type { ArtifactType, Artifact } from "../lib/schemas/artifacts";

export const App: React.FC = () => {
  const [artifactType, setArtifactType] = useState<ArtifactType>("PRD");
  const [brief, setBrief] = useState("");
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const { providerConfig } = useStore();

  const mapErrorMessage = (message: string): { text: string; openConfig: boolean; inferredRaw: string | null } => {
    const lower = message.toLowerCase();
    let openConfig = false;
    let text = message;
    let inferredRaw: string | null = null;

    const lastOutputMatch = message.match(/Last output.*?: (.+)$/s);
    if (lastOutputMatch) {
      inferredRaw = lastOutputMatch[1];
    }

    if (lower.includes("missing api key")) {
      text = "Missing API key. Open provider config to set your BYOK key.";
      openConfig = true;
    } else if (lower.includes("timed out")) {
      text = `${message} Consider increasing timeout or checking your connection.`;
    } else if (lower.includes("cors") || lower.includes("failed to fetch")) {
      text = `${message} If CORS blocks the call, use a local proxy like http://localhost:PORT.`;
    } else if (lower.includes("model output too large")) {
      text = `${message} Try shortening the prompt or using a smaller model.`;
    }

    return { text, openConfig, inferredRaw };
  };

  const handleGenerate = async () => {
    if (!brief.trim()) {
      setError("Please enter a brief");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const requestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);
    setArtifact(null);
    setRawOutput(null);

    try {
      const provider = createProvider(providerConfig);
      const result = await generateArtifact(provider, artifactType, brief, controller.signal);

      if (requestId !== requestIdRef.current) return;

      setArtifact(result.artifact);
      setRawOutput(result.raw);
    } catch (e: unknown) {
      if (requestId !== requestIdRef.current) return;
      if (controller.signal.aborted) {
        setError("Generation cancelled.");
        return;
      }

      const message = e instanceof Error ? e.message : String(e ?? "Unknown error occurred");
      const mapped = mapErrorMessage(message);
      setError(mapped.text);
      setRawOutput(mapped.inferredRaw);
      if (mapped.openConfig) setConfigOpen(true);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    requestIdRef.current++;
    setLoading(false);
    setError("Generation cancelled.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "#f1f5f9" }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: "#0066cc",
          color: "white",
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>AI Delivery Copilot</h1>
        <button
          onClick={() => setConfigOpen(true)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            border: "1px solid white",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ⚙ Provider: {providerConfig.type === "mock" ? "Mock" : "BYOK"}
        </button>
      </header>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Left panel - Input */}
        <div
          style={{
            flex: 1,
            padding: "2rem",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
            backgroundColor: "white",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Generate Artifact</h2>

          <ArtifactSelector value={artifactType} onChange={setArtifactType} disabled={loading} />

          <BriefInput onLoad={setBrief} currentBrief={brief} disabled={loading} />

          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <GenerateButton loading={loading} onClick={handleGenerate} />
              </div>
              {loading && (
                <button
                  onClick={handleCancel}
                  style={{
                    padding: "0.65rem 1rem",
                    backgroundColor: "#e53935",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right panel - Output */}
        <div
          style={{
            flex: 1,
            padding: "2rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Output</h2>
          <OutputViewer artifact={artifact} error={error} />

          <details style={{ marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Debug</summary>
            {rawOutput ? (
              <div
                style={{
                  marginTop: "0.75rem",
                  padding: "0.75rem",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                  fontSize: "0.85rem",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {rawOutput.length > 2000 ? `${rawOutput.slice(0, 2000)}...` : rawOutput}
                <div style={{ marginTop: "0.75rem" }}>
                  <button
                    onClick={() => navigator.clipboard.writeText(rawOutput)}
                    style={{
                      padding: "0.4rem 0.75rem",
                      backgroundColor: "#0066cc",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Copy Debug Info
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: "0.5rem", color: "#666" }}>No debug output yet.</div>
            )}
          </details>
        </div>
      </div>

      {/* Provider Config Modal */}
      {configOpen && <ProviderConfig onClose={() => setConfigOpen(false)} />}
    </div>
  );
};
