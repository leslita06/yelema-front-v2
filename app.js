// Onglets (page expert), filtres (recrutement), fiche latérale. Sans dépendance.
document.querySelectorAll('[data-tabs]').forEach(function(box){
  var links=box.querySelectorAll('.tabs a[data-t], .xnav a[data-t]'), panels=box.querySelectorAll('.panel');
  function show(id){links.forEach(function(a){a.classList.toggle('on',a.dataset.t===id)});panels.forEach(function(p){p.classList.toggle('on',p.id===id)});}
  links.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();show(a.dataset.t);history.replaceState(null,'','#'+a.dataset.t)})});
  document.querySelectorAll('[data-go]').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();show(a.dataset.go);window.scrollTo({top:0,behavior:'smooth'})})});
  var h=location.hash.slice(1); if(h&&box.querySelector('#'+h)) show(h);
});
document.querySelectorAll('[data-filter]').forEach(function(bar){
  var chips=bar.querySelectorAll('.chip[data-f]'), cards=document.querySelectorAll('.xcard, .pc[data-m]');
  chips.forEach(function(c){c.addEventListener('click',function(){chips.forEach(function(x){x.classList.toggle('on',x===c)});var f=c.dataset.f;cards.forEach(function(k){k.style.display=(f==='tous'||k.dataset.m===f)?'':'none'})})});
});
var dr=document.querySelector('.drawer');
if(dr){
  document.querySelectorAll('.xcard, .pc[data-x]').forEach(function(k){k.addEventListener('click',function(){
    var d=JSON.parse(k.dataset.x); dr.querySelector('.ph img').src=d.photo; dr.querySelector('h2').textContent=d.nom;
    dr.querySelector('.rl').textContent=d.metier; dr.querySelector('.desc').textContent=d.desc;
    dr.querySelector('.tasks').innerHTML=d.taches.map(function(t){return '<li>'+dr.dataset.check+'<span>'+t+'</span></li>'}).join('');
    dr.querySelector('.go').textContent='Recruter '+d.nom; dr.querySelector('.go').style.display=''; dr.querySelector('.done').style.display='none';
    dr.querySelector('.done').textContent=d.done;
    dr.classList.add('on');})});
  dr.querySelectorAll('[data-close]').forEach(function(x){x.addEventListener('click',function(){dr.classList.remove('on')})});
  dr.querySelector('.go').addEventListener('click',function(e){e.preventDefault();this.style.display='none';dr.querySelector('.done').style.display='block'});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')dr.classList.remove('on')});
}

// Panneaux Ping et notifications, fenêtre de personnalisation
document.querySelectorAll('[data-pop]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
  var t=document.getElementById(b.dataset.pop),was=t.classList.contains('on');document.querySelectorAll('.pop').forEach(function(p){p.classList.remove('on')});if(!was)t.classList.add('on')})});
document.addEventListener('click',function(e){if(!e.target.closest('.pop'))document.querySelectorAll('.pop').forEach(function(p){p.classList.remove('on')})});
document.querySelectorAll('[data-open]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();document.getElementById(b.dataset.open).classList.add('on')})});
document.querySelectorAll('.modal [data-close]').forEach(function(x){x.addEventListener('click',function(e){e.preventDefault();x.closest('.modal').classList.remove('on')})});
document.querySelectorAll('.opts').forEach(function(g){g.querySelectorAll('span').forEach(function(o){o.addEventListener('click',function(){g.querySelectorAll('span').forEach(function(x){x.classList.toggle('on',x===o)})})})});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.querySelectorAll('.modal,.pop').forEach(function(m){m.classList.remove('on')})}});

// Composio : nom de l'outil et état connecté
document.querySelectorAll('[data-open="cz"]').forEach(function(b){b.addEventListener('click',function(){var z=document.querySelector('#cz .pn');z.classList.remove('done');z.querySelector('.czn').textContent=b.dataset.app||"l'outil"})});
document.querySelectorAll('.czgo').forEach(function(g){g.addEventListener('click',function(e){e.preventDefault();g.closest('.pn').classList.add('done')})});

// Page Discussions : changer de conversation, filtrer la liste
document.querySelectorAll('[data-conv]').forEach(function(c){c.addEventListener('click',function(e){e.preventDefault();
  document.querySelectorAll('[data-conv]').forEach(function(x){x.classList.toggle('on',x===c)});c.classList.remove('unread');var n=c.querySelector('.nb');if(n)n.remove();
  document.querySelectorAll('.cth').forEach(function(t){t.classList.toggle('on',t.id==='c-'+c.dataset.conv)})})});
document.querySelectorAll('[data-cf]').forEach(function(bar){bar.querySelectorAll('span').forEach(function(s){s.addEventListener('click',function(){
  bar.querySelectorAll('span').forEach(function(x){x.classList.toggle('on',x===s)});
  document.querySelectorAll('[data-conv]').forEach(function(c){c.style.display=(s.dataset.f==='tous'||c.dataset.k===s.dataset.f)?'':'none'})})})});

// ---------- Boutons branchés (v4.2) ----------
var toastEl=document.querySelector('.toast'),tT;
function toast(m){if(!toastEl)return;toastEl.textContent=m;toastEl.classList.add('on');clearTimeout(tT);tT=setTimeout(function(){toastEl.classList.remove('on')},2600)}
function openM(id){var m=document.getElementById(id);if(m)m.classList.add('on');return m}
function handled(el){el.dataset.h='1'}

// Appel avec un expert
var NOMS={djeneba:'Djénéba',fatima:'Fatima',koffi:'Koffi'},cT;
document.querySelectorAll('[data-call]').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
  var m=openM('call');if(!m)return;var k=b.dataset.call;m.querySelector('.cph').src='../img/'+k+'.jpg';m.querySelector('.cnm').textContent=NOMS[k]||k;
  var t=0,el=m.querySelector('.ctm');el.textContent='Appel en cours…';clearInterval(cT);
  setTimeout(function(){cT=setInterval(function(){t++;el.textContent=('0'+Math.floor(t/60)).slice(-2)+':'+('0'+t%60).slice(-2)},1000)},1200)})});
document.querySelectorAll('#call [data-close]').forEach(function(x){handled(x);x.addEventListener('click',function(){clearInterval(cT);toast('Appel terminé, le résumé arrive dans la discussion')})});
document.querySelectorAll('[data-mute]').forEach(function(b){handled(b);b.addEventListener('click',function(){b.classList.toggle('off')})});

// Invitation
document.querySelectorAll('.invgo').forEach(function(g){handled(g);g.addEventListener('click',function(e){e.preventDefault();g.closest('.pn').classList.add('done')})});
document.querySelectorAll('[data-open="inv"]').forEach(function(b){b.addEventListener('click',function(){var p=document.querySelector('#inv .pn');if(p)p.classList.remove('done')})});
document.querySelectorAll('.opts.ex span').forEach(function(o){o.addEventListener('click',function(e){e.stopImmediatePropagation();o.classList.toggle('on')},true)});

// Aperçu d'un document ou livrable
function apercu(el){var m=openM('doc');if(!m)return;var t=(el.querySelector('b')||el).textContent.trim();m.querySelector('.dtt').textContent=t;
  var poster=el.querySelector('.poster')||/visuel|post|affiche|Instagram/i.test(el.textContent),img=m.querySelector('.dprev');
  if(poster){img.innerHTML='<img src="../img/'+(/Mint/i.test(el.textContent)?'flyer-supermint':'flyer-sossa')+'.jpg" alt="">'}
  else{img.innerHTML='<div class="paper"><h4>'+t+'</h4><i></i><i></i><i class="s"></i><i></i><i></i><i class="s"></i><i></i><i class="s"></i></div>'}}
document.querySelectorAll('a.dl, .files a, .files .fl, .fl, .val .th').forEach(function(el){if(el.closest('.modal'))return;handled(el);el.addEventListener('click',function(e){e.preventDefault();apercu(el.closest('.val')||el)})});

// Valider et publier
document.querySelectorAll('.deliv .btn.p').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();b.innerHTML='✓ Publié';b.classList.add('ok2');var pl=b.closest('.deliv').querySelector('.pill');if(pl){pl.textContent='Publié';pl.className='pill ok'}toast('Publié sur Facebook, Yao reçoit la version print')})});

// Tout lire
document.querySelectorAll('#notifs .link').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();document.querySelectorAll('[data-pop="notifs"] .bdg').forEach(function(x){x.remove()});document.querySelectorAll('#notifs .nt').forEach(function(n){n.style.opacity=.55});toast('Tout est lu')})});

// Micro : écoute
document.querySelectorAll('.mic, [aria-label="Question à la voix"], [aria-label="Message vocal"]').forEach(function(b){if(b.dataset.h)return;handled(b);b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
  var on=b.classList.toggle('rec'),box=b.closest('.inp'),ph=box&&box.querySelector('.ph');if(ph){if(on){ph.dataset.o=ph.textContent;ph.textContent='Je vous écoute…'}else{ph.textContent=ph.dataset.o||ph.textContent;toast('Message vocal envoyé')}}})});

// Joindre un fichier
var fi=document.createElement('input');fi.type='file';fi.style.display='none';document.body.appendChild(fi);
fi.addEventListener('change',function(){if(fi.files[0])toast(fi.files[0].name+' ajouté à la discussion')});
document.querySelectorAll('[aria-label="Joindre un fichier"]').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();fi.click()})});

// Pause d'un expert
document.querySelectorAll('.pause, [aria-label="Mettre en pause"]').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var st=document.querySelector('.pcard .st');var p=b.classList.toggle('on');
  if(st)st.innerHTML=p?'<span class="dot idle"></span> En pause':'<span class="dot"></span> Au travail';toast(p?'En pause : plus aucune tâche ne démarre':'De retour au travail')})});

