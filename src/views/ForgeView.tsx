import { useMemo, useState } from "react";
import type { Signal } from "../../shared/types";
import { Btn, Card, Chip, SectionTitle } from "../components/ui";
import SignalInbox from "../components/Signal-Inbox";
import { BRANDS, T, font } from "../lib/config";
import { finalScore, scoreBand } from "../lib/engine";
import { initialState } from "../lib/seed";

export default function ForgeView() {
  const [selectedId, setSelectedId] = useState(
    initialState.signals[0]?.id ?? ""
  );

  const selectedSignal = useMemo(
    () =>
      initialState.signals.find((signal) => signal.id === selectedId) ??
      initialState.signals[0],
    [selectedId]
  );

  const selectedAnalysis = selectedSignal?.analysis;
  const selectedScore = selectedAnalysis
    ? finalScore(selectedAnalysis.scores, selectedAnalysis.penalties)
    : null;

  function renderSignalCard(signal: Signal) {
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
                          {selectedAnalysis.decision} →{" "}
                          {selectedAnalysis.publicName}
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
                          <b>Why now:</b> {selectedAnalysis.whyNow}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 16,
                          flexWrap: "wrap",
                        }}
                      >
                        <Btn primary>Build</Btn>
                        <Btn>Merge</Btn>
                        <Btn>Watch</Btn>
                        <Btn danger>Reject</Btn>
                      </div>
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
