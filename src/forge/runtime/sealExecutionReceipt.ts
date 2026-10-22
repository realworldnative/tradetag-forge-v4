import type { ExecutionReceipt } from "./ExecutionReceipt";
import { createExecutionReceiptDigest } from "./createExecutionReceiptDigest";
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

  // Snapshot the exact JSON submitted before any asynchronous work.
  const requestBody = JSON.stringify(receipt);
  const submittedReceipt: ExecutionReceipt = JSON.parse(requestBody);
  const expectedDigest =
    await createExecutionReceiptDigest(submittedReceipt);

  const response = await fetch(X402_SEAL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody,
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

  const returnedDigest =
    await createExecutionReceiptDigest(data.receipt);

  if (returnedDigest !== expectedDigest) {
    throw new Error(
      "x402 seal returned a receipt different from the submitted receipt."
    );
  }

  if (data.sealDigest !== expectedDigest) {
    throw new Error("x402 seal digest verification failed.");
  }

  return data;
}
