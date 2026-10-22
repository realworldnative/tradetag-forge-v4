
export type ExecutionDecision =
  | "BUILD"
  | "MERGE"
    | "WATCH"
  | "REJECT";

export interface ExecutionReceipt {
  envelopeDigest?: string;
  version: "0.1";
profile: "STANDARD";

signalId: string;
  instructionRef: string;
  instructionHash: string;
  interpretedIntent: string;

teoId: string;

executionInterface: string;
executedAt: string | null;
actualActor: string | null;
actualAction: string | null;

runtimeEvidence: string[];
transactionEvidence: string[];

executionStatus: string;
outcome: string | null;
error: string | null;


  receiptId: string;
  createdAt: string;

  decision: ExecutionDecision;
  executable: boolean;
  executed: boolean;

stateEvidence: {
  stateBeforeRef?: string;
  stateAfterRef?: string;
};

  trust: number;
authorityStatus?: "VERIFIED" | "REJECTED" | "UNKNOWN";
authorityEvidence?: string[];

authorityVerified: boolean | null;
  missingAuthority: string[];
  missingEvidence: string[];

  directives: string[];

  provenance: {
    signalRef: string;
    policyVersion: string;
  };
}

