<?php /* The Living Archive — admin portal (single-file SPA, no dependencies).
         All data flows through /api/admin/*.php JSON endpoints. */ ?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Praxivision — Admin</title>
<style>
  :root{
    --ink0:#0b0a08; --ink1:#14110d; --ink2:#1e1a14;
    --linen:#ede6da; --dim:#a89e8d;
    --acc:#79a995; --accb:#93c4ad; --bad:#c96f5a;
    --hair:rgba(237,230,218,.14); --hair2:rgba(237,230,218,.3);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:var(--ink0);color:var(--linen);font:14px/1.55 system-ui,Segoe UI,sans-serif;min-height:100vh}
  .mono{font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--dim)}
  a{color:var(--accb);text-decoration:none}
  button{font:inherit;cursor:pointer;background:none;color:inherit;border:none}
  .btn{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(121,169,149,.6);color:var(--acc);
       border-radius:999px;padding:9px 20px;font-family:ui-monospace,Consolas,monospace;font-size:10px;
       letter-spacing:.2em;text-transform:uppercase;transition:.2s}
  .btn:hover{background:var(--acc);color:var(--ink0)}
  .btn.ghost{border-color:var(--hair2);color:var(--dim)}
  .btn.ghost:hover{background:var(--ink2);color:var(--linen)}
  .btn.danger{border-color:rgba(201,111,90,.6);color:var(--bad)}
  .btn.danger:hover{background:var(--bad);color:var(--ink0)}
  .btn:disabled{opacity:.4;pointer-events:none}
  input,textarea,select{background:var(--ink1);border:1px solid var(--hair);color:var(--linen);
       border-radius:8px;padding:9px 12px;font:inherit;width:100%}
  input:focus,textarea:focus,select:focus{outline:none;border-color:var(--acc)}
  label{display:block;margin:14px 0 5px}
  textarea{resize:vertical;min-height:80px}
  .wrap{max-width:1100px;margin:0 auto;padding:32px 20px 80px}
  header.top{display:flex;align-items:center;justify-content:space-between;gap:16px;
       border-bottom:1px solid var(--hair);padding-bottom:18px;margin-bottom:26px}
  header.top h1{font-size:17px;font-weight:600;letter-spacing:.02em}
  nav.tabs{display:flex;gap:4px;flex-wrap:wrap}
  nav.tabs button{padding:8px 16px;border-radius:999px;color:var(--dim);
       font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase}
  nav.tabs button.on{background:var(--linen);color:var(--ink0)}
  .card{background:var(--ink1);border:1px solid var(--hair);border-radius:12px;padding:20px;margin-bottom:14px}
  .row{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
  .grow{flex:1}
  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:720px){.grid2{grid-template-columns:1fr}}
  .thumb{width:92px;height:60px;object-fit:cover;border-radius:6px;background:#000;flex-shrink:0}
  .muted{color:var(--dim);font-size:12.5px}
  .pill{display:inline-block;border:1px solid var(--hair2);border-radius:999px;padding:2px 10px;
        font-family:ui-monospace,Consolas,monospace;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim)}
  .pill.on{border-color:rgba(121,169,149,.7);color:var(--accb)}
  table{width:100%;border-collapse:collapse}
  th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--hair);vertical-align:top}
  th{font-family:ui-monospace,Consolas,monospace;font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--dim)}
  .msg{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:var(--ink2);
       border:1px solid var(--hair2);border-radius:999px;padding:10px 22px;font-size:13px;z-index:50;
       transition:opacity .3s;opacity:0;pointer-events:none}
  .msg.show{opacity:1}
  .msg.err{border-color:var(--bad);color:var(--bad)}
  .login{max-width:360px;margin:18vh auto 0}
  .blocks .card{padding:14px 16px}
  .blocks .bar{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}
  .blocks .bar button{color:var(--dim);font-size:12px;padding:4px 8px;border-radius:6px}
  .blocks .bar button:hover{background:var(--ink2);color:var(--linen)}
  .addrow{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 20px}
  .addrow button{border:1px dashed var(--hair2);border-radius:8px;padding:7px 14px;color:var(--dim);font-size:12px}
  .addrow button:hover{color:var(--accb);border-color:var(--acc)}
  h2.sec{font-size:15px;margin:26px 0 12px;font-weight:600}
  .uploadnote{font-size:11.5px;color:var(--dim);margin-top:4px}
