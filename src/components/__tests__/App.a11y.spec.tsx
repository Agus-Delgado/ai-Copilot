import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "../../app/App";

describe("A11y basics", () => {
  it("renders a single main landmark", () => {
    render(<App />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("artifact selector has accessible label", () => {
    render(<App />);
    expect(screen.getByLabelText(/Artifact Type/i)).toBeInTheDocument();
  });
});
