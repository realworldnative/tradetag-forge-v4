import type { ExecutionIdentity } from "./ExecutionIdentity";
import type { ExecutionAnchorCandidate } from "./ExecutionAnchorCandidate";

export function createExecutionAnchorCandidate(
  identity: ExecutionIdentity
): ExecutionAnchorCandidate {
  return {
    version: "0.1",
    signalId: identity.signalId,
    instructionHash: identity.instructionHash,
decision: identity.decision,
receiptDigest: identity.receiptDigest,
sealDigest: identity.sealDigest,
anchorStatus: "pending",  };
}
