import type { ExecutionEnvelope } from "./signalToChain";

export interface FrozenExecutionEnvelope {
  readonly envelope: ExecutionEnvelope;
  readonly envelopeDigest: string;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map(
    (key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`
  ).join(",")}}`;
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object") {
    for (const child of Object.values(value)) {
      deepFreeze(child);
    }
    Object.freeze(value);
  }
  return value;
}

export async function createExecutionEnvelopeDigest(
  envelope: ExecutionEnvelope
): Promise<string> {
  const snapshot: ExecutionEnvelope = JSON.parse(JSON.stringify(envelope));
  const canonical = canonicalize({
    domain: "TradeTag.ExecutionEnvelope.v0.1",
    envelope: snapshot,
  });
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonical)
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function freezeEnvelope(
  envelope: ExecutionEnvelope
): Promise<FrozenExecutionEnvelope> {
  const snapshot: ExecutionEnvelope = JSON.parse(JSON.stringify(envelope));
  deepFreeze(snapshot);
  const envelopeDigest = await createExecutionEnvelopeDigest(snapshot);
  return Object.freeze({ envelope: snapshot, envelopeDigest });
}

export async function verifyFrozenEnvelope(
  frozen: FrozenExecutionEnvelope
): Promise<boolean> {
  return /^[a-f0-9]{64}$/.test(frozen.envelopeDigest) &&
    await createExecutionEnvelopeDigest(frozen.envelope) === frozen.envelopeDigest;
}
