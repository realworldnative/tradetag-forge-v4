import type { Signal } from "../../../shared/types";
import {
  isAuthorityActive,
  type AuthorityClaim,
} from "../core/Authority";import { finalScore } from "../../lib/engine";
export interface TrustScore {
  score: number;
  confidence: number;
  evidence: number;
  authority: number;
}

export function calculateTrustScore(
  signal: Signal,
  authorityClaim?: AuthorityClaim
): TrustScore {
    const analysis = signal.analysis;

  if (!analysis) {
    return {
      score: 0,
      confidence: 0,
      evidence: 0,
      authority: 0,
    };
  }

const confidence = Math.round(
  (
    analysis.scores.strategicFit +
    analysis.scores.evidenceStrength
  ) / 2
);

const evidence = analysis.scores.evidenceStrength;

// Authority is never inferred from intelligence.
// It must come from a verified, currently active AuthorityClaim.
const authority =
  authorityClaim && isAuthorityActive(authorityClaim) ? 100 : 0;
const score = finalScore(
  analysis.scores,
  analysis.penalties
).final;
return {
  score,
  confidence,
  evidence,
  authority,
};
}
