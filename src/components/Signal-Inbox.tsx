import type { Signal } from "../../shared/types";
import { Btn, Card, Chip } from "./ui";
import { T } from "../lib/config";
import { finalScore } from "../lib/engine";
import SignalCard from "./SignalCard";
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

      {signals.map((signal) => (
  <SignalCard
    key={signal.id}
    signal={signal}
    selected={selectedId === signal.id}
    onSelect={onSelect}
  />
))}
    </>
  );
}
