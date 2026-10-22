import { useMemo, useState } from "react";
import type { Signal } from "../../shared/types";
import { Btn, Card, Chip, SectionTitle } from "../components/ui";
import SignalInbox from "../components/Signal-Inbox";
import { BRANDS, T, font } from "../lib/config";
import { finalScore, scoreBand } from "../lib/engine";
import { initialState } from "../lib/seed";
import { signalToPrompt } from "../forge/intelligence/signalToPrompt";
import { clusterSignals } from "../forge/intelligence/signalCluster";
import { interpretCluster } from "../forge/intelligence/clusterInterpreter";
import { buildEvidenceReport } from "../forge/intelligence/evidenceReport";
import { buildAuthorityReport } from "../forge/intelligence/authorityReport";
import { buildActionPlan } from "../forge/intelligence/actionPlan";
import { buildExecutionEnvelope } from "../forge/chain/buildEnvelope";
import { compileSignal } from "../forge/compiler/compileSignal";
import { createExecutionReceipt } from "../forge/runtime/createExecutionReceipt";
import type { ExecutionReceipt } from "../forge/runtime/ExecutionReceipt";
import { buildExecutionTimeline } from "../forge/intelligence/executionTimeline";
import { sealExecutionReceipt } from "../forge/runtime/sealExecutionReceipt";
import type { SealedExecutionReceipt } from "../forge/runtime/SealedExecutionReceipt";
import { createExecutionIdentity } from "../forge/runtime/createExecutionIdentity";
import type { ExecutionIdentity } from "../forge/runtime/ExecutionIdentity";
import { createExecutionAnchorCandidate } from "../forge/runtime/createExecutionAnchorCandidate";
import type { ExecutionAnchorCandidate } from "../forge/runtime/ExecutionAnchorCandidate";
import type { ExecutionAnchorTarget } from "../forge/runtime/ExecutionAnchorTarget";
import {
  createExecutionAnchorRequest,
  type ExecutionAnchorRequest,
} from "../forge/runtime/createExecutionAnchorRequest";
import { ExecutionAnchorResult } from "../forge/runtime/ExecutionAnchorResult";
import { getExecutionAdapter } from "../forge/runtime/getExecutionAdapter";
import { getExecutionAnchorAdapter } from "../forge/runtime/getExecutionAnchorAdapter";
import { compareEnvelopeToReceipt } from "../forge/conformance/compareEnvelopeToReceipt";
import type { ConformanceResult } from "../forge/conformance/ConformanceResult";
import { getReceiptProfileRequirements } from "../forge/runtime/ReceiptProfile";
import { evaluateReceiptAssurance } from "../forge/runtime/evaluateReceiptAssurance";
import type { ReceiptAssuranceResult } from "../forge/runtime/ReceiptAssuranceResult";
import { createExecutionReceiptDigest } from "../forge/runtime/createExecutionReceiptDigest";
import type { AuthorityClaim } from "../forge/core/Authority";

