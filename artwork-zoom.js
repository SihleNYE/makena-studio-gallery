(() => {
  const source = document.getElementById('detail-image');
  const art = source.parentElement;
  const open = document.createElement('button');
  open.type = 'button'; open.className = 'zoom-open'; open.textContent = 'Zoom image ⤢';
  open.setAttribute('aria-haspopup','dialog');
  art.append(open);
  source.style.cursor = 'zoom-in';
  const viewer = document.createElement('dialog');
  viewer.className = 'zoom-viewer'; viewer.setAttribute('aria-labelledby','zoom-title');
  viewer.innerHTML = '<div class="zoom-toolbar"><h2 id="zoom-title">Artwork zoom</h2><div class="zoom-controls"><button type="button" data-scale="1" aria-label="Fit image">Fit</button><button type="button" data-scale="2" aria-label="Zoom to 200 percent">2×</button><button type="button" data-scale="3" aria-label="Zoom to 300 percent">3×</button><button type="button" class="zoom-close" aria-label="Close image zoom">Close ×</button></div></div><p class="zoom-help">Choose 2× or 3×, then drag or scroll to explore. Esc closes zoom.</p><div class="zoom-viewport" tabindex="0" aria-label="Zoomed artwork. Use arrow keys to scroll."><div class="zoom-canvas"><img draggable="false" alt=""></div></div>';
  document.body.append(viewer);
  const viewport = viewer.querySelector('.zoom-viewport');
  const canvas = viewer.querySelector('.zoom-canvas');
  const image = viewer.querySelector('img');
  let scale = 1, base = 0, pointer = null;
  function setScale(value) {
    scale = value;
    base = Math.max(1,Math.min(viewport.clientWidth-24, viewport.clientHeight-24));
    canvas.style.width = Math.max(viewport.clientWidth,base*scale+24)+'px';
    canvas.style.height = Math.max(viewport.clientHeight,base*scale+24)+'px';
    image.style.width = image.style.height = base*scale+'px';
    viewport.scrollLeft = (canvas.offsetWidth-viewport.clientWidth)/2;
    viewport.scrollTop = (canvas.offsetHeight-viewport.clientHeight)/2;
    viewport.classList.toggle('magnified',scale>1);
    viewer.querySelectorAll('[data-scale]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.scale)===scale?'true':'false'));
  }
  function show() {
    image.src = source.src; image.alt = source.alt;
    document.getElementById('zoom-title').textContent = document.getElementById('detail-title').textContent;
    viewer.showModal(); setScale(1); viewer.querySelector('.zoom-close').focus();
  }
  function close() { viewer.close(); open.focus({preventScroll:true}); }
  open.addEventListener('click',show);
  source.addEventListener('click',show);
  viewer.querySelector('.zoom-close').addEventListener('click',close);
  viewer.addEventListener('cancel',e=>{e.preventDefault();close();});
  viewer.querySelectorAll('[data-scale]').forEach(b=>b.addEventListener('click',()=>setScale(Number(b.dataset.scale))));
  window.addEventListener('resize',()=>{if(viewer.open)setScale(scale);});
  viewport.addEventListener('pointerdown',e=>{
    if(scale===1 || e.button!==0)return;
    pointer={id:e.pointerId,x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};
    viewport.setPointerCapture(e.pointerId); viewport.classList.add('dragging');
  });
  viewport.addEventListener('pointermove',e=>{
    if(!pointer || pointer.id!==e.pointerId)return;
    viewport.scrollLeft=pointer.left+pointer.x-e.clientX;
    viewport.scrollTop=pointer.top+pointer.y-e.clientY;
  });
  function release(){pointer=null;viewport.classList.remove('dragging');}
  viewport.addEventListener('pointerup',release);
  viewport.addEventListener('pointercancel',release);
  viewport.addEventListener('lostpointercapture',release);
})();
