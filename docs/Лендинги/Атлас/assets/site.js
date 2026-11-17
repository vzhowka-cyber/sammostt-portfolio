document.querySelector('.menu-toggle').hidden=false;

const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#site-menu');
function closeMenu(){ if(!toggle)return; toggle.setAttribute('aria-expanded','false'); menu.classList.remove('is-open'); }
if(toggle){
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('is-open',open)});
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus()}});
 matchMedia('(min-width:901px)').addEventListener('change',closeMenu);
}
const form=document.querySelector('#lead');
if(form){
 const button=form.querySelector('button[type=submit]');
 button.disabled=false;
 const phone=form.querySelector('#phone');
 const name=form.querySelector('#name');
 const error=form.querySelector('#phone-error');
 const result=form.querySelector('#done');
 form.addEventListener('input',()=>{result.hidden=true;phone.setCustomValidity('');phone.removeAttribute('aria-invalid');error.hidden=true;name.setCustomValidity('')});
 form.addEventListener('submit',e=>{
  e.preventDefault();
  name.setCustomValidity(name.value.trim().length<2?'Введите имя хотя бы из двух символов.':'');
  const digits=phone.value.replace(/\D/g,'');
  const valid=/^[+0-9() .-]+$/.test(phone.value.trim())&&digits.length>=10&&digits.length<=15;
  phone.setCustomValidity(valid?'':'Введите телефон: от 10 до 15 цифр.');
  error.hidden=valid;phone.setAttribute('aria-invalid',String(!valid));
  if(!form.reportValidity())return;
  result.textContent='Поля заполнены корректно. Это демонстрация: заявка никуда не отправлена.';
  result.hidden=false;result.focus();
 });
}

document.querySelectorAll('[data-destination]').forEach(a=>a.addEventListener('click',()=>{document.querySelector('#dest').value=a.dataset.destination; document.querySelector('#done').hidden=true;setTimeout(()=>document.querySelector('#name').focus({preventScroll:true}),100)}));