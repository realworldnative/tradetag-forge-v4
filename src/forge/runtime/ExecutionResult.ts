export type ExecutionResultStatus =
  | "SUCCEEDED"
  | "FAILED"
  | "INDETERMINATE"
  | "BLOCKED";
export interface ExecutionResult {
  version: "0.1";

  status: ExecutionResultStatus;

  executionInterface: string;
  executedAt: string | null;

  actualActor: string | null;
  actualAction: string | null;

  authorityStatus?: "VERIFIED" | "REJECTED" | "UNKNOWN";
  authorityEvidence?: string[];

  runtimeEvidence: string[];
  transactionEvidence: string[];

  stateEvidence?: {
    stateBeforeRef?: string;
    stateAfterRef?: string;
  };

  outcome: string | null;
  error: string | null;
}
