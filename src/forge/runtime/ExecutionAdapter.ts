import type { TrustExecutionObject } from "./TrustExecutionObject";
import type { ExecutionResult } from "./ExecutionResult";

export interface ExecutionAdapter {
  execute(
    teo: TrustExecutionObject
  ): Promise<ExecutionResult>;
}
