import "dotenv/config";
import express from "express";
import cors from "cors";
import { createHash } from "node:crypto";
import { z } from "zod";

const app=express(); app.use(cors()); app.use(express.json({limit:"1mb"}));
const PORT=Number(process.env.PORT||8787); const API_KEY=process.env.OPENAI_API_KEY; const MODEL=process.env.OPENAI_MODEL||"gpt-5.6";
const uid=(p:string)=>`${p}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
const sha=(s:string)=>createHash("sha256").update(s).digest("hex");
async function openai(prompt:string, webSearch=false){
 if(!API_KEY) throw new Error("OPENAI_API_KEY is not configured. Seed mode remains available.");
const body:any={model:MODEL,input:prompt,max_output_tokens:1800}; 
if(webSearch) body.tools=[{type:"web_search"}];
const r=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"content-type":"application/json","authorization":`Bearer ${API_KEY}`},body:JSON.stringify(body)});
const data:any=await r.json();
return (data.output??[]).flatMap((item:any)=>item.content??[]).filter((part:any)=>part.type==="output_text").map((part:any)=>part.text??"").join("\n");}
function parse(text:string){const clean=text.replace(/```json|```/g,"").trim();const starts=[clean.indexOf("["),clean.indexOf("{")].filter(x=>x>=0);if(!starts.length)throw new Error("Model did not return JSON");return JSON.parse(clean.slice(Math.min(...starts)));}
app.post("/api/ingest",async(_req,res)=>{try{const text=await openai(`Use web search to find 2 significant real developments from the last 14 days relevant to AI agent payments, digital identity, provenance, programmable settlement, physical AI, NFC/proximity or generative UI. Return ONLY JSON array: [{"headline":"","summary":"max 35 words","sourceUrl":"real URL","publisher":"","publishedAt":"YYYY-MM-DD","sourceType":"news|blog|filing|research","technologies":[""],"companies":[""],"problem":"max 20 words"}]`,true);const raw=parse(text);const out=raw.slice(0,3).map((r:any)=>({id:uid("sig"),origin:"LIVE",lifecycle:"new",scored:false,...r,retrievedAt:new Date().toISOString(),contentHash:sha(`${r.headline}|${r.summary}|${r.sourceUrl}`)}));res.json(out);}catch(e){res.status(500).json({error:(e as Error).message});}});
app.post("/api/score",async(req,res)=>{try{const {signal,products,lessons}=req.body;const text=await openai(`Analyze this TradeTag Forge signal. Return ONLY JSON with scores 0-100, penalties 0-100, primitiveIds, brandId, decision, targetProduct, publicName, protocolName, internalType, whyNow and 3 reasoning bullets. Signal:${JSON.stringify(signal)} Existing products:${(products||[]).map((p:any)=>p.publicName).join(",")} Lessons:${(lessons||[]).map((l:any)=>l.insight).join(" | ")} Allowed brands: tradetag,agreeva,luxeryd,taplive,radius,deepproof. Allowed primitives: delegated-authority,intent,proof,settlement,recovery,presence,identity,capsule,lineage,trust.`);res.json(parse(text));}catch(e){res.status(500).json({error:(e as Error).message});}});
app.post("/api/artifact",async(req,res)=>{try{const {brief,type}=req.body;const prompt=type==="prd"?`Write a concise PRD for ${brief.publicName}. Include ICP, 3 flows, schema, 5 endpoints, metrics and risks.`:type==="openai_prompt"?`Write a openai backend/API superprompt for ${brief.publicName}. Include pipeline, objects, endpoints, safety and persistence.`:`Write a complete Lovable.dev superprompt for ${brief.publicName}. White Apple-minimal design. Include pages, components, flows, schema, RLS, APIs and acceptance criteria.`;const content=await openai(`${prompt}\nContext:${JSON.stringify(brief)}`);res.json({id:uid("art"),type,version:"v1",content,hash:sha(content).slice(0,16),createdAt:new Date().toISOString()});}catch(e){res.status(500).json({error:(e as Error).message});}});
app.post("/api/outcome",async(req,res)=>{try{const {product,outcome}=req.body;const text=await openai(`Return ONLY JSON {"insight":"max 28 words","tags":["2-4 lowercase keywords"],"weightHint":{}}. Distill a general lesson from outcome ${outcome} for product ${JSON.stringify(product)}.`);const x=parse(text);res.json({id:uid("cog"),origin:"ANALYZER",...x,subject:product.publicName,outcome,createdAt:new Date().toISOString()});}catch(e){res.status(500).json({error:(e as Error).message});}});
app.post("/api/evolve",async(req,res)=>{try{const {brief,lessons,gen}=req.body;const text=await openai(`Return ONLY JSON array of 3 variants of this product brief, each with publicName, mutation, primitiveIds, scores and penalties. Brief:${JSON.stringify(brief)} Lessons:${(lessons||[]).map((x:any)=>x.insight).join(" | ")}`);res.json(parse(text));}catch(e){res.status(500).json({error:(e as Error).message});}});
app.get("/api/health",(_req,res)=>res.json({ok:true,model:MODEL,live:Boolean(API_KEY)}));
app.listen(PORT,()=>console.log(`TradeTag Forge API on http://localhost:${PORT}`));


