
import type { Analysis, Penalties, Scores, ScoreMath, TradeTagBlock } from "../../shared/types";
import { PENALTY_W, WEIGHT_DECIMALS } from "./config";
export const uid=(p:string)=>`${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
export const nowISO=()=>new Date().toISOString();
export async function sha256(text:string){const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");}
export function finalScore(scores:Scores, penalties:Penalties):ScoreMath{
  const opp=(Object.keys(WEIGHT_DECIMALS) as (keyof Scores)[]).reduce((a,k)=>a+scores[k]*WEIGHT_DECIMALS[k],0);
  const pen=penalties.executionRisk*PENALTY_W.executionRisk+penalties.overlapPenalty*PENALTY_W.overlapPenalty+penalties.evidenceUncertainty*PENALTY_W.evidenceUncertainty;
  return {opportunity:+opp.toFixed(1),penalty:+pen.toFixed(1),final:Math.max(0,Math.min(100,Math.round(opp-pen)))};
}
export function scoreBand(score:number){if(score>=92)return "Prototype recommended — human approval required";if(score>=85)return "Build brief recommended";if(score>=75)return "Human review";if(score>=60)return "Pattern candidate";return "Archive or watch";}
export async function mintTradeTag(previousHash:string|null,payload:Omit<TradeTagBlock,"id"|"previousHash"|"hash"|"body"|"createdAt">):Promise<TradeTagBlock>{
  const createdAt=nowISO(); const body=JSON.stringify({previousHash,...payload,createdAt}); const hash=await sha256(body);
  return {id:uid("tt"),previousHash,hash,body,createdAt,...payload};
}
export function withMath(a:Analysis):Analysis{return {...a,math:finalScore(a.scores,a.penalties)}};