</style>
</head>
<body>
<div id="app" class="wrap"><p class="mono" style="margin-top:20vh;text-align:center">loading…</p></div>
<div id="msg" class="msg"></div>

<script>
"use strict";
const $ = (s, el=document) => el.querySelector(s);
const app = $("#app");
let CSRF = "";

/* ——— plumbing ——— */
function toast(text, err=false){
  const m = $("#msg");
  m.textContent = text; m.className = "msg show" + (err ? " err" : "");
  clearTimeout(m._t); m._t = setTimeout(()=> m.className="msg", 2600);
}
async function api(path, opts={}){
  const res = await fetch("/api/" + path, {
    headers: {"Content-Type":"application/json", "X-CSRF": CSRF, ...(opts.headers||{})},
    credentials: "same-origin",
    ...opts,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  const json = await res.json().catch(()=>({ok:false,error:"bad response"}));
  if(!json.ok) throw new Error(json.error || ("HTTP "+res.status));
  return json;
}
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const MEDIA_BASE = "https://pub-b6df9c86ce26430caf9d07b91b02796f.r2.dev";
const mediaUrl = p => !p ? "" : (/^https?:/.test(p) ? p : MEDIA_BASE + p);

/* Upload a File straight to R2 via presigned PUT; resolves to the stored path. */
async function uploadFile(file, folder=""){
  toast("Uploading " + file.name + "…");
  const sig = await api("admin/upload.php", {method:"POST", body:{filename:file.name, folder}});
  const put = await fetch(sig.upload_url, {method:"PUT", body:file});
  if(!put.ok) throw new Error("R2 upload failed (HTTP "+put.status+") — check bucket CORS allows PUT");
  toast("Uploaded ✓");
  return sig.path;
}
function pickFile(accept){
  return new Promise(resolve => {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = accept;
    inp.onchange = () => resolve(inp.files[0] || null);
    inp.click();
  });
}

/* ——— router ——— */
const TABS = [["hero","Hero"],["cases","Case Studies"],["archive","Archive"],["inbox","Inquiries"]];
let tab = location.hash.slice(1) || "hero";

async function boot(){
  try{
    const me = await api("admin/me.php");
    if(me.authed){ CSRF = me.csrf; renderShell(); show(tab); }
    else renderLogin();
  }catch(e){
    app.innerHTML = `<div class="login card"><p class="mono">API unreachable</p>
      <p class="muted" style="margin-top:10px">${esc(e.message)} — the admin portal needs the PHP API and MySQL (it does not run under <code>next dev</code>).</p></div>`;
  }
}

function renderLogin(){
  app.innerHTML = `<div class="login">
    <p class="mono">Praxivision · The Living Archive</p>
    <div class="card" style="margin-top:14px">
      <label>Admin password</label>
      <input type="password" id="pw" autofocus>
      <div style="margin-top:16px"><button class="btn" id="go">Sign in</button></div>
    </div></div>`;
  const submit = async () => {
    try{
      const r = await api("admin/login.php", {method:"POST", body:{password: $("#pw").value}});
      CSRF = r.csrf; renderShell(); show(tab);
    }catch(e){ toast(e.message, true); }
  };
  $("#go").onclick = submit;
  $("#pw").onkeydown = e => { if(e.key==="Enter") submit(); };
}

function renderShell(){
  app.innerHTML = `
    <header class="top">
      <h1>The Living Archive — Admin</h1>
      <nav class="tabs">${TABS.map(([id,l])=>`<button data-t="${id}">${l}</button>`).join("")}</nav>
      <button class="btn ghost" id="out">Sign out</button>
    </header>
    <main id="view"></main>`;
  app.querySelectorAll("[data-t]").forEach(b => b.onclick = () => show(b.dataset.t));
  $("#out").onclick = async () => { await api("admin/logout.php",{method:"POST",body:{}}); location.reload(); };
}

function show(t){
  tab = t; location.hash = t;
  app.querySelectorAll("[data-t]").forEach(b => b.classList.toggle("on", b.dataset.t===t));
  ({hero: viewHero, cases: viewCases, archive: viewArchive, inbox: viewInbox})[t]();
}

/* ——— hero slides ——— */
async function viewHero(){
  const v = $("#view");
  v.innerHTML = `<p class="mono">Home hero slides — order top to bottom, toggle visibility</p><div id="list" style="margin-top:14px"></div>
    <div class="row" style="margin-top:18px">
      <button class="btn" id="addUpload">+ Upload image</button>
      <button class="btn ghost" id="addPath">+ Add by media path</button>
    </div>
    <p class="uploadnote">Uploads land in the R2 bucket under /uploads/. Paths like /portfolio/… reference existing media.</p>`;
  const slides = (await api("admin/hero.php")).slides;
  const list = $("#list");
  list.innerHTML = slides.length ? "" : `<p class="muted">No slides yet — the site falls back to its built-in set.</p>`;
  slides.forEach((s, i) => {
    const card = document.createElement("div");
    card.className = "card row";
    card.innerHTML = `
      <img class="thumb" src="${esc(mediaUrl(s.src))}" alt="">
      <div class="grow">
        <input value="${esc(s.label)}" data-f="label" placeholder="Label">
        <input value="${esc(s.meta ?? "")}" data-f="meta" placeholder="Meta line" style="margin-top:6px">
        <p class="muted" style="margin-top:6px;word-break:break-all">${esc(s.src)}</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
        <span class="pill ${s.active?"on":""}" role="button" data-a="toggle">${s.active?"Active":"Hidden"}</span>
        <div>
          <button title="Move up" data-a="up">▲</button>
          <button title="Move down" data-a="down">▼</button>
          <button title="Delete" data-a="del" style="color:var(--bad)">✕</button>
        </div>
        <button class="btn ghost" data-a="save">Save</button>
      </div>`;
    card.querySelector('[data-a="save"]').onclick = async () => {
      await api("admin/hero.php",{method:"PUT", body:{id:s.id,
        label:card.querySelector('[data-f="label"]').value,
        meta:card.querySelector('[data-f="meta"]').value}});
      toast("Saved ✓");
    };
    card.querySelector('[data-a="toggle"]').onclick = async () => {
      await api("admin/hero.php",{method:"PUT", body:{id:s.id, active:!s.active}}); viewHero();
    };
    card.querySelector('[data-a="del"]').onclick = async () => {
      if(!confirm("Delete this slide?")) return;
      await api("admin/hero.php",{method:"DELETE", body:{id:s.id}}); viewHero();
    };
    card.querySelector('[data-a="up"]').onclick = () => move(i,-1);
    card.querySelector('[data-a="down"]').onclick = () => move(i,1);
    list.appendChild(card);
  });
  async function move(i, d){
    const j = i + d;
    if(j < 0 || j >= slides.length) return;
    const ids = slides.map(s=>s.id);
    [ids[i], ids[j]] = [ids[j], ids[i]];
    await api("admin/hero.php?action=reorder",{method:"POST", body:{ids}});
    viewHero();
  }
  $("#addUpload").onclick = async () => {
    const f = await pickFile("image/*"); if(!f) return;
    try{
      const path = await uploadFile(f, "hero");
      await api("admin/hero.php",{method:"POST", body:{src:path, label:f.name.replace(/\.[^.]+$/,"")}});
      viewHero();
    }catch(e){ toast(e.message, true); }
  };
  $("#addPath").onclick = async () => {
    const src = prompt("Media path (e.g. /portfolio/…/image.jpg) or full URL:"); if(!src) return;
    const label = prompt("Label:") || "Untitled";
    await api("admin/hero.php",{method:"POST", body:{src, label}});
    viewHero();
  };
}

/* ——— case studies ——— */
async function viewCases(){
  const v = $("#view");
  const {studies} = await api("admin/case-studies.php");
  v.innerHTML = `<div class="row">
      <p class="mono grow">Case studies — draft privately, publish when ready</p>
      <button class="btn" id="new">+ New case study</button>
    </div>
    <div style="margin-top:14px">
    ${studies.map(s=>`
      <div class="card row" data-id="${s.id}">
        <div class="grow">
          <strong>${esc(s.title)}</strong>
          <p class="muted">${esc(s.client ?? "")} ${s.year?("· "+esc(s.year)):""} · /case-studies/${esc(s.slug)}/</p>
        </div>
        <span class="pill ${s.status==="published"?"on":""}">${s.status}</span>
        <button class="btn ghost" data-a="edit">Edit</button>
      </div>`).join("") || '<p class="muted">Nothing yet.</p>'}
    </div>`;
  v.querySelectorAll('[data-a="edit"]').forEach(b =>
    b.onclick = () => editCase(Number(b.closest("[data-id]").dataset.id)));
  $("#new").onclick = async () => {
    const title = prompt("Working title:"); if(!title) return;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,80) || "untitled";
    try{
      const r = await api("admin/case-studies.php",{method:"POST", body:{title, slug}});
      editCase(r.id);
    }catch(e){ toast(e.message, true); }
  };
}

const BLOCK_DEFS = {
  heading:{label:"Heading"}, text:{label:"Text"}, media:{label:"Media"},
  quote:{label:"Quote"}, cta:{label:"CTA button"},
};

async function editCase(id){
  const {study} = await api("admin/case-studies.php?id="+id);
  let blocks = study.blocks || [];
  const v = $("#view");
  v.innerHTML = `
    <div class="row">
      <button class="btn ghost" id="back">← All case studies</button>
      <div class="grow"></div>
      <a class="btn ghost" target="_blank" href="/case-studies/view/?s=${esc(study.slug)}&preview=1">Preview</a>
      <button class="btn" id="save">Save</button>
      <button class="btn ${study.status==="published"?"ghost":""}" id="pub">
        ${study.status==="published" ? "Unpublish" : "Publish"}</button>
      <button class="btn danger" id="del">Delete</button>
    </div>
    <div class="grid2" style="margin-top:18px">
      <div><label>Title</label><input id="f-title" value="${esc(study.title)}"></div>
      <div><label>Slug</label><input id="f-slug" value="${esc(study.slug)}"></div>
      <div><label>Client</label><input id="f-client" value="${esc(study.client ?? "")}"></div>
      <div><label>Year</label><input id="f-year" value="${esc(study.year ?? "")}"></div>
    </div>
    <label>Intro (lede paragraph)</label><textarea id="f-intro">${esc(study.intro ?? "")}</textarea>
    <label>Cover media path</label>
    <div class="row"><input id="f-cover" class="grow" value="${esc(study.cover ?? "")}">
      <button class="btn ghost" id="coverUp">Upload</button></div>
    <h2 class="sec">Blocks</h2>
    <p class="muted">Media placed left/right lets the following text wrap around it. Full breaks out to the viewport.</p>
    <div class="blocks" id="blocks" style="margin-top:12px"></div>
    <div class="addrow" id="adders">
      ${Object.entries(BLOCK_DEFS).map(([t,d])=>`<button data-add="${t}">+ ${d.label}</button>`).join("")}
    </div>`;

  $("#back").onclick = viewCases;
  $("#coverUp").onclick = async () => {
    const f = await pickFile("image/*"); if(!f) return;
    try{ $("#f-cover").value = await uploadFile(f, "case-studies/" + study.slug); }
    catch(e){ toast(e.message, true); }
  };

  const holder = $("#blocks");
  function renderBlocks(){
    holder.innerHTML = blocks.length ? "" : '<p class="muted">No blocks yet — add the first one below.</p>';
    blocks.forEach((b, i) => holder.appendChild(blockCard(b, i)));
  }
  function blockCard(b, i){
    const card = document.createElement("div");
    card.className = "card";
    let inner = `<p class="mono">${BLOCK_DEFS[b.type]?.label ?? b.type}</p>`;
    if(b.type==="heading") inner += `<input data-k="text" value="${esc(b.text ?? "")}" placeholder="Heading text" style="margin-top:8px">`;
    if(b.type==="text") inner += `<textarea data-k="text" placeholder="Paragraphs — blank line separates them" style="margin-top:8px;min-height:120px">${esc(b.text ?? "")}</textarea>`;
    if(b.type==="quote") inner += `
      <textarea data-k="text" placeholder="Quote" style="margin-top:8px">${esc(b.text ?? "")}</textarea>
      <input data-k="attribution" value="${esc(b.attribution ?? "")}" placeholder="Attribution" style="margin-top:6px">`;
    if(b.type==="cta") inner += `
      <input data-k="label" value="${esc(b.label ?? "")}" placeholder="Button label" style="margin-top:8px">
      <input data-k="href" value="${esc(b.href ?? "")}" placeholder="Link, e.g. /archives/?domain=vr-360&industry=heritage" style="margin-top:6px">`;
    if(b.type==="media") inner += `
      <div class="row" style="margin-top:8px">
        <input data-k="src" class="grow" value="${esc(b.src ?? "")}" placeholder="Media path (/portfolio/… or /uploads/…)">
        <button class="btn ghost" data-a="upload">Upload</button>
      </div>
      <div class="row" style="margin-top:6px">
        <select data-k="placement" style="width:130px">
          ${["full","left","right","inset"].map(p=>`<option ${b.placement===p?"selected":""}>${p}</option>`).join("")}
        </select>
        <input data-k="width" type="number" min="25" max="60" value="${esc(b.width ?? 42)}" title="Width % (left/right)" style="width:80px">
        <select data-k="kind" style="width:130px">
          <option value="image" ${(!b.kind||b.kind==="image")?"selected":""}>image</option>
          <option value="frame" ${b.kind==="frame"?"selected":""}>frame (iframe)</option>
        </select>
        <input data-k="caption" class="grow" value="${esc(b.caption ?? "")}" placeholder="Caption (optional)">
      </div>`;
    inner += `<div class="bar">
      <button data-a="up" title="Move up">▲</button>
      <button data-a="down" title="Move down">▼</button>
      <button data-a="del" title="Remove" style="color:var(--bad)">✕</button></div>`;
    card.innerHTML = inner;
    card.querySelectorAll("[data-k]").forEach(inp => {
      inp.onchange = () => {
        const k = inp.dataset.k;
        b[k] = inp.type === "number" ? Number(inp.value) : inp.value;
      };
    });
    const up = card.querySelector('[data-a="upload"]');
    if(up) up.onclick = async () => {
      const f = await pickFile("image/*,.glb,.html,.mp4"); if(!f) return;
      try{
        b.src = await uploadFile(f, "case-studies/" + study.slug);
        card.querySelector('[data-k="src"]').value = b.src;
      }catch(e){ toast(e.message, true); }
    };
    card.querySelector('[data-a="del"]').onclick = () => { blocks.splice(i,1); renderBlocks(); };
    card.querySelector('[data-a="up"]').onclick = () => { if(i>0){ [blocks[i-1],blocks[i]]=[blocks[i],blocks[i-1]]; renderBlocks(); } };
    card.querySelector('[data-a="down"]').onclick = () => { if(i<blocks.length-1){ [blocks[i+1],blocks[i]]=[blocks[i],blocks[i+1]]; renderBlocks(); } };
    return card;
  }
  renderBlocks();
  $("#adders").querySelectorAll("[data-add]").forEach(b =>
    b.onclick = () => {
      const t = b.dataset.add;
      blocks.push(t==="media" ? {type:"media", src:"", placement:"inset", width:42} : {type:t, text:""});
      renderBlocks();
    });

  async function save(extra={}){
    await api("admin/case-studies.php",{method:"PUT", body:{
      id, title: $("#f-title").value, slug: $("#f-slug").value,
      client: $("#f-client").value, year: $("#f-year").value,
      intro: $("#f-intro").value, cover: $("#f-cover").value,
      blocks, ...extra}});
  }
  $("#save").onclick = async () => { try{ await save(); toast("Saved ✓"); }catch(e){ toast(e.message,true); } };
  $("#pub").onclick = async () => {
    try{
      await save({status: study.status==="published" ? "draft" : "published"});
      toast(study.status==="published" ? "Unpublished" : "Published ✓");
      editCase(id);
    }catch(e){ toast(e.message,true); }
  };
  $("#del").onclick = async () => {
    if(!confirm("Delete this case study permanently?")) return;
    await api("admin/case-studies.php",{method:"DELETE", body:{id}});
    viewCases();
  };
}

/* ——— archive items ——— */
async function viewArchive(){
  const v = $("#view");
  const {items} = await api("admin/archive-items.php");
  v.innerHTML = `<div class="row">
      <p class="mono grow">Archive items — ${items.length} on file</p>
      <button class="btn" id="new">+ New item</button>
    </div>
    <table style="margin-top:14px"><thead>
      <tr><th></th><th>Title</th><th>Domain</th><th>Industry</th><th>Kind</th><th>Status</th><th></th></tr>
    </thead><tbody>
    ${items.map(it=>`
      <tr data-id="${it.id}">
        <td>${it.cover?`<img class="thumb" style="width:64px;height:42px" src="${esc(mediaUrl(it.cover))}">`:""}</td>
        <td><strong>${esc(it.title)}</strong><br><span class="muted">${esc(it.slug)}</span></td>
        <td>${esc(it.domain)}</td><td>${esc(it.industry)}</td><td>${esc(it.kind)}</td>
        <td><span class="pill ${it.published?"on":""}">${it.published?"live":"hidden"}</span></td>
        <td><button class="btn ghost" data-a="edit">Edit</button></td>
      </tr>`).join("")}
    </tbody></table>`;
  v.querySelectorAll('[data-a="edit"]').forEach(b => {
    const id = Number(b.closest("[data-id]").dataset.id);
    b.onclick = () => editItem(items.find(x=>x.id===id));
  });
  $("#new").onclick = () => editItem(null);
}

async function editItem(it){
  const isNew = !it;
  it = it || {slug:"", domain:"photography", industry:"", kind:"gallery", title:"", cover:"", src:"", gallery:null, published:1};
  const v = $("#view");
  v.innerHTML = `
    <div class="row">
      <button class="btn ghost" id="back">← All items</button><div class="grow"></div>
      ${isNew?"":'<button class="btn danger" id="del">Delete</button>'}
      <button class="btn" id="save">${isNew?"Create":"Save"}</button>
    </div>
    <div class="grid2" style="margin-top:18px">
      <div><label>Title</label><input id="i-title" value="${esc(it.title)}"></div>
      <div><label>Slug</label><input id="i-slug" value="${esc(it.slug)}"></div>
      <div><label>Domain</label><select id="i-domain">
        ${["photography","vr-360","gigapixel","3d"].map(d=>`<option ${it.domain===d?"selected":""}>${d}</option>`).join("")}
      </select></div>
      <div><label>Industry (slug, e.g. healthcare)</label><input id="i-industry" value="${esc(it.industry)}"></div>
      <div><label>Kind</label><select id="i-kind">
        ${["gallery","iframe","model"].map(k=>`<option ${it.kind===k?"selected":""}>${k}</option>`).join("")}
      </select></div>
      <div><label>Published</label><select id="i-pub">
        <option value="1" ${it.published?"selected":""}>live</option>
        <option value="0" ${!it.published?"selected":""}>hidden</option>
      </select></div>
    </div>
    <label>Cover media path</label>
    <div class="row"><input id="i-cover" class="grow" value="${esc(it.cover ?? "")}">
      <button class="btn ghost" id="coverUp">Upload</button></div>
    <label>Source (iframe .html / model .glb) — for iframe & model kinds</label>
    <div class="row"><input id="i-src" class="grow" value="${esc(it.src ?? "")}">
      <button class="btn ghost" id="srcUp">Upload</button></div>
    <label>Gallery plates — one media path per line (gallery kind)</label>
    <textarea id="i-gallery" style="min-height:140px">${esc((it.gallery ?? []).join("\n"))}</textarea>
    <div class="row" style="margin-top:8px"><button class="btn ghost" id="galUp">Upload images to gallery</button></div>`;

  $("#back").onclick = viewArchive;
  $("#coverUp").onclick = async () => {
    const f = await pickFile("image/*"); if(!f) return;
    try{ $("#i-cover").value = await uploadFile(f, "archive/" + ($("#i-slug").value || "item")); }catch(e){ toast(e.message,true); }
  };
  $("#srcUp").onclick = async () => {
    const f = await pickFile(".glb,.html"); if(!f) return;
    try{ $("#i-src").value = await uploadFile(f, "archive/" + ($("#i-slug").value || "item")); }catch(e){ toast(e.message,true); }
  };
  $("#galUp").onclick = async () => {
    const inp = document.createElement("input");
    inp.type="file"; inp.accept="image/*"; inp.multiple=true;
    inp.onchange = async () => {
      for(const f of inp.files){
        try{
          const p = await uploadFile(f, "archive/" + ($("#i-slug").value || "item"));
          $("#i-gallery").value = ($("#i-gallery").value.trim() + "\n" + p).trim();
        }catch(e){ toast(e.message,true); break; }
      }
    };
    inp.click();
  };
  $("#save").onclick = async () => {
    const body = {
      slug: $("#i-slug").value, domain: $("#i-domain").value,
      industry: $("#i-industry").value, kind: $("#i-kind").value,
      title: $("#i-title").value, cover: $("#i-cover").value, src: $("#i-src").value,
      gallery: $("#i-gallery").value.split("\n").map(s=>s.trim()).filter(Boolean),
      published: $("#i-pub").value === "1",
    };
    if(body.gallery.length === 0) body.gallery = null;
    try{
      if(isNew) await api("admin/archive-items.php",{method:"POST", body});
      else await api("admin/archive-items.php",{method:"PUT", body:{id:it.id, ...body}});
      toast("Saved ✓"); viewArchive();
    }catch(e){ toast(e.message, true); }
  };
  const del = $("#del");
  if(del) del.onclick = async () => {
    if(!confirm("Delete this archive item?")) return;
    await api("admin/archive-items.php",{method:"DELETE", body:{id:it.id}});
    viewArchive();
  };
}

/* ——— inquiries ——— */
async function viewInbox(){
  const v = $("#view");
  const {inquiries} = await api("admin/inquiries.php");
  v.innerHTML = `<p class="mono">Contact form inquiries — latest ${inquiries.length}</p>
    <table style="margin-top:14px"><thead>
      <tr><th>When</th><th>From</th><th>Message</th><th>Emailed</th></tr>
    </thead><tbody>
    ${inquiries.map(q=>`
      <tr>
        <td style="white-space:nowrap">${esc(q.created_at)}</td>
        <td><strong>${esc(q.name)}</strong><br>
            <a href="mailto:${esc(q.email)}">${esc(q.email)}</a>
            ${q.phone?`<br><span class="muted">${esc(q.phone)}</span>`:""}</td>
        <td style="max-width:480px;white-space:pre-wrap">${q.subject?`<span class="muted">${esc(q.subject)}</span>\n`:""}${esc(q.message)}</td>
        <td>${q.emailed_at ? "✓" : "—"}</td>
      </tr>`).join("") || '<tr><td colspan="4" class="muted">Empty inbox.</td></tr>'}
    </tbody></table>`;
}

boot();
</script>
</body>
</html>
