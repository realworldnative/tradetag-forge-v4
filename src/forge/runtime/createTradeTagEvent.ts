import type {
  TradeTagEvent,
  TradeTagEventType,
} from "./TradeTagEvent";

export interface CreateTradeTagEventInput {
  id: string;
  type: TradeTagEventType;
  executionId: string;
  teoDigest: string;
  actorId: string;
  action: string;
  inputDigest?: string;
  outputDigest?: string;
  evidenceRefs?: string[];
  occurredAt?: string;
  previousEventDigest?: string;
  signature?: string;
}

export function createTradeTagEvent(
  input: CreateTradeTagEventInput,
): TradeTagEvent {
  return {
    id: input.id,
    type: input.type,
    executionId: input.executionId,
    teoDigest: input.teoDigest,
    actorId: input.actorId,
    action: input.action,
    inputDigest: input.inputDigest,
    outputDigest: input.outputDigest,
    evidenceRefs: input.evidenceRefs,
    occurredAt:
      input.occurredAt ?? new Date().toISOString(),
    previousEventDigest:
      input.previousEventDigest,
    signature: input.signature,
  };
}
