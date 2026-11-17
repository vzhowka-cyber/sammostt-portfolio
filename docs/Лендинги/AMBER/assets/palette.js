
(() => {
  const palette = document.querySelector('.a-palette');
  if (!palette) return;
  const buttons = [...palette.querySelectorAll('[data-style]')];
  const pictures = [...document.querySelectorAll('.a-photo img, .a-detail')];
  const status = document.querySelector('.palette-status');
  const styles = {
    terracotta: {src:'assets/hero.webp', title:'Терракота / тёплое дерево и камень', alt:'Гостиная в терракотовой гамме: ореховые панели, кремовый диван и каменный столик'},
    sand: {src:'assets/room-sand.webp', title:'Песок / светлый дуб и мягкий лён', alt:'Та же гостиная в песочной гамме: светлый дуб, льняной диван и бежевый каменный столик'},
    olive: {src:'assets/room-olive.webp', title:'Олива / зелёные оттенки и натуральное дерево', alt:'Та же гостиная в оливковой гамме: зелёные панели, кремовый диван и тёмно-зелёный каменный столик'},
    stone: {src:'assets/room-stone.webp', title:'Камень / минеральные фактуры и прохладный серый', alt:'Та же гостиная в каменной гамме: серые стены, светло-серый диван и серебристый травертин'}
  };
  const cache = new Map();
  function load(src) {
    if (!cache.has(src)) {
      const im = new Image();
      const promise = new Promise((resolve,reject)=>{im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('image load'));});
      im.src=src;
      cache.set(src,promise);
      promise.catch(()=>cache.delete(src));
    }
    return cache.get(src);
  }
  let request=0;
  buttons.forEach(button=>button.addEventListener('click',async()=>{
    const current=++request;
    const selected=styles[button.dataset.style];
    palette.setAttribute('aria-busy','true');
    try {
      await load(selected.src);
      if(current!==request)return;
      pictures.forEach(img=>{img.getAnimations().forEach(animation=>animation.cancel());img.src=selected.src;img.alt=selected.alt;
        if(!matchMedia('(prefers-reduced-motion: reduce)').matches)img.animate([{opacity:.55},{opacity:1}],{duration:320,easing:'ease-out'});
      });
      buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      status.textContent=selected.title;
    } catch {
      if(current===request)status.textContent='Не удалось загрузить этот вариант. Попробуйте ещё раз.';
    } finally {
      if(current===request)palette.setAttribute('aria-busy','false');
    }
  }));
  const preload=()=>Object.values(styles).forEach(s=>load(s.src).catch(()=>{}));
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){preload();observer.disconnect();}},{rootMargin:'600px'});
    observer.observe(palette);
  }else preload();
})();

