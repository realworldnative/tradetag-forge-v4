import type { Signal } from "../../../shared/types";

export interface ClusterInsight {
  title: string;
  summary: string;
  confidence: number;
}

export function interpretCluster(signals: Signal[]): ClusterInsight {
  if (signals.length === 0) {
    return {
      title: "No cluster detected",
      summary: "No related signals were found.",
      confidence: 0,
    };
  }

const text = JSON.stringify(signals).toLowerCase();
  if (
    text.includes("authority") ||
    text.includes("permission") ||
    text.includes("approval")
  ) {
    return {
      title: "Portable Authority",
      summary:
        "Multiple signals indicate an emerging trust primitive around delegated authorization.",
      confidence: 92,
    };
  }

  if (
    text.includes("payment") ||
    text.includes("invoice") ||
    text.includes("settlement")
  ) {
    return {
      title: "Programmable Payments",
      summary:
        "Signals suggest a reusable payment coordination pattern.",
      confidence: 88,
    };
  }

  return {
    title: "Emerging Pattern",
    summary:
      "TradeTag Intelligence detected a related group of opportunities.",
    confidence: 75,
  };
}
