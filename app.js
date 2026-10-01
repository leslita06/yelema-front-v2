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
document.querySelectorAll('[data-shk]').forEach(function(a){a.addEventListener('click',function(){var n=a.closest('.tbh').querySelector('b');var p=document.querySelector('#share .shpn>p');if(n&&p)p.textContent=n.textContent+', semaine du 28 septembre'})});

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
  document.querySelectorAll('[data-dup]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();toast('Copie créée : « Tableau de '+a.dataset.dup+' (copie) », à adapter avant de la partager')})});
})();
