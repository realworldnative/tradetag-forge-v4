import type { ExecutionAnchorCandidate } from "./ExecutionAnchorCandidate";
import type { ExecutionAnchorTarget } from "./ExecutionAnchorTarget";

export interface ExecutionAnchorRequest {
  version: "0.1";
  candidate: ExecutionAnchorCandidate;
  target: ExecutionAnchorTarget;
}

export function createExecutionAnchorRequest(
  candidate: ExecutionAnchorCandidate,
  target: ExecutionAnchorTarget
): ExecutionAnchorRequest {
  return {
    version: "0.1",
    candidate,
    target,
  };
}
