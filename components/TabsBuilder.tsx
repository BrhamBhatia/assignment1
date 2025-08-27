"use client";
import { useEffect, useMemo, useState } from "react";

type Tab = { id:string; title:string; content:string };

export default function TabsBuilder(){
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(()=>{
    const saved = localStorage.getItem("tabs-data");
    if (saved) {
      const parsed:Tab[] = JSON.parse(saved);
      setTabs(parsed);
      setActive(parsed[0]?.id ?? null);
    }
  },[]);
  useEffect(()=>{
    localStorage.setItem("tabs-data", JSON.stringify(tabs));
  },[tabs]);

  function addTab(){
    if (tabs.length >= 15) return alert("Max 15 tabs");
    const id = crypto.randomUUID();
    const t = { id, title:`Tab ${tabs.length+1}`, content:"Write content here..." };
    const next = [...tabs, t];
    setTabs(next); setActive(id);
  }
  function removeTab(id:string){
    const next = tabs.filter(t=>t.id!==id);
    setTabs(next);
    if (active===id) setActive(next[0]?.id ?? null);
  }
  function update(id:string, field:"title"|"content", value:string){
    setTabs(prev=>prev.map(t=>t.id===id?{...t,[field]:value}:t));
  }

  const output = useMemo(()=>generateHTML(tabs),[tabs]);

  return (
    <section className="container" aria-labelledby="tabsbuilder-title">
      <h1 id="tabsbuilder-title">Tabs Page (Generator)</h1>
      <p>Make up to 15 tabs. Headings & content are editable. Data is saved to your browser (localStorage).</p>

      <div className="tabs-ui">
        <div>
          <button onClick={addTab} aria-label="Add tab">➕ Add Tab</button>
        </div>

        <div className="tablist" role="tablist" aria-label="Editable tabs">
          {tabs.map(t=>(
            <button
              key={t.id}
              role="tab"
              aria-selected={active===t.id}
              aria-controls={`panel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={()=>setActive(t.id)}
            >
              {t.title}
            </button>
          ))}
        </div>

        {tabs.map(t=>(
          <div
            key={t.id}
            role="tabpanel"
            id={`panel-${t.id}`}
            aria-labelledby={`tab-${t.id}`}
            hidden={active!==t.id}
          >
            <label>
              <div>Heading</div>
              <input
                value={t.title}
                onChange={e=>update(t.id,"title",e.target.value)}
                aria-label="Tab title"
              />
            </label>
            <label>
              <div>Content</div>
              <textarea
                value={t.content}
                onChange={e=>update(t.id,"content",e.target.value)}
                rows={6}
                aria-label="Tab content"
              />
            </label>
            <div>
              <button onClick={()=>removeTab(t.id)} aria-label="Remove tab">🗑 Remove</button>
            </div>
          </div>
        ))}

        <div>
          <h2>Generated HTML (inline CSS + JS)</h2>
          <textarea className="codebox" readOnly value={output} aria-label="Generated code"/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <button onClick={()=>{
              navigator.clipboard.writeText(output);
              alert("Copied!");
            }}>Copy to Clipboard</button>
            <a
              href={URL.createObjectURL(new Blob([output],{type:"text/html"}))}
              download="Hello.html"
            >Download Hello.html</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function escapeHtml(s:string){
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function generateHTML(tabs:Tab[]){
  const safeTabs = tabs.map(t=>({title:escapeHtml(t.title), content:escapeHtml(t.content)}));
  const css = `
  body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:16px}
  .tablist{display:flex;gap:8px;flex-wrap:wrap}
  .tablist button{padding:6px 10px;border-radius:8px;border:1px solid #ddd;background:transparent;cursor:pointer}
  .tablist button[aria-selected="true"]{background:#eee}
  .panel{margin-top:12px}
  `;
  const js = `
  (function(){
    const btns=[...document.querySelectorAll('[role="tab"]')];
    const panels=[...document.querySelectorAll('[role="tabpanel"]')];
    function show(id){
      btns.forEach(b=>b.setAttribute('aria-selected', String(b.id===id)));
      panels.forEach(p=>p.hidden = p.getAttribute('aria-labelledby')!==id);
      localStorage.setItem('tabs-active', id);
    }
    btns.forEach(b=>b.addEventListener('click',()=>show(b.id)));
    const saved = localStorage.getItem('tabs-active');
    show(saved && document.getElementById(saved) ? saved : btns[0]?.id);
  })();
  `;
  const tabsButtons = safeTabs.map((t, i)=>`<button role="tab" id="tab-${i}">${t.title}</button>`).join("");
  const panels = safeTabs.map((t, i)=>`<div role="tabpanel" class="panel" aria-labelledby="tab-${i}" hidden><div>${t.content.replaceAll("\\n","<br/>")}</div></div>`).join("");
  return `<!doctype html>
<html lang="en"><meta charset="utf-8"><title>Tabs</title>
<style>${css}</style>
<body>
  <div class="tablist" role="tablist" aria-label="Generated tabs">${tabsButtons}</div>
  ${panels}
<script>${js}</script>
</body></html>`;
}
