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
// v4.28 : lien d'un tableau = <entreprise>.yelema.ai/<personne>/<tableau>
window.tbSlug=function(t){return (t||'tableau').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\(copie\)/,'copie').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')};
window.tbUrl=function(el){var p=el&&el.closest?el.closest('.panel'):null;var id=p?p.id.replace(/^tb-/,'').replace(/-copie$/,''):'';
  var own={adjoua:'fanta-bakayoko',kouassi:'kader-ouattara'}[id]||'aicha-diabate';var h=p&&p.querySelector('h2');
  return 'unifood.yelema.ai/'+own+'/'+window.tbSlug(h?h.textContent:'')};

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
    setInterval(function(){s[i].classList.remove('on');i=(i+1)%s.length;s[i].classList.add('on');if(v<96){v+=1+Math.round(Math.random()*2);if(bar)bar.style.width=v+'%';if(pc)pc.textContent=v+' %'}},3200)});

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
  function url(el){var h=el&&el.closest('.tbh2,.tbh,.panel');h=h&&h.querySelector('h2');return window.tbUrl(el)}
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
    var bar=document.createElement('div');bar.className='actbar';bar.innerHTML='<div class="seg actp"><a data-ap="0">Aujourd’hui</a><a class="on" data-ap="1">Cette semaine</a><a data-ap="2">Ce mois-ci</a></div><a class="actcsv" href="#" title="Exporter la période en CSV"><svg class="i s" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg><span>CSV</span></a>';
    all.before(bar);var hs=$$('.acth',all);
    $$('.actp a',bar).forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();$$('.actp a',bar).forEach(function(x){x.classList.toggle('on',x===a)});
      hs.forEach(function(h,i){var on=a.dataset.ap==='all'||(a.dataset.ap==='0'&&i===0)||(a.dataset.ap==='1'&&i<3)||a.dataset.ap==='2';h.hidden=!on;var u=h.nextElementSibling;if(u)u.hidden=!on})})});
    (function(){var d=$('.actp a.on',bar);hs.forEach(function(h,i){var on=i<3;h.hidden=!on;var u=h.nextElementSibling;if(u)u.hidden=!on})})();
    var c=$('.actcsv',bar);handled(c);c.addEventListener('click',function(e){e.preventDefault();var rows=[['Jour','Tâche','Heure ou état']];
      hs.forEach(function(h){var u=h.nextElementSibling;if(!u||h.hidden)return;$$('li',u).forEach(function(li){rows.push([h.textContent.trim(),($('.grow',li)||li).textContent.trim(),($('time',li)||{}).textContent||''])})});
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
// tableau de bord : niveau 1 = lien web + Google Slides + Enregistrer comme modèle ; niveau 2 = Modifier, Télécharger, Copier le lien, Partager
(function(){var ARW='<svg class="i s" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
  LNK='<svg class="i s" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
  function slug(t){return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\(copie\)/,'copie').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  document.querySelectorAll('.tbh2').forEach(function(h){var act=h.querySelector('.tbact');if(!act||h.nextElementSibling&&h.nextElementSibling.classList.contains('tblv1'))return;
    var t=(h.querySelector('h2')||{}).textContent||'tableau',u=window.tbUrl(h);
    var row=document.createElement('div');row.className='tblv1';
    row.innerHTML='<a class="tbweb" href="#" title="Ouvrir le lien web du tableau"><span class="tbwi">'+LNK+'</span><span class="tbwt"><b>Lien web</b><span class="ell">'+u+'</span></span><span class="tbwa">'+ARW+'</span></a>';
    var gs=act.querySelector('.gsb');if(gs)row.appendChild(gs);
    var sp=document.createElement('span');sp.className='tbsp';row.appendChild(sp);
    var tp=act.querySelector('.tbtpl');if(tp)row.appendChild(tp);
    h.after(row);
    var cl=act.querySelector('.tbcl');if(cl&&!cl.querySelector('span'))cl.insertAdjacentHTML('beforeend','<span>Copier le lien</span>');
    var w=row.querySelector('.tbweb');handled(w);w.addEventListener('click',function(e){e.preventDefault();toast('Lien web ouvert dans un nouvel onglet : '+u)})});
})();
// chat entreprise : agrandir / réduire, replie la liste des conversations
(function(){var cp=document.querySelector('.chatp');if(!cp)return;
  var MX='<svg class="i s" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',
      MN='<svg class="i s" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>';
  var bs=[];
  function set(on){cp.classList.toggle('cpwide',on);bs.forEach(function(b){b.innerHTML=(on?MN:MX)+'<span>'+(on?'Réduire':'Agrandir')+'</span>';b.setAttribute('aria-label',on?'Réduire la discussion':'Agrandir la discussion')});try{localStorage.setItem('cpWide',on?'1':'')}catch(e){}}
  cp.querySelectorAll('.cth .chd').forEach(function(h){var b=document.createElement('a');b.href='#';b.className='tbtn cpw';handled(b);h.appendChild(b);bs.push(b);
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();set(!cp.classList.contains('cpwide'))})});
  var st='';try{st=localStorage.getItem('cpWide')||''}catch(e){}set(!!st);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&cp.classList.contains('cpwide')&&!document.querySelector('.modal.on'))set(false)});
})();
// état d'un expert (admin) : pastille lisible + Modifier, puis choix et Enregistrer ; l'arrêt demande une confirmation
(function(){var TX={on:'En service',pa:'En pause',st:'Arrêté'},XT={on:'est de nouveau en service',pa:'est en pause, rien n’est perdu',st:'est arrêté : plus facturé dès le mois suivant'};
  document.querySelectorAll('label.xst').forEach(function(l){var s=l.querySelector('select[data-xst]');if(!s)return;var n=s.dataset.xst;
    var w=document.createElement('div');w.className='xsw';
    w.innerHTML='<span class="xsb '+s.value+'"><i></i><span>'+TX[s.value]+'</span></span><button type="button" class="xsm">Modifier</button>'+
      '<div class="xse" hidden><div class="xsc">'+['on','pa','st'].map(function(k){return '<a href="#" class="xso '+k+(k===s.value?' sel':'')+'" data-v="'+k+'"><i></i>'+TX[k]+'</a>'}).join('')+'</div>'+
      '<p class="xswarn" hidden>'+n+' sera arrêté : plus de travail, plus facturé dès le mois suivant.</p>'+
      '<div class="xsa"><button type="button" class="xsk">Annuler</button><button type="button" class="xsv">Enregistrer</button></div></div>';
    l.hidden=true;l.after(w);
    var b=w.querySelector('.xsb'),m=w.querySelector('.xsm'),e=w.querySelector('.xse'),v=w.querySelector('.xsv'),wr=w.querySelector('.xswarn'),cur=s.value;
    [m,v,w.querySelector('.xsk')].concat([].slice.call(w.querySelectorAll('.xso'))).forEach(handled);
    function pick(k){cur=k;w.querySelectorAll('.xso').forEach(function(o){o.classList.toggle('sel',o.dataset.v===k)});wr.hidden=k!=='st'||k===s.value;v.textContent=(k==='st'&&k!==s.value)?'Confirmer l’arrêt':'Enregistrer';v.classList.toggle('dng',k==='st'&&k!==s.value)}
    m.addEventListener('click',function(ev){ev.preventDefault();e.hidden=false;m.hidden=true;pick(s.value)});
    w.querySelectorAll('.xso').forEach(function(o){o.addEventListener('click',function(ev){ev.preventDefault();pick(o.dataset.v)})});
    w.querySelector('.xsk').addEventListener('click',function(ev){ev.preventDefault();e.hidden=true;m.hidden=false});
    v.addEventListener('click',function(ev){ev.preventDefault();e.hidden=true;m.hidden=false;if(cur===s.value){toast('Aucun changement pour '+n);return}
      s.value=cur;l.className='xst '+cur;b.className='xsb '+cur;b.querySelector('span').textContent=TX[cur];toast(n+' '+XT[cur])});
  });
})();
// fiche membre : photo, liens ajoutables et enregistrables
(function(){
  document.querySelectorAll('.mbph').forEach(function(b){handled(b);var f=document.createElement('input');f.type='file';f.accept='image/*';f.hidden=true;b.after(f);
    b.addEventListener('click',function(e){e.preventDefault();f.click()});
    f.addEventListener('change',function(){var x=f.files&&f.files[0];if(!x)return;var u=URL.createObjectURL(x);var box=b.closest('.box,.mbhd,section,div');var im=document.querySelector('.mbav img, .phd img, main img.av, main .pfh img')||(box&&box.querySelector('img'));
      document.querySelectorAll('img').forEach(function(i){if(im&&i.getAttribute('src')===im.getAttribute('src'))i.src=u});toast('Photo mise à jour : '+x.name)})});
  var LK='<svg class="i s" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
  document.querySelectorAll('.rsxadd').forEach(function(a0){var a=a0.cloneNode(true);a0.replaceWith(a);handled(a);var wrap=a.parentElement;
    var sv=document.createElement('div');sv.className='rsxsave';sv.hidden=true;sv.innerHTML='<span class="xs mute3">Liens modifiés</span><a class="btn o sm rsxno" href="#">Annuler</a><a class="btn p sm rsxok" href="#">Enregistrer les liens</a>';a.after(sv);
    var ok=sv.querySelector('.rsxok'),no=sv.querySelector('.rsxno');handled(ok);handled(no);
    var snap=function(){return [].map.call(wrap.querySelectorAll('.rsx input'),function(i){return i.value}).join('|')+wrap.querySelectorAll('.rsx').length},base=snap();
    function chk(){sv.hidden=snap()===base}
    wrap.addEventListener('input',chk);
    a.addEventListener('click',function(e){e.preventDefault();var l=document.createElement('label');l.className='rsx rsxn';l.innerHTML='<span class="rsxi">'+LK+'</span><input class="fi rsxname" type="text" placeholder="Nom du lien" aria-label="Nom du lien"><input class="fi" type="url" placeholder="https://" aria-label="Adresse du lien"><a href="#" class="rsxdel" aria-label="Retirer ce lien">×</a>';
      a.before(l);var d=l.querySelector('.rsxdel');handled(d);d.addEventListener('click',function(ev){ev.preventDefault();l.remove();chk()});l.querySelector('.rsxname').focus();chk()});
    no.addEventListener('click',function(e){e.preventDefault();wrap.querySelectorAll('.rsxn').forEach(function(x){x.remove()});base=snap();sv.hidden=true;toast('Modifications annulées')});
    ok.addEventListener('click',function(e){e.preventDefault();wrap.querySelectorAll('.rsxn').forEach(function(x){x.classList.remove('rsxn')});base=snap();sv.hidden=true;toast('Liens enregistrés')});
  });
})();

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

/* v4.29 : les boutons Télécharger téléchargent un vrai fichier (retour d'Andréa, 02/10) */
(function(){
  var RE=/t[ée]l[ée]charg/i;
  function nomPropre(n){return (n||'livrable').replace(/[\\/:*?"<>|]+/g,' ').replace(/\s+/g,' ').trim()}
  function envoyer(blob,nom){var u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=nom;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove()},1500)}
  function latin1(s){var b=new Uint8Array(s.length);for(var i=0;i<s.length;i++){var c=s.charCodeAt(i);b[i]=c===8217?39:(c<256?c:63)}return b}
  function pdfEsc(s){return s.replace(/[\\()]/g,'\\$&')}
  function pdf(titre){
    var lignes=[['F2',26,titre],['F1',13,'Livrable de votre expert Yelema'],['F1',11,'Fichier d’exemple du prototype. Dans l’application, c’est le vrai livrable.']];
    var y=760,flux='BT 0.188 0.086 0.404 rg ';lignes.forEach(function(l,i){flux+='/'+l[0]+' '+l[1]+' Tf 1 0 0 1 56 '+y+' Tm ('+pdfEsc(l[2])+') Tj ';y-=i?22:40});flux+='ET';
    var o=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>','<< /Length '+flux.length+' >>\nstream\n'+flux+'\nendstream','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'];
    var s='%PDF-1.4\n',pos=[];o.forEach(function(x,i){pos.push(s.length);s+=(i+1)+' 0 obj\n'+x+'\nendobj\n'});
    var xr=s.length;s+='xref\n0 '+(o.length+1)+'\n0000000000 65535 f \n';pos.forEach(function(p){s+=('000000000'+p).slice(-10)+' 00000 n \n'});
    s+='trailer\n<< /Size '+(o.length+1)+' /Root 1 0 R >>\nstartxref\n'+xr+'\n%%EOF';
    return new Blob([latin1(s)],{type:'application/pdf'})}
  function image(titre,type,cb){
    var c=document.createElement('canvas');c.width=1600;c.height=1000;var x=c.getContext('2d');
    var g=x.createLinearGradient(0,0,1600,1000);g.addColorStop(0,'#301667');g.addColorStop(1,'#8D68FA');x.fillStyle=g;x.fillRect(0,0,1600,1000);
    x.fillStyle='#fff';x.font='700 68px system-ui,sans-serif';var mots=titre.split(' '),l='',y=440;
    mots.forEach(function(m){if(x.measureText(l+m).width>1380){x.fillText(l,110,y);l='';y+=84}l+=m+' '});x.fillText(l,110,y);
    x.font='400 32px system-ui,sans-serif';x.fillStyle='#E0E1FF';x.fillText('Livrable de votre expert Yelema',110,y+80);
    c.toBlob(cb,type,0.92)}
  function svg(titre){return new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750"><rect width="1200" height="750" fill="#301667"/><text x="80" y="380" font-family="sans-serif" font-size="56" font-weight="700" fill="#fff">'+titre.replace(/[<&]/g,' ')+'</text></svg>'],{type:'image/svg+xml'})}
  function csv(titre){return new Blob(['﻿Élément;Valeur;Commentaire\nIndicateur 1;128;en hausse\nIndicateur 2;76;stable\nIndicateur 3;42;à surveiller\n;;\n'+titre.replace(/;/g,',')+';;exemple du prototype Yelema\n'],{type:'text/csv;charset=utf-8'})}
  function modele(ext,nom){fetch('../img/demo/modele.'+ext).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){envoyer(b,nom)}).catch(function(){envoyer(pdf(nom),nom.replace(/\.[^.]+$/,'.pdf'))})}
  function telecharger(nom){
    var m=/\.([a-z0-9]+)$/i.exec(nom),ext=m?m[1].toLowerCase():'pdf',titre=nomPropre(nom.replace(/\.[^.]+$/,''));
    if(!m)nom=titre+'.pdf';
    if(ext==='pdf')envoyer(pdf(titre),nom);
    else if(ext==='png'||ext==='jpg'||ext==='jpeg')image(titre,ext==='png'?'image/png':'image/jpeg',function(b){envoyer(b,nom)});
    else if(ext==='svg')envoyer(svg(titre),nom);
    else if(ext==='csv')envoyer(csv(titre),nom);
    else if(/^(pptx|xlsx|docx|zip)$/.test(ext))modele(ext,nom);
    else envoyer(pdf(titre),titre+'.pdf')}
  function depuisContexte(a){
    var d=a.closest('dialog,.dlg,.modal,[role=dialog]')||a.closest('.card,.lv,.dv,li')||document,im=d.querySelector('.dprev img'),h=(d.querySelector('h2,h3,b,.ell')||{}).textContent;
    var titre=nomPropre(h||document.title.split('·')[0]);
    if(im&&im.getAttribute('src')){var src=im.getAttribute('src'),ext=(/\.([a-z0-9]+)(\?|$)/i.exec(src)||[,'jpg'])[1];
      fetch(src).then(function(r){return r.blob()}).then(function(b){envoyer(b,titre+'.'+ext)}).catch(function(){telecharger(titre+'.pdf')});return}
    telecharger(titre+'.pdf')}
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('[data-toast]');if(!a)return;var t=a.getAttribute('data-toast')||'';if(!RE.test(t))return;
    e.preventDefault();e.stopImmediatePropagation();
    var m=/:\s*(.+\.[a-z0-9]{2,5})\s*$/i.exec(t);if(m)telecharger(m[1].trim());else depuisContexte(a);
    toast(m?'Téléchargé : '+m[1].trim():'Téléchargement terminé')},true);
})();

