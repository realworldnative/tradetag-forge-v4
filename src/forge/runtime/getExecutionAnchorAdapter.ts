import type { ExecutionAnchorAdapter } from "./ExecutionAnchorAdapter";
import type { ExecutionAnchorTarget } from "./ExecutionAnchorTarget";
import { GenesisGridAnchorAdapter } from "./GenesisGridAnchorAdapter";

export function getExecutionAnchorAdapter(
  target: ExecutionAnchorTarget
): ExecutionAnchorAdapter {
  console.log("ANCHOR RESOLVER TARGET:", target);
console.log("ANCHOR RESOLVER TYPE:", target.type);

  switch (target.type) {
    case "GENESIS_GRID":
      return new GenesisGridAnchorAdapter();

   default:
  return {
    async anchor(request) {
      return {
        version: "0.1",
        status: "failed",
        anchoredAt: null,
        target: request.target,
        receiptDigest: request.candidate.receiptDigest,
        sealDigest: request.candidate.sealDigest,
        instructionHash: request.candidate.instructionHash,
        error: `No execution anchor adapter configured for target type: ${target.type}`,
      };
    },
  };
  }}
