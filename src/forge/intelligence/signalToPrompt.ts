import type { Signal } from "../../../shared/types";
import { finalScore } from "../../lib/engine";
import { calculateTrustScore } from "./trustScore";
import { evaluateTrustPolicy } from "./trustPolicy";
export type PromptAction =
  | "build"
  | "merge"
  | "watch"
  | "reject";

export interface PromptRecommendation {
  action: PromptAction;
  title: string;
  explanation: string;
}

export function signalToPrompt(
  signal: Signal
): PromptRecommendation {
  const analysis = signal.analysis;

  if (!analysis) {
    return {
      action: "watch",
      title: "Human review recommended",
      explanation:
        "This signal does not yet contain enough analysis to support a build, merge, or rejection decision.",
    };
  }

const trust = calculateTrustScore(signal);
const policy = evaluateTrustPolicy(trust);
return {
  action: policy.decision,
  title: policy.title,
  explanation: policy.explanation,
};

if (trust.score >= 85) {
  return {
    action: "build",
    title: "Build candidate identified",
    explanation:
      `Trust Score ${trust.score}. This opportunity satisfies the current build threshold.`,
  };
}

if (trust.score >= 70) {
  return {
    action: "merge",
    title: "Merge candidate identified",
    explanation:
      `Trust Score ${trust.score}. This signal should be combined with related work before execution.`,
  };
}

return {
  action: "watch",
  title: "Continue monitoring",
  explanation:
    `Trust Score ${trust.score}. Additional evidence is recommended before action.`,
};
}
