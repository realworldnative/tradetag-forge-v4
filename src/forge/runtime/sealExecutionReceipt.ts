import type { ExecutionReceipt } from "./ExecutionReceipt";
import {
  isSealedExecutionReceipt,
  type SealedExecutionReceipt,
} from "./SealedExecutionReceipt";
const X402_SEAL_URL =
  import.meta.env.VITE_X402_SEAL_URL as string | undefined;

export async function sealExecutionReceipt(
  receipt: ExecutionReceipt
): Promise<SealedExecutionReceipt> {
  if (!X402_SEAL_URL) {
    throw new Error("VITE_X402_SEAL_URL is not configured.");
  }

  const response = await fetch(X402_SEAL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(receipt),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ??
        `x402 seal failed with status ${response.status}`
    );
  }

if (!isSealedExecutionReceipt(data)) {
  throw new Error("Invalid x402 seal response.");
}

return data;
}
