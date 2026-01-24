import React, { useState } from "react";
import { toMarkdown, toJson } from "../lib/export/markdownExport";
import type { Artifact } from "../lib/schemas/artifacts";

interface Props {
  artifact: Artifact | null;
  error: string | null;
}

export const OutputViewer: React.FC<Props> = ({ artifact, error }) => {
  const [tab, setTab] = useState<"json" | "markdown">("json");

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
      <div style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
        Generate an artifact to see output here
      </div>
    );
  }

  const jsonContent = toJson(artifact);
  const mdContent = toMarkdown(artifact);
  const currentContent = tab === "json" ? jsonContent : mdContent;
  const hasOutput = Boolean(currentContent?.trim());

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid #ddd" }}>
        <button
          onClick={() => setTab("json")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: tab === "json" ? "#0066cc" : "#f0f0f0",
            color: tab === "json" ? "white" : "black",
            border: "none",
            borderRadius: "4px 4px 0 0",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          JSON
        </button>
        <button
          onClick={() => setTab("markdown")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: tab === "markdown" ? "#0066cc" : "#f0f0f0",
            color: tab === "markdown" ? "white" : "black",
            border: "none",
            borderRadius: "4px 4px 0 0",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Markdown
        </button>
      </div>

      {!hasOutput ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", marginBottom: "1rem" }}>
          No output available
        </div>
      ) : (
        <div style={{ flex: 1, overflow: "auto", marginBottom: "1rem", width: "100%" }}>
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
