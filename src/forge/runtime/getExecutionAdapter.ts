import type { ExecutionAdapter } from "./ExecutionAdapter";
import { DefaultExecutionAdapter } from "./DefaultExecutionAdapter";
import { ControlledSuccessExecutionAdapter } from "./ControlledSuccessExecutionAdapter";

export function getExecutionAdapter(
  executionInterface: string
): ExecutionAdapter {
  if (executionInterface === "controlled-success") {
    return new ControlledSuccessExecutionAdapter();
  }

  return new DefaultExecutionAdapter();
}
