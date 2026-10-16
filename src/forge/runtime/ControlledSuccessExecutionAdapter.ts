import type { ExecutionAdapter } from "./ExecutionAdapter";
import type { TrustExecutionObject } from "./TrustExecutionObject";
import type { ExecutionResult } from "./ExecutionResult";

export class ControlledSuccessExecutionAdapter implements ExecutionAdapter {
  async execute(
    _teo: TrustExecutionObject
  ): Promise<ExecutionResult> {
    return {
      version: "0.1",
      status: "SUCCEEDED",

      executionInterface: "controlled-success",
      executedAt: new Date().toISOString(),
      actualActor: "test-agent",
      actualAction: "execute",
      runtimeEvidence: ["controlled-success-adapter"],
      transactionEvidence: [],

      outcome: "controlled-success",
      error: null,
    };
  }
}
