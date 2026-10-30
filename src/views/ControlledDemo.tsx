import { useRef, useState } from "react";
import type { ConformanceReport } from "../forge/conformance/ConformanceReport";

type DemoBundle = {
  digest: string;
  reports: ConformanceReport[];
  filename: string;
};

function download(filename: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ControlledDemo() {
  const running = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [bundle, setBundle] = useState<DemoBundle | null>(null);

  async function run() {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setBundle(null);
    setError("");
    setMessage("Starting controlled demonstration...");
    try {
      const { main } = await import("../forge/chain/controlledConformanceDemo");
      const { sealAndAnchorControlledReceipt } =
        await import("../forge/runtime/sealAndAnchorControlledReceipt");
      const { createControlledConformanceReport } =
        await import("../forge/conformance/createControlledConformanceReport");
      const { verifyControlledConformanceReport } =
        await import("../forge/conformance/verifyControlledConformanceReport");

      const reports: ConformanceReport[] = [];
      let digest = "";

      await main(async (receipt, frozen) => {
        if (!digest) digest = frozen.envelopeDigest;
        if (digest !== frozen.envelopeDigest) {
          throw new Error("Unexpected envelope change.");
        }
        setMessage(`Sealing and checking scenario ${reports.length + 1} of 3...`);
        const { sealed, anchor } = await sealAndAnchorControlledReceipt(receipt);
        const report = await createControlledConformanceReport(
          frozen, sealed, anchor
        );
        const portable: ConformanceReport = JSON.parse(JSON.stringify(report));
        if (!await verifyControlledConformanceReport(portable, digest)) {
          throw new Error("Portable report verification failed.");
        }
        reports.push(portable);
        return sealed.receipt;
      });

      const expected = ["CONFORMED", "DEVIATED", "INDETERMINATE"];
      if (
        reports.length !== expected.length ||
        reports.some((report, index) => report.comparison.status !== expected[index])
      ) {
        throw new Error("The three scenarios did not match expectations.");
      }

      setBundle({
        digest,
        reports,
        filename: `TradeTag-Demo-${reports[0].reportId}`,
      });
      setMessage("All three scenarios matched expectations. Downloads are ready.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The demo could not finish.");
      setMessage("");
    } finally {
      running.current = false;
      setBusy(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh", background: "#fff", color: "#171717",
      fontFamily: "system-ui, sans-serif", padding: "40px 24px",
      boxSizing: "border-box"
    }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <nav style={{ display: "flex", gap: 24 }}>
          <a href="/">Back to Forge</a>
          <a href="/verify">Open report verifier</a>
        </nav>
        <h1>TradeTag Controlled Demo</h1>
        <p>Run three scenarios. Save the evidence. Check it again later.</p>
        <p>
          Synthetic authority, SHA-256 integrity, and simulated anchoring.
          This demo calls the configured seal service. No payment or blockchain
          transaction is performed.
        </p>
        <button
          type="button" disabled={busy} onClick={run}
          style={{ padding: "12px 20px", cursor: "pointer" }}
        >
          {busy ? "Running..." : "Run controlled demo"}
        </button>
        <p role="status">{message}</p>
        {error && <p role="alert">{error}</p>}

        {bundle && <>
          <section style={{
            border: "1px solid #ddd", borderRadius: 12, padding: 24
          }}>
            <h2>Save this run</h2>
            <p>Original envelope digest:</p>
            <code style={{ overflowWrap: "anywhere" }}>{bundle.digest}</code>
            <p>
              Keep the digest separately as your reference for this run.
              It is not a signature or blockchain proof.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" onClick={() => download(
                `${bundle.filename}-Reports.json`,
                JSON.stringify(bundle.reports, null, 2),
                "application/json"
              )}>Download reports</button>
              <button type="button" onClick={() => download(
                `${bundle.filename}-Envelope-Digest.txt`,
                bundle.digest + "\n",
                "text/plain"
              )}>Download envelope digest</button>
            </div>
          </section>
          {bundle.reports.map((report, index) => (
            <article key={report.reportId} style={{
              marginTop: 16, border: "1px solid #ddd",
              borderRadius: 12, padding: 20
            }}>
              <h2>Scenario {index + 1}: {report.comparison.status}</h2>
              <p>Report integrity and comparison verified.</p>
              <p>
                Violated constraints: {report.comparison.violatedConstraint.join(", ") || "None"}
              </p>
            </article>
          ))}
        </>}
      </div>
    </main>
  );
}
