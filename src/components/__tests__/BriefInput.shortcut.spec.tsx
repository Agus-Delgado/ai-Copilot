import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BriefInput } from "../BriefInput";

describe("BriefInput keyboard shortcut", () => {
  it("calls onShortcut on Ctrl+Enter when not disabled", () => {
    const onShortcut = vi.fn();
    render(<BriefInput onLoad={() => {}} currentBrief="" disabled={false} onShortcut={onShortcut} />);
    const textarea = screen.getByPlaceholderText(/Paste your unstructured requirements/i);
    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
    expect(onShortcut).toHaveBeenCalledTimes(1);
  });

  it("calls onShortcut on Cmd+Enter when not disabled", () => {
    const onShortcut = vi.fn();
    render(<BriefInput onLoad={() => {}} currentBrief="" disabled={false} onShortcut={onShortcut} />);
    const textarea = screen.getByPlaceholderText(/Paste your unstructured requirements/i);
    fireEvent.keyDown(textarea, { key: "Enter", metaKey: true });
    expect(onShortcut).toHaveBeenCalledTimes(1);
  });

  it("does not call onShortcut when disabled", () => {
    const onShortcut = vi.fn();
    render(<BriefInput onLoad={() => {}} currentBrief="" disabled={true} onShortcut={onShortcut} />);
    const textarea = screen.getByPlaceholderText(/Paste your unstructured requirements/i);
    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true });
    expect(onShortcut).not.toHaveBeenCalled();
  });
});