// Arborescence du drive
document.querySelectorAll('.tree a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();a.parentNode.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)})})});

// Messages explicites sur le reste
var MSG={'PDF':'Facture téléchargée','Exporter en CSV':'Export prêt : suivi-unifood-septembre.csv','Payer par mobile money':'Paiement lancé sur Wave, validez sur votre téléphone',
 'Ajouter':'Ajouté','Nouveau':'Nouveau dossier créé','Configurer':'Réglage enregistré','Gérer':'Réglages ouverts','Changer':'Choisissez le nouveau logo',
 'Ajouter une source':'Choisissez la source : Drive, SharePoint ou un site','Connecter un agenda':'Agenda Google relié','Ajouter un responsable':'Responsable ajouté',
 'Suggérer':'Djénéba propose une routine dans la discussion','Modifier':'Modification ouverte','Répondre':'Réponse préparée par l\'expert, à relire','Transférer':'Choisissez le destinataire',
 'Retirer':'Retiré','Écouter':'Lecture du message vocal','Ouvrir':'Ouverture du compte de travail','Afficher plus':'Dix livrables de plus','Nouvelle discussion':'Choisissez un expert ou un collègue',
 'Changer son visage':'Nouveau visage généré','Tout mettre en pause':'Toute l\'équipe est en pause','Pause':'Routine en pause','Copier le lien':'Lien copié'};
document.addEventListener('click',function(e){var el=e.target.closest('a[href="#"], button');if(!el||el.dataset.h||el.closest('.modal [data-close]'))return;
  if(el.matches('[data-pop],[data-open],[data-go],[data-t],[data-conv],[data-close],[data-f],.chip,.czgo,.go,.pc,.xcard'))return;if(el.closest('[data-cf],.seg2,.opts,[data-filter],.drawer'))return;
  var lab=(el.dataset.toast)||(el.textContent.trim()||el.getAttribute('aria-label')||'');e.preventDefault();toast(MSG[lab]||el.dataset.toast||(lab?lab+' : c\'est fait':'C\'est fait'))});

// Chat entreprise : nouvelle conversation (écran vide) ou fil existant
document.querySelectorAll('[data-fil]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();var g=document.querySelector('.gmain');if(!g)return;
  document.querySelectorAll('.gf').forEach(function(x){x.classList.toggle('on',x===a)});
  if(a.dataset.fil==='vide'){g.classList.add('vide');g.querySelector('.gtt').textContent='Nouvelle conversation';return}
  g.classList.remove('vide');g.querySelector('.gtt').textContent=a.textContent;
  document.querySelectorAll('.gfil').forEach(function(f){f.style.display=f.id===a.dataset.fil?'':'none'})})});
document.querySelectorAll('.gsug span').forEach(function(s){s.addEventListener('click',function(){var a=document.querySelector('.gf[data-fil="c1"]');if(a)a.click()})});

// v4.4 : toasts génériques, partage, Jèko, fil de notifications, recruter et assigner
document.querySelectorAll('[data-toast]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();toast(a.dataset.toast)})});
document.querySelectorAll('[data-sh] a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();var g=a.parentNode;g.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)});
  document.querySelectorAll('.shv').forEach(function(v){v.classList.toggle('on',v.id==='sh-'+a.dataset.v)})})});
document.querySelectorAll('.jm').forEach(function(m){m.addEventListener('click',function(){document.querySelectorAll('.jm').forEach(function(x){x.classList.toggle('on',x===m)})})});
document.querySelectorAll('.jgo').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var m=document.querySelector('.jm.on .grow');b.closest('.modal').classList.remove('on');toast('Paiement envoyé par Jèko'+(m?', '+m.textContent:'')+' : validez sur votre téléphone')})});
document.querySelectorAll('[data-tick]').forEach(function(t){var it=t.querySelectorAll('.ti'),dt=t.querySelectorAll('.tdots i'),i=0,tm;
  function go(n){i=(n+it.length)%it.length;it.forEach(function(x,j){x.classList.toggle('on',j===i)});dt.forEach(function(x,j){x.classList.toggle('on',j===i)})}
  function run(){clearInterval(tm);if(!matchMedia('(prefers-reduced-motion: reduce)').matches)tm=setInterval(function(){go(i+1)},4200)}
  var nx=t.querySelector('.tnx');handled(nx);nx.addEventListener('click',function(){go(i+1);run()});t.addEventListener('mouseenter',function(){clearInterval(tm)});t.addEventListener('mouseleave',run);run()});
document.querySelectorAll('.drawer .as').forEach(function(a){a.addEventListener('click',function(){var on=a.parentNode.querySelectorAll('.as.on');if(a.classList.contains('on')&&on.length===1)return;a.classList.toggle('on')})});
document.querySelectorAll('.drawer .c3').forEach(function(c){c.addEventListener('click',function(){c.classList.toggle('on')})});
if(dr){var lock=dr.dataset.check;
  document.querySelectorAll('.pc[data-x]').forEach(function(k){k.addEventListener('click',function(){var d=JSON.parse(k.dataset.x);
    var c=dr.querySelector('.cps');if(c)c.innerHTML=(d.comp||[]).map(function(x){return '<span>'+x+'</span>'}).join('');
    var a=dr.querySelector('.acc');if(a)a.innerHTML=(d.accord||[]).map(function(x){return '<li>'+lock+'<span>'+x+'</span></li>'}).join('');
    dr.dataset.nom=d.nom;dr.dataset.pron=d.pron||'il'})});
  dr.querySelector('.go').addEventListener('click',function(){var who=[].map.call(dr.querySelectorAll('.as.on'),function(x){return x.dataset.who}).join(', ')||'Moi',p=(dr.dataset.pron||'il');
    dr.querySelector('.done').textContent=dr.dataset.nom+' rejoint '+(who==='Moi'?'votre équipe':(who==='tout le service'?'le service':'l\'équipe de '+who))+'. '+p.charAt(0).toUpperCase()+p.slice(1)+' '+(who==='Moi'?'vous':'lui')+' écrit dans quelques minutes.'})}

// v4.5 : page recrue (assigner, canaux, confirmation)
document.querySelectorAll('.rqbox .as').forEach(function(a){a.addEventListener('click',function(){var on=a.parentNode.querySelectorAll('.as.on');if(a.classList.contains('on')&&on.length===1)return;a.classList.toggle('on')})});
document.querySelectorAll('.dt').forEach(function(t){t.addEventListener('click',function(){t.classList.toggle('on')})});
document.querySelectorAll('.rqgo').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();document.getElementById('rq-go').scrollIntoView({behavior:'smooth',block:'start'})})});
document.querySelectorAll('.rqok').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var box=b.closest('.rqbox'),who=[].map.call(box.querySelectorAll('.as.on'),function(x){return x.dataset.who}).join(', ')||'Moi',n=b.dataset.nom,p=b.dataset.pron||'il';
  var ch=[].map.call(box.querySelectorAll('.dt.on b'),function(x){return x.textContent}).join(', ');
  box.querySelector('.rqdone span').textContent=n+' rejoint '+(who==='Moi'?'votre équipe':(who==='tout le service'?'le service':'l\'équipe de '+who))+'. '+p.charAt(0).toUpperCase()+p.slice(1)+' '+(who==='Moi'?'vous':'lui')+' écrit dans quelques minutes'+(ch?', sur '+ch:'')+'.';
  box.querySelector('.rqdone').classList.add('on');b.innerHTML='✓ Recruté';b.classList.add('ok2')})});
document.querySelectorAll('#notifs .mk').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();document.querySelectorAll('[data-pop="notifs"] .bdg').forEach(function(x){x.remove()});document.querySelectorAll('#notifs .nt').forEach(function(n){n.style.opacity=.55});toast('Tout est lu')})});

// v4.5b : vidéos des experts (chargées quand visibles), menu repliable, recrutement guidé, filtres livrables
(function(){var vs=document.querySelectorAll('video.av-vid');if(!vs.length)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(!('IntersectionObserver' in window))return;var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;
    if(e.isIntersecting){if(!v.src&&v.dataset.src)v.src=v.dataset.src;var p=v.play();if(p&&p.catch)p.catch(function(){})}else{v.pause()}})},{threshold:.35});
  vs.forEach(function(v){io.observe(v)})})();
(function(){try{if(localStorage.getItem('sbmini')==='1')document.body.classList.add('sbmini')}catch(e){}
  document.querySelectorAll('.sbt').forEach(function(b){handled(b);b.addEventListener('click',function(){var on=document.body.classList.toggle('sbmini');b.setAttribute('aria-label',on?'Déplier le menu':'Replier le menu');try{localStorage.setItem('sbmini',on?'1':'0')}catch(e){}})})})();
document.querySelectorAll('.ask2').forEach(function(f){var L=JSON.parse(f.dataset.kw),res=document.querySelector('.ares'),inp=f.querySelector('input');
  function norm(x){return (x||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
  function go(q){q=norm(q);if(!q.trim()){inp.focus();return}
    var w=q.split(/[^a-z0-9]+/).filter(function(x){return x.length>3});
    var sc=L.map(function(e){var k=norm(e.kw),n=0;w.forEach(function(x){if(k.indexOf(x.slice(0,6))>=0)n++});return {e:e,n:n}}).sort(function(a,b){return b.n-a.n});
    var top=sc.slice(0,3);
    if(!top[0].n){res.innerHTML='<p>Je n\'ai pas trouvé d\'expert évident. Dites-m\'en un peu plus : quel métier, quel résultat attendu&nbsp;?</p>';res.hidden=false;return}
    res.innerHTML='<p>Pour ce travail, je vous propose <b>'+top[0].e.nom+'</b>, '+top[0].e.role+'.</p><div class="arow">'+top.filter(function(t){return t.n}).map(function(t,i){return '<a class="'+(i?'':'best')+'" href="recrue-'+t.e.k+'.html"><img src="../img/pied/'+t.e.k+'.jpg" alt=""><span><b>'+t.e.nom+'</b><small>'+t.e.role+'</small></span></a>'}).join('')+'</div>';res.hidden=false}
  f.addEventListener('submit',function(e){e.preventDefault();go(inp.value)});
  document.querySelectorAll('.asug span').forEach(function(s){s.addEventListener('click',function(){inp.value=s.textContent;go(s.textContent)})})});
document.querySelectorAll('.lvw').forEach(function(w){var per=30,fmt='',proj='',q='';var rows=w.querySelectorAll('.dl'),n=w.querySelector('.lvn'),z=w.querySelector('.lv0');
  function ap(){var c=0;rows.forEach(function(r){var ok=(+r.dataset.age<=per)&&(!fmt||r.dataset.fmt===fmt)&&(!proj||r.dataset.proj===proj)&&(!q||r.dataset.q.indexOf(q)>=0);r.style.display=ok?'':'none';if(ok)c++});n.textContent=c+' livrable'+(c>1?'s':'');z.hidden=c>0}
  w.querySelectorAll('.lvp a').forEach(function(a){handled(a);a.addEventListener('click',function(){w.querySelectorAll('.lvp a').forEach(function(x){x.classList.toggle('on',x===a)});per=+a.dataset.p;ap()})});
  w.querySelectorAll('.lvc .chip').forEach(function(c){c.addEventListener('click',function(){w.querySelectorAll('.lvc .chip').forEach(function(x){x.classList.toggle('on',x===c)});fmt=c.dataset.lf;ap()})});
  var s=w.querySelector('.lvs input');s.addEventListener('input',function(){q=s.value.toLowerCase().trim();ap()});
  var sel=w.querySelector('.lvj select');sel.addEventListener('change',function(){proj=sel.value;ap()});
  var pan=w.closest('.panel')||document;pan.querySelectorAll('.proj').forEach(function(p){p.addEventListener('click',function(){var t=p.querySelector('.ell').textContent;var on=!p.classList.contains('on');pan.querySelectorAll('.proj').forEach(function(x){x.classList.remove('on')});if(on)p.classList.add('on');proj=on?t:'';sel.value=proj;ap();w.scrollIntoView({behavior:'smooth',block:'start'})})});
  rows.forEach(function(r){handled(r);r.addEventListener('click',function(e){e.preventDefault();if(document.getElementById('doc')){openM('doc');var t=document.querySelector('#doc .dtt');if(t)t.textContent=r.dataset.doc}})});
  ap()});

// v4.5c : page expert (résumé filtrable, profil, connecteurs, drive, mail, agenda)
document.querySelectorAll('.rps a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();var w=a.closest('.panel')||document;
  w.querySelectorAll('.rps a').forEach(function(x){x.classList.toggle('on',x===a)});w.querySelectorAll('.rcp').forEach(function(r){r.classList.toggle('on',r.dataset.rp===a.dataset.rp)})})});
