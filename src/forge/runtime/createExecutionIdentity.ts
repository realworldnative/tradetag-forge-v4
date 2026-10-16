import type { SealedExecutionReceipt } from "./SealedExecutionReceipt";
import type { ExecutionIdentity } from "./ExecutionIdentity";

export function createExecutionIdentity(
  sealedReceipt: SealedExecutionReceipt,
  receiptDigest: string
): ExecutionIdentity {
return {
  version: "0.1",
  signalId: sealedReceipt.receipt.signalId,
  instructionHash: sealedReceipt.receipt.instructionHash,
  decision: sealedReceipt.receipt.decision,
  receiptDigest,
  sealDigest: sealedReceipt.sealDigest,
};}
