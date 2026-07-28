import type { BrandId, PrimitiveId, Scores } from "../../shared/types";

export const T = { bg:"#FFFFFF",card:"#F7F6F3",line:"#E8E6E0",ink:"#111111",sub:"#75716A",faint:"#A6A29A",blue:"#4E7FE1",blueSoft:"#EEF3FD",gold:"#B8963E",goldSoft:"#F6F0E1",green:"#2E7D4F",greenSoft:"#E9F3ED",red:"#B3402F",redSoft:"#F9ECE9" } as const;
export const font = "-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Inter,sans-serif";
export const mono = "'SF Mono',ui-monospace,Menlo,monospace";
export const PRIMITIVES: {id: PrimitiveId; name: string}[] = [
  ["delegated-authority","Delegated Authority"],["intent","Intent"],["proof","Proof"],["settlement","Settlement"],["recovery","Recovery"],["presence","Presence"],["identity","Identity"],["capsule","Capsule"],["lineage","Lineage"],["trust","Trust"]
].map(([id,name])=>({id:id as PrimitiveId,name}));
export const BRANDS: {id:BrandId;name:string;domain:string}[] = [
  {id:"tradetag",name:"TradeTag",domain:"Origin, lineage, provenance, append-only receipts and verification seals."},
  {id:"agreeva",name:"Agreeva",domain:"Protected deposits, reversible settlement, commitments and resolution."},
  {id:"luxeryd",name:"LUXERYD",domain:"Private mobility relationships and protected reservations."},
  {id:"taplive",name:"TapLive",domain:"Physical triggers and context-generated interfaces."},
  {id:"radius",name:"Radius",domain:"Identity, credential and relationship verification network."},
  {id:"deepproof",name:"DeepProof",domain:"Evidence and verification protocol with verify-and-forget receipts."}
];
export const WEIGHTS_DEFAULT: Scores = {strategicFit:18,urgency:12,marketPull:15,differentiation:12,revenuePotential:13,buildability:10,defensibility:10,evidenceStrength:10};
export const WEIGHT_DECIMALS: Record<keyof Scores,number> = {strategicFit:.18,urgency:.12,marketPull:.15,differentiation:.12,revenuePotential:.13,buildability:.10,defensibility:.10,evidenceStrength:.10};
export const PENALTY_W = {executionRisk:.25,overlapPenalty:.20,evidenceUncertainty:.15};
export const CRITERIA_LABELS: Record<keyof Scores,string> = {strategicFit:"Strategic fit",urgency:"Urgency",marketPull:"Market pull",differentiation:"Differentiation",revenuePotential:"Revenue potential",buildability:"Buildability",defensibility:"Defensibility",evidenceStrength:"Evidence strength"};
