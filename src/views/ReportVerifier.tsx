import { useState } from "react";
import { verifyControlledConformanceReport } from "../forge/conformance/verifyControlledConformanceReport";
import type { ConformanceReport } from "../forge/conformance/ConformanceReport";

type Result = {
  number: number;
  verified: boolean;
  status?: string;
  violations?: string[];
};

export default function ReportVerifier() {
  const [file, setFile] = useState<File | null>(null);
  const [digest, setDigest] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify() {
    setResults([]);
    setError("");
    const expectedDigest = digest.trim();
    if (!file || !/^[a-f0-9]{64}$/.test(expectedDigest)) {
      setError("Choose a JSON file and enter a 64-character lowercase envelope digest.");
      return;
    }
    setBusy(true);
    try {
      const value: unknown = JSON.parse(await file.text());
      const reports: unknown[] = Array.isArray(value) ? value : [value];
      if (reports.length === 0) throw new Error("The file contains no reports.");
      const checked: Result[] = [];
      for (const [index, report] of reports.entries()) {
        const verified = await verifyControlledConformanceReport(
          report, expectedDigest
        );
        const result: Result = { number: index + 1, verified };
        if (verified) {
          const valid = report as ConformanceReport;
          result.status = valid.comparison.status;
          result.violations = valid.comparison.violatedConstraint;
        }
        checked.push(result);
      }
      setResults(checked);
    } catch {
      setError("Could not read this file as a report or report array. Choose valid JSON.");
    } finally {
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
        <a href="/">Back to Forge</a>
        <h1>TradeTag Report Verifier</h1>
        <p>Check a saved controlled conformance report.</p>
        <p>
          Demo scope: synthetic authority, SHA-256 integrity, simulated anchoring.
          Verification checks evidence consistency against your trusted envelope digest.
        </p>

        <fieldset disabled={busy} style={{
          border: "1px solid #ddd", borderRadius: 12, padding: 24
        }}>
          <legend>Saved report</legend>
          <label htmlFor="report-file">Report JSON file</label>
          <input
            id="report-file" type="file" accept=".json,application/json"
            style={{ display: "block", margin: "12px 0 24px", maxWidth: "100%" }}
            onChange={event => {
              setFile(event.target.files?.[0] ?? null);
              setResults([]);
              setError("");
            }}
          />
          <label htmlFor="envelope-digest">Trusted envelope digest</label>
          <p id="digest-help">
            Use the digest saved separately when the envelope was frozen.
            Copying it from this report only checks internal consistency.
          </p>
          <input
            id="envelope-digest" value={digest}
            aria-describedby="digest-help"
            spellCheck={false} autoComplete="off"
            style={{
              width: "100%", boxSizing: "border-box", padding: 12,
              border: "1px solid #aaa", borderRadius: 8, fontFamily: "monospace"
            }}
            onChange={event => {
              setDigest(event.target.value);
              setResults([]);
              setError("");
            }}
          />
          <button
            type="button" onClick={verify}
            disabled={!file || !/^[a-f0-9]{64}$/.test(digest.trim())}
            style={{ marginTop: 20, padding: "12px 20px", cursor: "pointer" }}
          >
            {busy ? "Checking..." : "Verify reports"}
          </button>
        </fieldset>

        {error && <p role="alert">{error}</p>}
        <section aria-live="polite" aria-busy={busy}>
          {results.map(result => (
            <article key={result.number} style={{
              marginTop: 16, padding: 20,
              border: "1px solid #ddd", borderRadius: 12
            }}>
              <h2>Report {result.number}</h2>
              <p>
                {result.verified
                  ? "Integrity and comparison verified"
                  : "Verification failed"}
              </p>
              {result.verified && <>
                <p>Conformance outcome: <strong>{result.status}</strong></p>
                <p>
                  Violated constraints: {result.violations?.join(", ") || "None"}
                </p>
              </>}
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
