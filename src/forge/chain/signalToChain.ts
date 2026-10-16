export type ChainDecision =
  | "BUILD"
  | "MERGE"
  | "WATCH"
  | "REJECT";

export interface ExecutionEnvelope {
  version: "0.1";
  signalId: string;
  instructionRef: string;
  interpretedIntent: string;
  allowedActions: string[];
  executionInterfaceRef: string;
  generatedAt: string;

principalId?: string;
agentId?: string;
identityCredentialRef?: string;
delegationCredentialRef?: string;

  executable: boolean;
  decision: ChainDecision;

  authority: {
    verified: boolean;
    missing: string[];
    identityCredentialRef?: string;
    delegationCredentialRef?: string;
  };

  evidence: {
    satisfied: string[];
    missing: string[];
  };

  directives: string[];
  rationale: string[];

  estimatedTrust: number;

  provenance: {
    signalRef: string;
    trustReportHash?: string;
    policyVersion: string;
  };
}
export function createExecutionEnvelope(
  input: Omit<
    ExecutionEnvelope,
    "version" | "generatedAt"
  >
): ExecutionEnvelope {
  return {
    version: "0.1",
    generatedAt: new Date().toISOString(),
    ...input,
  };
}
