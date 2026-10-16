export type ConformanceStatus =
  | "CONFORMED"
  | "DEVIATED"
  | "INDETERMINATE";

export interface ConformanceResult {
  version: "0.1";
  status: ConformanceStatus;
  violatedConstraint: string[];
}
