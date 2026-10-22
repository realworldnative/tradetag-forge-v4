import { createExecutionEnvelope } from "./signalToChain";
import { createTrustExecutionObject } from "../runtime/TrustExecutionObject";
import { getExecutionAdapter } from "../runtime/getExecutionAdapter";
import { createExecutionReceipt } from "../runtime/createExecutionReceipt";
import { compareEnvelopeToReceipt } from "../conformance/compareEnvelopeToReceipt";

async function main() {
  console.log("CONTROLLED DEMO — synthetic authority; no payment or blockchain transaction");

  const envelope = createExecutionEnvelope({
    signalId: "demo-only",
    instructionRef: "demo-instruction-001",
    interpretedIntent: "Execute the controlled demonstration",
    allowedActions: ["execute"],
    executionInterfaceRef: "controlled-success",
    principalId: "demo-principal",
    agentId: "test-agent",
    executable: true,
    decision: "BUILD",
    authority: {
      verified: true,
      missing: [],
    },
    evidence: { satisfied: ["demo-fixture"], missing: [] },
    directives: [],
    rationale: ["Controlled demonstration only"],
    estimatedTrust: 0,
    provenance: {
      signalRef: "demo-only",
      trustReportHash: "demo-fixture-not-a-verified-hash",
      policyVersion: "demo-only",
    },
  });

  const teo = createTrustExecutionObject(envelope);
  const result = await getExecutionAdapter(
    envelope.executionInterfaceRef
  ).execute(teo);

  if (result.status !== "SUCCEEDED") {
    throw new Error("Controlled adapter did not succeed");
  }

  const receipt = await createExecutionReceipt({
    version: "0.1",
    profile: "STANDARD",
    signalId: envelope.signalId,
    instructionRef: envelope.instructionRef,
    interpretedIntent: envelope.interpretedIntent,
    teoId: teo.id,
    executionInterface: result.executionInterface,
    executedAt: result.executedAt,
    actualActor: result.actualActor,
    actualAction: result.actualAction,
    runtimeEvidence: [...result.runtimeEvidence],
    transactionEvidence: [...result.transactionEvidence],
    stateEvidence: {},
    executionStatus: result.status,
    outcome: result.outcome,
    error: result.error,
    decision: "BUILD",
    executable: true,
    executed: true,
    trust: 0,
    authorityStatus: "VERIFIED",
    authorityEvidence: ["SYNTHETIC-DEMO-AUTHORITY"],
    authorityVerified: true,
    missingAuthority: [],
    missingEvidence: [],
    directives: [],
    provenance: {
      signalRef: envelope.signalId,
      policyVersion: "demo-only",
    },
  });

  const scenarios = [
    {
      name: "Matching simulated execution",
      expected: "CONFORMED",
      receipt,
    },
    {
      name: "Unauthorized action",
      expected: "DEVIATED",
      receipt: { ...receipt, actualAction: "delete" },
    },
    {
      name: "Missing authority evidence",
      expected: "INDETERMINATE",
      receipt: {
        ...receipt,
        authorityStatus: "UNKNOWN" as const,
        authorityVerified: null,
        authorityEvidence: [],
      },
    },
  ];

  for (const scenario of scenarios) {
    const comparison = compareEnvelopeToReceipt(
      envelope,
      scenario.receipt
    );
    console.log(scenario.name, comparison);
    if (comparison.status !== scenario.expected) {
      throw new Error(
        `${scenario.name}: expected ${scenario.expected}, got ${comparison.status}`
      );
    }
  }
  console.log("All three controlled scenarios matched expectations.");
}

main().catch((error) => {
  console.error(error);
  throw error;
});

