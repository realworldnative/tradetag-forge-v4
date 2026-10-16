function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }

  const object = value as Record<string, unknown>;
  const keys = Object.keys(object).sort();

  return `{${keys
    .map(
      (key) =>
        `${JSON.stringify(key)}:${canonicalize(object[key])}`
    )
    .join(",")}}`;
}
export interface SealedExecutionReceipt {
  status: "SEALED";
  service: "TradeTag x402 seal";
  authConfigured: boolean;
receipt: import("./ExecutionReceipt").ExecutionReceipt;
sealDigest: string;
  sealedAt: string;
}
export function isSealedExecutionReceipt(
  value: unknown
): value is SealedExecutionReceipt {
  if (value == null || typeof value !== "object") {
    return false;
  }

  const sealed = value as Partial<SealedExecutionReceipt>;

  return (
    sealed.status === "SEALED" &&
    sealed.service === "TradeTag x402 seal" &&
    typeof sealed.authConfigured === "boolean" &&
    typeof sealed.sealDigest === "string" &&
    typeof sealed.sealedAt === "string" &&
    sealed.receipt != null
  );
}
