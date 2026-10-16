import type { Signal } from "../../../shared/types";
import { buildExecutionEnvelope } from "../chain/buildEnvelope";
import {
  createTrustExecutionObject,
  type TrustExecutionObject,
} from "../runtime/TrustExecutionObject";

export interface CompiledSignal {
  compilerVersion: "0.2";
  sourceSignalId: string;
  compiledAt: string;
  teo: TrustExecutionObject;
}

export function compileSignal(
  signal: Signal
): CompiledSignal {
  const envelope = buildExecutionEnvelope(signal);
  const teo = createTrustExecutionObject(envelope);

  return {
    compilerVersion: "0.2",
    sourceSignalId: signal.id,
    compiledAt: new Date().toISOString(),
    teo,
  };
}