document.querySelectorAll('.askx').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var v=f.querySelector('input').value.trim();
  var t=document.querySelector('[data-t="discussion"]');if(t)t.click();toast(v?'Question envoyée dans la discussion':'Écrivez votre question')})});
document.querySelectorAll('.kv2 .seg a, .lvp a').forEach(function(a){handled(a)});
document.querySelectorAll('.kv2 .seg').forEach(function(g){g.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();g.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)})})})});
document.querySelectorAll('.vx').forEach(function(v){v.addEventListener('click',function(e){var all=v.parentNode.querySelectorAll('.vx');
  if(e.target.closest('.pl')){e.stopPropagation();all.forEach(function(x){x.classList.remove('play')});v.classList.add('play');toast('Écoute de la voix '+v.querySelector('b').textContent);setTimeout(function(){v.classList.remove('play')},2400);return}
  all.forEach(function(x){x.classList.toggle('on',x===v)});toast('Nouvelle voix : '+v.querySelector('b').textContent)})});
document.querySelectorAll('.vx .pl').forEach(function(b){handled(b)});
document.querySelectorAll('[data-ct]').forEach(function(w){var tabs=w.querySelectorAll('.cts span');tabs.forEach(function(t){t.addEventListener('click',function(){tabs.forEach(function(x){x.classList.toggle('on',x===t)});w.querySelectorAll('.czp').forEach(function(p){p.classList.toggle('on',p.id===t.dataset.c)})})});
  var cat='',q='',tiles=w.querySelectorAll('.cz2');function ap(){tiles.forEach(function(t){t.style.display=((!cat||t.dataset.cat===cat)&&(!q||t.dataset.q.indexOf(q)>=0))?'':'none'})}
  w.querySelectorAll('[data-cc]').forEach(function(c){c.addEventListener('click',function(){w.querySelectorAll('[data-cc]').forEach(function(x){x.classList.toggle('on',x===c)});cat=c.dataset.cc;ap()})});
  var si=w.querySelector('.czs input');if(si)si.addEventListener('input',function(){q=si.value.toLowerCase().trim();ap()})});
document.querySelectorAll('.tree').forEach(function(t){t.querySelectorAll('a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();t.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)});var h=t.parentNode.querySelector('h2');if(h)h.textContent=a.textContent.trim()})})});
document.querySelectorAll('.mail').forEach(function(m){var rd=m.querySelector('.rd');m.querySelectorAll('.lst .it').forEach(function(it){it.addEventListener('click',function(){m.querySelectorAll('.lst .it').forEach(function(x){x.classList.toggle('on',x===it)});
  if(rd){var h=rd.querySelector('h3'),b=it.querySelector('b'),s=rd.querySelector('.sm.mute3'),w=it.querySelector('.xs');if(h&&b)h.textContent=b.textContent;if(s&&w)s.textContent=w.textContent;var p=rd.querySelector('p');if(p&&it.dataset.body)p.textContent=it.dataset.body}})})});
document.querySelectorAll('.ctabs').forEach(function(c){if(c.classList.contains('cts'))return;c.querySelectorAll('span').forEach(function(s){s.addEventListener('click',function(){c.querySelectorAll('span').forEach(function(x){x.classList.toggle('on',x===s)})})})});
document.querySelectorAll('.cal .seg a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();a.parentNode.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)})})});
document.querySelectorAll('.ev').forEach(function(v){v.addEventListener('click',function(){toast(v.firstChild&&v.firstChild.textContent?v.firstChild.textContent.trim():'Rendez-vous')})});

// v4.5d : connecteurs de l'organisation
document.querySelectorAll('[data-tq]').forEach(function(i){i.addEventListener('input',function(){var q=i.value.toLowerCase().trim();document.querySelectorAll('tr[data-q]').forEach(function(r){r.style.display=(!q||r.dataset.q.indexOf(q)>=0)?'':'none'})})});
document.querySelectorAll('[data-open="cxa"]').forEach(function(b){b.addEventListener('click',function(){var n=document.querySelector('#cxa .czn');if(n)n.textContent=b.dataset.app})});
document.querySelectorAll('[data-sh2] a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();a.parentNode.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)})})});
document.querySelectorAll('.cxo').forEach(function(c){c.addEventListener('click',function(){var s=c.querySelector('.sw');if(s)s.classList.toggle('off')})});

// v4.7 : bascule entre compte utilisateur et compte admin
document.querySelectorAll('.acsw').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
  var m=b.closest('.acw').querySelector('.acm');if(m)m.hidden=!m.hidden})});
document.addEventListener('click',function(e){if(!e.target.closest('.acw'))document.querySelectorAll('.acm').forEach(function(m){m.hidden=true})});

// v4.8 : mot de passe, connexion, déconnexion
document.querySelectorAll('.eye').forEach(function(b){b.addEventListener('click',function(){var i=b.parentNode.querySelector('input');if(i)i.type=i.type==='password'?'text':'password'})});
document.querySelectorAll('[data-mdwho]').forEach(function(a){a.addEventListener('click',function(){var w=document.querySelector('#mdp [data-who]');if(w)w.textContent=a.dataset.mdwho;
  var p=document.querySelector('#mdp .pn');if(p)p.classList.remove('done')})});
document.querySelectorAll('.mdform').forEach(function(f){var a=f.querySelector('#md0'),b=f.querySelector('#md1'),c=f.querySelector('#md2'),ok=f.querySelector('.mdok');
  function chk(){var v=b.value,r={len:v.length>=8,num:/\d/.test(v),maj:/[A-Z]/.test(v),eq:v.length>0&&v===c.value},all=a.value.length>0;
    f.querySelectorAll('.mdr li').forEach(function(li){var x=r[li.dataset.r];li.classList.toggle('ok',x);all=all&&x});ok.disabled=!all}
  [a,b,c].forEach(function(i){i.addEventListener('input',chk)});
  f.addEventListener('submit',function(e){e.preventDefault();if(ok.disabled)return;f.closest('.pn').classList.add('done');f.reset();chk()})});
(function(){var m=document.querySelector('[data-out]');if(!m)return;var h=location.hash;if(h.indexOf('#out')===0){m.hidden=false;
  if(h==='#out-admin'){m.querySelector('span').textContent='Compte administrateur déconnecté.';var em=document.querySelector('[data-login] input[type=email]');if(em)em.value='admin@unifood.info';
    document.querySelectorAll('.auseg a').forEach(function(x){x.classList.toggle('on',x.dataset.acc==='admin.html')})}}})();
document.querySelectorAll('.auseg a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();a.parentNode.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)});
  var em=document.querySelector('[data-login] input[type=email]');if(em)em.value=a.dataset.acc==='admin.html'?'admin@unifood.info':'aicha.diabate@unifood.info'})});
document.querySelectorAll('[data-login]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var on=document.querySelector('.auseg a.on');location.href=on?on.dataset.acc:'accueil.html'})});
document.querySelectorAll('[data-forgot]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();document.querySelector('[data-st="1"]').hidden=true;document.querySelector('[data-st="2"]').hidden=false})});
document.querySelectorAll('[data-next]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();document.querySelectorAll('.aust').forEach(function(s){s.hidden=s.dataset.st!==a.dataset.next})})});
document.querySelectorAll('[data-reset]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();location.href='connexion.html';})});
document.querySelectorAll('.auok,.mdok,.eye').forEach(function(b){handled(b)});

// v4.9 : bandeau final de Recruter, retour à la recherche
document.querySelectorAll('[data-ask]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();var f=document.getElementById('ask');if(!f)return;
  f.scrollIntoView({behavior:'smooth',block:'center'});var i=f.querySelector('input');if(i)setTimeout(function(){i.focus()},400)})});
// connexion : le compte (utilisateur ou admin) se déduit de l'adresse
document.querySelectorAll('[data-login]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();e.stopImmediatePropagation();var em=f.querySelector('input[type=email]');
  location.href=(em&&/^admin@/.test(em.value.trim()))?'admin.html':'accueil.html'},true)});

// v4.10 : un widget ouvre l'onglet du tableau de bord correspondant
document.querySelectorAll('[data-tab]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();var t=document.querySelector('[data-tabs] [data-t="'+a.dataset.tab+'"]');
  if(t){t.click();var w=t.closest('[data-tabs]');if(w)w.scrollIntoView({behavior:'smooth',block:'start'})}})});

// v4.11 tableaux de bord métier : filtres projet, période, type ; ajout et retrait de widgets
(function(){
  document.querySelectorAll('.panel').forEach(function(panel){
    var f=panel.querySelector('.tdf');if(!f)return;
    var st={p:'',ty:''};
    function apply(){
      panel.querySelectorAll('.mw:not(.mwadd), .cdx').forEach(function(c){
        var okP=!st.p||(c.dataset.ps||'').split(' ').indexOf(st.p)>=0||c.classList.contains('user');
        var okT=!st.ty||c.dataset.ty===st.ty||c.classList.contains('cdx');
        c.style.display=okP&&okT?'':'none';
      });
      panel.querySelectorAll('[data-p]').forEach(function(x){if(x.classList.contains('ptag'))return;x.style.display=!st.p||x.dataset.p===st.p?'':'none'});
      panel.querySelectorAll('.ptag[data-p]').forEach(function(x){x.classList.toggle('on',x.dataset.p===st.p)});
      var vis=[].some.call(panel.querySelectorAll('.mw:not(.mwadd), .cdx'),function(c){return c.style.display!=='none'});
      var em=panel.querySelector('.tdempty');
      if(!vis&&!em){em=document.createElement('p');em.className='tdempty';em.textContent='Rien sur ce projet pour ce filtre. Choisissez un autre projet ou ajoutez un widget.';f.after(em)}
      if(em)em.hidden=vis;
    }
    f.querySelectorAll('[data-fp]').forEach(function(c){c.addEventListener('click',function(){f.querySelectorAll('[data-fp]').forEach(function(x){x.classList.toggle('on',x===c)});st.p=c.dataset.fp;apply()})});
    f.querySelectorAll('.tdper a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();
      f.querySelectorAll('.tdper a').forEach(function(x){x.classList.toggle('on',x===a)});
      panel.querySelectorAll('b[data-per]').forEach(function(b){try{var v=JSON.parse(b.dataset.per)[a.dataset.per];if(v!=null)b.textContent=v}catch(_){}})})});
    var sel=f.querySelector('.tdty select');if(sel)sel.addEventListener('change',function(){st.ty=sel.value;apply()});
  });
  document.querySelectorAll('.mwx').forEach(function(b){b.addEventListener('click',function(){var c=b.closest('.mw');if(c)c.style.display='none'})});
  document.querySelectorAll('.mws span[data-sw]').forEach(function(s){s.addEventListener('click',function(){var i=s.closest('.mwadd').querySelector('input');i.value=s.dataset.sw;i.focus()})});
  document.querySelectorAll('.mwf').forEach(function(fm){var btn=fm.querySelector('button');if(btn)handled(btn);
    fm.addEventListener('submit',function(e){e.preventDefault();var i=fm.querySelector('input'),v=i.value.trim();if(!v){i.focus();return}
      var add=fm.closest('.mwadd'),c=document.createElement('article');c.className='mw new user';c.dataset.ps='';c.dataset.ty=v;
      c.innerHTML='<header><span class="mwg">Nouveau widget</span><h4></h4></header><p class="wfait">Widget demandé. Les premiers chiffres arrivent dans quelques minutes, tirés de ses livrables.</p><footer><span class="ptag">Ajouté par vous</span></footer>';
      c.querySelector('h4').textContent=v;add.before(c);i.value='';toast('Widget ajouté à votre tableau de bord')})});
})();

