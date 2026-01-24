import type { ZodError } from "zod";

/**
 * Validation error from schema mismatch.
 * Includes structured details for error recovery.
 */
export class ValidationError extends Error {
  code = "VALIDATION_ERROR";
  issues: Array<{ path: string; message: string }> = [];
  rawSnippet: string = "";

  constructor(message: string, zodError?: ZodError, rawOutput?: string) {
    super(message);
    this.name = "ValidationError";

    if (zodError) {
      this.issues = zodError.issues.map((issue) => ({
        path: issue.path.join(".") || "(root)",
        message: issue.message,
      }));
    }

    if (rawOutput) {
      this.rawSnippet = rawOutput.slice(0, 2000);
    }
  }
}

/**
 * Provider error from network, API, or model issues.
 */
export class ProviderError extends Error {
  code = "PROVIDER_ERROR";
  status?: number;
  details?: string;

  constructor(message: string, status?: number, details?: string) {
    super(message);
    this.name = "ProviderError";
    this.status = status;
    this.details = details;
  }
}

/**
 * Type guard for ValidationError.
 */
export function isValidationError(err: unknown): err is ValidationError {
  return err instanceof ValidationError;
}

/**
 * Type guard for ProviderError.
 */
export function isProviderError(err: unknown): err is ProviderError {
  return err instanceof ProviderError;
}
