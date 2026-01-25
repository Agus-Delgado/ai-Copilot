import React from "react";
import { ArtifactTypeEnum, type ArtifactType } from "../lib/schemas/artifacts";

interface Props {
  value: ArtifactType;
  onChange: (type: ArtifactType) => void;
  disabled?: boolean;
}

export const ArtifactSelector: React.FC<Props> = ({ value, onChange, disabled = false }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="artifactType" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
        Artifact Type
      </label>
      <select
        id="artifactType"
        value={value}
        onChange={(e) => onChange(e.target.value as ArtifactType)}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        {ArtifactTypeEnum.options.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};
