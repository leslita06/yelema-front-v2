
// v4.26 : partage comme Google Docs, plus de Google Slides, icône d'enregistrement, portée des modèles, chat entreprise agrandi
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  var SV='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/></svg>';
  var PEN='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/><path d="m15 5 4 4"/></svg>';
  var LOCK='<svg class="i" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  var ORG='<svg class="i" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>';
  var GLOBE='<svg class="i" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
  var USR='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  var LNK='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  var MX='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/></svg>';
  var MN='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/></svg>';
  var PEOPLE=[['Jean-Marc Aka','Directeur général','m_men_83'],['Serge Bamba','Directeur administratif','m_men_80'],['Nadège Touré','Responsable terrain','m_women_36'],['Yao Kra','Graphiste','m_men_53'],['Mariam Koné','Comptable','m_women_62']];
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function opts(v){return '<option value="l"'+(v==='l'?' selected':'')+'>Lecteur</option><option value="e"'+(v==='e'?' selected':'')+'>Éditeur</option><option value="x">Retirer l’accès</option>'}

  // ---------- 1. Google Slides retiré partout
  $$('.gsb').forEach(function(b){b.remove()});
  var gm=document.getElementById('gslides');if(gm)gm.remove();
  $$('#newtdb .fmc').forEach(function(l){if(/Google Slides/.test(l.textContent))l.remove()});
  $$('#newtdb p.xs').forEach(function(p){if(/dans votre Drive/.test(p.textContent))p.textContent='Mis à jour à chaque nouvelle version du tableau.'});

  // ---------- 2. icône d'enregistrement
  function svIcon(a){var s=a.querySelector('svg');if(s)s.outerHTML=SV;else a.insertAdjacentHTML('afterbegin',SV)}
  $$('.tbdone,.tplok,.tbtpl').forEach(svIcon);
  $$('.tbed').forEach(function(b){
    function sync(){var on=/Enregistrer/.test(b.textContent);var s=b.querySelector('svg');var want=on?SV:PEN;if(s&&s.outerHTML.indexOf(on?'M15.2 3':'m15 5 4 4')<0)s.outerHTML=want}
    new MutationObserver(sync).observe(b,{childList:true,subtree:true,characterData:true});sync()});

  // ---------- 3. suggestions du mode Modifier retirées (elles ne changeaient pas d'un expert à l'autre)
  $$('.mws').forEach(function(m){m.remove()});
  $$('.tbask textarea').forEach(function(t){var w=(t.closest('.tbask')||{}).dataset||{};var n=w.who||'l’expert';t.dataset.phNew='Décrivez le bloc à '+n;if(/glisser|par exemple/.test(t.placeholder)&&t.placeholder.indexOf('changer')<0)t.placeholder='Décrivez le bloc à '+n});

  // ---------- 4. modèle : Moi seul, Certaines personnes, Toute l'équipe
  var st=document.getElementById('savetpl');
  if(st){
    var p=st.querySelector('h2+p');if(p)p.remove();
    var bl=st.querySelector('.tplbl');if(bl)bl.style.display='none';
    var rl=st.querySelector('.rlc');
    if(rl){
      rl.className='rlc rlc3';
      rl.innerHTML='<label><input type="radio" name="tplv" value="moi"><span class="rli">'+LOCK+'</span><b>Moi seule</b><small>Dans mes modèles</small></label>'+
        '<label><input type="radio" name="tplv" value="certains"><span class="rli">'+USR+'</span><b>Certaines personnes</b><small>Celles que je choisis</small></label>'+
        '<label><input type="radio" name="tplv" value="equipe" checked><span class="rli">'+ORG+'</span><b>Toute l’équipe</b><small>Tous les membres</small></label>';
      var pk=document.createElement('div');pk.className='tplpk';pk.hidden=true;
      pk.innerHTML='<span class="xs mute3">Choisissez les personnes</span><div class="tplpp">'+PEOPLE.map(function(x){return '<a href="#" class="tplp" data-n="'+esc(x[0])+'"><img src="../img/'+x[2]+'.jpg" alt=""><span>'+esc(x[0])+'</span></a>'}).join('')+'</div>';
      rl.parentNode.insertAdjacentElement('afterend',pk);
      $$('.tplp',pk).forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();a.classList.toggle('on')})});
      $$('input',rl).forEach(function(i){i.addEventListener('change',function(){pk.hidden=i.value!=='certains'||!i.checked})});
      var ok=st.querySelector('.tplok');
      if(ok)ok.addEventListener('click',function(e){var v=(rl.querySelector('input:checked')||{}).value;if(v==='certains'&&!pk.querySelector('.tplp.on')){e.preventDefault();e.stopImmediatePropagation();toast('Choisissez au moins une personne')}},true);
    }
  }

  // ---------- 5. partage comme Google Docs
  $$('#share .pn').forEach(function(pn){
    var sub=(pn.querySelector('h2+p')||{}).textContent||'';
    var title=sub.split(',')[0]||'le tableau';
    var urlEl=pn.querySelector('.tblku');var url=window.tbUrl(document.querySelector('.panel.on h2'))||'';
    var sg=pn.querySelector('.sg');var ch=pn.querySelector('.shch');
    var rows='<div class="gsp own"><img src="../img/aicha.jpg" alt=""><span class="grow"><b>Aïcha Diabaté <small>(vous)</small></b><small>aicha.diabate@unifood.info</small></span><span class="gsr0">Propriétaire</span></div>'+
      PEOPLE.slice(0,2).map(function(x,i){return '<div class="gsp"><img src="../img/'+x[2]+'.jpg" alt=""><span class="grow"><b>'+esc(x[0])+'</b><small>'+esc(x[1])+'</small></span><select class="gsr" aria-label="Accès de '+esc(x[0])+'">'+opts(i?'e':'l')+'</select></div>'}).join('');
    pn.innerHTML='<button class="ib x" data-close aria-label="Fermer"><svg class="i" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>'+
      '<h2 class="gsh">Partager « <span class="tbn">'+esc(title)+'</span> »</h2>'+
      '<div class="gsadd"><input type="text" placeholder="Ajouter des personnes par leur nom ou leur e-mail" aria-label="Ajouter des personnes" list="gspl"><select class="gsr gsnr" aria-label="Accès de la personne ajoutée"><option value="l">Lecteur</option><option value="e">Éditeur</option></select><a href="#" class="btn p sm gsinv">Ajouter</a></div>'+
      '<datalist id="gspl">'+PEOPLE.map(function(x){return '<option value="'+esc(x[0])+'">'}).join('')+'</datalist>'+
      '<h3 class="gst">Personnes qui ont accès</h3><div class="gspl">'+rows+'</div>'+
      '<h3 class="gst">Accès général</h3>'+
      '<div class="gsa"><span class="gsai">'+ORG+'</span><div class="grow"><select class="gsas" aria-label="Qui peut ouvrir le lien"><option value="perso">Limité</option><option value="org" selected>Unifood</option><option value="public">Tous les utilisateurs qui ont le lien</option></select><small class="gsad"></small></div><select class="gsr gsar" aria-label="Droit donné par le lien"><option value="l" selected>Lecteur</option><option value="e">Éditeur</option></select></div>'+
      '<div class="gspub" hidden></div>'+
      '<div class="gssend"><span class="xs mute3">Envoyer le lien sur</span><div class="gsch"></div></div>'+
      '<div class="gsf"><a href="#" class="btn o gscp">'+LNK+' Copier le lien</a><a href="#" class="btn p" data-close>OK</a></div>'+
      '<span class="tblku" hidden>'+esc(url)+'</span>';
    if(sg){pn.querySelector('.gspub').appendChild(sg);sg.hidden=false}
    if(ch){$$('.shc',ch).forEach(function(a){pn.querySelector('.gsch').appendChild(a)})}
    var s=pn.querySelector('.gsas'),d=pn.querySelector('.gsad'),ai=pn.querySelector('.gsai'),ar=pn.querySelector('.gsar'),pub=pn.querySelector('.gspub');
    function upd(){var v=s.value,r=ar.value==='e'?'modifier':'consulter';
      d.textContent=v==='perso'?'Seules les personnes ajoutées peuvent ouvrir ce lien':v==='org'?'Tous les membres d’Unifood qui ont le lien peuvent '+r+', après connexion':'Toute personne qui a le lien peut '+r+', sans connexion';
      ai.innerHTML=v==='perso'?LOCK:v==='org'?ORG:GLOBE;ai.className='gsai '+v;ar.hidden=v==='perso';pub.hidden=v!=='public'}
    s.addEventListener('change',function(){upd();toast('Accès général mis à jour')});
    ar.addEventListener('change',function(){if(s.value==='public'&&ar.value==='e'){ar.value='l';toast('Un lien public reste en lecture seule');}upd()});upd();
    function bindRow(sel){sel.addEventListener('change',function(){var r=sel.closest('.gsp'),n=r.querySelector('b').textContent;
      if(sel.value==='x'){r.remove();toast(n+' n’a plus accès')}else toast(n+(sel.value==='e'?' peut modifier':' peut consulter'))})}
    $$('.gspl .gsr',pn).forEach(bindRow);
    var inp=pn.querySelector('.gsadd input'),inv=pn.querySelector('.gsinv');handled(inv);
    inv.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();var v=inp.value.trim();if(!v){toast('Saisissez un nom ou un e-mail');inp.focus();return}
      var f=PEOPLE.filter(function(x){return x[0].toLowerCase()===v.toLowerCase()})[0];var role=pn.querySelector('.gsnr').value;
      var row=document.createElement('div');row.className='gsp';
      row.innerHTML=(f?'<img src="../img/'+f[2]+'.jpg" alt="">':'<span class="gsini">'+esc(v.charAt(0).toUpperCase())+'</span>')+'<span class="grow"><b>'+esc(f?f[0]:v)+'</b><small>'+esc(f?f[1]:'Invitation envoyée')+'</small></span><select class="gsr">'+opts(role)+'</select>';
      pn.querySelector('.gspl').appendChild(row);bindRow(row.querySelector('select'));inp.value='';toast((f?f[0]:v)+' ajouté, '+(role==='e'?'éditeur':'lecteur'))},true);
    var cp=pn.querySelector('.gscp');handled(cp);
    cp.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();var u=pn.querySelector('.tblku').textContent;try{navigator.clipboard&&navigator.clipboard.writeText('https://'+u)}catch(_){}
      cp.classList.add('ok');toast('Lien copié : '+u);setTimeout(function(){cp.classList.remove('ok')},1600)},true);
    $$('[data-close]',pn).forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();var m=pn.closest('.modal');if(m)m.classList.remove('on')})});
  });
  // titre et lien suivent le tableau ouvert
  $$('[data-open="share"]').forEach(function(a){a.addEventListener('click',function(){
    var panel=a.closest('.panel'),h=panel&&panel.querySelector('h1,h2,.tbt');var pn=$('#share .pn');if(!pn)return;
    if(h){var n=pn.querySelector('.tbn');if(n)n.textContent=h.textContent.trim()}var uu=pn.querySelector('.tblku');if(uu)uu.textContent=window.tbUrl(a)})});


  // ---------- 7. tableau de bord : les personnes en grand, l'expert en rond plus petit
  var AI=['Aïcha Diabaté','aicha'],FA=['Fanta Bakayoko','m_women_16'],KA=['Kader Ouattara','m_men_59'];
  var EXP={djeneba:['Djénéba','Chief of Staff'],djeneba2:['Djénéba','Chief of Staff'],fatima:['Fatima','Marketing et contenu'],koffi:['Koffi','Design'],adjoua:['Adjoua','Recrutement'],kouassi:['Kouassi','Ventes']};
  var HUM={adjoua:[FA],kouassi:[KA,FA]};
  $$('.panel[id^="tb-"]').forEach(function(pn){var t=pn.querySelector('.tbh2 .tbby');if(!t)return;
    var k=pn.id.replace(/^tb-/,'').replace(/-copie$/,'');var e=EXP[k];if(!e)return;var ek=k.replace(/2$/,'');
    var hs=HUM[k]||[AI];var tx=t.textContent.replace(/\s+/g,' ').trim();var sub;
    if(t.classList.contains('tbcp'))sub=tx;else if(HUM[k]){var m=tx.match(/(lecture|édition) jusqu’au (\S+)/);sub='Partagé avec vous'+(m?', en '+m[1]+' jusqu’au '+m[2]:'')}else{var m2=tx.match(/mis à jour.*$/);sub=m2?m2[0].charAt(0).toUpperCase()+m2[0].slice(1):''}
    var names=hs.map(function(h){return h[0]}).join(' et ');
    var w=document.createElement('div');w.className='tbppl';
    var av=HUM[k]?hs.concat([AI]):hs;
    w.innerHTML='<span class="tbpav">'+av.map(function(h){return '<img class="tbph" src="../img/'+h[1]+'.jpg" alt="'+esc(h[0])+'" title="'+esc(h[0])+'">'}).join('')+'<img class="tbpx" src="../img/'+ek+'.jpg" alt="'+esc(e[0])+'" title="'+esc(e[0])+', Expert"></span><span class="tbbt"><b>'+esc(names)+'</b><span>avec '+esc(e[0])+', '+esc(e[1])+'</span>'+(sub?'<small>'+esc(sub)+'</small>':'')+'</span>';
    t.replaceWith(w)});
  $$('.tbsig>span:first-child').forEach(function(s){var pn=s.closest('.panel');var k=pn?pn.id.replace(/^tb-/,'').replace(/-copie$/,''):'';var hs=(HUM[k]||[AI]).map(function(h){return h[0]}).join(' et ');s.textContent=s.textContent.replace(/^Tableau préparé par /,'Tableau tenu par '+hs+' avec ')});

  // ---------- 6. chat entreprise (Nouvelle conversation) : Agrandir / Réduire
  var g=$('.gpt'),gh=$('.gpt .ghead');
  if(g&&gh){var b=document.createElement('a');b.href='#';b.className='tbtn gpw';handled(b);gh.appendChild(b);
    function set(on){g.classList.toggle('gwide',on);b.innerHTML=(on?MN:MX)+'<span>'+(on?'Réduire':'Agrandir')+'</span>';b.setAttribute('aria-label',on?'Réduire, afficher les conversations':'Agrandir, masquer les conversations');try{localStorage.setItem('gWide',on?'1':'')}catch(_){}}
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();set(!g.classList.contains('gwide'))});
    var w='';try{w=localStorage.getItem('gWide')||''}catch(_){}set(!!w);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&g.classList.contains('gwide')&&!$('.modal.on'))set(false)})}
})();
// v4.26 suite : langue, listes déroulantes modernes, menu d'état des experts
(function(){
  function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  var CK='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  var CH='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  // ---------- langue : une langue par défaut + l'option des deux
  $$('select[aria-label="Langue"]').forEach(function(s){
    var two=/et English/.test(s.value),def=/^English/.test(s.value)?'en':'fr';
    var w=document.createElement('div');w.className='lgw';
    w.innerHTML='<div class="lgseg" role="radiogroup" aria-label="Langue par défaut"><a href="#" data-l="fr" role="radio">Français</a><a href="#" data-l="en" role="radio">English</a></div>'+
      '<label class="lgtw"><button type="button" class="lgsw" role="switch" aria-checked="false" aria-label="Répondre aussi dans l’autre langue"><i></i></button><span>Répond aussi en <b class="lgo">English</b> si on lui écrit dans cette langue</span></label>';
    s.style.display='none';s.insertAdjacentElement('afterend',w);
    var sw=w.querySelector('.lgsw');[sw].concat($$('.lgseg a',w)).forEach(handled);
    function sync(){$$('.lgseg a',w).forEach(function(a){var on=a.dataset.l===def;a.classList.toggle('on',on);a.setAttribute('aria-checked',on)});
      sw.classList.toggle('on',two);sw.setAttribute('aria-checked',two);w.querySelector('.lgo').textContent=def==='fr'?'English':'français';
      s.value=two?'Français et English':(def==='fr'?'Français':'English')}
    $$('.lgseg a',w).forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(def===a.dataset.l)return;def=a.dataset.l;sync();toast('Langue par défaut : '+a.textContent)})});
    sw.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();two=!two;sync();toast(two?'Répond dans les deux langues':'Une seule langue')});
    sync()});
  // ---------- listes déroulantes : composant maison à la place du select natif
  var open=null;function closeAll(){if(open){open.classList.remove('on');open.querySelector('.csb').setAttribute('aria-expanded','false');open=null}}
  document.addEventListener('click',function(e){if(open&&!open.contains(e.target))closeAll()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
  $$('select.fi').forEach(function(s){
    if(s.style.display==='none'||s.closest('table,.gsadd,.gsa,.tdf')||s.multiple)return;
    var w=document.createElement('div');w.className='csel';
    var b=document.createElement('button');b.type='button';b.className='csb';b.setAttribute('aria-haspopup','listbox');b.setAttribute('aria-expanded','false');if(s.getAttribute('aria-label'))b.setAttribute('aria-label',s.getAttribute('aria-label'));
    var l=document.createElement('div');l.className='csl';l.setAttribute('role','listbox');
    w.appendChild(b);w.appendChild(l);s.insertAdjacentElement('afterend',w);s.style.display='none';w.prepend(s);handled(b);
    function lab(){var o=s.options[s.selectedIndex];b.innerHTML='<span>'+(o?o.text:'')+'</span>'+CH}
    function fill(){l.innerHTML='';[].forEach.call(s.options,function(o,i){var a=document.createElement('a');a.href='#';a.className='cso'+(i===s.selectedIndex?' on':'');a.setAttribute('role','option');a.innerHTML='<span>'+o.text+'</span>'+CK;handled(a);
      a.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();s.selectedIndex=i;s.dispatchEvent(new Event('change',{bubbles:true}));lab();closeAll()});l.appendChild(a)})}
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var was=w.classList.contains('on');closeAll();if(!was){fill();w.classList.add('on');b.setAttribute('aria-expanded','true');open=w;
      var r=b.getBoundingClientRect();w.classList.toggle('up',window.innerHeight-r.bottom<260&&r.top>260)}});
    s.addEventListener('change',lab);lab()});
})();
