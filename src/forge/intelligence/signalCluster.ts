import type { Signal } from "../../../shared/types";
import { generateTrustReport } from "./trustReport";

export interface SignalCluster {
  id: string;
  label: string;
  signalIds: string[];
  sharedTerms: string[];
  averageTrustScore: number;
  recommendedAction: "build" | "merge" | "watch" | "reject";
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length >= 5);
}

function sharedTerms(signals: Signal[]): string[] {
  const counts = new Map<string, number>();

  for (const signal of signals) {
    const terms = new Set(
      tokenize(`${signal.headline} ${signal.summary} ${signal.problem}`)
    );

    for (const term of terms) {
      counts.set(term, (counts.get(term) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([term]) => term)
    .sort();
}

export function clusterSignals(
  signals: Signal[]
): SignalCluster[] {
  if (signals.length === 0) {
    return [];
  }

  const terms = sharedTerms(signals);
  const reports = signals.map(generateTrustReport);

  const averageTrustScore = Math.round(
    reports.reduce(
      (total, report) => total + report.trustScore,
      0
    ) / reports.length
  );

  const recommendedAction =
    reports.some((report) => report.decision === "build")
      ? "build"
      : reports.some((report) => report.decision === "merge")
        ? "merge"
        : reports.every((report) => report.decision === "reject")
          ? "reject"
          : "watch";

  return [
    {
      id: `cluster-${signals
        .map((signal) => signal.id)
        .sort()
        .join("-")}`,
      label:
        terms.length > 0
          ? terms.slice(0, 3).join(" / ")
          : "Unclassified trust pattern",
      signalIds: signals.map((signal) => signal.id),
      sharedTerms: terms,
      averageTrustScore,
      recommendedAction,
    },
  ];
}
