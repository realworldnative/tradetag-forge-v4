import type { ExecutionAdapter } from "./ExecutionAdapter";
import type { ExecutionResult } from "./ExecutionResult";
import type { TrustExecutionObject } from "./TrustExecutionObject";

export class DefaultExecutionAdapter implements ExecutionAdapter {
  async execute(
    _teo: TrustExecutionObject
  ): Promise<ExecutionResult> {
    return {
      version: "0.1",
      status: "INDETERMINATE",
      executionInterface: "unconfigured",
      executedAt: null,
      actualActor: null,
      actualAction: null,
      runtimeEvidence: [],
      transactionEvidence: [],
      outcome: null,
      error: "No execution adapter configured.",
    };
  }
}
