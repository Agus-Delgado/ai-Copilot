import type { LLMProvider } from "./types";

export type ByokConfig = {
  baseUrl: string;
  apiKey: string;
  model: string;
  timeoutMs?: number;
};

export class ByokProvider implements LLMProvider {
  cfg: ByokConfig;

  constructor(cfg: ByokConfig) {
    this.cfg = cfg;
  }

  async complete(prompt: string, signal?: AbortSignal): Promise<string> {
    const timeoutMs = this.cfg.timeoutMs ?? 30000;
    const url = `${this.cfg.baseUrl.replace(/\/$/, "")}/chat/completions`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const abortListener = () => controller.abort();
    if (signal) {
      if (signal.aborted) {
        clearTimeout(timer);
        throw new Error("BYOK request was aborted.");
      }
      signal.addEventListener("abort", abortListener);
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.cfg.apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.cfg.model,
          messages: [
            { role: "system", content: "Return JSON only. No markdown." },
            { role: "user", content: prompt },
          ],
          temperature: 0.2,
        }),
      });

      if (!res.ok) {
        let snippet = "";
        try {
          const body = await res.text();
          snippet = body.slice(0, 500);
        } catch {
          snippet = "";
        }

        const details = snippet || "No response body.";
        throw new Error(`BYOK request failed (${res.status}): ${details}`);
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error("BYOK response missing message content.");
      return content;
    } catch (err: unknown) {
      const maybeErr = err as { name?: string; message?: string };
      if (maybeErr?.name === "AbortError") {
        throw new Error(`BYOK request timed out after ${timeoutMs}ms.`);
      }

      const message = maybeErr?.message ?? String(err);
      if (message.includes("Failed to fetch")) {
        throw new Error(
          "BYOK request failed to reach the endpoint (possible CORS or network issue). If CORS blocks the call, use a local proxy such as http://localhost:PORT."
        );
      }

      throw err instanceof Error ? err : new Error(String(err));
    } finally {
      clearTimeout(timer);
      if (signal) {
        signal.removeEventListener("abort", abortListener);
      }
    }
  }
}
