import type { ExecutionAnchorTarget } from "./ExecutionAnchorTarget";

export type ExecutionAnchorStatus =
  | "pending"
  | "anchored"
  | "failed";

export interface ExecutionAnchorResult {
  version: "0.1";
  anchorMode?: "simulated" | "external";
  status: ExecutionAnchorStatus;
  target: ExecutionAnchorTarget;
  sealDigest: string;
  receiptDigest: string;
  instructionHash: string;
  anchoredAt?: string | null;
  anchorRef?: string;
  error?: string;
}
