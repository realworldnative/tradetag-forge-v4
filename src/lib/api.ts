import type { Analysis, Artifact, Brief, CognitionLesson, Product, Signal, Variant } from "../../shared/types";
async function post<T>(path:string, body:unknown):Promise<T>{const r=await fetch(`/api/${path}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});if(!r.ok){const x=await r.json().catch(()=>({}));throw new Error(x.error||`Request failed ${r.status}`);}return r.json() as Promise<T>;}
export const api={
  ingest:()=>post<Signal[]>("ingest",{}),
  score:(signal:Signal,products:Product[],lessons:CognitionLesson[])=>post<Analysis>("score",{signal,products,lessons}),
  artifact:(brief:Brief,type:string)=>post<Artifact>("artifact",{brief,type}),
  analyzeOutcome:(product:Product,outcome:string)=>post<CognitionLesson>("outcome",{product,outcome}),
  evolve:(brief:Brief,lessons:CognitionLesson[],gen:number)=>post<Variant[]>("evolve",{brief,lessons,gen})
};
