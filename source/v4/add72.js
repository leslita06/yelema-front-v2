
// v4.17.2 menu des tableaux
(function(){var b=document.querySelector('.tbswitch'),w=document.querySelector('.tbl');if(!b||!w)return;handled(b);
  function set(o){w.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');if(o){var q=w.querySelector('.tbq input');if(q)q.focus({preventScroll:true})}}
  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();set(!w.classList.contains('open'))});
  document.addEventListener('click',function(e){if(w.classList.contains('open')&&!e.target.closest('.tbrail')&&!e.target.closest('.tbswitch'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
  w.querySelectorAll('.tbli a').forEach(function(a){a.addEventListener('click',function(){setTimeout(function(){set(false);window.scrollTo({top:0,behavior:'smooth'})},0)})});
  w.querySelectorAll('.tbnewb').forEach(function(a){a.addEventListener('click',function(){set(false)})});
})();
