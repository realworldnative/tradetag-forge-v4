import type { ExecutionAnchorRequest } from "./createExecutionAnchorRequest";
import type { ExecutionAnchorResult } from "./ExecutionAnchorResult";

export function createExecutionAnchorResult(
  request: ExecutionAnchorRequest
): ExecutionAnchorResult {
  return {
    version: "0.1",
    status: "pending",
    anchoredAt: null,
    target: request.target,
    instructionHash: request.candidate.instructionHash,
    sealDigest: request.candidate.sealDigest,
    receiptDigest: request.candidate.receiptDigest,
  };
}
