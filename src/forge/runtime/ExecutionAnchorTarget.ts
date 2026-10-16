export type ExecutionAnchorTargetType =
  | "GENESIS_GRID"
  | "BLOCKCHAIN"
  | "AGENT_REGISTRY"
  | "ROBOTICS_LOG"
  | "CUSTOM";

export interface ExecutionAnchorTarget {
  version: "0.1";
  type: ExecutionAnchorTargetType;
  targetId: string;
}
