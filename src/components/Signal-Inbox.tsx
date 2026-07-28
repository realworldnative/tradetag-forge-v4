import type { Signal } from "../../shared/types";
import { Btn, Card, Chip } from "./ui";
import { T } from "../lib/config";
import { finalScore } from "../lib/engine";

type SignalInboxProps = {
  signals: Signal[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function SignalInbox({
  signals,
  selectedId,
  onSelect,
}: SignalInboxProps) {
  return (
    <>
      <h2 style={{ fontSize: 16, margin: "0 0 12px" }}>Signal Inbox</h2>

      {signals.map((signal) => {
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
                selectedId === signal.id
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
                primary={selectedId === signal.id}
                onClick={() => onSelect(signal.id)}
              >
                {selectedId === signal.id ? "Selected" : "Review"}
              </Btn>
            </div>
          </Card>
        );
      })}
    </>
  );
}
