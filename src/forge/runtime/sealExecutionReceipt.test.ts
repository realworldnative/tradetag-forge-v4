import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ExecutionReceipt } from "./ExecutionReceipt";
import { createExecutionReceiptDigest } from "./createExecutionReceiptDigest";

function makeReceipt(): ExecutionReceipt {
  return {
    version: "0.1",
    profile: "STANDARD",
    signalId: "TEST-signal-001",
    instructionRef: "TEST-instruction-001",
    instructionHash: "TEST-instruction-hash",
    interpretedIntent: "Test receipt verification",
    teoId: "TEST-envelope-001",
    executionInterface: "TEST-interface",
    executedAt: null,
    actualActor: null,
    actualAction: null,
    runtimeEvidence: [],
    transactionEvidence: [],
    executionStatus: "BLOCKED",
    outcome: null,
    error: null,
    receiptId: "TEST-receipt-001",
    createdAt: "2026-10-21T12:00:00.000Z",
    decision: "WATCH",
    executable: false,
    executed: false,
    stateEvidence: {},
    trust: 0,
    authorityVerified: null,
    missingAuthority: [],
    missingEvidence: [],
    directives: [],
    provenance: {
      signalRef: "TEST-signal-001",
      policyVersion: "TEST-policy-001",
    },
  };
}

async function makeResponse(receipt: ExecutionReceipt) {
  return {
    status: "SEALED",
    service: "TradeTag x402 seal",
    authConfigured: true,
    receipt,
    sealDigest: await createExecutionReceiptDigest(receipt),
    sealedAt: "2026-10-21T12:00:01.000Z",
  };
}

function mockResponse(body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  );

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("sealExecutionReceipt", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv(
      "VITE_X402_SEAL_URL",
      "https://seal.example.test"
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("accepts a matching receipt and digest", async () => {
    const receipt = makeReceipt();
    const response = await makeResponse(receipt);
    const fetchMock = mockResponse(response);
    const { sealExecutionReceipt } =
      await import("./sealExecutionReceipt");

    await expect(
      sealExecutionReceipt(receipt)
    ).resolves.toEqual(response);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://seal.example.test",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(receipt),
      })
    );
  });

  it("rejects an incorrect seal digest", async () => {
    const receipt = makeReceipt();
    const response = await makeResponse(receipt);
    response.sealDigest = "0".repeat(64);
    mockResponse(response);

    const { sealExecutionReceipt } =
      await import("./sealExecutionReceipt");

    await expect(
      sealExecutionReceipt(receipt)
    ).rejects.toThrow("x402 seal digest verification failed.");
  });

  it.each(["receiptId", "createdAt", "teoId"] as const)(
    "rejects an altered %s even with a recomputed digest",
    async (field) => {
      const receipt = makeReceipt();
      const alteredReceipt = {
        ...receipt,
        [field]: "TAMPERED",
      };

      mockResponse(await makeResponse(alteredReceipt));

      const { sealExecutionReceipt } =
        await import("./sealExecutionReceipt");

      await expect(
        sealExecutionReceipt(receipt)
      ).rejects.toThrow(
        "x402 seal returned a receipt different from the submitted receipt."
      );
    }
  );
});
