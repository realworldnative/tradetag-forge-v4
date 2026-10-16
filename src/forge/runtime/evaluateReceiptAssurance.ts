import type { ExecutionReceipt } from "./ExecutionReceipt";
import type { ConformanceResult } from "../conformance/ConformanceResult";
import type { ReceiptAssuranceResult } from "./ReceiptAssuranceResult";
import { getReceiptProfileRequirements } from "./ReceiptProfile";



export function evaluateReceiptAssurance(
  receipt: ExecutionReceipt,
  conformance: ConformanceResult
): ReceiptAssuranceResult {
  const requirements =
    getReceiptProfileRequirements(receipt.profile);

  const unmetRequirement: string[] = [];

  let indeterminate = false;
  let definitivelyUnsatisfied = false;

  // A proven conformance deviation is definitive.
  if (
    requirements.conformance &&
    conformance.status === "DEVIATED"
  ) {
    unmetRequirement.push("conformance");
    definitivelyUnsatisfied = true;
  }

  // Missing conformance proof is uncertainty, not deviation.
  if (
    requirements.conformance &&
    conformance.status === "INDETERMINATE"
  ) {
    indeterminate = true;
  }

  // Explicitly failed authority is definitive.
  if (
    requirements.authority &&
    receipt.authorityVerified === false
  ) {
    unmetRequirement.push("authority");
    definitivelyUnsatisfied = true;
  }

  // Unknown authority remains indeterminate,
  // but the missing requirement must still be surfaced.
  if (
    requirements.authority &&
    receipt.authorityVerified === null
  ) {
    unmetRequirement.push("authority");
    indeterminate = true;
  }

  // Missing evidence alone cannot prove failure.
  if (
    requirements.evidence &&
    receipt.missingEvidence.length > 0
  ) {
    unmetRequirement.push("evidence");
    indeterminate = true;
  }

  // Missing required state evidence is also uncertainty.
  if (
    requirements.state &&
    (
      !receipt.stateEvidence?.stateBeforeRef ||
      !receipt.stateEvidence?.stateAfterRef
    )
  ) {
    unmetRequirement.push("state");
    indeterminate = true;
  }

  return {
    version: "0.1",
    status: definitivelyUnsatisfied
      ? "UNSATISFIED"
      : indeterminate
        ? "INDETERMINATE"
        : unmetRequirement.length > 0
          ? "UNSATISFIED"
          : "SATISFIED",
    unmetRequirement,
  };
}
