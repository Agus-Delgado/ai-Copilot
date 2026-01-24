import React, { useMemo, useState } from "react";
import type { HistoryEntry } from "../lib/store";

interface Props {
  history: HistoryEntry[];
  persistOutputs: boolean;
  onTogglePersistOutputs: (value: boolean) => void;
  onView: (entry: HistoryEntry) => void;
  onRerun: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const HistoryPanel: React.FC<Props> = ({
  history,
  persistOutputs,
  onTogglePersistOutputs,
  onView,
  onRerun,
  onDelete,
  onClear,
}) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return history;
    return history.filter((item) =>
      [item.brief, item.artifactType].some((field) => field.toLowerCase().includes(term)),
    );
  }, [history, query]);

  return (
    <section
      style={{
        marginTop: "1rem",
        padding: "1rem",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-8)",
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <h3 style={{ margin: 0, fontSize: "var(--text-md)" }}>History</h3>
        <label style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "var(--text-sm)" }}>
          <input
            type="checkbox"
            checked={persistOutputs}
            onChange={(e) => onTogglePersistOutputs(e.target.checked)}
            style={{ accentColor: "var(--color-primary)" }}
          />
          Store outputs
        </label>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <input
          type="search"
          placeholder="Search by type or text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-6)",
            border: "1px solid var(--color-border)",
            fontSize: "var(--text-sm)",
          }}
        />
        <button
          type="button"
          onClick={onClear}
          disabled={!history.length}
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-6)",
            border: "1px solid var(--color-border)",
            background: "#fff1f0",
            color: "var(--color-danger)",
            cursor: history.length ? "pointer" : "not-allowed",
            fontWeight: 600,
          }}
        >
          Clear all
        </button>
      </div>

      {filtered.length === 0 ? (
        <div style={{ color: "var(--color-muted)", fontSize: "var(--text-sm)" }}>No history yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((item) => {
            const date = new Date(item.createdAt).toLocaleString();
            const shortBrief = item.brief.length > 140 ? `${item.brief.slice(0, 140)}…` : item.brief;
            return (
              <div
                key={item.id}
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-8)",
                  padding: "0.75rem",
                  background: "var(--color-page)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", marginBottom: "0.35rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <strong style={{ fontSize: "var(--text-sm)" }}>{item.artifactType}</strong>
                    <span style={{ color: "var(--color-muted)", fontSize: "var(--text-xs)" }}>{date}</span>
                    <span style={{ color: "var(--color-muted)", fontSize: "var(--text-xs)" }}>
                      {item.providerType.toUpperCase()} {item.demoMode ? "· Demo" : ""}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => onView(item)}
                      style={{
                        padding: "0.4rem 0.75rem",
                        borderRadius: "var(--radius-6)",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-surface)",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onRerun(item)}
                      style={{
                        padding: "0.4rem 0.75rem",
                        borderRadius: "var(--radius-6)",
                        border: "1px solid var(--color-primary)",
                        background: "var(--color-primary-soft)",
                        color: "var(--color-primary-strong)",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Re-run
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      style={{
                        padding: "0.4rem 0.75rem",
                        borderRadius: "var(--radius-6)",
                        border: "1px solid var(--color-border)",
                        background: "#fff1f0",
                        color: "var(--color-danger)",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ color: "var(--color-text)", fontSize: "var(--text-sm)", lineHeight: 1.4 }}>{shortBrief}</div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
