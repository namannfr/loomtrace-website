(function(){
  "use strict";
  /* EDIT: set the address enquiries should go to. Leave empty to show a placeholder. */
  var CONTACT_EMAIL = "";

  var $ = function(s,r){return (r||document).querySelector(s)};
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]})}

  /* Arrow-key support for any tablist */
  function tabKeys(list, onSelect, vertical){
    list.addEventListener("keydown",function(e){
      var tabs=$$('[role="tab"]',list); var i=tabs.indexOf(document.activeElement); if(i<0)return;
      var next=null, fwd=vertical?["ArrowDown","ArrowRight"]:["ArrowRight","ArrowDown"], back=vertical?["ArrowUp","ArrowLeft"]:["ArrowLeft","ArrowUp"];
      if(fwd.indexOf(e.key)>-1) next=(i+1)%tabs.length; else if(back.indexOf(e.key)>-1) next=(i-1+tabs.length)%tabs.length; else if(e.key==="Home") next=0; else if(e.key==="End") next=tabs.length-1;
      if(next!==null){e.preventDefault();tabs[next].focus();onSelect(tabs[next]);}
    });
  }
  function setSelected(tabs,active){tabs.forEach(function(t){var on=t===active;t.setAttribute("aria-selected",on?"true":"false");t.tabIndex=on?0:-1;});}

  /* NAV */
  var nav=$("#nav"), toggle=$("#navToggle");
  toggle.addEventListener("click",function(){var open=!nav.classList.contains("open");nav.classList.toggle("open",open);toggle.setAttribute("aria-expanded",open);toggle.setAttribute("aria-label",open?"Close menu":"Open menu");toggle.querySelector("use").setAttribute("href",open?"#i-close":"#i-menu");});
  $$("#navLinks a").forEach(function(a){a.addEventListener("click",function(){if(nav.classList.contains("open"))toggle.click();});});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&nav.classList.contains("open")){toggle.click();toggle.focus();}});
  window.addEventListener("scroll",function(){nav.classList.toggle("scrolled",window.scrollY>8);},{passive:true});
  var navMap={overview:"overview",preview:"how",how:"how",innovation:"innovation",benefits:"innovation",responsible:"responsible",market:"responsible",roadmap:"roadmap",founder:"founder"};
  if("IntersectionObserver" in window){
    var io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){var id=navMap[en.target.id];$$("#navLinks a").forEach(function(a){a.classList.toggle("active",!!id&&a.getAttribute("href")==="#"+id);});}});},{rootMargin:"-45% 0px -50% 0px"});
    $$("main section[id]").forEach(function(s){io.observe(s);});
  }

  /* WORKFLOW */
  var STEPS=[
    {title:"Ingest",tag:"Step 1 of 4",
     text:"The buyer supplies relevant order history: quantities, pricing, lead times, delivery information and shipping records. Twelve to twenty-four months of history is the intended minimum for a pilot.",
     list:["Purchase orders and quantities","Unit prices against each factory's usual rate","Lead times and delivery dates","Shipping and customs records"],
     viz:'<svg viewBox="0 0 520 170" aria-hidden="true"><g font-family="IBM Plex Mono,monospace" font-size="11">'+
       ['ORDERS','PRICES','LEAD TIMES','SHIPMENTS'].map(function(l,i){var y=12+i*38;return '<rect x="8" y="'+y+'" width="150" height="28" rx="6" fill="none" stroke="var(--band-line)"/><text x="22" y="'+(y+18)+'" fill="var(--on-band-2)">'+l+'</text><path d="M158 '+(y+14)+' C 240 '+(y+14)+', 250 85, 330 85" stroke="var(--teal)" stroke-width="1.5" fill="none" opacity=".85"/>';}).join("")+
       '<rect x="330" y="55" width="180" height="60" rx="8" fill="var(--teal)" opacity=".16" stroke="var(--teal)"/><text x="420" y="82" text-anchor="middle" fill="var(--on-band)" font-family="Manrope,sans-serif" font-weight="700" font-size="14">Buyer workspace</text><text x="420" y="100" text-anchor="middle" fill="var(--on-band-2)">CHECKED · KEPT SEPARATE</text></g></svg>'},
    {title:"Reconcile",tag:"Step 2 of 4",
     text:"Each supplier name is matched to a real factory using public factory information, in English and Bengali, with uncertain matches sent to a person. Orders are then added up month by month and compared with what a factory of that size could plausibly produce.",
     list:["One persistent record per factory","Registered workforce and production lines","Human review of uncertain matches","Monthly load against plausible capacity"],
     viz:(function(){var m=["JAN","FEB","MAR","APR","MAY","JUN"],v=[62,70,96,74,58,66],cap=80,s='<svg viewBox="0 0 520 170" aria-hidden="true"><g font-family="IBM Plex Mono,monospace" font-size="10">';
       v.forEach(function(x,i){var X=40+i*78,h=x*1.3,Y=150-h,over=x>cap;s+='<rect x="'+X+'" y="'+Y+'" width="44" height="'+h+'" rx="3" fill="'+(over?"var(--amber)":"var(--teal)")+'" opacity="'+(over?1:.75)+'"/><text x="'+(X+22)+'" y="166" text-anchor="middle" fill="var(--on-band-2)">'+m[i]+'</text>';});
       var cy=150-cap*1.3;s+='<path d="M28 '+cy+' H510" stroke="var(--on-band)" stroke-dasharray="5 4" stroke-width="1.3"/><text x="510" y="'+(cy-6)+'" text-anchor="end" fill="var(--on-band)">PLAUSIBLE CAPACITY (ILLUSTRATIVE)</text></g></svg>';return s;})()},
    {title:"Assess",tag:"Step 3 of 4",
     text:"A planned statistical approach looks for patterns that published research associates with undeclared production. Confirmed investigation outcomes are intended to feed back in, so future assessments can be better calibrated.",
     list:["Price below the factory's usual rate","Unusual lead times for the product","Basic product types","Volume above plausible capacity"],
     viz:'<svg viewBox="0 0 520 170" aria-hidden="true"><g font-family="IBM Plex Mono,monospace" font-size="11">'+
       '<rect x="10" y="20" width="150" height="130" rx="8" fill="none" stroke="var(--band-line)"/><text x="85" y="44" text-anchor="middle" fill="var(--on-band-2)">SIGNALS</text>'+
       [0,1,2,3].map(function(i){return '<rect x="26" y="'+(56+i*22)+'" width="'+[90,70,56,104][i]+'" height="10" rx="3" fill="var(--teal)" opacity="'+(.45+i*.15)+'"/>';}).join("")+
       '<path d="M160 85 H240" stroke="var(--teal)" stroke-width="1.5"/><circle cx="290" cy="85" r="46" fill="none" stroke="var(--teal)" stroke-width="1.5"/><text x="290" y="82" text-anchor="middle" fill="var(--on-band)" font-family="Manrope,sans-serif" font-weight="700" font-size="13">Assess</text><text x="290" y="98" text-anchor="middle" fill="var(--on-band-2)" font-size="9">PATTERNS</text>'+
       '<path d="M336 85 H380" stroke="var(--teal)" stroke-width="1.5"/><rect x="380" y="62" width="130" height="46" rx="8" fill="var(--amber)" opacity=".18" stroke="var(--amber)"/><text x="445" y="90" text-anchor="middle" fill="var(--on-band)" font-family="Manrope,sans-serif" font-weight="600" font-size="12">Review queue</text>'+
       '<path d="M445 108 C445 160, 290 165, 290 131" stroke="var(--on-band-2)" stroke-dasharray="4 4" fill="none"/><text x="372" y="160" text-anchor="middle" fill="var(--on-band-2)" font-size="9">CONFIRMED OUTCOMES FEED BACK</text></g></svg>'},
    {title:"Explain and investigate",tag:"Step 4 of 4",
     text:"Each potential alert explains its contributing signals and suggests a next step. A human reviewer decides what to do, records findings and can export an evidence pack for internal review.",
     list:["Reasons shown for every alert","Suggested next step","Reviewer decision and findings recorded","Exportable evidence pack for internal review"],
     quote:"Given the production and shipment records we already hold, tell me which orders or factories do not make sense under the declared sourcing arrangement, why they look unusual, and what evidence I should investigate next.",
     viz:'<svg viewBox="0 0 520 170" aria-hidden="true"><g font-family="IBM Plex Mono,monospace" font-size="10">'+
       ['SIGNALS','REVIEWER','FINDINGS','EVIDENCE PACK'].map(function(l,i){var X=16+i*126;return '<circle cx="'+(X+44)+'" cy="70" r="16" fill="'+(i<2?"var(--teal)":"none")+'" opacity="'+(i<2?.9:1)+'" stroke="var(--teal)" stroke-width="1.5"/><text x="'+(X+44)+'" y="110" text-anchor="middle" fill="var(--on-band-2)">'+l+'</text>'+(i<3?'<path d="M'+(X+62)+' 70 H'+(X+152)+'" stroke="var(--teal)" stroke-width="1.5" stroke-dasharray="'+(i<1?"0":"4 4")+'"/>':"");}).join("")+
       '<text x="260" y="148" text-anchor="middle" fill="var(--on-band)" font-family="Manrope,sans-serif" font-size="12">A person makes every decision. The record shows why.</text></g></svg>'}
  ];
  var stage=$("#stage"), stepBtns=$$(".step-btn");
  function renderStep(i){
    var s=STEPS[i];
    stage.innerHTML='<div class="stage-panel"><div class="stage-head"><h3>'+esc(s.title)+'</h3><span class="tag" style="border-color:var(--band-line);color:var(--on-band-2)">'+s.tag+' · Intended workflow</span></div><p>'+esc(s.text)+'</p><div class="stage-viz">'+s.viz+'</div><ul class="stage-list">'+s.list.map(function(l){return "<li>"+esc(l)+"</li>"}).join("")+'</ul>'+(s.quote?'<blockquote class="quote">“'+esc(s.quote)+'”<cite>The buyer need Loomtrace is designed around</cite></blockquote>':'')+'</div>';
    stage.setAttribute("aria-labelledby",stepBtns[i].id);
  }
  stepBtns.forEach(function(b){b.addEventListener("click",function(){setSelected(stepBtns,b);renderStep(+b.dataset.step);});});
  tabKeys($(".steps"),function(t){setSelected(stepBtns,t);renderStep(+t.dataset.step);},true);
  renderStep(0);

  /* PRODUCT PREVIEW (all fictional) */
  var MONTHS=["Jan","Feb","Mar","Apr","May","Jun"];
  var ORDERS=[
    {id:"PO-24117",product:"Basic crew-neck tee",factory:"Meridian Knitwear",qty:"48,000",lead:"94 days",leadNote:"usual: 60–70",price:"Below usual",priceNote:"vs this factory's recent orders",month:2,
     status:"review",statusText:"Review suggested",
     message:"Review suggested: the order quantity appears inconsistent with the available capacity information. Further investigation is required.",
     signals:[["a","Booked volume for March is above the factory's plausible capacity estimate"],["a","Unit price is below this factory's usual rate for similar products"],["a","Lead time is longer than usual for this product type"],["n","Delivery dates match the shipping record"]],
     next:"Request production records for March and confirm which site produced the order.",
     load:[58,66,104,72,61,64],cap:80,
     fac:{name:"Meridian Knitwear Ltd",bn:"Matched (Bengali registry spelling)",region:"Dhaka division",workforce:"~1,200 registered",lines:"14 knitting/sewing lines",match:"Reviewer confirmed",audit:"Audited, rating current",since:"Supplier for 3 years"},
     trail:[["12 Mar","Alert raised","Three signals contributed; see Order signals.",1],["13 Mar","Assigned to ethical-trade reviewer","Priority set by reviewer, not by the software.",1],["15 Mar","Factory capacity record checked","Registered lines and workforce confirmed against registry.",1],["18 Mar","Information requested from supplier","Production records for March requested.",1],["—","Outcome","Pending. No conclusion has been recorded.",0]]},
    {id:"PO-24152",product:"Woven chino trouser",factory:"Northfield Apparel",qty:"12,500",lead:"71 days",leadNote:"usual: 65–80",price:"In line",priceNote:"vs this factory's recent orders",month:3,
     status:"none",statusText:"No signals noted",
     message:"No signals noted for this order on the information available. This is not a confirmation of where the order was produced.",
     signals:[["n","Booked volume is within the plausible capacity estimate"],["n","Unit price is in line with this factory's usual rate"],["n","Lead time is typical for this product"]],
     next:"No action suggested. The order stays in routine monitoring.",
     load:[44,51,48,57,52,49],cap:80,
     fac:{name:"Northfield Apparel Ltd",bn:"Matched",region:"Chattogram division",workforce:"~2,400 registered",lines:"22 sewing lines",match:"Automatic, high agreement",audit:"Audited, rating current",since:"Supplier for 5 years"},
     trail:[["02 Apr","Order assessed","No signals raised.",1],["—","Next routine review","Monthly.",0]]},
    {id:"PO-24139",product:"Fleece hoodie",factory:"Riverbank Garments",qty:"30,000",lead:"58 days",leadNote:"usual: 55–65",price:"Below usual",priceNote:"vs this factory's recent orders",month:1,
     status:"context",statusText:"Context needed",
     message:"Context needed: one signal is present but the factory match is uncertain. Confirm the factory identity before drawing any conclusion.",
     signals:[["a","Unit price is below this factory's usual rate"],["a","Supplier name matches two possible registry records"],["n","Booked volume is within the capacity estimate for the likelier match"]],
     next:"Confirm the factory's licence number with the supplier, then reassess.",
     load:[61,77,70,63,55,60],cap:85,
     fac:{name:"Riverbank Garments (2 candidates)",bn:"Two spellings found",region:"Dhaka division",workforce:"Depends on match",lines:"Depends on match",match:"Awaiting human review",audit:"Audited, rating current",since:"Supplier for 1 year"},
     trail:[["20 Feb","Alert raised","Identity uncertain; capacity check limited.",1],["21 Feb","Match sent for human review","Two candidate records.",1],["—","Outcome","Pending.",0]]},
    {id:"PO-24160",product:"Knitted polo shirt",factory:"Meridian Knitwear",qty:"9,000",lead:"66 days",leadNote:"usual: 60–70",price:"In line",priceNote:"vs this factory's recent orders",month:4,
     status:"none",statusText:"No signals noted",
     message:"No signals noted for this order on the information available. This is not a confirmation of where the order was produced.",
     signals:[["n","Booked volume for May is within the plausible capacity estimate"],["n","Price and lead time are typical"]],
     next:"No action suggested. The open review on PO-24117 at the same factory continues separately.",
     load:[58,66,104,72,61,64],cap:80,
     fac:{name:"Meridian Knitwear Ltd",bn:"Matched (Bengali registry spelling)",region:"Dhaka division",workforce:"~1,200 registered",lines:"14 knitting/sewing lines",match:"Reviewer confirmed",audit:"Audited, rating current",since:"Supplier for 3 years"},
     trail:[["06 May","Order assessed","No signals raised.",1],["—","Next routine review","Monthly.",0]]}
  ];
  var cur=0, view="signals";
  var queue=$("#queue"), detail=$("#detail"), viewBtns=$$(".seg [role=tab]");
  function statusTag(o){return o.status==="review"?'<span class="tag amber"><span class="dot"></span>'+o.statusText+'</span>':o.status==="context"?'<span class="tag"><span class="dot"></span>'+o.statusText+'</span>':'<span class="tag teal">'+o.statusText+'</span>';}
  function renderQueue(){
    queue.innerHTML=ORDERS.map(function(o,i){return '<li><button class="q-item" role="option" aria-selected="'+(i===cur)+'" data-i="'+i+'"><span class="q-top"><span class="q-id">'+o.id+'</span>'+statusTag(o)+'</span><span class="q-meta">'+esc(o.product)+' · '+esc(o.factory)+' (fictional)</span></button></li>';}).join("");
    $$(".q-item",queue).forEach(function(b){b.addEventListener("click",function(){cur=+b.dataset.i;renderQueue();renderDetail();});});
  }
  function chart(o){
    var W=460,H=190,pl=34,pb=26,pt=14,max=120,bw=40,gap=(W-pl-10-bw*6)/5;
    var y=function(v){return pt+(H-pt-pb)*(1-v/max)};
    var s='<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Illustrative monthly booked load against plausible capacity for '+esc(o.fac.name)+'"><g font-family="IBM Plex Mono,monospace" font-size="10">';
    [0,40,80,120].forEach(function(t){s+='<line x1="'+pl+'" x2="'+(W-6)+'" y1="'+y(t)+'" y2="'+y(t)+'" stroke="var(--line)"/><text x="'+(pl-6)+'" y="'+(y(t)+3)+'" text-anchor="end" fill="var(--slate)">'+t+'</text>';});
    o.load.forEach(function(v,i){var X=pl+8+i*(bw+gap),over=v>o.cap,sel=i===o.month;
      s+='<rect x="'+X+'" y="'+y(v)+'" width="'+bw+'" height="'+(y(0)-y(v))+'" rx="3" fill="'+(over?"var(--amber)":"var(--teal)")+'" opacity="'+(sel?1:.45)+'"/>';
      if(sel)s+='<rect x="'+(X-3)+'" y="'+(y(v)-3)+'" width="'+(bw+6)+'" height="'+(y(0)-y(v)+3)+'" rx="4" fill="none" stroke="var(--ink)" stroke-width="1.2"/>';
      s+='<text x="'+(X+bw/2)+'" y="'+(H-8)+'" text-anchor="middle" fill="'+(sel?"var(--ink)":"var(--slate)")+'" font-weight="'+(sel?600:400)+'">'+MONTHS[i]+'</text>';});
    s+='<line x1="'+pl+'" x2="'+(W-6)+'" y1="'+y(o.cap)+'" y2="'+y(o.cap)+'" stroke="var(--ink)" stroke-dasharray="5 4" stroke-width="1.2"/><text x="'+(W-8)+'" y="'+(y(o.cap)-5)+'" text-anchor="end" fill="var(--ink)">Plausible capacity</text>';
    s+='</g></svg>';return s;
  }
  function renderDetail(){
    var o=ORDERS[cur], h='';
    h+='<div class="detail-head"><div style="display:grid;gap:.25rem"><span class="label">'+o.id+' · '+esc(o.factory)+' (fictional)</span><h3>'+esc(o.product)+'</h3></div>'+statusTag(o)+'</div>';
    if(view==="signals"){
      h+='<div class="alert-msg'+(o.status==="none"?" neutral":"")+'"><svg><use href="#'+(o.status==="none"?"i-info":"i-flag")+'"/></svg><span>'+esc(o.message)+'</span></div>';
      h+='<dl class="metrics"><div class="metric"><dt>Quantity</dt><dd>'+o.qty+'</dd><small>pieces</small></div><div class="metric"><dt>Lead time</dt><dd>'+o.lead+'</dd><small>'+o.leadNote+'</small></div><div class="metric"><dt>Price</dt><dd>'+o.price+'</dd><small>'+o.priceNote+'</small></div><div class="metric"><dt>Delivery month</dt><dd>'+MONTHS[o.month]+'</dd><small>sample period</small></div></dl>';
      h+='<div class="two"><div class="panel"><h4>Capacity context <span class="tag">Illustrative units, k pcs</span></h4><div class="chart-wrap">'+chart(o)+'</div></div><div class="panel"><h4>Why this was raised</h4><ul class="signals">'+o.signals.map(function(s){return '<li><span class="sig-mark '+s[0]+'"><svg><use href="#'+(s[0]==="a"?"i-flag":"i-check")+'"/></svg></span><span>'+esc(s[1])+'</span></li>'}).join("")+'</ul><div class="next"><span class="label">Suggested next step</span><span>'+esc(o.next)+'</span></div></div></div>';
    } else if(view==="factory"){
      var f=o.fac;
      h+='<div class="two"><div class="panel"><h4>Factory profile <span class="tag">Fictional</span></h4><dl class="fp-grid"><div><dt>Registered name</dt><dd>'+esc(f.name)+'</dd></div><div><dt>Bengali registry match</dt><dd>'+esc(f.bn)+'</dd></div><div><dt>Region</dt><dd>'+esc(f.region)+'</dd></div><div><dt>Workforce</dt><dd>'+esc(f.workforce)+'</dd></div><div><dt>Production lines</dt><dd>'+esc(f.lines)+'</dd></div><div><dt>Identity match</dt><dd>'+esc(f.match)+'</dd></div><div><dt>Audit status</dt><dd>'+esc(f.audit)+'</dd></div><div><dt>Relationship</dt><dd>'+esc(f.since)+'</dd></div></dl></div>';
      h+='<div class="panel"><h4>This buyer\'s monthly load</h4><div class="chart-wrap">'+chart(o)+'</div><p class="muted" style="font-size:.8rem">Shows only this buyer\'s orders. A combined view across buyers is a planned capability that would show a band, never another brand\'s orders.</p></div></div>';
    } else {
      h+='<div class="two"><div class="panel"><h4>Investigation record</h4><ol class="timeline">'+o.trail.map(function(t){return '<li><time>'+t[0]+'</time><span class="tl-dot'+(t[3]?"":" open")+'"></span><div><b>'+esc(t[1])+'</b><p>'+esc(t[2])+'</p></div></li>'}).join("")+'</ol></div>';
      h+='<div class="panel"><h4>Evidence pack</h4><ul class="signals"><li><span class="sig-mark n"><svg><use href="#i-check"/></svg></span><span>Signals and the data each one used</span></li><li><span class="sig-mark n"><svg><use href="#i-check"/></svg></span><span>Factory identity match and who confirmed it</span></li><li><span class="sig-mark n"><svg><use href="#i-check"/></svg></span><span>Reviewer decisions, dated</span></li><li><span class="sig-mark n"><svg><use href="#i-check"/></svg></span><span>Outcome, once recorded by a person</span></li></ul><div class="next"><span class="label">Intended use</span><span>Internal diligence and senior management review. Not presented as satisfying any legal or regulatory requirement.</span></div><button class="btn-sm" type="button" id="exportBtn" style="justify-self:start">Export evidence pack (preview)</button><span class="muted" id="exportMsg" style="font-size:.8rem" aria-live="polite"></span></div></div>';
    }
    detail.innerHTML=h;
    var eb=$("#exportBtn"); if(eb) eb.addEventListener("click",function(){$("#exportMsg").textContent="In the intended product this would create a dated pack for internal review. Nothing is exported in this preview.";});
  }
  viewBtns.forEach(function(b){b.addEventListener("click",function(){setSelected(viewBtns,b);view=b.dataset.view;renderDetail();});});
  tabKeys($(".seg"),function(t){setSelected(viewBtns,t);view=t.dataset.view;renderDetail();});
  renderQueue();renderDetail();

  /* AUDIENCES */
  var ic=function(id){return '<svg><use href="#'+id+'"/></svg>'};
  var AUD=[
    {k:"Sourcing and procurement",h:"For sourcing and procurement teams",p:"Understand potential capacity mismatches and look at unusual orders before or during production.",pts:["See when an order may exceed a factory's plausible capacity","Understand how your own price and lead-time terms relate to risk (planned)","Avoid disrupting suppliers: nothing is sent to them by the software"],before:"No view of a factory's total workload",after:"A warning when an order looks likely to exceed capacity"},
    {k:"Ethical trade and compliance",h:"For ethical trade and compliance teams",p:"Prioritise investigations and document why specific orders or factories needed further review.",pts:["A ranked queue with the reasons behind each item","A record of why each audit or investigation was chosen","Non-accusatory wording suitable for internal escalation"],before:"Audits spread evenly; problems surface late",after:"Audits pointed at ranked questions, with a record of why"},
    {k:"Boards and senior management",h:"For boards and senior management",p:"Build a more evidence-based view of whether sourcing declarations have been checked against available commercial information.",pts:["A dated record of how declarations were tested","Clear statements of what an alert does and does not mean","Support for internal diligence, without claims of legal compliance"],before:"Reliance on supplier declarations",after:"Able to show declarations were tested against data"},
    {k:"Factories and exporters",h:"For factories and exporters",p:"A proposed free portal could give benchmarked feedback and a fair way to respond to concerns or share aggregate production information voluntarily.",pts:["Free to use; factories would not be charged","Respond to a concern with aggregate data that stays on your premises","A route to declare subcontractors openly so they can be approved"],before:"Concerns raised without a clear route to respond",after:"A way to show capacity and contest an alert (proposed)"}
  ];
  var audTabs=$("#audTabs"), audPanel=$("#audPanel");
  audTabs.innerHTML=AUD.map(function(a,i){return '<button class="tab" role="tab" id="aud-'+i+'" aria-controls="audPanel" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'" data-i="'+i+'">'+a.k+'</button>'}).join("");
  var audBtns=$$(".tab",audTabs);
  function renderAud(i){var a=AUD[i];audPanel.setAttribute("aria-labelledby","aud-"+i);audPanel.innerHTML='<div class="aud"><div class="aud-main"><span class="label">Intended use</span><h3>'+a.h+'</h3><p>'+a.p+'</p><ul>'+a.pts.map(function(x){return '<li>'+ic("i-check")+'<span>'+esc(x)+'</span></li>'}).join("")+'</ul></div><div class="ba"><div class="ba-row"><span class="label">Today</span><p>'+esc(a.before)+'</p></div><div class="ba-row after"><span class="label">With Loomtrace (intended)</span><p>'+esc(a.after)+'</p></div><p class="note">'+ic("i-info")+'<span>Potential outcome. Not yet demonstrated.</span></p></div></div>';}
  audBtns.forEach(function(b){b.addEventListener("click",function(){setSelected(audBtns,b);renderAud(+b.dataset.i);});});
  tabKeys(audTabs,function(t){setSelected(audBtns,t);renderAud(+t.dataset.i);});
  renderAud(0);

  /* FAQ */
  var FAQ=[
    ["What does Loomtrace do?","Loomtrace is developing software that uses records a clothing buyer already holds, such as order quantities, prices, lead times, delivery and shipping records, to identify orders and factories that may warrant further investigation because production may have taken place outside the declared factory. It explains the signals behind each potential alert and keeps an evidence trail for human review."],
    ["Does Loomtrace require suppliers to upload information?","No. The core product is designed to work from buyer-held data, checked against public factory information, without asking suppliers to enter anything. A free, optional portal for factories is proposed for a later stage, where a factory could see feedback and choose to share aggregate production information."],
    ["Is Loomtrace available today?","Not yet. Loomtrace is at concept and validation stage. The current focus is speaking with UK buyers, securing access to real order data and testing the method on cases with known outcomes. The product preview on this page is illustrative."],
    ["Does an alert mean a factory has subcontracted?","No. An alert means the buyer's records contain patterns worth a closer look. It is a prompt for human investigation, not a finding. Loomtrace does not label factories as guilty or non-compliant, and it does not name factories publicly."],
    ["Does Loomtrace replace audits or traceability platforms?","No. It is intended to complement them. A buyer would keep its existing audit and traceability tools and use Loomtrace to test whether what they report is consistent with its own order data, and to direct audit effort where questions arise."],
    ["How accurate is it?","That is not known yet, and Loomtrace does not quote an accuracy figure for its own product. Published academic research found that buyer-held data can predict unauthorised subcontracting, but those are the study's results. The intended pilot is designed to answer the question on a partner's own data, against cases it already knows."],
    ["What data would a design partner share?","Typically 12 to 24 months of order history: quantities, prices, lead times, delivery and shipping records, linked to factory identifiers. The intended pilot covers up to 25 factories where some outcomes are already known from past investigations. Security documentation, a non-disclosure agreement and a data processing agreement would be agreed before any data moves."],
    ["How would commercially sensitive data be protected?","The design intention is that each buyer's data is held separately and never shown to another brand. Any future cross-buyer view would show only a factory's utilisation band, and would proceed only after legal review of competition, confidentiality and data-protection questions. Loomtrace does not currently claim any security certification."],
    ["Will an evidence pack satisfy a regulator?","Loomtrace makes no such claim. Evidence packs are intended to support a buyer's internal diligence and senior management review. Whether they help meet any specific legal requirement is a matter for the buyer's own legal advisers."],
    ["How would Loomtrace be priced?","As a B2B software subscription: a platform fee plus a fee for each monitored factory, with possible additional modules later. Factories would use the feedback portal free of charge. Pricing will be confirmed with early partners."],
    ["Which markets will Loomtrace serve?","UK apparel retailers and brands sourcing from Bangladesh first. EU buyers may follow, and, subject to validation, further sourcing countries such as India, Pakistan and Vietnam."]
  ];
  var fl=$("#faqList");
  fl.innerHTML=FAQ.map(function(q,i){return '<div class="faq-item"><h3 style="font-size:inherit;letter-spacing:0"><button class="faq-q" id="fq-'+i+'" aria-expanded="'+(i===0)+'" aria-controls="fa-'+i+'">'+esc(q[0])+'<svg><use href="#i-plus"/></svg></button></h3><div class="faq-a" id="fa-'+i+'" role="region" aria-labelledby="fq-'+i+'"'+(i===0?"":" hidden")+'><p>'+esc(q[1])+'</p></div></div>'}).join("");
  $$(".faq-q",fl).forEach(function(b){b.addEventListener("click",function(){var open=b.getAttribute("aria-expanded")==="true";b.setAttribute("aria-expanded",!open);$("#"+b.getAttribute("aria-controls")).hidden=open;});});

  /* CONTACT */
  var form=$("#contactForm"), out=$("#formOut");
  var emailShown=CONTACT_EMAIL||"[contact email to be added]";
  $("#emailChip").textContent=emailShown;
  form.addEventListener("submit",function(e){
    e.preventDefault();
    var ok=true;
    [["cf-name","err-name","Enter your name."],["cf-org","err-org","Enter your organisation."]].forEach(function(f){var v=$("#"+f[0]).value.trim();$("#"+f[1]).textContent=v?"":f[2];if(!v)ok=false;});
    var em=$("#cf-email").value.trim(), emOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
    $("#err-email").textContent=emOk?"":"Enter a work email address, like name@company.com.";
    if(!emOk)ok=false;
    if(!ok){out.hidden=true;var firstErr=$$(".err",form).filter(function(x){return x.textContent})[0];if(firstErr)firstErr.previousElementSibling.focus();return;}
    var txt="Subject: Loomtrace: "+$("#cf-type").value+"\n\nName: "+$("#cf-name").value.trim()+"\nOrganisation: "+$("#cf-org").value.trim()+($("#cf-role").value.trim()?"\nRole: "+$("#cf-role").value.trim():"")+"\nEmail: "+em+"\nInterest: "+$("#cf-type").value+"\n\n"+($("#cf-msg").value.trim()||"I would like to discuss a design partnership with Loomtrace.");
    $("#formText").textContent=txt;out.hidden=false;$("#copyState").textContent="";
  });
  $("#copyBtn").addEventListener("click",function(){
    var t=$("#formText").textContent,st=$("#copyState");
    function fallback(){var r=document.createRange();r.selectNodeContents($("#formText"));var s=window.getSelection();s.removeAllRanges();s.addRange(r);st.textContent="Text selected. Press Ctrl+C or Cmd+C to copy.";}
    try{navigator.clipboard.writeText(t).then(function(){st.textContent="Copied.";},fallback);}catch(err){fallback();}
  });

  $("#yr").textContent=new Date().getFullYear();
})();
