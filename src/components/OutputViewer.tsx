import React from "react";
import "./OutputViewer.css";
import { toMarkdown, toJson } from "../lib/export/markdownExport";
import type { Artifact } from "../lib/schemas/artifacts";

interface Props {
  artifact: Artifact | null;
  error: string | null;
  loading: boolean;
  tab: "json" | "markdown";
  onTabChange: (tab: "json" | "markdown") => void;
}

export const OutputViewer: React.FC<Props> = ({ artifact, error, loading, tab, onTabChange }) => {
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          padding: "1rem",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ height: "14px", width: "160px", backgroundColor: "#e2e8f0", borderRadius: "6px", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: "120px", backgroundColor: "#e2e8f0", borderRadius: "6px", animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ color: "#475569", fontWeight: 600 }}>Generating…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#fee",
          color: "#c00",
          borderRadius: "4px",
          fontFamily: "monospace",
          fontSize: "0.9rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <strong>Error:</strong>
        <br />
        {error}
      </div>
    );
  }

  if (!artifact) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
        No output yet. Generate an artifact to view JSON or Markdown.
      </div>
    );
  }

  const jsonContent = toJson(artifact);
  const mdContent = toMarkdown(artifact);
  const currentContent = tab === "json" ? jsonContent : mdContent;
  const hasOutput = Boolean(currentContent?.trim());
  const activePanelId = tab === "json" ? "ov-panel-json" : "ov-panel-markdown";
  const activeTabId = tab === "json" ? "ov-tab-json" : "ov-tab-markdown";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        className="ov-tabs"
        role="tablist"
        aria-label="Output format tabs"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            const next = tab === "json" ? "markdown" : "json";
            onTabChange(next as "json" | "markdown");
            const el = document.getElementById(next === "json" ? "ov-tab-json" : "ov-tab-markdown");
            el?.focus();
            e.preventDefault();
          }
        }}
      >
        <button
          id="ov-tab-json"
          aria-controls="ov-panel-json"
          onClick={() => onTabChange("json")}
          role="tab"
          aria-selected={tab === "json"}
          className="ov-tab"
        >
          JSON
        </button>
        <button
          id="ov-tab-markdown"
          aria-controls="ov-panel-markdown"
          onClick={() => onTabChange("markdown")}
          role="tab"
          aria-selected={tab === "markdown"}
          className="ov-tab"
        >
          Markdown
        </button>
      </div>

      {!hasOutput ? (
        <div
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", marginBottom: "1rem" }}
          role="tabpanel"
          id={activePanelId}
          aria-labelledby={activeTabId}
        >
          No output available
        </div>
      ) : (
        <div
          style={{ flex: 1, overflow: "auto", marginBottom: "1rem", width: "100%" }}
          role="tabpanel"
          id={activePanelId}
          aria-labelledby={activeTabId}
        >
          <pre
            style={{
              padding: "1rem",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              fontSize: "0.85rem",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
              color: "#0f172a",
              opacity: 1,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {currentContent}
          </pre>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => {
            const content = tab === "json" ? jsonContent : mdContent;
            navigator.clipboard.writeText(content);
            alert("Copied to clipboard!");
          }}
          style={{
            flex: 1,
            padding: "0.5rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Copy to Clipboard
        </button>
        <button
          onClick={() => {
            const content = tab === "json" ? jsonContent : mdContent;
            const ext = tab === "json" ? "json" : "md";
            const filename = `artifact-${new Date().toISOString().split("T")[0]}.${ext}`;
            const blob = new Blob([content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          style={{
            flex: 1,
            padding: "0.5rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Download
        </button>
      </div>
    </div>
  );
};
