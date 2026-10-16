import type { Signal } from "../../../shared/types";
import { calculateTrustScore } from "./trustScore";
import type { AuthorityClaim } from "../core/Authority";

export interface AuthorityReport {
  verified: boolean;
  authority: number;
  status: string;
  explanation: string;
}

export function buildAuthorityReport(
  signal: Signal,
  authorityClaim?: AuthorityClaim
): AuthorityReport {
  const trust = calculateTrustScore(signal, authorityClaim);

  if (trust.authority >= 80) {
    return {
      verified: true,
      authority: trust.authority,
      status: "Verified",
      explanation:
        "Delegated authority satisfies the threshold for autonomous execution."
    };
  }

  if (trust.authority >= 40) {
    return {
      verified: false,
      authority: trust.authority,
      status: "Partial",
      explanation:
        "Authority exists but requires additional verification."
    };
  }

  return {
    verified: false,
    authority: trust.authority,
    status: "Missing",
    explanation:
      "No portable authority proof has been attached."
  };
}
