import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OutputViewer } from "../../components/OutputViewer";

describe("OutputViewer empty state", () => {
  it("renders guidance message when no artifact", () => {
    render(<OutputViewer artifact={null} error={null} loading={false} tab="markdown" onTabChange={() => {}} />);
    expect(screen.getByText("Generate an artifact to see the output here.")).toBeInTheDocument();
    expect(screen.getByText(/Demo Mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick Briefs/i)).toBeInTheDocument();
  });
});
