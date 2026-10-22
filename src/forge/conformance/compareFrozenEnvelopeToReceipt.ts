import type { FrozenExecutionEnvelope } from "../chain/freezeEnvelope";
import { verifyFrozenEnvelope } from "../chain/freezeEnvelope";
import type { ExecutionReceipt } from "../runtime/ExecutionReceipt";
import { compareEnvelopeToReceipt } from "./compareEnvelopeToReceipt";

export async function compareFrozenEnvelopeToReceipt(
  frozen: FrozenExecutionEnvelope,
  receipt: ExecutionReceipt
): Promise<ReturnType<typeof compareEnvelopeToReceipt>> {
  const snapshot: FrozenExecutionEnvelope =
    JSON.parse(JSON.stringify(frozen));
  const receiptSnapshot: ExecutionReceipt =
    JSON.parse(JSON.stringify(receipt));

  if (!(await verifyFrozenEnvelope(snapshot))) {
    throw new Error("Frozen envelope integrity verification failed.");
  }

  const comparison = compareEnvelopeToReceipt(
    snapshot.envelope,
    receiptSnapshot
  );
  const binding = receiptSnapshot.envelopeDigest;

  if (binding != null && binding !== "" &&
      binding !== snapshot.envelopeDigest) {
    return {
      version: "0.1",
      status: "DEVIATED",
      violatedConstraint: [
        ...new Set([...comparison.violatedConstraint, "envelopeDigest"]),
      ],
    };
  }

  if (comparison.status === "DEVIATED") return comparison;

  if (binding == null || binding === "") {
    return {
      version: "0.1",
      status: "INDETERMINATE",
      violatedConstraint: [],
    };
  }

  return comparison;
}
