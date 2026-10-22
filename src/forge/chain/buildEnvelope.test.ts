import { describe, expect, it } from "vitest";
import { initialState } from "../../lib/seed";
import { buildExecutionEnvelope } from "./buildEnvelope";

describe("Execution envelope authority", () => {
  it.each([undefined, {}])(
    "blocks execution without an authority claim: %j",
    (context) => {
      const signal = initialState.signals[0];
      expect(signal).toBeDefined();

      const envelope = buildExecutionEnvelope(signal, context);

      expect(envelope.authority.verified).toBe(false);
      expect(envelope.authority.missing).toContain(
        "Verified portable authority claim"
      );
      expect(envelope.executable).toBe(false);
      expect(envelope.allowedActions).toEqual([]);
      expect(envelope.principalId).toBeUndefined();
      expect(envelope.agentId).toBeUndefined();
    }
  );
});
