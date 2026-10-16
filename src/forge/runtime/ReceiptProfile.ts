export type ReceiptProfile =
  | "LIGHTWEIGHT"
  | "STANDARD"
  | "CONSEQUENTIAL";

export interface ReceiptProfileRequirements {
  authority: boolean;
  evidence: boolean;
  state: boolean;
  conformance: boolean;
}

export const receiptProfileRequirements: Record<
  ReceiptProfile,
  ReceiptProfileRequirements
> = {
  LIGHTWEIGHT: {
    authority: false,
    evidence: false,
    state: false,
    conformance: false,
  },
  STANDARD: {
    authority: true,
    evidence: true,
    state: false,
    conformance: true,
  },
  CONSEQUENTIAL: {
    authority: true,
    evidence: true,
    state: true,
    conformance: true,
  },
};
export function getReceiptProfileRequirements(
  profile: ReceiptProfile
): ReceiptProfileRequirements {
  return receiptProfileRequirements[profile];
}
