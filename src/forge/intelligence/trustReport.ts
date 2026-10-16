import type { Signal } from "../../../shared/types";
import { calculateTrustScore } from "./trustScore";
import { evaluateTrustPolicy } from "./trustPolicy";

export type TrustRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "unresolved";

export interface TrustReport {
  signalId: string;
  generatedAt: string;

  trustScore: number;
  confidence: number;
  evidence: number;
  authority: number;

  riskLevel: TrustRiskLevel;
  authorityStatus: "verified" | "insufficient";

  decision: "build" | "merge" | "watch" | "reject";
  title: string;
  humanExplanation: string;
  machineExplanation: string;

  evidenceNeeded: string[];
  suggestedNextActions: string[];
}

export function generateTrustReport(
  signal: Signal
): TrustReport {
  const trust = calculateTrustScore(signal);
  const policy = evaluateTrustPolicy(trust);

  const evidenceNeeded: string[] = [];

  if (trust.authority < 20) {
    evidenceNeeded.push(
      "Verified authority claim"
    );
  }

  if (trust.evidence < 50) {
    evidenceNeeded.push(
      "Additional supporting evidence"
    );
  }

  if (trust.confidence < 50) {
    evidenceNeeded.push(
      "Independent signal corroboration"
    );
  }

  const riskLevel: TrustRiskLevel =
    trust.authority < 20
      ? "unresolved"
      : trust.score >= 85
        ? "low"
        : trust.score >= 70
          ? "medium"
          : "high";

  const suggestedNextActions =
    policy.decision === "build"
      ? ["Create a Trust Object candidate"]
      : policy.decision === "merge"
        ? ["Find related signals", "Prepare a merged evidence set"]
        : policy.decision === "reject"
          ? ["Archive the signal with its reasoning"]
          : ["Collect missing evidence", "Request human review"];

  return {
    signalId: signal.id,
    generatedAt: new Date().toISOString(),

    trustScore: trust.score,
    confidence: trust.confidence,
    evidence: trust.evidence,
    authority: trust.authority,

    riskLevel,
    authorityStatus:
      trust.authority >= 20
        ? "verified"
        : "insufficient",

    decision: policy.decision,
    title: policy.title,
    humanExplanation: policy.explanation,
    machineExplanation:
      `Decision=${policy.decision}; ` +
      `trust=${trust.score}; ` +
      `confidence=${trust.confidence}; ` +
      `evidence=${trust.evidence}; ` +
      `authority=${trust.authority}.`,

    evidenceNeeded,
    suggestedNextActions,
  };
}
