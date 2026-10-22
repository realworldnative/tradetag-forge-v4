import { describe, expect, it } from "vitest";
import { createExecutionEnvelope } from "../chain/signalToChain";
import { freezeEnvelope } from "../chain/freezeEnvelope";
import { createExecutionReceipt } from "../runtime/createExecutionReceipt";
import { compareFrozenEnvelopeToReceipt } from "./compareFrozenEnvelopeToReceipt";

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

describe("frozen envelope receipt binding", () => {
  it("conforms when the binding and execution match", async () => {
    const { frozen, receipt } = await fixture();
    expect(await compareFrozenEnvelopeToReceipt(frozen, receipt))
      .toEqual({ version: "0.1", status: "CONFORMED", violatedConstraint: [] });
  });

  it.each([undefined, ""])("is indeterminate for missing binding %s", async (binding) => {
    const { frozen, receipt } = await fixture();
    receipt.envelopeDigest = binding;
    expect((await compareFrozenEnvelopeToReceipt(frozen, receipt)).status)
      .toBe("INDETERMINATE");
  });

  it("detects a receipt bound to another envelope", async () => {
    const { frozen, receipt } = await fixture();
    receipt.envelopeDigest = "0".repeat(64);
    expect(await compareFrozenEnvelopeToReceipt(frozen, receipt))
      .toEqual({
        version: "0.1",
        status: "DEVIATED",
        violatedConstraint: ["envelopeDigest"],
      });
  });

  it("keeps known violations ahead of missing binding", async () => {
    const { frozen, receipt } = await fixture();
    delete receipt.envelopeDigest;
    receipt.actualAction = "delete";
    const result = await compareFrozenEnvelopeToReceipt(frozen, receipt);
    expect(result.status).toBe("DEVIATED");
    expect(result.violatedConstraint).toContain("allowedActions");
  });

  it("reports both action and binding violations", async () => {
    const { frozen, receipt } = await fixture();
    receipt.envelopeDigest = "0".repeat(64);
    receipt.actualAction = "delete";
    const result = await compareFrozenEnvelopeToReceipt(frozen, receipt);
    expect(result.status).toBe("DEVIATED");
    expect(result.violatedConstraint)
      .toEqual(expect.arrayContaining(["allowedActions", "envelopeDigest"]));
  });

  it("rejects an altered envelope before comparison", async () => {
    const { frozen, receipt } = await fixture();
    const altered = JSON.parse(JSON.stringify(frozen));
    altered.envelope.interpretedIntent = "Altered intent";
    await expect(compareFrozenEnvelopeToReceipt(altered, receipt))
      .rejects.toThrow("Frozen envelope integrity verification failed.");
  });

  it("snapshots the receipt before asynchronous verification", async () => {
    const { frozen, receipt } = await fixture();
    const pending = compareFrozenEnvelopeToReceipt(frozen, receipt);
    receipt.actualAction = "delete";
    receipt.envelopeDigest = "0".repeat(64);
    expect((await pending).status).toBe("CONFORMED");
  });
});
