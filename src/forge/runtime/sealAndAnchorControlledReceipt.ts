import type { ExecutionReceipt } from "./ExecutionReceipt";
import { sealExecutionReceipt } from "./sealExecutionReceipt";
import { createExecutionReceiptDigest } from "./createExecutionReceiptDigest";
import { createExecutionIdentity } from "./createExecutionIdentity";
import { createExecutionAnchorCandidate } from "./createExecutionAnchorCandidate";
import { createExecutionAnchorRequest } from "./createExecutionAnchorRequest";
import { GenesisGridAnchorAdapter } from "./GenesisGridAnchorAdapter";

export async function sealAndAnchorControlledReceipt(receipt: ExecutionReceipt) {
  const sealed = await sealExecutionReceipt(receipt);
  const receiptDigest = await createExecutionReceiptDigest(sealed.receipt);
  const identity = createExecutionIdentity(sealed, receiptDigest);
  const candidate = createExecutionAnchorCandidate(identity);
  const request = createExecutionAnchorRequest(candidate, {
    version: "0.1",
    type: "GENESIS_GRID",
    targetId: "controlled-demo",
  });
  const anchor = await new GenesisGridAnchorAdapter().anchor(request);

  if (
    anchor.status !== "anchored" ||
    anchor.anchorMode !== "simulated" ||
    anchor.receiptDigest !== receiptDigest ||
    anchor.sealDigest !== sealed.sealDigest ||
    anchor.instructionHash !== sealed.receipt.instructionHash ||
    anchor.anchorRef !== `simulated:genesis-grid:${sealed.sealDigest}`
  ) {
    throw new Error("Controlled demo anchor verification failed.");
  }

  return { sealed, anchor };
}
