(function(){
  var r=document.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var vistas=[].slice.call(document.querySelectorAll('[data-v]')),act='';
  var navA=[].slice.call(document.querySelectorAll('[data-nav]'));
  try{history.scrollRestoration='manual'}catch(e){}
  function tit(v){return document.querySelector('[data-v="'+v+'"] [data-t]')}
  function muestra(v,foco){
    act=v;
    vistas.forEach(function(e){e.classList.toggle('act',e.getAttribute('data-v')===v)});
    navA.forEach(function(a){if(a.getAttribute('data-nav')===v)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    r.setAttribute('data-pantalla',v);
    scrollTo({top:0,behavior:'instant'});
    if(foco){var t=tit(v);if(t){t.setAttribute('tabindex','-1');t.focus({preventScroll:true})}}
    document.dispatchEvent(new CustomEvent('pantalla',{detail:v}));
  }
  var cort=document.querySelector('.cortina');
  function ir(v,push,link){
    if(!document.querySelector('[data-v="'+v+'"]'))return;
    if(push&&location.hash!=='#'+v)history.pushState({v:v},'','#'+v);
    if(v===act){muestra(v,true);return}
    if(reduce||!cort){muestra(v,true);return}
    cort.className='cortina in';
    setTimeout(function(){
      muestra(v,true);
      cort.className='cortina out';
      setTimeout(function(){cort.className='cortina'},620);
    },430);
  }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    var a=e.target.closest&&e.target.closest('a[href^="#"]');if(!a)return;
    var v=a.getAttribute('href').slice(1);
    if(!document.querySelector('[data-v="'+v+'"]'))return;
    e.preventDefault();ir(v,true,a);
  });
  addEventListener('popstate',function(){ir((location.hash||'#inicio').slice(1),false,null)});
  muestra(document.querySelector('[data-v="'+(location.hash||'#inicio').slice(1)+'"]')?(location.hash||'#inicio').slice(1):'inicio',false);
})();
