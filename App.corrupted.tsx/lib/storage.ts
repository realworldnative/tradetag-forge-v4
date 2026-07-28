import type { ForgeState } from "../../shared/types";
const KEY="tradetag-forge-v4";
export function loadState(fallback:ForgeState):ForgeState{try{const raw=localStorage.getItem(KEY);return raw?{...fallback,...JSON.parse(raw)}:fallback;}catch{return fallback;}}
export function saveState(state:ForgeState){localStorage.setItem(KEY,JSON.stringify(state));}
