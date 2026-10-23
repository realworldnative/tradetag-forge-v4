import type { FrozenExecutionEnvelope } from "../chain/freezeEnvelope";
import type { SealedExecutionReceipt } from "../runtime/SealedExecutionReceipt";
import type { ExecutionAnchorResult } from "../runtime/ExecutionAnchorResult";
import type { ConformanceResult } from "./ConformanceResult";

export interface ConformanceReport {
  version: "0.1";
  kind: "TradeTag.ConformanceReport";
  reportId: string;
  generatedAt: string;

  scope: {
    execution: "controlled-demo";
    authority: "synthetic";
    seal: "sha256-integrity";
    anchoring: "simulated";
  };

  frozenEnvelope: FrozenExecutionEnvelope;
  sealedReceipt: SealedExecutionReceipt;
  receiptDigest: string;
  anchor: ExecutionAnchorResult;
  comparison: ConformanceResult;
}
