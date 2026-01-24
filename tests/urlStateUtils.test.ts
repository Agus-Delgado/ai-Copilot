import { describe, it, expect } from "vitest";
import { encodeUrlState, decodeUrlState, buildShareUrl } from "../src/lib/urlState";
import type { UrlState } from "../src/lib/urlState";

describe("urlState utilities", () => {
  describe("encodeUrlState", () => {
    it("encodes valid artifact type and brief", () => {
      const state: UrlState = { artifactType: "PRD", brief: "hello world" };
      const { queryString, briefExcluded } = encodeUrlState(state);
      expect(queryString).toContain("artifactType=PRD");
      expect(queryString).toContain("brief=hello");
      expect(briefExcluded).toBe(false);
    });

    it("includes tab if valid", () => {
      const state: UrlState = { tab: "markdown" };
      const { queryString } = encodeUrlState(state);
      expect(queryString).toContain("tab=markdown");
    });

    it("includes demo flag", () => {
      const state: UrlState = { demo: true };
      const { queryString } = encodeUrlState(state);
      expect(queryString).toContain("demo=1");
    });

    it("excludes brief if too long", () => {
      const longBrief = "a".repeat(3000);
      const state: UrlState = { brief: longBrief };
      const { queryString, briefExcluded } = encodeUrlState(state);
      expect(briefExcluded).toBe(true);
      expect(queryString).not.toContain("brief=");
    });

    it("ignores invalid artifact types", () => {
      const state: UrlState = { artifactType: "InvalidType" as never };
      const { queryString } = encodeUrlState(state);
      expect(queryString).not.toContain("artifactType");
    });

    it("ignores invalid tabs", () => {
      const state: UrlState = { tab: "invalid" as never };
      const { queryString } = encodeUrlState(state);
      expect(queryString).not.toContain("tab");
    });
  });

  describe("decodeUrlState", () => {
    it("decodes valid parameters", () => {
      const search = "?artifactType=Backlog&brief=test&tab=json&demo=1";
      const state = decodeUrlState(search);
      expect(state.artifactType).toBe("Backlog");
      expect(state.brief).toBe("test");
      expect(state.tab).toBe("json");
      expect(state.demo).toBe(true);
    });

    it("ignores invalid artifact types", () => {
      const search = "?artifactType=InvalidType";
      const state = decodeUrlState(search);
      expect(state.artifactType).toBeUndefined();
    });

    it("ignores invalid tabs", () => {
      const search = "?tab=invalid";
      const state = decodeUrlState(search);
      expect(state.tab).toBeUndefined();
    });

    it("returns empty state for malformed input", () => {
      const search = "?%ZZ%invalid";
      const state = decodeUrlState(search);
      expect(Object.keys(state).length).toBe(0);
    });

    it("ignores empty brief", () => {
      const search = "?brief=";
      const state = decodeUrlState(search);
      expect(state.brief).toBeUndefined();
    });

    it("demo flag only set if demo=1", () => {
      const search1 = "?demo=1";
      const state1 = decodeUrlState(search1);
      expect(state1.demo).toBe(true);

      const search2 = "?demo=0";
      const state2 = decodeUrlState(search2);
      expect(state2.demo).toBeUndefined();

      const search3 = "?demo=true";
      const state3 = decodeUrlState(search3);
      expect(state3.demo).toBeUndefined();
    });
  });

  describe("roundtrip encode/decode", () => {
    it("roundtrips valid state", () => {
      const original: UrlState = {
        artifactType: "RiskRegister",
        brief: "test brief",
        tab: "markdown",
        demo: true,
      };
      const { queryString } = encodeUrlState(original);
      const decoded = decodeUrlState(`?${queryString}`);
      expect(decoded).toEqual(original);
    });
  });

  describe("buildShareUrl", () => {
    it("builds a full URL with query string", () => {
      const state: UrlState = { artifactType: "PRD", brief: "test" };
      const { url } = buildShareUrl(state);
      expect(url).toContain(window.location.origin);
      expect(url).toContain("artifactType=PRD");
      expect(url).toContain("brief=test");
    });

    it("indicates when brief is excluded", () => {
      const longBrief = "a".repeat(3000);
      const state: UrlState = { brief: longBrief };
      const { briefExcluded } = buildShareUrl(state);
      expect(briefExcluded).toBe(true);
    });
  });
});
