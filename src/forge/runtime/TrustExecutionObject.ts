import type { ExecutionEnvelope } from "../chain/signalToChain";

export type TEOState =
  | "draft"
  | "review"
  | "ready"
  | "executed"
  | "revoked";

export interface TrustExecutionObject {
  id: string;
  version: "0.1";

  createdAt: string;
  updatedAt: string;

  sourceSignalId: string;

  state: TEOState;

  executable: boolean;
  decision: ExecutionEnvelope["decision"];

  authority: ExecutionEnvelope["authority"];
  evidence: ExecutionEnvelope["evidence"];

  directives: string[];
  rationale: string[];

  estimatedTrust: number;

  provenance: {
    signalRef: string;
    policyVersion: string;
    trustReportHash?: string;
    teoHash?: string;
  };
}

export function createTrustExecutionObject(
  envelope: ExecutionEnvelope
): TrustExecutionObject {
  const now = new Date().toISOString();

  return {
    id: `teo-${envelope.signalId}-${Date.now()}`,
    version: "0.1",

    createdAt: now,
    updatedAt: now,

    sourceSignalId: envelope.signalId,

    state: envelope.executable ? "ready" : "review",

    executable: envelope.executable,
    decision: envelope.decision,

    authority: envelope.authority,
    evidence: envelope.evidence,

    directives: [...envelope.directives],
    rationale: [...envelope.rationale],

    estimatedTrust: envelope.estimatedTrust,

    provenance: {
      signalRef: envelope.provenance.signalRef,
      policyVersion: envelope.provenance.policyVersion,
      trustReportHash: envelope.provenance.trustReportHash,
    },
  };
}
