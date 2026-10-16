import type { Signal } from "../../../shared/types";
import { generateTrustReport } from "../intelligence/trustReport";
import { buildEvidenceReport } from "../intelligence/evidenceReport";
import { buildAuthorityReport } from "../intelligence/authorityReport";
import { buildActionPlan } from "../intelligence/actionPlan";
import {
  createExecutionEnvelope,
  type ExecutionEnvelope,
} from "./signalToChain";
import type { AuthorityClaim } from "../core/Authority";
import { isAuthorityActive } from "../core/Authority";


export interface ExecutionAuthorityContext {
  principalId?: string;
  agentId?: string;
  identityCredentialRef?: string;
  delegationCredentialRef?: string;
  claim?: AuthorityClaim;
}
export function buildExecutionEnvelope(
  signal: Signal,
  authorityContext?: ExecutionAuthorityContext
): ExecutionEnvelope {
  const trustReport = generateTrustReport(signal);
  const evidenceReport = buildEvidenceReport(signal);
  const authorityReport = buildAuthorityReport(
    signal,
    authorityContext?.claim
);
  const actionPlan = buildActionPlan(signal, authorityContext?.claim);

  const satisfiedEvidence: string[] = [];
  const missingEvidence: string[] = [];

  if (evidenceReport.evidence >= 50) {
    satisfiedEvidence.push("Supporting evidence threshold");
  } else {
    missingEvidence.push("Supporting evidence threshold");
  }

  if (evidenceReport.confidence >= 50) {
    satisfiedEvidence.push("Signal corroboration threshold");
  } else {
    missingEvidence.push("Signal corroboration threshold");
  }

const executionAuthorityVerified =
  authorityContext?.claim !== undefined &&
  authorityContext.agentId !== undefined &&
  isAuthorityActive(authorityContext.claim) &&
  authorityContext.claim.subjectId ===
    authorityContext.agentId &&
  authorityContext.claim.scope.includes("execute");
     const executionPermitted =
  actionPlan.canAct && executionAuthorityVerified;

const missingAuthority = executionAuthorityVerified
  ? []
  : ["Verified portable authority claim"];
  return createExecutionEnvelope({
    signalId: signal.id,
    instructionRef: signal.id,

interpretedIntent:
  signal.summary?.trim() || signal.id,

allowedActions:
  executionPermitted ? ["execute"] : [],

executionInterfaceRef: "controlled-success",

principalId: authorityContext?.principalId,
agentId: authorityContext?.agentId,
identityCredentialRef: authorityContext?.identityCredentialRef,
delegationCredentialRef: authorityContext?.delegationCredentialRef,

executable: executionPermitted,
    decision: trustReport.decision.toUpperCase() as ExecutionEnvelope["decision"],

    authority: {
      verified: executionAuthorityVerified,
      missing: missingAuthority,
      identityCredentialRef: authorityContext?.identityCredentialRef,
delegationCredentialRef: authorityContext?.delegationCredentialRef,
    },

    evidence: {
      satisfied: satisfiedEvidence,
      missing: missingEvidence,
    },

    directives: actionPlan.steps
      .filter((step) => !step.completed)
      .map((step) => step.label),

    rationale: [
      trustReport.humanExplanation,
      authorityReport.explanation,
      actionPlan.reason,
    ],

    estimatedTrust: actionPlan.projectedTrustScore,

    provenance: {
      signalRef: signal.id,
      policyVersion: "trust-policy-0.1",
    },
  });
}
