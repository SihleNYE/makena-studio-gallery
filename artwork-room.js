(() => {
  const trigger = document.createElement('button');
  trigger.type='button';trigger.className='room-open';trigger.textContent='Preview in a room';trigger.setAttribute('aria-haspopup','dialog');
  document.getElementById('detail-add').before(trigger);
  const modal=document.createElement('dialog');modal.className='room-preview';modal.setAttribute('aria-labelledby','room-title');
  modal.innerHTML='<div class="room-header"><div><p class="eyebrow">Illustrated room preview</p><h2 id="room-title"></h2></div><button type="button" class="room-close" aria-label="Close room preview">Close ×</button></div><div class="room-scene" role="img" aria-label="Illustrated living room with selected artwork above a sofa"><div class="room-floor"></div><div class="room-rug"></div><div class="room-art"><img alt=""></div><div class="room-sofa"><div class="sofa-back"></div><div class="sofa-seats"></div><div class="sofa-arm left"></div><div class="sofa-arm right"></div><div class="sofa-leg left"></div><div class="sofa-leg right"></div></div><div class="room-table"></div><div class="room-lamp"><div></div></div></div><div class="room-options"><label>Wall colour<select id="room-wall"><option value="#e8dfd0">Warm ivory</option><option value="#9da995">Soft sage</option><option value="#344a56">Deep blue</option></select></label><label class="room-custom-colour">Custom wall colour<span class="room-colour-control"><input type="color" id="room-wall-picker" value="#e8dfd0" aria-label="Choose custom wall colour"><output id="room-wall-hex" for="room-wall-picker">#E8DFD0</output></span></label><label>Sofa colour<span class="room-colour-control"><input type="color" id="room-sofa-picker" value="#b8afa0" aria-label="Choose sofa colour"><output id="room-sofa-hex" for="room-sofa-picker">#B8AFA0</output></span></label><label>Frame<select id="room-frame"><option value="none">Unframed</option><option value="#22211d">Black</option><option value="#b38b5c">Oak effect</option></select></label><label>Artwork size<select id="room-size"><option value="1">Catalogue size</option><option value="0.8">Smaller (80%)</option><option value="1.2">Larger (120%)</option></select></label></div><div class="room-save-row"><button type="button" id="room-save">Save preview image ↓</button><p id="room-save-status" role="status" aria-live="polite"></p></div><p class="room-note">Illustrative mockup, not an AR measurement. Artwork is scaled approximately against a 200 cm sofa; framing adds to its outer size.</p>';
  document.body.append(modal);
  const scene=modal.querySelector('.room-scene'),art=modal.querySelector('.room-art'),image=art.querySelector('img');
  const wall=modal.querySelector('#room-wall'),frame=modal.querySelector('#room-frame'),size=modal.querySelector('#room-size');
  const picker=modal.querySelector('#room-wall-picker'),hex=modal.querySelector('#room-wall-hex');
  const custom=document.createElement('option');custom.value='custom';custom.textContent='Custom colour';wall.append(custom);
  const sofa=modal.querySelector('#room-sofa-picker'),sofaHex=modal.querySelector('#room-sofa-hex');
  let wallColour=picker.value;
  let width=60,height=80;
  function render(){
    scene.style.setProperty('--wall',wallColour);
    scene.style.setProperty('--sofa',sofa.value);sofaHex.value=sofa.value.toUpperCase();
    picker.value=wallColour;hex.value=wallColour.toUpperCase();
    art.style.width=(width/400*100*Number(size.value))+'%';
    art.style.aspectRatio=width+'/'+height;
    art.style.border=frame.value==='none'?'none':'5px solid '+frame.value;
    image.style.objectFit='fill';
    scene.setAttribute('aria-label',document.getElementById('detail-title').textContent+' displayed in an illustrated living room with '+(wall.value==='custom'?'custom '+wallColour:wall.selectedOptions[0].text.toLowerCase())+' walls and '+frame.selectedOptions[0].text.toLowerCase()+' presentation');
  }
  trigger.addEventListener('click',()=>{
    const dimensions=document.getElementById('detail-size').textContent.match(/(\d+)\s*×\s*(\d+)/);
    width=dimensions?Number(dimensions[1]):60;height=dimensions?Number(dimensions[2]):80;
    image.src=document.getElementById('detail-image').src;image.alt=document.getElementById('detail-image').alt;
    document.getElementById('room-title').textContent=document.getElementById('detail-title').textContent;
    modal.querySelector('#room-save-status').textContent='';
    size.value='1';render();modal.showModal();modal.querySelector('.room-close').focus();
  });
  function close(){modal.close();trigger.focus({preventScroll:true});}
  modal.querySelector('.room-close').addEventListener('click',close);
  modal.addEventListener('cancel',e=>{e.preventDefault();close();});
  wall.addEventListener('change',()=>{if(wall.value!=='custom')wallColour=wall.value;render();});
  picker.addEventListener('input',()=>{wallColour=picker.value;wall.value='custom';render();});
  picker.addEventListener('change',()=>{wallColour=picker.value;wall.value='custom';render();});
  sofa.addEventListener('input',render);sofa.addEventListener('change',render);
  [frame,size].forEach(control=>control.addEventListener('change',render));
  const save=modal.querySelector('#room-save'),status=modal.querySelector('#room-save-status');
  save.addEventListener('click',async()=>{
    save.disabled=true;status.textContent='Preparing image…';
    try {
      await image.decode();
      const canvas=await html2canvas(scene,{
        scale:2,backgroundColor:wallColour,logging:false,useCORS:true,
        onclone:doc=>{
          doc.querySelectorAll('dialog').forEach(d=>{d.style.position='static';d.style.display='block';d.style.maxHeight='none';d.style.overflow='visible';});
        }
      });
      const output=document.createElement('canvas');output.width=canvas.width;output.height=canvas.height+100;
      const ctx=output.getContext('2d');ctx.fillStyle='#f3f0e8';ctx.fillRect(0,0,output.width,output.height);ctx.drawImage(canvas,0,0);
      ctx.fillStyle='#24211c';ctx.font='24px Arial';ctx.fillText(document.getElementById('room-title').textContent+' · Jeruzel Artwork',24,canvas.height+36);
      ctx.font='18px Arial';ctx.fillText('Demo artwork · Illustrative room preview, not an exact measurement.',24,canvas.height+70);
      const blob=await new Promise(resolve=>output.toBlob(resolve,'image/png'));
      if(!blob)throw new Error('Image could not be created');
      const url=URL.createObjectURL(blob),link=document.createElement('a');
      link.href=url;link.download=document.getElementById('room-title').textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'-room-preview.png';
      modal.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
      status.textContent='Image ready. Check your downloads, or save it from the image view.';
    } catch(error){status.textContent='Could not save the preview. Please try again.';console.error(error);}
    finally{save.disabled=false;}
  });
})();
