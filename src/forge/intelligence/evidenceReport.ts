import type { Signal } from "../../../shared/types";
import { calculateTrustScore } from "./trustScore";

export interface EvidenceReport {
  confidence: number;
  evidence: number;
  authority: number;
  finalScore: number;
  explanation: string[];
}

export function buildEvidenceReport(
  signal: Signal
): EvidenceReport {
  const trust = calculateTrustScore(signal);

  const explanation: string[] = [];

  explanation.push(
    `Confidence contributed ${trust.confidence} points.`
  );

  explanation.push(
    `Evidence contributed ${trust.evidence} points.`
  );

  explanation.push(
    `Authority contributed ${trust.authority} points.`
  );

  explanation.push(
    `Final Trust Score: ${trust.score}.`
  );

  return {
    confidence: trust.confidence,
    evidence: trust.evidence,
    authority: trust.authority,
    finalScore: trust.score,
    explanation,
  };
}
