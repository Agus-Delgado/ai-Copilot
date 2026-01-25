/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import { BRIEF_TEMPLATES } from "../src/app/briefTemplates";
import { ArtifactTypeEnum } from "../src/lib/schemas/artifacts";

describe("quick brief templates", () => {
  it("all templates have valid artifact types and non-empty content", () => {
    const validTypes = new Set(ArtifactTypeEnum.options);
    BRIEF_TEMPLATES.forEach((tpl) => {
      expect(validTypes.has(tpl.artifactType)).toBe(true);
      expect(typeof tpl.content).toBe("string");
      expect(tpl.content.trim().length).toBeGreaterThan(20);
    });
  });
});