// v4.11 Drive (filtre par type) et Mail (lecture)
document.querySelectorAll('[data-dvc]').forEach(function(bar){var g=bar.nextElementSibling;
  bar.querySelectorAll('.chip').forEach(function(c){c.addEventListener('click',function(){bar.querySelectorAll('.chip').forEach(function(x){x.classList.toggle('on',x===c)});
    var v=c.dataset.dv;g.querySelectorAll('.dvf').forEach(function(f){f.style.display=!v||f.dataset.dt===v?'':'none'})})})});
document.querySelectorAll('.ml2').forEach(function(box){box.querySelectorAll('.mi').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();
  box.querySelectorAll('.mi').forEach(function(x){x.classList.toggle('on',x===a)});
  box.querySelectorAll('.mrd').forEach(function(r){r.classList.toggle('on',r.dataset.mr===a.dataset.mi)});
  if(innerWidth<=900){var r=box.querySelector('.mrd.on');if(r)r.scrollIntoView({behavior:'smooth',block:'nearest'})}})})});

// v4.12 Suivi admin : période
document.querySelectorAll('.an-per a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();
  a.parentNode.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)});toast('Chiffres : '+a.textContent.toLowerCase())})});

// v4.13 interrupteurs, paiement, fichiers
document.querySelectorAll('.swx').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var off=b.classList.toggle('off');toast(b.dataset.nom+(off?' : en pause':' : en service'))})});
document.querySelectorAll('.pyo').forEach(function(o){o.addEventListener('click',function(){var box=o.closest('section');box.querySelectorAll('.pyo').forEach(function(x){x.classList.toggle('on',x===o)});
  var dep=o.dataset.pay==='Dépôt ou virement';box.querySelector('[data-pd="dep"]').hidden=!dep;box.querySelector('[data-pd="mm"]').hidden=dep;
  var mm=box.querySelector('[data-pd="mm"] .xs');if(mm)mm.textContent=o.dataset.pay==='Carte bancaire'?'Numéro de carte':'Numéro mobile money'})});
document.querySelectorAll('.drop2 input').forEach(function(i){i.addEventListener('change',function(){if(i.files.length){i.parentNode.lastChild.textContent=' '+i.files[0].name;toast('Bordereau reçu, nous confirmons sous 24 h')}})});
document.querySelectorAll('.dll a,.dlm summary,.ms summary').forEach(function(a){handled(a)});

// v4.13 analytique de l'expert : filtre par format
document.querySelectorAll('.anfc').forEach(function(bar){var box=bar.parentNode;
  bar.querySelectorAll('.chip').forEach(function(c){c.addEventListener('click',function(){bar.querySelectorAll('.chip').forEach(function(x){x.classList.toggle('on',x===c)});
    var v=c.dataset.fmc;box.querySelectorAll('[data-fm]').forEach(function(r){r.style.display=!v||r.dataset.fm===v?'':'none'})})})});
document.querySelectorAll('.anr input').forEach(function(i){i.addEventListener('change',function(){toast('Période mise à jour')})});

// v4.13 profil de l'expert : segments, ton avec aperçu, prénom
document.querySelectorAll('.kv2 .seg a').forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();a.parentNode.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)});
  if(a.dataset.tn){var p=a.closest('.box').querySelector('.pfap p');if(p)p.textContent=p.dataset[a.dataset.tn]}})});
document.querySelectorAll('.pfsave').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var v=b.parentNode.querySelector('.pfn').value.trim()||'Djénéba';toast('Elle s’appelle désormais '+v)})});

// v4.14 tableaux de bord : masquer un bloc dans les partages, expiration au choix
document.querySelectorAll('.mwh').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var c=b.closest('.mw');var h=c.classList.toggle('hid');
  b.setAttribute('aria-label',h?'Afficher ce bloc dans les partages':'Masquer ce bloc dans les partages');toast(h?'Bloc masqué dans les partages':'Bloc visible dans les partages')})});
document.querySelectorAll('.shexp').forEach(function(s){s.addEventListener('change',function(){var d=s.parentNode.querySelector('.shdt');if(d)d.hidden=s.value!=='d'})});
document.querySelectorAll('.shdt').forEach(function(d){d.addEventListener('change',function(){if(d.value>d.max){d.value=d.max;toast('90 jours au maximum')}})});
document.querySelectorAll('[data-shk]').forEach(function(a){a.addEventListener('click',function(){var h_=a.closest('.tbh,.tbh2'),n=h_&&h_.querySelector('h2,b');var p=document.querySelector('#share .shpn>p');if(n&&p)p.textContent=n.textContent+', semaine du 28 septembre'})});

// v4.15 indicateurs qui suivent le filtre (poste, projet, zone), lignes cliquables, duplication
(function(){
  document.querySelectorAll('.panel').forEach(function(panel){
    var f=panel.querySelector('.tdf');if(!f)return;
    function upd(p){panel.querySelectorAll('[data-kv]').forEach(function(el){try{var o=JSON.parse(el.dataset.kv);el.textContent=(p in o)?o[p]:o['']}catch(_){}});
      panel.querySelectorAll('[data-kw]').forEach(function(el){try{var o=JSON.parse(el.dataset.kw);el.style.width=(p in o)?o[p]:o['']}catch(_){}});
      panel.querySelectorAll('.mw').forEach(function(c){if(c.querySelector('.kks'))c.style.display=''});}
    f.querySelectorAll('[data-fp]').forEach(function(c){c.addEventListener('click',function(){upd(c.dataset.fp)})});
    panel.querySelectorAll('[data-pick]').forEach(function(r){r.addEventListener('click',function(){var c=f.querySelector('[data-fp="'+r.dataset.pick+'"]');if(c){c.click();f.scrollIntoView({behavior:'smooth',block:'start'})}})});
  });
  document.querySelectorAll('[data-dup]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();toast('Copie créée : « '+a.dataset.dup+' (copie) », dans Mes tableaux, à adapter avant de la partager')})});
})();

// v4.16 bascule Mes tableaux / Partagés avec moi, mode édition, recherche, tableau préréglé
(function(){
  var w=document.querySelector('.tbwrap');
  if(w){w.querySelectorAll('.tbsw button').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();
    w.querySelectorAll('.tbsw button').forEach(function(x){x.classList.toggle('on',x===b)});w.classList.toggle('shm',b.dataset.sw==='shared');
    var first=w.querySelector('.tbs3 a[data-g="'+b.dataset.sw+'"]');if(first)first.click()})});
    var h=location.hash.slice(1);var a=h&&w.querySelector('.tbs3 a[data-t="'+h+'"]');if(a&&a.dataset.g==='shared'){w.classList.add('shm');w.querySelectorAll('.tbsw button').forEach(function(x){x.classList.toggle('on',x.dataset.sw==='shared')})}}
  document.querySelectorAll('.tbed').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var p=b.closest('.panel');var on=p.classList.toggle('editing');b.classList.toggle('on',on);
    b.querySelector('span').textContent=on?'Enregistrer':'Modifier';if(on)toast('Mode édition : modifiez, masquez ou retirez les blocs')})});
  document.querySelectorAll('.tdq input').forEach(function(i){i.addEventListener('input',function(){var q=i.value.trim().toLowerCase();var p=i.closest('.panel');
    p.querySelectorAll('.mw:not(.mwadd)').forEach(function(c){c.style.display=!q||c.textContent.toLowerCase().indexOf(q)>=0?'':'none'})})});
  document.querySelectorAll('.tddt input').forEach(function(i){i.addEventListener('change',function(){toast('Période mise à jour')})});
  document.querySelectorAll('.panel[data-preset]').forEach(function(p){var c=p.querySelector('[data-fp="'+p.dataset.preset+'"]');if(c)c.click()});
})();

// v4.17 affichage : thème (lien vers l'autre habillage) et apparence (clair, sombre, automatique)
(function(){
  function get(){try{return localStorage.getItem('yap')||'clair'}catch(e){return 'clair'}}
  function apply(a){var dark=a==='sombre'||(a==='auto'&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches);
    if(dark)document.documentElement.setAttribute('data-mode','nuit');else document.documentElement.removeAttribute('data-mode');
    document.querySelectorAll('.apseg a').forEach(function(x){x.classList.toggle('on',x.dataset.ap===a)})}
  apply(get());
  document.querySelectorAll('.apseg a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
    try{localStorage.setItem('yap',a.dataset.ap)}catch(_){}apply(a.dataset.ap);
    toast(a.dataset.ap==='sombre'?'Apparence sombre':a.dataset.ap==='auto'?'Apparence automatique':'Apparence claire')})});
  if(window.matchMedia)try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){if(get()==='auto')apply('auto')})}catch(_){}
  document.querySelectorAll('.mdx').forEach(function(a){handled(a);if(a.classList.contains('on'))a.addEventListener('click',function(e){e.preventDefault();toast('Thème déjà actif')})});
})();

// filtre des experts par métier (cartes .pc2)
document.querySelectorAll('[data-filter]').forEach(function(bar){
  var chips=bar.querySelectorAll('.chip[data-f]'),cards=document.querySelectorAll('.pc2[data-m]');if(!cards.length)return;
  chips.forEach(function(c){c.addEventListener('click',function(){var f=c.dataset.f;
    cards.forEach(function(k){k.style.display=(f==='tous'||k.dataset.m===f)?'':'none'});
    document.querySelectorAll('.pc2[data-m]').forEach(function(){});
    var sec=document.querySelectorAll('.rsec');sec.forEach(function(s){var vis=[].some.call(s.querySelectorAll('.pc2[data-m]'),function(k){return k.style.display!=='none'});s.style.display=vis||!s.querySelector('.pc2[data-m]')?'':'none'})})})});

// recherches génériques : [data-flt] filtre les éléments de son bloc
function txt(n){return (n.textContent||'').toLowerCase()}
document.querySelectorAll('input[data-flt]').forEach(function(i){
  var scope=i.closest('.panel,.pn,.gside,.box,section,main')||document;
  i.addEventListener('input',function(){scope.dispatchEvent(new CustomEvent('flt'))});
});

