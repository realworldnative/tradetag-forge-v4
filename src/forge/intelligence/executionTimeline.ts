import type { Signal } from "../../../shared/types";
import { generateTrustReport } from "./trustReport";
import { buildEvidenceReport } from "./evidenceReport";
import { buildAuthorityReport } from "./authorityReport";
import { buildActionPlan } from "./actionPlan";
import { compileSignal } from "../compiler/compileSignal";
import type { ExecutionReceipt } from "../runtime/ExecutionReceipt";

export type TimelineStatus =
  | "complete"
  | "blocked"
  | "pending"
  | "recorded";

export interface ExecutionTimelineStep {
  id: string;
  label: string;
  status: TimelineStatus;
  detail: string;
}

export interface ExecutionTimeline {
  signalId: string;
  steps: ExecutionTimelineStep[];
}

export function buildExecutionTimeline(
  signal: Signal,
  receipt: ExecutionReceipt | null = null
): ExecutionTimeline {
  const trustReport = generateTrustReport(signal);
  const evidenceReport = buildEvidenceReport(signal);
  const authorityReport = buildAuthorityReport(signal);
  const actionPlan = buildActionPlan(signal);
  const teo = compileSignal(signal).teo;

  const steps: ExecutionTimelineStep[] = [
    {
      id: "signal",
      label: "Signal received",
      status: "complete",
      detail: `Signal ${signal.id} entered TradeTag Intelligence.`,
    },

    {
      id: "trust",
      label: "Trust evaluated",
      status: "complete",
      detail: `Trust score ${trustReport.trustScore}. Decision: ${trustReport.decision}.`,
    },

    {
      id: "evidence",
      label: "Evidence evaluated",
      status:
        evidenceReport.evidence >= 50
          ? "complete"
          : "blocked",
      detail: `Evidence score ${evidenceReport.evidence}.`,
    },

    {
      id: "authority",
      label: "Authority evaluated",
      status: authorityReport.verified
        ? "complete"
        : "blocked",
      detail: authorityReport.explanation,
    },

    {
      id: "plan",
      label: "Action plan generated",
      status: actionPlan.canAct
        ? "complete"
        : "pending",
      detail: actionPlan.reason,
    },

    {
      id: "teo",
      label: "TEO compiled",
      status: "complete",
      detail: `TEO ${teo.id} entered state ${teo.state}.`,
    },

    {
      id: "execution",
      label: "Execution decision",
      status: receipt ? "recorded" : "pending",
      detail: receipt
        ? `${receipt.decision} recorded in receipt ${receipt.receiptId}.`
        : "Awaiting operator execution decision.",
    },
  ];

  return {
    signalId: signal.id,
    steps,
  };
}
