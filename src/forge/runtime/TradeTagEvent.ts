/**
 * TradeTagEvent
 *
 * Canonical evidence primitive for a consequential action.
 *
 * Signal = what caused Forge to pay attention.
 * TEO    = what is permitted to happen.
 * Event  = what actually happened.
 */

export type TradeTagEventType =
  | "SIGNAL_RECEIVED"
  | "TEO_CREATED"
  | "DECISION_MADE"
  | "EXECUTION_COMPLETED";

export interface TradeTagEvent {
  /** Unique identifier for this event. */
  id: string;

  /** Semantic classification of what occurred. */
  type: TradeTagEventType;

  /** Execution this event belongs to. */
  executionId: string;

  /** Digest of the governing Trust Execution Object. */
  teoDigest: string;

  /** Identity of the human, agent, service, or machine that acted. */
  actorId: string;

  /** Plain machine-readable description of the action. */
  action: string;

  /** Digest of the inputs used by the action, if any. */
  inputDigest?: string;

  /** Digest of the outputs created by the action, if any. */
  outputDigest?: string;

  /** References to supporting evidence without duplicating the evidence itself. */
  evidenceRefs?: string[];

  /** ISO-8601 time at which the action occurred. */
  occurredAt: string;

  /**
   * Digest of the immediately preceding TradeTag Event.
   * Undefined for the first event in an execution chain.
   */
  previousEventDigest?: string;

  /** Signature or signature reference. Cryptographic implementation comes later. */
  signature?: string;
}