// Drive : type + date + texte
document.querySelectorAll('[data-dvc]').forEach(function(bar){var g=bar.nextElementSibling;while(g&&!g.querySelector('.dvf'))g=g.nextElementSibling;if(!g)return;
  var st={t:'',a:'',q:''},em=g.parentNode.querySelector('.dvempty');
  function run(){var n=0;g.querySelectorAll('.dvf').forEach(function(f){var ok=(!st.t||f.dataset.dt===st.t)&&(!st.a||f.dataset.age===st.a||(st.a==='mois'&&f.dataset.age==='sem'))&&(!st.q||txt(f).indexOf(st.q)>-1);f.style.display=ok?'':'none';if(ok)n++});if(em)em.hidden=n>0}
  bar.querySelectorAll('.chip[data-dv]').forEach(function(c){c.addEventListener('click',function(){st.t=c.dataset.dv;bar.querySelectorAll('.chip').forEach(function(x){x.classList.toggle('on',x===c)});run()})});
  var s=bar.querySelector('select.dvage');if(s)s.addEventListener('change',function(){st.a=s.value;run()});
  var q=bar.querySelector('input[data-flt]');if(q)q.addEventListener('input',function(){st.q=q.value.trim().toLowerCase();run()});
});

// Mail : dossiers + recherche
document.querySelectorAll('.mlbar').forEach(function(bar){var box=bar.nextElementSibling;if(!box)return;var lst=box.querySelector('.mlst');if(!lst)return;
  var st={b:'',q:''},em=lst.querySelector('.mlempty');
  function run(){var n=0;lst.querySelectorAll('.mi').forEach(function(m){var ok=(!st.b||m.dataset.box===st.b)&&(!st.q||txt(m).indexOf(st.q)>-1);m.style.display=ok?'':'none';if(ok)n++});if(em)em.hidden=n>0}
  bar.querySelectorAll('.mlbox a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();st.b=a.dataset.box;bar.querySelectorAll('.mlbox a').forEach(function(x){x.classList.toggle('on',x===a)});run()})});
  var q=bar.querySelector('input[data-flt]');if(q)q.addEventListener('input',function(){st.q=q.value.trim().toLowerCase();run()});
});
// Écrire / Répondre : l'objet se remplit
document.querySelectorAll('[data-open="mcomp"]').forEach(function(b){b.addEventListener('click',function(){var m=document.getElementById('mcomp');if(!m)return;var s=m.querySelector('.mcsub');if(s)s.value=b.dataset.re||'';var h=m.querySelector('h2');if(h)h.textContent=b.dataset.re?(b.dataset.re.indexOf('Tr')===0?'Transférer':'Répondre'):'Nouvel email'})});
document.querySelectorAll('#mcomp form, #mcomp .mcsend').forEach(function(f){});

// Livrables : période + format + texte
document.querySelectorAll('.lvper').forEach(function(seg){var bar=seg.parentNode,list=bar.nextElementSibling;while(list&&!list.querySelector('.lv2'))list=list.nextElementSibling;if(!list)return;
  var st={p:'',f:'',q:''},em=list.querySelector('.lvempty');if(!em){em=document.createElement('p');em.className='lvempty';em.textContent='Aucun livrable pour ce filtre.';em.hidden=true;list.appendChild(em)}
  var rank={sem:1,mois:2,tri:3};
  function run(){var n=0;list.querySelectorAll('.lv2').forEach(function(l){var ok=(!st.p||(rank[l.dataset.per]||9)<=rank[st.p])&&(!st.f||(' '+(l.dataset.fm||'')+' ').indexOf(' '+st.f+' ')>-1||(l.dataset.fm||'').indexOf(st.f)>-1)&&(!st.q||txt(l).indexOf(st.q)>-1);l.style.display=ok?'':'none';if(ok)n++});em.hidden=n>0}
  seg.querySelectorAll('a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();st.p=a.dataset.per;seg.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)});run()})});
  var s=bar.querySelector('select.lvfm');if(s)s.addEventListener('change',function(){st.f=s.value;run()});
  var q=bar.querySelector('input[data-flt]');if(q)q.addEventListener('input',function(){st.q=q.value.trim().toLowerCase();run()});
});

// Activité complète, conversations, chat entreprise : recherche simple
document.querySelectorAll('.pn input[data-flt], .gside input[data-flt]').forEach(function(i){var sc=i.closest('.pn,.gside');
  i.addEventListener('input',function(){var q=i.value.trim().toLowerCase();
    sc.querySelectorAll('.actall li, .gfils a, .gside a.gf, .gside [data-fil]:not(.gnew)').forEach(function(li){li.style.display=!q||txt(li).indexOf(q)>-1?'':'none'});
    sc.querySelectorAll('.acth').forEach(function(h){var ul=h.nextElementSibling;if(!ul)return;var v=[].some.call(ul.querySelectorAll('li'),function(li){return li.style.display!=='none'});h.style.display=v?'':'none';ul.style.display=v?'':'none'})})});

// Voix : filtre féminine / masculine
document.querySelectorAll('.vxf').forEach(function(seg){var list=seg.nextElementSibling;
  seg.querySelectorAll('a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();seg.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)});
    list.querySelectorAll('.vx').forEach(function(v){v.style.display=!a.dataset.vg||v.dataset.g===a.dataset.vg?'':'none'})})})});

// Aperçu de la façon de répondre
document.querySelectorAll('.pfrep').forEach(function(box){var out=box.querySelector('.pfapx');if(!out)return;
  function v(k){var a=box.querySelector('[data-pk="'+k+'"] a.on');return a?a.dataset.v:''}
  function build(){var tu=v('ton')==='t',len=v('len'),sty=v('sty'),reg=v('reg'),emo=+v('emo')||0;
    var hi=reg==='c'?(tu?'Coucou Aïcha,':'Bonjour Aïcha, j’espère que vous allez bien.'):reg==='d'?'Aïcha,':(tu?'Bonjour Aïcha,':'Bonjour Aïcha,');
    var a=tu?'Les visuels de la promo Sossa sont prêts, tu peux les valider ?':'Les visuels de la promo Sossa sont prêts, pouvez-vous les valider ?';
    var pts=['3 visuels, prix en grand','Publication prévue demain 9 h','Version print envoyée à Yao'];
    var body;
    if(sty==='p')body=(len==='c'?pts.slice(0,1):len==='d'?pts.concat(['Budget sponsorisé : 150 000 F sur 5 jours']):pts).map(function(x){return '• '+x}).join('\n');
    else if(sty==='t')body='Visuel | Format | État\nPost Facebook | Carré | Prêt\nStory Instagram | 9:16 | Prêt'+(len==='c'?'':'\nAffiche print | A3 | Chez Yao');
    else body=len==='c'?'Tout est prêt de mon côté.':len==='d'?'J’ai repris vos remarques : le prix est passé en grand et le logo Sossa remonte en haut. La publication est prévue demain à 9 h, et la version print part chez Yao dès votre accord. Si vous préférez une autre date, je décale la campagne.':'Le prix est passé en grand comme demandé. Dès votre accord, je publie et j’envoie la version print à Yao.';
    var e=emo===2?' 🎉':emo===1?' 🙂':'';
    out.textContent=hi+'\n'+a+e+'\n'+body+'\n'+(reg==='d'?'Fatima':tu?'Merci !'+(emo===2?' 🙏':''):'Bien à vous, Fatima')}
  box.querySelectorAll('[data-pk] a').forEach(function(a){a.addEventListener('click',function(){setTimeout(build,0)})});build()});

// Invitation : service « Autre », experts choisis, envoi
document.querySelectorAll('select.isv').forEach(function(s){var o=s.parentNode.querySelector('.isvo');s.addEventListener('change',function(){if(o){o.hidden=s.value!=='autre';if(!o.hidden)o.focus()}})});
document.querySelectorAll('details.msx').forEach(function(d){var v=d.querySelector('.msv');
  function upd(){var n=[].map.call(d.querySelectorAll('.msl input:checked'),function(i){return i.parentNode.childNodes[2]?i.parentNode.childNodes[2].textContent.trim():''}).filter(Boolean);
    v.innerHTML='';if(!n.length){var e=document.createElement('span');e.className='mute3';e.textContent='Choisir ses experts';v.appendChild(e)}else n.forEach(function(x){var e=document.createElement('em');e.textContent=x;v.appendChild(e)})}
  d.querySelectorAll('.msl input').forEach(function(i){i.addEventListener('change',upd)});upd()});
document.addEventListener('click',function(e){document.querySelectorAll('details.ms[open]').forEach(function(d){if(!d.contains(e.target))d.removeAttribute('open')})});

// Étiquettes (marques)
document.querySelectorAll('.tagin').forEach(function(t){
  function bind(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();b.parentNode.remove()})}
  t.querySelectorAll('button').forEach(bind);
  var i=t.querySelector('input');if(i)i.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===','){e.preventDefault();var v=i.value.trim();if(!v)return;
    var s=document.createElement('span');s.textContent=v;var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Retirer');b.textContent='×';s.appendChild(b);t.insertBefore(s,i);bind(b);i.value=''}});
  t.addEventListener('click',function(e){if(e.target===t&&i)i.focus()})});

// Accueil du nouveau membre : étape 1 puis 2
document.querySelectorAll('form[data-onb]').forEach(function(f){var b=f.querySelector('button[type=submit]');if(b)handled(b);
  f.addEventListener('submit',function(e){e.preventDefault();var st=f.closest('.aust');st.hidden=true;var nx=st.parentNode.querySelector('.aust[data-st="2"]');if(nx){nx.hidden=false;nx.scrollIntoView({block:'start'})}})});

