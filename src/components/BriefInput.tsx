import React, { useEffect, useState } from "react";
import type { ArtifactType } from "../lib/schemas/artifacts";
import { BRIEF_TEMPLATES } from "../app/briefTemplates";

interface Props {
  onLoad: (content: string) => void;
  currentBrief: string;
  disabled?: boolean;
  onTemplateSelect?: (brief: string, artifactType: ArtifactType) => void;
}

export const BriefInput: React.FC<Props> = ({ onLoad, currentBrief, disabled = false, onTemplateSelect }) => {
  const [brief, setBrief] = useState(currentBrief);

  useEffect(() => {
    setBrief(currentBrief);
  }, [currentBrief]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBrief(e.target.value);
    onLoad(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ display: "block", fontWeight: "bold" }}>Quick Briefs</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {BRIEF_TEMPLATES.map((template) => (
            <button
              key={template.title}
              type="button"
              onClick={() => {
                setBrief(template.content);
                onLoad(template.content);
                onTemplateSelect?.(template.content, template.artifactType);
              }}
              disabled={disabled}
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#f8fafc",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              {template.title}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
          Your Brief (unstructured)
        </label>
        <textarea
          value={brief}
          onChange={handleTextChange}
          placeholder="Paste your unstructured requirements, notes, or brief here..."
          disabled={disabled}
          style={{
            width: "100%",
            minHeight: "300px",
            padding: "0.75rem",
            fontSize: "0.9rem",
            fontFamily: "monospace",
            borderRadius: "4px",
            border: "1px solid #ccc",
            resize: "vertical",
          }}
        />
      </div>
    </div>
  );
};
