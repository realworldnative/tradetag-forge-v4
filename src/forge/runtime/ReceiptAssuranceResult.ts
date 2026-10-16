export type ReceiptAssuranceStatus =
  | "SATISFIED"
  | "UNSATISFIED"
  | "INDETERMINATE";

export interface ReceiptAssuranceResult {
  version: "0.1";
  status: ReceiptAssuranceStatus;
  unmetRequirement: string[];
}
