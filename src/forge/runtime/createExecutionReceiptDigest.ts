import type { ExecutionReceipt } from "./ExecutionReceipt";

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

export async function createExecutionReceiptDigest(
  receipt: ExecutionReceipt
): Promise<string> {
  const canonicalReceipt = canonicalize(receipt);

  const bytes = new TextEncoder().encode(canonicalReceipt);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    bytes
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