// v4.30 : réglages de l'expert en lecture seule, façon de répondre en listes, ajout de modèle, mail par demande à l'expert, Telegram, crédits IA
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function stop(e){e.preventDefault();e.stopImmediatePropagation()}
  var CK='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

  // ---------- 2. façon de répondre : chaque liste pilote le segment d'origine (et donc l'aperçu)
  $$('select.v30-rs').forEach(function(s){
    s.addEventListener('change',function(){var box=s.closest('.pfrep');if(!box)return;
      var a=box.querySelector('[data-pk="'+s.dataset.v30pk+'"] a[data-v="'+s.value+'"]');if(a&&!a.classList.contains('on'))a.click();
      toast((s.getAttribute('aria-label')||'Réglage')+' : '+s.options[s.selectedIndex].text)})});

  // ---------- 1. routines en lecture seule
  $$('.v30-swro').forEach(function(w){handled(w);w.addEventListener('click',function(e){stop(e);toast('Les routines sont gérées par votre administrateur')},true)});

  // ---------- 4. mail : demander à l'expert de répondre
  $$('.v30-ask').forEach(function(box){var b=$('.v30-askb',box),f=$('.v30-askf',box),ok=$('.v30-askok',box),ta=$('textarea',f),c=$('.v30-askc',box),g=$('.v30-askg',box);
    [b,c,g].forEach(handled);
    b.addEventListener('click',function(e){stop(e);b.hidden=true;f.hidden=false;ok.hidden=true;ta.focus()});
    c.addEventListener('click',function(e){stop(e);f.hidden=true;b.hidden=false});
    g.addEventListener('click',function(e){stop(e);var nm=box.dataset.v30nm;f.hidden=true;ok.hidden=false;ta.value='';toast(nm+' prépare '+box.dataset.v30what)})});
  var mc=document.getElementById('mcomp'),go=mc&&$('.v30-mcgo',mc);
  if(go){var nm=go.dataset.v30nm;handled(go);
    $$('[data-open="mcomp"]').forEach(function(b){b.addEventListener('click',function(){var h=$('h2',mc);if(h)h.textContent='Demander un email à '+nm})});
    go.addEventListener('click',function(e){stop(e);var t=$('textarea',mc);if(t&&!t.value.trim()){toast('Dites à '+nm+' ce que l’email doit dire');t.focus();return}
      mc.classList.remove('on');if(t)t.value='';toast(nm+' rédige l’email, vous le relirez avant l’envoi')})}

  // ---------- 7. message envoyé depuis Telegram
  $$('.v30-tg').forEach(function(t){handled(t);t.addEventListener('click',function(e){e.stopPropagation();toast('Envoyé depuis Telegram')});
    t.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();toast('Envoyé depuis Telegram')}})});

  // ---------- 3. admin : ajouter un modèle
  var md=document.getElementById('v30-madd');
  if(md){var MODS={Anthropic:['Claude Sonnet','Claude Opus','Claude Haiku'],OpenAI:['GPT-5','GPT-5 mini','GPT-4.1'],Google:['Gemini 2.5 Pro','Gemini 2.5 Flash'],Mistral:['Mistral Large','Mistral Medium']};
    var DOM={Anthropic:'anthropic.com',OpenAI:'openai.com',Google:'gemini.google.com',Mistral:'mistral.ai'};
    var PH={Anthropic:'sk-ant-...',OpenAI:'sk-...',Google:'AIza...',Mistral:'Votre clé Mistral'};
    var pv=$('.v30-pv',md),ms=$('.v30-md',md),k=$('.v30-k',md),eye=$('.v30-eye',md),sv=$('.v30-msave',md);
    pv.addEventListener('change',function(){ms.innerHTML=MODS[pv.value].map(function(m){return '<option>'+esc(m)+'</option>'}).join('');ms.selectedIndex=0;ms.dispatchEvent(new Event('change',{bubbles:true}));k.placeholder=PH[pv.value]});
    handled(eye);eye.addEventListener('click',function(e){stop(e);var sh=k.type==='password';k.type=sh?'text':'password';eye.classList.toggle('on',sh);eye.setAttribute('aria-label',sh?'Masquer la clé':'Afficher la clé')});
    $$('[data-open="v30-madd"]').forEach(function(b){b.addEventListener('click',function(){k.value='';k.type='password';eye.classList.remove('on');setTimeout(function(){k.focus()},50)})});
    handled(sv);sv.addEventListener('click',function(e){stop(e);var v=k.value.trim();if(v.length<8){toast('Collez la clé d’API du fournisseur');k.focus();return}
      var p=pv.value,m=ms.value,list=$('.kpvs');if(!list)return;
      $$('.kpv',list).forEach(function(r){var b=$('b',r);if(b&&b.textContent.replace(' AI','')===p&&$('.kst.no',r))r.remove()});
      var row=document.createElement('div');row.className='kpv v30-new';
      row.innerHTML='<span class="kpl"><img src="https://www.google.com/s2/favicons?sz=64&domain='+DOM[p]+'" alt=""></span><div class="kpm"><div class="row" style="gap:8px;flex-wrap:wrap"><b>'+esc(p)+'</b><span class="kst ok">'+CK+' Clé active</span><span class="v30-nb">Nouveau</span></div>'+
        '<span class="kcle num">'+esc(v.slice(0,4))+'••••'+esc(v.slice(-3))+'</span><small>Ajouté par vous à l’instant</small><span class="kmods"><i>'+esc(m)+'</i></span></div>'+
        '<div class="kpx"><small>Experts associés</small><span class="row" style="gap:0"><span class="xs mute3">À attribuer</span></span></div><div class="kpx kpxm"><small>Membres associés</small><span class="row" style="gap:0"><span class="xs mute3">Aucun</span></span></div>'+
        '<div class="kpa"><a class="btn o sm" href="#">Attribuer</a></div>';
      list.insertBefore(row,list.firstChild);var at=$('.kpa a',row);handled(at);at.addEventListener('click',function(ev){stop(ev);var mk=document.getElementById('mkey');if(mk)mk.classList.add('on')});
      md.classList.remove('on');k.value='';row.scrollIntoView({block:'center',behavior:'smooth'});toast(m+' est branché : vos experts peuvent l’utiliser')})}

  // ---------- 8. crédits IA : alerte
  $$('.v30-sw').forEach(function(w){handled(w);w.addEventListener('click',function(e){stop(e);var on=!w.classList.contains('on');w.classList.toggle('on',on);w.setAttribute('aria-checked',on);
    var r=w.closest('.v30-cra');if(r)r.classList.toggle('off',!on);toast(on?'Alerte activée sous 20 %':'Alerte désactivée')})});
})();

/* v4.32 : un seul Drive (Livrables = Drive filtré), bascule de clé d’IA, Powered by Yelema dans le partage d’un tableau */
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function svg(p){return '<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
  var CHK=svg('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),SWAP=svg('<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>');

  // ---------- 1. Drive unique : Tout / Livrables / Documents
  var dv=$('#drive .v31-scope')&&$('#drive');
  if(dv){
    var box=dv.closest('[data-tabs]')||document,chips=$$('.v31-scope .chip',dv),secs=$$('.v31-sec',dv);
    var lnkD=$('.xnav a[data-t="drive"]',box),lnkL=$('.xnav a[data-t="livrables"]',box);
    var scope=function(v){
      chips.forEach(function(c){var on=c.dataset.v31s===v;c.classList.toggle('on',on);c.setAttribute('aria-selected',on?'true':'false')});
      secs.forEach(function(x){x.hidden=!!v&&x.dataset.v31sec!==v});
      dv.classList.toggle('v31-one',!!v);
      if(!dv.classList.contains('on'))return;
      if(lnkD)lnkD.classList.toggle('on',v!=='liv');if(lnkL)lnkL.classList.toggle('on',v==='liv')};
    var openDrive=function(v){if(lnkD)lnkD.click();scope(v);history.replaceState(null,'',v==='liv'?'#livrables':'#drive');window.scrollTo({top:0,behavior:'smooth'})};
    chips.forEach(function(c){
      c.addEventListener('click',function(){scope(c.dataset.v31s);history.replaceState(null,'',c.dataset.v31s==='liv'?'#livrables':'#drive')});
      c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();c.click()}})});
    // l’entrée Livrables du menu ouvre le Drive filtré (avant le gestionnaire d’onglets)
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[data-t="livrables"]');if(!a)return;
      e.preventDefault();e.stopImmediatePropagation();openDrive('liv')},true);
    // Drive du menu : tout ; « Voir plus » des documents récents : livrables
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('a[data-t="drive"],[data-go="drive"]');if(!t)return;
      scope(t.dataset.v31s||'');if(t.dataset.v31s==='liv')history.replaceState(null,'','#livrables')});
    scope('');
    if(location.hash==='#livrables')openDrive('liv');
  }

  // ---------- 3. plusieurs clés par fournisseur : bascule manuelle, avec confirmation
  var keys=$('.v31-keys'),md=$('#v31-swk');
  if(keys&&md){
    var card=keys.closest('.kpv'),cur=$('.v31-cur',card),target=null;
    keys.addEventListener('click',function(e){var b=e.target.closest('.v31-swb');if(!b)return;e.preventDefault();e.stopPropagation();
      target=b.closest('[data-v31k]');var n=target.dataset.v31n;
      $('.v31-swn',md).textContent=n;$('.v31-swn2',md).textContent=n;$('.v31-swm',md).textContent=target.dataset.v31m;
      $('.v31-swc',md).textContent=($('.v31-kcl',target)||{}).textContent||'';md.classList.add('on')});
    $('.v31-swgo',md).addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(!target){md.classList.remove('on');return}
      var old=$('.v31-on',keys);
      if(old){old.classList.remove('v31-on');old.dataset.v31k='dis';
        $('.v31-ks',old).outerHTML='<span class="v31-ks dis">Disponible</span>';
        $('.v31-ka',old).innerHTML='<a class="btn o sm v31-swb" href="#" data-h="1">'+SWAP+' Basculer sur cette clé</a>'}
      target.classList.add('v31-on','v31-new');target.dataset.v31k='act';
      $('.v31-ks',target).outerHTML='<span class="v31-ks act" title="Clé utilisée en ce moment">'+CHK+' Clé active</span>';
      $('.v31-ka',target).innerHTML='<span class="v31-kon">'+CHK+' En service</span>';
      if(cur)cur.textContent=target.dataset.v31m;
      var t=target;setTimeout(function(){t.classList.remove('v31-new')},1200);
      md.classList.remove('on');toast(target.dataset.v31n+' active pour Anthropic');target=null});
  }

  // ---------- 4. partage d’un tableau : la signature Powered by Yelema se voit dans la fenêtre
  if($('.panel[id^="tb-"]')){
    var sign=function(){$$('#share .gsf').forEach(function(f){if(f.previousElementSibling&&f.previousElementSibling.classList.contains('v31-pby'))return;
      var d=document.createElement('div');d.className='v31-pby';
      d.innerHTML='<span>Le lien ouvre le tableau avec la signature</span><span class="pby2">Powered by <img src="../img/yelema_long.png" alt="Yelema"></span>';
      f.parentNode.insertBefore(d,f)})};
    sign();
    document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-open="share"]'))setTimeout(sign,0)});
  }
})();