export default function ForgeView() {
  const [lastSealedReceipt, setLastSealedReceipt] =
  useState<SealedExecutionReceipt | null>(null);

const [lastReceipt, setLastReceipt] = useState<ExecutionReceipt | null>(null);
const [lastExecutionIdentity, setLastExecutionIdentity] =
  useState<ExecutionIdentity | null>(null);
  const [lastAnchorCandidate, setLastAnchorCandidate] =
  useState<ExecutionAnchorCandidate | null>(null);
  const [lastConformanceResult, setLastConformanceResult] =
  useState<ConformanceResult | null>(null);
  const [lastAssuranceResult, setLastAssuranceResult] =
  useState<ReceiptAssuranceResult | null>(null);
  const [lastAnchorRequest, setLastAnchorRequest] =
  useState<ExecutionAnchorRequest | null>(null);
  const [lastAnchorResult, setLastAnchorResult] =
  useState<ExecutionAnchorResult | null>(null);
  const defaultAnchorTarget: ExecutionAnchorTarget = {
  version: "0.1",
  type: "GENESIS_GRID",
  targetId: "genesis-grid",
};
const anchorAdapter =
  getExecutionAnchorAdapter(defaultAnchorTarget);
  const [selectedId, setSelectedId] = useState(
    initialState.signals[0]?.id ?? ""

  );
const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const selectedSignal = useMemo(


    () =>
      initialState.signals.find((signal) => signal.id === selectedId) ??
      initialState.signals[0],
    [selectedId]
  );
  const signalClusters = clusterSignals(initialState.signals);
  const clusterInsight = interpretCluster(initialState.signals);
function toggleWatch(id: string) {
  setWatchedIds((current) =>
    current.includes(id)
      ? current.filter((watchedId) => watchedId !== id)
      : [...current, id]
  );
}
const promptRecommendation = selectedSignal
  ? signalToPrompt(selectedSignal)
  : null;
  const evidenceReport = selectedSignal
  ? buildEvidenceReport(selectedSignal)
  : null;

  const controlledAuthorityClaim: AuthorityClaim = {
  id: "test-authority-claim",
  source: "human",
  subjectId: "test-agent",
  scope: ["execute"],
  status: "verified",
  issuedAt: "2026-10-05T00:00:00.000Z",
  expiresAt: "2099-12-31T23:59:59.999Z",
  evidenceRefs: ["test-identity-credential", "test-delegation-credential"],
};

const authorityReport = selectedSignal
  ? buildAuthorityReport(selectedSignal)
  : null;

  const actionPlan = selectedSignal
  ? buildActionPlan(selectedSignal)
  : null;
  const selectedAnalysis = selectedSignal?.analysis;
  const selectedScore = selectedAnalysis
    ? finalScore(selectedAnalysis.scores, selectedAnalysis.penalties)
    : null;
const executionEnvelope = buildExecutionEnvelope(selectedSignal);
  const activeReceiptProfile = "STANDARD" as const;
  const receiptProfileRequirements =
  getReceiptProfileRequirements(activeReceiptProfile);
  const compiledSignal = selectedSignal
  ? compileSignal(selectedSignal)
  : null;
  const teo = compiledSignal?.teo ?? null;
  const executionTimeline = selectedSignal
  ? buildExecutionTimeline(selectedSignal, lastReceipt)
  : null;
  {executionTimeline && (
  <div
    style={{
      marginTop: 14,
      padding: 14,
      border: `1px solid ${T.line}`,
      borderRadius: 12,
      background: T.card,
    }}
  >
    <div
      style={{
        fontWeight: 700,
        marginBottom: 12,
      }}
    >
      Execution Timeline
    </div>

    <div style={{ display: "grid", gap: 10 }}>
      {executionTimeline.steps.map((step) => (
        <div
          key={step.id}
          style={{
            display: "grid",
            gridTemplateColumns: "20px 1fr",
            gap: 10,
            alignItems: "start",
          }}
        >
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.4,
            }}
          >
            {step.status === "complete"
              ? "✓"
              : step.status === "recorded"
                ? "●"
                : step.status === "blocked"
                  ? "×"
                  : "○"}
          </div>

          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {step.label}
            </div>

            <div
              style={{
                marginTop: 2,
                fontSize: 12,
                color: T.sub,
                lineHeight: 1.5,
              }}
            >
              {step.detail}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
async function handleExecutionDecision(  decision: "BUILD" | "MERGE" | "WATCH" | "REJECT"
) {
  if (!teo || !selectedSignal) {
    return;
  }
let executionResult;

if (!executionEnvelope.executable) {
  executionResult = {
    version: "0.1" as const,
    status: "BLOCKED" as const,
    executionInterface: executionEnvelope.executionInterfaceRef,
    executedAt: null,
    actualActor: null,
    actualAction: null,
    authorityStatus: executionEnvelope.authority.verified
      ? ("VERIFIED" as const)
      : ("UNKNOWN" as const),
    authorityEvidence: [],
    runtimeEvidence: ["execution-blocked-by-envelope"],
    transactionEvidence: [],
    outcome: "blocked-before-execution",
    error: null,
  };
} else {
  const executionAdapter = getExecutionAdapter(
    executionEnvelope.executionInterfaceRef
  );

  executionResult = await executionAdapter.execute(teo);
}console.log("CONTROLLED EXECUTION RESULT", executionResult);
console.log("Execution Result", executionResult);
console.log("Execution Envelope", executionEnvelope);
const receipt = await createExecutionReceipt(
  {    version: "0.1",
    profile: activeReceiptProfile,    signalId: selectedSignal.id,
    instructionRef: selectedSignal.id,
    interpretedIntent: executionEnvelope.interpretedIntent,
    teoId: teo.id,
executionInterface: executionResult.executionInterface,
executedAt: executionResult.executedAt,
actualActor: executionResult.actualActor,
actualAction: executionResult.actualAction,

runtimeEvidence: executionResult.runtimeEvidence,
transactionEvidence: executionResult.transactionEvidence,

stateEvidence: executionResult.stateEvidence ?? {},

executionStatus: executionResult.status,
outcome: executionResult.outcome,
error: executionResult.error,

decision,
    executable: teo.executable,
executed: executionResult.status === "SUCCEEDED",

trust: teo.estimatedTrust,

authorityStatus: executionResult.authorityStatus ?? "UNKNOWN",
authorityEvidence: [...(executionResult.authorityEvidence ?? [])],

authorityVerified:
  executionResult.authorityStatus === "VERIFIED"
    ? true
    : executionResult.authorityStatus === "REJECTED"
      ? false
      : null,
      missingAuthority: [...executionEnvelope.authority.missing],

    missingEvidence: [...teo.evidence.missing],
    directives: [...teo.directives],

    provenance: {
      signalRef: teo.provenance.signalRef,
      policyVersion: teo.provenance.policyVersion,
    },
  });
  const conformanceResult = compareEnvelopeToReceipt(
  executionEnvelope,
  receipt
);
const assuranceResult = evaluateReceiptAssurance(
  receipt,
  conformanceResult
);
setLastAssuranceResult(assuranceResult);
console.log("Receipt Assurance Result", assuranceResult);
setLastConformanceResult(conformanceResult);
console.log("Conformance Result", conformanceResult);
setLastReceipt(receipt);
  console.log("Execution Receipt", receipt);
sealExecutionReceipt(receipt)
.then(async (sealed) => {
  setLastSealedReceipt(sealed);

const receiptDigest =
  await createExecutionReceiptDigest(sealed.receipt);

const executionIdentity =
  createExecutionIdentity(sealed, receiptDigest);


  setLastExecutionIdentity(executionIdentity);
const anchorCandidate =
  createExecutionAnchorCandidate(executionIdentity);

setLastAnchorCandidate(anchorCandidate);
console.log("Execution Anchor Candidate", anchorCandidate);
const anchorRequest =
  createExecutionAnchorRequest(
    anchorCandidate,
    defaultAnchorTarget
  );
setLastAnchorRequest(anchorRequest);

const completedAnchor =
await anchorAdapter.anchor(anchorRequest);
setLastAnchorResult(completedAnchor);

console.log("Execution Anchor Result", completedAnchor);
console.log("Execution Anchor Request", anchorRequest);
  console.log("Sealed Execution Receipt", sealed);
  console.log("Execution Identity", executionIdentity);
})
  .catch((error) => {
    console.error("Execution receipt seal failed", error);
  });
  if (decision === "WATCH") {
    toggleWatch(selectedSignal.id);
  }
}  function renderSignalCard(signal: Signal) {
    const analysis = signal.analysis;
    const score = analysis
      ? finalScore(analysis.scores, analysis.penalties)
      : null;

    return (
      <Card
        key={signal.id}
        style={{
          background: "#FFF",
          marginBottom: 10,
          border:
            selectedSignal?.id === signal.id
              ? `1.5px solid ${T.ink}`
              : `1px solid ${T.line}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <Chip
                color={signal.origin === "LIVE" ? T.green : T.faint}
                bg={signal.origin === "LIVE" ? T.greenSoft : T.card}
              >
                {signal.origin}
              </Chip>

              <Chip>{signal.publisher}</Chip>

              {score && (
                <Chip color={T.gold} bg={T.goldSoft}>
                  Score {score.final}
                </Chip>
              )}
            </div>

            <h3 style={{ margin: "0 0 6px", fontSize: 17 }}>
              {signal.headline}
            </h3>

            <p
              style={{
                margin: 0,
                color: T.sub,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              {signal.summary}
            </p>
          </div>

          <Btn
            small
            primary={selectedSignal?.id === signal.id}
            onClick={() => setSelectedId(signal.id)}
          >
            {selectedSignal?.id === signal.id ? "Selected" : "Review"}
          </Btn>
        </div>
      </Card>
    );
  }

  return (
    <div
      style={{
        fontFamily: font,
        background: T.bg,
        color: T.ink,
        minHeight: "100vh",
        padding: 40,
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <SectionTitle
          eyebrow="Signal Intelligence"
          title="TradeTag Forge"
          sub="Review incoming opportunities before approving a build, merge, watch, or rejection."
        />
<div
  style={{
    background: T.card,
    border: `1px solid ${T.line}`,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  }}
>
  <div style={{ fontWeight: 700 }}>
    Signal Cluster
  </div>

  <div
    style={{
      fontSize: 13,
      color: T.sub,
      marginTop: 6,
    }}
  >
{clusterInsight.title}  </div>
<div
  style={{
    fontSize: 12,
    color: T.sub,
    marginTop: 6,
    lineHeight: 1.5,
  }}
>
  {clusterInsight.summary}
</div>
  <div
    style={{
      marginTop: 8,
      fontSize: 12,
      color: T.sub,
    }}
  >
    {signalClusters[0]?.signalIds.length} signals • Average Trust{" "}
    {signalClusters[0]?.averageTrustScore}
  </div>
</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.15fr) minmax(300px, .85fr)",
            gap: 20,
            alignItems: "start",
          }}
        >
<section>
  <SignalInbox
    signals={initialState.signals}
    selectedId={selectedId}
    onSelect={setSelectedId}
  />
</section>
          <section>
            <Card style={{ background: "#FFF", position: "sticky", top: 20 }}>
              {!selectedSignal ? (
                <p>No signal selected.</p>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip>{selectedSignal.origin}</Chip>

                    {selectedAnalysis && (
                      <Chip>
                        {BRANDS.find(
                          (brand) => brand.id === selectedAnalysis.brandId
                        )?.name ?? selectedAnalysis.brandId}
                      </Chip>
                    )}
                  </div>

                  <h2 style={{ fontSize: 20, margin: "0 0 8px" }}>
                    {selectedSignal.headline}
                  </h2>

                  <p
                    style={{
                      color: T.sub,
                      fontSize: 13.5,
                      lineHeight: 1.55,
                    }}
                  >
                    {selectedSignal.problem}
                  </p>

                  {!selectedAnalysis || !selectedScore ? (
                    <p>This signal has not been scored yet.</p>
                  ) : (
                    <>
                      <div
                        style={{
                          background: T.card,
                          border: `1px solid ${T.line}`,
                          borderRadius: 14,
                          padding: 14,
                          marginTop: 14,
                        }}
                      >
                        <div style={{ fontSize: 12, color: T.sub }}>
                          Recommendation
                        </div>

                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            marginTop: 3,
                          }}
                        >
                          {promptRecommendation?.title ??"No recommendation"}
                        </div>

                        <div
                          style={{
                            marginTop: 10,
                            fontSize: 13,
                            lineHeight: 1.6,
                          }}
                        >
                          <b>Final score:</b> {selectedScore.final}
                          <br />
                          <b>Band:</b> {scoreBand(selectedScore.final)}
                          <br />
                          <b>Why now:</b> {promptRecommendation?.explanation?? "No explanation is availablefor this signal."}                      </div>
                      </div>{evidenceReport && (
  <div
    style={{
      marginTop: 18,
      padding: 14,
      border: `1px solid ${T.line}`,
      borderRadius: 12,
      background: T.card
    }}
  >
    <div
      style={{
        fontWeight: 700,
        marginBottom: 10,
      }}
    >
      Evidence Breakdown
    </div>

    <div style={{ fontSize: 13, lineHeight: 1.7 }}>
      <div>Confidence: {evidenceReport.confidence}</div>
      <div>Evidence: {evidenceReport.evidence}</div>
      <div>Authority: {evidenceReport.authority}</div>
      <div>Final Trust Score: {evidenceReport.finalScore}</div>
    </div>

    <div style={{ marginTop: 12 }}>
      {evidenceReport.explanation.map((line, index) => (
        <div
          key={index}
          style={{
            fontSize: 12,
            color: T.sub,
            marginBottom: 4,
          }}
        >
          • {line}
        </div>
      ))}
    </div>
  </div>
)}
{authorityReport && (
  <div
    style={{
      marginTop: 14,
      padding: 14,
      border: `1px solid ${T.line}`,
      borderRadius: 12,
      background: T.card,
    }}
  >
    <div
      style={{
        fontWeight: 700,
        marginBottom: 10,
      }}
    >
      Authority Status
    </div>

    <div style={{ fontSize: 13, lineHeight: 1.7 }}>
      <div>Status: {authorityReport.status}</div>
      <div>Authority Score: {authorityReport.authority}</div>
      <div>
        Verified: {authorityReport.verified ? "Yes" : "No"}
      </div>
    </div>

    <div
      style={{
        marginTop: 10,
        fontSize: 12,
        color: T.sub,
        lineHeight: 1.5,
      }}
    >
      {authorityReport.explanation}
    </div>
  </div>
)}
{actionPlan && (
  <div
    style={{
      marginTop: 14,
      padding: 14,
      border: `1px solid ${T.line}`,
      borderRadius: 12,
      background: T.card,
    }}
  >
    <div
      style={{
        fontWeight: 700,
        marginBottom: 10,
      }}
    >
      Action Plan
    </div>

    <div style={{ fontSize: 13, marginBottom: 10 }}>
      <strong>Can Act:</strong> {actionPlan.canAct ? "Yes" : "No"}
    </div>

    <div
      style={{
        fontSize: 12,
        color: T.sub,
        marginBottom: 12,
      }}
    >
      {actionPlan.reason}
    </div>

    {actionPlan.steps.map((step) => (
      <div
        key={step.id}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "6px 0",
          borderBottom: `1px solid ${T.line}`,
        }}
      >
        <span>{step.label}</span>

        <span>
          {step.completed ? "✓" : "○"}
        </span>
      </div>
    ))}

    <div
      style={{
        marginTop: 12,
        fontWeight: 600,
      }}
    >
      Projected Trust Score: {actionPlan.projectedTrustScore}
    </div>
  </div>
)}
{executionEnvelope && (
  <div
    style={{
      marginTop: 14,
      padding: 14,
      border: `1px solid ${T.line}`,
      borderRadius: 12,
      background: T.card,
    }}
  >
    <div
      style={{
        fontWeight: 700,
        marginBottom: 10,
      }}
    >
      Execution Envelope
    </div>

    <div style={{ fontSize: 13, lineHeight: 1.7 }}>
      <div>Version: {executionEnvelope.version}</div>
      <div>
        Executable: {executionEnvelope.executable ? "Yes" : "No"}
      </div>
      <div>Decision: {executionEnvelope.decision}</div>
      <div>Estimated Trust: {executionEnvelope.estimatedTrust}</div>
    </div>

    <div
      style={{
        marginTop: 12,
        fontSize: 12,
        color: T.sub,
        lineHeight: 1.5,
      }}
    >
      <div>
        Missing Authority:{" "}
        {executionEnvelope.authority.missing.length > 0
          ? executionEnvelope.authority.missing.join(", ")
          : "None"}
      </div>

      <div>
        Missing Evidence:{" "}
        {executionEnvelope.evidence.missing.length > 0
          ? executionEnvelope.evidence.missing.join(", ")
          : "None"}
      </div>

      <div>
        Directives:{" "}
        {executionEnvelope.directives.length > 0
          ? executionEnvelope.directives.join(" • ")
          : "No corrective directives required"}
      </div>
    </div>

    <div
      style={{
        marginTop: 12,
        paddingTop: 10,
        borderTop: `1px solid ${T.line}`,
        fontSize: 11,
        color: T.sub,
      }}
    >
      Signal Ref: {executionEnvelope.provenance.signalRef}
      <br />
      Policy: {executionEnvelope.provenance.policyVersion}
    </div>
  </div>
)}
{lastSealedReceipt && (
  <div
    style={{
      marginTop: 12,
      padding: 12,
      borderTop: "1px solid #ddd",
    }}
  >
    <strong>Receipt Seal</strong>
    <br />
<br />

    <strong>Receipt Profile</strong>
<br />
Profile: {activeReceiptProfile}
<br />
Requires Authority: {receiptProfileRequirements.authority ? "Yes" : "No"}
<br />
Requires Evidence: {receiptProfileRequirements.evidence ? "Yes" : "No"}
<br />
Requires State: {receiptProfileRequirements.state ? "Yes" : "No"}
<br />
Requires Conformance: {receiptProfileRequirements.conformance ? "Yes" : "No"}
<br />
<br />
    <div
      style={{
        marginTop: 8,
        fontSize: 11,
        wordBreak: "break-all",
      }}
    >

      {lastExecutionIdentity && (
  <>
    <br />
    <strong>Execution Identity</strong>
    <br />
    Version: {lastExecutionIdentity.version}
<br />
    Signal: {lastExecutionIdentity.signalId}
    <br />
    Decision: {lastExecutionIdentity.decision}
    <br />
    Digest: {lastExecutionIdentity.sealDigest}
  </>
)}
{lastAnchorCandidate && (
  <>
    <br />
    <strong>Anchor Candidate</strong>
    <br />
    Status: {lastAnchorCandidate.anchorStatus}
    <br />
    Signal: {lastAnchorCandidate.signalId}
    <br />
    Decision: {lastAnchorCandidate.decision}
    {lastAnchorRequest && (
  <>
    <br />
    <strong>Anchor Request</strong>
    <br />
    Target Type: {lastAnchorRequest.target.type}
    <br />
    Target ID: {lastAnchorRequest.target.targetId}
  </>
)}
{lastAnchorResult && (
  <>
    <br />
    <strong>Anchor Result</strong>
    <br />
    Status: {lastAnchorResult.status}
    Mode: {lastAnchorResult.anchorMode ?? "unknown"}
<br />
    <br />
    Anchored At: {lastAnchorResult.anchoredAt ?? "Pending"}
<br />
Anchor Reference: {lastAnchorResult.anchorRef ?? "Pending"}
{lastAnchorResult.error && (
  <>
    Error: {lastAnchorResult.error}
    <br />
  </>
)}
{lastConformanceResult && (
  <>
    <br />
    <strong>Conformance</strong>
    <br />
    Status: {lastConformanceResult.status}
    <br />
    Violated Constraints:{" "}
    {lastConformanceResult.violatedConstraint.length > 0
      ? lastConformanceResult.violatedConstraint.join(", ")
      : "None"}
  </>
)}
{lastAssuranceResult && (
  <>
    <br />
    <strong>Receipt Assurance</strong>
    <br />
    Status: {lastAssuranceResult.status}
    <br />
    Unmet Requirements:{" "}
    {lastAssuranceResult.unmetRequirement.length > 0
      ? lastAssuranceResult.unmetRequirement.join(", ")
      : "None"}
  </>
)}
<br />
Target Type: {lastAnchorResult.target.type}
<br />
Target ID: {lastAnchorResult.target.targetId}
  </>
)}

    <br />
Digest: {lastAnchorCandidate.sealDigest}
  </>
)}
    </div>
  </div>
)}
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 16,
                          flexWrap: "wrap",
                        }}
                      >
<Btn
  primary
  onClick={() => handleExecutionDecision("BUILD")}
>
  Build
</Btn>

<Btn
  onClick={() => handleExecutionDecision("MERGE")}
>
  Merge
</Btn>

<Btn
  onClick={() => handleExecutionDecision("WATCH")}
>
  {selectedSignal && watchedIds.includes(selectedSignal.id)
    ? "Watching"
    : "Watch"}
</Btn>

<Btn
  danger
  onClick={() => handleExecutionDecision("REJECT")}
>
  Reject
</Btn>                      </div>
                    </>
                  )}
                </>
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