// v4.17 tableaux : recherche, modification, ajout par la demande, glisser-déposer, export, droits
(function(){
  var rail=document.querySelector('.tbrail');
  if(rail){var q=rail.querySelector('.tbq input'),none=rail.querySelector('.tbnone');
    q.addEventListener('input',function(){var v=q.value.trim().toLowerCase(),n=0;rail.querySelectorAll('.tbli a').forEach(function(a){var ok=!v||a.textContent.toLowerCase().indexOf(v)>-1;a.style.display=ok?'':'none';if(ok)n++});if(none)none.hidden=n>0});
    rail.querySelectorAll('.tbli a').forEach(function(a){a.addEventListener('click',function(){var d=a.querySelector('.nw');if(d)d.remove();if(innerWidth<900){var m=document.querySelector('.tbmain');if(m)m.scrollIntoView({behavior:'smooth',block:'start'})}})});}
  function stopEdit(p){p.classList.remove('editing');p.querySelectorAll('.mw').forEach(function(c){c.removeAttribute('draggable')})}
  document.querySelectorAll('.tbed').forEach(function(b){b.addEventListener('click',function(){var p=b.closest('.panel');setTimeout(function(){
    if(p.classList.contains('editing')){p.querySelectorAll('.mwg2>.mw').forEach(function(c){c.setAttribute('draggable','true')});var t=p.querySelector('.tbask textarea');if(t)t.focus({preventScroll:true})}},0)})});
  document.querySelectorAll('.tbdone').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var p=b.closest('.panel');stopEdit(p);var ed=p.querySelector('.tbed');if(ed){ed.classList.remove('on');var s=ed.querySelector('span');if(s)s.textContent='Modifier'}toast('Tableau enregistré')})});
  document.querySelectorAll('.tbedit .mws span[data-sw]').forEach(function(s){s.addEventListener('click',function(){var t=s.closest('.tbedit').querySelector('textarea');t.value=s.dataset.sw;t.focus()})});
  document.querySelectorAll('form.tbask').forEach(function(f){var btn=f.querySelector('button');if(btn)handled(btn);
    f.addEventListener('submit',function(e){e.preventDefault();var t=f.querySelector('textarea'),v=t.value.trim();if(!v){t.focus();return}
      var ed=f.closest('.tbedit'),fm=ed.querySelector('.fmts input:checked'),fmt=fm?fm.parentNode.textContent.trim():'Chiffres clés';
      var p=f.closest('.panel'),g=p.querySelector('.mwg2'),who=f.querySelector('img').getAttribute('src'),c=document.createElement('article');
      c.className='mw new user';c.dataset.ps='';c.setAttribute('draggable','true');
      c.innerHTML='<header><h4></h4></header><div class="wfait"><img alt=""><p></p></div><footer><span class="ptag"></span></footer>';
      c.querySelector('h4').textContent=v.charAt(0).toUpperCase()+v.slice(1);c.querySelector('.wfait img').src=who;
      c.querySelector('.wfait p').textContent='En préparation. Les premiers chiffres arrivent dans quelques minutes, tirés de son travail. Format : '+fmt+'.';
      c.querySelector('.ptag').textContent='Demandé par vous';g.prepend(c);t.value='';toast('Bloc demandé, il arrive en haut du tableau');c.scrollIntoView({behavior:'smooth',block:'center'})})});
  // glisser-déposer des blocs en mode modification
  var dragEl=null;
  document.querySelectorAll('.tbmain .mwg2').forEach(function(g){
    g.addEventListener('dragstart',function(e){var c=e.target.closest('.mw');if(!c||!c.closest('.editing'))return;dragEl=c;c.classList.add('drag');try{e.dataTransfer.setData('text/plain','')}catch(_){}});
    g.addEventListener('dragend',function(){if(dragEl)dragEl.classList.remove('drag');dragEl=null});
    g.addEventListener('dragover',function(e){if(!dragEl)return;e.preventDefault();var o=e.target.closest('.mw');if(!o||o===dragEl||o.parentNode!==g)return;var r=o.getBoundingClientRect();var after=(e.clientY-r.top)>r.height/2;o.parentNode.insertBefore(dragEl,after?o.nextSibling:o)});
    g.addEventListener('drop',function(e){if(dragEl){e.preventDefault();toast('Bloc déplacé')}})});
  // menu Télécharger : se ferme après le choix
  document.querySelectorAll('.dlml a').forEach(function(a){a.addEventListener('click',function(){var d=a.closest('details');setTimeout(function(){d.removeAttribute('open')},0)})});
  // droits lecture / édition
  document.querySelectorAll('.shr2').forEach(function(s){s.querySelectorAll('a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();s.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)});toast(a.dataset.v==='e'?'Peut modifier':'Lecture seule')})})});
})();

// v4.17.2 menu des tableaux
(function(){var b=document.querySelector('.tbswitch'),w=document.querySelector('.tbx');if(!b||!w)return;handled(b);
  function set(o){w.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');if(o){var q=w.querySelector('.tbq input');if(q)q.focus({preventScroll:true})}}
  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();set(!w.classList.contains('open'))});
  document.addEventListener('click',function(e){if(w.classList.contains('open')&&!e.target.closest('.tbrail')&&!e.target.closest('.tbswitch'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
  w.querySelectorAll('.tbli a').forEach(function(a){a.addEventListener('click',function(){setTimeout(function(){set(false);window.scrollTo({top:0,behavior:'smooth'})},0)})});
  w.querySelectorAll('.tbnewb').forEach(function(a){a.addEventListener('click',function(){set(false)})});
})();

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
// v4.19 micro, listes avec Autre, liens ajoutés, aperçu d'invitation, cartes de canaux, période en un seul sélecteur
(function(){
  // ---------- dictée au micro (simulée)
  var PH=['Ajoute un bloc avec les vues par réseau social, semaine par semaine','Résume les blocages de la semaine en trois lignes','Compare septembre et août sur les publications'];
  document.querySelectorAll('.tbmic').forEach(function(b,n){handled(b);b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
    var box=b.closest('.tbcmp,.tamic,form')||b.parentNode,t=box.querySelector('textarea,input[type=text]');
    if(b.classList.contains('rec'))return;b.classList.add('rec');b.setAttribute('aria-label','Écoute en cours');toast('Je vous écoute…');
    setTimeout(function(){b.classList.remove('rec');b.setAttribute('aria-label','Dicter à la voix');if(t){t.value=(t.value?t.value+' ':'')+PH[n%PH.length];t.dispatchEvent(new Event('input',{bubbles:true}));t.focus()}toast('Texte dicté ajouté')},1800)})});

  // ---------- listes déroulantes : « Autre » ouvre un champ libre
  document.querySelectorAll('select').forEach(function(s){
    if(s.classList.contains('isv')||![].some.call(s.options,function(o){return o.value==='autre'||o.text==='Autre'}))return;
    var f=document.createElement('input');f.className='fi selx';f.placeholder='Précisez';f.hidden=true;f.style.marginTop='6px';s.after(f);
    s.addEventListener('change',function(){var o=s.options[s.selectedIndex];var on=o&&(o.value==='autre'||o.text==='Autre');f.hidden=!on;if(on)f.focus()})});

  // ---------- ajouter un lien : une vraie ligne
  document.querySelectorAll('.rsg a.link').forEach(function(a){if(!/Ajouter un lien/.test(a.textContent))return;handled(a);a.removeAttribute('data-toast');
    a.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();
      var l=document.createElement('label');l.className='rsx new';
      l.innerHTML='<svg class="i s" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg><input class="fi" placeholder="Nom du lien" style="max-width:150px"><input class="fi" type="url" placeholder="https://">';
      a.before(l);l.querySelector('input').focus()},true)});

  // ---------- aperçu de l'invitation : onglets Email, Telegram
  document.querySelectorAll('.ivs a[data-iv]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();var p=a.closest('.pn');
    p.querySelectorAll('.ivs a').forEach(function(x){x.classList.toggle('on',x===a)});p.querySelectorAll('.ivm').forEach(function(m){m.classList.toggle('on',m.dataset.iv===a.dataset.iv)})})});
  document.querySelectorAll('[data-open="invprev"]').forEach(function(a){handled(a)});

  // ---------- cartes de canaux sélectionnables
  document.querySelectorAll('label.chc input').forEach(function(i){i.addEventListener('change',function(){
    document.querySelectorAll('label.chc input[name="'+i.name+'"]').forEach(function(x){x.closest('.chc').classList.toggle('off',!x.checked)})})});

  // ---------- période : un seul bouton, préréglages et deux mois
  var MO=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],MC=['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
  var TD=new Date(2026,9,1);
  function P(v){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v||'');return m?new Date(+m[1],+m[2]-1,+m[3]):null}
  function I(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
  function L(d){return (d.getDate()===1?'1er':d.getDate())+' '+MC[d.getMonth()]}
  function same(a,b){return a&&b&&a.getTime()===b.getTime()}
  function add(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x}
  var PRE=[['7 derniers jours',function(){return [add(TD,-6),TD]}],['30 derniers jours',function(){return [add(TD,-29),TD]}],
    ['Ce mois-ci',function(){return [new Date(2026,9,1),TD]}],['Mois dernier',function(){return [new Date(2026,8,1),new Date(2026,8,30)]}],
    ['Ce trimestre',function(){return [new Date(2026,9,1),TD]}],['Trimestre dernier',function(){return [new Date(2026,6,1),new Date(2026,8,30)]}],
    ['Ce semestre',function(){return [new Date(2026,6,1),TD]}],['Cette année',function(){return [new Date(2026,0,1),TD]}]];
  var rg=document.createElement('div');rg.className='rgc';rg.setAttribute('role','dialog');rg.setAttribute('aria-label','Choisir une période');document.body.appendChild(rg);
  var cur=null,s=null,en=null,view=null;
  function month(y,m){var f=new Date(y,m,1),off=(f.getDay()+6)%7,n=new Date(y,m+1,0).getDate(),h='<div class="mo"><div class="dph"><b>'+MO[m]+' '+y+'</b></div><div class="dpg"><i>L</i><i>M</i><i>M</i><i>J</i><i>V</i><i>S</i><i>D</i>';
    for(var k=0;k<off;k++)h+='<span></span>';
    for(var d=1;d<=n;d++){var x=new Date(y,m,d),c=[];if(same(x,s))c.push('s');if(same(x,en)||(same(x,s)&&!en))c.push('e');if(s&&en&&x>s&&x<en)c.push('in');if(same(x,TD))c.push('td');
      h+='<button type="button" data-d="'+I(x)+'" class="'+c.join(' ')+'"'+(x>TD?' disabled':'')+'>'+d+'</button>'}
    return h+'</div></div>'}
  function draw(){var a=view,b=new Date(a.getFullYear(),a.getMonth()+1,1);
    rg.innerHTML='<div class="rgp">'+PRE.map(function(p,n){var r=p[1]();return '<a data-pr="'+n+'"'+(same(r[0],s)&&same(r[1],en)?' class="on"':'')+'>'+p[0]+'</a>'}).join('')+'</div>'+
      '<div class="rgw"><div class="rgm">'+month(a.getFullYear(),a.getMonth())+month(b.getFullYear(),b.getMonth())+'</div>'+
      '<div class="rgn"><button type="button" class="ib rgv" data-v="-1" aria-label="Mois précédent">‹</button><button type="button" class="ib rgv" data-v="1" aria-label="Mois suivant">›</button></div></div>'+
      '<div class="rgf"><span class="rgl">'+(s?L(s)+(en?' au '+L(en):' au …'):'Choisissez le début')+'</span><span class="row" style="gap:8px"><button type="button" class="btn o sm" data-rg="no">Annuler</button><button type="button" class="btn p sm" data-rg="ok"'+(s&&en?'':' disabled')+'>Appliquer</button></span></div>'}
  function place(el){if(innerWidth<=760){rg.style.left='';rg.style.top='';return}var r=el.getBoundingClientRect(),w=rg.offsetWidth||720,h=rg.offsetHeight||400;
    rg.style.left=Math.max(12,Math.min(r.left,innerWidth-w-12))+'px';rg.style.top=(r.bottom+h+12<innerHeight?r.bottom+8:Math.max(12,r.top-h-8))+'px'}
  function close(){rg.classList.remove('on');cur=null}
  function open(o){cur=o;s=P(o.a.value);en=P(o.b.value);view=new Date((s||TD).getFullYear(),(s||TD).getMonth(),1);
    if(view.getFullYear()===TD.getFullYear()&&view.getMonth()===TD.getMonth())view=new Date(view.getFullYear(),view.getMonth()-1,1);
    draw();rg.classList.add('on');place(o.btn)}
  rg.addEventListener('click',function(e){e.stopPropagation();var t=e.target.closest('button,a');if(!t)return;e.preventDefault();
    if(t.dataset.d){var d=P(t.dataset.d);if(!s||en||d<s){s=d;en=null}else en=d;draw();return}
    if(t.dataset.pr){var r=PRE[+t.dataset.pr][1]();s=r[0];en=r[1];view=new Date(s.getFullYear(),s.getMonth(),1);if(en.getMonth()!==s.getMonth()||en.getFullYear()!==s.getFullYear())view=new Date(en.getFullYear(),en.getMonth()-1,1);draw();return}
    if(t.dataset.v){view=new Date(view.getFullYear(),view.getMonth()+(+t.dataset.v),1);draw();return}
    if(t.dataset.rg==='no'){close();return}
    if(t.dataset.rg==='ok'&&s&&en){var o=cur;o.a.value=I(s);o.b.value=I(en);[o.a,o.b].forEach(function(i){var k=i.nextElementSibling;if(k&&k.classList.contains('dpk')){var sp=k.querySelector('span');if(sp)sp.textContent=L(P(i.value))}});
      o.btn.querySelector('span').textContent=L(s)+' au '+L(en);o.b.dispatchEvent(new Event('change',{bubbles:true}));close()}});
  document.addEventListener('click',function(e){if(cur&&!e.target.closest('.rgc,.rngb'))close()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&cur)close()});
  window.addEventListener('resize',function(){if(cur)place(cur.btn)});
  document.querySelectorAll('.anr').forEach(function(l){var ins=l.querySelectorAll('input[type=date]');if(ins.length!==2)return;
    var o={a:ins[0],b:ins[1]};l.classList.add('rng');var b=document.createElement('button');b.type='button';b.className='rngb';handled(b);
    b.innerHTML='<span>'+L(P(o.a.value)||TD)+' au '+L(P(o.b.value)||TD)+'</span><svg class="i s" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
    o.btn=b;l.appendChild(b);l.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(cur===o)close();else open(o)})});
})();
// modèles de tableaux : enregistrer, puis retrouver à la création
(function(){
  var cur=null,m=document.getElementById('savetpl');if(!m)return;
  document.querySelectorAll('[data-tpl]').forEach(function(a){handled(a);a.addEventListener('click',function(){cur=a;
    m.querySelector('.tpln').value=a.dataset.tpl;
    var p=a.closest('.panel'),n=p?p.querySelectorAll('.mwg2>*').length:0,f=p?[].map.call(p.querySelectorAll('.mwg2>.mw>header h4'),function(x){return x.textContent.trim()}).slice(0,4):[];
    m.querySelector('.tplbc').textContent=n+' blocs'+(f.length?' : '+f.join(', ')+(n>4?'…':''):'')})});
  var ok=m.querySelector('.tplok');handled(ok);ok.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();
    var nm=m.querySelector('.tpln').value.trim()||'Mon modèle',l=document.querySelector('#newtdb .tplv');
    if(l){var c=document.createElement('label');c.className='tpc new';var img=cur?document.querySelector('.tbh2 .tbby img'):null;
      c.innerHTML='<input type="radio" name="ntpl"><span class="tpi"><img src="../img/'+(cur?cur.dataset.tplk:'djeneba')+'.jpg" alt=""></span><span class="grow"><b></b><small>Vous, à l’instant</small></span>';
      c.querySelector('b').textContent=nm;l.prepend(c);bind(c)}
    m.classList.remove('on');toast('Modèle enregistré : il apparaît dans Nouveau tableau')});
  function bind(c){c.querySelector('input').addEventListener('change',function(){var n=document.querySelector('#newtdb .ntn input');if(!n)return;
    if(c.classList.contains('tpv')){n.value='';return}n.value=c.querySelector('b').textContent.replace(/^Modèle : /,'');toast('Modèle appliqué : blocs et formats repris')})}
  document.querySelectorAll('#newtdb .tpc').forEach(bind);
})();
// lien par défaut de chaque tableau
(function(){
  function slug(t){return (t||'tableau').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function url(el){var h=el&&el.closest('.tbh2,.tbh,.panel');h=h&&h.querySelector('h2');return 'yelema.ai/t/'+slug(h?h.textContent:'')}
  function copy(u,btn){try{navigator.clipboard&&navigator.clipboard.writeText('https://'+u)}catch(_){}
    toast('Lien copié : '+u);if(btn){btn.classList.add('ok');setTimeout(function(){btn.classList.remove('ok')},1600)}}
  document.querySelectorAll('[data-shk]').forEach(function(a){a.addEventListener('click',function(){var u=document.querySelector('#share .tblku');if(u)u.textContent=url(a)})});
  document.querySelectorAll('.tbcl').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();copy(url(b),null)},true)});
  var c=document.querySelector('#share .tblkc');if(c){handled(c);c.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();copy(document.querySelector('#share .tblku').textContent,c)},true)}
  var s=document.querySelector('#share .tblks'),d=document.querySelector('#share .tblkd'),pub=document.getElementById('sh-public');
  var T={org:'Les membres de l’entreprise l’ouvrent en lecture, après connexion.',perso:'Seules les personnes ajoutées ci-dessous l’ouvrent, avec leur droit.',public:'Toute personne qui a le lien l’ouvre en lecture, sans connexion.'};
  function upd(){if(!s)return;d.textContent=T[s.value];if(pub)pub.hidden=s.value!=='public';document.querySelectorAll('#share .sg').forEach(function(g){g.hidden=s.value!=='public'})}
  if(s){s.addEventListener('change',function(){upd();toast('Accès au lien mis à jour')});upd()}
})();
// création : partir d'un modèle ou de zéro
(function(){var g=document.querySelector('#newtdb .tpsg');if(!g)return;var box=document.querySelector('#newtdb .tpbox');
  g.querySelectorAll('a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();g.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)});
    var z=a.dataset.tps==='zero';box.hidden=z;if(z){box.querySelectorAll('input:checked').forEach(function(i){i.checked=false});var n=document.querySelector('#newtdb .ntn input');if(n)n.value=''}})})})();
