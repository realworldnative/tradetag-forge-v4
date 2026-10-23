import { describe, expect, it } from "vitest";
import { createExecutionEnvelope } from "../chain/signalToChain";
import { freezeEnvelope } from "../chain/freezeEnvelope";
import { createExecutionReceipt } from "../runtime/createExecutionReceipt";
import { createExecutionReceiptDigest } from "../runtime/createExecutionReceiptDigest";
import type { ExecutionAnchorResult } from "../runtime/ExecutionAnchorResult";
import type { SealedExecutionReceipt } from "../runtime/SealedExecutionReceipt";
import type { ConformanceReport } from "./ConformanceReport";
import { createControlledConformanceReport } from "./createControlledConformanceReport";
import { verifyControlledConformanceReport } from "./verifyControlledConformanceReport";
async function fixture() {
  const frozen = await freezeEnvelope(createExecutionEnvelope({
    signalId: "binding-test",
    instructionRef: "instruction-001",
    interpretedIntent: "Execute the test",
    allowedActions: ["execute"],
    executionInterfaceRef: "controlled-success",
    agentId: "test-agent",
    executable: true,
    decision: "BUILD",
    authority: { verified: true, missing: [] },
    evidence: { satisfied: ["test-fixture"], missing: [] },
    directives: [],
    rationale: [],
    estimatedTrust: 0,
    provenance: {
      signalRef: "binding-test",
      trustReportHash: "test-only",
      policyVersion: "test-only",
    },
  }));
  const receipt = await createExecutionReceipt({
    envelopeDigest: frozen.envelopeDigest,
    version: "0.1",
    profile: "STANDARD",
    signalId: "binding-test",
    instructionRef: "instruction-001",
    interpretedIntent: "Execute the test",
    teoId: "test-teo",
    executionInterface: "controlled-success",
    executedAt: "2026-10-22T00:00:00.000Z",
    actualActor: "test-agent",
    actualAction: "execute",
    runtimeEvidence: ["test-fixture"],
    transactionEvidence: [],
    stateEvidence: {},
    executionStatus: "SUCCEEDED",
    outcome: "test-success",
    error: null,
    decision: "BUILD",
    executable: true,
    executed: true,
    trust: 0,
    authorityVerified: true,
    missingAuthority: [],
    missingEvidence: [],
    directives: [],
    provenance: { signalRef: "binding-test", policyVersion: "test-only" },
  });
  return { frozen, receipt };
}


async function reportFixture(
  status: "CONFORMED" | "DEVIATED" | "INDETERMINATE" = "CONFORMED"
) {
  const { frozen, receipt } = await fixture();
  if (status === "DEVIATED") receipt.actualAction = "delete";
  if (status === "INDETERMINATE") receipt.authorityVerified = null;

  // Local integrity fixture: no HTTP service or external anchoring.
  const digest = await createExecutionReceiptDigest(receipt);
  const sealed: SealedExecutionReceipt = {
    status: "SEALED",
    service: "TradeTag x402 seal",
    authConfigured: false,
    receipt,
    sealDigest: digest,
    sealedAt: new Date().toISOString(),
  };
  const anchor: ExecutionAnchorResult = {
    version: "0.1",
    status: "anchored",
    anchorMode: "simulated",
    target: {
      version: "0.1",
      type: "GENESIS_GRID",
      targetId: "controlled-demo",
    },
    receiptDigest: digest,
    sealDigest: digest,
    instructionHash: receipt.instructionHash,
    anchorRef: `simulated:genesis-grid:${digest}`,
    anchoredAt: new Date().toISOString(),
  };
  const report = await createControlledConformanceReport(frozen, sealed, anchor);
  return { report, expectedDigest: frozen.envelopeDigest };
}

describe("portable controlled conformance reports", () => {
  it.each(["CONFORMED", "DEVIATED", "INDETERMINATE"] as const)(
    "verifies a JSON round trip preserving %s",
    async (status) => {
      const { report, expectedDigest } = await reportFixture(status);
      const portable = JSON.parse(JSON.stringify(report));
      expect(portable.comparison.status).toBe(status);
      expect(await verifyControlledConformanceReport(portable, expectedDigest))
        .toBe(true);
    }
  );

  const changes: Array<[string, (report: ConformanceReport) => void]> = [
    ["envelope", r => {
      r.frozenEnvelope.envelope.interpretedIntent = "Changed";
    }],
    ["receipt", r => {
      r.sealedReceipt.receipt.actualAction = "delete";
    }],
    ["result", r => {
      r.comparison.status = "DEVIATED";
    }],
    ["anchor", r => {
      r.anchor.anchorRef = "Changed";
    }],
    ["scope", r => {
      Object.assign(r.scope, { anchoring: "external" });
    }],
  ];

  it.each(changes)("rejects an altered %s", async (_name, change) => {
    const { report, expectedDigest } = await reportFixture();
    const altered: ConformanceReport = JSON.parse(JSON.stringify(report));
    change(altered);
    expect(await verifyControlledConformanceReport(altered, expectedDigest))
      .toBe(false);
  });

  it("rejects a report against a different trusted envelope digest", async () => {
    const { report, expectedDigest } = await reportFixture();
    const otherDigest =
      (expectedDigest[0] === "0" ? "1" : "0") + expectedDigest.slice(1);
    expect(await verifyControlledConformanceReport(report, otherDigest))
      .toBe(false);
  });

  it.each([null, {}, [], "invalid"])(
    "rejects malformed input %j without throwing",
    async (value) => {
      expect(await verifyControlledConformanceReport(value, "0".repeat(64)))
        .toBe(false);
    }
  );
});
