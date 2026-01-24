import { ZodError } from "zod";
import { ArtifactSchema, type ArtifactType, type Artifact } from "../schemas/artifacts";
import { buildPrompt, buildRepairPrompt } from "../prompts";
import type { LLMProvider } from "./types";

const MAX_OUTPUT_LENGTH = 200000;
const OUTPUT_PREVIEW_LENGTH = 2000;

function extractFirstJsonObject(text: string): string {
  const start = text.indexOf("{");
  if (start === -1) throw new Error("No JSON object found in output.");

  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (isEscaped) {
      isEscaped = false;
      continue;
    }

    if (char === "\\") {
      isEscaped = true;
      continue;
    }

    if (char === "\"") {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") depth++;
    if (char === "}") depth--;

    if (depth === 0) {
      return text.slice(start, i + 1);
    }
  }

  throw new Error("Unbalanced JSON object in output.");
}

function parseJsonWithFallback(text: string): unknown {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const candidate = extractFirstJsonObject(trimmed);
    return JSON.parse(candidate);
  }
}

function zodErrorToString(err: ZodError): string {
  return err.issues.map(i => `${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
}

export async function generateArtifact(
  provider: LLMProvider,
  artifactType: ArtifactType,
  brief: string,
  signal?: AbortSignal
): Promise<{ artifact: Artifact; raw: string; prompt: string }> {
  let prompt = buildPrompt(artifactType, brief);
  let lastRaw = "";
  let lastErr = "";
  let lastPrompt = prompt;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      lastPrompt = prompt;
      const raw = await provider.complete(prompt, signal);
      lastRaw = raw;

      if (raw.length > MAX_OUTPUT_LENGTH) {
        throw new Error("Model output too large");
      }

      const parsed = parseJsonWithFallback(raw);
      const validated = ArtifactSchema.parse(parsed);

      if (validated.artifactType !== artifactType) {
        throw new Error(`artifactType mismatch: expected ${artifactType}, got ${validated.artifactType}`);
      }

      return { artifact: validated, raw, prompt: lastPrompt };
    } catch (e: unknown) {
      const errMsg =
        e instanceof ZodError
          ? zodErrorToString(e)
          : e instanceof Error
            ? e.message
            : String(e);
      lastErr = errMsg;
      if (attempt >= 2) break;
      prompt = buildRepairPrompt(artifactType, lastRaw, errMsg);
    }
  }

  const truncated =
    lastRaw.length > OUTPUT_PREVIEW_LENGTH
      ? `${lastRaw.slice(0, OUTPUT_PREVIEW_LENGTH)}...`
      : lastRaw;

  const error = new Error(
    `Failed to generate valid ${artifactType} after 2 repairs. Last error: ${lastErr}. Last output (truncated): ${truncated}`
  );
  (error as Error & { prompt?: string }).prompt = lastPrompt;
  throw error;
}
