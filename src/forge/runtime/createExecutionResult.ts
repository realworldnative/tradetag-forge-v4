import type { ExecutionAnchorRequest } from "./createExecutionAnchorRequest";
import type { ExecutionAnchorResult } from "./ExecutionAnchorResult";

export function createExecutionAnchorResult(
  request: ExecutionAnchorRequest
): ExecutionAnchorResult {
  return {
    version: "0.1",
    status: "pending",
    target: request.target,
    sealDigest: request.candidate.sealDigest,
    receiptDigest: request.candidate.receiptDigest,

    instructionHash: request.candidate.instructionHash,
  };
}
