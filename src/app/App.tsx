import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { ArtifactSelector } from "../components/ArtifactSelector";
import { BriefInput } from "../components/BriefInput";
import { GenerateButton } from "../components/GenerateButton";
import { HistoryPanel } from "../components/HistoryPanel";
import { OutputViewer } from "../components/OutputViewer";
import { ProviderConfig } from "../components/ProviderConfig";
import { Settings } from "../components/Settings";
import { Toast, type ToastMessage } from "../components/Toast";
import { useStore } from "../lib/store";
import { decodeUrlState, buildShareUrl } from "../lib/urlState";
import { generateArtifact } from "../lib/llm/generator";
import { createProvider } from "../lib/llm/providerFactory";
import type { ArtifactType, Artifact } from "../lib/schemas/artifacts";
import deliveryOpsSample from "../../docs/samples/delivery-ops.md?raw";
import healthcareClinicSample from "../../docs/samples/healthcare-clinic.md?raw";
import ecommerceGrowthSample from "../../docs/samples/ecommerce-growth.md?raw";
import saasB2BSample from "../../docs/samples/saas-b2b.md?raw";

export const App: React.FC = () => {
  const [artifactType, setArtifactType] = useState<ArtifactType>("PRD");
  const [brief, setBrief] = useState("");
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [promptUsed, setPromptUsed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [activePanel, setActivePanel] = useState<"input" | "output">("input");
  const [outputTab, setOutputTab] = useState<"json" | "markdown">("json");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const briefInputRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    providerConfig,
    demoMode,
    setDemoMode,
      theme,
    history,
    addHistoryEntry,
    deleteHistoryEntry,
    clearHistory,
    persistOutputs,
    setPersistOutputs,
  } = useStore();

  // Apply theme to root element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
    const urlState = decodeUrlState(window.location.search);

    if (urlState.artifactType) {
      setArtifactType(urlState.artifactType);
    }

    if (urlState.brief) {
      setBrief(urlState.brief);
    }

    if (urlState.tab) {
      setOutputTab(urlState.tab);
    }

    if (urlState.demo) {
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

  const showToast = (message: string, variant: "success" | "error" = "success") => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, variant }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
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
    const { url, briefExcluded } = buildShareUrl({
      artifactType,
      brief,
      tab: outputTab,
      demo: demoMode,
    });

    try {
      await navigator.clipboard.writeText(url);
      const message = briefExcluded
        ? "Shareable link copied (brief too long to include)"
        : "Shareable link copied to clipboard";
      showToast(message, "success");
    } catch {
      showToast("Could not copy link. Please copy manually: " + url, "error");
    }
  };

  const handleTryDemo = () => {
    setDemoMode(true);
    setArtifactType("PRD");
    setBrief(saasB2BSample);
    setError(null);
    setRawOutput(null);
    setPromptUsed(null);
    setArtifact(null);
    setTimeout(() => {
      briefInputRef.current?.focus();
      if (isNarrow) setActivePanel("input");
    }, 0);
  };

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">AI Delivery Copilot</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            className="button button--primary header-button header-button--demo"
            onClick={handleTryDemo}
            aria-label="Try demo with sample brief"
          >
            ✨ Try Demo
          </button>
          {demoMode && (
            <div className="demo-badge">
              <span className="demo-badge-text">Demo active</span>
              <button
                className="demo-badge-exit"
                onClick={() => setDemoMode(false)}
                aria-label="Exit demo mode"
              >
                Exit
              </button>
            </div>
          )}
          <button className="button button--ghost header-button" onClick={() => setHistoryOpen(!historyOpen)}>
            📋 History ({history.length})
          </button>
          <button className="button button--ghost header-button" onClick={() => setConfigOpen(true)}>
            ⚙ Provider: {providerConfig.type === "mock" ? "Mock" : "BYOK"}
          </button>
          <button
            className="button button--ghost header-button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
          >
            ⚙ Settings
          </button>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" role="main">
      <div className={`main ${isNarrow ? "main--stacked" : ""}`}>
        {isNarrow && (
          <div className="mobile-tabs" role="tablist" aria-label="Input and Output tabs">
            <button
              className={`tab-button ${activePanel === "input" ? "tab-button--active" : ""}`}
              role="tab"
              aria-selected={activePanel === "input"}
              onClick={() => setActivePanel("input")}
            >
              Input
            </button>
            <button
              className={`tab-button ${activePanel === "output" ? "tab-button--active" : ""}`}
              role="tab"
              aria-selected={activePanel === "output"}
              onClick={() => setActivePanel("output")}
            >
              Output
            </button>
          </div>
        )}
        {/* Left panel - Input */}
        <section className={`panel panel--input ${isNarrow && activePanel !== "input" ? "panel--hidden" : ""}`}>
          <h2 className="section-title">Generate Artifact</h2>

          {/* Help Block */}
          <div className="help-block">
            <div className="help-block-title">🚀 Demo in 60 seconds</div>
            <ol className="help-block-steps">
              <li>Click <strong>Try Demo</strong> button (header)</li>
              <li>Choose your <strong>Artifact Type</strong> below</li>
              <li>Click <strong>Generate</strong></li>
              <li>Share link or export as Markdown</li>
            </ol>
          </div>

          <ArtifactSelector value={artifactType} onChange={setArtifactType} disabled={loading} />

          <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="quick-briefs" style={{ display: "block", fontWeight: "bold", marginBottom: "0.4rem" }}>
                Quick Briefs
              </label>
              <select
                id="quick-briefs"
                disabled={loading}
                value={"custom"}
                onChange={(e) => {
                  if (loading) return;
                  const v = e.target.value;
                  if (v === "custom") {
                    setBrief("");
                    return;
                  }
                  const map: Record<string, string> = {
                    "delivery-ops": deliveryOpsSample,
                    "healthcare-clinic": healthcareClinicSample,
                    "ecommerce-growth": ecommerceGrowthSample,
                    "saas-b2b": saasB2BSample,
                  };
                  const content = map[v] ?? "";
                  setBrief(content);
                }}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "1rem",
                  borderRadius: "4px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                }}
              >
                <option value="custom">Custom</option>
                <option value="delivery-ops">Delivery Ops</option>
                <option value="healthcare-clinic">Healthcare Clinic</option>
                <option value="ecommerce-growth">Ecommerce Growth</option>
                <option value="saas-b2b">SaaS B2B</option>
              </select>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={() => setBrief("")}
              className="button button--secondary"
              style={{ height: "2.5rem" }}
            >
              Reset
            </button>
          </div>

          <BriefInput
            ref={briefInputRef}
            onLoad={setBrief}
            currentBrief={brief}
            disabled={loading}
            onShortcut={() => {
              if (!loading) {
                void handleGenerate();
              }
            }}
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
              <button className="button button--danger cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            )}
          </div>
        </section>

        {/* Right panel - Output */}
        <section className={`panel panel--output ${isNarrow && activePanel !== "output" ? "panel--hidden" : ""}`}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", marginBottom: "var(--space-16)" }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              Output
            </h2>
            <button
              type="button"
              onClick={handleShare}
              className="button button--secondary"
            >
              Share link
            </button>
          </div>
          <OutputViewer 
            artifact={artifact} 
            error={error} 
            loading={loading} 
            tab={outputTab} 
            onTabChange={setOutputTab}
            onTryDemo={handleTryDemo}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenDebug={() => {
              const details = document.querySelector("details");
              if (details) details.open = true;
            }}
          />

          <details style={{ marginTop: "1rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Debug</summary>
            {rawOutput ? (
              <div className="debug-panel">
                <div>{rawOutput.length > 2000 ? `${rawOutput.slice(0, 2000)}...` : rawOutput}</div>
                {promptUsed && (
                  <div className="debug-prompt">
                    <div className="debug-prompt-title">Prompt sent</div>
                    <div className="debug-prompt-content">{promptUsed}</div>
                  </div>
                )}
                <div className="debug-actions">
                  <button
                    onClick={() => navigator.clipboard.writeText(rawOutput)}
                    className="button button--secondary"
                  >
                    Copy Debug Output
                  </button>
                  {promptUsed && (
                    <button
                      onClick={() => navigator.clipboard.writeText(promptUsed)}
                      className="button button--secondary"
                    >
                      Copy Prompt
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="debug-empty">No debug output yet.</div>
            )}
          </details>

          {historyOpen && (
            <HistoryPanel
              history={history}
              persistOutputs={persistOutputs}
              onTogglePersistOutputs={setPersistOutputs}
              onView={(entry) => handleViewHistory(entry.id)}
              onRerun={(entry) => handleRerunHistory(entry.id)}
              onDelete={deleteHistoryEntry}
              onClear={clearHistory}
            />
          )}
        </section>
      </div>
      </main>

      {/* Provider Config Modal */}
      {configOpen && <ProviderConfig onClose={() => setConfigOpen(false)} />}

      {/* Settings Modal */}
      {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}

      {/* Toast Notifications */}
      <Toast messages={toasts} onDismiss={dismissToast} />
    </div>
  );
};
