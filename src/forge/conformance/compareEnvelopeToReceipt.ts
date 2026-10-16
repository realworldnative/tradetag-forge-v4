import type { ExecutionEnvelope } from "../chain/signalToChain";
import type { ExecutionReceipt } from "../runtime/ExecutionReceipt";
import type { ConformanceResult } from "./ConformanceResult";

export function compareEnvelopeToReceipt(
  envelope: ExecutionEnvelope,
  receipt: ExecutionReceipt
): ConformanceResult {
  const violatedConstraint: string[] = [];
const actualAction = receipt.actualAction?.trim() ?? "";
const missingExecutionEvidence =
 receipt.executionStatus === "BLOCKED" ||
  receipt.executed === false;
const missingExecutedEvidence = receipt.executed == null;
const missingActionEvidence =
  envelope.allowedActions.length > 0 &&
  actualAction.length === 0;
const missingAuthorityEvidence =
  envelope.authority?.verified === true &&
  receipt.authorityVerified == null;
  const missingInstructionEvidence =
  envelope.instructionRef.trim().length > 0 &&
  receipt.instructionRef.trim().length === 0;
  const missingInterpretedIntentEvidence =
  envelope.interpretedIntent.trim().length > 0 &&
  receipt.interpretedIntent.trim().length === 0;
  const missingExecutionInterfaceEvidence =
  envelope.executionInterfaceRef.trim().length > 0 &&
  receipt.executionInterface.trim().length === 0;

if (
  envelope.instructionRef.trim().length > 0 &&
  receipt.instructionRef.trim().length > 0 &&
  envelope.instructionRef !== receipt.instructionRef
) {
  violatedConstraint.push("instructionRef");
}if (
  !missingInterpretedIntentEvidence &&
  envelope.interpretedIntent !== receipt.interpretedIntent
) {
  violatedConstraint.push("interpretedIntent");
}
if (
  !missingExecutionInterfaceEvidence &&
  envelope.executionInterfaceRef !== receipt.executionInterface
) {
  violatedConstraint.push("executionInterface");
}
if (
  envelope.authority?.verified === true &&
  receipt.authorityVerified === false
) {
  violatedConstraint.push("authority");
}if (
  actualAction.length > 0 &&
  !envelope.allowedActions.includes(actualAction)
) {
  violatedConstraint.push("allowedActions");
}
if (violatedConstraint.length > 0) {
  return {
    version: "0.1",
    status: "DEVIATED",
    violatedConstraint,
  };
}

console.log("CONFORMANCE EVIDENCE CHECK", {
  missingExecutionEvidence,
  missingActionEvidence,
  missingAuthorityEvidence,
  missingInstructionEvidence,
  missingInterpretedIntentEvidence,
  missingExecutionInterfaceEvidence,
});
if (
  missingExecutionEvidence ||
  missingActionEvidence ||
  missingAuthorityEvidence ||
  missingInstructionEvidence ||
  missingInterpretedIntentEvidence ||
  missingExecutedEvidence ||
  missingExecutionInterfaceEvidence
) {
           return {
    version: "0.1",
    status: "INDETERMINATE",
    violatedConstraint: [],
  };
}

return {
  version: "0.1",
  status: "CONFORMED",
  violatedConstraint: [],
};
}
