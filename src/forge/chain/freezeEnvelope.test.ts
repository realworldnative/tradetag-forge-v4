import { describe, expect, it } from "vitest";
import type { ExecutionEnvelope } from "./signalToChain";
import {
  freezeEnvelope,
  verifyFrozenEnvelope,
  createExecutionEnvelopeDigest,
} from "./freezeEnvelope";

function fixture(): ExecutionEnvelope {
  return {
    version: "0.1",
    generatedAt: "2026-10-22T00:00:00.000Z",
    signalId: "freeze-test",
    instructionRef: "instruction-001",
    interpretedIntent: "Execute the demonstration",
    allowedActions: ["execute"],
    executionInterfaceRef: "controlled-success",
    principalId: "demo-principal",
    agentId: "test-agent",
    executable: true,
    decision: "BUILD",
    authority: { verified: true, missing: [] },
    evidence: { satisfied: ["demo-only"], missing: [] },
    directives: [],
    rationale: ["Synthetic test fixture"],
    estimatedTrust: 0,
    provenance: {
      signalRef: "freeze-test",
      trustReportHash: "demo-only",
      policyVersion: "demo-only",
    },
  };
}

describe("freezeEnvelope", () => {
  it("isolates the snapshot before asynchronous hashing begins", async () => {
    const source = fixture();
    const pending = freezeEnvelope(source);
    source.allowedActions.push("delete");
    source.authority.verified = false;
    const frozen = await pending;
    expect(frozen.envelope.allowedActions).toEqual(["execute"]);
    expect(frozen.envelope.authority.verified).toBe(true);
    expect(await verifyFrozenEnvelope(frozen)).toBe(true);
  });

  it("blocks nested changes and digest replacement", async () => {
    const frozen = await freezeEnvelope(fixture());
    expect(Reflect.set(frozen.envelope.allowedActions, "0", "delete")).toBe(false);
    expect(Reflect.set(frozen.envelope.authority, "verified", false)).toBe(false);
    expect(Reflect.set(frozen, "envelopeDigest", "0".repeat(64))).toBe(false);
    expect(await verifyFrozenEnvelope(frozen)).toBe(true);
  });

  it.each([
    ["instructionRef", { instructionRef: "different-instruction" }],
    ["interpretedIntent", { interpretedIntent: "Different intent" }],
    ["allowedActions", { allowedActions: ["delete"] }],
    ["agentId", { agentId: "different-agent" }],
    ["authority", { authority: { verified: false, missing: ["authority"] } }],
  ])("detects altered %s against the original digest", async (_name, change) => {
    const frozen = await freezeEnvelope(fixture());
    const altered = {
      ...frozen,
      envelope: { ...frozen.envelope, ...change },
    };
    expect(await verifyFrozenEnvelope(altered)).toBe(false);
  });

  it("preserves the digest through JSON serialization and key reordering", async () => {
    const frozen = await freezeEnvelope(fixture());
    const restored = JSON.parse(JSON.stringify(frozen));
    expect(await verifyFrozenEnvelope(restored)).toBe(true);
    const reordered = Object.fromEntries(
      Object.entries(frozen.envelope).reverse()
    ) as unknown as ExecutionEnvelope;
    expect(await createExecutionEnvelopeDigest(reordered)).toBe(frozen.envelopeDigest);
  });
});
