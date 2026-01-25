import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "../../app/App";

describe("Quick Briefs selector", () => {
  it("loads Delivery Ops brief into textarea", () => {
    render(<App />);
    const select = screen.getByLabelText(/Quick Briefs/i);
    fireEvent.change(select, { target: { value: "delivery-ops" } });
    const textarea = screen.getByPlaceholderText(/Paste your unstructured requirements/i) as HTMLTextAreaElement;
    expect(textarea.value).toMatch(/Delivery Ops Quick Brief|Automate dispatch/);
  });

  it("reset empties the textarea when selecting Custom", () => {
    render(<App />);
    const select = screen.getByLabelText(/Quick Briefs/i);
    fireEvent.change(select, { target: { value: "delivery-ops" } });
    fireEvent.change(select, { target: { value: "custom" } });
    const textarea = screen.getByPlaceholderText(/Paste your unstructured requirements/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe("");
  });
});
