import type { ConformanceReport } from "./ConformanceReport";
import type { FrozenExecutionEnvelope } from "../chain/freezeEnvelope";
import type { ExecutionAnchorResult } from "../runtime/ExecutionAnchorResult";
import {
  isSealedExecutionReceipt,
  type SealedExecutionReceipt,
} from "../runtime/SealedExecutionReceipt";
import { createExecutionReceiptDigest } from "../runtime/createExecutionReceiptDigest";
import { compareFrozenEnvelopeToReceipt } from "./compareFrozenEnvelopeToReceipt";

export async function createControlledConformanceReport(
  frozenEnvelope: FrozenExecutionEnvelope,
  sealedReceipt: SealedExecutionReceipt,
  anchor: ExecutionAnchorResult
): Promise<ConformanceReport> {
  const snapshot: {
    frozenEnvelope: FrozenExecutionEnvelope;
    sealedReceipt: SealedExecutionReceipt;
    anchor: ExecutionAnchorResult;
  } = JSON.parse(JSON.stringify({ frozenEnvelope, sealedReceipt, anchor }));

  const sealed = snapshot.sealedReceipt;
  const anchored = snapshot.anchor;

  if (!isSealedExecutionReceipt(sealed)) {
    throw new Error("Invalid sealed receipt.");
  }

  const receiptDigest = await createExecutionReceiptDigest(sealed.receipt);
  if (receiptDigest !== sealed.sealDigest) {
    throw new Error("Report receipt seal digest verification failed.");
  }

  if (
    anchored.status !== "anchored" ||
    anchored.anchorMode !== "simulated" ||
    anchored.target.type !== "GENESIS_GRID" ||
    anchored.target.targetId !== "controlled-demo" ||
    anchored.receiptDigest !== receiptDigest ||
    anchored.sealDigest !== sealed.sealDigest ||
    anchored.instructionHash !== sealed.receipt.instructionHash ||
    anchored.anchorRef !== `simulated:genesis-grid:${sealed.sealDigest}` ||
    !anchored.anchoredAt ||
    !Number.isFinite(Date.parse(anchored.anchoredAt)) ||
    anchored.error != null
  ) {
    throw new Error("Report simulated anchor verification failed.");
  }

  const comparison = await compareFrozenEnvelopeToReceipt(
    snapshot.frozenEnvelope,
    sealed.receipt
  );

  return {
    version: "0.1",
    kind: "TradeTag.ConformanceReport",
    reportId: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    scope: {
      execution: "controlled-demo",
      authority: "synthetic",
      seal: "sha256-integrity",
      anchoring: "simulated",
    },
    frozenEnvelope: snapshot.frozenEnvelope,
    sealedReceipt: sealed,
    receiptDigest,
    anchor: anchored,
    comparison,
  };
}
