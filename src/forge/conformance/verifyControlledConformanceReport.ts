import type { ConformanceReport } from "./ConformanceReport";
import { createControlledConformanceReport } from "./createControlledConformanceReport";

export async function verifyControlledConformanceReport(
  value: unknown,
  expectedEnvelopeDigest: string
): Promise<boolean> {
  try {
    if (!/^[a-f0-9]{64}$/.test(expectedEnvelopeDigest)) return false;

    const report = JSON.parse(JSON.stringify(value)) as ConformanceReport;

    if (
      report.version !== "0.1" ||
      report.kind !== "TradeTag.ConformanceReport" ||
      typeof report.reportId !== "string" ||
      report.reportId.trim() === "" ||
      typeof report.generatedAt !== "string" ||
      !Number.isFinite(Date.parse(report.generatedAt)) ||
      report.scope.execution !== "controlled-demo" ||
      report.scope.authority !== "synthetic" ||
      report.scope.seal !== "sha256-integrity" ||
      report.scope.anchoring !== "simulated" ||
      report.frozenEnvelope.envelopeDigest !== expectedEnvelopeDigest ||
      report.comparison.version !== "0.1" ||
      !Array.isArray(report.comparison.violatedConstraint) ||
      !report.comparison.violatedConstraint.every(
        (constraint) => typeof constraint === "string"
      )
    ) {
      return false;
    }

    const recomputed = await createControlledConformanceReport(
      report.frozenEnvelope,
      report.sealedReceipt,
      report.anchor
    );

    return (
      report.receiptDigest === recomputed.receiptDigest &&
      report.comparison.status === recomputed.comparison.status &&
      JSON.stringify([...report.comparison.violatedConstraint].sort()) ===
        JSON.stringify([...recomputed.comparison.violatedConstraint].sort())
    );
  } catch {
    return false;
  }
}
