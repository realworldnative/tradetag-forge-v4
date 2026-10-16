import type { ExecutionDecision } from "./ExecutionReceipt";

export interface ExecutionIdentity {
  version: "0.1";
  signalId: string;
  instructionHash: string;
  decision: ExecutionDecision;
  receiptDigest: string;
  sealDigest: string;
}