/* v4.34 (add83) : agenda et routines, Drive (livrés récemment + dossiers), QR Telegram, tableaux de base vides,
   vue membre de démonstration, demandes d’expert, chat entreprise activable, panne des chats. Préfixe v33-. */
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function svg(p){return '<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
  function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){return null}}
  function H(el){if(el)el.dataset.h='1';return el}
  function stop(e){e.preventDefault();e.stopPropagation()}
  function closeM(id){var m=document.getElementById(id);if(m)m.classList.remove('on')}
  var IC={pause:svg('<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>'),play:svg('<path d="m6 3 14 9-14 9z"/>'),
    trash:svg('<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),plus:svg('<path d="M5 12h14M12 5v14"/>'),
    alert:svg('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>'),send:svg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>'),
    users:svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
    key:svg('<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>'),server:svg('<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>')};
  var NOM={djeneba:'Djénéba',fatima:'Fatima',koffi:'Koffi'};
  var page=(location.pathname.split('/').pop()||'').replace('.html','');
  var EX=NOM[page]?page:null;
  var Q=new URLSearchParams(location.search);

  // ================= vue de démonstration : admin, membre, membre sans expert
  var PERS={admin:{n:'Aïcha Diabaté',f:'Aïcha',p:'aicha',r:'Directrice marketing',ex:['djeneba','fatima','koffi']},
    membre:{n:'Nadège Touré',f:'Nadège',p:'m_women_36',r:'Chargée de communication',ex:['fatima','koffi']},
    membre0:{n:'Didier Yapi',f:'Didier',p:'m_men_30',r:'Acheteur',ex:[]}};
  if(Q.get('vue')&&PERS[Q.get('vue')])ls('v33-vue',Q.get('vue'));
  var VUE=PERS[ls('v33-vue')]?ls('v33-vue'):'admin',ME=PERS[VUE],MEMBRE=VUE!=='admin';
  var ADMINPAGE=!!$('.sbadm');
  window.v33={vue:VUE};

  function reqs(){try{return JSON.parse(ls('v33-req')||'[]')}catch(e){return []}}
  function addReq(e){var r=reqs();r.unshift({m:ME.n,p:ME.p,e:e,t:Date.now()});ls('v33-req',JSON.stringify(r.slice(0,12)))}
  function demander(e){addReq(e);toast(e?'Demande envoyée à votre admin : '+ME.n+' souhaite recruter '+e:'Demande envoyée à votre admin')}

  // sélecteur de vue dans le menu du compte
  function vueLinks(cls){var h='<div class="v33-vwl">Vue de démonstration</div>';
    [['admin','Aïcha, admin'],['membre','Nadège, membre'],['membre0','Didier, membre sans expert']].forEach(function(x){h+='<a class="'+cls+' v33-vw'+(x[0]===VUE?' on':'')+'" href="#" data-h="1" data-v33v="'+x[0]+'">'+IC.users+' '+x[1]+'</a>'});
    return h+'<a class="'+cls+' v33-pz" href="#" data-h="1">'+IC.alert+' <span>'+(ss('v33-panne')?'Rétablir le chat':'Simuler une panne du chat')+'</span></a>'}
  $$('.acm').forEach(function(m){var sep=$('.acsep',m);var d=document.createElement('div');d.innerHTML=vueLinks('acx');while(d.firstChild)m.insertBefore(d.firstChild,sep||null)});
  $$('#sh-moi .mspn').forEach(function(m){var d=document.createElement('div');d.innerHTML=vueLinks('msi');var pb=$('.pby',m);while(d.firstChild)m.insertBefore(d.firstChild,pb||null)});
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.v33-vw');if(!a)return;stop(e);if(a.dataset.v33v===VUE){toast('Vous êtes déjà dans cette vue');return}ls('v33-vue',a.dataset.v33v);
    var u=location.pathname.split('/').pop();if(a.dataset.v33v!=='admin'&&/^admin/.test(u))u='accueil.html';toast('Passage à la vue : '+a.textContent.trim());setTimeout(function(){location.href=u},350)})
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.v33-pz');if(!a)return;stop(e);if(ss('v33-panne')){ss('v33-panne',null);panneOff()}else{ss('v33-panne','1');panneOn()}
    $$('.v33-pz span').forEach(function(s){s.textContent=ss('v33-panne')?'Rétablir le chat':'Simuler une panne du chat'})});

  if(MEMBRE&&!ADMINPAGE){
    document.documentElement.classList.add('v33-m');
    // pas d’administration pour un membre
    $$('.sb a[href^="admin"], .acm a[href^="admin"], #sh-moi a[href^="admin"], .tabbar a[href^="admin"]').forEach(function(a){a.hidden=true});
    // son identité
    $$('.foot .me, .acm .ach, #sh-moi .msme').forEach(function(m){var im=$('img',m);if(im)im.src='../img/'+ME.p+'.jpg';var b=$('b',m);if(b)b.textContent=ME.n;var sm=$('small',m);if(sm)sm.textContent=m.classList.contains('ach')?ME.f.toLowerCase()+'@unifood.info':ME.r});
    $$('.hello h1').forEach(function(h){h.textContent=h.textContent.replace('Aïcha',ME.f)});
    // seulement ses experts
    ['djeneba','fatima','koffi'].forEach(function(x){if(ME.ex.indexOf(x)>=0)return;
      $$('.sb .mt[href="'+x+'.html"], .faces a[href="'+x+'.html"], #ping a[href^="'+x+'.html"], .tbli a[data-t^="tb-'+x+'"], .tbli a[data-t="tbv-'+x+'"], #sh-equipe a[href="'+x+'.html"]').forEach(function(a){a.hidden=true});
      $$('.pc2.eq').forEach(function(c){if($('a.cov[href="'+x+'.html"]',c))c.hidden=true})});
    var bar=document.createElement('div');bar.className='v33-demo';bar.innerHTML='<span>Vue membre : <b>'+esc(ME.n)+'</b>'+(ME.ex.length?'':', sans expert')+'</span><a href="#" data-h="1" class="v33-vw" data-v33v="admin">Revenir à Aïcha</a>';document.body.appendChild(bar);
    // un membre sans expert : écran vide propre
    if(!ME.ex.length){
      $$('.sb .lb').forEach(function(l){if(/équipe/i.test(l.textContent))l.hidden=true});
      if(/^(accueil|accueil-test|accueil-premier-jour|tableau-de-bord)$/.test(page)){var pg=$('main .page');if(pg){
        pg.innerHTML='<div class="v33-none"><div class="v33-nic">'+IC.users+'</div><h2>Aucun expert ne vous est encore attribué.</h2><p>Demandez à votre admin.</p><a class="btn p v33-dmx" href="#" data-h="1">'+IC.plus+' Demander un expert</a></div>';
        $('.v33-dmx',pg).addEventListener('click',function(e){stop(e);addReq('');toast('Demande envoyée à votre admin : '+ME.n+' souhaite un expert')})}}
    }
    // recruter un expert = une demande à l’admin, pour tous les experts du catalogue
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.pc2 .rb, .rqgo, .rqok, .rqgo2');if(!t)return;
      var c=t.closest('.pc2'),n=(t.dataset.nom)||(c&&$('.nm b',c)&&$('.nm b',c).textContent)||(t.textContent.replace(/^\s*Recruter\s*/,'').trim());
      e.preventDefault();e.stopImmediatePropagation();demander(n)},true);
    // connexions personnelles du membre, pour ses experts
    var cz=EX&&($('#connecteurs .v33-cxp')||$('#connecteurs .czw'));
    if(cz){$$('#connecteurs .czw').forEach(function(w){w.classList.remove('v30-czro')});var ro=$('.v30-ro span',cz);if(ro)ro.textContent='Outils de l’entreprise : gérés par votre admin';
      var pe=document.createElement('section');pe.className='v33-perso';
      pe.innerHTML='<h3>Mes connexions personnelles</h3><p class="sm mute">Branchez vos propres outils pour '+NOM[EX]+'. Vous seule les utilisez avec '+NOM[EX]+'.</p><div class="v33-pl"></div>'+
        '<div class="row" style="gap:8px;flex-wrap:wrap"><a class="btn o sm v33-pc" href="#" data-h="1" data-app="Gmail personnel" data-dom="gmail.com">Connecter Gmail</a><a class="btn o sm v33-pc" href="#" data-h="1" data-app="Google Agenda personnel" data-dom="calendar.google.com">Connecter Google Agenda</a>'+
        '<a class="btn o sm" href="#" data-open="v33-key" data-v33k="api" data-v33s="perso">'+IC.key+' Ajouter une clé API</a><a class="btn o sm" href="#" data-open="v33-key" data-v33k="mcp" data-v33s="perso">'+IC.server+' Ajouter un serveur MCP</a></div>';
      cz.insertBefore(pe,cz.firstChild);
      $$('.v33-pc',pe).forEach(function(b){b.addEventListener('click',function(e){stop(e);persoItem(pe,'<img src="https://www.google.com/s2/favicons?sz=64&domain='+b.dataset.dom+'" alt="">',b.dataset.app);b.hidden=true;toast(b.dataset.app+' connecté pour '+NOM[EX])})});
    }
  }
  function persoItem(box,ic,t,sub){var l=$('.v33-pl',box)||box;var d=document.createElement('div');d.className='v33-pi';d.innerHTML=ic+'<span class="grow"><b>'+esc(t)+'</b>'+(sub?'<br><small class="xs mute3">'+esc(sub)+'</small>':'')+'</span><span class="pill v33-pe">Personnel</span>';l.appendChild(d)}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-open="v33-key"]');if(!b)return;e.preventDefault();var m=document.getElementById('v33-key');if(m){m.classList.add('on');if(m._v33open)m._v33open(b)}});

  // fenêtre « clé API ou serveur MCP » (membre : personnel ; admin : entreprise)
  if($('[data-open="v33-key"]')||(MEMBRE&&EX)){
    var km=document.createElement('div');km.className='modal';km.id='v33-key';
    km.innerHTML='<div class="ov" data-close></div><div class="pn"><button class="ib x" aria-label="Fermer" data-h="1">×</button><h2 class="v33-kt">Ajouter</h2><p class="sm mute v33-ks"></p>'+
      '<div class="v33-kseg"><a href="#" data-h="1" data-k="api">Clé API</a><a href="#" data-h="1" data-k="mcp">Serveur MCP</a></div>'+
      '<label class="fl2"><span>Nom</span><input class="fi v33-kn" type="text" placeholder="Par exemple : mon Notion" style="width:100%"></label>'+
      '<label class="fl2"><span class="v33-kl2">Clé</span><input class="fi v33-kv" type="text" placeholder="" style="width:100%"></label>'+
      '<div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px"><a class="btn o v33-kx" href="#" data-h="1">Annuler</a><a class="btn p v33-kok" href="#" data-h="1">Ajouter</a></div></div>';
    document.body.appendChild(km);var kind='api',scope='perso';
    function kset(k){kind=k;$$('.v33-kseg a',km).forEach(function(a){a.classList.toggle('on',a.dataset.k===k)});$('.v33-kt',km).textContent=k==='mcp'?'Ajouter un serveur MCP':'Ajouter une clé API';
      $('.v33-kl2',km).textContent=k==='mcp'?'Adresse du serveur':'Clé';$('.v33-kv',km).placeholder=k==='mcp'?'https://…/mcp':'sk-…'}
    km._v33open=function(b){scope=b.dataset.v33s||'perso';kset(b.dataset.v33k||'api');$('.v33-kn',km).value='';$('.v33-kv',km).value='';
      $('.v33-ks',km).textContent=scope==='ent'?'Pour l’entreprise : vous la donnez ensuite aux experts qui en ont besoin.':'Personnel : seuls vous et '+(NOM[EX]||'vos experts')+' l’utilisez.'};
    $$('.v33-kseg a',km).forEach(function(a){a.addEventListener('click',function(e){stop(e);kset(a.dataset.k)})});
    [$('.ov',km),$('.ib.x',km),$('.v33-kx',km)].forEach(function(x){x.addEventListener('click',function(e){stop(e);km.classList.remove('on')})});
    $('.v33-kok',km).addEventListener('click',function(e){stop(e);var n=$('.v33-kn',km).value.trim(),v=$('.v33-kv',km).value.trim();
      if(!n||!v){toast(kind==='mcp'?'Donnez un nom et l’adresse du serveur':'Donnez un nom et collez la clé');($('.v33-kn',km).value?$('.v33-kv',km):$('.v33-kn',km)).focus();return}
      var masq=kind==='mcp'?v:v.slice(0,6)+'••••'+v.slice(-3);
      if(scope==='ent'){var tb=$('.v33-kl');if(tb){var tr=document.createElement('tr');tr.innerHTML='<td><b>'+esc(n)+'</b> <span class="pill br">Entreprise</span></td><td class="hide-m"><code class="xs">'+esc(masq)+'</code></td><td>À attribuer</td><td><a class="btn o sm" href="#" data-h="1" data-toast="Choisissez les experts">Attribuer</a></td>';tb.appendChild(tr)}}
      else{var pe=$('.v33-perso');if(pe)persoItem(pe,kind==='mcp'?IC.server:IC.key,n,(kind==='mcp'?'Serveur MCP, ':'Clé API, ')+masq)}
      km.classList.remove('on');toast((kind==='mcp'?'Serveur MCP':'Clé API')+' « '+n+' » ajouté'+(kind==='mcp'?'':'e'))});
  }

  // ================= notifications de l’admin : demandes des membres
  if(!MEMBRE){var R=reqs();
    if(R.length){
      var line=function(r){return (r.e?r.m+' souhaite recruter '+r.e:r.m+' demande un expert')};
      var pop=$('#notifs h3');if(pop){R.slice().reverse().forEach(function(r){var d=document.createElement('div');d.className='nt v33-nt';d.innerHTML='<span class="ic">'+IC.users+'</span><div><b>'+esc(line(r))+'</b><span>Demande d’un membre, à l’instant</span></div>';pop.insertAdjacentElement('afterend',d)});
        $$('[data-pop="notifs"] .bdg').forEach(function(b){b.textContent=(parseInt(b.textContent,10)||0)+R.length})}
      var g=$('.ngrp .lb2');if(g&&page==='notifications'){R.slice().reverse().forEach(function(r){var a=document.createElement('a');a.className='nrow unread v33-nt';a.href='admin-membres.html';a.innerHTML='<img class="nav" src="../img/'+r.p+'.jpg" alt=""><span class="grow"><b>'+esc(line(r))+'</b><span>Demande d’un membre</span></span><time>à l’instant</time><span class="nact">Répondre</span>';g.insertAdjacentElement('afterend',a)})}
      var box=$('.v33-reqs');if(box){box.hidden=false;R.forEach(function(r,i){var d=document.createElement('div');d.className='v33-rq';
        var slug=r.e?r.e.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''):'';
        d.innerHTML='<img src="../img/'+r.p+'.jpg" alt=""><span class="grow"><b>'+esc(line(r))+'</b><small>Demande en attente de votre réponse</small></span>'+
          '<a class="btn p sm" href="'+(r.e?'recrue-'+slug+'.html':'recruter.html')+'">'+(r.e?'Voir '+esc(r.e):'Choisir un expert')+'</a><a class="btn o sm v33-rqno" href="#" data-h="1" data-i="'+i+'">Refuser</a>';box.appendChild(d)});
        box.addEventListener('click',function(e){var b=e.target.closest('.v33-rqno');if(!b)return;stop(e);var r=reqs();r.splice(+b.dataset.i,1);ls('v33-req',JSON.stringify(r));b.closest('.v33-rq').remove();toast('Demande refusée, le membre est prévenu')})}
    }}

  // ================= attribuer des experts à un membre (admin, Membres)
  var at=$('#v33-att');
  if(at){var who=null;
    $$('[data-open="v33-att"]').forEach(function(b){b.addEventListener('click',function(){who=b.dataset.who;$('.v33-atw',at).textContent=who;var cur=$('.v33-ax[data-who="'+who+'"]');var ex=(cur.dataset.ex||'').split(' ');
      $$('input',at).forEach(function(i){i.checked=ex.indexOf(i.value)>=0})})});
    $('.v33-atok',at).addEventListener('click',function(e){stop(e);var ex=$$('input',at).filter(function(i){return i.checked}).map(function(i){return i.value});var cur=$('.v33-ax[data-who="'+who+'"]');
      cur.dataset.ex=ex.join(' ');cur.innerHTML=ex.length?ex.map(function(x){return '<img src="../img/'+x+'.jpg" alt="'+NOM[x]+'" title="'+NOM[x]+'">'}).join(''):'<span class="xs mute3">Aucun</span>';
      at.classList.remove('on');toast(ex.length?who+' travaille avec '+ex.map(function(x){return NOM[x]}).join(', '):who+' n’a plus d’expert')})}

  // ================= chat entreprise : interrupteur (admin, Détails de l’entreprise)
  function ceApply(){var off=ls('v33-ce')==='off';document.documentElement.classList.toggle('v33-ceoff',off);
    if(page==='memoire'){var m=$('main'),bx=$('.v33-cebox');if(off&&!bx){bx=document.createElement('div');bx.className='v33-cebox';bx.innerHTML='<h2>Le chat entreprise est coupé</h2><p class="sm mute">Votre admin peut le rallumer dans Détails de l’entreprise. Vos experts restent joignables chacun dans leur espace.</p><a class="btn p" href="accueil.html">Retour à l’accueil</a>';
      [].forEach.call(m.children,function(c){if(!c.matches('header'))c.hidden=true});m.appendChild(bx)}}}
  ceApply();
  $$('.v33-ce').forEach(function(b){function sync(){var off=ls('v33-ce')==='off';b.classList.toggle('off',off);b.setAttribute('aria-checked',off?'false':'true')}sync();
    b.addEventListener('click',function(e){stop(e);var off=ls('v33-ce')!=='off';ls('v33-ce',off?'off':null);sync();ceApply();toast(off?'Chat entreprise coupé : il disparaît du menu':'Chat entreprise activé')})});

  // ================= composeurs : vrai champ, envoi, et état de panne
  if(Q.get('panne')==='1')ss('v33-panne','1');if(Q.get('panne')==='0')ss('v33-panne',null);
  var comps=[];
  $$('.inp .ph, .gin2 .tx').forEach(function(ph){var box=ph.parentNode,inp=document.createElement('input');inp.type='text';inp.className='v33-in';inp.placeholder=ph.textContent.trim();inp.setAttribute('aria-label',inp.placeholder);
    ph.hidden=true;ph.insertAdjacentElement('afterend',inp);var sb=document.createElement('button');sb.type='button';sb.className='v33-send';sb.setAttribute('aria-label','Envoyer');sb.innerHTML=IC.send;H(sb);
    var mic=$('.mic',box);(mic&&mic.parentNode===box?box.insertBefore(sb,mic):(box.querySelector('.row')||box).appendChild(sb));
    var c={inp:inp,box:box};comps.push(c);
    function send(){var v=inp.value.trim();if(!v){inp.focus();toast('Écrivez d’abord votre message');return}
      if(ss('v33-panne')){banner(c);toast('Message gardé, il part dès que le chat revient');return}
      var th=(box.closest('.cm')&&$('.cth.on .thread',box.closest('.cm')))||(box.closest('.chat2')&&$('.thread',box.closest('.chat2')))||(box.closest('.ypop')&&box.closest('.ypop'));
      if(th&&th.classList.contains('thread')){var d=document.createElement('div');d.className='msg moi';d.innerHTML='<div class="bub">'+esc(v)+'</div><time>à l’instant</time>';
        var last=th.lastElementChild;if(last&&$('.typing',last))th.insertBefore(d,last);else th.appendChild(d)}
      else toast('Message envoyé');
      inp.value=''}
    c.send=send;sb.addEventListener('click',function(e){stop(e);send()});inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();send()}});
    inp.addEventListener('click',function(e){e.stopPropagation()})});
  function banner(c){var p=c.box.parentNode;if(p.querySelector(':scope > .v33-pn'))return;var b=document.createElement('div');b.className='v33-pn';b.setAttribute('role','alert');
    b.innerHTML=IC.alert+'<span>Chat momentanément indisponible, réessayez dans un instant. Votre texte est gardé.</span><a href="#" data-h="1" class="v33-retry">Réessayer</a>';p.insertBefore(b,c.box);
    $('.v33-retry',b).addEventListener('click',function(e){stop(e);ss('v33-panne',null);panneOff();$$('.v33-pz span').forEach(function(s){s.textContent='Simuler une panne du chat'});if(c.inp.value.trim())c.send();toast('Le chat est revenu')})}
  function panneOn(){comps.forEach(banner)}
  function panneOff(){$$('.v33-pn').forEach(function(b){b.remove()})}
  if(ss('v33-panne'))panneOn();

  // ================= page expert : Agenda (réunions) et Routines
  var cal=EX&&$('#calendrier');
  if(cal){
    var tabs=$$('.v33-agt a',cal),panes=$$('.v33-agp',cal);
    var showTab=function(k){tabs.forEach(function(a){var on=a.dataset.v33a===k;a.classList.toggle('on',on);a.setAttribute('aria-selected',on)});panes.forEach(function(p){p.hidden=p.dataset.v33p!==k})};
    tabs.forEach(function(a){a.addEventListener('click',function(e){stop(e);showTab(a.dataset.v33a);history.replaceState(null,'',a.dataset.v33a==='rt'?'#routines':'#calendrier')})});
    if(location.hash==='#routines'){var nl=$('.xnav a[data-t="calendrier"]');if(nl)nl.click();showTab('rt');history.replaceState(null,'','#routines')}
    // ---- créer une réunion
    var mm=$('#v33-meet');
    $$('[data-open="v33-meet"]').forEach(function(b){b.addEventListener('click',function(){$('.v33-ml',mm).textContent='meet.google.com/'+Math.random().toString(36).slice(2,5)+'-'+Math.random().toString(36).slice(2,6)+'-'+Math.random().toString(36).slice(2,5)})});
    $('.v33-mok',mm).addEventListener('click',function(e){stop(e);var t=$('.v33-mt',mm).value.trim();if(!t){toast('Donnez un titre à la réunion');$('.v33-mt',mm).focus();return}
      var d=$('.v33-md',mm).value||'2026-10-02',h=$('.v33-mh',mm).value||'10:00',du=+($('.v33-mdu',mm).value||60);
      var inv=$$('.v33-mi input',mm).filter(function(i){return i.checked}).map(function(i){return i.parentNode.textContent.trim()});
      var idx=Math.round((new Date(d+'T12:00')-new Date('2026-09-28T12:00'))/864e5),hh=+h.split(':')[0],mi=+h.split(':')[1]||0;
      if(idx>=0&&idx<7){var col=$$('.cal2 .col',cal)[idx];if(col){var ev=document.createElement('div');ev.className='ev h v33-new';ev.style.top=Math.max(2,((hh-8)+mi/60)*52+2)+'px';ev.style.height=Math.max(24,du/60*52-4)+'px';
          ev.innerHTML='<b>'+esc(t)+'</b><span>'+h+', visio</span>';col.appendChild(ev)}
        var ag=$$('.agl .agd',cal)[idx];if(ag){var a2=document.createElement('div');a2.className='age h v33-new';a2.innerHTML='<time>'+h.replace(':00',' h').replace(':',' h ')+'</time><b>'+esc(t)+'</b><span>'+(inv.length?'avec '+esc(inv.join(', ')):'visio')+'</span>';$('.grow',ag).appendChild(a2)}
        toast('Réunion créée, invitations envoyées')}
      else toast('Réunion créée le '+d.split('-').reverse().join('/')+', invitations envoyées');
      mm.classList.remove('on');$('.v33-mt',mm).value=''});

    // ---- routines
    var SK={djeneba:['Point du jour','Notes de direction','Préparation des rendez-vous','Relevés de décisions','Tri de la boîte de direction'],
      fatima:['Calendrier éditorial','Rédaction de posts','Rapport de performance','Veille concurrentielle','Newsletter'],
      koffi:['Déclinaisons de visuels','Contrôle de la charte','Affiches','Packaging','Export des visuels']};
    var PR={djeneba:[['Point du matin','Fais-moi le point du jour : rendez-vous, validations en attente et urgences, en cinq lignes.','day','2026-10-02','08:00'],
        ['Point du soir','Résume ce qui a été fait aujourd’hui et ce qui reste pour demain.','day','2026-10-01','18:00'],
        ['Bilan du vendredi','Prépare le bilan de la semaine pour le directeur général : décisions, engagements tenus, retards.','week','2026-10-02','17:00']],
      fatima:[['Calendrier éditorial du lundi','Prépare les posts de la semaine pour Sossa et Super Mint et mets-les à valider.','week','2026-10-05','08:00'],
        ['Rapport réseaux mensuel','Fais le rapport des réseaux sociaux du mois écoulé, avec les trois publications qui ont le mieux marché.','month','2026-11-01','09:00'],
        ['Veille concurrents','Regarde ce que les concurrents ont publié aujourd’hui sur Facebook et Instagram et note ce qui compte.','day','2026-10-01','18:00']],
      koffi:[['Déclinaisons de la semaine','Décline les visuels validés de la semaine dans tous les formats des réseaux.','week','2026-10-05','09:00'],
        ['Vérif charte','Vérifie que les visuels livrés aujourd’hui respectent la charte de chaque marque.','day','2026-10-01','17:00'],
        ['Export des visuels','Exporte les visuels validés de la semaine en PNG et PDF, rangés par marque dans le Drive.','week','2026-10-02','16:00']]};
    var INI={djeneba:[[0,'ok']],fatima:[[2,'ko'],[0,'ok']],koffi:[[1,'ok']]};
    var KEY='v33-rt-'+EX,list;
    try{list=JSON.parse(ls(KEY)||'null')}catch(_){list=null}
    if(!list){list=INI[EX].map(function(x,i){var p=PR[EX][x[0]];return {id:'i'+i,n:p[0],c:p[1],f:p[2],d:p[3],h:p[4],z:'Abidjan',last:x[1],on:true,o:'Aïcha Diabaté',pr:x[0]}})}
    var save=function(){ls(KEY,JSON.stringify(list))};
    var NOW=new Date('2026-10-01T10:52:00');
    var JOURS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    function freq(r){var dt=new Date(r.d+'T12:00'),z=' ('+r.z+')';
      if(r.f==='day')return 'Tous les jours, '+r.h+z;if(r.f==='week')return 'Toutes les semaines, le '+JOURS[dt.getDay()]+', '+r.h+z;
      if(r.f==='month')return 'Tous les mois, le '+(dt.getDate()===1?'1er':dt.getDate())+', '+r.h+z;return 'Une fois, le '+dt.getDate()+' '+MOIS[dt.getMonth()]+', '+r.h+z}
    function next(r){var p=r.h.split(':'),n=new Date(r.d+'T'+r.h+':00');
      if(r.f==='day'){n=new Date(NOW);n.setHours(+p[0],+p[1],0,0);if(n<=NOW)n.setDate(n.getDate()+1)}
      else if(r.f==='week'){var wd=new Date(r.d+'T12:00').getDay();n=new Date(NOW);n.setHours(+p[0],+p[1],0,0);while(n.getDay()!==wd||n<=NOW)n.setDate(n.getDate()+1)}
      else if(r.f==='month'){var md=new Date(r.d+'T12:00').getDate();n=new Date(NOW.getFullYear(),NOW.getMonth(),md,+p[0],+p[1]);if(n<=NOW)n=new Date(NOW.getFullYear(),NOW.getMonth()+1,md,+p[0],+p[1])}
      var m=Math.round((n-NOW)/6e4);if(m<0)return 'passée';if(m<60)return 'prochaine dans '+m+' min';var hh=Math.round(m/60);if(hh<36)return 'prochaine dans environ '+hh+' h';return 'prochaine dans '+Math.round(hh/24)+' jours'}
    var box=$('.v33-rts',cal),prb=$('.v33-rtp',cal),cnt=$('.v33-rtn',cal),delId=null;
    function render(){
      box.innerHTML=list.length?'':'<p class="v33-rtempty">Aucune routine pour l’instant. Activez une routine prête ou ajoutez la vôtre.</p>';
      list.forEach(function(r){var mine=!MEMBRE||r.o===ME.n,d=document.createElement('div');d.className='v33-rt'+(r.on?'':' off');d.dataset.id=r.id;
        var st=r.last==='ok'?'<span class="v33-st ok"><i></i>Dernier passage réussi</span>':r.last==='ko'?'<span class="v33-st ko"><i></i>Dernier passage échoué</span>':'<span class="v33-st nv"><i></i>Pas encore passée</span>';
        d.innerHTML='<img src="../img/'+EX+'.jpg" alt=""><div class="grow"><b>'+esc(r.n)+'</b><small>'+esc(freq(r))+(r.on?', '+next(r):', en pause')+'</small></div>'+st+
          '<div class="v33-ra"><a class="btn o sm v33-rp" href="#" data-h="1">'+(r.on?IC.pause+' Pause':IC.play+' Reprendre')+'</a>'+(mine?'<a class="btn o sm v33-rx" href="#" data-h="1" aria-label="Supprimer la routine '+esc(r.n)+'">'+IC.trash+' Supprimer</a>':'<span class="xs mute3">Créée par '+esc(r.o.split(' ')[0])+'</span>')+'</div>';
        box.appendChild(d)});
      cnt.textContent=list.filter(function(r){return r.on}).length||'';
      prb.innerHTML='';PR[EX].forEach(function(p,i){var on=list.some(function(r){return r.pr===i});var d=document.createElement('div');d.className='v33-pr'+(on?' on':'');
        d.innerHTML='<b>'+esc(p[0])+'</b><small>'+esc(freq({f:p[2],d:p[3],h:p[4],z:'Abidjan'}))+'</small><p>'+esc(p[1])+'</p>'+(on?'<span class="v33-st ok"><i></i>Activée</span>':'<a class="btn p sm v33-pa" href="#" data-h="1" data-i="'+i+'">Activer</a>');prb.appendChild(d)});
      save()}
    render();
    box.addEventListener('click',function(e){var b=e.target.closest('a');if(!b)return;var row=b.closest('.v33-rt'),r=list.filter(function(x){return x.id===row.dataset.id})[0];if(!r)return;stop(e);
      if(b.classList.contains('v33-rp')){r.on=!r.on;render();toast(r.on?'Routine reprise : '+r.n:'Routine en pause : '+r.n)}
      if(b.classList.contains('v33-rx')){delId=r.id;$('#v33-del .v33-deln').textContent=r.n;$('#v33-del').classList.add('on')}});
    $('#v33-del .v33-delok').addEventListener('click',function(e){stop(e);var r=list.filter(function(x){return x.id===delId})[0];list=list.filter(function(x){return x.id!==delId});render();closeM('v33-del');if(r)toast('Routine supprimée : '+r.n)});
    prb.addEventListener('click',function(e){var b=e.target.closest('.v33-pa');if(!b)return;stop(e);var p=PR[EX][+b.dataset.i];
      list.push({id:'p'+Date.now(),n:p[0],c:p[1],f:p[2],d:p[3],h:p[4],z:'Abidjan',last:'',on:true,o:ME.n,pr:+b.dataset.i});render();toast('Routine activée : '+p[0])});
    // ---- nouvelle routine
    var rm=$('#v33-rtm'),sk=$('.v33-rsk',rm);
    sk.innerHTML=SK[EX].map(function(x,i){return '<label class="fmc"><input type="checkbox"'+(i<2?' checked':'')+'> '+esc(x)+'</label>'}).join('');
    var pj=$('.v33-pj input',rm);pj.addEventListener('change',function(){$('.v33-pjn',rm).textContent=pj.files&&pj.files[0]?pj.files[0].name:''});
    $('.v33-pj',rm).addEventListener('click',function(e){e.stopPropagation()});
    $('.v33-aigo',rm).addEventListener('click',function(e){stop(e);var q=$('.v33-aiq',rm).value.trim()||'Chaque lundi, prépare le travail de la semaine';var t=$('.v33-ait',rm);
      t.insertAdjacentHTML('beforeend','<p class="me">'+esc(q)+'</p>');$('.v33-aiq',rm).value='';
      setTimeout(function(){var f=$('.v33-rf',rm).value,fl={once:'Le moment venu',day:'Chaque jour',week:'Chaque semaine',month:'Chaque mois'}[f];
        var c=fl+' à '+($('.v33-rh',rm).value||'08:00')+' : '+q.replace(/^(chaque|tous les|toutes les)\s+\S+,?\s*/i,'').replace(/\.$/,'')+'. Envoie-moi le résultat sur Telegram et range le fichier dans le Drive. Demande mon accord avant tout envoi à l’extérieur.';
        $('.v33-rc',rm).value=c.charAt(0).toUpperCase()+c.slice(1);if(!$('.v33-rn',rm).value)$('.v33-rn',rm).value=q.split(/\s+/).slice(0,4).join(' ');
        t.insertAdjacentHTML('beforeend','<p>Voilà la consigne, relisez-la à gauche et modifiez ce que vous voulez.</p>')},500)});
    $('.v33-rok',rm).addEventListener('click',function(e){stop(e);var c=$('.v33-rc',rm).value.trim();if(!c){toast('Dites à '+NOM[EX]+' ce qu’elle doit faire');$('.v33-rc',rm).focus();return}
      var n=$('.v33-rn',rm).value.trim()||c.split(/\s+/).slice(0,5).join(' ');
      list.push({id:'n'+Date.now(),n:n,c:c,f:$('.v33-rf',rm).value,d:$('.v33-rd',rm).value||'2026-10-05',h:$('.v33-rh',rm).value||'08:00',z:$('.v33-rz',rm).value||'Abidjan',last:'',on:true,o:ME.n});
      render();rm.classList.remove('on');$('.v33-rn',rm).value='';$('.v33-rc',rm).value='';$('.v33-ait',rm).innerHTML='';showTab('rt');toast('Routine créée : '+n)});
  }

  // ================= Livrables : les fichiers de l’expert (explorateur simple, sans statut)
  var LV=EX&&$('#drive .v33-lv');
  if(LV){
    var DATA;try{DATA=JSON.parse($('.v33-lvd',LV).textContent)}catch(_){DATA=[]}
    if(Q.get('premier')==='1')DATA=[];
    var path=[],mode='list',q='',sel=null,uid=0;
    var IK={dir:svg('<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>'),
      img:svg('<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>'),
      sheet:svg('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>'),xls:svg('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>'),
      doc:svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>'),
      pdf:svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>'),
      ppt:svg('<path d="M2 3h20M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3M7 21l5-5 5 5"/>'),zip:svg('<path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>')};
    var AR={dl:svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>'),ext:svg('<path d="M7 7h10v10M7 17 17 7"/>'),chev:svg('<path d="m9 18 6-6-6-6"/>'),
      pen:svg('<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>'),
      more:svg('<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'),home:svg('<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>')};
    (function tag(L){L.forEach(function(x){x.id='f'+(++uid);if(x.k==='dir')tag(x.c)})})(DATA);
    function cur(){var L=DATA;path.forEach(function(d){L=d.c});return L}
    function last(x){if(x.k!=='dir')return x.d||'';var m='';x.c.forEach(function(y){var v=last(y);if(v>m)m=v});return m}
    function nb(x){var n=0;x.c.forEach(function(y){n+=y.k==='dir'?nb(y):1});return n}
    function fd(d){if(!d)return '';var p=d.split(/[- :]/);return p[2]+'/'+p[1]+', '+p[3]+':'+p[4]}
    function isLink(x){return x.k!=='dir'&&!x.s}
    function ext1(x){var f=(x.fm||[]).filter(function(a){return !/^https?:/.test(a[1])})[0];return f?f[1]:'pdf'}
    function url1(x){var f=(x.fm||[]).filter(function(a){return /^https?:/.test(a[1])})[0];return f?f[1]:'#'}
    function taille(x){return x.k==='dir'?(nb(x)+' fichier'+(nb(x)>1?'s':'')):(x.s||({sheet:'Google Sheets',doc:'Google Doc'})[x.k]||'')}
    function sorted(L){var d=L.filter(function(x){return x.k==='dir'}),f=L.filter(function(x){return x.k!=='dir'});
      var by=function(a,b){return last(b)<last(a)?-1:last(b)>last(a)?1:0};return d.sort(by).concat(f.sort(by))}
    function all(L,pre,out){L.forEach(function(x){if(x.k==='dir')all(x.c,pre.concat(x.n),out);else out.push({x:x,p:pre})});return out}
    function find(id,L,par){L=L||DATA;for(var i=0;i<L.length;i++){if(L[i].id===id)return {x:L[i],L:L,i:i};if(L[i].k==='dir'){var r=find(id,L[i].c);if(r)return r}}return null}
    var lt=$('.v33-lt',LV),cr=$('.v33-cr',LV),srch=$('.v33-ls input',LV);
    function crumb(){var h='<a href="#" data-h="1" data-v33cr="-1">'+AR.home+'<span>Livrables</span></a>';path.forEach(function(d,i){h+=AR.chev+(i===path.length-1?'<b>'+esc(d.n)+'</b>':'<a href="#" data-h="1" data-v33cr="'+i+'">'+esc(d.n)+'</a>')});cr.innerHTML=h;
      var w=$('#v33-dir .v33-dwh');if(w)w.textContent=path.length?path[path.length-1].n:'Livrables'}
    function rowH(x,p){var dir=x.k==='dir',th=x.th&&mode==='grid'?'<img src="../img/'+x.th+'" alt="" loading="lazy">':IK[x.k==='xls'?'xls':x.k]||IK.pdf;
      var act=dir?'<span class="v33-go" aria-hidden="true">'+AR.chev+'</span>':isLink(x)?'<a class="v33-ia" href="'+url1(x)+'" target="_blank" rel="noopener" aria-label="Ouvrir '+esc(x.n)+'">'+AR.ext+'</a>':'<a class="v33-ia" href="#" data-toast="Téléchargement : '+esc(x.n)+'.'+ext1(x)+'" aria-label="Télécharger '+esc(x.n)+'">'+AR.dl+'</a>';
      var sub=(p&&p.length?esc(p.join(' / '))+', ':'')+'Modifié le '+fd(last(x));
      return '<div class="v33-r'+(dir?' dir':'')+'" data-id="'+x.id+'" tabindex="0" role="row"><span class="v33-rn"><span class="v33-ic '+x.k+'">'+th+'</span><span class="v33-nm"><b>'+esc(x.n)+'</b><small>'+sub+'</small></span></span>'+
        '<span class="v33-md">'+fd(last(x))+'</span><span class="v33-sz">'+taille(x)+'</span>'+
        '<span class="v33-ac"><span class="v33-hv"><button type="button" class="v33-ib v33-ren" data-h="1" aria-label="Renommer '+esc(x.n)+'">'+AR.pen+'</button><button type="button" class="v33-ib v33-del" data-h="1" aria-label="Supprimer '+esc(x.n)+'">'+IC.trash+'</button></span>'+
        '<button type="button" class="v33-ib v33-more" data-h="1" aria-label="Plus d’actions" aria-expanded="false">'+AR.more+'</button><span class="v33-mm" hidden><a href="#" data-h="1" class="v33-ren">Renommer</a><a href="#" data-h="1" class="v33-del">Supprimer</a></span>'+act+'</span></div>'}
    function render(){crumb();LV.classList.toggle('grid',mode==='grid');
      var L,rows;if(q){rows=all(DATA,[],[]).filter(function(o){return o.x.n.toLowerCase().indexOf(q)>=0}).sort(function(a,b){return last(b.x)<last(a.x)?-1:1})}else{L=sorted(cur().slice());rows=L.map(function(x){return {x:x,p:null}})}
      var h='<div class="v33-r v33-th" role="row"><span>Nom</span><span class="v33-md">Modifié</span><span class="v33-sz">Taille</span><span></span></div>';
      if(!rows.length){h+='<div class="v33-empty">'+(q?'Aucun fichier ne correspond à « '+esc(q)+' ».':(path.length?'Ce dossier est vide.':'Aucun fichier pour l’instant. Les livrables de '+NOM[EX]+' arriveront ici.'))+(q?'':' <a class="btn p sm v33-impx" href="#" data-h="1">Importer</a>')+'</div>'}
      rows.forEach(function(o){h+=rowH(o.x,q?o.p:null)});lt.innerHTML=h}
    function open(x){if(x.k==='dir'){path.push(x);q='';srch.value='';render();return}
      var m=$('#v33-pv');sel=x;$('.v33-pvh',m).textContent=x.n;$('.v33-pvd',m).textContent='Modifié le '+fd(x.d)+(x.s?', '+x.s:'');
      $('.v33-pvt',m).innerHTML=x.th?'<img src="../img/'+x.th+'" alt="">':'<div class="v33-pvp '+x.k+'">'+(IK[x.k]||IK.pdf)+'<b>'+esc(x.n)+'</b><i></i><i></i><i class="s"></i><i></i></div>';
      $('.v33-pvf',m).innerHTML=(x.fm||[['PDF','pdf']]).map(function(f){return /^https?:/.test(f[1])?'<a class="btn o" href="'+f[1]+'" target="_blank" rel="noopener">'+AR.ext+' Ouvrir dans '+esc(f[0])+'</a>':'<a class="btn p" href="#" data-toast="Téléchargement : '+esc(x.n)+'.'+f[1]+'">'+AR.dl+' '+esc(f[0])+'</a>'}).join('');
      m.classList.add('on')}
    function closeMenus(){$$('.v33-mm',LV).forEach(function(m){m.hidden=true});$$('.v33-more',LV).forEach(function(b){b.setAttribute('aria-expanded','false')})}
    function rename(row){var r=find(row.dataset.id);if(!r)return;var b=$('.v33-nm b',row),inp=document.createElement('input');inp.className='fi v33-rin';inp.value=r.x.n;inp.setAttribute('aria-label','Nouveau nom');
      b.replaceWith(inp);inp.focus();inp.select();var done=false;
      function end(ok){if(done)return;done=true;var v=inp.value.trim();if(ok&&v&&v!==r.x.n){r.x.n=v;toast('Renommé : '+v)}render()}
      inp.addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Enter'){e.preventDefault();end(true)}if(e.key==='Escape'){e.preventDefault();end(false)}});
      inp.addEventListener('click',function(e){e.stopPropagation()});inp.addEventListener('blur',function(){end(false)})}
    var delId=null;
    lt.addEventListener('click',function(e){var row=e.target.closest('.v33-r');if(!row||row.classList.contains('v33-th')){var ix=e.target.closest('.v33-impx');if(ix){stop(e);$('.v33-if',LV).click()}return}
      var t=e.target;
      if(t.closest('.v33-more')){stop(e);var mm=$('.v33-mm',row),was=!mm.hidden;closeMenus();mm.hidden=was;t.closest('.v33-more').setAttribute('aria-expanded',!was);return}
      if(t.closest('.v33-ren')){stop(e);closeMenus();rename(row);return}
      if(t.closest('.v33-del')){stop(e);closeMenus();var r=find(row.dataset.id);delId=row.dataset.id;$('#v33-fdel .v33-fdn').textContent='« '+r.x.n+' »';$('#v33-fdel').classList.add('on');return}
      if(t.closest('.v33-ia')||t.closest('input'))return;
      e.preventDefault();var f=find(row.dataset.id);if(f)open(f.x)});
    lt.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.classList.contains('v33-r')){var f=find(e.target.dataset.id);if(f)open(f.x)}});
    $('#v33-fdel .v33-fdok').addEventListener('click',function(e){stop(e);var r=find(delId);if(r){r.L.splice(r.i,1);toast((r.x.k==='dir'?'Dossier supprimé : ':'Fichier supprimé : ')+r.x.n)}closeM('v33-fdel');render()});
    cr.addEventListener('click',function(e){var a=e.target.closest('[data-v33cr]');if(!a)return;stop(e);path=path.slice(0,+a.dataset.v33cr+1);q='';srch.value='';render()});
    srch.addEventListener('input',function(){q=srch.value.trim().toLowerCase();render()});
    $$('.v33-vm button',LV).forEach(function(b){b.addEventListener('click',function(e){stop(e);mode=b.dataset.v33vm;$$('.v33-vm button',LV).forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});render()})});
    // nouveau dossier
    $('#v33-dir .v33-dok').addEventListener('click',function(e){stop(e);var n=$('#v33-dir .v33-dn').value.trim();if(!n){toast('Donnez un nom au dossier');$('#v33-dir .v33-dn').focus();return}
      cur().push({id:'f'+(++uid),n:n,k:'dir',c:[]});closeM('v33-dir');$('#v33-dir .v33-dn').value='';q='';srch.value='';render();toast('Dossier « '+n+' » créé')});
    // importer : fichiers ou dossier, et glisser-déposer
    var NOWS='2026-10-01 10:52';
    function kind(n){var x=(/\.([a-z0-9]+)$/i.exec(n)||[,''])[1].toLowerCase();return /png|jpe?g|gif|webp|svg/.test(x)?'img':/xlsx?|csv/.test(x)?'xls':/docx?|txt|md/.test(x)?'doc':/pptx?|key/.test(x)?'ppt':/zip|rar/.test(x)?'zip':'pdf'}
    function fmt(f){var k=kind(f.name),e=(/\.([a-z0-9]+)$/i.exec(f.name)||[,'pdf'])[1].toLowerCase(),lab={img:e.toUpperCase(),xls:'Excel',doc:'Word',ppt:'PowerPoint',zip:'ZIP',pdf:'PDF'}[k];
      var s=f.size>=1048576?(f.size/1048576).toFixed(1).replace('.',',')+' Mo':Math.max(1,Math.round(f.size/1024))+' Ko';
      return {id:'f'+(++uid),n:f.name.replace(/\.[^.]+$/,''),k:k,d:NOWS,s:s,fm:[[lab,e]]}}
    function add(files){var L=cur(),n=0,dirs={};[].forEach.call(files||[],function(f){var rp=f.webkitRelativePath||'';
        if(rp&&rp.indexOf('/')>0){var dn=rp.split('/')[0];if(!dirs[dn]){dirs[dn]={id:'f'+(++uid),n:dn,k:'dir',c:[]};L.push(dirs[dn])}dirs[dn].c.push(fmt(f))}else L.push(fmt(f));n++});
      if(!n)return;q='';srch.value='';render();toast(Object.keys(dirs).length?'Dossier importé : '+Object.keys(dirs)[0]+' ('+n+' fichier'+(n>1?'s':'')+')':n+' fichier'+(n>1?'s':'')+' ajouté'+(n>1?'s':'')+' à '+(path.length?path[path.length-1].n:'Livrables'))}
    var ib=$('.v33-impb',LV),im=$('.v33-impm',LV);
    ib.addEventListener('click',function(e){stop(e);im.hidden=!im.hidden;ib.setAttribute('aria-expanded',!im.hidden)});
    $$('[data-v33imp]',im).forEach(function(a){a.addEventListener('click',function(e){stop(e);im.hidden=true;ib.setAttribute('aria-expanded','false');$(a.dataset.v33imp==='d'?'.v33-id':'.v33-if',LV).click();toast(a.dataset.v33imp==='d'?'Choisissez un dossier':'Choisissez vos fichiers')})});
    $$('.v33-if,.v33-id',LV).forEach(function(i){i.addEventListener('change',function(){add(i.files);i.value=''})});
    document.addEventListener('click',function(e){if(!im.hidden&&!e.target.closest('.v33-imp')){im.hidden=true;ib.setAttribute('aria-expanded','false')}if(!e.target.closest('.v33-more,.v33-mm'))closeMenus()});
    var drop=$('.v33-drop',LV),dc=0,pan=$('#drive');
    pan.addEventListener('dragenter',function(e){if(!e.dataTransfer||[].indexOf.call(e.dataTransfer.types||[],'Files')<0)return;e.preventDefault();dc++;drop.hidden=false});
    pan.addEventListener('dragover',function(e){if(!drop.hidden){e.preventDefault();e.dataTransfer.dropEffect='copy'}});
    pan.addEventListener('dragleave',function(){dc=Math.max(0,dc-1);if(!dc)drop.hidden=true});
    pan.addEventListener('drop',function(e){e.preventDefault();dc=0;drop.hidden=true;add(e.dataTransfer&&e.dataTransfer.files)});
    // liens « Voir plus », data-go="drive" : on arrive sur la liste
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-go="drive"],a[data-t="drive"]');if(!t)return;setTimeout(function(){path=[];q='';srch.value='';render()},0)});
    render();
  }

  // ================= Réglages : Profil, Canaux, Connecteurs sous une seule entrée du menu
  var RGN=EX&&$('.xnav .v33-rgn');
  if(RGN){var syncReg=function(){var on=['profil','canaux','connecteurs'].some(function(k){var p=document.getElementById(k);return p&&p.classList.contains('on')});RGN.classList.toggle('on',on)};
    document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-t],[data-go]'))setTimeout(syncReg,0)});syncReg()}

  // ================= Connecteurs de l’expert : Parcourir / Connectés / API et MCP
  var CXP=EX&&$('#connecteurs .v33-cxp');
  if(CXP){var pan=$('#connecteurs'),old=$('.v33-czold',pan),qi=$('.v33-cxq input',CXP),grid=$('.v33-cxg',CXP),none=$('.v33-cxn',CXP),lbl=$('.v33-cxl',CXP),tab='p',pend=null,gere=null;
    var TICK=svg('<path d="M20 6 9 17l-5-5"/>');
    function count(){var n=$$('.v33-cx.on',grid).length;$('.v33-cxs [data-v33cx="c"] em',pan).textContent=n;return n}
    function filt(){var q=qi.value.trim().toLowerCase(),vis=0;$$('.v33-cx',grid).forEach(function(c){var ok=(!q||c.dataset.q.indexOf(q)>=0)&&(tab!=='c'||c.classList.contains('on'));c.hidden=!ok;if(ok)vis++});
      none.hidden=vis>0;lbl.hidden=!vis;lbl.textContent=tab==='c'?count()+' outils connectés pour '+NOM[EX]:(q?'Résultats':'Les plus utilisés')}
    function setTab(k){tab=k;$$('.v33-cxs a',pan).forEach(function(a){var on=a.dataset.v33cx===k;a.classList.toggle('on',on);a.setAttribute('aria-selected',on)});
      CXP.hidden=k==='api';old.hidden=k!=='api';if(k==='api'){var c=$('.cts span[data-c="cz-c"]',old);if(c)c.click();$$('.czp',old).forEach(function(p){p.classList.toggle('on',p.id==='cz-c')})}else filt()}
    $$('.v33-cxs a',pan).forEach(function(a){a.addEventListener('click',function(e){stop(e);setTab(a.dataset.v33cx)})});
    qi.addEventListener('input',filt);
    $('.v33-cxd',CXP).addEventListener('click',function(e){stop(e);toast('Demande envoyée à l’équipe Yelema : '+(qi.value.trim()||'nouvel outil'))});
    function setOn(c,on){c.classList.toggle('on',on);var b=$('.v33-cxk,.v33-cxb',c),n=c.dataset.n;
      b.outerHTML=on?'<button type="button" class="v33-cxk" data-h="1" title="Connecté" aria-label="'+esc(n)+' connecté, gérer">'+TICK+'</button>':'<a class="btn o sm v33-cxb" href="#" data-h="1" data-v33app="'+esc(n)+'">Connecter</a>';count();filt()}
    grid.addEventListener('click',function(e){var c=e.target.closest('.v33-cx');if(!c)return;
      if(e.target.closest('.v33-cxb')){pend=c;var b=e.target.closest('.v33-cxb');if(!b.dataset.open){stop(e);var z=$('#cz');if(z){var p=$('.pn',z);p.classList.remove('done');var cn=$('.czn',z);if(cn)cn.textContent=c.dataset.n;z.classList.add('on')}}return}
      if(c.classList.contains('on')){stop(e);gere=c;var m=$('#v33-cxm');$('.v33-cxmi',m).src=$('img',c).getAttribute('src');$('.v33-cxmn',m).textContent=c.dataset.n;m.classList.add('on')}});
    $$('#cz .czgo').forEach(function(g){g.addEventListener('click',function(){if(!pend)return;var c=pend;pend=null;setOn(c,true);toast(c.dataset.n+' connecté pour '+NOM[EX])})});
    $('#v33-cxm .v33-cxoff').addEventListener('click',function(e){stop(e);if(gere){setOn(gere,false);toast(gere.dataset.n+' déconnecté');gere=null}closeM('v33-cxm')});
    count();filt();
  }

  // ================= Canaux : Telegram par QR code
  $$('.v33-tg').forEach(function(t){var s=$('.v33-tgs',t),r=$('.v33-tgr',t);
    function set(on){t.classList.toggle('on',on);$('.v33-tgo',t).hidden=on;$('.v33-tgk',t).hidden=!on;s.hidden=on;r.hidden=!on}
    s.addEventListener('click',function(e){stop(e);set(true);toast('Telegram connecté')});r.addEventListener('click',function(e){stop(e);set(false)})});

  // ================= Tableaux de bord : tableaux de base vides (premier jour)
  if(page==='tableau-de-bord'&&Q.get('premier')==='1'){
    $$('.tbli a[data-t]').forEach(function(a){if(!/^tbv-/.test(a.dataset.t))a.hidden=true});$$('.tbli .tbg').forEach(function(p){if(!p.classList.contains('v33-tbg'))p.hidden=true});
    if(!/^#tbv-/.test(location.hash)){var f=$('.tbli a[data-t^="tbv-"]');if(f)f.click()}}
  if(page==='tableau-de-bord'&&MEMBRE&&ME.ex.length){var cur=$('.tbli a.on');if(cur&&cur.hidden){var v=$$('.tbli a[data-t]').filter(function(a){return !a.hidden})[0];if(v)v.click()}}

  // ================= Analytique (admin) : filtre par membre et par expert
  var af=$('.v33-af');
  if(af){var l=$('.v33-afl',af);function up(){var m=$('.v33-afm',af).value,x=$('.v33-afe',af).value;l.textContent=(m||x)?[m,x].filter(Boolean).join(', '):'Toute l’entreprise';toast('Analytique : '+l.textContent)}
    $$('select',af).forEach(function(s){s.addEventListener('change',up)})}
})();

