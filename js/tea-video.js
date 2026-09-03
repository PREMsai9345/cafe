document.addEventListener('DOMContentLoaded',()=>{
  const hero=document.querySelector('#home.hero-slider');
  const stage=document.querySelector('.tea-3d-stage');
  if(!hero||!stage)return;

  const wrap=document.createElement('div');
  wrap.className='tea-video-layer';
  wrap.innerHTML=`<video class="tea-worker-video" muted autoplay loop playsinline preload="metadata" poster="assets/storefront.webp"><source src="assets/tea-kadai-worker.webm" type="video/webm"><source src="assets/tea-kadai-worker.mp4" type="video/mp4"></video>`;
  stage.prepend(wrap);

  const video=wrap.querySelector('video');
  const css=document.createElement('style');
  css.textContent=`
    .tea-video-layer{position:absolute;inset:0;z-index:12;display:grid;place-items:center;pointer-events:none;opacity:0;visibility:hidden;transition:opacity .7s ease,visibility .7s ease}
    .tea-video-layer.ready{opacity:1;visibility:visible}
    .tea-worker-video{width:100%;height:100%;object-fit:cover;object-position:68% center;mix-blend-mode:normal;filter:saturate(.9) contrast(1.04) brightness(.92)}
    .tea-video-layer:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,7,4,.92) 0%,rgba(18,7,4,.68) 38%,rgba(18,7,4,.08) 75%,rgba(18,7,4,.04) 100%)}
    .tea-hero-video-active .tea-scene{display:none!important}
    .tea-hero-video-active .tea-video-layer{z-index:18}
    @media(max-width:700px){.tea-worker-video{object-position:62% center}.tea-video-layer:after{background:linear-gradient(180deg,rgba(18,7,4,.1),rgba(18,7,4,.6) 55%,rgba(18,7,4,.96) 100%)}}
  `;
  document.head.appendChild(css);

  let loaded=false;
  const activate=()=>{
    if(loaded)return;
    loaded=true;
    hero.classList.add('tea-hero-video-active');
    wrap.classList.add('ready');
    video.play().catch(()=>{});
    stage.querySelector('.tea-loader')?.classList.add('hide');
  };

  video.addEventListener('loadeddata',activate,{once:true});
  video.addEventListener('canplay',activate,{once:true});
  video.addEventListener('error',()=>{
    wrap.remove();
  },{once:true});
  video.load();
});