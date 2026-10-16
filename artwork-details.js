(() => {
  const artworks = [
    {title:'Ochre Rhythm',price:4500,size:'60 × 80 cm',type:'Abstract study',image:'ochre-rhythm',description:'Warm ochre arches meet a dark central shape and a pale circular accent. A bold, architectural composition for a calm, earthy space.'},
    {title:'After the Rain',price:3200,size:'50 × 70 cm',type:'Botanical study',image:'after-the-rain',description:'Soft green layers, a pale sun and delicate botanical forms evoke a garden after rain. A quieter piece built around organic lines and gentle contrasts.'},
    {title:'Blue Conversation',price:2800,size:'50 × 50 cm',type:'Geometric study',image:'blue-conversation',description:'Deep blue, dusty teal and cream shapes gather around a terracotta circle. Curves and fine lines create a playful balance of colour and geometry.'},
    {title:'Roots & Light',price:3800,size:'60 × 80 cm',type:'Organic study',image:'roots-and-light',description:'Dark branching leaves rise against a warm clay circle and sandy ground. A simple botanical composition inspired by growth, warmth and stillness.'}
  ];
  const modal = document.getElementById('artwork-detail');
  const image = document.getElementById('detail-image');
  const title = document.getElementById('detail-title');
  const price = document.getElementById('detail-price');
  const size = document.getElementById('detail-size');
  const type = document.getElementById('detail-type');
  const description = document.getElementById('detail-description');
  const addButton = document.getElementById('detail-add');
  let current = null;
  let trigger = null;
  let previousOverflow = '';
  function closeDetail() { if (modal.open) modal.close(); }
  function openDetail(index, source) {
    current = artworks[index];
    trigger = source;
    image.src = 'artworks/' + current.image + '.svg';
    image.alt = current.title + ' — demo illustration';
    title.textContent = current.title;
    price.textContent = 'R' + current.price.toLocaleString('en-ZA');
    size.textContent = current.size + ' (sample size)';
    type.textContent = current.type + ' · Digital demo illustration';
    description.textContent = current.description;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    document.getElementById('detail-close').focus();
  }
  document.querySelectorAll('.work').forEach((card,index) => {
    card.removeAttribute('onclick');
    card.setAttribute('aria-haspopup','dialog');
    card.setAttribute('aria-controls','artwork-detail');
    card.setAttribute('aria-label','View details: ' + artworks[index].title);
    const hint = document.createElement('span');
    hint.className = 'detail-hint';
    hint.textContent = 'View artwork details ↗';
    card.append(hint);
    card.addEventListener('click',() => openDetail(index,card));
  });
  document.getElementById('detail-close').addEventListener('click',closeDetail);
  modal.addEventListener('click',e => {
    const box = modal.getBoundingClientRect();
    if (e.target === modal && (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom)) closeDetail();
  });
  modal.addEventListener('close',() => {
    document.body.style.overflow = previousOverflow;
    if (trigger) trigger.focus({preventScroll:true});
  });
  addButton.addEventListener('click',() => {
    if (!current) return;
    closeDetail();
    add(current.title,current.price);
    document.querySelector('#drawer .close').focus();
  });
})();
