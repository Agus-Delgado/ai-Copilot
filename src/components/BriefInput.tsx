import React, { useState } from "react";

const DEMO_BRIEFS = [
  {
    title: "SaaS RBAC",
    content:
      "We need to implement role-based access control for our B2B SaaS platform. Admins should be able to define custom roles with specific permissions. We also need audit logs to track sensitive actions like role changes and billing operations.",
  },
  {
    title: "Mobile Feedback App",
    content:
      "Build a mobile app where users can submit feedback and ideas. Each submission should have a title, description, category, and user can attach images. Submissions are reviewed by moderators and marked as approved/rejected. Analytics dashboard to show trending feedback.",
  },
  {
    title: "Internal Reporting Tool",
    content:
      "Internal tool for generating weekly business reports. Executives should be able to select metrics (revenue, users, churn, etc), date range, and export as PDF. Reports should auto-generate on schedule and email to stakeholders.",
  },
];

interface Props {
  onLoad: (content: string) => void;
  currentBrief: string;
  disabled?: boolean;
}

export const BriefInput: React.FC<Props> = ({ onLoad, currentBrief, disabled = false }) => {
  const [brief, setBrief] = useState(currentBrief);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBrief(e.target.value);
    onLoad(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
          Quick Load Demo Brief
        </label>
        <select
          defaultValue=""
          onChange={(e) => {
            const demo = DEMO_BRIEFS.find((d) => d.title === e.target.value);
            if (demo) {
              setBrief(demo.content);
              onLoad(demo.content);
            }
          }}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "0.5rem",
            fontSize: "0.9rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">-- Select a demo brief --</option>
          {DEMO_BRIEFS.map((d) => (
            <option key={d.title} value={d.title}>
              {d.title}
            </option>
          ))}
        </select>
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
