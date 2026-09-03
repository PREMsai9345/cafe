document.addEventListener('DOMContentLoaded',()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const nav=$('.menu-toggle'),links=$('.nav-links');nav&&links&&nav.addEventListener('click',()=>{links.classList.toggle('open');nav.setAttribute('aria-expanded',links.classList.contains('open'))});
if(links)links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));

/* ---------- Tea-kadai hero ---------- */
const hero=$('.hero-slider');
if(hero){
  $$('.hero-slide',hero).slice(1).forEach(x=>x.remove());
  const slide=$('.hero-slide',hero), oldImg=$('img',slide);
  if(oldImg)oldImg.style.display='none';
  $$('.slider-arrow,.slider-dots,.slider-dot',hero).forEach(x=>x.remove());
  $('.slider-dots',hero)?.remove();
  const e=$('.eyebrow',slide),h=$('h1,h2',slide),p=$('p',slide),a=$('.hero-actions',slide);
  e&&(e.textContent='தமிழ் Tea Kadai • Chennai');
  h&&(h.innerHTML='ஒரு டம்ளர் டீ...<br><span>ஒரு முழு எனர்ஜி.</span>');
  p&&(p.textContent='Hot Tea. Fresh Energy. Local Vibe.');
  a&&(a.innerHTML='<a class="btn btn-primary" href="https://wa.me/919962571464?text=Hi%20Kaapi%20yumm%2C%20I%20would%20like%20to%20order%20tea." target="_blank" rel="noreferrer">Order Tea</a><a class="btn btn-light" href="#menu">View Menu</a>');
  slide.classList.add('tea-hero-slide');
  const stage=document.createElement('div');stage.className='tea-3d-stage';stage.innerHTML='<div class="tea-loader"><b>☕</b><span>Tea is getting ready...</span><i></i></div><div class="tea-no-webgl">Enable WebGL for the full 3D tea-kadai experience.</div><div class="tea-scroll">Scroll to explore ↓</div>';hero.prepend(stage);
  const st=document.createElement('style');st.textContent=`
  .hero-slider{position:relative!important;min-height:700px!important;height:min(780px,calc(100vh - 90px))!important;background:#24130d!important;color:#fffaf3;overflow:hidden}
  .tea-hero-slide{position:relative!important;inset:auto!important;opacity:1!important;visibility:visible!important;min-height:700px;height:100%;z-index:4!important}
  .tea-hero-slide .hero-slide-overlay{z-index:5;background:linear-gradient(90deg,rgba(18,8,4,.92),rgba(32,14,7,.78) 42%,rgba(32,14,7,.18) 90%)!important}
  .tea-hero-slide .hero-slide-content{position:relative;z-index:7;height:100%;padding-right:48%;justify-content:center}
  .tea-hero-slide h1,.tea-hero-slide h2{font-size:clamp(46px,6vw,78px);line-height:1.02}
  .tea-hero-slide h1 span,.tea-hero-slide h2 span{color:var(--gold)}
  .tea-3d-stage{position:absolute;inset:0;z-index:6;pointer-events:auto}
  .tea-3d-stage canvas{display:block;width:100%!important;height:100%!important}
  .tea-loader{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;background:#24130d;z-index:30;color:#f4dfcf;transition:.7s}
  .tea-loader.hide{opacity:0;visibility:hidden}.tea-loader b{font-size:36px;animation:teaBob 1.1s infinite}.tea-loader i{width:54px;height:4px;border-radius:99px;background:#6d351f;overflow:hidden}.tea-loader i:after{content:"";display:block;width:50%;height:100%;background:#dfa16a;animation:teaLoad 1s infinite}
  .tea-no-webgl{display:none;position:absolute;inset:0;z-index:29;place-items:center;color:#f4dfcf;text-align:center;padding:30px;background:#24130d}.tea-no-webgl.show{display:grid}.tea-scroll{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);z-index:8;font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.75}
  .tea-3d-reveal{opacity:0;transform:translateY(24px) scale(.98);transition:opacity .8s ease,transform .8s ease}.tea-3d-reveal.in{opacity:1;transform:none}
  @keyframes teaLoad{to{transform:translateX(220%)}}@keyframes teaBob{50%{transform:translateY(-5px)}}
  @media(max-width:950px){.hero-slider{min-height:650px!important;height:calc(100vh - 82px)!important}.tea-hero-slide{min-height:650px}.tea-hero-slide .hero-slide-content{padding-right:42%}.tea-3d-stage{left:20%;}}
  @media(max-width:620px){.hero-slider{min-height:720px!important;height:720px!important}.tea-hero-slide{min-height:720px}.tea-hero-slide .hero-slide-overlay{background:linear-gradient(180deg,rgba(20,9,5,.25),rgba(20,9,5,.72) 55%,rgba(20,9,5,.95))!important}.tea-hero-slide .hero-slide-content{padding:0 7% 54%;justify-content:flex-end}.tea-hero-slide h1,.tea-hero-slide h2{font-size:45px}.tea-3d-stage{inset:0 0 42% 0}.tea-scroll{display:none}}
  `;document.head.appendChild(st);

  const init3D=()=>{if(!window.THREE){$('.tea-no-webgl')?.classList.add('show');$('.tea-loader')?.remove();return}if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){$('.tea-loader')?.classList.add('hide');return}
    const T=THREE,scene=new T.Scene(),camera=new T.PerspectiveCamera(30,1,.1,100),renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.setSize(stage.clientWidth,stage.clientHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;stage.appendChild(renderer.domElement);camera.position.set(0,1.8,10);
    const G=new T.Group();scene.add(G),W=new T.Group();W.position.set(.55,-1.35,.15);G.add(W),env=new T.Group();G.add(env);
    const M=(c,me=0,r=.6)=>new T.MeshStandardMaterial({color:c,metalness:me,roughness:r}),steel=M(0xd3d7d9,.92,.16),steel2=M(0x68747a,.85,.22),skin=M(0x895033,0,.6),shirt=M(0x345764,0,.8),cloth=M(0xe8dbc5,0,.92),hair=M(0x1b1411,0,.95),wood=M(0x513021,0,.9),tea=M(0x713217,0,.33),dark=M(0x26140f,0,.96),glass=new T.MeshPhysicalMaterial({color:0xd9a16c,transparent:true,opacity:.34,roughness:.2});
    const box=(x,y,z,m)=>new T.Mesh(new T.BoxGeometry(x,y,z),m),cy=(a,b,h,m,n=28)=>new T.Mesh(new T.CylinderGeometry(a,b,h,n),m),sp=(s,m)=>new T.Mesh(new T.SphereGeometry(s,22,16),m);
    env.add(Object.assign(box(14,8,.2,dark),{position:new T.Vector3(0,1,-3.5)}));env.add(Object.assign(box(14,.22,8,dark),{position:new T.Vector3(0,-2.45,0)}));
    const ctr=box(8,.65,2.6,wood);ctr.position.set(0,-1.9,.1);env.add(ctr);
    [2.1,3].forEach(y=>{const sh=box(7,.14,.55,steel2);sh.position.set(-.8,y,-2.6);env.add(sh)});
    for(let i=0;i<5;i++){const j=cy(.3,.32,.65,glass);j.position.set(-3.1+i*.85,2.48,-2.15);env.add(j);const l=cy(.33,.33,.07,steel);l.position.set(j.position.x,2.84,j.position.z);env.add(l)}
    const pot=cy(.82,.95,1.25,steel,36);pot.position.set(-2,-1.02,-.8);env.add(pot);const lid=cy(.7,.7,.1,steel2,36);lid.position.set(-2,-.34,-.8);env.add(lid);
    const stove=box(1.15,.15,1,steel2);stove.position.set(-2,-1.58,-.72);env.add(stove);const flame=new T.Mesh(new T.ConeGeometry(.22,.5,14),new T.MeshBasicMaterial({color:0xff9c30,transparent:true,opacity:.85}));flame.position.set(-2,-1.23,-.72);env.add(flame);
    const biscuit=cy(.5,.5,1,glass,28);biscuit.position.set(2.8,-.95,-.75);env.add(biscuit);const bl=cy(.53,.53,.08,steel,28);bl.position.set(2.8,-.43,-.75);env.add(bl);
    // worker body
    const torso=cy(.63,.72,1.55,shirt,30);torso.position.set(.65,.05,.4);W.add(torso);const veshti=box(1.5,.9,.75,cloth);veshti.position.set(.65,-1.05,.4);W.add(veshti);const hip=sp(.58,cloth);hip.scale.set(1.18,.52,.88);hip.position.set(.65,-.65,.4);W.add(hip);
    const head=sp(.48,skin);head.position.set(.65,1.3,.4);W.add(head);const neck=cy(.2,.22,.3,skin);neck.position.set(.65,.88,.4);W.add(neck);const hc=sp(.5,hair);hc.scale.set(1.02,.53,1);hc.position.set(.65,1.57,.36);W.add(hc);
    const eyeM=new T.MeshBasicMaterial({color:0x120c09});[-.17,.17].forEach(x=>{const q=sp(.035,eyeM);q.position.set(.65+x,1.35,.82);W.add(q)});const nose=cy(.055,.03,.14,skin,12);nose.rotation.x=Math.PI/2;nose.position.set(.65,1.24,.86);W.add(nose);
    const UL=cy(.16,.18,.8,shirt);UL.rotation.z=-.5;UL.position.set(.05,.22,.42);W.add(UL);const LL=cy(.14,.16,.7,skin);LL.rotation.z=-.25;LL.position.set(-.4,-.08,.66);W.add(LL);const HL=sp(.17,skin);HL.position.set(-.62,-.3,.76);W.add(HL);
    const UR=cy(.16,.18,.8,shirt);UR.rotation.z=.55;UR.position.set(1.27,.2,.42);W.add(UR);const LR=cy(.14,.16,.7,skin);LR.rotation.z=.25;LR.position.set(1.6,-.03,.68);W.add(LR);const HR=sp(.17,skin);HR.position.set(1.8,-.28,.78);W.add(HR);
    // pitcher + tumbler
    const pitcher=new T.Group();pitcher.position.set(1.93,-.12,.78);W.add(pitcher);const pb=cy(.22,.28,.68,steel,28);pb.position.y=.22;pitcher.add(pb);const pt=cy(.24,.24,.08,steel2,28);pt.position.y=.58;pitcher.add(pt);const ph=new T.Mesh(new T.TorusGeometry(.24,.05,12,30,Math.PI*1.5),steel);ph.rotation.y=Math.PI/2;ph.position.set(-.24,.25,0);pitcher.add(ph);const ps=box(.13,.12,.62,steel);ps.position.set(.31,.42,.02);ps.rotation.z=-.35;pitcher.add(ps);
    const cupG=new T.Group();cupG.position.set(-.63,-1.2,.75);W.add(cupG);const cup=cy(.18,.24,.46,steel,28);cupG.add(cup);const cs=cy(.16,.16,.025,tea,24);cs.position.y=.24;cupG.add(cs);const sau=cy(.38,.45,.08,steel2,32);sau.position.y=-.26;cupG.add(sau);
    const stream=new T.Mesh(new T.CylinderGeometry(.035,.065,.95,14),tea);stream.visible=false;W.add(stream);
    // steam particles
    const sMat=new T.MeshBasicMaterial({color:0xf4dfd3,transparent:true,opacity:.32}),steam=[];for(let i=0;i<12;i++){const q=sp(.06,sMat);q.position.set(-.63+(Math.random()-.5)*.3,-.95+Math.random()*.2,.78);env.add(q);steam.push(q)}
    scene.add(new T.HemisphereLight(0xffe2cf,0x1b0d08,2.2));const key=new T.DirectionalLight(0xffe8d0,3.8);key.position.set(4,6,5);scene.add(key);const fill=new T.PointLight(0xffa45d,14,8);fill.position.set(1,1.5,3);scene.add(fill);
    let mx=0,my=0,px=0,py=0,t0=performance.now();stage.addEventListener('pointermove',ev=>{const r=stage.getBoundingClientRect();mx=(ev.clientX-r.left)/r.width-.5;my=(ev.clientY-r.top)/r.height-.5});
    const resize=()=>{const w=stage.clientWidth||innerWidth,h=stage.clientHeight||700;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)};addEventListener('resize',resize);resize();setTimeout(()=>$('.tea-loader')?.classList.add('hide'),900);
    const pose=t=>{const c=(t%7200)/7200;const pre=.32,mid=.7;let lift=c<pre?c/pre:c<mid?1:(1-(c-mid)/(1-mid));lift=Math.max(0,Math.min(1,lift));pitcher.position.y=-.12+lift*.95;pitcher.rotation.z=-lift*.58;UR.rotation.z=.55+lift*.14;LR.rotation.z=.25+lift*.3;HR.position.y=-.28+lift*.82;LR.position.y=-.03+lift*.36;stream.visible=c>pre&&c<mid;if(stream.visible){stream.position.set(1.48,.05+lift*.25,.79);stream.scale.y=1+.22*Math.sin((c-pre)/(mid-pre)*Math.PI)}W.rotation.z=Math.sin(t*.0008)*.018;head.rotation.z=Math.sin(t*.00065)*.035};
    const loop=()=>{requestAnimationFrame(loop);const t=performance.now()-t0;pose(t);px+=(mx*.5-px)*.05;py+=(my*.2-py)*.05;const sy=Math.min((scrollY||0)/900,1);camera.position.x=px*1.2;camera.position.y=1.8-py*.45;camera.position.z=10.5-sy*1.35;camera.lookAt(.5,-.3,.2);G.rotation.y=.08+px*.08;G.position.y=Math.sin(t*.001)*.035;flame.scale.y=1+.2*Math.sin(t*.01);steam.forEach((q,i)=>{q.position.y+=.003*(1+i*.04);q.position.x+=Math.sin(t*.0014+i)*.0015;if(q.position.y>1.1){q.position.y=-.75;q.position.x=-.63+(Math.random()-.5)*.3}q.material.opacity=.16+.15*(.5+.5*Math.sin(t*.0016+i))});renderer.render(scene,camera)};loop();
    // 3D depth interactions across sections
    $$('.menu-card,.info-card,.feature,.gallery-brand-card,.gallery-grid img,.contact-card').forEach(el=>{el.classList.add('tea-3d-reveal');el.addEventListener('pointermove',ev=>{if(innerWidth<850)return;const r=el.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateZ(6px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.1});$$('.tea-3d-reveal').forEach(e=>io.observe(e));
  };init3D();
}

/* ---------- Demo AI assistant ---------- */
const ai=document.createElement('button');ai.className='kaapi-ai-toggle';ai.type='button';ai.textContent='🤖 Ask Kaapi AI';document.body.appendChild(ai);const panel=document.createElement('div');panel.className='kaapi-ai-panel';panel.innerHTML='<div class="kaapi-ai-head"><strong>☕ Kaapi yumm AI</strong><button class="kaapi-ai-close" type="button">×</button></div><div class="kaapi-ai-messages"><div class="kaapi-ai-msg bot">Hi! Ask me about tea, coffee, menu, timings or location.</div></div><div class="kaapi-ai-chips"><button class="kaapi-ai-chip" data-q="What tea do you recommend?">Tea recommendation</button><button class="kaapi-ai-chip" data-q="What time are you open?">Opening hours</button><button class="kaapi-ai-chip" data-q="Where are you located?">Location</button></div><form class="kaapi-ai-input"><input aria-label="Ask Kaapi yumm" placeholder="Ask about tea, food, timings..."><button type="submit">Send</button></form>';document.body.appendChild(panel);const msgs=$('.kaapi-ai-messages',panel),inp=$('input',panel),frm=$('form',panel),answer=q=>{const x=q.toLowerCase();if(/time|open|close|hour/.test(x))return'We’re open every day from 7:00 AM to 10:00 PM.';if(/where|location|address|map/.test(x))return'X7M6+544, New No. 77/1, Old No. 25, S Mada St, Thiruvalluvar Nagar, Thiruvanmiyur, Chennai 600041.';if(/tea|chai|recommend/.test(x))return'Try hot tea with an evening snack. For a South Indian classic, pair it with vada.';if(/coffee|kaapi/.test(x))return'Authentic South Indian Filter Coffee is our signature pick.';if(/menu|food|snack|pongal|dosa|idli/.test(x))return'Current demo menu: Filter Coffee, Idli & Vada, Crispy Dosa, Ven Pongal, Sandwiches & Toast, and Evening Snacks.';if(/price|cost|rate|₹/.test(x))return'Prices are being confirmed. WhatsApp 09962571464 for the latest menu and pricing.';return'Ask me about tea, coffee, breakfast, menu, timings or location.'};const add=(t,w='bot')=>{const d=document.createElement('div');d.className=`kaapi-ai-msg ${w}`;d.textContent=t;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight};const askQ=q=>{if(!q.trim())return;add(q,'user');setTimeout(()=>add(answer(q)),250)};ai.addEventListener('click',()=>panel.classList.toggle('open'));$('.kaapi-ai-close',panel).addEventListener('click',()=>panel.classList.remove('open'));frm.addEventListener('submit',e=>{e.preventDefault();const q=inp.value;inp.value='';askQ(q)});$$('.kaapi-ai-chip',panel).forEach(c=>c.addEventListener('click',()=>askQ(c.dataset.q)));
});