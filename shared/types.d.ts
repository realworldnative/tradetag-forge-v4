export type BrandId = "tradetag" | "agreeva" | "luxeryd" | "taplive" | "radius" | "deepproof";
export type PrimitiveId = "delegated-authority" | "intent" | "proof" | "settlement" | "recovery" | "presence" | "identity" | "capsule" | "lineage" | "trust";
export type Decision = "create" | "merge" | "extend" | "watch" | "reject";
export type HumanDecision = "build" | "merge" | "watch" | "reject";
export interface Scores {
    strategicFit: number;
    urgency: number;
    marketPull: number;
    differentiation: number;
    revenuePotential: number;
    buildability: number;
    defensibility: number;
    evidenceStrength: number;
}
export interface Penalties {
    executionRisk: number;
    overlapPenalty: number;
    evidenceUncertainty: number;
}
export interface ScoreMath {
    opportunity: number;
    penalty: number;
    final: number;
}
export interface Analysis {
    scores: Scores;
    penalties: Penalties;
    primitiveIds: PrimitiveId[];
    brandId: BrandId;
    decision: Decision;
    targetProduct: string | null;
    publicName: string;
    protocolName: string;
    internalType: string;
    whyNow: string;
    reasoning: string[];
    math?: ScoreMath;
    cognitionUsed?: string[];
}
export interface Signal {
    id: string;
    origin: "SEED" | "LIVE";
    lifecycle: "new" | "watching" | "archived";
    scored: boolean;
    decided?: boolean;
    decision?: HumanDecision;
    headline: string;
    summary: string;
    problem: string;
    publisher: string;
    sourceUrl: string;
    publishedAt: string;
    retrievedAt: string;
    contentHash: string;
    companies: string[];
    sourceType: string;
    analysis?: Analysis;
}
export interface Product {
    id: string;
    publicName: string;
    protocolName: string;
    internalType: string;
    brandId: BrandId;
    primitiveIds: PrimitiveId[];
    status: string;
    outcomes: string[];
}
export interface Brief {
    id: string;
    sourceSignalId: string;
    publicName: string;
    protocolName: string;
    internalType: string;
    brandId: BrandId;
    primitiveIds: PrimitiveId[];
    problem: string;
    decision: HumanDecision;
    approvedAt: string;
    generations?: Generation[];
    adoptedFrom?: string;
}
export interface Artifact {
    id: string;
    briefId: string;
    type: string;
    version: string;
    content: string;
    hash: string;
    createdAt: string;
}
export interface TradeTagBlock {
    id: string;
    previousHash: string | null;
    hash: string;
    body: string;
    createdAt: string;
    publicName: string;
    sourceSignalId: string;
    decision: string;
    approvedBy: string;
}
export interface CognitionLesson {
    id: string;
    origin: "SEED" | "ANALYZER" | "EVOLVE";
    tags: string[];
    insight: string;
    weightHint: Partial<Record<keyof Scores, number>>;
    subject?: string;
    outcome?: string;
    createdAt: string;
}
export interface Variant {
    id: string;
    gen: number;
    publicName: string;
    mutation: string;
    primitiveIds: PrimitiveId[];
    scores: Scores;
    penalties: Penalties;
    math: ScoreMath;
    rejected: boolean;
}
export interface Generation {
    gen: number;
    variants: Variant[];
    at: string;
}
export interface ForgeState {
    signals: Signal[];
    products: Product[];
    briefs: Brief[];
    artifacts: Artifact[];
    tags: TradeTagBlock[];
    cognition: CognitionLesson[];
    weights: Scores;
}
