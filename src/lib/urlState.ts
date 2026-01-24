import type { ArtifactType } from "./schemas/artifacts";

export interface UrlState {
  artifactType?: ArtifactType;
  brief?: string;
  tab?: "json" | "markdown";
  demo?: boolean;
}

const MAX_BRIEF_LENGTH = 2000; // After encoding, keep safe URL length

const VALID_ARTIFACT_TYPES: ArtifactType[] = ["PRD", "Backlog", "RiskRegister", "QAPack", "CriticReport"];
const VALID_TABS = ["json", "markdown"];

/**
 * Encode app state into URL query parameters.
 * Returns a query string (without leading ?).
 * If brief is too long, it is excluded and caller should show a warning.
 */
export function encodeUrlState(state: UrlState): { queryString: string; briefExcluded: boolean } {
  const params = new URLSearchParams();

  if (state.artifactType && VALID_ARTIFACT_TYPES.includes(state.artifactType)) {
    params.set("artifactType", state.artifactType);
  }

  let briefExcluded = false;
  if (state.brief && state.brief.trim()) {
    // Check if encoding the brief would exceed safe URL length
    const testParams = new URLSearchParams(params);
    testParams.set("brief", state.brief);
    if (testParams.toString().length > MAX_BRIEF_LENGTH) {
      briefExcluded = true;
    } else {
      params.set("brief", state.brief);
    }
  }

  if (state.tab && VALID_TABS.includes(state.tab)) {
    params.set("tab", state.tab);
  }

  if (state.demo) {
    params.set("demo", "1");
  }

  return { queryString: params.toString(), briefExcluded };
}

/**
 * Decode URL search params into app state.
 * Validates all inputs; returns only valid fields.
 * Invalid/malformed params are silently ignored.
 */
export function decodeUrlState(locationSearch: string): UrlState {
  const state: UrlState = {};

  try {
    const params = new URLSearchParams(locationSearch);

    const candidateType = params.get("artifactType");
    if (candidateType && VALID_ARTIFACT_TYPES.includes(candidateType as ArtifactType)) {
      state.artifactType = candidateType as ArtifactType;
    }

    const candidateBrief = params.get("brief");
    if (candidateBrief && typeof candidateBrief === "string" && candidateBrief.trim()) {
      state.brief = candidateBrief;
    }

    const candidateTab = params.get("tab");
    if (candidateTab && VALID_TABS.includes(candidateTab)) {
      state.tab = candidateTab as "json" | "markdown";
    }

    const candidateDemo = params.get("demo");
    if (candidateDemo === "1") {
      state.demo = true;
    }
  } catch {
    // Silently ignore parsing errors; return whatever valid state we accumulated
  }

  return state;
}

/**
 * Build a full shareable URL from app state.
 */
export function buildShareUrl(state: UrlState): { url: string; briefExcluded: boolean } {
  const { queryString, briefExcluded } = encodeUrlState(state);
  const url = `${window.location.origin}${window.location.pathname}?${queryString}`;
  return { url, briefExcluded };
}
