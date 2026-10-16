import type {
  ExecutionReceipt as CanonicalExecutionReceipt,
} from "./ExecutionReceipt";
export type ExecutionDecision =
  | "BUILD"
  | "MERGE"
  | "WATCH"
  | "REJECT";

export async function createExecutionReceipt(
input: Omit<
  CanonicalExecutionReceipt,
  "receiptId" | "createdAt" | "instructionHash"
> & {
  instructionRef: string;
}
): Promise<CanonicalExecutionReceipt> { const instructionHash = Array.from(
  new Uint8Array(
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(input.instructionRef)
    )
  )
)
  .map((byte) => byte.toString(16).padStart(2, "0"))
  .join("");


  return {
    ...input,
    instructionHash,
    receiptId: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
}
