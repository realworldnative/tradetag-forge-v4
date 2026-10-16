import type { ExecutionAnchorRequest } from "./createExecutionAnchorRequest";
import type { ExecutionAnchorResult } from "./ExecutionAnchorResult";

export interface ExecutionAnchorAdapter {
  anchor(
    request: ExecutionAnchorRequest
  ): Promise<ExecutionAnchorResult>;
}
