import type { TrustScore } from "./trustScore";

export type TrustDecision =
  | "build"
  | "merge"
  | "watch"
  | "reject";

export interface TrustPolicyResult {
  decision: TrustDecision;
  title: string;
  explanation: string;
}

export function evaluateTrustPolicy(
  trust: TrustScore
): TrustPolicyResult {
  if (trust.authority < 20) {
    return {
      decision: "watch",
      title: "Authority verification required",
      explanation:
        "Evidence exists, but the signal lacks sufficient authority to recommend an automated action.",
    };
  }

  if (trust.score >= 85) {
    return {
      decision: "build",
      title: "Build candidate identified",
      explanation:
        `Trust Score ${trust.score}. This opportunity satisfies the current build threshold.`,
    };
  }

  if (trust.score >= 70) {
    return {
      decision: "merge",
      title: "Merge candidate identified",
      explanation:
        `Trust Score ${trust.score}. This signal should be combined with related work before execution.`,
    };
  }

  return {
    decision: "watch",
    title: "Continue monitoring",
    explanation:
      `Trust Score ${trust.score}. Additional evidence is recommended before action.`,
  };
}
