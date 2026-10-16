import type { ExecutionAnchorAdapter } from "./ExecutionAnchorAdapter";
import type { ExecutionAnchorRequest } from "./createExecutionAnchorRequest";
import type { ExecutionAnchorResult } from "./ExecutionAnchorResult"
import { createExecutionAnchorResult } from "./createExecutionAnchorResult";
import { completeExecutionAnchor } from "./completeExecutionAnchor";
export class GenesisGridAnchorAdapter
  implements ExecutionAnchorAdapter
{
  async anchor(
    request: ExecutionAnchorRequest
  ): Promise<ExecutionAnchorResult> {
     const pendingResult =
  createExecutionAnchorResult(request);

pendingResult.anchorMode = "simulated";

    return completeExecutionAnchor(
      pendingResult,
`simulated:genesis-grid:${request.candidate.sealDigest}`    );
  }
}
