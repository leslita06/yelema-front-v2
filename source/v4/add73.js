
// v4.18 navigation mobile, filtres sur une ligne, composeur des tableaux, duplication, dates en français, états en cours
(function(){
  // ---------- historique : le bouton retour du téléphone ferme d'abord la fenêtre ouverte
  var pushed=0;
  function opened(){return document.querySelector('.modal.on,.msheet.on,.dpcal.on')}
  function pushNav(){try{history.pushState({ov:1},'');pushed++}catch(_){}}
  function closeAll(){document.querySelectorAll('.modal.on').forEach(function(m){m.classList.remove('on')});
    document.querySelectorAll('.msheet.on').forEach(function(s){s.classList.remove('on')});document.body.classList.remove('shlock');
    var c=document.querySelector('.dpcal.on');if(c)c.classList.remove('on');document.querySelectorAll('.fdd[open],.dlm[open]').forEach(function(d){d.removeAttribute('open')})}
  window.addEventListener('popstate',function(){if(pushed>0){pushed--;closeAll()}});
  function uiClose(){if(pushed>0&&opened()){closeAll();pushed--;try{history.back()}catch(_){}}else closeAll()}
  document.addEventListener('click',function(e){var o=e.target.closest('[data-open]');if(o&&innerWidth<=900)setTimeout(function(){if(opened())pushNav()},0)},true);
  document.querySelectorAll('.modal [data-close]').forEach(function(x){x.addEventListener('click',function(){if(pushed>0){pushed--;try{history.back()}catch(_){}}})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(opened())uiClose();document.querySelectorAll('.fdd[open],.dlm[open]').forEach(function(d){d.removeAttribute('open')})}});

  // ---------- feuilles du bas (téléphone)
  function openSheet(id){var s=document.getElementById(id);if(!s)return;document.querySelectorAll('.msheet.on').forEach(function(x){x.classList.remove('on')});
    s.classList.add('on');document.body.classList.add('shlock');pushNav();var f=s.querySelector('a');if(f)f.focus({preventScroll:true})}
  document.querySelectorAll('[data-sheet]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();openSheet(a.dataset.sheet)})});
  document.querySelectorAll('[data-shclose]').forEach(function(x){x.addEventListener('click',uiClose)});
  document.querySelectorAll('[data-yele]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();uiClose();
    setTimeout(function(){var p=document.getElementById('yele');if(p){document.querySelectorAll('.pop').forEach(function(x){x.classList.remove('on')});p.classList.add('on')}},60)})});

  // ---------- éclairage : liste
  document.querySelectorAll('.apl .apo').forEach(function(a){handled(a)});

  // ---------- filtres sur une ligne : listes déroulantes
  document.querySelectorAll('.fdd').forEach(function(d){
    d.addEventListener('toggle',function(){if(d.open){document.querySelectorAll('.fdd[open]').forEach(function(x){if(x!==d)x.removeAttribute('open')});
      var q=d.querySelector('.fdq input');if(q&&innerWidth>760)q.focus({preventScroll:true});
      if(innerWidth<=760){var p=d.querySelector('.fdp'),r=d.getBoundingClientRect();p.style.top=(r.bottom+6)+'px'}}});
    var q=d.querySelector('.fdq input');
    if(q)q.addEventListener('input',function(){var v=q.value.trim().toLowerCase(),n=0;d.querySelectorAll('.fdo').forEach(function(o){var ok=!v||o.textContent.toLowerCase().indexOf(v)>-1;o.style.display=ok?'':'none';if(ok)n++});
      var none=d.querySelector('.fdnone');if(none)none.hidden=n>0});
    d.querySelectorAll('.fdo').forEach(function(o){handled(o);o.addEventListener('click',function(){var l=d.querySelector('.fdl');if(l)l.textContent=o.textContent.trim();
      d.classList.toggle('on',!!o.dataset.fp);setTimeout(function(){d.removeAttribute('open')},0)})});
    d.querySelectorAll('.tdper a').forEach(function(a){a.addEventListener('click',function(){var l=d.querySelector('.fdl');
      var m={semaine:'Cette semaine',mois:'Ce mois-ci',trimestre:'Ce trimestre',semestre:'Ce semestre',annee:'Cette année'};if(l)l.textContent=m[a.dataset.per]||a.textContent;
      d.classList.toggle('on',a.dataset.per!=='semaine');setTimeout(function(){d.removeAttribute('open')},0)})});
  });
  document.addEventListener('click',function(e){document.querySelectorAll('.fdd[open]').forEach(function(d){if(!d.contains(e.target))d.removeAttribute('open')});
    document.querySelectorAll('.dlm[open]').forEach(function(d){if(!d.contains(e.target))d.removeAttribute('open')})});
  document.querySelectorAll('.tdq').forEach(function(l){l.addEventListener('click',function(){var i=l.querySelector('input');if(i)i.focus()})});

  // ---------- composeur des tableaux : nouveau bloc ou retour, plusieurs formats
  document.querySelectorAll('.tbcmp').forEach(function(c){
    var f=c.querySelector('form.tbask'),t=f.querySelector('textarea'),sel=c.querySelector('.tbsel'),thr=c.querySelector('.tbthr'),send=f.querySelector('.tbsend'),who=f.dataset.who;
    handled(send);
    function fm(){return [].map.call(c.querySelectorAll('.tbfm input:checked'),function(i){return i.value})}
    function upd(){var fb=c.classList.contains('fb');var x=fm();sel.textContent=fb?'Retour sur tout le tableau':(x.length?('Formats : '+x.join(', ')):'Choisissez au moins un format');send.disabled=!t.value.trim()||(!fb&&!x.length)}
    c.querySelectorAll('.tbmode a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();c.querySelectorAll('.tbmode a').forEach(function(x){x.classList.toggle('on',x===a)});
      var fb=a.dataset.m==='fb';c.classList.toggle('fb',fb);t.placeholder=t.dataset[fb?'phFb':'phNew'];upd();t.focus()})});
    c.querySelectorAll('.tbfm input').forEach(function(i){i.addEventListener('change',upd)});t.addEventListener('input',upd);
    t.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(!send.disabled)f.requestSubmit?f.requestSubmit():send.click()}});
    var sw=c.parentNode.querySelectorAll('.mws span[data-sw]');sw.forEach(function(s){s.addEventListener('click',function(){setTimeout(upd,0)})});
    function bub(cls,txt){var b=document.createElement('div');b.className='tbm '+cls;b.textContent=txt;thr.appendChild(b);return b}
    f.addEventListener('submit',function(e){e.preventDefault();e.stopImmediatePropagation();var v=t.value.trim();if(!v){t.focus();return}
      var fb=c.classList.contains('fb'),x=fm();if(!fb&&!x.length){toast('Choisissez au moins un format');return}
      bub('tbme',v);var ty=bub('tbex typing',who+' écrit…');t.value='';upd();
      setTimeout(function(){ty.classList.remove('typing');
        if(fb){ty.textContent='C’est noté. Je mets le tableau à jour, la nouvelle version arrive dans quelques minutes.';toast(who+' a reçu votre retour')}
        else{ty.textContent='Je crée le bloc « '+v+' » en '+x.join(', ').toLowerCase()+'. Il arrive en haut du tableau.';
          var p=c.closest('.panel'),g=p.querySelector('.mwg2'),img=f.querySelector('img').getAttribute('src'),k=document.createElement('article');
          k.className='mw new user';k.dataset.ps='';k.setAttribute('draggable','true');
          k.innerHTML='<header><h4></h4></header><div class="wfait"><img alt=""><p></p></div><footer><span class="ptag">Demandé par vous</span></footer>';
          k.querySelector('h4').textContent=v.charAt(0).toUpperCase()+v.slice(1);k.querySelector('.wfait img').src=img;
          k.querySelector('.wfait p').textContent='En préparation par '+who+'. Formats : '+x.join(', ')+'. Les premiers chiffres arrivent dans quelques minutes, tirés de son travail.';
          g.prepend(k);toast('Bloc demandé, il arrive en haut du tableau')}},900)},true);
    upd();
  });

  // ---------- dupliquer : la copie apparaît dans Mes tableaux et s'ouvre
  document.querySelectorAll('[data-dupk]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();
    var id=a.dataset.dupk,li=document.querySelector('.tbli a[data-t="'+id+'"]');if(!li){toast('Copie créée dans Mes tableaux');return}
    var neuf=li.hidden;li.hidden=false;li.click();window.scrollTo({top:0,behavior:'smooth'});
    var n=document.querySelector('.tbswitch .num');if(n&&neuf)n.textContent=(+n.textContent||0)+1;
    var g=document.querySelector('.tbli .tbg .num');if(g&&neuf)g.textContent=(+g.textContent||0)+1;
    toast(neuf?'Copie créée : « '+a.dataset.dup2+' (copie) », dans Mes tableaux':'Cette copie existe déjà, la voici')},true)});

  // ---------- Google Slides : aperçu
  document.querySelectorAll('[data-gs]').forEach(function(a){a.addEventListener('click',function(){var m=document.getElementById('gslides');if(!m)return;
    m.querySelector('.gsn').textContent=a.dataset.gs;m.querySelector('.gst').textContent=a.dataset.gs})});

  // ---------- créer un tableau : le nom sert dans le message
  document.querySelectorAll('[data-newtb]').forEach(function(b){b.addEventListener('click',function(){var m=b.closest('.modal'),n=m&&m.querySelector('.ntn input');
    if(n&&n.value.trim())b.dataset.toast='« '+n.value.trim()+' » en cours de création, il arrive dans Mes tableaux dans quelques minutes'},true)});

  // ---------- états en cours : étapes qui défilent, progression qui avance
  document.querySelectorAll('[data-live]').forEach(function(l){var s=l.querySelectorAll('.lvs2 span'),i=1,bar=l.querySelector('.lvbar i'),pc=l.querySelector('[data-pc]'),v=pc?+pc.dataset.pc:60;
    if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    setInterval(function(){s[i].classList.remove('on');i=(i+1)%s.length;s[i].classList.add('on');if(v<96){v+=1+Math.round(Math.random()*2);bar.style.width=v+'%';if(pc)pc.textContent=v+' %'}},3200)});

  // ---------- sélecteur de date en français
  var MO=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],MC=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  function parse(v){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v||'');return m?new Date(+m[1],+m[2]-1,+m[3]):null}
  function iso(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
  function lib(d,court){return d?(d.getDate()===1?'1er':d.getDate())+' '+(court?MC:MO)[d.getMonth()]+(court?'':' '+d.getFullYear()):'Choisir une date'}
  var cal=document.createElement('div');cal.className='dpcal';cal.setAttribute('role','dialog');cal.setAttribute('aria-label','Choisir une date');document.body.appendChild(cal);
  var cur=null,view=null;
  function draw(){var inp=cur.inp,sel=parse(inp.value),mn=parse(inp.min),mx=parse(inp.max),td=new Date(2026,9,1);
    var y=view.getFullYear(),m=view.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();
    var h='<div class="dph"><button type="button" data-dm="-1" aria-label="Mois précédent">‹</button><b>'+MO[m]+' '+y+'</b><button type="button" data-dm="1" aria-label="Mois suivant">›</button></div><div class="dpg">';
    ['L','M','M','J','V','S','D'].forEach(function(j){h+='<span>'+j+'</span>'});for(var i=0;i<first;i++)h+='<i></i>';
    for(var d=1;d<=n;d++){var dt=new Date(y,m,d),dis=(mn&&dt<mn)||(mx&&dt>mx);h+='<button type="button" data-d="'+d+'"'+(dis?' disabled':'')+' class="'+(sel&&+sel===+dt?'on':'')+(+dt===+td?' td':'')+'">'+d+'</button>'}
    h+='</div><div class="dpf"><a data-dtoday>Aujourd’hui</a><a data-dclose>Fermer</a></div>';cal.innerHTML=h}
  function place(btn){var r=btn.getBoundingClientRect();if(innerWidth<=760){cal.style.left='';cal.style.top='';return}
    var l=Math.min(Math.max(8,r.left),innerWidth-308),t=r.bottom+6;if(t+340>innerHeight)t=Math.max(8,r.top-346);cal.style.left=l+'px';cal.style.top=t+'px'}
  function openCal(o){cur=o;view=parse(o.inp.value)||new Date(2026,9,1);view=new Date(view.getFullYear(),view.getMonth(),1);draw();place(o.btn);cal.classList.add('on');if(innerWidth<=900)pushNav()}
  function setVal(d){var inp=cur.inp;inp.value=iso(d);cur.btn.querySelector('span').textContent=lib(d,cur.court);inp.dispatchEvent(new Event('change',{bubbles:true}));
    if(inp.value>inp.max&&inp.max){}cur.btn.querySelector('span').textContent=lib(parse(inp.value),cur.court);uiClose()}
  cal.addEventListener('click',function(e){e.stopPropagation();var b=e.target.closest('button,a');if(!b)return;
    if(b.dataset.dm){view=new Date(view.getFullYear(),view.getMonth()+(+b.dataset.dm),1);draw();return}
    if(b.dataset.d){setVal(new Date(view.getFullYear(),view.getMonth(),+b.dataset.d));return}
    if(b.hasAttribute('data-dtoday')){setVal(new Date(2026,9,1));return}
    if(b.hasAttribute('data-dclose'))uiClose()});
  document.addEventListener('click',function(e){if(cal.classList.contains('on')&&!e.target.closest('.dpk'))uiClose()});
  document.querySelectorAll('input[type="date"]').forEach(function(inp){
    var court=!!inp.closest('.anr'),btn=document.createElement('button');btn.type='button';btn.className='dpk'+(inp.classList.contains('fi')?' fi':'');handled(btn);
    btn.setAttribute('aria-label',(inp.getAttribute('aria-label')||'Date')+', choisir une date');btn.innerHTML='<span></span>';
    if(!court&&!inp.closest('.anr'))btn.insertAdjacentHTML('afterbegin','<svg class="i s" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>');
    btn.querySelector('span').textContent=lib(parse(inp.value),court);inp.classList.add('dpsrc');inp.after(btn);
    var o={inp:inp,btn:btn,court:court};btn.hidden=inp.hidden;
    new MutationObserver(function(){btn.hidden=inp.hidden}).observe(inp,{attributes:true,attributeFilter:['hidden']});
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(cal.classList.contains('on')&&cur===o){uiClose();return}openCal(o)});
    inp.addEventListener('change',function(){btn.querySelector('span').textContent=lib(parse(inp.value),court)});
  });
})();
// v4.18 permissions d'un membre : Enregistrer actif dès qu'on change quelque chose
document.querySelectorAll('[data-perm]').forEach(function(b){var ok=b.querySelector('.prmok'),no=b.querySelector('.prmno'),ins=b.querySelectorAll('input,select');handled(ok);handled(no);
  function snap(){return [].map.call(ins,function(i){return i.type==='checkbox'?i.checked:i.value}).join('|')}var s0=snap();
  function upd(){var ch=snap()!==s0;ok.classList.toggle('off',!ch);no.classList.toggle('off',!ch)}
  ins.forEach(function(i){i.addEventListener('change',upd)});
  ok.addEventListener('click',function(e){e.preventDefault();s0=snap();upd();toast('Permissions enregistrées pour Aïcha Diabaté')});
  no.addEventListener('click',function(e){e.preventDefault();var v=s0.split('|');ins.forEach(function(i,n){if(i.type==='checkbox')i.checked=v[n]==='true';else i.value=v[n]});upd();toast('Modifications annulées')});
  b.querySelector('.prmrole').addEventListener('change',function(e){var r=e.target.value,c=b.querySelectorAll('.prm input');c.forEach(function(x,n){x.checked=r==='Administrateur'?true:r==='Membre de l’équipe'?false:(n===3||n===4)});upd()});
  upd()});
