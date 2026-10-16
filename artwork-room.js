(() => {
  const trigger = document.createElement('button');
  trigger.type='button';trigger.className='room-open';trigger.textContent='Preview in a room';trigger.setAttribute('aria-haspopup','dialog');
  document.getElementById('detail-add').before(trigger);
  const modal=document.createElement('dialog');modal.className='room-preview';modal.setAttribute('aria-labelledby','room-title');
  modal.innerHTML='<div class="room-header"><div><p class="eyebrow">Illustrated room preview</p><h2 id="room-title"></h2></div><button type="button" class="room-close" aria-label="Close room preview">Close ×</button></div><div class="room-scene" role="img" aria-label="Illustrated living room with selected artwork above a sofa"><div class="room-floor"></div><div class="room-rug"></div><div class="room-art"><img alt=""></div><div class="room-sofa"><div class="sofa-back"></div><div class="sofa-seats"></div><div class="sofa-arm left"></div><div class="sofa-arm right"></div><div class="sofa-leg left"></div><div class="sofa-leg right"></div></div><div class="room-table"></div><div class="room-lamp"><div></div></div></div><div class="room-options"><label>Wall colour<select id="room-wall"><option value="#e8dfd0">Warm ivory</option><option value="#9da995">Soft sage</option><option value="#344a56">Deep blue</option></select></label><label>Frame<select id="room-frame"><option value="none">Unframed</option><option value="#22211d">Black</option><option value="#b38b5c">Oak effect</option></select></label><label>Artwork size<select id="room-size"><option value="1">Catalogue size</option><option value="0.8">Smaller (80%)</option><option value="1.2">Larger (120%)</option></select></label></div><p class="room-note">Illustrative mockup, not an AR measurement. Artwork is scaled approximately against a 200 cm sofa; framing adds to its outer size.</p>';
  document.body.append(modal);
  const scene=modal.querySelector('.room-scene'),art=modal.querySelector('.room-art'),image=art.querySelector('img');
  const wall=modal.querySelector('#room-wall'),frame=modal.querySelector('#room-frame'),size=modal.querySelector('#room-size');
  let width=60,height=80;
  function render(){
    scene.style.setProperty('--wall',wall.value);
    art.style.width=(width/400*100*Number(size.value))+'%';
    art.style.aspectRatio=width+'/'+height;
    art.style.border=frame.value==='none'?'none':'5px solid '+frame.value;
    image.style.objectFit='fill';
    scene.setAttribute('aria-label',document.getElementById('detail-title').textContent+' displayed in an illustrated living room with '+wall.selectedOptions[0].text.toLowerCase()+' walls and '+frame.selectedOptions[0].text.toLowerCase()+' presentation');
  }
  trigger.addEventListener('click',()=>{
    const dimensions=document.getElementById('detail-size').textContent.match(/(\d+)\s*×\s*(\d+)/);
    width=dimensions?Number(dimensions[1]):60;height=dimensions?Number(dimensions[2]):80;
    image.src=document.getElementById('detail-image').src;image.alt=document.getElementById('detail-image').alt;
    document.getElementById('room-title').textContent=document.getElementById('detail-title').textContent;
    size.value='1';render();modal.showModal();modal.querySelector('.room-close').focus();
  });
  function close(){modal.close();trigger.focus({preventScroll:true});}
  modal.querySelector('.room-close').addEventListener('click',close);
  modal.addEventListener('cancel',e=>{e.preventDefault();close();});
  [wall,frame,size].forEach(control=>control.addEventListener('change',render));
})();