/* v4.35 (add84) : derniers boutons sans réaction (langue déjà choisie, mot de passe incomplet), copie de lien sans erreur. Préfixe v34-. */
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  // copier un lien : si le presse-papiers est refusé, copie de secours, jamais d’erreur
  if(navigator.clipboard&&navigator.clipboard.writeText){var w=navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText=function(t){return w(t).catch(function(){var ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(_){}ta.remove()})}}
  // choix déjà sélectionné (langue, apparence…) : on le confirme
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.kv2 .seg a.on');if(!a)return;e.preventDefault();toast(a.textContent.trim()+' est déjà sélectionné')});
  // nouveau mot de passe : le bouton reste cliquable et dit ce qui manque
  var rf=$('[data-reset]'),sv=rf&&$('.mdsave',rf);
  if(sv){
    function sync(){var inv=sv.disabled;sv.disabled=false;sv.classList.toggle('v34-off',inv);sv.dataset.v34inv=inv?'1':''}
    $$('input',rf).forEach(function(i){i.addEventListener('input',sync)});sync();
    document.addEventListener('submit',function(e){if(e.target!==rf||sv.dataset.v34inv!=='1')return;e.preventDefault();e.stopImmediatePropagation();
      $('.mdrl',rf).classList.add('v34-hl');var p1=$('input[type=password]',rf),p2=$('.mdc2',rf);
      toast(!p1.value?'Saisissez un nouveau mot de passe':$$('.mdrl li:not(.ok)',rf).length?'Le mot de passe doit respecter les 3 règles':'Confirmez le mot de passe à l’identique');
      (!p1.value||$$('.mdrl li:not(.ok)',rf).length?p1:p2).focus()},true)}
})();

