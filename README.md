# TradeTag Forge v4

A Codex-ready implementation of the verified product-creation loop:

`Live Signal → Cartographer Score → Human Decision → Generated Artifact → Innovation TradeTag → Outcome Learning`

## Why this version is materially safer

- Anthropic credentials stay on the server, never in browser code.
- Browser persistence uses standard `localStorage`; replace with Supabase/Postgres for multi-user production.
- SHA-256 blocks are real and hash-chained.
- Live ingestion and artifact generation call the backend gateway.
- Seed mode remains usable when no API key is configured.
- TradeTag, TrustLink, and application-brand language are separated.

## Run

```bash
cp .env.example .env
# Add ANTHROPIC_API_KEY for live ingestion/generation.
npm install
npm run dev
```

Frontend: http://localhost:5173
API: http://localhost:8787

## First production upgrade

1. Replace localStorage with Supabase tables and RLS.
2. Add user authentication and organization workspaces.
3. Save full citations and retrieved source snapshots.
4. Add schema validation for every model response.
5. Mint external/on-chain anchors only for approved milestones, not every edit.
6. Add GitHub/Lovable/Caffeine export adapters rather than claiming direct builds.

## Core brand rule

- **TradeTag**: provenance, origin, lineage, append-only receipts.
- **TrustLink**: living agreement and authority lifecycle.
- **Capsule Engine**: internal state machine.
- **LUXERYD / Agreeva / TapLive / Radius / DeepProof**: public application outcomes.