// v4.23 lot 3 : notifications, attributions, états des experts, modèles, invitation, personnalisation, activité, aperçu, mot de passe
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  // ---------- notifications : Toutes, Non lues, À valider
  var seg=$('.hello + .seg');if(seg&&$('.nrow')){var tabs=$$('a',seg);var V=/accord|valider|relire|signer|approuv|attend/i;
    function cnt(){var n=$$('.nrow.unread').length,sub=$('.hello .sub');if(sub)sub.textContent=n?(n+(n>1?' non lues':' non lue')):'Tout est lu';$$('[data-pop="notifs"] .bdg').forEach(function(b){b.textContent=n;b.hidden=!n})}
    function apply(i){tabs.forEach(function(t,j){t.classList.toggle('on',j===i)});$$('.nrow').forEach(function(r){var ok=i===0||(i===1&&r.classList.contains('unread'))||(i===2&&V.test(r.textContent));r.hidden=!ok});
      $$('.ngrp').forEach(function(g){g.hidden=!$$('.nrow',g).some(function(r){return !r.hidden})});var e=$('.nempty');if(!e){e=document.createElement('p');e.className='nempty sm mute';seg.after(e)}
      e.hidden=$$('.nrow').some(function(r){return !r.hidden});e.textContent=i===2?'Rien à valider pour le moment.':'Aucune notification non lue.'}
    tabs.forEach(function(t,i){handled(t);t.style.cursor='pointer';t.addEventListener('click',function(e){e.preventDefault();apply(i)})});
    var all=$('.hello .btn');if(all){handled(all);all.removeAttribute('data-toast');all.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();$$('.nrow.unread').forEach(function(r){r.classList.remove('unread')});cnt();toast('Tout est marqué comme lu');var on=tabs.findIndex(function(t){return t.classList.contains('on')});apply(on<0?0:on)},true)}
    $$('.nrow').forEach(function(r){r.addEventListener('click',function(){r.classList.remove('unread')})});cnt()}
  // ---------- attribuer un connecteur : experts ou membres
  $$('.cxt a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();var p=a.closest('.pn');$$('.cxt a',p).forEach(function(x){x.classList.toggle('on',x===a)});$$('.cxl',p).forEach(function(l){l.classList.toggle('on',l.dataset.cx===a.dataset.cx)})})});
  // ---------- état d'un expert : en service, en pause, arrêté
  var XT={on:'est de nouveau en service',pa:'est en pause, rien n’est perdu',st:'est arrêté : plus facturé dès le mois suivant'};
  $$('[data-xst]').forEach(function(s){s.addEventListener('change',function(){var l=s.closest('.xst');l.className='xst '+s.value;toast(s.dataset.xst+' '+XT[s.value])})});
  // ---------- modèle par expert ou par membre : derrière un bouton Modifier
  $$('.mde').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var w=b.closest('.mdv'),s=$('.mds',w),n=$('.mdn',w);
    if(s.hidden){s.hidden=false;n.hidden=true;b.innerHTML='✓ Enregistrer';b.classList.add('p');s.focus()}else{n.textContent=s.options[s.selectedIndex].text;s.hidden=true;n.hidden=false;b.classList.remove('p');b.textContent='Modifier';toast('Modèle mis à jour : '+n.textContent)}})});
  // ---------- invitation : l'aperçu reprend le prénom, l'adresse et les experts choisis
  var inv=$('#inv');if(inv){$$('[data-open="invprev"]').forEach(function(a){a.addEventListener('click',function(){var fn=$('.g2i input',inv),em=$('input[type=email]',inv);
    $$('#invprev .ivfn').forEach(function(x){x.textContent=(fn&&fn.value.trim())||'Awa'});$$('#invprev .ivto').forEach(function(x){x.textContent=(em&&em.value.trim())||'awa.kone@unifood.info'});
    var ch=$$('.msl label',inv).filter(function(l){return $('input',l).checked}).map(function(l){return l.textContent.trim().split(/\s/)[0]});if(!ch.length)ch=['Djénéba'];
    $$('#invprev .ivx').forEach(function(x){x.hidden=ch.indexOf(x.dataset.ivx)<0})})})}
  // ---------- personnaliser : fonds, palette, prénom
  $$('.fnd').forEach(function(f){var lbl=f.closest('div').parentNode.querySelector('.fsl'),pzl=$('.pzl');
    function pick(b,c){$$('.fsw',f).forEach(function(x){x.classList.toggle('on',x===b)});if(lbl)lbl.textContent=b.dataset.fn||'Couleur au choix';if(pzl)pzl.style.setProperty('--pzbg',c||b.style.getPropertyValue('--c'))}
    $$('button.fsw',f).forEach(function(b){b.addEventListener('click',function(){pick(b)})});
    var cu=$('.fcu input',f);if(cu)cu.addEventListener('input',function(){var l=cu.parentNode;l.style.setProperty('--c',cu.value);pick(l,cu.value)});
    var au=$('.fauto',f);if(au){handled(au);au.addEventListener('click',function(e){e.preventDefault();var p=$$('.fsws',f)[0],bs=$$('button.fsw',p);var b=bs[Math.floor(Math.random()*bs.length)];pick(b);toast('Fond choisi d’après la palette de l’entreprise : '+b.dataset.fn)})}});
  var NOMS=['Aminata','Mariam','Fanta','Adjoa','Ramatou','Akissi','Salimata'],ni=0;
  $$('.pzsg').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var i=$('.pzni');if(i){i.value=NOMS[ni++%NOMS.length];i.focus();toast('Suggestion : '+i.value)}})});
  // ---------- activité : période et export CSV
  $$('.modal[id^="act-"] .pn').forEach(function(pn){var all=$('.actall',pn);if(!all)return;var nm=($('h2',pn)||{}).textContent||'Activité';
    var bar=document.createElement('div');bar.className='actbar';bar.innerHTML='<div class="seg actp"><a class="on" data-ap="all">Tout</a><a data-ap="0">Aujourd’hui</a><a data-ap="1">Cette semaine</a><a data-ap="2">Ce mois-ci</a></div><a class="btn o sm actcsv" href="#">Exporter en CSV</a>';
    all.before(bar);var hs=$$('.acth',all);
    $$('.actp a',bar).forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();$$('.actp a',bar).forEach(function(x){x.classList.toggle('on',x===a)});
      hs.forEach(function(h,i){var on=a.dataset.ap==='all'||(a.dataset.ap==='0'&&i===0)||(a.dataset.ap==='1'&&i<3)||a.dataset.ap==='2';h.hidden=!on;var u=h.nextElementSibling;if(u)u.hidden=!on})})});
    var c=$('.actcsv',bar);handled(c);c.addEventListener('click',function(e){e.preventDefault();var rows=[['Jour','Tâche','Heure ou état']];
      hs.forEach(function(h){var u=h.nextElementSibling;if(!u)return;$$('li',u).forEach(function(li){rows.push([h.textContent.trim(),($('.grow',li)||li).textContent.trim(),($('time',li)||{}).textContent||''])})});
      var csv=rows.map(function(r){return r.map(function(x){return '"'+String(x).replace(/"/g,'""')+'"'}).join(';')}).join('\n');
      try{var bl=new Blob(['﻿'+csv],{type:'text/csv'}),u=URL.createObjectURL(bl),d=document.createElement('a');d.href=u;d.download=nm.toLowerCase().replace(/[^a-zà-ÿ0-9]+/gi,'-')+'.csv';document.body.appendChild(d);d.click();d.remove()}catch(_){}
      toast('Export CSV téléchargé : '+(rows.length-1)+' tâches')})});
  // ---------- aperçu de la réponse : le bon expert, un exemple de son métier
  var EX={djeneba:['La note au comité est prête, vous pouvez la relire ?','2 décisions à prendre : budget Super Mint et date de la ligne','Rendez-vous Banque Atlantique confirmé jeudi 10 h','Le devis de la machine d’emballage reste bloqué'],
          fatima:['Les visuels de la promo Sossa sont prêts, vous pouvez les valider ?','3 visuels, prix en grand','Publication prévue demain 9 h','Version print envoyée à Yao'],
          koffi:['La v2 du packaging Super Mint est prête, vous la regardez ?','Logo remonté en haut, couleurs de la charte','3 déclinaisons : 50 g, 100 g, 200 g','Fichiers d’impression envoyés à Yao']};
  var k=(location.pathname.split('/').pop()||'').replace('.html','');
  $$('.pfrep').forEach(function(box){var out=$('.pfapx',box);if(!out||!EX[k])return;var nm=(($('.pfh h1')||{}).textContent||'').trim()||k;
    function v(x){var a=box.querySelector('[data-pk="'+x+'"] a.on');return a?a.dataset.v:''}
    function build(){var tu=v('ton')==='t',len=v('len'),sty=v('sty'),reg=v('reg'),emo=+v('emo')||0,ex=EX[k];
      var hi=reg==='c'?(tu?'Coucou Aïcha,':'Bonjour Aïcha, j’espère que vous allez bien.'):reg==='d'?'Aïcha,':'Bonjour Aïcha,';
      var a=tu?ex[0].replace('vous pouvez la relire','tu peux la relire').replace('vous pouvez les valider','tu peux les valider').replace('vous la regardez','tu la regardes'):ex[0];
      var pts=ex.slice(1),body;
      if(sty==='p')body=(len==='c'?pts.slice(0,1):pts).map(function(x){return '• '+x}).join('\n');
      else if(sty==='t')body='Point | État\n'+pts.slice(0,len==='c'?1:3).map(function(x){return x+' | fait'}).join('\n');
      else body=len==='c'?pts[0]+'.':pts.join('. ')+'.';
      var e=emo===2?' 🎉':emo===1?' 🙂':'';
      out.textContent=hi+'\n'+a+e+'\n'+body+'\n'+(reg==='d'?nm:tu?'Merci !'+(emo===2?' 🙏':''):'Bien à vous, '+nm)}
    $$('[data-pk] a',box).forEach(function(a){a.addEventListener('click',function(){setTimeout(build,10)})});setTimeout(build,20)});
  // ---------- connexion : mauvais mot de passe, puis blocage
  var lf=$('[data-login]');if(lf){var pw=$('input[type=password]',lf),em=$('input[type=email]',lf),err=$('.auerr'),tries=3,good=pw?pw.value:'';
    document.addEventListener('submit',function(e){if(e.target!==lf)return;var okEm=/@unifood\.info$/.test(em.value.trim());if(okEm&&pw.value===good)return;e.preventDefault();e.stopImmediatePropagation();
      tries--;err.hidden=false;pw.closest('.mdi').classList.add('bad');
      if(!okEm){$('.auet',err).innerHTML='<b>Aucun compte avec cette adresse.</b> Vérifiez-la, ou demandez une invitation à votre administrateur.';em.closest('.mdi').classList.add('bad');tries++;return}
      if(tries<=0){$('.auet',err).innerHTML='<b>Compte bloqué 15 minutes</b> après 3 essais. <a class="link" href="mot-de-passe.html">Réinitialiser mon mot de passe</a>';$('.auok',lf).disabled=true;return}
      $('.auet',err).innerHTML='<b>Mot de passe incorrect.</b> Il vous reste <b>'+tries+'</b> essai'+(tries>1?'s':'')+' avant un blocage de 15 minutes. <a class="link" href="mot-de-passe.html">Mot de passe oublié ?</a>';pw.select()},true);
    [pw,em].forEach(function(i){i&&i.addEventListener('input',function(){i.closest('.mdi').classList.remove('bad')})})}
  // ---------- mot de passe oublié : renvoi, règles, confirmation, lien expiré
  var re_=$('.mdre');if(re_){handled(re_);var cd=$('.mdcd'),t=0,tm;function tick(){if(t<=0){cd.textContent='';re_.classList.remove('off');clearInterval(tm);return}cd.textContent='possible dans '+t+' s';t--}
    re_.addEventListener('click',function(e){e.preventDefault();if(t>0)return;toast('Nouveau lien envoyé');re_.classList.add('off');t=30;tick();tm=setInterval(tick,1000)})}
  var rf=$('[data-reset]');if(rf){var p1=$('input[type=password]',rf),p2=$('.mdc2',rf),sv=$('.mdsave',rf),er=$('.mderr',rf),sb=$('.mdsb i',rf);
    function chk(){var v=p1.value,r={len:v.length>=8,maj:/[A-ZÀ-Ý]/.test(v),num:/\d/.test(v)},n=0;$$('.mdrl li',rf).forEach(function(li){var o=r[li.dataset.r];li.classList.toggle('ok',o);if(o)n++});
      sb.style.width=(n/3*100)+'%';sb.className=n<2?'lo':n<3?'mi':'hi';var same=p2.value===v;er.hidden=!p2.value||same;sv.disabled=!(n===3&&same&&p2.value)}
    [p1,p2].forEach(function(i){i.addEventListener('input',chk)});
    rf.addEventListener('submit',function(e){e.preventDefault();e.stopImmediatePropagation();if(sv.disabled)return;$$('.aust').forEach(function(s){s.hidden=s.dataset.st!=='4'})},true)}
  if(location.hash==='#expire'||location.hash==='#reset'){var st=location.hash==='#expire'?'5':'3';$$('.aust').forEach(function(s){s.hidden=s.dataset.st!==st})}
})();
// recruter à nouveau un expert déjà présent, pour un collègue
(function(){var m=document.getElementById('rcagm');if(!m)return;
  document.querySelectorAll('[data-rcag]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var k=b.dataset.rcag,c=b.closest('.pc2'),n=c?c.querySelector('.nm b').textContent:k;
    m.querySelector('.rct').textContent='Une autre '+n;m.dataset.n=n;m.querySelector('.rcimg').src='../img/'+k+'.jpg';m.classList.add('on')},true)});
  var g=m.querySelector('.rcgo');handled(g);g.addEventListener('click',function(e){e.preventDefault();m.classList.remove('on');toast(m.dataset.n+' recrutée pour '+m.querySelector('.rcwho').value+' : mise en service sous 24 h')})})();
