import type { ExecutionAdapter } from "./ExecutionAdapter";
import type { TrustExecutionObject } from "./TrustExecutionObject";
import type { ExecutionResult } from "./ExecutionResult";

export class TestSuccessExecutionAdapter implements ExecutionAdapter {
  async execute(
    teo: TrustExecutionObject
  ): Promise<ExecutionResult> {
    return {
      version: "0.1",
      status: "SUCCEEDED",

      executionInterface: "x402",

      executedAt: new Date().toISOString(),

actualActor: "test-agent",

      actualAction: teo.decision,

      runtimeEvidence: [
        "controlled-success-adapter"
      ],

      transactionEvidence: [],

      outcome: "Controlled execution completed successfully.",

      error: null,
    };
  }
}
