import { describe, it, expect } from "vitest";
import { encodeUrlState, buildShareUrl, decodeUrlState } from "../src/lib/urlState";
import type { UrlState } from "../src/lib/urlState";

describe("Share links security", () => {
  it("encodeUrlState excludes secret-like fields", () => {
    const insecureState = {
      artifactType: "PRD",
      brief: "hello",
      tab: "markdown",
      demo: true,
      apiKey: "sk-test-123",
      authorization: "Bearer sk-test-123",
      headers: JSON.stringify({ Authorization: "Bearer sk-test-123" }),
    } as unknown as UrlState;

    const { queryString } = encodeUrlState(insecureState);
    const lower = queryString.toLowerCase();
    expect(lower).not.toContain("apikey");
    expect(lower).not.toContain("authorization");
    expect(lower).not.toContain("bearer");
    expect(lower).not.toContain("sk-test-123");
    expect(queryString).toContain("artifactType=PRD");
    expect(queryString).toContain("brief=hello");
    expect(queryString).toContain("tab=markdown");
    expect(queryString).toContain("demo=1");
  });

  it("buildShareUrl excludes secret-like fields", () => {
    const insecureState = {
      artifactType: "Backlog",
      brief: "hello world",
      apiKey: "sk-test-123",
      authorization: "Bearer sk-test-123",
    } as unknown as UrlState;

    const { url } = buildShareUrl(insecureState);
    const lower = url.toLowerCase();
    expect(lower).not.toContain("apikey");
    expect(lower).not.toContain("authorization");
    expect(lower).not.toContain("bearer");
    expect(lower).not.toContain("sk-test-123");
    expect(url).toContain("artifactType=Backlog");
    expect(url).toContain("brief=hello+world");
  });

  it("decodeUrlState ignores secret-like params in URL", () => {
    const search =
      "?artifactType=QAPack&brief=test&apiKey=sk-test-123&authorization=Bearer+sk-test-123&headers=%7B%22Authorization%22%3A%22Bearer+sk-test-123%22%7D";
    const decoded = decodeUrlState(search);
    expect(decoded.artifactType).toBe("QAPack");
    expect(decoded.brief).toBe("test");
    // Ensure only allowed keys are present
    expect(Object.keys(decoded).sort()).toEqual(["artifactType", "brief"]);
  });
});
