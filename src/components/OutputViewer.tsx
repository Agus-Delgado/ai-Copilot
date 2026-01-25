import React from "react";
import "./OutputViewer.css";
import { toMarkdown, toJson } from "../lib/export/markdownExport";
import { buildChecklist } from "../lib/quality/checklist";
import type { Artifact } from "../lib/schemas/artifacts";

interface Props {
  artifact: Artifact | null;
  error: string | null;
  loading: boolean;
  tab: "json" | "markdown";
  onTabChange: (tab: "json" | "markdown") => void;
}

export const OutputViewer: React.FC<Props> = ({ artifact, error, loading, tab, onTabChange }) => {
  const [copied, setCopied] = React.useState<string | null>(null);
  const showCopied = (msg: string) => {
    setCopied(msg);
    window.setTimeout(() => setCopied(null), 1500);
  };
  const buildJiraCopy = (): string => {
    if (!artifact) return "";
    if (artifact.artifactType === "Backlog") {
      const parts: string[] = [];
      parts.push("### Epic");
      parts.push(`Epic: ${artifact.productArea}`);
      parts.push(`Goal: ${artifact.epics[0]?.goal ?? "<WHAT_SUCCESS_LOOKS_LIKE>"}`);
      parts.push(`Scope: <IN/OUT>`);
      parts.push(`Risks: <TOP_3>`);
      parts.push("");
      parts.push("### Stories");
      artifact.epics.forEach((e) => {
        e.stories.forEach((s) => {
          parts.push(`**Story:** ${s.title}`);
          parts.push(`${s.userStory}`);
          parts.push("");
          parts.push("**Acceptance Criteria**");
          s.acceptanceCriteria.forEach((ac) => {
            parts.push(`- [ ] ${ac}`);
          });
          parts.push("");
        });
      });
      return parts.join("\n");
    }
    const tpl: string[] = [];
    tpl.push("### Epic");
    tpl.push(`Epic: <EPIC_TITLE>`);
    tpl.push(`Goal: <WHAT_SUCCESS_LOOKS_LIKE>`);
    tpl.push(`Scope: <IN/OUT>`);
    tpl.push(`Risks: <TOP_3>`);
    tpl.push("");
    tpl.push("### Stories");
    tpl.push("**Story 1:** <TITLE>");
    tpl.push("As a <persona> I want <need> so that <outcome>");
    tpl.push("");
    tpl.push("**Acceptance Criteria**");
    tpl.push("- [ ] Given <context>, when <action>, then <expected>");
    tpl.push("- [ ] Given <context>, when <action>, then <expected>");
    return tpl.join("\n");
  };
  const buildGithubCopy = (): string => {
    if (!artifact) return "";
    const lines: string[] = [];
    lines.push("### Title");
    if (artifact.artifactType === "PRD") {
      lines.push(artifact.title);
      lines.push("");
      lines.push("### Context");
      lines.push(artifact.problemStatement);
      lines.push("");
      lines.push("### Requirements");
      artifact.functionalRequirements.forEach((fr) => lines.push(`- [ ] ${fr.description}`));
      lines.push("");
      lines.push("### Acceptance Criteria");
      lines.push("- [ ] Given <context>, when <action>, then <expected>");
      lines.push("");
      lines.push("### Definition of Done");
      lines.push("- [ ] Docs updated (README/docs)");
      lines.push("- [ ] Verified in Demo Mode");
      return lines.join("\n");
    }
    if (artifact.artifactType === "Backlog") {
      const epic = artifact.epics[0];
      lines.push(epic?.title ?? artifact.productArea);
      lines.push("");
      lines.push("### Context");
      lines.push(artifact.productArea);
      lines.push("");
      lines.push("### Requirements");
      epic?.stories.forEach((s) => lines.push(`- [ ] ${s.title}`));
      lines.push("");
      lines.push("### Acceptance Criteria");
      epic?.stories.forEach((s) => s.acceptanceCriteria.forEach((ac) => lines.push(`- [ ] ${ac}`)));
      lines.push("");
      lines.push("### Definition of Done");
      lines.push("- [ ] Docs updated (README/docs)");
      lines.push("- [ ] Verified in Demo Mode");
      return lines.join("\n");
    }
    if (artifact.artifactType === "QAPack") {
      lines.push(artifact.featureUnderTest);
      lines.push("");
      lines.push("### Context");
      lines.push("QA Pack");
      lines.push("");
      lines.push("### Requirements");
      artifact.checklist.forEach((c) => lines.push(`- [ ] ${c}`));
      lines.push("");
      lines.push("### Acceptance Criteria");
      artifact.testCases[0]?.expectedResults.forEach((er) => lines.push(`- [ ] ${er}`));
      lines.push("");
      lines.push("### Definition of Done");
      lines.push("- [ ] Docs updated (README/docs)");
      lines.push("- [ ] Verified in Demo Mode");
      return lines.join("\n");
    }
    if (artifact.artifactType === "RiskRegister") {
      lines.push(artifact.context);
      lines.push("");
      lines.push("### Context");
      lines.push(artifact.context);
      lines.push("");
      lines.push("### Requirements");
      artifact.risks.forEach((r) => lines.push(`- [ ] ${r.risk}`));
      lines.push("");
      lines.push("### Acceptance Criteria");
      lines.push("- [ ] Given <context>, when <action>, then <expected>");
      lines.push("");
      lines.push("### Definition of Done");
      lines.push("- [ ] Docs updated (README/docs)");
      lines.push("- [ ] Verified in Demo Mode");
      return lines.join("\n");
    }
    if (artifact.artifactType === "CriticReport") {
      lines.push(`Critic Report: ${artifact.summary}`);
      lines.push("");
      lines.push("### Context");
      lines.push((artifact.ambiguities[0] ?? "<brief context / problem>"));
      lines.push("");
      lines.push("### Requirements");
      artifact.recommendedNextSteps.forEach((s) => lines.push(`- [ ] ${s}`));
      lines.push("");
      lines.push("### Acceptance Criteria");
      lines.push("- [ ] Given <context>, when <action>, then <expected>");
      lines.push("");
      lines.push("### Definition of Done");
      lines.push("- [ ] Docs updated (README/docs)");
      lines.push("- [ ] Verified in Demo Mode");
      return lines.join("\n");
    }
    const tpl: string[] = [];
    tpl.push("### Title");
    tpl.push("<SHORT_ACTIONABLE_TITLE>");
    tpl.push("");
    tpl.push("### Context");
    tpl.push("<brief context / problem>");
    tpl.push("");
    tpl.push("### Requirements");
    tpl.push("- [ ] <req 1>");
    tpl.push("- [ ] <req 2>");
    tpl.push("");
    tpl.push("### Acceptance Criteria");
    tpl.push("- [ ] Given <context>, when <action>, then <expected>");
    tpl.push("");
    tpl.push("### Definition of Done");
    tpl.push("- [ ] Output is schema-valid (if applicable)");
    tpl.push("- [ ] Docs updated (README/docs)");
    tpl.push("- [ ] Verified in Demo Mode");
    return tpl.join("\n");
  };
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
        Generate an artifact to see the output here.
        <div style={{ marginTop: "0.5rem", color: "#475569" }}>
          Tip: enable Demo Mode in the header or use Quick Briefs for a fast start.
        </div>
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
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#334155", marginBottom: "1rem" }}
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
            showCopied("Copied");
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
            const content = buildJiraCopy();
            navigator.clipboard.writeText(content);
            showCopied("Copied");
          }}
          style={{
            flex: 1,
            padding: "0.5rem",
            backgroundColor: "#6f42c1",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Copy for Jira
        </button>
        <button
          onClick={() => {
            const content = buildGithubCopy();
            navigator.clipboard.writeText(content);
            showCopied("Copied");
          }}
          style={{
            flex: 1,
            padding: "0.5rem",
            backgroundColor: "#343a40",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Copy for GitHub Issues
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
      <div aria-live="polite" style={{ marginTop: "0.5rem", color: "#0f766e", minHeight: "1.25rem" }}>{copied ? copied : ""}</div>
      {artifact ? (
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            backgroundColor: "#f8fafc",
          }}
          aria-labelledby="qc-title"
        >
          <div id="qc-title" style={{ fontWeight: 600, color: "#0f172a", marginBottom: "0.5rem" }}>Quality Checklist</div>
          {(() => {
            const items = buildChecklist(artifact.artifactType, mdContent || "");
            const missing = items.filter((i) => !i.ok);
            return (
              <>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.25rem" }}>
                  {items.map((i) => (
                    <li
                      key={i.key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.25rem 0",
                      }}
                    >
                      <span
                        aria-label={i.ok ? "ok" : "missing"}
                        style={{
                          display: "inline-block",
                          minWidth: "8px",
                          minHeight: "8px",
                          borderRadius: "50%",
                          backgroundColor: i.ok ? "#16a34a" : "#dc2626",
                        }}
                      />
                      <span style={{ flex: 1, color: "#334155" }}>{i.label}</span>
                      <span style={{ color: i.ok ? "#16a34a" : "#dc2626", fontSize: "0.85rem" }}>{i.ok ? "ok" : "missing"}</span>
                    </li>
                  ))}
                </ul>
                {missing.length > 0 ? (
                  <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "flex-end" }}>
                    <a
                      href="?type=CriticReport"
                      style={{
                        padding: "0.4rem 0.6rem",
                        backgroundColor: "#0ea5e9",
                        color: "white",
                        borderRadius: "4px",
                        textDecoration: "none",
                      }}
                    >
                      Generate Critic Report
                    </a>
                  </div>
                ) : null}
              </>
            );
          })()}
        </div>
      ) : null}
    </div>
  );
};
