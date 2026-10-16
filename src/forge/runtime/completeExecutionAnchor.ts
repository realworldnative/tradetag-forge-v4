import type { ExecutionAnchorResult } from "./ExecutionAnchorResult";

export function completeExecutionAnchor(
  result: ExecutionAnchorResult,
  anchorRef: string
): ExecutionAnchorResult {
  return {
    ...result,
    status: "anchored",
    anchoredAt: new Date().toISOString(),
    anchorRef,
  };
}