// chat de l'expert : agrandir (replie la colonne de l'expert et le rail) puis réduire
(function(){var c=document.querySelector('#discussion .chat2');if(!c)return;
  var MX='<svg class="i s" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',
      MN='<svg class="i s" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>';
  var b=document.createElement('button');b.className='chwide';b.type='button';handled(b);c.appendChild(b);
  function set(on){document.body.classList.toggle('chat-wide',on);b.innerHTML=(on?MN:MX)+'<span>'+(on?'Réduire':'Agrandir')+'</span>';b.setAttribute('aria-label',on?'Réduire le chat':'Agrandir le chat');try{localStorage.setItem('chatWide',on?'1':'')}catch(e){}}
  var st='';try{st=localStorage.getItem('chatWide')||''}catch(e){}set(!!st);
  b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();set(!document.body.classList.contains('chat-wide'))});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&document.body.classList.contains('chat-wide')&&!document.querySelector('.modal.on'))set(false)});
  document.querySelectorAll('[data-t]').forEach(function(t){t.addEventListener('click',function(){if(t.dataset.t!=='discussion'&&document.body.classList.contains('chat-wide'))set(false)})});
})();
// voix : filtrée d'office sur le genre de la voix choisie, pour un bloc court
(function(){document.querySelectorAll('.vxs').forEach(function(v){var on=v.querySelector('.vx.on');if(!on)return;var box=v.parentElement,a=box.querySelector('.vxf a[data-vg="'+on.dataset.g+'"]');if(a)a.click();box.classList.add('vxbox')})})();
// état du premier jour, aussi par ?etat=vide
(function(){try{if(/[?&]etat=vide/.test(location.search))document.body.dataset.etat='vide'}catch(e){}})();
