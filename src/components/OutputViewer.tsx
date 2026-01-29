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
  onTryDemo?: () => void;
  onOpenSettings?: () => void;
  onOpenDebug?: () => void;
}

export const OutputViewer: React.FC<Props> = ({ artifact, error, loading, tab, onTabChange, onTryDemo, onOpenSettings, onOpenDebug }) => {
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
      <div className="ov-loading">
        <div className="ov-loading-bar" />
        <div className="ov-loading-block" />
        <div className="ov-loading-text">Generating…</div>
      </div>
    );
  }

  if (error) {
    const hasApiKeyError = error.toLowerCase().includes("api key");
    const hasJsonError = error.toLowerCase().includes("json");

    return (
      <div className="ov-error">
        <div className="ov-error-header">
          <span className="ov-error-icon" aria-hidden="true">⚠️</span>
          <div className="ov-error-body">
            <strong className="ov-error-title">Error</strong>
            <div className="ov-error-message">{error}</div>
          </div>
        </div>
        {(hasApiKeyError || hasJsonError || onOpenDebug) && (
          <div className="ov-error-actions">
            {hasApiKeyError && onOpenSettings && (
              <button onClick={onOpenSettings} className="button button--danger-outline">
                🛠️ Open Settings
              </button>
            )}
            {hasJsonError && onOpenDebug && (
              <button onClick={onOpenDebug} className="button button--danger-outline">
                🔍 Open Debug
              </button>
            )}
            {!hasApiKeyError && !hasJsonError && onOpenDebug && (
              <button onClick={onOpenDebug} className="button button--danger-outline">
                🔍 View Debug Info
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="ov-empty">
        <div className="ov-empty-icon" aria-hidden="true">📄</div>
        <h3 className="ov-empty-title">No artifact generated yet</h3>
        <p className="ov-empty-subtitle">Get started by generating your first artifact:</p>
        <ul className="ov-empty-list">
          <li>✨ Click <strong>Try Demo</strong> for a quick start</li>
          <li>📋 Select a <strong>Quick Brief</strong> sample</li>
          <li>✏️ Write your own custom brief</li>
        </ul>
        {onTryDemo && (
          <button onClick={onTryDemo} className="button button--primary ov-empty-cta">
            ✨ Try Demo Now
          </button>
        )}
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
          className="ov-no-output"
          role="tabpanel"
          id={activePanelId}
          aria-labelledby={activeTabId}
        >
          No output available
        </div>
      ) : (
        <div
          className="ov-output-wrap"
          role="tabpanel"
          id={activePanelId}
          aria-labelledby={activeTabId}
        >
          <pre className={`ov-output ${tab === "json" ? "ov-output--json" : "ov-output--markdown"}`}>
            {currentContent}
          </pre>
        </div>
      )}

      <div className="ov-actions">
        <button
          onClick={() => {
            const content = tab === "json" ? jsonContent : mdContent;
            navigator.clipboard.writeText(content);
            showCopied("Copied");
          }}
          className="button button--secondary ov-action"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={() => {
            const content = buildJiraCopy();
            navigator.clipboard.writeText(content);
            showCopied("Copied");
          }}
          className="button button--secondary ov-action"
        >
          Copy for Jira
        </button>
        <button
          onClick={() => {
            const content = buildGithubCopy();
            navigator.clipboard.writeText(content);
            showCopied("Copied");
          }}
          className="button button--secondary ov-action"
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
          className="button button--primary ov-action"
        >
          Download
        </button>
      </div>
      <div aria-live="polite" className="ov-copied">{copied ? copied : ""}</div>
      {artifact ? (
        <div
          className="ov-quality"
          aria-labelledby="qc-title"
        >
          <div id="qc-title" className="ov-quality-title">Quality Checklist</div>
          {(() => {
            const items = buildChecklist(artifact.artifactType, mdContent || "");
            const missing = items.filter((i) => !i.ok);
            return (
              <>
                <ul className="ov-quality-list">
                  {items.map((i) => (
                    <li
                      key={i.key}
                      className="ov-quality-item"
                    >
                      <span
                        aria-label={i.ok ? "ok" : "missing"}
                        className={`ov-quality-dot ${i.ok ? "ok" : "missing"}`}
                      />
                      <span className="ov-quality-label">{i.label}</span>
                      <span className={`ov-quality-status ${i.ok ? "ok" : "missing"}`}>{i.ok ? "ok" : "missing"}</span>
                    </li>
                  ))}
                </ul>
                {missing.length > 0 ? (
                  <div className="ov-quality-actions">
                    <a
                      href="?type=CriticReport"
                      className="button button--primary ov-quality-link"
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
