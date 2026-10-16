
import { describe, expect, it } from "vitest";
import { compareEnvelopeToReceipt } from "./compareEnvelopeToReceipt";
import type { ExecutionEnvelope } from "../chain/signalToChain";
import type { ExecutionReceipt } from "../runtime/ExecutionReceipt";

function makeEnvelope(
  overrides: Partial<ExecutionEnvelope> = {}
): ExecutionEnvelope {
  return {
    authority: { verified: true },
    allowedActions: ["send"],
    instructionRef: "instruction-001",
    interpretedIntent: "send",
    executionInterfaceRef: "send",
    authorityVerified: true,
executionIntent: "send",
    ...overrides,
  } as ExecutionEnvelope;
}

function makeReceipt(
overrides: Partial<ExecutionReceipt> = {}
): ExecutionReceipt {
  return {
    executed: true,
    executionStatus: "EXECUTED",
    instructionRef: "instruction-001",
    interpretedIntent: "send",
    actualAction: "send",
    executionInterface: "send",
    ...overrides,
    authorityVerified: true,
actionEvidence: "send",
executionEvidence: "executed",
  } as ExecutionReceipt;
}

describe("TradeTag Conformance", () => {
  it("returns CONFORMED for matching evidence", () => {
    const result = compareEnvelopeToReceipt(
      makeEnvelope(),
      makeReceipt()
    );

    expect(result.status).toBe("CONFORMED");
    expect(result.violatedConstraint).toEqual([]);
  });

  it("returns DEVIATED for an instruction mismatch", () => {
const result = compareEnvelopeToReceipt(
  makeEnvelope(),
  makeReceipt({
    executed: true,
    executionStatus: "EXECUTED",
instructionRef: "instruction-444",
    interpretedIntent: "send",
    executionInterface: "send",
    actualAction: "send",
  })
);
    expect(result.status).toBe("DEVIATED");
    expect(result.violatedConstraint).toContain(
      "instructionRef"
    );
  });
  it("returns INDETERMINATE when execution is blocked", () => {
    const result = compareEnvelopeToReceipt(
      makeEnvelope(),
      makeReceipt({
        executed: false,
        executionStatus: "BLOCKED",
      })
    );

    expect(result.status).toBe("INDETERMINATE");
  });
});
it("returns INDETERMINATE when authority evidence is missing", () => {
  const envelope = makeEnvelope();
  const receipt = makeReceipt();

  delete (receipt as Partial<ExecutionReceipt>).authorityVerified;

  const result = compareEnvelopeToReceipt(envelope, receipt);

  expect(result.status).toBe("INDETERMINATE");
});
it("returns INDETERMINATE when executed evidence is missing", () => {
  const envelope = makeEnvelope();
  const receipt = makeReceipt();

  delete (receipt as Partial<ExecutionReceipt>).executed;

  const result = compareEnvelopeToReceipt(envelope, receipt);

  expect(result.status).toBe("INDETERMINATE");
});

it("returns DEVIATED when instruction mismatch is known despite missing execution evidence", () => {
  const envelope = makeEnvelope();
  const receipt = makeReceipt();

  receipt.instructionRef = "instruction-WRONG";
  delete (receipt as Partial<ExecutionReceipt>).executed;

  const result = compareEnvelopeToReceipt(envelope, receipt);

  expect(result.status).toBe("DEVIATED");
  expect(result.violatedConstraint).toContain("instructionRef");
});

it("returns DEVIATED when an action is not authorized", () => {
  const envelope = makeEnvelope();

  const receipt = makeReceipt({
    actualAction: "delete",
  });

  const result = compareEnvelopeToReceipt(envelope, receipt);

  expect(result.status).toBe("DEVIATED");
  expect(result.violatedConstraint).toContain("allowedActions");
});

it("returns INDETERMINATE when actual action is blank", () => {
  const envelope = makeEnvelope();
  const receipt = makeReceipt();

  receipt.executed = true;
  receipt.executionStatus = "EXECUTED";
  receipt.actualAction = "   ";

  const result = compareEnvelopeToReceipt(envelope, receipt);

  expect(result.status).toBe("INDETERMINATE");
});

it("returns INDETERMINATE for contradictory execution evidence", () => {
  const envelope = makeEnvelope();
  const receipt = makeReceipt();

  receipt.executed = false;
  receipt.executionStatus = "EXECUTED";

  const result = compareEnvelopeToReceipt(envelope, receipt);

  expect(result.status).toBe("INDETERMINATE");
});

it("returns DEVIATED when execution succeeds but action is unauthorized", () => {
  const envelope = makeEnvelope();
  const receipt = makeReceipt();

  envelope.allowedActions = ["send"];
  receipt.actualAction = "delete";
  receipt.executed = true;
  receipt.executionStatus = "EXECUTED";

  const result = compareEnvelopeToReceipt(envelope, receipt);

  expect(result.status).toBe("DEVIATED");
  expect(result.violatedConstraint).toContain("allowedActions");
});


it("returns INDETERMINATE when action identity is missing despite an allowed action", () => {
  const envelope = makeEnvelope();
  const receipt = makeReceipt();

  envelope.allowedActions = ["send"];
  receipt.actualAction = "";

  const result = compareEnvelopeToReceipt(envelope, receipt);

  expect(result.status).toBe("INDETERMINATE");
expect(result.violatedConstraint).toEqual([]);
});
