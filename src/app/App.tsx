import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { ArtifactSelector } from "../components/ArtifactSelector";
import { BriefInput } from "../components/BriefInput";
import { GenerateButton } from "../components/GenerateButton";
import { HistoryPanel } from "../components/HistoryPanel";
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
  const [promptUsed, setPromptUsed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [activePanel, setActivePanel] = useState<"input" | "output">("input");
  const [outputTab, setOutputTab] = useState<"json" | "markdown">("json");

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const {
    providerConfig,
    demoMode,
    setDemoMode,
    history,
    addHistoryEntry,
    deleteHistoryEntry,
    clearHistory,
    persistOutputs,
    setPersistOutputs,
  } = useStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const listener = (event: MediaQueryListEvent) => setIsNarrow(event.matches);
    setIsNarrow(mediaQuery.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (!isNarrow) {
      setActivePanel("input");
    }
  }, [isNarrow]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const candidateType = params.get("artifactType");
    const candidateBrief = params.get("brief");
    const candidateTab = params.get("tab");
    const candidateDemo = params.get("demo");

    const validTypes: ArtifactType[] = ["PRD", "Backlog", "RiskRegister", "QAPack", "CriticReport"];
    if (candidateType && (validTypes as string[]).includes(candidateType)) {
      setArtifactType(candidateType as ArtifactType);
    }

    if (typeof candidateBrief === "string") {
      setBrief(candidateBrief);
    }

    if (candidateTab === "json" || candidateTab === "markdown") {
      setOutputTab(candidateTab);
    }

    if (candidateDemo === "1") {
      setDemoMode(true);
    }
  }, [setDemoMode]);

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
      text = "Missing API key. Add your BYOK key or enable Demo mode in the header.";
      openConfig = true;
    } else if (lower.includes("failed to generate valid")) {
      text = "Output was invalid JSON. Check Debug raw output, switch to JSON tab, or shorten the brief.";
    } else if (lower.includes("timed out")) {
      text = `${message} Consider increasing timeout or checking your connection.`;
    } else if (lower.includes("cors") || lower.includes("failed to fetch")) {
      text = `${message} If CORS blocks the call, use a local proxy like http://localhost:PORT.`;
    } else if (lower.includes("model output too large")) {
      text = `${message} Try shortening the prompt or using a smaller model.`;
    } else if (lower.includes("json")) {
      text = `${message} Switch to the JSON tab in Output or check Debug to inspect the last response.`;
    }

    return { text, openConfig, inferredRaw };
  };

  const handleGenerate = async (nextBrief?: string, nextArtifactType?: ArtifactType) => {
    const briefToUse = nextBrief ?? brief;
    const artifactTypeToUse = nextArtifactType ?? artifactType;

    if (!briefToUse.trim()) {
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
    setPromptUsed(null);

    try {
      const providerConfigForRun = demoMode ? { ...providerConfig, type: "mock" as const } : providerConfig;
      const provider = createProvider(providerConfigForRun);
      const result = await generateArtifact(provider, artifactTypeToUse, briefToUse, controller.signal);

      if (requestId !== requestIdRef.current) return;

      setArtifact(result.artifact);
      setRawOutput(result.raw);
      setPromptUsed(result.prompt);

      addHistoryEntry({
        artifactType: artifactTypeToUse,
        brief: briefToUse,
        providerType: providerConfigForRun.type,
        demoMode,
        artifact: result.artifact,
        raw: result.raw,
      });
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
      if (e && typeof e === "object" && "prompt" in e && typeof (e as { prompt?: unknown }).prompt === "string") {
        setPromptUsed((e as { prompt?: string }).prompt ?? null);
      }
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

  const handleViewHistory = (entryId: string) => {
    const entry = history.find((item) => item.id === entryId);
    if (!entry) return;
    setArtifact(entry.artifact ?? null);
    setRawOutput(entry.raw ?? null);
    setError(!entry.artifact && !entry.raw ? "No stored output. Re-run to regenerate." : null);
    setPromptUsed(null);
    setArtifactType(entry.artifactType);
    setBrief(entry.brief);
    if (isNarrow) setActivePanel("output");
  };

  const handleRerunHistory = (entryId: string) => {
    const entry = history.find((item) => item.id === entryId);
    if (!entry) return;
    setArtifactType(entry.artifactType);
    setBrief(entry.brief);
    setError(null);
    setRawOutput(null);
    setPromptUsed(null);
    setOutputTab("json");
    void handleGenerate(entry.brief, entry.artifactType);
  };

  const handleShare = async () => {
    const params = new URLSearchParams();
    params.set("artifactType", artifactType);
    params.set("brief", brief);
    params.set("tab", outputTab);
    if (demoMode) params.set("demo", "1");

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Shareable link copied to clipboard");
    } catch {
      alert("Could not copy link. Please copy manually: " + url);
    }
  };

  return (
    <div className="app-shell">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">AI Delivery Copilot</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={demoMode}
              onChange={(e) => setDemoMode(e.target.checked)}
              style={{ accentColor: "#0b63ce" }}
            />
            Demo mode
          </label>
        <button className="header-button" onClick={() => setConfigOpen(true)}>
          ⚙ Provider: {providerConfig.type === "mock" ? "Mock" : "BYOK"}
        </button>
        </div>
      </header>

      {/* Main content */}
      <div className={`main ${isNarrow ? "main--stacked" : ""}`}>
        {isNarrow && (
          <div className="mobile-tabs">
            <button
              className={`tab-button ${activePanel === "input" ? "tab-button--active" : ""}`}
              onClick={() => setActivePanel("input")}
            >
              Input
            </button>
            <button
              className={`tab-button ${activePanel === "output" ? "tab-button--active" : ""}`}
              onClick={() => setActivePanel("output")}
            >
              Output
            </button>
          </div>
        )}
        {/* Left panel - Input */}
        <section className={`panel panel--input ${isNarrow && activePanel !== "input" ? "panel--hidden" : ""}`}>
          <h2 className="section-title">Generate Artifact</h2>

          <ArtifactSelector value={artifactType} onChange={setArtifactType} disabled={loading} />

          <BriefInput
            onLoad={setBrief}
            currentBrief={brief}
            disabled={loading}
            onTemplateSelect={(templateBrief, templateType) => {
              setArtifactType(templateType);
              setBrief(templateBrief);
            }}
          />

          <div className="actions-row">
            <div style={{ flex: 1 }}>
              <GenerateButton loading={loading} onClick={() => handleGenerate()} />
            </div>
            {loading && (
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </section>

        {/* Right panel - Output */}
        <section className={`panel panel--output ${isNarrow && activePanel !== "output" ? "panel--hidden" : ""}`}>
          <h2 className="section-title">Output</h2>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              Output
            </h2>
            <button
              type="button"
              onClick={handleShare}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-6)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Share link
            </button>
          </div>
          <OutputViewer artifact={artifact} error={error} loading={loading} tab={outputTab} onTabChange={setOutputTab} />

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
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div>{rawOutput.length > 2000 ? `${rawOutput.slice(0, 2000)}...` : rawOutput}</div>
                {promptUsed && (
                  <div style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "0.5rem" }}>
                    <div style={{ fontWeight: 700, marginBottom: "0.35rem" }}>Prompt sent</div>
                    <div style={{ maxHeight: 200, overflow: "auto" }}>{promptUsed}</div>
                  </div>
                )}
                <div style={{ display: "flex", gap: "0.5rem" }}>
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
                    Copy Debug Output
                  </button>
                  {promptUsed && (
                    <button
                      onClick={() => navigator.clipboard.writeText(promptUsed)}
                      style={{
                        padding: "0.4rem 0.75rem",
                        backgroundColor: "#0b63ce",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Copy Prompt
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: "0.5rem", color: "#666" }}>No debug output yet.</div>
            )}
          </details>

          <HistoryPanel
            history={history}
            persistOutputs={persistOutputs}
            onTogglePersistOutputs={setPersistOutputs}
            onView={(entry) => handleViewHistory(entry.id)}
            onRerun={(entry) => handleRerunHistory(entry.id)}
            onDelete={deleteHistoryEntry}
            onClear={clearHistory}
          />
        </section>
      </div>

      {/* Provider Config Modal */}
      {configOpen && <ProviderConfig onClose={() => setConfigOpen(false)} />}
    </div>
  );
};
