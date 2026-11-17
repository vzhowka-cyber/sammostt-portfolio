
const menu=document.querySelector('.menu');const links=document.querySelector('.links');
function closeMenu(){links?.classList.remove('open');menu?.setAttribute('aria-expanded','false')}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));links.classList.toggle('open',open)});
links?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
const dialog=document.querySelector('dialog');let trigger;
document.querySelectorAll('[data-book]').forEach(b=>b.addEventListener('click',()=>{trigger=b;const choice=b.dataset.book;document.querySelector('[name=service]').value=choice;document.querySelector('.status').textContent='';dialog.showModal()}));
document.querySelector('.close')?.addEventListener('click',()=>dialog.close());dialog?.addEventListener('close',()=>trigger?.focus());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
const phone=document.querySelector('[name=phone]');
if(phone){
  phone.placeholder='+7 (999) 123-45-67';
  phone.inputMode='tel';
  phone.autocomplete='tel';
  phone.removeAttribute('minlength');
  phone.removeAttribute('maxlength');
  phone.title='Введите российский номер: +7 и 10 цифр. Номер с 8 преобразуется в +7.';
  phone.setAttribute('aria-describedby','phone-hint');
  const hint=document.createElement('small');
  hint.id='phone-hint';hint.textContent='Россия: +7 и 10 цифр. Можно вставить номер, начинающийся с 8.';
  phone.after(hint);
  const digits=value=>value.replace(/\D/g,'');
  const national=value=>{
    let n=digits(value);
    if(n.startsWith('7')||n.startsWith('8'))n=n.slice(1);
    return n.slice(0,10);
  };
  const format=n=>{
    let value='+7';
    if(n.length)value+=' ('+n.slice(0,3);
    if(n.length>=3)value+=')';
    if(n.length>3)value+=' '+n.slice(3,6);
    if(n.length>6)value+='-'+n.slice(6,8);
    if(n.length>8)value+='-'+n.slice(8,10);
    return value;
  };
  function validate(){
    const n=digits(phone.value);
    phone.setCustomValidity(!phone.value||(/^7\d{10}$/.test(n))?'':'Введите номер полностью: +7 и 10 цифр.');
  }
  function caretAfter(count){
    if(count===0)return Math.min(phone.value.length,4);
    let found=0;
    for(let i=2;i<phone.value.length;i++)if(/\d/.test(phone.value[i])&&++found===count)return i+1;
    return phone.value.length;
  }
  function update(value,position,atEnd){
    if(!digits(value)){phone.value='';validate();return;}
    const before=digits(value.slice(0,position));
    const skip=/^[78]/.test(digits(value))?1:0;
    const n=national(value);
    phone.value=format(n);
    const caret=atEnd?phone.value.length:caretAfter(Math.max(0,before.length-skip));
    phone.setSelectionRange(caret,caret);validate();
  }
  phone.addEventListener('input',()=>{
    const value=phone.value,position=phone.selectionStart??value.length;
    update(value,position,position===value.length);
  });
  phone.addEventListener('paste',event=>{
    const text=event.clipboardData?.getData('text');
    if(!text)return;
    event.preventDefault();
    const start=phone.selectionStart??0,end=phone.selectionEnd??phone.value.length;
    // A complete pasted number replaces the existing field; a fragment edits the selection.
    const complete=digits(text).length>=10;
    const value=complete?text:phone.value.slice(0,start)+text+phone.value.slice(end);
    update(value,complete?value.length:start+text.length,complete||end===phone.value.length);
  });
  phone.addEventListener('keydown',event=>{
    if(!['Backspace','Delete'].includes(event.key)||event.ctrlKey||event.metaKey||phone.selectionStart!==phone.selectionEnd)return;
    const position=phone.selectionStart??0;
    const positions=[...phone.value].map((c,i)=>i>=2&&/\d/.test(c)?i:-1).filter(i=>i>=0);
    const target=event.key==='Backspace'?positions.findLastIndex(i=>i<position):positions.findIndex(i=>i>=position);
    if(target<0){if(!positions.length){event.preventDefault();phone.value='';validate();}return;}
    event.preventDefault();
    const n=national(phone.value);const next=n.slice(0,target)+n.slice(target+1);
    phone.value=next?format(next):'';
    const caret=caretAfter(target);phone.setSelectionRange(caret,caret);validate();
    phone.dispatchEvent(new Event('change',{bubbles:true}));
  });
  phone.addEventListener('blur',validate);
  phone.form?.addEventListener('reset',()=>{phone.setCustomValidity('')});
  if(phone.value)update(phone.value,phone.value.length,true);
}

const form=document.querySelector('form');form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;document.querySelector('.status').textContent='Демо: данные проверены. Заявка не отправлена и не сохранена.'});
document.querySelectorAll('[data-zone]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-zone]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const content=JSON.parse(document.getElementById('zones-data').textContent)[b.dataset.zone];document.querySelector('#zone-title').textContent=content.title;document.querySelector('#zone-list').innerHTML=content.items.map(x=>'<li>'+x+'</li>').join('')}));
document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-route]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const data=JSON.parse(document.getElementById('routes-data').textContent)[b.dataset.route];document.querySelector('#route-title').textContent=data.title;document.querySelector('#route-text').textContent=data.text;document.querySelector('#route-days').innerHTML=data.days.map((d,i)=>'<li><span>0'+(i+1)+'</span><div>'+d+'</div></li>').join('');document.querySelector('#route-book').dataset.book=data.title}));
const area=document.querySelector('#area');function estimate(){if(!area)return;const rate=Number(document.querySelector('[name=finish]:checked').value);document.querySelector('#area-value').textContent=area.value+' м²';document.querySelector('#estimate').textContent=(Number(area.value)*rate).toLocaleString('ru-RU')+' ₽'}area?.addEventListener('input',estimate);document.querySelectorAll('[name=finish]').forEach(x=>x.addEventListener('change',estimate));estimate();
document.querySelectorAll('[data-check]').forEach(b=>b.addEventListener('click',()=>{const active=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(active));const selected=[...document.querySelectorAll('[data-check][aria-pressed=true]')];document.querySelector('#service-total').textContent=selected.length?selected.reduce((s,x)=>s+Number(x.dataset.cost),0).toLocaleString('ru-RU')+' ₽':'Выберите работы';document.querySelector('#service-selection').textContent=selected.length?selected.map(x=>x.dataset.check).join(' · '):'Работы не выбраны';document.querySelector('#auto-book').dataset.book=selected.length?selected.map(x=>x.dataset.check).join(', '):'Диагностика автомобиля'}));
