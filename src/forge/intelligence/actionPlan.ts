import type { Signal } from "../../../shared/types";
import { generateTrustReport } from "./trustReport";
import { buildAuthorityReport } from "./authorityReport";
import type { AuthorityClaim } from "../core/Authority";

export type ActionPlanStatus =
  | "ready"
  | "blocked"
  | "review";

export interface ActionPlanStep {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
}

export interface ActionPlan {
  status: ActionPlanStatus;
  canAct: boolean;
  reason: string;
  steps: ActionPlanStep[];
  projectedTrustScore: number;
}

export function buildActionPlan(
  signal: Signal,
  authorityClaim?: AuthorityClaim
): ActionPlan {
  const trustReport = generateTrustReport(signal);
const authorityReport = buildAuthorityReport(
  signal,
  authorityClaim
);

  const steps: ActionPlanStep[] = [
    {
      id: "authority-proof",
      label: "Attach a verified portable authority claim",
      completed: authorityReport.verified,
      required: true,
    },
    {
      id: "supporting-evidence",
      label: "Attach sufficient supporting evidence",
      completed: trustReport.evidence >= 50,
      required: true,
    },
    {
      id: "signal-corroboration",
      label: "Add independent signal corroboration",
      completed: trustReport.confidence >= 50,
      required: false,
    },
  ];

  const requiredStepsComplete = steps
    .filter((step) => step.required)
    .every((step) => step.completed);

const canAct =
  requiredStepsComplete &&
  trustReport.decision === "build";
  const projectedTrustScore = Math.min(
    100,
    trustReport.trustScore +
      steps
        .filter((step) => !step.completed)
        .reduce(
          (total, step) =>
            total + (step.required ? 10 : 5),
          0
        )
  );

  return {
    status: canAct
      ? "ready"
      : trustReport.decision === "reject"
        ? "blocked"
        : "review",
    canAct,
    reason: canAct
      ? "The current authority and evidence requirements are satisfied."
      : authorityReport.verified
        ? "Additional evidence or review is required before execution."
        : "Portable authority must be verified before execution.",
    steps,
    projectedTrustScore,
  };
}
