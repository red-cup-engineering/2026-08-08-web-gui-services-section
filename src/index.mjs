const CHARGES=new Set(["unknown","potential","active","stable"]);
const t=(v,d="")=>typeof v==="string"?v:d;
const n=(v,d=0)=>Number.isFinite(v)?Number(v):d;
const a=v=>Array.isArray(v)?v:[];
const pos=(v,i)=>Object.freeze(v&&typeof v==="object"?{x:n(v.x),y:n(v.y),z:n(v.z)}:{x:(i%12)-6,y:Math.floor(i/12)-6,z:0});

export function normalizeWebGuiModel(value={}){
  const x=value&&typeof value==="object"?value:{},actor=x.actor&&typeof x.actor==="object"?x.actor:{},locus=x.locus&&typeof x.locus==="object"?x.locus:{},witness=x.witness&&typeof x.witness==="object"?x.witness:{};
  const entities=Object.freeze(a(x.entities).map((v,i)=>{const q=v&&typeof v==="object"?v:{},id=t(q.id,`entity-${i+1}`);return Object.freeze({id,name:t(q.name,id),kind:t(q.kind,"locus"),charge:CHARGES.has(q.charge)?q.charge:"unknown",position:pos(q.position,i),height:Math.max(.25,n(q.height,1)),detail:t(q.detail),witness:t(q.witness)})}));
  const ids=new Set(entities.map(v=>v.id));
  return Object.freeze({kind:"web-gui.world-projection",revision:t(x.revision,"unwitnessed"),title:t(x.title,"Witnessed world"),subtitle:t(x.subtitle,"A local perception, not the authoritative world."),
    actor:Object.freeze({id:t(actor.id,"anonymous"),name:t(actor.name,"Wanderer"),condition:t(actor.condition)}),
    locus:Object.freeze({id:t(locus.id,entities[0]?.id||"nowhere"),name:t(locus.name,"Unresolved locus"),description:t(locus.description)}),entities,
    paths:Object.freeze(a(x.paths).map(v=>({from:t(v?.from),to:t(v?.to),charge:CHARGES.has(v?.charge)?v.charge:"unknown"})).filter(v=>ids.has(v.from)&&ids.has(v.to))),
    actions:Object.freeze(a(x.actions).map((v,i)=>({id:t(v?.id,`action-${i+1}`),label:t(v?.label,`Action ${i+1}`),detail:t(v?.detail),command:t(v?.command,t(v?.id,`action-${i+1}`)),enabled:v?.enabled!==false,shortcut:t(v?.shortcut,String(i%9+1))}))),
    journal:Object.freeze(a(x.journal).map((v,i)=>({id:t(v?.id,`entry-${i+1}`),tone:["notice","success","refusal","contradiction"].includes(v?.tone)?v.tone:"notice",summary:t(v?.summary,"An unnamed witness arrived."),detail:t(v?.detail)}))),
    faculties:Object.freeze(a(x.faculties).map((v,i)=>({id:t(v?.id,`faculty-${i+1}`),name:t(v?.name,`Faculty ${i+1}`),level:Math.max(0,Math.min(100,n(v?.level))),voice:t(v?.voice),active:v?.active===true}))),
    contradictions:Object.freeze(a(x.contradictions).map((v,i)=>({id:t(v?.id,`contradiction-${i+1}`),summary:t(v?.summary,"Opposing witnesses are retained."),witnesses:Object.freeze(a(v?.witnesses).map(t).filter(Boolean)),retained:v?.retained!==false}))),
    witness:Object.freeze({status:["live","stale","refused","unwitnessed"].includes(witness.status)?witness.status:"unwitnessed",receipt:t(witness.receipt),observedAt:t(witness.observedAt)})});
}
export const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeJson=v=>JSON.stringify(v).replace(/</g,"\\u003c").replace(/-->/g,"--\\u003e");

export { renderTufteProjection } from "./tufte.mjs";

export const WEB_GUI_MATERIAL_CSS=String.raw`
:root{color-scheme:dark;--void:#07100f;--deep:#0c1716;--ink:#f2ead8;--dim:#a9aa9b;--jade:#68d7a4;--cinnabar:#e0694d;--lapis:#6e9dd6;--gold:#e8c56a;--line:#455a51;--glass:#0c1716de;--r:13px;--shadow:0 20px 70px #0008}*{box-sizing:border-box}html,body{margin:0;min-height:100%;overflow:hidden;background:var(--void);color:var(--ink);font:14px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace}button,input{font:inherit}.world{position:fixed;inset:0;isolation:isolate;background:radial-gradient(circle at 50% 34%,#173128 0,#0a1715 44%,#050a0a 100%)}.world:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.24;background:radial-gradient(circle at 20% 30%,#68d7a433 0 1px,transparent 2px) 0 0/23px 23px}.hud{position:absolute;inset:0;pointer-events:none}.hud>*{pointer-events:auto}`;
