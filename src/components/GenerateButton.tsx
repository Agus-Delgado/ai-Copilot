import React from "react";

interface Props {
  loading: boolean;
  onClick: () => void;
}

export const GenerateButton: React.FC<Props> = ({ loading, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        padding: "0.75rem 1rem",
        fontSize: "1rem",
        fontWeight: "bold",
        borderRadius: "4px",
        border: "none",
        backgroundColor: loading ? "#ccc" : "#0066cc",
        color: "white",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#0052a3")}
      onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#0066cc")}
    >
      {loading ? "Generating..." : "Generate Artifact"}
    </button>
  );
};