/* v4.36 (add85) : API et MCP (copie, demande d’accès), historique des conversations (piste B), chargement lent et panne,
   recherche globale (Ctrl K). Préfixe v35-. */
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function svg(p,c){return '<svg class="i s'+(c?' '+c:'')+'" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
  function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){return null}}
  function stop(e){e.preventDefault();e.stopPropagation()}
  function norm(t){return String(t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’']/g,' ')}
  function say(m){if(typeof toast==='function')toast(m)}
  var IC={search:svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),web:svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>'),
    tg:svg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>'),chat:svg('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>'),plus:svg('<path d="M5 12h14"/><path d="M12 5v14"/>'),
    alert:svg('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>'),
    retry:svg('<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>'),
    copy:svg('<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'),check:svg('<path d="M20 6 9 17l-5-5"/>'),
    key:svg('<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>'),
    clock:svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),enter:svg('<path d="M9 10 4 15l5 5"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>'),
    dir:svg('<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>'),
    img:svg('<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>'),
    sheet:svg('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>'),
    doc:svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>'),
    pdf:svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>'),
    ppt:svg('<path d="M2 3h20M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3M7 21l5-5 5 5"/>'),zip:svg('<path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4"/>')};
  IC.xls=IC.sheet;
  var page=(location.pathname.split('/').pop()||'').replace('.html','');
  var Q=new URLSearchParams(location.search);
  var NOM={djeneba:'Djénéba',fatima:'Fatima',koffi:'Koffi'},EX=NOM[page]?page:null;
  var PERS={admin:{n:'Aïcha Diabaté',p:'aicha',ex:['djeneba','fatima','koffi']},membre:{n:'Nadège Touré',p:'m_women_36',ex:['fatima','koffi']},membre0:{n:'Didier Yapi',p:'m_men_30',ex:[]}};
  var VUE=PERS[ls('v33-vue')]?ls('v33-vue'):'admin',ME=PERS[VUE],MEMBRE=VUE!=='admin';
  var TOP=$('header.top');

  // ================= 0. un choix déjà sélectionné (dont la langue par défaut) redit son toast à chaque clic (le toast repart visiblement)
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.kv2 .seg a.on, .lgseg a.on');if(!a)return;e.preventDefault();e.stopImmediatePropagation();
    var t=$('.toast');say(a.closest('.lgseg')?a.textContent.trim()+' est déjà la langue par défaut':a.textContent.trim()+' est déjà sélectionné');if(t){t.classList.remove('on');void t.offsetWidth;t.classList.add('on')}},true);

  // ================= 1. API et MCP : copier une clé, demander un accès
  function copier(t){try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t);return}}catch(_){}
    var ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(_){}ta.remove()}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.v35-cp');if(!b)return;stop(e);copier(b.dataset.v35c);
    b.classList.add('ok');b.innerHTML=IC.check;say('Clé copiée dans le presse-papiers');clearTimeout(b._t);b._t=setTimeout(function(){b.classList.remove('ok');b.innerHTML=IC.copy},1600)});
  function accs(){try{return JSON.parse(ls('v35-acc')||'[]')}catch(_){return []}}
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.v35-acc');if(!a)return;stop(e);var x=NOM[EX]||'cet expert';
    var r=accs();r.unshift({m:ME.n,p:ME.p,x:x,t:Date.now()});ls('v35-acc',JSON.stringify(r.slice(0,12)));
    say('Demande envoyée à votre admin : accès aux clés et serveurs de '+x)});
  // côté admin : la demande arrive dans les notifications et dans Membres
  if(!MEMBRE){var AR=accs();
    if(AR.length){var line=function(r){return r.m+' demande l’accès aux clés et serveurs de '+r.x};
      var h3=$('#notifs h3');if(h3){AR.slice().reverse().forEach(function(r){var d=document.createElement('div');d.className='nt v33-nt v35-nt';d.innerHTML='<span class="ic">'+IC.key+'</span><div><b>'+esc(line(r))+'</b><span>Demande d’un membre, à l’instant</span></div>';h3.insertAdjacentElement('afterend',d)});
        $$('[data-pop="notifs"] .bdg').forEach(function(b){b.textContent=(parseInt(b.textContent,10)||0)+AR.length})}
      var g=$('.ngrp .lb2');if(g&&page==='notifications'){AR.slice().reverse().forEach(function(r){var a=document.createElement('a');a.className='nrow unread v33-nt v35-nt';a.href='admin-connecteurs.html';a.innerHTML='<img class="nav" src="../img/'+r.p+'.jpg" alt=""><span class="grow"><b>'+esc(line(r))+'</b><span>Demande d’un membre</span></span><time>à l’instant</time><span class="nact">Répondre</span>';g.insertAdjacentElement('afterend',a)})}
      var box=$('.v33-reqs');if(box){box.hidden=false;AR.forEach(function(r,i){var d=document.createElement('div');d.className='v33-rq v35-rq';
        d.innerHTML='<img src="../img/'+r.p+'.jpg" alt=""><span class="grow"><b>'+esc(line(r))+'</b><small>Demande en attente de votre réponse</small></span><a class="btn p sm v35-rqok" href="#" data-h="1" data-i="'+i+'">Accorder</a><a class="btn o sm v35-rqno" href="#" data-h="1" data-i="'+i+'">Refuser</a>';box.appendChild(d)});
        box.addEventListener('click',function(e){var b=e.target.closest('.v35-rqok,.v35-rqno');if(!b)return;stop(e);var r=accs(),it=r[+b.dataset.i];r.splice(+b.dataset.i,1);ls('v35-acc',JSON.stringify(r));b.closest('.v35-rq').remove();
          $$('.v35-rq [data-i]',box).forEach(function(x,k){x.dataset.i=Math.floor(k/2)});
          say(b.classList.contains('v35-rqok')?'Accès accordé, '+(it?it.m.split(' ')[0]:'le membre')+' est prévenue':'Demande refusée, le membre est prévenu')})}}}

  // ================= 2. historique des conversations (piste B)
  var J=['Aujourd’hui','Hier','Cette semaine'];
  var CONV={
    fatima:[
      {id:'f1',t:'Post Facebook promo Sossa',c:'web',g:0,orig:1},
      {id:'f2',t:'Version print pour Yao',c:'tg',g:0,m:[['m','Fais une version print du post Sossa pour Yao, en A4.','10:40'],['l','C’est prêt : A4 en 300 dpi, avec les traits de coupe. Le fichier est dans Livrables, dossier Sossa.','10:41'],['m','Merci, envoie-la-lui.','10:43'],['l','Envoyée à Yao sur Telegram à 10:44.','10:44']]},
      {id:'f3',t:'Calendrier éditorial octobre',c:'web',g:1,m:[['m','Prépare le calendrier éditorial d’octobre pour Super Mint.','16:02'],['l','Voilà 12 publications sur le mois : 6 posts, 4 stories et 2 vidéos courtes, calées sur les temps forts d’octobre.','16:20'],['m','Ajoute un jeu concours la dernière semaine.','16:31'],['l','Ajouté le 27 octobre. Le calendrier est à jour dans Livrables, dossier Super Mint.','16:33']]},
      {id:'f4',t:'Brief vidéo 30 s',c:'tg',g:1,m:[['m','Il me faut le brief du film de 30 secondes pour Sossa.','11:05'],['l','Le voici : une famille au goûter, le paquet en gros plan, la promo à la fin. Trois plans, sans dialogue.','11:48'],['m','Parfait, garde la musique de la dernière campagne.','11:52'],['l','C’est noté, je l’ajoute au brief.','11:53']]},
      {id:'f5',t:'Rapport réseaux sociaux',c:'web',g:2,m:[['m','Fais le rapport des réseaux sociaux de septembre.','lun. 08:30'],['l','Le rapport est prêt : 48 publications, 212 000 vues, et les trois posts qui ont le mieux marché. Il est dans Livrables, dossier Rapports.','lun. 09:05']]},
      {id:'f6',t:'Idées concours Super Mint',c:'tg',g:2,m:[['m','Propose-moi trois idées de jeu concours pour Super Mint.','mar. 14:10'],['l','1. Photo du goûter le plus frais. 2. Devine le nouveau parfum. 3. Partage ta pause Super Mint. La deuxième coûte le moins cher en lots.','mar. 14:26']]},
      {id:'f7',t:'Veille concurrence',c:'web',g:2,m:[['m','Qu’ont publié les concurrents cette semaine ?','dim. 18:00'],['l','Deux promos de rentrée chez les concurrents, une vidéo qui a beaucoup tourné sur Instagram. Le détail est dans la veille de la semaine 39.','dim. 19:00']]}],
    koffi:[
      {id:'k1',t:'Packaging Super Mint édition limitée',c:'web',g:0,orig:1},
      {id:'k2',t:'Affiche promo rentrée Sossa',c:'tg',g:1,m:[['m','Il faut l’affiche de la promo rentrée Sossa pour les boutiques.','09:00'],['l','La voici en A2, dans la charte Sossa. Je prépare aussi la story pour Instagram.','09:12'],['m','Mets le prix plus haut.','09:20'],['l','C’est fait, la nouvelle version est dans Livrables, dossier Sossa.','09:24']]},
      {id:'k3',t:'Déclinaisons de septembre',c:'web',g:2,m:[['m','Décline les visuels validés de septembre pour tous les réseaux.','lun. 15:00'],['l','14 déclinaisons prêtes, au bon format pour Facebook, Instagram et les stories. Le pack est dans Livrables, dossier Exports.','lun. 19:10']]}],
    djeneba:[
      {id:'d1',t:'Point du jour et ventes Sossa',c:'web',g:0,orig:1},
      {id:'d2',t:'Brief du rendez-vous avec la banque',c:'tg',g:1,m:[['m','Prépare-moi le rendez-vous de demain avec la banque.','17:40'],['l','Le brief est prêt : qui vous recevez, l’historique des échanges et les trois points à obtenir. Il est dans Livrables, dossier Rendez-vous.','18:10'],['m','Ajoute le montant de la ligne de crédit actuelle.','18:15'],['l','Ajouté en tête du brief.','18:16']]},
      {id:'d3',t:'Relevé de décisions du 24 septembre',c:'web',g:2,m:[['m','Fais le relevé de décisions du comité de ce matin.','jeu. 12:30'],['l','Cinq décisions, avec un responsable et une date pour chacune. Je relance chaque responsable la veille de l’échéance.','jeu. 17:30']]}]};
  var SUG={fatima:['Prépare les posts de la semaine pour Sossa','Fais le rapport des réseaux sociaux du mois','Propose un jeu concours pour Super Mint'],
    koffi:['Décline l’affiche Sossa pour Instagram','Prépare le bon à tirer du packaging','Vérifie la charte des visuels du jour'],
    djeneba:['Prépare mon point du jour','Rédige la note pour le comité de direction','Prépare le brief de mon prochain rendez-vous']};
  // chat entreprise : les conversations de la liste existante (mêmes titres)
  var MEMS=[{id:'m0',t:'Promos Sossa de la rentrée 2025',c:'web',g:0,fil:'c1'},{id:'m1',t:'Qui gère le compte Carrefour ?',c:'tg',g:0,fil:'c2'},
    {id:'m2',t:'Prix de gros Super Mint par région',c:'web',g:1,m:[['m','Quels sont nos prix de gros Super Mint par région ?'],['l','Abidjan et le Sud : 1 450 F CFA le carton. Centre et Nord : 1 520 F CFA, transport compris. Grille mise à jour le 1er septembre.','Grille tarifaire 2026']]},
    {id:'m3',t:'Résumé du comité du 24 septembre',c:'web',g:1,m:[['m','Résume le comité de direction du 24 septembre.'],['l','Trois décisions : la promo rentrée Sossa est prolongée d’une semaine, le recrutement d’un commercial pour le Nord est lancé, et le budget packaging est validé.','Relevé de décisions du 24/09']]},
    {id:'m4',t:'Fournisseurs d’emballage carton',c:'web',g:2,m:[['m','Avec quels fournisseurs de cartons travaillons-nous ?'],['l','Deux fournisseurs : SIVOP pour les cartons standards, et un imprimeur de Yopougon pour les éditions limitées.','Liste des fournisseurs']]},
    {id:'m5',t:'Règles de congés terrain',c:'tg',g:2,m:[['m','Quelles sont les règles de congés pour les équipes terrain ?'],['l','Deux semaines minimum à poser entre juin et septembre, et une demande au moins un mois avant, validée par le chef de zone.','Règlement intérieur']]},
    {id:'m6',t:'Objectifs ventes T4',c:'web',g:2,m:[['m','Quels sont nos objectifs de ventes pour le T4 ?'],['l','+12 % sur Sossa et +8 % sur Super Mint par rapport au T4 2025, avec un effort sur les boutiques de quartier.','Budget 2026']]}];
  var MSUG=[['Quelles promos avons-nous faites à la rentrée ?','m0'],['Qui gère le compte Carrefour ?','m1'],['Résume le dernier comité de direction','m3']];
  var TGI='<span class="v30-tg" tabindex="0" role="img" aria-label="Envoyé depuis Telegram" title="Envoyé depuis Telegram" data-tip="Envoyé depuis Telegram"><img src="../img/lg/telegram.png" alt="" width="14" height="14"></span>';
  var V35={};window.v35=V35;

  // menu déroulant commun : bouton « Conversations ▾ », « Nouvelle », panneau, recherche en direct
  function histo(o){
    var bar=document.createElement('div');bar.className='v35-hb';
    bar.innerHTML='<button type="button" class="v35-btn v35-cvb" data-h="1" aria-haspopup="true" aria-expanded="false">'+IC.chat+'<span class="v35-bl">Conversations</span> <span class="v35-car" aria-hidden="true">▾</span></button>'+
      '<button type="button" class="v35-btn v35-nw" data-h="1">'+IC.plus+'<span>Nouvelle</span></button>'+(o.title?'':'<b class="v35-cur"></b>');
    o.mount(bar);
    var pn=document.createElement('div');pn.className='v35-hp';pn.hidden=true;pn.setAttribute('role','dialog');pn.setAttribute('aria-label','Conversations');
    pn.innerHTML='<div class="v35-hph"><b>Conversations</b><button type="button" class="v35-hx" data-h="1" aria-label="Fermer">×</button></div>'+
      '<label class="v35-hs">'+IC.search+'<input type="search" placeholder="Chercher" aria-label="Chercher une conversation"></label><div class="v35-hl"></div>';
    o.host.appendChild(pn);
    var btn=$('.v35-cvb',bar),inp=$('input',pn),list=$('.v35-hl',pn),cur=o.start;
    function title(t){if(o.title)o.title(t);else $('.v35-cur',bar).textContent=t}
    function render(){var q=norm(inp.value.trim()),h='',n=0;
      J.forEach(function(lab,gi){var L=o.sess.filter(function(s){return s.g===gi&&(!q||norm(s.t).indexOf(q)>=0)});if(!L.length)return;
        h+='<div class="v35-hg">'+lab+'</div>';L.forEach(function(s){n++;h+='<button type="button" class="v35-hi'+(s.id===cur?' on':'')+'" data-h="1" data-id="'+s.id+'"'+(s.id===cur?' aria-current="true"':'')+'>'+(s.c==='tg'?IC.tg:IC.web)+'<span>'+esc(s.t)+'</span><small>'+(s.c==='tg'?'Telegram':'Web')+'</small></button>'})});
      list.innerHTML=n?h:'<p class="v35-hn">Aucune conversation pour « '+esc(inp.value.trim())+' ».</p>'}
    function open(on){pn.hidden=!on;btn.setAttribute('aria-expanded',on);if(on){inp.value='';render();setTimeout(function(){inp.focus()},30)}}
    function show(id){var s=o.sess.filter(function(x){return x.id===id})[0];if(!s&&id!=='new')return;
      if(cur===id&&id!=='new'){open(false);return}
      o.leave(cur);cur=id;o.show(s||null);title(s?s.t:'Nouvelle conversation');open(false)}
    btn.addEventListener('click',function(e){stop(e);open(pn.hidden)});
    $('.v35-nw',bar).addEventListener('click',function(e){stop(e);if(cur==='new'){o.show(null);open(false);say('Écrivez votre demande, ou choisissez une suggestion')}else show('new')});
    $('.v35-hx',pn).addEventListener('click',function(e){stop(e);open(false)});
    inp.addEventListener('input',render);
    inp.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();open(false);btn.focus()}if(e.key==='Enter'){e.preventDefault();var f=$('.v35-hi',list);if(f)f.click()}});
    list.addEventListener('click',function(e){var b=e.target.closest('.v35-hi');if(!b)return;stop(e);show(b.dataset.id)});
    pn.addEventListener('click',function(e){e.stopPropagation()});
    document.addEventListener('click',function(e){if(!pn.hidden&&!e.target.closest('.v35-hb'))open(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!pn.hidden){open(false)}});
    var s0=o.sess.filter(function(x){return x.id===cur})[0];title(s0?s0.t:'Nouvelle conversation');
    return {show:show,cur:function(){return cur},add:function(s){o.sess.unshift(s);cur=s.id;title(s.t)}}}

  // ---- discussion d’un expert
  var CH=EX&&$('#discussion .chat2'),TH=CH&&$('.thread',CH);
  if(CH&&TH&&CONV[EX]){
    CH.classList.add('v35-hc');var S=CONV[EX],nodes0=[].slice.call(TH.childNodes);S.forEach(function(s){if(s.orig)s.nodes=nodes0});
    var dayOf=function(s){return s.g===0?'Aujourd’hui':s.g===1?'Hier':'Cette semaine'};
    var build=function(s){var h='<span class="day">'+dayOf(s)+'</span>';s.m.forEach(function(x){h+='<div class="msg '+(x[0]==='m'?'moi':'lui')+'"><div class="bub">'+esc(x[1])+'</div><time>'+esc(x[2])+(x[0]==='m'&&s.c==='tg'?TGI:'')+'</time></div>'});
      var d=document.createElement('div');d.innerHTML=h;return [].slice.call(d.childNodes)};
    var emptyEl=function(){var d=document.createElement('div');d.className='v35-empty';
      d.innerHTML='<h3>Nouvelle conversation</h3><p>Que voulez-vous confier à '+NOM[EX]+' ?</p><div class="v35-sg">'+SUG[EX].map(function(t){return '<button type="button" data-h="1">'+esc(t)+'</button>'}).join('')+'</div>';return d};
    var hx=histo({host:CH,sess:S,start:S[0].id,mount:function(b){CH.insertBefore(b,CH.firstChild)},
      leave:function(id){var s=S.filter(function(x){return x.id===id})[0];var kids=[].slice.call(TH.childNodes);kids.forEach(function(k){k.remove()});if(s)s.nodes=kids},
      show:function(s){TH.classList.toggle('v35-new',!s);[].slice.call(TH.childNodes).forEach(function(k){k.remove()});
        (s?(s.nodes||(s.nodes=build(s))):[emptyEl()]).forEach(function(k){TH.appendChild(k)});TH.scrollTop=TH.scrollHeight}});
    // une suggestion part comme un vrai message ; le premier message d’une nouvelle conversation la range dans l’historique
    TH.addEventListener('click',function(e){var b=e.target.closest('.v35-sg button');if(!b)return;stop(e);var i=$('.v33-in',CH),sb=$('.v33-send',CH);
      if(i&&sb){i.value=b.textContent;sb.click()}else say('Message envoyé à '+NOM[EX])});
    new MutationObserver(function(){if(hx.cur()!=='new')return;var m=$('.msg.moi .bub',TH);if(!m)return;var em=$('.v35-empty',TH);if(em)em.remove();TH.classList.remove('v35-new');
      var t=m.textContent.trim();if(t.length>42)t=t.slice(0,40).replace(/\s+\S*$/,'')+'…';hx.add({id:'n'+Date.now(),t:t,c:'web',g:0});
      var d=document.createElement('div');d.className='msg lui';d.innerHTML='<span class="typing"><i></i><i></i><i></i></span><time>'+NOM[EX]+' s’y met</time>';TH.appendChild(d);
      setTimeout(function(){d.innerHTML='<div class="bub">C’est noté, je m’y mets. Je vous montre une première version dans cette conversation.</div><time>à l’instant</time>'},900)}).observe(TH,{childList:true});
    V35.conv=function(id){var a=$('.xnav a[data-t="discussion"]');if(a)a.click();hx.show(id)};
  }
  // ---- chat entreprise
  var GP=page==='memoire'&&$('.gpt'),GM=GP&&$('.gmain',GP),GH=GM&&$('.ghead',GM);
  if(GP&&GM&&GH){
    GP.classList.add('v35-gb');var gtt=$('.gtt',GH),conv=$('.gconv',GM),ga=$('.gm2.lui .ga',GM);var gai=ga?ga.innerHTML:'';
    MEMS.forEach(function(s){if(s.fil||$('#v35-'+s.id))return;var d=document.createElement('div');d.className='gfil';d.id='v35-'+s.id;d.style.display='none';
      d.innerHTML='<div class="gm2 moi"><div class="bq">'+esc(s.m[0][1])+'</div></div><div class="gm2 lui"><span class="ga">'+gai+'</span><div class="ba"><p>'+esc(s.m[1][1])+'</p><div class="srcs"><span>'+IC.doc+' '+esc(s.m[1][2])+'</span></div></div></div>';conv.appendChild(d);s.fil='v35-'+s.id});
    var hg=$('.ghello',GM);if(hg&&!$('.v35-sg',GM)){var sg=document.createElement('div');sg.className='v35-sg';sg.innerHTML=MSUG.map(function(x){return '<button type="button" data-h="1" data-id="'+x[1]+'">'+esc(x[0])+'</button>'}).join('');hg.insertAdjacentElement('afterend',sg)}
    var hm=histo({host:GM,sess:MEMS,start:'new',mount:function(b){GH.insertBefore(b,GH.firstChild)},title:function(t){gtt.textContent=t},leave:function(){},
      show:function(s){$$('.gf').forEach(function(x){x.classList.remove('on')});if(!s){GM.classList.add('vide');var i=$('.gin2 .v33-in',GM);if(i)setTimeout(function(){i.focus()},30);return}
        GM.classList.remove('vide');$$('.gfil',GM).forEach(function(f){f.style.display=f.id===s.fil?'block':'none'})}});
    GM.addEventListener('click',function(e){var b=e.target.closest('.v35-sg button');if(!b)return;stop(e);hm.show(b.dataset.id)});
    V35.conv=function(id){hm.show(id)};
  }
  if(Q.get('conv')&&V35.conv)V35.conv(Q.get('conv'));

  // ================= 3. chargement lent (?lent=1) et panne (?panne=1)
  if(Q.get('lent')==='1')ss('v35-lent','1');if(Q.get('lent')==='0')ss('v35-lent',null);
  var PANNE=Q.get('panne')==='1';
  var MAIN=TOP&&($('.xp')||$('.gpt')||$('.chatp')||$('.adm .sform')||$('main .page'));
  function skel(){var x=MAIN&&MAIN.classList.contains('xp'),d=document.createElement('div');d.className='v35-sk'+(x?' x':'');d.setAttribute('aria-busy','true');d.setAttribute('aria-label','Chargement');
    d.innerHTML=x?'<i class="c"></i><div class="col" style="background:none"><i></i><i class="b"></i><i></i></div>':'<i class="t"></i><i class="s"></i><div class="r3"><i></i><i></i><i></i></div><i class="l"></i><i class="l"></i><i class="l"></i>';return d}
  function lent(done){if(!MAIN){if(done)done();return}if(MAIN._v35)return;var d=skel();MAIN._v35=1;MAIN.hidden=true;MAIN.parentNode.insertBefore(d,MAIN);
    setTimeout(function(){d.remove();MAIN.hidden=false;MAIN._v35=0;if(done)done()},1500)}
  var ADML={admin:'la vue d’ensemble','admin-membres':'les membres','admin-membre':'la fiche du membre','admin-experts':'les experts','admin-canaux':'les canaux','admin-connecteurs':'les connecteurs',
    'admin-facturation':'la facturation','admin-general':'les détails de l’entreprise','admin-analytics':'l’analytique','admin-modeles':'les modèles','admin-profil':'votre profil'};
  function zones(){var Z=[['.nowbox','ce que font vos experts'],['.crew2','votre équipe'],['section.pcs2:not(.crew2)','les experts à recruter',1],['.tbx','vos tableaux de bord'],['.ngrp','vos notifications',1],
      ['.mp','votre profil'],['.rq','la fiche de poste'],['.chatp .cl','vos discussions'],['.chatp .cm','les messages'],['.gmain','la conversation']];
    if(EX){var n=NOM[EX];Z=Z.concat([['#discussion .thread','la discussion avec '+n],['#discussion .rail','ce que fait '+n],['#resume','le résumé'],['#analytique','l’analytique'],['#drive','les livrables'],
      ['#mail','les emails'],['#calendrier','l’agenda'],['#profil','le profil'],['#canaux','les canaux'],['#connecteurs','les connecteurs'],['#fiche','la fiche de poste']])}
    if($('.adm .sform'))Z.push(['.adm .sform',ADML[page]||'cette page']);return Z}
  function panne(){var k=0;zones().forEach(function(z){var L=$$(z[0]);if(z[2])L=L.slice(0,1);L.forEach(function(el){if(el.classList.contains('v35-ko'))return;
      [].forEach.call(el.children,function(c){if(c.matches('.hello,.h2x:first-child,.v33-rgh,.ghead'))c.classList.add('v35-keep')});
      var d=document.createElement('div');d.className='v35-err';d.setAttribute('role','alert');d.innerHTML=IC.alert+'<span>Impossible de charger '+esc(z[1])+'.</span><button type="button" class="v35-rt" data-h="1">'+IC.retry+' Réessayer</button>';
      var keep=[].filter.call(el.children,function(c){return c.classList.contains('v35-keep')}).pop();if(keep)keep.insertAdjacentElement('afterend',d);else el.insertBefore(d,el.firstChild);el.classList.add('v35-ko');k++})});
    var xm=EX&&$('.xmain');if(xm&&!$('.v35-down',xm)){var b=document.createElement('div');b.className='v35-down';b.setAttribute('role','status');b.innerHTML='<span class="v35-spin" aria-hidden="true"></span><span>'+NOM[EX]+' est injoignable pour le moment, on réessaie.</span>';xm.insertBefore(b,xm.firstChild)}
    return k}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.v35-rt');if(!b)return;stop(e);var z=b.closest('.v35-ko');b.closest('.v35-err').remove();
    if(z){z.classList.remove('v35-ko');$$('.v35-keep',z).forEach(function(c){c.classList.remove('v35-keep')})}
    if(!$('#discussion .v35-ko')){var d=$('.v35-down');if(d)d.remove()}});
  V35.panne=panne;V35.lent=lent;
  if(MAIN){if(ss('v35-lent'))lent(function(){if(PANNE)panne()});else if(PANNE)panne()}
  // menu du compte : sous « Simuler une panne du chat »
  function lzt(){return ss('v35-lent')?'Arrêter le chargement lent':'Simuler un chargement lent'}
  $$('.v33-pz').forEach(function(pz){var a=document.createElement('a');a.className=pz.className.replace('v33-pz','v35-lz');a.href='#';a.dataset.h='1';a.innerHTML=IC.clock+' <span>'+lzt()+'</span>';pz.insertAdjacentElement('afterend',a)});
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.v35-lz');if(!a)return;stop(e);if(ss('v35-lent'))ss('v35-lent',null);else ss('v35-lent','1');
    $$('.v35-lz span').forEach(function(s){s.textContent=lzt()});
    if(ss('v35-lent')){say('Chargement lent : chaque page attend 1,5 s avant de s’afficher');var m=a.closest('.acm,.pop,#sh-moi');if(m&&m.classList.contains('on'))m.classList.remove('on');document.body.classList.remove('shlock');lent()}else say('Chargement normal rétabli')});

  // ================= 4. recherche globale (Ctrl K ou Cmd K ; loupe en 390 px)
  if(TOP){
    var MAC=/Mac|iPhone|iPad/.test(navigator.platform||'');
    var TEAM=[['djeneba','Djénéba','Chief of Staff'],['fatima','Fatima','Marketing et contenu'],['koffi','Koffi','Design']];
    var RECR=[['adjoua','Adjoua','Recrutement'],['alioune','Alioune','Investissement'],['awa','Awa','Service client'],['fatou','Fatou','RH et paie'],['ibrahim','Ibrahim','Juridique'],
      ['kouassi','Kouassi','Ventes'],['mamadou','Mamadou','Finance'],['nadia','Nadia','Données'],['salif','Salif','Opérations']];
    var IDX=null;
    var fd=function(d){if(!d)return '';var p=d.split(/[- :]/);return p[2]+'/'+p[1]};
    function index(){if(IDX)return IDX;IDX=[];var mine=ME.ex,dl=['aujourd’hui','hier','cette semaine'];
      TEAM.forEach(function(x){if(mine.indexOf(x[0])<0)return;IDX.push({g:0,t:x[1],s:x[2]+', dans votre équipe',k:x[2],h:x[0]+'.html',av:x[0]})});
      if(!MEMBRE)RECR.forEach(function(x){IDX.push({g:0,t:x[1],s:x[2]+', à recruter',k:x[2]+' recruter',h:'recrue-'+x[0]+'.html',av:x[0]})});
      TEAM.forEach(function(x){if(mine.indexOf(x[0])<0||!CONV[x[0]])return;CONV[x[0]].forEach(function(s){IDX.push({g:1,t:s.t,s:x[1]+', '+dl[s.g]+', '+(s.c==='tg'?'Telegram':'web'),k:x[1],h:x[0]+'.html?conv='+s.id+'#discussion',ic:s.c,ex:x[0],cv:s.id})})});
      if(ls('v33-ce')!=='off')MEMS.forEach(function(s){IDX.push({g:1,t:s.t,s:'Chat entreprise, '+dl[s.g]+', '+(s.c==='tg'?'Telegram':'web'),k:'chat entreprise',h:'memoire.html?conv='+s.id,ic:s.c,mem:1,cv:s.id})});
      var LV={};try{LV=JSON.parse($('#v35-lv').textContent)}catch(_){}
      TEAM.forEach(function(x){if(mine.indexOf(x[0])<0||!LV[x[0]])return;
        (function walk(L,pre){L.forEach(function(it){var pa=pre.concat(it.k==='dir'?[it.n]:[]);
          if(it.k==='dir'){var nb=0;(function c(z){z.forEach(function(y){if(y.k==='dir')c(y.c);else nb++})})(it.c);
            IDX.push({g:2,t:it.n,s:'Dossier, livrables de '+x[1]+(pre.length?', '+pre.join(', '):'')+', '+nb+' fichier'+(nb>1?'s':''),k:x[1],h:x[0]+'.html?lv='+encodeURIComponent(pa.join('/'))+'#drive',fk:'dir',ex:x[0],lv:pa.join('/')});walk(it.c,pa)}
          else IDX.push({g:2,t:it.n,s:'Livrables de '+x[1]+(pre.length?', '+pre.join(', '):'')+', modifié le '+fd(it.d),k:x[1],h:x[0]+'.html?lv='+encodeURIComponent(pre.join('/'))+'&f='+encodeURIComponent(it.n)+'#drive',fk:it.k,ex:x[0],lv:pre.join('/'),f:it.n})})})(LV[x[0]],[])});
      IDX.forEach(function(it){it.nt=norm(it.t);it.nk=norm(it.s+' '+it.k)});return IDX}
    var GL=['Experts','Conversations','Livrables'];
    var sbtn=document.createElement('button');sbtn.type='button';sbtn.className='v35-sb';sbtn.dataset.h='1';sbtn.setAttribute('aria-label','Rechercher ('+(MAC?'Cmd':'Ctrl')+' K)');sbtn.setAttribute('aria-keyshortcuts','Control+K Meta+K');
    sbtn.innerHTML=IC.search+'<span>Rechercher</span><kbd>'+(MAC?'⌘':'Ctrl')+' K</kbd>';
    var first=$('.tbtn',TOP);if(first)TOP.insertBefore(sbtn,first);else TOP.appendChild(sbtn);
    var so=document.createElement('div');so.className='v35-so';so.setAttribute('role','dialog');so.setAttribute('aria-modal','true');so.setAttribute('aria-label','Recherche');
    so.innerHTML='<div class="v35-sp"><div class="v35-sh">'+IC.search+'<input type="search" placeholder="Chercher un expert, une conversation, un livrable" aria-label="Rechercher" role="combobox" aria-expanded="true" aria-controls="v35-sl" aria-autocomplete="list" autocomplete="off">'+
      '<span class="v35-kb">Échap</span><button type="button" class="v35-sx" data-h="1">Fermer</button></div><div class="v35-sl" id="v35-sl" role="listbox"></div>'+
      '<div class="v35-sf"><span><span class="v35-kb">↑</span> <span class="v35-kb">↓</span> pour choisir</span><span><span class="v35-kb">Entrée</span> pour ouvrir</span><span><span class="v35-kb">Échap</span> pour fermer</span></div></div>';
    document.body.appendChild(so);
    var sin=$('input',so),sl=$('.v35-sl',so),act=0,shown=[];
    function rec(){try{return JSON.parse(ls('v35-rec')||'[]')}catch(_){return []}}
    function hl(t,q){if(!q)return esc(t);var n=norm(t),i=n.indexOf(q);if(i<0)return esc(t);return esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length))}
    function icon(it){if(it.av)return '<span class="v35-ic av"><img src="../img/'+it.av+'.jpg" alt=""></span>';if(it.g===1)return '<span class="v35-ic">'+(it.ic==='tg'?IC.tg:IC.web)+'</span>';return '<span class="v35-ic">'+(IC[it.fk]||IC.pdf)+'</span>'}
    function srender(){var raw=sin.value.trim(),q=norm(raw),I=index(),h='';shown=[];
      if(!q){var R=rec().map(function(k){return I.filter(function(it){return it.h===k})[0]}).filter(Boolean);
        if(!R.length)R=[I.filter(function(it){return it.g===0})[0],I.filter(function(it){return it.g===1})[0],I.filter(function(it){return it.g===2&&it.f})[0]].filter(Boolean);
        if(R.length){h+='<div class="v35-sg2">Récents</div>';R.slice(0,6).forEach(function(it){shown.push(it);h+=row(it,'')})}}
      else{GL.forEach(function(lab,gi){var L=I.filter(function(it){return it.g===gi&&(it.nt.indexOf(q)>=0||it.nk.indexOf(q)>=0)}).map(function(it){var p=it.nt.indexOf(q);return {it:it,sc:p===0?0:p>0&&/\s/.test(it.nt.charAt(p-1))?1:p>0?2:3}}).sort(function(a,b){return a.sc-b.sc});
        if(!L.length)return;h+='<div class="v35-sg2">'+lab+'</div>';L.slice(0,gi===2?6:5).forEach(function(o){shown.push(o.it);h+=row(o.it,q)})});
        if(!shown.length)h='<p class="v35-snone">Aucun résultat pour « '+esc(raw)+' ».</p>'}
      sl.innerHTML=h;act=0;hiAct()}
    function row(it,q){var i=shown.length-1;return '<a class="v35-si" role="option" id="v35-o'+i+'" data-i="'+i+'" href="'+esc(it.h)+'">'+icon(it)+'<span class="v35-tx"><b>'+hl(it.t,q)+'</b><small>'+esc(it.s)+'</small></span><span class="v35-go">'+IC.enter+'</span></a>'}
    function hiAct(){$$('.v35-si',sl).forEach(function(a,i){var on=i===act;a.classList.toggle('on',on);a.setAttribute('aria-selected',on);if(on){sin.setAttribute('aria-activedescendant',a.id);a.scrollIntoView({block:'nearest'})}})}
    function sopen(){so.classList.add('on');document.body.classList.add('shlock');sin.value='';srender();setTimeout(function(){sin.focus()},20)}
    function sclose(){so.classList.remove('on');document.body.classList.remove('shlock')}
    function go(it){var r=rec().filter(function(k){return k!==it.h});r.unshift(it.h);ls('v35-rec',JSON.stringify(r.slice(0,6)));sclose();
      var tgt=it.h.split(/[?#]/)[0].replace('.html','');
      if(tgt===page&&it.cv&&V35.conv){V35.conv(it.cv);return}
      if(tgt===page&&it.lv!==undefined&&V35.liv){V35.liv(it.lv,it.f);return}
      if(tgt===page&&!it.cv&&it.lv===undefined){say('Vous êtes déjà sur cette page');return}
      location.href=it.h}
    sbtn.addEventListener('click',function(e){stop(e);sopen()});
    $('.v35-sx',so).addEventListener('click',function(e){stop(e);sclose()});
    so.addEventListener('click',function(e){if(e.target===so)sclose()});
    sl.addEventListener('click',function(e){var a=e.target.closest('.v35-si');if(!a)return;e.preventDefault();var it=shown[+a.dataset.i];if(it)go(it)});
    sl.addEventListener('mousemove',function(e){var a=e.target.closest('.v35-si');if(a&&+a.dataset.i!==act){act=+a.dataset.i;hiAct()}});
    sin.addEventListener('input',srender);
    sin.addEventListener('keydown',function(e){var n=shown.length;
      if(e.key==='ArrowDown'){e.preventDefault();if(n){act=(act+1)%n;hiAct()}}
      else if(e.key==='ArrowUp'){e.preventDefault();if(n){act=(act-1+n)%n;hiAct()}}
      else if(e.key==='Enter'){e.preventDefault();if(shown[act])go(shown[act])}
      else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();sclose();sbtn.focus()}});
    document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&!e.altKey&&(e.key==='k'||e.key==='K')){e.preventDefault();if(so.classList.contains('on'))sclose();else sopen()}
      else if(e.key==='Escape'&&so.classList.contains('on')){sclose()}});
  }

  // ================= livrable ouvert depuis la recherche : onglet Livrables, bon dossier, aperçu
  if(EX&&$('#drive .v33-lv')){
    V35.liv=function(path,f){var a=$('.xnav a[data-t="drive"]')||$('[data-t="drive"]');if(a)a.click();setTimeout(function(){nav(path,f)},30)};
    var nav=function(path,f){
      var home=$('#drive [data-v33cr="-1"]');if(home)home.click();var s=$('#drive .v33-ls input');if(s&&s.value){s.value='';s.dispatchEvent(new Event('input'))}
      (path?path.split('/'):[]).forEach(function(n){var r=$$('#drive .v33-lt .v33-r.dir').filter(function(r){var b=$('.v33-nm b',r);return b&&b.textContent===n})[0];if(r)r.click()});
      if(f){var r=$$('#drive .v33-lt .v33-r:not(.dir):not(.v33-th)').filter(function(r){var b=$('.v33-nm b',r);return b&&b.textContent===f})[0];if(r)r.click()}};
    if(Q.get('lv')!==null)setTimeout(function(){V35.liv(Q.get('lv'),Q.get('f'))},0);
  }
})();
