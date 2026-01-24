import { describe, it, expect, beforeEach } from "vitest";
import { useStore } from "../src/lib/store";

const resetStore = () => {
  localStorage.clear();
  useStore.setState({
    providerConfig: useStore.getState().providerConfig,
    demoMode: false,
    persistOutputs: true,
    history: [],
  });
};

describe("history persistence", () => {
  beforeEach(() => {
    resetStore();
  });

  it("caps history at 20 items and keeps newest", () => {
    const { addHistoryEntry } = useStore.getState();
    for (let i = 0; i < 22; i++) {
      addHistoryEntry({
        artifactType: "PRD",
        brief: `brief-${i}`,
        providerType: "mock",
        demoMode: true,
        artifact: null,
        raw: null,
      });
    }
    const after = useStore.getState().history;
    expect(after.length).toBe(20);
    expect(after[0].brief).toBe("brief-21");
    expect(after[after.length - 1].brief).toBe("brief-2");
  });

  it("omits artifact/raw when persistOutputs is false", () => {
    const { setPersistOutputs, addHistoryEntry } = useStore.getState();
    setPersistOutputs(false);
    addHistoryEntry({
      artifactType: "Backlog",
      brief: "keep inputs only",
      providerType: "mock",
      demoMode: false,
      artifact: { artifactType: "Backlog", productArea: "x", epics: [] },
      raw: "raw-json",
    });

    const entry = useStore.getState().history[0];
    expect(entry.artifact).toBeNull();
    expect(entry.raw).toBeNull();
  });
});
