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
document.querySelectorAll('[data-open="cz"]').forEach(function(b){b.addEventListener('click',function(){var z=document.querySelector('#cz .pn');z.classList.remove('done');z.querySelector('.czn').textContent=b.dataset.app||"l’outil"})});
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
  if(st)st.innerHTML=p?'<span class="dot idle"></span> En pause':'<span class="dot"></span> Au travail';toast(p?'En pause : plus aucune tâche ne démarre':'De retour au travail')})});

// Arborescence du drive
document.querySelectorAll('.tree a').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();a.parentNode.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)})})});

// Messages explicites sur le reste
var MSG={'PDF':'Facture téléchargée','Exporter en CSV':'Export prêt : suivi-unifood-septembre.csv','Payer par mobile money':'Paiement lancé sur Wave, validez sur votre téléphone',
 'Ajouter':'Ajouté','Nouveau':'Nouveau dossier créé','Configurer':'Réglage enregistré','Gérer':'Réglages ouverts','Changer':'Choisissez le nouveau logo',
 'Ajouter une source':'Choisissez la source : Drive, SharePoint ou un site','Connecter un agenda':'Agenda Google relié','Ajouter un responsable':'Responsable ajouté',
 'Suggérer':'Djénéba propose une routine dans la discussion','Modifier':'Modification ouverte','Répondre':'Réponse préparée par l’Expert, à relire','Transférer':'Choisissez le destinataire',
 'Retirer':'Retiré','Écouter':'Lecture du message vocal','Ouvrir':'Ouverture du compte de travail','Afficher plus':'Dix livrables de plus','Nouvelle discussion':'Choisissez un Expert ou un collègue',
 'Changer son visage':'Nouveau visage généré','Tout mettre en pause':'Toute l’équipe est en pause','Pause':'Routine en pause','Copier le lien':'Lien copié'};
document.addEventListener('click',function(e){var el=e.target.closest('a[href="#"], button');if(!el||el.dataset.h||el.closest('.modal [data-close]'))return;
  if(el.matches('[data-pop],[data-open],[data-go],[data-t],[data-conv],[data-close],[data-f],.chip,.czgo,.go,.pc,.xcard'))return;if(el.closest('[data-cf],.seg2,.opts,[data-filter],.drawer'))return;
  var lab=(el.dataset.toast)||(el.textContent.trim()||el.getAttribute('aria-label')||'');e.preventDefault();toast(MSG[lab]||el.dataset.toast||(lab?lab+' : c’est fait':'C’est fait'))});

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
document.querySelectorAll('.jgo').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var m=document.querySelector('.jm.on .grow');b.closest('.modal').classList.remove('on');toast('Paiement envoyé'+(m?', '+m.textContent:'')+' : validez sur votre téléphone')})});
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
    dr.querySelector('.done').textContent=dr.dataset.nom+' rejoint '+(who==='Moi'?'votre équipe':(who==='tout le service'?'le service':'l’équipe de '+who))+'. '+p.charAt(0).toUpperCase()+p.slice(1)+' '+(who==='Moi'?'vous':'lui')+' écrit dans quelques minutes.'})}

// v4.5 : page recrue (assigner, canaux, confirmation)
document.querySelectorAll('.rqbox .as').forEach(function(a){a.addEventListener('click',function(){var on=a.parentNode.querySelectorAll('.as.on');if(a.classList.contains('on')&&on.length===1)return;a.classList.toggle('on')})});
document.querySelectorAll('.dt').forEach(function(t){t.addEventListener('click',function(){t.classList.toggle('on')})});
document.querySelectorAll('.rqgo').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();document.getElementById('rq-go').scrollIntoView({behavior:'smooth',block:'start'})})});
document.querySelectorAll('.rqok').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var box=b.closest('.rqbox'),who=[].map.call(box.querySelectorAll('.as.on'),function(x){return x.dataset.who}).join(', ')||'Moi',n=b.dataset.nom,p=b.dataset.pron||'il';
  var ch=[].map.call(box.querySelectorAll('.dt.on b'),function(x){return x.textContent}).join(', ');
  box.querySelector('.rqdone span').textContent=n+' rejoint '+(who==='Moi'?'votre équipe':(who==='tout le service'?'le service':'l’équipe de '+who))+'. '+p.charAt(0).toUpperCase()+p.slice(1)+' '+(who==='Moi'?'vous':'lui')+' écrit dans quelques minutes'+(ch?', sur '+ch:'')+'.';
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
    if(!top[0].n){res.innerHTML='<p>Je n’ai pas trouvé d’Expert évident. Dites-m’en un peu plus : quel métier, quel résultat attendu&nbsp;?</p>';res.hidden=false;return}
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
  all.forEach(function(x){x.classList.toggle('on',x===v)});toast('Nouvelle voix : '+v.querySelector('b').textContent)})});
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
  a.parentNode.querySelectorAll('a').forEach(function(x){x.classList.toggle('on',x===a)});toast('Chiffres : '+a.textContent.toLowerCase())})});

// v4.13 interrupteurs, paiement, fichiers
document.querySelectorAll('.swx').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var off=b.classList.toggle('off');toast(b.dataset.nom+(off?' : en pause':' : en service'))})});
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
  document.querySelectorAll('[data-dup]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();toast('Copie créée : « '+a.dataset.dup+' (copie) », dans Mes tableaux, à adapter avant de la partager')})});
})();

// v4.16 bascule Mes tableaux / Partagés avec moi, mode édition, recherche, tableau préréglé
(function(){
  var w=document.querySelector('.tbwrap');
  if(w){w.querySelectorAll('.tbsw button').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();
    w.querySelectorAll('.tbsw button').forEach(function(x){x.classList.toggle('on',x===b)});w.classList.toggle('shm',b.dataset.sw==='shared');
    var first=w.querySelector('.tbs3 a[data-g="'+b.dataset.sw+'"]');if(first)first.click()})});
    var h=location.hash.slice(1);var a=h&&w.querySelector('.tbs3 a[data-t="'+h+'"]');if(a&&a.dataset.g==='shared'){w.classList.add('shm');w.querySelectorAll('.tbsw button').forEach(function(x){x.classList.toggle('on',x.dataset.sw==='shared')})}}
  document.querySelectorAll('.tbed').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var p=b.closest('.panel');var on=p.classList.toggle('editing');b.classList.toggle('on',on);
    b.querySelector('span').textContent=on?'Enregistrer':'Modifier';if(on)toast('Mode édition : modifiez, masquez ou retirez les blocs')})});
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
    var a=tu?'Les visuels de la promo Sossa sont prêts, tu peux les valider ?':'Les visuels de la promo Sossa sont prêts, pouvez-vous les valider ?';
    var pts=['3 visuels, prix en grand','Publication prévue demain 9 h','Version print envoyée à Yao'];
    var body;
    if(sty==='p')body=(len==='c'?pts.slice(0,1):len==='d'?pts.concat(['Budget sponsorisé : 150 000 FCFA sur 5 jours']):pts).map(function(x){return '• '+x}).join('\n');
    else if(sty==='t')body='Visuel | Format | État\nPost Facebook | Carré | Prêt\nStory Instagram | 9:16 | Prêt'+(len==='c'?'':'\nAffiche print | A3 | Chez Yao');
    else body=len==='c'?'Tout est prêt de mon côté.':len==='d'?'J’ai repris vos remarques : le prix est passé en grand et le logo Sossa remonte en haut. La publication est prévue demain à 9 h, et la version print part chez Yao dès votre accord. Si vous préférez une autre date, je décale la campagne.':'Le prix est passé en grand comme demandé. Dès votre accord, je publie et j’envoie la version print à Yao.';
    var e=emo===2?' 🎉':emo===1?' 🙂':'';
    out.textContent=hi+'\n'+a+e+'\n'+body+'\n'+(reg==='d'?'Fatima':tu?'Merci !'+(emo===2?' 🙏':''):'Bien à vous, Fatima')}
  box.querySelectorAll('[data-pk] a').forEach(function(a){a.addEventListener('click',function(){setTimeout(build,0)})});build()});

// Invitation : service « Autre », experts choisis, envoi
document.querySelectorAll('select.isv').forEach(function(s){var o=s.parentNode.querySelector('.isvo');s.addEventListener('change',function(){if(o){o.hidden=s.value!=='autre';if(!o.hidden)o.focus()}})});
document.querySelectorAll('details.msx').forEach(function(d){var v=d.querySelector('.msv');
  function upd(){var n=[].map.call(d.querySelectorAll('.msl input:checked'),function(i){return i.parentNode.childNodes[2]?i.parentNode.childNodes[2].textContent.trim():''}).filter(Boolean);
    v.innerHTML='';if(!n.length){var e=document.createElement('span');e.className='mute3';e.textContent='Choisir ses Experts';v.appendChild(e)}else n.forEach(function(x){var e=document.createElement('em');e.textContent=x;v.appendChild(e)})}
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
      c.querySelector('.wfait p').textContent='En préparation. Les premiers chiffres arrivent dans quelques minutes, tirés de son travail. Format : '+fmt+'.';
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
    function upd(){var fb=c.classList.contains('fb');var x=fm();sel.textContent=fb?'Feedback sur tout le tableau':(x.length?('Formats : '+x.join(', ')):'Choisissez au moins un format');send.disabled=!t.value.trim()||(!fb&&!x.length)}
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
        else{ty.textContent='Je crée le bloc « '+v+' » en '+x.join(', ').toLowerCase()+'. Il arrive en haut du tableau.';
          var p=c.closest('.panel'),g=p.querySelector('.mwg2'),img=f.querySelector('img').getAttribute('src'),k=document.createElement('article');
          k.className='mw new user';k.dataset.ps='';k.setAttribute('draggable','true');
          k.innerHTML='<header><h4></h4></header><div class="wfait"><img alt=""><p></p></div><footer><span class="ptag">Demandé par vous</span></footer>';
          k.querySelector('h4').textContent=v.charAt(0).toUpperCase()+v.slice(1);k.querySelector('.wfait img').src=img;
          k.querySelector('.wfait p').textContent='En préparation par '+who+'. Formats : '+x.join(', ')+'. Les premiers chiffres arrivent dans quelques minutes, tirés de son travail.';
          g.prepend(k);toast('Bloc demandé, il arrive en haut du tableau')}},900)},true);
    upd();
  });

  // ---------- dupliquer : la copie apparaît dans Mes tableaux et s'ouvre
  document.querySelectorAll('[data-dupk]').forEach(function(a){handled(a);a.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();
    var id=a.dataset.dupk,li=document.querySelector('.tbli a[data-t="'+id+'"]');if(!li){toast('Copie créée dans Mes tableaux');return}
    var neuf=li.hidden;li.hidden=false;li.click();window.scrollTo({top:0,behavior:'smooth'});
    var n=document.querySelector('.tbswitch .num');if(n&&neuf)n.textContent=(+n.textContent||0)+1;
    var g=document.querySelector('.tbli .tbg .num');if(g&&neuf)g.textContent=(+g.textContent||0)+1;
    toast(neuf?'Copie créée : « '+a.dataset.dup2+' (copie) », dans Mes tableaux':'Cette copie existe déjà, la voici')},true)});

  // ---------- Google Slides : aperçu
  document.querySelectorAll('[data-gs]').forEach(function(a){a.addEventListener('click',function(){var m=document.getElementById('gslides');if(!m)return;
    m.querySelector('.gsn').textContent=a.dataset.gs;m.querySelector('.gst').textContent=a.dataset.gs})});

  // ---------- créer un tableau : le nom sert dans le message
  document.querySelectorAll('[data-newtb]').forEach(function(b){b.addEventListener('click',function(){var m=b.closest('.modal'),n=m&&m.querySelector('.ntn input');
    if(n&&n.value.trim())b.dataset.toast='« '+n.value.trim()+' » en cours de création, il arrive dans Mes tableaux dans quelques minutes'},true)});

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
  ok.addEventListener('click',function(e){e.preventDefault();s0=snap();upd();toast('Rôle enregistré pour Aïcha Diabaté','ok')});
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
    m.querySelector('.tplbc').textContent=n+' blocs'+(f.length?' : '+f.join(', ')+(n>4?'…':''):'')})});
  var ok=m.querySelector('.tplok');handled(ok);ok.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();
    var nm=m.querySelector('.tpln').value.trim()||'Mon modèle',l=document.querySelector('#newtdb .tplv');
    if(l){var c=document.createElement('label');c.className='tpc new';var img=cur?document.querySelector('.tbh2 .tbby img'):null;
      c.innerHTML='<input type="radio" name="ntpl"><span class="tpi"><img src="../img/'+(cur?cur.dataset.tplk:'djeneba')+'.jpg" alt=""></span><span class="grow"><b></b><small>Vous, à l’instant</small></span>';
      c.querySelector('b').textContent=nm;l.prepend(c);bind(c)}
    m.classList.remove('on');toast('Modèle enregistré : il apparaît dans Nouveau tableau')});
  function bind(c){c.querySelector('input').addEventListener('change',function(){var n=document.querySelector('#newtdb .ntn input');if(!n)return;
    if(c.classList.contains('tpv')){n.value='';return}n.value=c.querySelector('b').textContent.replace(/^Modèle\s:\s/,'');toast('Modèle appliqué : blocs et formats repris')})}
  document.querySelectorAll('#newtdb .tpc').forEach(bind);
})();
// lien par défaut de chaque tableau
(function(){
  function slug(t){return (t||'tableau').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function url(el){var h=el&&el.closest('.tbh2,.tbh,.panel');h=h&&h.querySelector('h2');return window.tbUrl(el)}
  function copy(u,btn){try{navigator.clipboard&&navigator.clipboard.writeText('https://'+u)}catch(_){}
    toast('Lien copié : '+u);if(btn){btn.classList.add('ok');setTimeout(function(){btn.classList.remove('ok')},1600)}}
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
  var XT={on:'est de nouveau en service',pa:'est en pause, rien n’est perdu',st:'est arrêté : plus facturé dès le mois suivant'};
  $$('[data-xst]').forEach(function(s){s.addEventListener('change',function(){var l=s.closest('.xst');l.className='xst '+s.value;toast(s.dataset.xst+' '+XT[s.value])})});
  // ---------- modèle par expert ou par membre : derrière un bouton Modifier
  $$('.mde').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var w=b.closest('.mdv'),s=$('.mds',w),n=$('.mdn',w);
    if(s.hidden){s.hidden=false;n.hidden=true;b.innerHTML='✓ Enregistrer';b.classList.add('p');s.focus()}else{n.textContent=s.options[s.selectedIndex].text;s.hidden=true;n.hidden=false;b.classList.remove('p');b.textContent='Modifier';toast('Modèle mis à jour : '+n.textContent)}})});
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
    var au=$('.fauto',f);if(au){handled(au);au.addEventListener('click',function(e){e.preventDefault();var p=$$('.fsws',f)[0],bs=$$('button.fsw',p);var b=bs[Math.floor(Math.random()*bs.length)];pick(b);toast('Fond choisi d’après la palette de l’entreprise : '+b.dataset.fn)})}});
  var NOMS=['Aminata','Mariam','Fanta','Adjoa','Ramatou','Akissi','Salimata'],ni=0;
  $$('.pzsg').forEach(function(b){handled(b);b.addEventListener('click',function(e){e.preventDefault();var i=$('.pzni');if(i){i.value=NOMS[ni++%NOMS.length];i.focus();toast('Suggestion : '+i.value)}})});
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
      toast('Export CSV téléchargé : '+(rows.length-1)+' tâches')})});
  // ---------- aperçu de la réponse : le bon expert, un exemple de son métier
  var EX={djeneba:['La note au comité est prête, vous pouvez la relire ?','2 décisions à prendre : budget Super Mint et date de la ligne','Rendez-vous Banque Atlantique confirmé jeudi 10 h','Le devis de la machine d’emballage reste bloqué'],
          fatima:['Les visuels de la promo Sossa sont prêts, vous pouvez les valider ?','3 visuels, prix en grand','Publication prévue demain 9 h','Version print envoyée à Yao'],
          koffi:['La v2 du packaging Super Mint est prête, vous la regardez ?','Logo remonté en haut, couleurs de la charte','3 déclinaisons : 50 g, 100 g, 200 g','Fichiers d’impression envoyés à Yao']};
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
      out.textContent=hi+'\n'+a+e+'\n'+body+'\n'+(reg==='d'?nm:tu?'Merci !'+(emo===2?' 🙏':''):'Bien à vous, '+nm)}
    $$('[data-pk] a',box).forEach(function(a){a.addEventListener('click',function(){setTimeout(build,10)})});setTimeout(build,20)});
  // ---------- connexion : mauvais mot de passe, puis blocage
  var lf=$('[data-login]');if(lf){var pw=$('input[type=password]',lf),em=$('input[type=email]',lf),err=$('.auerr'),tries=3,good=pw?pw.value:'';
    document.addEventListener('submit',function(e){if(e.target!==lf)return;var okEm=/@unifood\.info$/.test(em.value.trim());if(okEm&&pw.value===good)return;e.preventDefault();e.stopImmediatePropagation();
      tries--;err.hidden=false;pw.closest('.mdi').classList.add('bad');
      if(!okEm){$('.auet',err).innerHTML='<b>Aucun compte avec cette adresse.</b> Vérifiez-la, ou demandez une invitation à votre administrateur.';em.closest('.mdi').classList.add('bad');tries++;return}
      if(tries<=0){$('.auet',err).innerHTML='<b>Compte bloqué 15 minutes</b> après 3 essais. <a class="link" href="mot-de-passe.html">Réinitialiser mon mot de passe</a>';$('.auok',lf).disabled=true;return}
      $('.auet',err).innerHTML='<b>Mot de passe incorrect.</b> Il vous reste <b>'+tries+'</b> essai'+(tries>1?'s':'')+' avant un blocage de 15 minutes. <a class="link" href="mot-de-passe.html">Mot de passe oublié ?</a>';pw.select()},true);
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
  var g=m.querySelector('.rcgo');handled(g);g.addEventListener('click',function(e){e.preventDefault();m.classList.remove('on');toast(m.dataset.n+' recrutée pour '+m.querySelector('.rcwho').value+' : mise en service sous 24 h')})})();
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
    var w=row.querySelector('.tbweb');handled(w);w.addEventListener('click',function(e){e.preventDefault();toast('Lien web ouvert dans un nouvel onglet : '+u)})});
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
(function(){var TX={on:'En service',pa:'En pause',st:'Arrêté'},XT={on:'est de nouveau en service',pa:'est en pause, rien n’est perdu',st:'est arrêté : plus facturé dès le mois suivant'};
  document.querySelectorAll('label.xst').forEach(function(l){var s=l.querySelector('select[data-xst]');if(!s)return;var n=s.dataset.xst;
    var w=document.createElement('div');w.className='xsw';
    w.innerHTML='<span class="xsb '+s.value+'"><i></i><span>'+TX[s.value]+'</span></span><button type="button" class="xsm">Modifier</button>'+
      '<div class="xse" hidden><div class="xsc">'+['on','pa','st'].map(function(k){return '<a href="#" class="xso '+k+(k===s.value?' sel':'')+'" data-v="'+k+'"><i></i>'+TX[k]+'</a>'}).join('')+'</div>'+
      '<p class="xswarn" hidden>'+n+' sera arrêté : plus de travail, plus facturé dès le mois suivant.</p>'+
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
      document.querySelectorAll('img').forEach(function(i){if(im&&i.getAttribute('src')===im.getAttribute('src'))i.src=u});toast('Photo mise à jour : '+x.name)})});
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
  $$('.tbask textarea').forEach(function(t){var w=(t.closest('.tbask')||{}).dataset||{};var n=w.who||'l’Expert';t.dataset.phNew='Décrivez le bloc à '+n;if(/glisser|par exemple/.test(t.placeholder)&&t.placeholder.indexOf('changer')<0)t.placeholder='Décrivez le bloc à '+n});

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
      '<h2 class="gsh v40-gsh">Partager<b class="tbn">'+esc(title)+'</b></h2>'+
      '<div class="gsadd"><input type="text" placeholder="Ajouter des personnes par leur nom ou leur email" aria-label="Ajouter des personnes" list="gspl"><select class="gsr gsnr" aria-label="Accès de la personne ajoutée"><option value="l">Lecteur</option><option value="e">Éditeur</option></select><a href="#" class="btn p sm gsinv">Ajouter</a></div>'+
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
    inv.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();var v=inp.value.trim();if(!v){toast('Saisissez un nom ou un email');inp.focus();return}
      var f=PEOPLE.filter(function(x){return x[0].toLowerCase()===v.toLowerCase()})[0];var role=pn.querySelector('.gsnr').value;
      var row=document.createElement('div');row.className='gsp';
      row.innerHTML=(f?'<img src="../img/'+f[2]+'.jpg" alt="">':'<span class="gsini">'+esc(v.charAt(0).toUpperCase())+'</span>')+'<span class="grow"><b>'+esc(f?f[0]:v)+'</b><small>'+esc(f?f[1]:'Invitation envoyée')+'</small></span><select class="gsr">'+opts(role)+'</select>';
      pn.querySelector('.gspl').appendChild(row);bindRow(row.querySelector('select'));inp.value='';toast((f?f[0]:v)+' ajouté, '+(role==='e'?'éditeur':'lecteur'))},true);
    var cp=pn.querySelector('.gscp');handled(cp);
    cp.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();var u=pn.querySelector('.tblku').textContent;try{navigator.clipboard&&navigator.clipboard.writeText('https://'+u)}catch(_){}
      cp.classList.add('ok');toast('Lien copié : '+u);setTimeout(function(){cp.classList.remove('ok')},1600)},true);
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
    $$('.lgseg a',w).forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();if(def===a.dataset.l)return;def=a.dataset.l;sync();toast('Langue par défaut : '+a.textContent)})});
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
    var lignes=[['F2',26,titre],['F1',13,'Livrable de votre Expert Yelema'],['F1',11,'Fichier d’exemple du prototype. Dans l’application, c’est le vrai livrable.']];
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
    x.font='400 32px system-ui,sans-serif';x.fillStyle='#E0E1FF';x.fillText('Livrable de votre Expert Yelema',110,y+80);
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
    toast(m?'Téléchargé : '+m[1].trim():'Téléchargement terminé')},true);
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
      toast((s.getAttribute('aria-label')||'Réglage')+' : '+s.options[s.selectedIndex].text)})});

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
    $$('[data-open="mcomp"]').forEach(function(b){b.addEventListener('click',function(){var h=$('h2',mc);if(h)h.textContent='Rédiger un email à '+nm})});
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
      md.classList.remove('on');k.value='';row.scrollIntoView({block:'center',behavior:'smooth'});toast(m+' est branché : vos Experts peuvent l’utiliser')})}

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
  function demander(e){addReq(e);toast(e?'Demande envoyée à votre admin : '+ME.n+' souhaite recruter '+e:'Demande envoyée à votre admin')}

  // sélecteur de vue dans le menu du compte
  function vueLinks(cls){var h='<div class="v33-vwl">Vue de démonstration</div>';
    [['admin','Aïcha, admin'],['membre','Nadège, membre'],['membre0','Didier, membre sans Expert']].forEach(function(x){h+='<a class="'+cls+' v33-vw'+(x[0]===VUE?' on':'')+'" href="#" data-h="1" data-v33v="'+x[0]+'">'+IC.users+' '+x[1]+'</a>'});
    return h+'<a class="'+cls+' v33-pz" href="#" data-h="1">'+IC.alert+' <span>'+(ss('v33-panne')?'Rétablir le chat':'Simuler une panne du chat')+'</span></a>'}
  $$('.acm').forEach(function(m){var sep=$('.acsep',m);var d=document.createElement('div');d.innerHTML=vueLinks('acx');while(d.firstChild)m.insertBefore(d.firstChild,sep||null)});
  $$('#sh-moi .mspn').forEach(function(m){var d=document.createElement('div');d.innerHTML=vueLinks('msi');var pb=$('.pby',m);while(d.firstChild)m.insertBefore(d.firstChild,pb||null)});
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.v33-vw');if(!a)return;stop(e);if(a.dataset.v33v===VUE){toast('Vous êtes déjà dans cette vue');return}ls('v33-vue',a.dataset.v33v);
    var u=location.pathname.split('/').pop();if(a.dataset.v33v!=='admin'&&/^admin/.test(u))u='accueil.html';toast('Passage à la vue : '+a.textContent.trim());setTimeout(function(){location.href=u},350)})
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
    var bar=document.createElement('div');bar.className='v33-demo';bar.innerHTML='<span>Vue membre : <b>'+esc(ME.n)+'</b>'+(ME.ex.length?'':', sans Expert')+'</span><a href="#" data-h="1" class="v33-vw" data-v33v="admin">Revenir à Aïcha</a>';document.body.appendChild(bar);
    // un membre sans expert : écran vide propre
    if(!ME.ex.length){
      $$('.sb .lb').forEach(function(l){if(/équipe/i.test(l.textContent))l.hidden=true});
      if(/^(accueil|accueil-test|accueil-premier-jour|tableau-de-bord)$/.test(page)){var pg=$('main .page');if(pg){
        pg.innerHTML='<div class="v33-none"><div class="v33-nic">'+IC.users+'</div><h2>Aucun Expert ne vous est encore attribué.</h2><p>Demandez à votre admin.</p><a class="btn p v33-dmx" href="#" data-h="1">'+IC.plus+' Demander un Expert</a></div>';
        $('.v33-dmx',pg).addEventListener('click',function(e){stop(e);addReq('');toast('Demande envoyée à votre admin : '+ME.n+' souhaite un Expert')})}}
    }
    // recruter un expert = une demande à l’admin, pour tous les experts du catalogue
    document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.pc2 .rb, .rqgo, .rqok, .rqgo2');if(!t)return;
      var c=t.closest('.pc2'),n=(t.dataset.nom)||(c&&$('.nm b',c)&&$('.nm b',c).textContent)||(t.textContent.replace(/^\s*Recruter\s*/,'').trim());
      e.preventDefault();e.stopImmediatePropagation();demander(n)},true);
    // connexions personnelles du membre, pour ses experts
    var cz=EX&&($('#connecteurs .v33-cxp')||$('#connecteurs .czw'));
    if(cz){$$('#connecteurs .czw').forEach(function(w){w.classList.remove('v30-czro')});var ro=$('.v30-ro span',cz);if(ro)ro.textContent='Outils de l’entreprise : gérés par votre admin';
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
      '<label class="fl2"><span>Nom</span><input class="fi v33-kn" type="text" placeholder="Par exemple : mon Notion" style="width:100%"></label>'+
      '<label class="fl2"><span class="v33-kl2">Clé</span><input class="fi v33-kv" type="text" placeholder="" style="width:100%"></label>'+
      '<div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px"><a class="btn o v33-kx" href="#" data-h="1">Annuler</a><a class="btn p v33-kok" href="#" data-h="1">Ajouter</a></div></div>';
    document.body.appendChild(km);var kind='api',scope='perso';
    function kset(k){kind=k;$$('.v33-kseg a',km).forEach(function(a){a.classList.toggle('on',a.dataset.k===k)});$('.v33-kt',km).textContent=k==='mcp'?'Ajouter un serveur MCP':'Ajouter une clé API';
      $('.v33-kl2',km).textContent=k==='mcp'?'Adresse du serveur':'Clé';$('.v33-kv',km).placeholder=k==='mcp'?'https://…/mcp':'sk-…'}
    km._v33open=function(b){scope=b.dataset.v33s||'perso';kset(b.dataset.v33k||'api');$('.v33-kn',km).value='';$('.v33-kv',km).value='';
      $('.v33-ks',km).textContent=scope==='ent'?'Pour l’entreprise : vous la donnez ensuite aux Experts qui en ont besoin.':'Personnel : seuls vous et '+(NOM[EX]||'vos Experts')+' l’utilisez.'};
    $$('.v33-kseg a',km).forEach(function(a){a.addEventListener('click',function(e){stop(e);kset(a.dataset.k)})});
    [$('.ov',km),$('.ib.x',km),$('.v33-kx',km)].forEach(function(x){x.addEventListener('click',function(e){stop(e);km.classList.remove('on')})});
    $('.v33-kok',km).addEventListener('click',function(e){stop(e);var n=$('.v33-kn',km).value.trim(),v=$('.v33-kv',km).value.trim();
      if(!n||!v){toast(kind==='mcp'?'Donnez un nom et l’adresse du serveur':'Donnez un nom et collez la clé');($('.v33-kn',km).value?$('.v33-kv',km):$('.v33-kn',km)).focus();return}
      var masq=kind==='mcp'?v:v.slice(0,6)+'••••'+v.slice(-3);
      if(scope==='ent'){var tb=$('.v33-kl');if(tb){var tr=document.createElement('tr');tr.innerHTML='<td><b>'+esc(n)+'</b> <span class="pill br">Entreprise</span></td><td class="hide-m"><code class="xs">'+esc(masq)+'</code></td><td>À attribuer</td><td><a class="btn o sm" href="#" data-h="1" data-toast="Choisissez les Experts">Attribuer</a></td>';tb.appendChild(tr)}}
      else{var pe=$('.v33-perso');if(pe)persoItem(pe,kind==='mcp'?IC.server:IC.key,n,(kind==='mcp'?'Serveur MCP, ':'Clé API, ')+masq)}
      km.classList.remove('on');toast((kind==='mcp'?'Serveur MCP':'Clé API')+' « '+n+' » ajouté'+(kind==='mcp'?'':'e'))});
  }

  // ================= notifications de l’admin : demandes des membres
  if(!MEMBRE){var R=reqs();
    if(R.length){
      var line=function(r){return (r.e?r.m+' souhaite recruter '+r.e:r.m+' demande un Expert')};
      var pop=$('#notifs h3');if(pop){R.slice().reverse().forEach(function(r){var d=document.createElement('div');d.className='nt v33-nt';d.innerHTML='<span class="ic">'+IC.users+'</span><div><b>'+esc(line(r))+'</b><span>Demande d’un membre, à l’instant</span></div>';pop.insertAdjacentElement('afterend',d)});
        $$('[data-pop="notifs"] .bdg').forEach(function(b){b.textContent=(parseInt(b.textContent,10)||0)+R.length})}
      var g=$('.ngrp .lb2');if(g&&page==='notifications'){R.slice().reverse().forEach(function(r){var a=document.createElement('a');a.className='nrow unread v33-nt';a.href='admin-membres.html';a.innerHTML='<img class="nav" src="../img/'+r.p+'.jpg" alt=""><span class="grow"><b>'+esc(line(r))+'</b><span>Demande d’un membre</span></span><time>à l’instant</time><span class="nact">Répondre</span>';g.insertAdjacentElement('afterend',a)})}
      var box=$('.v33-reqs');if(box){box.hidden=false;R.forEach(function(r,i){var d=document.createElement('div');d.className='v33-rq';
        var slug=r.e?r.e.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,''):'';
        d.innerHTML='<img src="../img/'+r.p+'.jpg" alt=""><span class="grow"><b>'+esc(line(r))+'</b><small>Demande en attente de votre réponse</small></span>'+
          '<a class="btn p sm" href="'+(r.e?'recrue-'+slug+'.html':'recruter.html')+'">'+(r.e?'Voir '+esc(r.e):'Choisir un Expert')+'</a><a class="btn o sm v33-rqno" href="#" data-h="1" data-i="'+i+'">Refuser</a>';box.appendChild(d)});
        box.addEventListener('click',function(e){var b=e.target.closest('.v33-rqno');if(!b)return;stop(e);var r=reqs();r.splice(+b.dataset.i,1);ls('v33-req',JSON.stringify(r));b.closest('.v33-rq').remove();toast('Demande refusée, le membre est prévenu')})}
    }}

  // ================= attribuer des experts à un membre (admin, Membres)
  var at=$('#v33-att');
  if(at){var who=null;
    $$('[data-open="v33-att"]').forEach(function(b){b.addEventListener('click',function(){who=b.dataset.who;$('.v33-atw',at).textContent=who;var cur=$('.v33-ax[data-who="'+who+'"]');var ex=(cur.dataset.ex||'').split(' ');
      $$('input',at).forEach(function(i){i.checked=ex.indexOf(i.value)>=0})})});
    $('.v33-atok',at).addEventListener('click',function(e){stop(e);var ex=$$('input',at).filter(function(i){return i.checked}).map(function(i){return i.value});var cur=$('.v33-ax[data-who="'+who+'"]');
      cur.dataset.ex=ex.join(' ');cur.innerHTML=ex.length?ex.map(function(x){return '<img src="../img/'+x+'.jpg" alt="'+NOM[x]+'" title="'+NOM[x]+'">'}).join(''):'<span class="xs mute3">Aucun</span>';
      at.classList.remove('on');toast('Experts de '+who.split(' ')[0]+' mis à jour','ok')})}

  // ================= chat entreprise : interrupteur (admin, Détails de l’entreprise)
  function ceApply(){var off=ls('v33-ce')==='off';document.documentElement.classList.toggle('v33-ceoff',off);
    if(page==='memoire'){var m=$('main'),bx=$('.v33-cebox');if(off&&!bx){bx=document.createElement('div');bx.className='v33-cebox';bx.innerHTML='<h2>Le chat entreprise est coupé</h2><p class="sm mute">Votre admin peut le rallumer dans Détails de l’entreprise. Vos Experts restent joignables chacun dans leur espace.</p><a class="btn p" href="accueil.html">Retour à l’accueil</a>';
      [].forEach.call(m.children,function(c){if(!c.matches('header'))c.hidden=true});m.appendChild(bx)}}}
  ceApply();
  $$('.v33-ce').forEach(function(b){function sync(){var off=ls('v33-ce')==='off';b.classList.toggle('off',off);b.setAttribute('aria-checked',off?'false':'true')}sync();
    b.addEventListener('click',function(e){stop(e);var off=ls('v33-ce')!=='off';ls('v33-ce',off?'off':null);sync();ceApply();toast(off?'Chat entreprise coupé : il disparaît du menu':'Chat entreprise activé')})});

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
    var PR={djeneba:[['Point du matin','Fais-moi le point du jour : rendez-vous, validations en attente et urgences, en cinq lignes.','day','2026-10-02','08:00'],
        ['Point du soir','Résume ce qui a été fait aujourd’hui et ce qui reste pour demain.','day','2026-10-01','18:00'],
        ['Bilan du vendredi','Prépare le bilan de la semaine pour le directeur général : décisions, engagements tenus, retards.','week','2026-10-02','17:00']],
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
      z=r.z&&r.z!=='Abidjan'?', heure de '+r.z:'';
      if(r.f==='day')return 'Chaque jour à '+r.h+z;if(r.f==='week'){var dd=(r.days&&r.days.length?r.days:[dt.getDay()]).map(function(k){return JOURS[k]});return 'Chaque '+(dd.length>1?dd.slice(0,-1).join(', ')+' et '+dd[dd.length-1]:dd[0])+' à '+r.h+z}
      if(r.f==='month')return 'Chaque mois, le '+(dt.getDate()===1?'1er':dt.getDate())+' à '+r.h+z;return 'Ponctuel, le '+dt.getDate()+' '+MOIS[dt.getMonth()]+' à '+r.h+z}
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
      if(b.classList.contains('v33-rp')){r.on=!r.on;render();toast(r.on?'Routine reprise : '+r.n:'Routine en pause : '+r.n)}
      if(b.classList.contains('v33-rx')){delId=r.id;$('#v33-del .v33-deln').textContent=r.n;$('#v33-del').classList.add('on')}});
    $('#v33-del .v33-delok').addEventListener('click',function(e){stop(e);var r=list.filter(function(x){return x.id===delId})[0],ri=list.indexOf(r);list=list.filter(function(x){return x.id!==delId});render();closeM('v33-del');if(r)toast('Routine supprimée : '+r.n,{type:'ok',action:{label:'Annuler',fn:function(){if(list.indexOf(r)<0){list.splice(Math.min(ri,list.length),0,r);render();toast('Routine rétablie : '+r.n,'ok')}}}})});
    prb.addEventListener('click',function(e){var b=e.target.closest('.v33-pa');if(!b)return;stop(e);var p=PR[EX][+b.dataset.i];
      list.push({id:'p'+Date.now(),n:p[0],c:p[1],f:p[2],d:p[3],h:p[4],z:'Abidjan',last:'',on:true,o:ME.n,pr:+b.dataset.i});render();toast('Routine activée : '+p[0])});
    // ---- nouvelle routine
    var rm=$('#v33-rtm'),sk=$('.v33-rsk',rm);
    sk.innerHTML=SK[EX].map(function(x,i){return '<label class="fmc"><input type="checkbox"'+(i<2?' checked':'')+'> '+esc(x)+'</label>'}).join('');
    var pj=$('.v33-pj input',rm);pj.addEventListener('change',function(){$('.v33-pjn',rm).textContent=pj.files&&pj.files[0]?pj.files[0].name:''});
    $('.v33-pj',rm).addEventListener('click',function(e){e.stopPropagation()});
    $('.v33-aigo',rm).addEventListener('click',function(e){stop(e);var q=$('.v33-aiq',rm).value.trim()||'Chaque lundi, prépare le travail de la semaine';var t=$('.v33-ait',rm);
      t.insertAdjacentHTML('beforeend','<p class="me">'+esc(q)+'</p>');$('.v33-aiq',rm).value='';
      setTimeout(function(){var f=$('.v33-rf',rm).value,fl={once:'Le moment venu',day:'Chaque jour',week:'Chaque semaine',month:'Chaque mois'}[f];
        var c=fl+' à '+($('.v33-rh',rm).value||'08:00')+' : '+q.replace(/^(chaque|tous les|toutes les)\s+\S+,?\s*/i,'').replace(/\.$/,'')+'. Envoie-moi le résultat sur Telegram et range le fichier dans le Drive. Demande mon accord avant tout envoi à l’extérieur.';
        $('.v33-rc',rm).value=c.charAt(0).toUpperCase()+c.slice(1);if(!$('.v33-rn',rm).value)$('.v33-rn',rm).value=q.split(/\s+/).slice(0,4).join(' ');
        t.insertAdjacentHTML('beforeend','<p>Voilà la consigne, relisez-la à gauche et modifiez ce que vous voulez.</p>')},500)});
    $('.v33-rok',rm).addEventListener('click',function(e){stop(e);var c=$('.v33-rc',rm).value.trim();if(!c){toast('Dites à '+NOM[EX]+' ce qu’elle doit faire');$('.v33-rc',rm).focus();return}
      var n=$('.v33-rn',rm).value.trim()||c.split(/\s+/).slice(0,5).join(' ');
      list.unshift({id:'n'+Date.now(),n:n,c:c,f:$('.v33-rf',rm).value,d:$('.v33-rd',rm).value||'2026-10-05',h:$('.v33-rh',rm).value||'08:00',z:$('.v33-rz',rm).value||'Abidjan',last:'',on:true,o:ME.n,days:(window.v36rt&&window.v36rt.days)||null});
      render();rm.classList.remove('on');$('.v33-rn',rm).value='';$('.v33-rc',rm).value='';$('.v33-ait',rm).innerHTML='';showTab('rt');toast('Routine créée : '+n)});
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
    function last(x){if(x.k!=='dir')return x.d||'';var m=x.d||'';x.c.forEach(function(y){var v=last(y);if(v>m)m=v});return m}
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
    var lt=$('.v33-lt',LV),cr=$('.v33-cr',LV),srch=$('.v33-ls input',LV);window.v33lv={cur:function(){return cur()},path:function(){return path},find:function(id){return find(id)},render:function(){render()},uid:function(){return 'f'+(++uid)},clear:function(){q='';srch.value=''},sel:function(){return sel}};
    function crumb(){var h='<a href="#" data-h="1" data-v33cr="-1">'+AR.home+'<span>Livrables</span></a>';path.forEach(function(d,i){h+=AR.chev+(i===path.length-1?'<b>'+esc(d.n)+'</b>':'<a href="#" data-h="1" data-v33cr="'+i+'">'+esc(d.n)+'</a>')});cr.innerHTML=h;
      var w=$('#v33-dir .v33-dwh');if(w)w.textContent=path.length?path[path.length-1].n:'Livrables'}
    function rowH(x,p){var dir=x.k==='dir',th=x.th&&mode==='grid'?'<img src="../img/'+x.th+'" alt="" loading="lazy">':IK[x.k==='xls'?'xls':x.k]||IK.pdf;
      var act=dir?'<span class="v33-go" aria-hidden="true">'+AR.chev+'</span>':isLink(x)?'<a class="v33-ia" href="'+url1(x)+'" target="_blank" rel="noopener" aria-label="Ouvrir '+esc(x.n)+'">'+AR.ext+'</a>':'<a class="v33-ia" href="#" data-toast="Téléchargement : '+esc(x.n)+'.'+ext1(x)+'" aria-label="Télécharger '+esc(x.n)+'">'+AR.dl+'</a>';
      var sub=(p&&p.length?esc(p.join(' / '))+', ':'')+'Modifié le '+fd(last(x));
      return '<div class="v33-r'+(dir?' dir':'')+'" data-id="'+x.id+'" tabindex="0" role="row"><span class="v33-rn"><span class="v33-ic '+x.k+'">'+th+'</span><span class="v33-nm"><b>'+esc(x.n)+'</b><small>'+sub+'</small></span></span>'+
        '<span class="v33-md">'+fd(last(x))+'</span><span class="v33-sz">'+taille(x)+'</span>'+
        '<span class="v33-ac"><span class="v33-hv"><button type="button" class="v33-ib v33-ren" data-h="1" aria-label="Renommer '+esc(x.n)+'">'+AR.pen+'</button><button type="button" class="v33-ib v33-del" data-h="1" aria-label="Supprimer '+esc(x.n)+'">'+IC.trash+'</button></span>'+
        '<button type="button" class="v33-ib v33-more" data-h="1" aria-label="Plus d’actions" aria-expanded="false">'+AR.more+'</button><span class="v33-mm" hidden><a href="#" data-h="1" class="v33-ren">Renommer</a><a href="#" data-h="1" class="v33-del">Supprimer</a></span>'+act+'</span></div>'}
    function render(){crumb();LV.classList.toggle('grid',mode==='grid');
      var L,rows;if(q){rows=all(DATA,[],[]).filter(function(o){return o.x.n.toLowerCase().indexOf(q)>=0}).sort(function(a,b){return last(b.x)<last(a.x)?-1:1})}else{L=sorted(cur().slice());rows=L.map(function(x){return {x:x,p:null}})}
      var h='<div class="v33-r v33-th" role="row"><span>Nom</span><span class="v33-md">Modifié</span><span class="v33-sz">Taille</span><span></span></div>';
      if(!rows.length){h+='<div class="v33-empty">'+(q?'Aucun fichier ne correspond à « '+esc(q)+' ».':(path.length?'Ce dossier est vide.':'Aucun fichier pour l’instant. Les livrables de '+NOM[EX]+' arriveront ici.'))+(q?'':' <a class="btn p sm v33-impx" href="#" data-h="1">Importer</a>')+'</div>'}
      rows.forEach(function(o){h+=rowH(o.x,q?o.p:null)});lt.innerHTML=h}
    function open(x){if(x.k==='dir'){path.push(x);q='';srch.value='';render();return}
      var m=$('#v33-pv');sel=x;$('.v33-pvh',m).textContent=x.n;$('.v33-pvd',m).textContent='Modifié le '+fd(x.d)+(x.s?', '+x.s:'');
      $('.v33-pvt',m).innerHTML=x.th?'<img src="../img/'+x.th+'" alt="">':'<div class="v33-pvp '+x.k+'">'+(IK[x.k]||IK.pdf)+'<b>'+esc(x.n)+'</b><i></i><i></i><i class="s"></i><i></i></div>';
      $('.v33-pvf',m).innerHTML=(x.fm||[['PDF','pdf']]).map(function(f){return /^https?:/.test(f[1])?'<a class="btn o" href="'+f[1]+'" target="_blank" rel="noopener">'+AR.ext+' Ouvrir dans '+esc(f[0])+'</a>':'<a class="btn p" href="#" data-toast="Téléchargement : '+esc(x.n)+'.'+f[1]+'">'+AR.dl+' '+esc(f[0])+'</a>'}).join('');
      m.classList.add('on')}
    function closeMenus(){$$('.v33-mm',LV).forEach(function(m){m.hidden=true});$$('.v33-more',LV).forEach(function(b){b.setAttribute('aria-expanded','false')})}
    function rename(row){var r=find(row.dataset.id);if(!r)return;var b=$('.v33-nm b',row),inp=document.createElement('input');inp.className='fi v33-rin';inp.value=r.x.n;inp.setAttribute('aria-label','Nouveau nom');
      b.replaceWith(inp);inp.focus();inp.select();var done=false;
      function end(ok){if(done)return;done=true;var v=inp.value.trim();if(ok&&v&&v!==r.x.n){r.x.n=v;toast('Renommé : '+v)}render()}
      inp.addEventListener('keydown',function(e){e.stopPropagation();if(e.key==='Enter'){e.preventDefault();end(true)}if(e.key==='Escape'){e.preventDefault();end(false)}});
      inp.addEventListener('click',function(e){e.stopPropagation()});inp.addEventListener('blur',function(){end(false)})}
    var delId=null;
    lt.addEventListener('click',function(e){var row=e.target.closest('.v33-r');if(!row||row.classList.contains('v33-th')){var ix=e.target.closest('.v33-impx');if(ix){stop(e);$('.v33-if',LV).click()}return}
      var t=e.target;
      if(t.closest('.v33-more')){stop(e);var mm=$('.v33-mm',row),was=!mm.hidden;closeMenus();mm.hidden=was;t.closest('.v33-more').setAttribute('aria-expanded',!was);return}
      if(t.closest('.v33-ren')){stop(e);closeMenus();rename(row);return}
      if(t.closest('.v33-del')){stop(e);closeMenus();var r=find(row.dataset.id);delId=row.dataset.id;$('#v33-fdel .v33-fdn').textContent='« '+r.x.n+' »';$('#v33-fdel').classList.add('on');return}
      if(t.closest('.v33-ia')||t.closest('input'))return;
      e.preventDefault();var f=find(row.dataset.id);if(f)open(f.x)});
    lt.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.classList.contains('v33-r')){var f=find(e.target.dataset.id);if(f)open(f.x)}});
    $('#v33-fdel .v33-fdok').addEventListener('click',function(e){stop(e);var r=find(delId);if(r){r.L.splice(r.i,1);toast((r.x.k==='dir'?'Dossier supprimé : ':'Fichier supprimé : ')+r.x.n,{type:'ok',action:{label:'Annuler',fn:function(){if(r.L.indexOf(r.x)<0){r.L.splice(Math.min(r.i,r.L.length),0,r.x);render();toast((r.x.k==='dir'?'Dossier rétabli : ':'Fichier rétabli : ')+r.x.n,'ok')}}}})}closeM('v33-fdel');render()});
    cr.addEventListener('click',function(e){var a=e.target.closest('[data-v33cr]');if(!a)return;stop(e);path=path.slice(0,+a.dataset.v33cr+1);q='';srch.value='';render()});
    srch.addEventListener('input',function(){q=srch.value.trim().toLowerCase();render()});
    $$('.v33-vm button',LV).forEach(function(b){b.addEventListener('click',function(e){stop(e);mode=b.dataset.v33vm;$$('.v33-vm button',LV).forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b)});render()})});
    // nouveau dossier
    $('#v33-dir .v33-dok').addEventListener('click',function(e){stop(e);var n=$('#v33-dir .v33-dn').value.trim();if(!n){toast('Donnez un nom au dossier');$('#v33-dir .v33-dn').focus();return}
      cur().push({id:'f'+(++uid),n:n,k:'dir',c:[]});closeM('v33-dir');$('#v33-dir .v33-dn').value='';q='';srch.value='';render();toast('Dossier « '+n+' » créé')});
    // importer : fichiers ou dossier, et glisser-déposer
    var NOWS='2026-10-01 10:52';
    function kind(n){var x=(/\.([a-z0-9]+)$/i.exec(n)||[,''])[1].toLowerCase();return /png|jpe?g|gif|webp|svg/.test(x)?'img':/xlsx?|csv/.test(x)?'xls':/docx?|txt|md/.test(x)?'doc':/pptx?|key/.test(x)?'ppt':/zip|rar/.test(x)?'zip':'pdf'}
    function fmt(f){var k=kind(f.name),e=(/\.([a-z0-9]+)$/i.exec(f.name)||[,'pdf'])[1].toLowerCase(),lab={img:e.toUpperCase(),xls:'Excel',doc:'Word',ppt:'PowerPoint',zip:'ZIP',pdf:'PDF'}[k];
      var s=f.size>=1048576?(f.size/1048576).toFixed(1).replace('.',',')+' Mo':Math.max(1,Math.round(f.size/1024))+' Ko';
      return {id:'f'+(++uid),n:f.name.replace(/\.[^.]+$/,''),k:k,d:NOWS,s:s,fm:[[lab,e]]}}
    function add(files){var L=cur(),n=0,dirs={};[].forEach.call(files||[],function(f){var rp=f.webkitRelativePath||'';
        if(rp&&rp.indexOf('/')>0){var dn=rp.split('/')[0];if(!dirs[dn]){dirs[dn]={id:'f'+(++uid),n:dn,k:'dir',c:[]};L.push(dirs[dn])}dirs[dn].c.push(fmt(f))}else L.push(fmt(f));n++});
      if(!n)return;q='';srch.value='';render();toast(Object.keys(dirs).length?'Dossier importé : '+Object.keys(dirs)[0]+' ('+n+' fichier'+(n>1?'s':'')+')':n+' fichier'+(n>1?'s':'')+' ajouté'+(n>1?'s':'')+' à '+(path.length?path[path.length-1].n:'Livrables'))}
    var ib=$('.v33-impb',LV),im=$('.v33-impm',LV);
    ib.addEventListener('click',function(e){stop(e);im.hidden=!im.hidden;ib.setAttribute('aria-expanded',!im.hidden)});
    $$('[data-v33imp]',im).forEach(function(a){a.addEventListener('click',function(e){stop(e);im.hidden=true;ib.setAttribute('aria-expanded','false');$(a.dataset.v33imp==='d'?'.v33-id':'.v33-if',LV).click();toast(a.dataset.v33imp==='d'?'Choisissez un dossier':'Choisissez vos fichiers')})});
    $$('.v33-if,.v33-id',LV).forEach(function(i){i.addEventListener('change',function(){var fl=[].slice.call(i.files||[]);i.value='';if(window.v36imp)window.v36imp(fl,add,i);else add(fl)})});
    document.addEventListener('click',function(e){if(!im.hidden&&!e.target.closest('.v33-imp')){im.hidden=true;ib.setAttribute('aria-expanded','false')}if(!e.target.closest('.v33-more,.v33-mm'))closeMenus()});
    var drop=$('.v33-drop',LV),dc=0,pan=$('#drive');
    pan.addEventListener('dragenter',function(e){if(!e.dataTransfer||[].indexOf.call(e.dataTransfer.types||[],'Files')<0)return;e.preventDefault();dc++;drop.hidden=false});
    pan.addEventListener('dragover',function(e){if(!drop.hidden){e.preventDefault();e.dataTransfer.dropEffect='copy'}});
    pan.addEventListener('dragleave',function(){dc=Math.max(0,dc-1);if(!dc)drop.hidden=true});
    pan.addEventListener('drop',function(e){e.preventDefault();dc=0;drop.hidden=true;var fl=[].slice.call((e.dataTransfer&&e.dataTransfer.files)||[]);if(window.v36imp)window.v36imp(fl,add,$('.v33-if',LV));else add(fl)});
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
    $('.v33-cxd',CXP).addEventListener('click',function(e){stop(e);toast('Demande envoyée à l’équipe Yelema : '+(qi.value.trim()||'nouvel outil'))});
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
  if(af){var l=$('.v33-afl',af);function up(){var m=$('.v33-afm',af).value,x=$('.v33-afe',af).value;l.textContent=(m||x)?[m,x].filter(Boolean).join(', '):'Toute l’entreprise';toast('Analytique : '+l.textContent)}
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
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.v35-acc');if(!a)return;stop(e);var x=NOM[EX]||'cet Expert';
    var r=accs();r.unshift({m:ME.n,p:ME.p,x:x,t:Date.now()});ls('v35-acc',JSON.stringify(r.slice(0,12)));
    say('Demande envoyée à votre admin : accès aux clés et serveurs de '+x)});
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
  var J=['Aujourd’hui','Hier','Cette semaine','Semaine dernière','Septembre'];
  var CONV={
    fatima:[
      {id:'f1',t:'Post Facebook promo Sossa',c:'web',g:0,orig:1},
      {id:'f2',t:'Version print pour Yao',c:'tg',g:0,m:[['m','Fais une version print du post Sossa pour Yao, en A4.','10:40'],['l','C’est prêt : A4 en 300 dpi, avec les traits de coupe. Le fichier est dans Livrables, dossier Sossa.','10:41'],['m','Merci, envoie-la-lui.','10:43'],['l','Envoyée à Yao sur Telegram à 10:44.','10:44']]},
      {id:'f3',t:'Calendrier éditorial octobre',c:'web',g:1,m:[['m','Prépare le calendrier éditorial d’octobre pour Super Mint.','16:02'],['l','Voilà 12 publications sur le mois : 6 posts, 4 stories et 2 vidéos courtes, calées sur les temps forts d’octobre.','16:20'],['m','Ajoute un jeu concours la dernière semaine.','16:31'],['l','Ajouté le 27 octobre. Le calendrier est à jour dans Livrables, dossier Super Mint.','16:33']]},
      {id:'f4',t:'Brief vidéo 30 s',c:'tg',g:1,m:[['m','Il me faut le brief du film de 30 secondes pour Sossa.','11:05'],['l','Le voici : une famille au goûter, le paquet en gros plan, la promo à la fin. Trois plans, sans dialogue.','11:48'],['m','Parfait, garde la musique de la dernière campagne.','11:52'],['l','C’est noté, je l’ajoute au brief.','11:53']]},
      {id:'f5',t:'Rapport réseaux sociaux',c:'web',g:2,m:[['m','Fais le rapport des réseaux sociaux de septembre.','lun. 08:30'],['l','Le rapport est prêt : 48 publications, 212 000 vues, et les trois posts qui ont le mieux marché. Il est dans Livrables, dossier Rapports.','lun. 09:05']]},
      {id:'f6',t:'Idées concours Super Mint',c:'tg',g:2,m:[['m','Propose-moi trois idées de jeu concours pour Super Mint.','mar. 14:10'],['l','1. Photo du goûter le plus frais. 2. Devine le nouveau parfum. 3. Partage ta pause Super Mint. La deuxième coûte le moins cher en lots.','mar. 14:26']]},
      {id:'f7',t:'Veille concurrence',c:'web',g:2,m:[['m','Qu’ont publié les concurrents cette semaine ?','dim. 18:00'],['l','Deux promos de rentrée chez les concurrents, une vidéo qui a beaucoup tourné sur Instagram. Le détail est dans la veille de la semaine 39.','dim. 19:00']]}],
    koffi:[
      {id:'k1',t:'Packaging Super Mint édition limitée',c:'web',g:0,orig:1},
      {id:'k2',t:'Affiche promo rentrée Sossa',c:'tg',g:1,m:[['m','Il faut l’affiche de la promo rentrée Sossa pour les boutiques.','09:00'],['l','La voici en A2, dans la charte Sossa. Je prépare aussi la story pour Instagram.','09:12'],['m','Mets le prix plus haut.','09:20'],['l','C’est fait, la nouvelle version est dans Livrables, dossier Sossa.','09:24']]},
      {id:'k3',t:'Déclinaisons de septembre',c:'web',g:2,m:[['m','Décline les visuels validés de septembre pour tous les réseaux.','lun. 15:00'],['l','14 déclinaisons prêtes, au bon format pour Facebook, Instagram et les stories. Le pack est dans Livrables, dossier Exports.','lun. 19:10']]}],
    djeneba:[
      {id:'d1',t:'Point du jour et ventes Sossa',c:'web',g:0,orig:1},
      {id:'d2',t:'Brief du rendez-vous avec la banque',c:'tg',g:1,m:[['m','Prépare-moi le rendez-vous de demain avec la banque.','17:40'],['l','Le brief est prêt : qui vous recevez, l’historique des échanges et les trois points à obtenir. Il est dans Livrables, dossier Rendez-vous.','18:10'],['m','Ajoute le montant de la ligne de crédit actuelle.','18:15'],['l','Ajouté en tête du brief.','18:16']]},
      {id:'d3',t:'Relevé de décisions du 24 septembre',c:'web',g:2,m:[['m','Fais le relevé de décisions du comité de ce matin.','jeu. 12:30'],['l','Cinq décisions, avec un responsable et une date pour chacune. Je relance chaque responsable la veille de l’échéance.','jeu. 17:30']]}]};
  CONV.fatima=CONV.fatima.concat([{id:'fx0',t:"Visuels stories Super Mint",c:'web',g:2,m:[['m',"Prépare trois stories pour Super Mint.",'09:10'],['l',"Les trois stories sont prêtes, au format 9:16, dans Livrables, dossier Super Mint.",'09:25']]},{id:'fx1',t:"Réponses aux commentaires",c:'tg',g:2,m:[['m',"Réponds aux commentaires d’hier sur le post Sossa.",'14:30'],['l',"J’ai répondu aux 14 commentaires, deux questions sur les prix sont remontées à Yao.",'14:52']]},{id:'fx2',t:"Plan média du T4",c:'web',g:3,m:[['m',"Fais le plan média du T4.",'10:05'],['l',"Le plan est prêt : Facebook et Instagram en priorité, un temps fort par mois.",'10:31']]},{id:'fx3',t:"Post anniversaire Unifood",c:'web',g:3,m:[['m',"Prépare un post pour l’anniversaire d’Unifood.",'16:40'],['l',"Deux versions prêtes, une photo d’équipe et une affiche, dans Livrables.",'17:02']]},{id:'fx4',t:"Bilan campagne rentrée",c:'tg',g:3,m:[['m',"Fais le bilan de la campagne de rentrée.",'11:20'],['l',"Bilan prêt : 96 000 vues, le post vidéo a le mieux marché.",'11:48']]},{id:'fx5',t:"Fiche influenceuses Abidjan",c:'web',g:3,m:[['m',"Liste des influenceuses food à Abidjan.",'09:10'],['l',"Douze profils, avec leur audience et leur dernier partenariat.",'09:25']]},{id:'fx6',t:"Textes du site, page Sossa",c:'web',g:3,m:[['m',"Réécris la page Sossa du site.",'14:30'],['l',"Nouveau texte prêt, plus court, avec la promo en tête.",'14:52']]},{id:'fx7',t:"Newsletter de septembre",c:'web',g:3,m:[['m',"Rédige la newsletter de septembre.",'10:05'],['l',"Elle est prête, trois sujets et un jeu concours en bas.",'10:31']]},{id:'fx8',t:"Sondage goûts Super Mint",c:'tg',g:3,m:[['m',"Lance un sondage sur les parfums Super Mint.",'16:40'],['l',"Sondage publié en story, 1 200 votes, la menthe citron arrive en tête.",'17:02']]},{id:'fx9',t:"Calendrier fêtes de fin d’année",c:'web',g:3,m:[['m',"Prépare le calendrier des fêtes de fin d’année.",'11:20'],['l',"Calendrier prêt de fin novembre au 6 janvier.",'11:48']]},{id:'fx10',t:"Lancement Sossa chocolat",c:'web',g:4,m:[['m',"Prépare le lancement de Sossa chocolat.",'09:10'],['l',"Plan de lancement prêt : teasing, révélation, jeu concours.",'09:25']]},{id:'fx11',t:"Charte des réseaux",c:'web',g:4,m:[['m',"Écris la charte des réseaux sociaux.",'14:30'],['l',"La charte est prête : ton, emojis, réponses types.",'14:52']]},{id:'fx12',t:"Photos boutique Treichville",c:'tg',g:4,m:[['m',"Trie les photos de la boutique de Treichville.",'10:05'],['l',"Vingt photos retenues, rangées dans Livrables.",'10:31']]},{id:'fx13',t:"Veille prix concurrents",c:'web',g:4,m:[['m',"Relève les prix des concurrents.",'16:40'],['l',"Tableau prêt, Sossa reste le moins cher en grand format.",'17:02']]},{id:'fx14',t:"Post rentrée scolaire",c:'web',g:4,m:[['m',"Un post pour la rentrée scolaire.",'11:20'],['l',"Post prêt, avec le goûter Sossa dans le cartable.",'11:48']]},{id:'fx15',t:"Script vidéo recette",c:'web',g:4,m:[['m',"Écris le script d’une vidéo recette.",'09:10'],['l',"Script prêt, 45 secondes, trois étapes.",'09:25']]},{id:'fx16',t:"Réponse avis Google",c:'tg',g:4,m:[['m',"Réponds aux avis Google de la semaine.",'14:30'],['l',"Six réponses publiées, une plainte transmise au service client.",'14:52']]},{id:'fx17',t:"Rapport réseaux d’août",c:'web',g:4,m:[['m',"Fais le rapport des réseaux d’août.",'10:05'],['l',"Rapport prêt : 41 publications et 180 000 vues.",'10:31']]},{id:'fx18',t:"Idées de posts pour septembre",c:'web',g:4,m:[['m',"Propose des idées de posts pour septembre.",'16:40'],['l',"Quinze idées classées par marque.",'17:02']]}]);
  var SUG={fatima:['Prépare les posts de la semaine pour Sossa','Fais le rapport des réseaux sociaux du mois','Propose un jeu concours pour Super Mint'],
    koffi:['Décline l’affiche Sossa pour Instagram','Prépare le bon à tirer du packaging','Vérifie la charte des visuels du jour'],
    djeneba:['Prépare mon point du jour','Rédige la note pour le comité de direction','Prépare le brief de mon prochain rendez-vous']};
  // chat entreprise : les conversations de la liste existante (mêmes titres)
  var MEMS=[{id:'m0',t:'Promos Sossa de la rentrée 2025',c:'web',g:0,fil:'c1'},{id:'m1',t:'Qui gère le compte Carrefour ?',c:'tg',g:0,fil:'c2'},
    {id:'m2',t:'Prix de gros Super Mint par région',c:'web',g:1,m:[['m','Quels sont nos prix de gros Super Mint par région ?'],['l','Abidjan et le Sud : 1 450 FCFA le carton. Centre et Nord : 1 520 FCFA, transport compris. Grille mise à jour le 1er septembre.','Grille tarifaire 2026']]},
    {id:'m3',t:'Résumé du comité du 24 septembre',c:'web',g:1,m:[['m','Résume le comité de direction du 24 septembre.'],['l','Trois décisions : la promo rentrée Sossa est prolongée d’une semaine, le recrutement d’un commercial pour le Nord est lancé, et le budget packaging est validé.','Relevé de décisions du 24/09']]},
    {id:'m4',t:'Fournisseurs d’emballage carton',c:'web',g:2,m:[['m','Avec quels fournisseurs de cartons travaillons-nous ?'],['l','Deux fournisseurs : SIVOP pour les cartons standards, et un imprimeur de Yopougon pour les éditions limitées.','Liste des fournisseurs']]},
    {id:'m5',t:'Règles de congés terrain',c:'tg',g:2,m:[['m','Quelles sont les règles de congés pour les équipes terrain ?'],['l','Deux semaines minimum à poser entre juin et septembre, et une demande au moins un mois avant, validée par le chef de zone.','Règlement intérieur']]},
    {id:'m6',t:'Objectifs ventes T4',c:'web',g:2,m:[['m','Quels sont nos objectifs de ventes pour le T4 ?'],['l','+12 % sur Sossa et +8 % sur Super Mint par rapport au T4 2025, avec un effort sur les boutiques de quartier.','Budget 2026']]}];
  var MSUG=[['Quelles promos avons-nous faites à la rentrée ?','m0'],['Qui gère le compte Carrefour ?','m1'],['Résume le dernier comité de direction','m3']];
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
    function render(){var q=norm(inp.value.trim()),h='',n=0,lim=(q||pn._v36all)?1e9:20,tot=0;
      J.forEach(function(lab,gi){var L=o.sess.filter(function(s){return s.g===gi&&(!q||norm(s.t).indexOf(q)>=0)});L=L.filter(function(){return tot++<lim});if(!L.length)return;
        h+='<div class="v35-hg">'+lab+'</div>';L.forEach(function(s){n++;h+='<button type="button" class="v35-hi'+(s.id===cur?' on':'')+'" data-h="1" data-id="'+s.id+'"'+(s.id===cur?' aria-current="true"':'')+'>'+(s.c==='tg'?IC.tg:IC.web)+'<span>'+esc(s.t)+'</span><small>'+(s.c==='tg'?'Telegram':'Web')+'</small></button>'})});
      list.innerHTML=(n?h:'<p class="v35-hn">Aucune conversation pour « '+esc(inp.value.trim())+' ».</p>')+(tot>lim?'<button type="button" class="v36-more" data-h="1">Charger les plus anciennes</button>':'')}
    function open(on){pn.hidden=!on;btn.setAttribute('aria-expanded',on);if(on){inp.value='';render();setTimeout(function(){inp.focus()},30)}}
    function show(id){var s=o.sess.filter(function(x){return x.id===id})[0];if(!s&&id!=='new')return;
      if(cur===id&&id!=='new'){open(false);return}
      o.leave(cur);cur=id;o.show(s||null);title(s?s.t:'Nouvelle conversation');open(false)}
    btn.addEventListener('click',function(e){stop(e);open(pn.hidden)});
    $('.v35-nw',bar).addEventListener('click',function(e){stop(e);if(cur==='new'){o.show(null);open(false);var gi=document.querySelector('.gin2 textarea, .gin2 input[type=text], .gin2 .v33-in');if(gi)gi.focus()}else show('new')});
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
    var dayOf=function(s){return J[s.g]||'Cette semaine'};
    var build=function(s){var h='<span class="day">'+dayOf(s)+'</span>';s.m.forEach(function(x){h+='<div class="msg '+(x[0]==='m'?'moi':'lui')+'"><div class="bub">'+esc(x[1])+'</div><time>'+esc(x[2])+(x[0]==='m'&&s.c==='tg'?TGI:'')+'</time></div>'});
      var d=document.createElement('div');d.innerHTML=h;return [].slice.call(d.childNodes)};
    var emptyEl=function(){var d=document.createElement('div');d.className='v35-empty';
      d.innerHTML='<h3>Nouvelle conversation</h3><p>Que voulez-vous confier à '+NOM[EX]+' ?</p><div class="v35-sg">'+SUG[EX].map(function(t){return '<button type="button" data-h="1">'+esc(t)+'</button>'}).join('')+'</div>';return d};
    var hx=histo({host:CH,sess:S,start:S[0].id,mount:function(b){CH.insertBefore(b,CH.firstChild)},
      leave:function(id){var s=S.filter(function(x){return x.id===id})[0];var kids=[].slice.call(TH.childNodes);kids.forEach(function(k){k.remove()});if(s)s.nodes=kids},
      show:function(s){TH.classList.toggle('v35-new',!s);[].slice.call(TH.childNodes).forEach(function(k){k.remove()});
        (s?(s.nodes||(s.nodes=build(s))):[emptyEl()]).forEach(function(k){TH.appendChild(k)});TH.scrollTop=TH.scrollHeight}});
    // une suggestion part comme un vrai message ; le premier message d’une nouvelle conversation la range dans l’historique
    TH.addEventListener('click',function(e){var b=e.target.closest('.v35-sg button');if(!b)return;stop(e);var i=$('.v33-in',CH),sb=$('.v33-send',CH);
      if(i&&sb){i.value=b.textContent;sb.click()}else say('Message envoyé à '+NOM[EX])});
    new MutationObserver(function(){if(hx.cur()!=='new')return;var m=$('.msg.moi .bub',TH);if(!m)return;var em=$('.v35-empty',TH);if(em)em.remove();TH.classList.remove('v35-new');
      var t=m.textContent.trim();if(t.length>42)t=t.slice(0,40).replace(/\s+\S*$/,'')+'…';hx.add({id:'n'+Date.now(),t:t,c:'web',g:0});
      var d=document.createElement('div');d.className='msg lui';d.innerHTML='<span class="typing"><i></i><i></i><i></i></span><time>'+NOM[EX]+' réfléchit…</time>';TH.appendChild(d);
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
  var ADML={admin:'la vue d’ensemble','admin-membres':'les membres','admin-membre':'la fiche du membre','admin-experts':'les Experts','admin-canaux':'les canaux','admin-connecteurs':'les connecteurs',
    'admin-facturation':'la facturation','admin-general':'les détails de l’entreprise','admin-analytics':'l’analytique','admin-modeles':'les modèles','admin-profil':'votre profil'};
  function zones(){var Z=[['.nowbox','ce que font vos Experts'],['.crew2','votre équipe'],['.v38-team','votre équipe'],['section.pcs2:not(.crew2)','les Experts à recruter',1],['.tbx','vos tableaux de bord'],['.ngrp','vos notifications',1],
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
    if(ss('v35-lent')){say('Chargement lent : chaque page attend 1,5 s avant de s’afficher');var m=a.closest('.acm,.pop,#sh-moi');if(m&&m.classList.contains('on'))m.classList.remove('on');document.body.classList.remove('shlock');lent()}else say('Chargement normal rétabli')});

  // ================= 4. recherche globale (Ctrl K ou Cmd K ; loupe en 390 px)
  if(TOP){
    var MAC=/Mac|iPhone|iPad/.test(navigator.platform||'');
    var TEAM=[['djeneba','Djénéba','Chief of Staff'],['fatima','Fatima','Marketing et contenu'],['koffi','Koffi','Design']];
    var RECR=[['adjoua','Adjoua','Recrutement'],['alioune','Alioune','Investissement'],['awa','Awa','Service client'],['fatou','Fatou','RH et paie'],['ibrahim','Ibrahim','Juridique'],
      ['kouassi','Kouassi','Ventes'],['mamadou','Mamadou','Finance'],['nadia','Nadia','Données'],['salif','Salif','Opérations']];
    var IDX=null;
    var fd=function(d){if(!d)return '';var p=d.split(/[- :]/);return p[2]+'/'+p[1]};
    function index(){if(IDX)return IDX;IDX=[];var mine=ME.ex,dl=['aujourd’hui','hier','cette semaine','la semaine dernière','en septembre'];
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
    so.innerHTML='<div class="v35-sp"><div class="v35-sh">'+IC.search+'<input type="search" placeholder="Chercher un Expert, une conversation, un livrable" aria-label="Rechercher" role="combobox" aria-expanded="true" aria-controls="v35-sl" aria-autocomplete="list" autocomplete="off">'+
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
        if(!shown.length)h='<p class="v35-snone">Aucun résultat pour « '+esc(raw)+' ».</p>'}
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

/* v4.37 (add86) : messages unifiés (toasts), pop-up d’erreur, chargement, catalogue des états, simulation d’erreurs,
   notifications groupées par expert, mode hors ligne léger. Préfixe v36-. */
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function svg(p){return '<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
  function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);if(v===null)sessionStorage.removeItem(k);else sessionStorage.setItem(k,v)}catch(e){return null}}
  function jget(k){try{return JSON.parse(ls(k)||'[]')}catch(_){return []}}
  function stop(e){e.preventDefault();e.stopPropagation()}
  var IC={ok:svg('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),info:svg('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'),
    warn:svg('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>'),
    err:svg('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>'),x:svg('<path d="M18 6 6 18M6 6l12 12"/>'),
    wifi:svg('<path d="M12 20h.01M8.5 16.43a5 5 0 0 1 7 0M5 12.86a10 10 0 0 1 5.17-2.69M19 12.86a10 10 0 0 0-2.01-1.53M2 8.82a15 15 0 0 1 4.18-2.65M22 8.82a15 15 0 0 0-11.29-3.76M2 2l20 20"/>'),
    wifiok:svg('<path d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.86a10 10 0 0 1 14 0M8.5 16.43a5 5 0 0 1 7 0"/>'),
    lock:svg('<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),clock:svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
    shield:svg('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4M12 16h.01"/>'),
    file:svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M12 12v4M12 19h.01"/>'),
    filex:svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M9.5 12.5l5 5M14.5 12.5l-5 5"/>'),
    card:svg('<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20M6 15h4"/>'),pause:svg('<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>'),
    gauge:svg('<path d="m12 14 4-4M3.34 19a10 10 0 1 1 17.32 0"/>'),check:svg('<path d="M20 6 9 17l-5-5"/>'),checks:svg('<path d="M18 6 7 17l-5-5M22 10l-7.5 7.5L13 16"/>'),
    more:svg('<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'),chev:svg('<path d="m6 9 6 6 6-6"/>'),
    bug:svg('<path d="M12 20v-9M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4zM14.12 3.88 16 2M21 21a4 4 0 0 0-3.81-4M21 5a4 4 0 0 1-3.55 3.97M22 13h-4M3 21a4 4 0 0 1 3.81-4M3 5a4 4 0 0 0 3.55 3.97M6 13H2M8 2l1.88 1.88M9 7.13V6a3 3 0 1 1 6 0v1.13"/>'),
    search:svg('<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>'),server:svg('<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>'),
    up:svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>')};
  var page=(location.pathname.split('/').pop()||'').replace('.html','');
  var Q=new URLSearchParams(location.search);
  var NOM={djeneba:'Djénéba',fatima:'Fatima',koffi:'Koffi'},FEM={djeneba:1,fatima:1},EX=NOM[page]?page:null;
  var PERS={admin:{n:'Aïcha Diabaté',ex:['djeneba','fatima','koffi']},membre:{n:'Nadège Touré',ex:['fatima','koffi']},membre0:{n:'Didier Yapi',ex:[]}};
  var VUE=PERS[ls('v33-vue')]?ls('v33-vue'):'admin',ME=PERS[VUE],MEMBRE=VUE!=='admin';
  var TOP=$('header.top');
  var V36={};window.v36=V36;

  // ================= 1. messages (toasts) : succès, info, avertissement, erreur ; action ; 3 au plus
  var TS=document.createElement('div');TS.className='v36-ts';TS.setAttribute('aria-label','Messages');document.body.appendChild(TS);
  var OLD=$('.toast');if(OLD){OLD.removeAttribute('role');OLD.setAttribute('aria-hidden','true');OLD.classList.add('v36-old')}
  function kind(m){var s=String(m).toLowerCase();
    if(/impossible|échec|échoué|erreur|introuvable|n’a pas pu|n'a pas pu|refusé par|injoignable|indisponible|toujours pas/.test(s))return 'err';
    if(/^(écrivez|donnez|choisissez un |choisissez une |ajoutez|indiquez|entrez|renseignez|sélectionnez|collez)|gardé|pas de connexion|hors ligne|bloqué|attention|expir/.test(s))return 'warn';
    if(/envoy|copi|enregistr|ajout|créé|crée |supprim|connecté|activé|importé|renomm|invit|mis à jour|mise à jour|c’est fait|c'est fait|prêt|accordé|terminé|validé|reprise|rétabli|partag|reçu|marqu|publi|téléchargement|planifi|programm|retiré|accepté|de nouveau en service/.test(s))return 'ok';
    return 'info'}
  function gone(t){if(t._gone)return;t._gone=1;clearTimeout(t._tm);t.classList.remove('on');t.classList.add('v36-gone');setTimeout(function(){t.remove()},230)}
  function arm(t){clearTimeout(t._tm);if(t._d)t._tm=setTimeout(function(){gone(t)},t._d)}
  function toast2(m,o){if(typeof o==='string')o={type:o};o=o||{};m=String(m==null?'':m);if(/^(Je vous écoute|Texte dicté)/.test(m)&&!document.body.classList.contains('v38-incall'))return null;/* point 122 : la dictée se signale dans le composeur seul */var ty=o.type||kind(m);
    if(OLD){OLD.textContent=m;OLD.classList.add('on');clearTimeout(OLD._t);OLD._t=setTimeout(function(){OLD.classList.remove('on')},2600)}
    var same=$$('.v36-t',TS).filter(function(t){return t._m===m&&!t._gone})[0];
    if(same&&!o.action){same.classList.remove('v36-pulse');void same.offsetWidth;same.classList.add('v36-pulse');arm(same);return same}
    var t=document.createElement('div');t.className='v36-t v36-'+ty;t._m=m;t.setAttribute('role',ty==='err'?'alert':'status');
    t.innerHTML='<span class="v36-ti">'+IC[ty]+'</span><span class="v36-tx">'+esc(m)+'</span>'+(o.action?'<button type="button" class="v36-ta" data-h="1">'+esc(o.action.label)+'</button>':'')+
      '<button type="button" class="v36-tc" data-h="1" aria-label="Fermer le message">'+IC.x+'</button>';
    TS.appendChild(t);var live=$$('.v36-t',TS).filter(function(x){return !x._gone});while(live.length>3)gone(live.shift());
    if(o.action)$('.v36-ta',t).addEventListener('click',function(e){stop(e);gone(t);o.action.fn()});
    $('.v36-tc',t).addEventListener('click',function(e){stop(e);gone(t)});
    t._d=(o.sticky||ty==='err')?0:o.action?7000:ty==='warn'?5000:3400;arm(t);
    t.addEventListener('mouseenter',function(){clearTimeout(t._tm)});t.addEventListener('mouseleave',function(){arm(t)});
    t.addEventListener('focusin',function(){clearTimeout(t._tm)});
    requestAnimationFrame(function(){t.classList.add('on')});return t}
  window.toast=toast2;V36.toast=toast2;var say=toast2;

  // ================= 2. bouton en cours (spinner, libellé, désactivé)
  function busy(b,lab){if(!b||b._v36b)return;b._v36b=b.innerHTML;b._v36w=b.style.minWidth;b.style.minWidth=b.offsetWidth+'px';b.classList.add('v36-busy');b.setAttribute('aria-busy','true');
    if('disabled' in b&&b.tagName==='BUTTON')b.disabled=true;b.setAttribute('aria-disabled','true');b.innerHTML='<span class="v36-spin" aria-hidden="true"></span><span>'+esc(lab)+'</span>'}
  function unbusy(b){if(!b||!b._v36b)return;b.innerHTML=b._v36b;b._v36b=null;b.style.minWidth=b._v36w||'';b.classList.remove('v36-busy');b.removeAttribute('aria-busy');b.removeAttribute('aria-disabled');if(b.tagName==='BUTTON')b.disabled=false}
  V36.busy=busy;V36.unbusy=unbusy;
  // un clic sur sel : bouton en cours pendant ms, puis l’action d’origine (clic rejoué)
  function gate(sel,lab,ms,pre,after){document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest(sel);if(!b||b._v36go)return;
    if(b._v36b){e.preventDefault();e.stopImmediatePropagation();return}if(pre&&pre(b,e)===false)return;
    e.preventDefault();e.stopImmediatePropagation();busy(b,lab);
    setTimeout(function(){unbusy(b);b._v36go=1;try{b.click()}finally{b._v36go=0}if(after)after(b)},ms)},true)}
  gate('#inv .invgo','Envoi…',800,null,function(b){var em=$('#inv input[type=email]');say('Invitation envoyée'+(em&&em.value.trim()?' à '+em.value.trim():''),'ok')});
  gate('[data-toast="Profil enregistré"]','Enregistrement…',700);
  gate('#v33-rtm .v33-rok','Création…',700,function(b){var c=$('#v33-rtm .v33-rc');return !!(c&&c.value.trim())});
  // paiement : en cours, puis accepté, ou refusé par la banque (simulation)
  if(Q.get('paiement')==='refuse')ss('v36-payko','1');if(Q.get('paiement')==='ok')ss('v36-payko',null);
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#payer .pyd a.btn.p, #jeko .jgo');if(!b||b._v36go)return;e.preventDefault();e.stopImmediatePropagation();if(b._v36b)return;
    busy(b,'Paiement…');setTimeout(function(){unbusy(b);if(ss('v36-payko')){CASES.paiement.run();return}
      var j=b.closest('#jeko');if(j)j.classList.remove('on');say('Paiement envoyé : validez-le sur votre téléphone, le reçu arrive par email','ok')},1000)},true);
  // connexion : bouton en cours, puis écran d’ouverture sur la page suivante
  var LF=$('[data-login]');
  if(LF)document.addEventListener('submit',function(e){if(e.target!==LF)return;e.preventDefault();e.stopImmediatePropagation();var b=$('.auok',LF);if(b&&b._v36b)return;
    var em=$('input[type=email]',LF),to=(em&&/^admin@/.test(em.value.trim()))?'admin.html':'accueil.html';busy(b,'Connexion…');ss('v36-splash','1');
    setTimeout(function(){location.href=to},800)},true);

  // ================= 3. écran d’ouverture (une fois par session, 1 s au plus)
  function splash(force){var d=document.createElement('div');d.className='v36-sp';d.setAttribute('role','status');d.setAttribute('aria-label','Ouverture de votre espace');
    d.innerHTML='<div class="v36-spc"><span class="v36-spl"><img src="../img/yelema_long.png" alt="Yelema"></span><i class="v36-spb"><b></b></i><small>Ouverture de votre espace…</small></div>';
    document.body.appendChild(d);var t=force?1400:850;setTimeout(function(){d.classList.add('out')},t);setTimeout(function(){d.remove()},t+220);return d}
  V36.splash=splash;
  if(ss('v36-splash')==='1'&&TOP){ss('v36-splash',null);if(!ss('v36-splashed')){ss('v36-splashed','1');splash()}}

  // ================= 4. pop-up d’erreur : composant commun
  var MD=null,MPREV=null;
  function closeModal(){if(MD){MD.classList.remove('on');if(MPREV&&MPREV.focus)try{MPREV.focus()}catch(_){}}}
  function mbtn(x,cl,k){if(!x)return '';return x.href?'<a class="btn '+cl+' '+k+'" href="'+x.href+'">'+esc(x.l)+'</a>':'<button type="button" class="btn '+cl+' '+k+'" data-h="1">'+esc(x.l)+'</button>'}
  function modal(c){if(!MD){MD=document.createElement('div');MD.className='modal v36-m';MD.id='v36-m';
      MD.innerHTML='<div class="ov" data-v36x></div><div class="pn v36-pn" role="alertdialog" aria-modal="true" aria-labelledby="v36-mt" aria-describedby="v36-mp"></div>';document.body.appendChild(MD);
      MD.addEventListener('click',function(e){if(e.target.closest('[data-v36x]')){stop(e);if(!MD._nox)closeModal()}});
      MD.addEventListener('keydown',function(e){if(e.key!=='Tab')return;var f=$$('button,a[href]',MD).filter(function(x){return x.offsetParent});if(!f.length)return;
        if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}})}
    MPREV=document.activeElement;MD._nox=!!c.nox;var pn=$('.pn',MD);pn.className='pn v36-pn v36-'+(c.tone||'ko');
    pn.innerHTML=(c.nox?'':'<button type="button" class="v36-mx" data-v36x data-h="1" aria-label="Fermer">'+IC.x+'</button>')+'<span class="v36-mi">'+c.ic+'</span><h2 id="v36-mt">'+esc(c.t)+'</h2><p id="v36-mp">'+esc(c.p)+'</p>'+(c.body||'')+
      '<div class="v36-mb">'+mbtn(c.b,'o','v36-mb2')+mbtn(c.a,'p','v36-mb1')+'</div>';
    [['.v36-mb1',c.a],['.v36-mb2',c.b]].forEach(function(z){var el=$(z[0],pn);if(!el||!z[1]||z[1].href)return;el.addEventListener('click',function(e){stop(e);if(z[1].fn)z[1].fn(el);else closeModal()})});
    MD.classList.add('on');setTimeout(function(){var f=(c.body&&$('input',pn))||$('.v36-mb1',pn);if(f){f.focus();if(f.select&&c.sel)f.select()}},40);return MD}
  V36.modal=modal;V36.close=closeModal;

  function pick(){closeModal();var i=LASTINP||$('#drive .v33-if');if(i)i.click();else say('Ouvrez les Livrables d’un Expert pour importer un fichier','info')}
  function mo(n){return n>=1048576?(n/1048576).toFixed(n>=10485760?0:1).replace('.',',')+' Mo':Math.max(1,Math.round(n/1024))+' Ko'}
  var who=function(){return EX||(MEMBRE?ME.ex[0]:'fatima')||'fatima'};
  var CASES={
    connexion:{n:'Connexion perdue',d:'Bandeau en haut, puis Connexion rétablie',ic:IC.wifi,run:function(){netSim(!OFF)}},
    session:{n:'Session expirée',d:'Se reconnecter',ic:IC.clock,run:function(){modal({ic:IC.clock,tone:'warn',nox:1,t:'Votre session a expiré',p:'Pour protéger vos données, reconnectez-vous. Ce que vous avez écrit est gardé.',a:{l:'Se reconnecter',href:'connexion.html'}})}},
    acces:{n:'Accès refusé',d:'Page réservée à l’admin',ic:IC.lock,run:function(){modal({ic:IC.lock,tone:'ko',t:'Cette page est réservée à l’admin',p:'Demandez l’accès à votre admin, ou revenez à l’accueil.',
      a:{l:'Demander l’accès',fn:function(){closeModal();say('Demande d’accès envoyée à votre admin','ok')}},b:{l:'Retour',href:'accueil.html'}})}},
    lourd:{n:'Fichier trop lourd',d:'Import de plus de 25 Mo',ic:IC.file,run:function(f,n){f=f||{name:'Film Sossa 30 s.mp4',size:48*1048576};
      modal({ic:IC.file,tone:'warn',t:'Fichier trop lourd, 25 Mo maximum',p:'« '+f.name+' » fait '+mo(f.size)+(n>1?', et '+(n-1)+' autre'+(n>2?'s':'')+' aussi':'')+'. Compressez-le, ou partagez-le par un lien.',a:{l:'Choisir un autre fichier',fn:pick},b:{l:'Fermer'}})}},
    format:{n:'Format non pris en charge',d:'Un .exe dans les Livrables',ic:IC.filex,run:function(f){var x=f?((/\.([a-z0-9]+)$/i.exec(f.name)||[,''])[1]||'sans extension'):'exe';
      modal({ic:IC.filex,tone:'warn',t:'Format non pris en charge',p:'Les fichiers .'+x.toLowerCase()+' ne s’importent pas. Envoyez un PDF, un document Office, une image, une vidéo ou un ZIP.',a:{l:'Choisir un autre fichier',fn:pick},b:{l:'Fermer'}})}},
    paiement:{n:'Paiement refusé',d:'Facturation',ic:IC.card,run:function(){modal({ic:IC.card,tone:'ko',t:'Paiement refusé par votre banque',p:'Aucun montant n’a été prélevé. Changez de moyen de paiement, ou réessayez dans un instant.',
      b:{l:'Changer de moyen de paiement',fn:function(){closeModal();var j=$('#jeko.on');if(j)j.classList.remove('on');var p=$('#payer .pys');if(p){p.scrollIntoView({behavior:'smooth',block:'center'});var o=$('#payer .pyo:not(.on)')||$('#payer .pyo');if(o){o.setAttribute('tabindex','-1');setTimeout(function(){o.focus()},300)}}else location.href='admin-facturation.html#payer'}},
      a:{l:'Réessayer',fn:function(b){busy(b,'Paiement…');setTimeout(function(){unbusy(b);closeModal();ss('v36-payko',null);say('Paiement accepté, le reçu arrive par email','ok')},1100)}}})}},
    pause:{n:'Expert en pause',d:'Écrire à un Expert en pause',ic:IC.pause,run:function(){var x=who(),n=NOM[x],l=FEM[x]?'la':'le';
      if(MEMBRE)modal({ic:IC.pause,tone:'warn',t:n+' est en pause',p:'Votre admin peut '+l+' relancer. Votre message est gardé, il partira à son retour.',a:{l:'Prévenir l’admin',fn:function(){closeModal();say('Admin prévenue : vous attendez '+n,'ok')}},b:{l:'Fermer'}});
      else modal({ic:IC.pause,tone:'warn',t:n+' est en pause',p:'Relancez-'+l+' pour qu’'+(FEM[x]?'elle':'il')+' reprenne le travail. Votre message est gardé.',a:{l:'Relancer '+n,fn:function(){ss('v36-pause',null);closeModal();say(n+' est de nouveau en service','ok')}},b:{l:'Fermer'}})}},
    quota:{n:'Budget du mois atteint',d:'Côté admin',ic:IC.gauge,run:function(){modal({ic:IC.gauge,tone:'warn',t:'Budget du mois atteint',p:'Vos Experts ont utilisé tout le budget d’octobre. Ils reprennent dès que vous augmentez le plafond.',
      a:{l:'Augmenter le plafond',fn:function(){closeModal();if(page==='admin')say('Réglez le seuil dans Consommation IA','info');else location.href='admin.html#credits'}},b:{l:'Plus tard'}})}},
    introuvable:{n:'Page introuvable',d:'Page 404',ic:IC.search,run:function(){location.href='404.html'}},
    serveur:{n:'Un problème de notre côté',d:'Page d’erreur',ic:IC.server,run:function(){location.href='erreur.html'}}};
  V36.cases=CASES;

  // déclencheurs par l’adresse
  if(Q.get('session')==='expiree')setTimeout(CASES.session.run,60);
  if(Q.get('quota')==='1')setTimeout(CASES.quota.run,60);
  if(EX&&Q.get('pause')==='1')ss('v36-pause',EX);if(Q.get('pause')==='0')ss('v36-pause',null);
  if(MEMBRE&&/^admin/.test(page))setTimeout(CASES.acces.run,60);

  // ================= 5. import des Livrables : contrôle (25 Mo, formats) et progression par fichier
  var OKX=/^(pdf|docx?|xlsx?|csv|pptx?|key|txt|md|rtf|odt|ods|odp|png|jpe?g|gif|webp|svg|heic|mp4|mov|webm|mp3|m4a|wav|zip|rar)$/i,MAX=25*1048576,LASTINP=null;
  var UP=null;
  function upPanel(){if(UP&&document.body.contains(UP))return UP;UP=document.createElement('div');UP.className='v36-up';UP.setAttribute('role','region');UP.setAttribute('aria-label','Import en cours');
    UP.innerHTML='<div class="v36-uph"><b class="v36-upt">Import</b><button type="button" class="v36-upx" data-h="1" aria-label="Fermer le suivi d’import" hidden>'+IC.x+'</button></div><div class="v36-upl"></div>';
    document.body.appendChild(UP);$('.v36-upx',UP).addEventListener('click',function(e){stop(e);UP.remove();UP=null});return UP}
  function progress(files,add){var P=upPanel(),L=$('.v36-upl',P),rows=[],left=files.length,done=[];$('.v36-upx',P).hidden=true;
    $('.v36-upt',P).textContent='Import de '+files.length+' fichier'+(files.length>1?'s':'');
    function end(){if(--left>0)return;$('.v36-upx',P).hidden=false;var ok=rows.filter(function(r){return r.ok});
      $('.v36-upt',P).textContent=ok.length?ok.length+' fichier'+(ok.length>1?'s importés':' importé'):'Import annulé';
      if(ok.length)add(ok.map(function(r){return r.f}));else say('Import annulé','info');
      setTimeout(function(){if(UP===P&&!rows.some(function(r){return r.run})){P.classList.add('out');setTimeout(function(){if(UP===P){P.remove();UP=null}},250)}},2600)}
    files.forEach(function(f){var r={f:f,run:true,ok:false,p:0},d=document.createElement('div');d.className='v36-ur';
      d.innerHTML='<span class="v36-urn"><b>'+esc(f.name)+'</b><small>'+mo(f.size||1024)+'</small></span><span class="v36-urp">0 %</span><button type="button" class="v36-urx" data-h="1" aria-label="Annuler l’import de '+esc(f.name)+'">Annuler</button>'+
        '<i class="v36-urb" role="progressbar" aria-label="Progression de '+esc(f.name)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><b></b></i>';
      L.appendChild(d);rows.push(r);var dur=650+Math.min(2600,(f.size||1024)/1048576*110),t0=Date.now();
      r.tm=setInterval(function(){var p=Math.min(100,Math.round((Date.now()-t0)/dur*100));r.p=p;$('.v36-urb b',d).style.width=p+'%';$('.v36-urb',d).setAttribute('aria-valuenow',p);$('.v36-urp',d).textContent=p+' %';
        if(p>=100){clearInterval(r.tm);r.run=false;r.ok=true;d.classList.add('ok');$('.v36-urp',d).innerHTML=IC.check+'<span>Importé</span>';var x=$('.v36-urx',d);if(x)x.remove();end()}},60);
      $('.v36-urx',d).addEventListener('click',function(e){stop(e);if(!r.run)return;clearInterval(r.tm);r.run=false;d.classList.add('ko');$('.v36-urp',d).textContent='Annulé';e.currentTarget.remove();end()})})}
  V36.progress=progress;
  window.v36imp=function(files,add,inp){LASTINP=inp||LASTINP;var ok=[],big=[],bad=[];
    files.forEach(function(f){var x=(/\.([a-z0-9]+)$/i.exec(f.name)||[,''])[1];if(!OKX.test(x))bad.push(f);else if(f.size>MAX)big.push(f);else ok.push(f)});
    if(ok.length)progress(ok,add);if(big.length)CASES.lourd.run(big[0],big.length);else if(bad.length)CASES.format.run(bad[0])};

  // ================= 6. chat : « <Prénom> réfléchit… », puis la réponse
  var REP={djeneba:'C’est noté, je m’en occupe. Je vous fais un retour ici dans quelques minutes.',fatima:'C’est noté, je m’y mets. Je vous montre une première version ici.',koffi:'C’est noté, je prépare les visuels et je vous les montre ici.'};
  function think(th,after,x,mem){if(!th)return;var n=NOM[x]||'Votre Expert',d=document.createElement('div');
    if(mem){d.className='gm2 lui v36-th';d.innerHTML='<div class="ba"><span class="typing"><i></i><i></i><i></i></span> <small class="v36-thl">Le chat entreprise réfléchit…</small></div>'}
    else{d.className='msg lui v36-th';d.innerHTML='<span class="typing"><i></i><i></i><i></i></span><time>'+esc(n)+' réfléchit…</time>'}
    if(after&&after.parentNode===th)after.insertAdjacentElement('afterend',d);else th.appendChild(d);d.setAttribute('aria-live','polite');
    setTimeout(function(){if(mem)d.innerHTML='<div class="ba"><p>C’est noté. Je cherche dans les documents de l’entreprise et je vous réponds ici.</p></div>';
      else d.innerHTML='<div class="bub">'+esc(REP[x]||'C’est noté, je m’en occupe.')+'</div><time>à l’instant</time>';d.classList.remove('v36-th');th.scrollTop=th.scrollHeight},1500);
    th.scrollTop=th.scrollHeight;return d}
  V36.think=think;
  function watch(th,x){$$('.msg',th).forEach(function(n){n._v36=1});new MutationObserver(function(ms){ms.forEach(function(m){[].forEach.call(m.addedNodes,function(nd){
      if(nd.nodeType!==1||!nd.classList.contains('msg')||!nd.classList.contains('moi')||nd.classList.contains('v36-pend')||nd._v36)return;nd._v36=1;var tm=$('time',nd);if(!tm||!/à l’instant/.test(tm.textContent))return;
      var nx=nd.nextElementSibling;if(nx&&$('.typing',nx)&&/réfléchit/.test(nx.textContent))return;think(th,nd,x)})})}).observe(th,{childList:true})}
  if(EX){var TH0=$('#discussion .thread');if(TH0)watch(TH0,EX)}
  $$('.cm .cth').forEach(function(c){var x=c.id.replace('c-','');var th=$('.thread',c);if(th&&NOM[x])watch(th,x)});

  // ================= 7. connexion perdue : bandeau, file d’attente des messages, envoi au retour
  var OFF=false;
  function q(){return jget('v36-q')}function qset(a){ls('v36-q',a.length?JSON.stringify(a):null)}
  function banner(on){var b=$('.v36-net');
    if(on){if(!b){b=document.createElement('div');b.className='v36-net';b.setAttribute('role','status');document.body.appendChild(b)}b.classList.remove('back');
      b.innerHTML='<span class="v36-neti">'+IC.wifi+'</span><span class="v36-nett"><b>Pas de connexion, on réessaie…</b> <span>Vos messages partiront dès le retour du réseau.</span></span><button type="button" class="v36-netb" data-h="1">Réessayer</button>';
      $('.v36-netb',b).addEventListener('click',function(e){stop(e);var bt=e.currentTarget;busy(bt,'Essai…');setTimeout(function(){unbusy(bt);
        if(ss('v36-off'))netSim(false);else if(navigator.onLine===false)say('Toujours pas de réseau, on réessaie toutes les 10 secondes','warn');else net(false)},900)})}
    else if(b){b.classList.add('back');b.innerHTML='<span class="v36-neti">'+IC.wifiok+'</span><span class="v36-nett"><b>Connexion rétablie</b></span>';setTimeout(function(){if(b.classList.contains('back')){b.classList.add('out');setTimeout(function(){b.remove()},250)}},1800)}}
  function net(off,quiet){if(off===OFF)return;OFF=off;document.documentElement.classList.toggle('v36-offl',off);banner(off);simLabels();if(!off&&!quiet)flush()}
  function netSim(off){ss('v36-off',off?'1':null);if(!off&&navigator.onLine===false){say('Toujours pas de réseau, on réessaie toutes les 10 secondes','warn');return}net(off)}
  V36.net=net;V36.netSim=netSim;
  window.addEventListener('offline',function(){net(true)});window.addEventListener('online',function(){if(!ss('v36-off'))net(false)});
  if(Q.get('horsligne')==='1')ss('v36-off','1');if(Q.get('horsligne')==='0')ss('v36-off',null);
  // trouver le fil d’un composeur
  function fil(inp){var cm=inp.closest('.cm'),ch=inp.closest('.chat2'),gm=inp.closest('.gmain');
    if(cm){var c=$('.cth.on',cm),th=c&&$('.thread',c);return th?{el:th,k:c.id,x:c.id.replace('c-','')}:null}
    if(ch){var t=$('.thread',ch);return t?{el:t,k:'disc',x:EX}:null}
    if(gm){var cv=$('.gconv',gm);return cv?{el:cv,k:'mem',mem:1}:null}return null}
  function filK(k){if(k==='disc')return EX&&$('#discussion .thread')?{el:$('#discussion .thread'),k:k,x:EX}:null;if(k==='mem'){var cv=$('.gmain .gconv');return cv?{el:cv,k:k,mem:1}:null}
    var c=document.getElementById(k);return c&&$('.thread',c)?{el:$('.thread',c),k:k,x:k.replace('c-','')}:null}
  function pendEl(it,f){var d=document.createElement('div');d.dataset.q=it.id;
    var st='<span class="v36-qs"><span class="v36-qi">'+IC.clock+'</span><span class="v36-ql">En attente de connexion</span><button type="button" class="v36-qm" data-h="1" aria-label="Plus d’actions pour ce message" aria-expanded="false">'+IC.more+'</button>'+
      '<span class="v36-qmm" hidden><button type="button" class="v36-qx" data-h="1">Annuler l’envoi</button></span></span>';
    if(f.mem){d.className='gm2 moi v36-pend';d.innerHTML='<div class="bq">'+esc(it.x)+'</div>'+st}else{d.className='msg moi v36-pend';d.innerHTML='<div class="bub">'+esc(it.x)+'</div><div class="v36-qw">'+st+'</div>'}
    d._v36=1;return d}
  function place(f,d){var th=f.el;if(f.mem){var g=$$('.gfil',th).filter(function(x){return x.style.display!=='none'&&x.offsetParent})[0];var gm=th.closest('.gmain');if(gm)gm.classList.remove('vide');(g||th).appendChild(d);return}
    var last=th.lastElementChild;if(last&&$('.typing',last)&&!last.classList.contains('v36-th'))th.insertBefore(d,last);else th.appendChild(d);th.scrollTop=th.scrollHeight}
  function enqueue(inp){var v=inp.value.trim(),f=fil(inp);if(!v||!f)return false;var it={id:'q'+Date.now()+Math.floor(Math.random()*99),pg:page,k:f.k,x:v,t:Date.now()};
    var a=q();a.push(it);qset(a);place(f,pendEl(it,f));inp.value='';return true}
  function flush(){var a=q();if(!a.length)return;qset([]);var n=a.length,k=0;
    a.forEach(function(it){var d=$('[data-q="'+it.id+'"]');if(!d)return;var f=filK(it.k);var delay=350*(k++);
      setTimeout(function(){d.classList.remove('v36-pend');d.classList.add('v36-sent');var s=$('.v36-qs',d);if(s)s.outerHTML='<span class="v36-qs ok"><span class="v36-qi">'+IC.check+'</span><span class="v36-ql">Envoyé à l’instant</span></span>';
        if(f&&(f.mem||NOM[f.x]))think(f.el,d,f.x,f.mem)},delay)});
    say(n+' message'+(n>1?'s envoyés':' envoyé'),'ok')}
  V36.flush=flush;
  // réafficher la file au rechargement
  q().filter(function(it){return it.pg===page}).forEach(function(it){var f=filK(it.k);if(f)place(f,pendEl(it,f))});
  // menu ⋯ d’un message en attente : Annuler l’envoi
  document.addEventListener('click',function(e){var m=e.target.closest&&e.target.closest('.v36-qm');
    if(m){stop(e);var mm=m.nextElementSibling,was=!mm.hidden;$$('.v36-qmm').forEach(function(x){x.hidden=true});$$('.v36-qm').forEach(function(x){x.setAttribute('aria-expanded','false')});mm.hidden=was;m.setAttribute('aria-expanded',!was);if(!was)$('.v36-qx',mm).focus();return}
    var x=e.target.closest&&e.target.closest('.v36-qx');if(x){stop(e);var d=x.closest('[data-q]');qset(q().filter(function(it){return it.id!==d.dataset.q}));d.remove();say('Envoi annulé, le message est retiré','info');return}
    if(!(e.target.closest&&e.target.closest('.v36-qmm')))$$('.v36-qmm').forEach(function(x){x.hidden=true})});
  // envoyer : hors ligne = en file ; expert en pause = pop-up (capture, avant l’envoi d’origine)
  function sendGuard(e,inp){if(!inp)return;
    if(EX&&ss('v36-pause')===EX&&inp.closest('#discussion')){e.preventDefault();e.stopImmediatePropagation();CASES.pause.run();return}
    if(OFF){if(!inp.value.trim())return;e.preventDefault();e.stopImmediatePropagation();enqueue(inp)}}
  document.addEventListener('click',function(e){var sb=e.target.closest&&e.target.closest('.v33-send');if(!sb)return;var c=sb.parentNode;while(c&&c!==document&&!$('.v33-in',c))c=c.parentNode;sendGuard(e,c&&c!==document?$('.v33-in',c):null)},true);
  document.addEventListener('keydown',function(e){if(e.key!=='Enter'||!e.target.classList||!e.target.classList.contains('v33-in'))return;sendGuard(e,e.target)},true);
  if(!navigator.onLine||ss('v36-off'))net(true,1);else if(q().length)setTimeout(flush,400);

  // ================= 8. menu du compte : « Simuler une erreur… » (petit menu maison)
  var SM=null;
  function simLabels(){$$('.v36-smc').forEach(function(b){$('b',b).textContent=OFF?'Rétablir la connexion':'Connexion perdue'})}
  function simMenu(){if(!SM){SM=document.createElement('div');SM.className='modal v36-sm';SM.id='v36-sm';
      var h='<div class="ov" data-v36y></div><div class="pn v36-smp" role="dialog" aria-modal="true" aria-labelledby="v36-smt"><div class="v36-smh"><h2 id="v36-smt">Simuler une erreur</h2><button type="button" class="v36-mx" data-v36y data-h="1" aria-label="Fermer">'+IC.x+'</button></div><div class="v36-sml">';
      Object.keys(CASES).forEach(function(k){var c=CASES[k];h+='<button type="button" class="v36-smi'+(k==='connexion'?' v36-smc':'')+'" data-h="1" data-v36s="'+k+'"><span class="v36-smic">'+c.ic+'</span><span><b>'+esc(c.n)+'</b><small>'+esc(c.d)+'</small></span></button>'});
      SM.innerHTML=h+'</div><a class="v36-sma" href="etats.html">Voir tous les états et messages</a></div>';document.body.appendChild(SM);
      SM.addEventListener('click',function(e){if(e.target.closest('[data-v36y]')){stop(e);SM.classList.remove('on');return}var b=e.target.closest('[data-v36s]');if(!b)return;stop(e);SM.classList.remove('on');CASES[b.dataset.v36s].run()});simLabels()}
    SM.classList.add('on');setTimeout(function(){var f=$('.v36-smi',SM);if(f)f.focus()},40)}
  V36.sim=simMenu;
  $$('.v35-lz').forEach(function(lz){var a=document.createElement('a');a.className=lz.className.replace('v35-lz','v36-sim');a.href='#';a.dataset.h='1';a.innerHTML=IC.bug+' <span>Simuler une erreur…</span>';lz.insertAdjacentElement('afterend',a)});
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.v36-sim');if(!a)return;stop(e);var m=a.closest('.acm,.pop,#sh-moi');if(m&&m.classList.contains('on'))m.classList.remove('on');document.body.classList.remove('shlock');simMenu()});

  // ================= 9. notifications groupées par expert (panneau de la cloche et page Notifications)
  var NB=[
    {id:'n1',x:'fatima',t:'Nouveau message de Fatima',s:'La version Instagram du post Sossa est prête',h:'fatima.html#discussion',d:'10:31',u:1},
    {id:'n3',x:'koffi',t:'Packaging Super Mint v2 livré',s:'Envoyé à Yao pour l’impression',h:'koffi.html#drive',d:'09:40'},
    {id:'n8',x:'koffi',t:'Nouveau message de Koffi',s:'L’affiche de la promo rentrée Sossa est prête',h:'koffi.html#discussion',d:'09:24',u:1},
    {id:'n2',x:'djeneba',t:'Note au comité prête',s:'Pour la réunion de demain, 9 h',h:'djeneba.html#drive',d:'08:50',u:1},
    {id:'n4',x:'fatima',t:'Une routine de Fatima a échoué',s:'Veille des concurrents, Instagram ne répondait pas',h:'fatima.html#routines',d:'08:05',u:1},
    {id:'n9',x:'djeneba',t:'Votre point du jour est prêt',s:'Rendez-vous et urgences du jour',h:'djeneba.html#discussion',d:'08:00'},
    {id:'n5',x:'y',t:'Nadège a rejoint l’équipe',s:'Invitée par Aïcha Diabaté',h:'admin-membres.html',d:'hier, 17:20',u:1,adm:1},
    {id:'n6',x:'fatima',t:'Calendrier éditorial d’octobre prêt',s:'12 publications',h:'fatima.html#drive',d:'hier, 16:02'},
    {id:'n7',x:'y',t:'Facture d’octobre payée',s:'1 300 000 FCFA par Wave',h:'admin-facturation.html',d:'hier, 11:15',adm:1}];
  var GRP=[['djeneba','Djénéba'],['fatima','Fatima'],['koffi','Koffi'],['y','Yelema']];
  function items(){var L=NB.filter(function(it){return it.x==='y'?!MEMBRE:ME.ex.indexOf(it.x)>=0});
    if(!MEMBRE){jget('v33-req').forEach(function(r){L.unshift({id:'r'+r.t,x:'y',t:r.e?r.m+' souhaite recruter '+r.e:r.m+' demande un Expert',s:'Demande d’un membre',h:'admin-membres.html',d:'à l’instant',u:1})});
}
    var lu=jget('v36-lu');L.forEach(function(it){it.un=!!it.u&&lu.indexOf(it.id)<0});return L}
  var NF='all';
  function nread(ids){var lu=jget('v36-lu');ids.forEach(function(i){if(lu.indexOf(i)<0)lu.push(i)});ls('v36-lu',JSON.stringify(lu.slice(-200)));nall()}
  function plie(){return jget('v36-nplie')}
  function ngroups(mode){var L=items(),pl=plie(),h='',shown=0;
    GRP.forEach(function(g){var G=L.filter(function(it){return it.x===g[0]});if(!G.length)return;var un=G.filter(function(it){return it.un}).length;
      var V=G.filter(function(it){return NF==='all'||it.un});if(!V.length)return;shown++;var closed=pl.indexOf(g[0])>=0,gid='v36-ng-'+mode+'-'+g[0];
      var av=g[0]==='y'?'<span class="v36-nav y"><img src="../img/yelema_y.png" alt=""></span>':'<span class="v36-nav"><img src="../img/'+g[0]+'.jpg" alt=""></span>';
      h+='<section class="v36-ng'+(closed?' plie':'')+'" data-g="'+g[0]+'"><div class="v36-ngh"><button type="button" class="v36-ngt" data-h="1" aria-expanded="'+(!closed)+'" aria-controls="'+gid+'">'+av+'<b>'+g[1]+'</b>'+
        (un?'<em class="v36-ngc" aria-label="'+un+' non lue'+(un>1?'s':'')+'">'+un+'</em>':'')+'<span class="v36-ngv">'+IC.chev+'</span></button>'+
        (un?'<button type="button" class="v36-ngr" data-h="1">Marquer comme lu<span class="v36-sr"> : '+g[1]+'</span></button>':'')+'</div><div class="v36-ngi" id="'+gid+'"'+(closed?' hidden':'')+'>';
      V.forEach(function(it){h+='<a class="v36-ni'+(it.un?' un':'')+'" href="'+it.h+'" data-id="'+it.id+'">'+(it.un?'<i class="v36-nd"><span class="v36-sr">Non lue : </span></i>':'<i class="v36-nd0"></i>')+
        '<span class="v36-nx"><b>'+esc(it.t)+'</b><small>'+esc(it.s)+'</small></span><time>'+esc(it.d)+'</time></a>'});
      h+='</div></section>'});
    if(!shown)h='<p class="v36-nempty">'+(NF==='un'?'Aucune notification non lue. Tout est à jour.':'Aucune notification pour le moment.')+'</p>';return h}
  function nhead(mode){var un=items().filter(function(it){return it.un}).length;
    return '<div class="v36-nh"><div class="v36-nf" role="group" aria-label="Filtrer"><button type="button" data-h="1" data-nf="all" aria-pressed="'+(NF==='all')+'"'+(NF==='all'?' class="on"':'')+'>Toutes</button>'+
      '<button type="button" data-h="1" data-nf="un" aria-pressed="'+(NF==='un')+'"'+(NF==='un'?' class="on"':'')+'>Non lues'+(un?' <em>'+un+'</em>':'')+'</button></div>'+
      (mode==='pop'?'<button type="button" class="v36-nall" data-h="1"'+(un?'':' disabled')+'>'+IC.checks+' Tout marquer comme lu</button>':'')+'</div>'}
  var NPOP=$('#notifs'),NPAGE=null;
  if(page==='notifications'){var pg0=$('main .page');if(pg0){var sg=$('.hello + .seg',pg0);$$('.ngrp,.nempty',pg0).forEach(function(g){g.remove()});NPAGE=document.createElement('div');NPAGE.className='v36-np';
    if(sg)sg.replaceWith(NPAGE);else pg0.appendChild(NPAGE);var hb=$('.hello .btn',pg0);if(hb){var nb=hb.cloneNode(true);nb.removeAttribute('data-toast');nb.dataset.h='1';nb.classList.add('v36-nall');hb.replaceWith(nb)}}}
  function nall(){var L=items(),un=L.filter(function(it){return it.un}).length;
    $$('[data-pop="notifs"] .bdg').forEach(function(b){b.textContent=un;b.hidden=!un});
    $$('[data-pop="notifs"]').forEach(function(b){b.setAttribute('aria-label','Notifications'+(un?', '+un+' non lue'+(un>1?'s':''):''))});
    if(NPOP){NPOP.innerHTML='<h3 class="v36-nt">Notifications</h3>'+nhead('pop')+'<div class="v36-ngl">'+ngroups('pop')+'</div><a class="seeall v36-see" href="notifications.html">Tout voir</a>';NPOP.classList.add('v36-npop')}
    if(NPAGE){NPAGE.innerHTML=nhead('page')+'<div class="v36-ngl">'+ngroups('page')+'</div>';var sub=$('.hello .sub');if(sub)sub.textContent=un?un+(un>1?' non lues':' non lue'):'Tout est lu';
      var hb=$('.hello .v36-nall');if(hb){hb.disabled=!un;hb.setAttribute('aria-disabled',!un)}}}
  V36.notifs=nall;
  function nclick(e){var t=e.target;
    var f=t.closest('[data-nf]');if(f){stop(e);NF=f.dataset.nf;nall();var k=$$('[data-nf="'+NF+'"]').filter(function(x){return e.currentTarget.contains(x)})[0];if(k)k.focus();return}
    if(t.closest('.v36-nall')){stop(e);var ids=items().filter(function(it){return it.un}).map(function(it){return it.id});if(!ids.length){say('Tout est déjà lu','info');return}nread(ids);say('Tout est marqué comme lu','ok');return}
    var r=t.closest('.v36-ngr');if(r){stop(e);var g=r.closest('.v36-ng').dataset.g;nread(items().filter(function(it){return it.x===g&&it.un}).map(function(it){return it.id}));say('Notifications de '+(NOM[g]||'Yelema')+' marquées comme lues','ok');return}
    var gt=t.closest('.v36-ngt');if(gt){stop(e);var gk=gt.closest('.v36-ng').dataset.g,pl=plie(),i=pl.indexOf(gk);if(i<0)pl.push(gk);else pl.splice(i,1);ls('v36-nplie',JSON.stringify(pl));nall();
      var nb2=$$('.v36-ng[data-g="'+gk+'"] .v36-ngt').filter(function(x){return e.currentTarget.contains(x)})[0];if(nb2)nb2.focus();return}
    var a=t.closest('.v36-ni');if(a){nread([a.dataset.id]);var tg=a.getAttribute('href').split('#'),pgt=tg[0].replace('.html','');
      if(pgt===page&&tg[1]){e.preventDefault();e.stopPropagation();if(NPOP)NPOP.classList.remove('on');var h=tg[1];
        if(h==='routines'){goRoutines()}else{var tb=$('[data-tabs] [data-t="'+h+'"]');if(tb)tb.click()}}}}
  if(NPOP)NPOP.addEventListener('click',nclick);
  if(NPAGE){NPAGE.addEventListener('click',nclick);var hb2=$('.hello .v36-nall');if(hb2)hb2.addEventListener('click',nclick)}
  nall();

  // ================= 11. inscription : créer l’espace de l’entreprise, puis Recruter
  var SU=$('[data-signup]');
  if(SU){var F=function(n){return $('[name="'+n+'"]',SU)},pw=F('pw'),bar=$('.mdsb i',SU);
    function rules(){var v=pw.value,r={len:v.length>=8,maj:/[A-ZÀ-Ý]/.test(v),num:/\d/.test(v)},k=0;$$('.mdrl li',SU).forEach(function(li){var o=r[li.dataset.r];li.classList.toggle('ok',!!o);if(o)k++});
      if(bar){bar.style.width=(k/3*100)+'%';bar.className=k<2?'lo':k<3?'mi':'hi'}return k===3}
    function err(n,m){var i=F(n),p=$('#v36-fe-'+n);if(p){p.innerHTML=m||'';p.hidden=!m}var w=i&&i.closest('.mdi');if(w)w.classList.toggle('bad',!!m);if(i)i.setAttribute('aria-invalid',m?'true':'false')}
    pw.addEventListener('input',function(){rules();err('pw','')});
    ['ent','nom','em'].forEach(function(n){F(n).addEventListener('input',function(){err(n,'')})});F('cgu').addEventListener('change',function(){err('cgu','')});
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-v36cgu]');if(a){stop(e);var m=$('#v36-cgu');if(m)m.classList.add('on');return}
      var k=e.target.closest&&e.target.closest('.v36-cguok');if(k){stop(e);F('cgu').checked=true;err('cgu','');$('#v36-cgu').classList.remove('on')}});
    SU.addEventListener('submit',function(e){e.preventDefault();var b=$('.v36-suok',SU);if(b._v36b)return;var bad=[];
      var ent=F('ent').value.trim(),nom=F('nom').value.trim(),em=F('em').value.trim();
      if(!ent){err('ent','Indiquez le nom de votre entreprise.');bad.push('ent')}
      if(!nom){err('nom','Indiquez votre prénom et votre nom.');bad.push('nom')}
      if(!em){err('em','Indiquez votre email professionnel.');bad.push('em')}
      else if(!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(em)){err('em','Cet email n’est pas valide. Vérifiez-le, par exemple prenom.nom@entreprise.com.');bad.push('em')}
      else if(/@unifood\.info$/i.test(em)){err('em','Un compte existe déjà avec cet email. <a class="link" href="connexion.html"><b>Se connecter</b></a>');bad.push('em')}
      if(!rules()){err('pw','Le mot de passe doit suivre les trois règles ci-dessus.');bad.push('pw')}
      if(!F('cgu').checked){err('cgu','Acceptez les conditions pour continuer.');bad.push('cgu')}
      if(bad.length){F(bad[0]).focus();return}
      busy(b,'Création de l’espace…');ss('v36-new',nom.split(/\s+/)[0]);setTimeout(function(){location.href='recruter.html?bienvenue=1'},900)});
    rules()}
  if(page==='recruter'&&(ss('v36-new')||Q.get('bienvenue')==='1')){var pg1=$('main .page');if(pg1&&!$('.v36-wel')){var pn0=ss('v36-new');
    var w=document.createElement('div');w.className='v36-wel';w.setAttribute('role','status');
    w.innerHTML='<img src="../img/djeneba.jpg" alt=""><span class="grow"><b>Bienvenue'+(pn0?' '+esc(pn0):'')+', choisissez votre premier Expert.</b> <span>Djénéba est incluse.</span></span><button type="button" class="v36-welx" data-h="1" aria-label="Fermer le message de bienvenue">'+IC.x+'</button>';
    pg1.insertBefore(w,pg1.firstChild);$('.v36-welx',w).addEventListener('click',function(e){stop(e);ss('v36-new',null);w.remove()})}}

  // ================= 12. historique en colonne à gauche du chat (piste A, choix de Leslie du 03/10, 08:19), repliable ; plein écran en 390
  var PANEL=svg('<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>'),HIST=svg('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/>'),PLUS=svg('<path d="M5 12h14M12 5v14"/>');
  function plieH(){return ls('v36-hcol')==='1'}
  $$('.v35-hb').forEach(function(bar){var host=bar.closest('.chat2')||bar.closest('.gmain');if(!host)return;var pn=$('.v35-hp',host);if(!pn)return;
    var cvb=$('.v35-cvb',bar),nw=$('.v35-nw',bar),inp=$('.v35-hs input',pn),list=$('.v35-hl',pn),hd=bar.closest('.ghead'),cur=$('.v35-cur',bar)||(hd&&$('.gtt',hd));
    bar.classList.add('v36-hb');if(cvb){cvb.setAttribute('aria-label','Historique des conversations');cvb.title='Historique des conversations'}
    // la colonne : à côté du chat (page expert : enveloppe ; chat entreprise : grille .gpt)
    var wrap;if(host.classList.contains('chat2')){wrap=document.createElement('div');wrap.className='v36-hw';host.parentNode.insertBefore(wrap,host);wrap.appendChild(pn);wrap.appendChild(host)}
    else{wrap=host.closest('.gpt');wrap.classList.add('v36-hw','v36-hwg');wrap.insertBefore(pn,host)}
    pn.classList.add('v36-hcol');pn.setAttribute('aria-label','Historique des conversations');
    var top=document.createElement('div');top.className='v36-chd';
    top.innerHTML='<button type="button" class="v36-ctg" data-h="1" aria-expanded="true" aria-label="Replier l’historique" title="Replier l’historique">'+PANEL+'</button>'+
      '<button type="button" class="btn p v36-cnew" data-h="1" aria-label="Nouvelle conversation">'+PLUS+'<span>Nouvelle conversation</span></button>'+
      '<button type="button" class="v36-copen" data-h="1" aria-label="Déplier l’historique" title="Historique des conversations">'+HIST+'</button>';
    var ph=$('.v35-hph',pn);if(ph)ph.insertAdjacentElement('afterend',top);else pn.insertBefore(top,pn.firstChild);
    function plie(on){wrap.classList.toggle('plie',on);var b=$('.v36-ctg',top);b.setAttribute('aria-expanded',!on);b.setAttribute('aria-label',on?'Déplier l’historique':'Replier l’historique');b.title=b.getAttribute('aria-label')}
    plie(plieH());
    $('.v36-ctg',top).addEventListener('click',function(e){stop(e);var on=!wrap.classList.contains('plie');ls('v36-hcol',on?'1':null);plie(on)});
    $('.v36-copen',top).addEventListener('click',function(e){stop(e);ls('v36-hcol',null);plie(false);setTimeout(function(){if(inp)inp.focus()},30)});
    $('.v36-cnew',top).addEventListener('click',function(e){stop(e);if(nw)nw.click()});
    pn.addEventListener('click',function(e){var m=e.target.closest('.v36-more');if(!m)return;stop(e);pn._v36all=1;refresh();var b=$$('.v35-hi',list)[20];if(b)b.focus()});
    function onItem(){var b=$('.v35-hi.on',list);if(!b)return;var r=b.offsetTop-list.offsetTop;if(r<list.scrollTop||r>list.scrollTop+list.clientHeight-48)list.scrollTop=Math.max(0,r-list.clientHeight/3)}
    function refresh(){if(inp)inp.dispatchEvent(new Event('input'))}
    function sync(){refresh();setTimeout(onItem,0)}
    sync();if(cur)new MutationObserver(sync).observe(cur,{childList:true,characterData:true,subtree:true});
    if(cvb)cvb.addEventListener('click',function(){setTimeout(onItem,40)})});

  // ================= 13. composeur unique (retours du 03/10, 08:18 et 08:22) : trombone, champ, choix du modèle, un seul bouton rond (micro, puis Envoyer)
  // Clés et connexions (retour du 03/10, 08:41) : Yelema ne fournit pas de modèle, le client branche ses clés ; la pastille du chat liste les modèles des fournisseurs branchés
  var PROV={Anthropic:{d:'anthropic.com',p:'sk-ant-',m:['Claude Sonnet','Claude Opus','Claude Haiku']},OpenAI:{d:'openai.com',p:'sk-',m:['GPT-5','GPT-5 mini']},
    Google:{d:'gemini.google.com',p:'AIza',m:['Gemini 2.5 Pro','Gemini 2.5 Flash']},Mistral:{d:'mistral.ai',p:'',m:['Mistral Large','Mistral Small']},
    OpenRouter:{d:'openrouter.ai',p:'sk-or-',m:['Llama 4 Maverick','DeepSeek V3','Qwen 3']},
    DeepSeek:{d:'deepseek.com',p:'sk-',m:['DeepSeek V3','DeepSeek R1']},'xAI (Grok)':{d:'x.ai',p:'xai-',m:['Grok 4','Grok 4 mini']},
    'Meta Llama':{d:'llama.com',p:'',m:['Llama 4 Maverick','Llama 4 Scout']},Cohere:{d:'cohere.com',p:'',m:['Command A','Command R+']},
    Groq:{d:'groq.com',p:'gsk_',m:['Llama 4 sur Groq','Qwen 3 sur Groq']},'Together AI':{d:'together.ai',p:'',m:['Llama 4 Maverick','DeepSeek V3']},
    Fireworks:{d:'fireworks.ai',p:'fw_',m:['Llama 4 Maverick','Qwen 3']},Perplexity:{d:'perplexity.ai',p:'pplx-',m:['Sonar Pro','Sonar']},
    'Azure OpenAI':{d:'azure.microsoft.com',p:'',m:['GPT-5 sur Azure']},'AWS Bedrock':{d:'aws.amazon.com',p:'',m:['Claude sur Bedrock','Llama sur Bedrock']},
    'Google Vertex AI':{d:'cloud.google.com',p:'',m:['Gemini sur Vertex','Claude sur Vertex']},'Hugging Face':{d:'huggingface.co',p:'hf_',m:['Modèle Hugging Face']},
    'Moonshot (Kimi)':{d:'moonshot.ai',p:'sk-',m:['Kimi K2']},'Alibaba Qwen':{d:'qwen.ai',p:'sk-',m:['Qwen 3 Max','Qwen 3']},
    'Compatible OpenAI':{d:'openai.com',p:'',m:['Modèle compatible OpenAI'],u:1},'Ollama, modèle local':{d:'ollama.com',p:'',m:['Modèle local'],u:1,nok:1}};
  var AIK0=[{p:'Anthropic',k:'sk-ant-••••4f2a',by:'Aïcha Diabaté',def:1},{p:'OpenAI',k:'sk-••••9c1e',by:'Aïcha Diabaté'},{p:'Mistral',k:'••••b7d3',by:'Nadège Touré'}];
  function aikGet(){var v=ls('v36-aik');if(v){try{var a=JSON.parse(v);if(Array.isArray(a))return a}catch(_){}}return AIK0.map(function(x){return Object.assign({},x)})}
  function aikSet(a){ls('v36-aik',JSON.stringify(a))}
  V36.aikGet=aikGet;V36.aikSet=aikSet;V36.PROV=PROV;
  var MODS=[];
  function mdlRead(){var a=aikGet(),d=a.filter(function(x){return x.def})[0]||a[0];a=a.slice().sort(function(x,y){return (y.def?1:0)-(x.def?1:0)});
    MODS=[];a.forEach(function(x){(PROV[x.p]||{m:[]}).m.forEach(function(m){MODS.push(m);MODS['p_'+m]=x.p})});MODS.groups=a.map(function(x){return x.p});MODS.def=d?(PROV[d.p]||{m:[]}).m[0]:null}
  function llHTML(){if(!MODS.length)return '<p class="v36-lle">Aucune clé d’IA branchée.</p><a class="v36-llo v36-llk" data-h="1" href="'+(EX?'#connecteurs':'admin-modeles.html')+'">Ajouter une clé d’IA</a>';
    return MODS.groups.map(function(g){var P=PROV[g]||{m:[],d:''};return '<div class="v36-llg" role="group" aria-label="'+esc(g)+'"><span class="v36-llh"><img src="https://www.google.com/s2/favicons?sz=64&domain='+P.d+'" alt="">'+esc(g)+'</span>'+
      P.m.map(function(m){return '<button type="button" class="v36-llo" role="option" data-h="1" data-m="'+esc(m)+'">'+esc(m)+IC.check+'</button>'}).join('')+'</div>'}).join('')}
  var CPU=svg('<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>');
  var MIC=svg('<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3"/>'),ARR=svg('<path d="m5 12 7-7 7 7M12 19V5"/>');
  var CLIP=svg('<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>');
  var DICT=['Prépare les posts de la semaine pour Sossa','Fais-moi le point du jour en cinq lignes','Résume les livrables de la semaine'],DN=0;
  /* (v4.37) l’ancienne lecture de la liste de modèles écrasait celle des clés d’IA (même nom de fonction) : retirée */
  mdlRead();V36.mdlRead=function(){mdlRead();llSync()};
  function curMod(){var m=ls('v36-llm');return MODS.indexOf(m)>=0?m:(MODS.def||MODS[0]||'Aucune clé')}
  var LLOPEN=null;function llClose(){if(LLOPEN){$('.v36-lll',LLOPEN).hidden=true;$('.v36-llb',LLOPEN).setAttribute('aria-expanded','false');LLOPEN=null}}
  document.addEventListener('click',function(e){if(LLOPEN&&!LLOPEN.contains(e.target))llClose()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&LLOPEN){var b=$('.v36-llb',LLOPEN);llClose();b.focus()}});
  function llSync(){$$('.v36-lll').forEach(function(l){l.innerHTML=llHTML()});$$('.v36-llb span').forEach(function(x){x.textContent=curMod()});$$('.v36-llo').forEach(function(o){var on=o.dataset.m===curMod();o.classList.toggle('on',on);o.setAttribute('aria-selected',on)})}
  var FILE=document.createElement('input');FILE.type='file';FILE.multiple=true;FILE.hidden=true;FILE.setAttribute('aria-hidden','true');document.body.appendChild(FILE);
  FILE.addEventListener('change',function(){var n=FILE.files.length;if(n)say(n>1?n+' fichiers joints, ils partent avec votre message':'Fichier joint : '+FILE.files[0].name+', il part avec votre message','ok');FILE.value=''});
  function dictate(inp,sb){if(sb.classList.contains('rec'))return;sb.classList.add('rec');sb.setAttribute('aria-label','Écoute en cours');say('Je vous écoute…','info');
    setTimeout(function(){sb.classList.remove('rec');inp.value=DICT[DN++%DICT.length];inp.dispatchEvent(new Event('input',{bubbles:true}));inp.focus();say('Texte dicté, relisez puis envoyez','info')},1600)}
  function unify(c,inp,o){if(!c||!inp||c._v36u)return;c._v36u=1;o=o||{};c.classList.add('v36-comp');
    var row=o.row||c;
    // trombone : on réutilise le bouton « joindre » existant, sinon on en crée un
    var clip=o.clip||$('.ib[aria-label^="Joindre"]',c);
    if(!clip){clip=document.createElement('button');clip.type='button';clip.className='ib'}
    clip.classList.add('v36-clip');clip.dataset.h='1';clip.setAttribute('aria-label','Joindre un fichier');clip.title='Joindre un fichier';clip.innerHTML=CLIP;
    if(!clip._v36){clip._v36=1;clip.addEventListener('click',function(e){stop(e);e.stopImmediatePropagation();FILE.click()},true)}
    var sb=o.sb;if(!sb){sb=document.createElement('button');sb.type='button';sb.className='v36-sb1'}
    sb.dataset.h='1';sb.classList.add('v36-sb');sb.innerHTML='<span class="v36-sbm">'+MIC+'</span><span class="v36-sba">'+ARR+'</span>';
    var w=document.createElement('div');w.className='v36-llm';
    w.innerHTML='<button type="button" class="v36-llb" data-h="1" aria-haspopup="listbox" aria-expanded="false" aria-label="Modèle d’IA" title="Modèle d’IA">'+CPU+'<span>'+esc(curMod())+'</span>'+IC.chev+'</button>'+
      '<div class="v36-lll" role="listbox" aria-label="Modèle d’IA" hidden>'+llHTML()+'</div>';
    // ordre : trombone, champ, modèle, bouton
    row.insertBefore(clip,row.firstChild);clip.insertAdjacentElement('afterend',inp);row.appendChild(w);row.appendChild(sb);
    (o.hide||[]).forEach(function(x){if(x&&x!==sb&&x!==clip)x.classList.add('v36-hid')});
    $('.v36-llb',w).addEventListener('click',function(e){stop(e);var was=LLOPEN===w;llClose();if(was)return;llSync();$('.v36-lll',w).hidden=false;$('.v36-llb',w).setAttribute('aria-expanded','true');LLOPEN=w;
      var r=w.getBoundingClientRect();w.classList.toggle('dn',r.top<300);var op=$('.v36-llo.on',w);if(op)op.focus()});
    $('.v36-lll',w).addEventListener('click',function(e){var op=e.target.closest('.v36-llo');if(!op||op.classList.contains('v36-llk'))return;stop(e);ls('v36-llm',op.dataset.m);llSync();llClose();$('.v36-llb',w).focus();say('Modèle choisi : '+op.dataset.m,'info')});
    $('.v36-lll',w).addEventListener('keydown',function(e){var L=$$('.v36-llo',w),i=L.indexOf(document.activeElement);if(e.key==='ArrowDown'){e.preventDefault();L[(i+1)%L.length].focus()}if(e.key==='ArrowUp'){e.preventDefault();L[(i-1+L.length)%L.length].focus()}});
    function st(){var on=!!inp.value.trim();if(sb._on===on)return;sb._on=on;sb.classList.toggle('on',on);sb.setAttribute('aria-label',on?'Envoyer':'Dicter un message');sb.title=on?'Envoyer':'Dicter un message'}
    sb._on=null;st();inp.addEventListener('input',st);inp.addEventListener('keydown',function(e){if(e.key==='Enter')setTimeout(st,0)});
    new MutationObserver(function(){setTimeout(st,0)}).observe(c,{subtree:true,childList:true});
    sb.addEventListener('click',function(e){setTimeout(st,0);if(inp.value.trim()){if(o.send){stop(e);o.send()}return}e.preventDefault();e.stopImmediatePropagation();dictate(inp,sb)},true);
    return sb}
  // chats d’un expert, Messages, Yélé : .inp ; chat entreprise : .gin2 (une seule ligne)
  $$('.v33-in').forEach(function(inp){var c=inp.parentNode;while(c&&c!==document.body&&!$('.v33-send',c))c=c.parentNode;if(!c||c===document.body)return;var sb=$('.v33-send',c);
    if(c.classList.contains('gin2')){var row=document.createElement('div');row.className='v36-cr';c.appendChild(row);
      unify(c,inp,{row:row,sb:sb,hide:[$('.tx',c)].concat($$(':scope > .row',c))})}
    else unify(c,inp,{sb:sb,hide:$$('.mic, button.send, .ph',c)})});
  // Demander un point précis (Résumé) et demande à l’expert dans un tableau de bord
  $$('form.askx').forEach(function(f){var i=$('input[type=text]',f),b=$('button[type=submit]',f);if(!i||!b)return;
    unify(f,i,{hide:[b],send:function(){if(f.requestSubmit)f.requestSubmit(b);else b.click()}})});
  $$('.tbask .tbin').forEach(function(c){var t=$('textarea',c),m=$('.tbmic',c),s2=$('.tbsend',c);if(!t||!s2)return;var row=document.createElement('div');row.className='v36-cr';c.insertBefore(row,c.firstChild);
    var sb=unify(c,t,{row:row,hide:[m,s2],send:function(){s2.click()}});
    if(sb&&m){sb.addEventListener('click',function(e){if(t.value.trim())return;e.stopImmediatePropagation();m.click()},true)}});
  // accueil sur téléphone : « Demander à mon équipe » est un lien vers le chat ; même bouton rond
  $$('a .in .mic').forEach(function(m){m.classList.add('v36-sb','v36-sbfake');m.innerHTML='<span class="v36-sbm">'+MIC+'</span>'});
  // un membre qui ouvre l’espace d’un expert déjà dans son équipe ne fait pas de demande de recrutement
  if(MEMBRE)window.addEventListener('click',function(e){var c=e.target.closest&&e.target.closest('.pc2.mine2');if(c)e.stopPropagation()},true);

  // ================= 14. Analytique d’un expert : détails au clic, routines actives, lien vers les routines
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.v36-akb');if(!b)return;stop(e);var l=b.nextElementSibling,on=l.hidden;l.hidden=!on;b.setAttribute('aria-expanded',on);
    b.textContent=on?(l.classList.contains('v36-sk')?'Masquer les compétences':'Masquer le détail'):(l.classList.contains('v36-sk')?'Voir les compétences':'Voir le détail')});
  var goRoutines=function(){var c=$('.xnav a[data-t="calendrier"]');if(c)c.click();var r=$('.v33-agt a[data-v33a="rt"]');if(r)r.click();window.scrollTo(0,0)};
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-v36rt]');if(!a||!EX)return;stop(e);goRoutines()});
  if(EX&&$('.v36-rtn')){try{var RL=JSON.parse(ls('v33-rt-'+EX)||'null');if(RL)$('.v36-rtn').textContent=RL.filter(function(r){return r.on}).length}catch(_){}}

  // ================= 15. Livrables : fenêtre « Nouveau dossier » (nom présélectionné, compteur, validation en direct)
  var DM=$('#v33-dir'),FOLD=svg('<path d="M12 10v6M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>');
  if(DM&&window.v33lv){var LVA=window.v33lv,dpn=$('.pn',DM);dpn.className='pn v36-pn v36-info v36-dirp';
    dpn.innerHTML='<button type="button" class="v36-mx" data-close data-h="1" aria-label="Fermer">'+IC.x+'</button><span class="v36-mi">'+FOLD+'</span><h2 id="v36-dt">Nouveau dossier</h2>'+
      '<p class="v36-dwh">Dans : <span class="v33-dwh">Livrables</span></p><label class="v36-dl" for="v36-dn">Nom du dossier</label>'+
      '<div class="v36-dfw"><input id="v36-dn" class="fi v33-dn" type="text" maxlength="60" autocomplete="off" aria-describedby="v36-de v36-dc"><span class="v36-dc" id="v36-dc" aria-live="polite">0/60</span></div>'+
      '<p class="v36-fe" id="v36-de" hidden></p><div class="v36-mb"><button type="button" class="btn o v36-dx" data-h="1">Annuler</button><button type="button" class="btn p v33-dok v36-dok" data-h="1">Créer</button></div>';
    DM.setAttribute('role','dialog');DM.setAttribute('aria-labelledby','v36-dt');
    $$('[data-close]',DM).forEach(function(x){x.addEventListener('click',function(e){e.preventDefault();DM.classList.remove('on')})});
    var dn=$('#v36-dn',DM),de=$('#v36-de',DM),dc=$('#v36-dc',DM),dok=$('.v36-dok',DM);
    function dErr(){var v=dn.value.trim();if(!v)return 'Donnez un nom au dossier';if(/[\/\\:*?"<>|]/.test(dn.value))return 'Ce caractère n’est pas accepté : / \\ : * ? " < > |';
      if(LVA.cur().some(function(x){return x.k==='dir'&&x.n.toLowerCase()===v.toLowerCase()}))return 'Un dossier porte déjà ce nom';return ''}
    function dCheck(show){var m=dErr();dc.textContent=dn.value.length+'/60';dok.classList.toggle('v36-off',!!m);dok.setAttribute('aria-disabled',!!m);
      if(show||!m){de.textContent=m;de.hidden=!m;dn.closest('.v36-dfw').classList.toggle('bad',!!m);dn.setAttribute('aria-invalid',!!m)}return m}
    function dOpen(){var p=LVA.path();$('.v33-dwh',DM).textContent='Livrables'+(p.length?' › '+p.map(function(d){return d.n}).join(' › '):'');
      var base='Nouveau dossier',v=base,k=2;while(LVA.cur().some(function(x){return x.k==='dir'&&x.n.toLowerCase()===v.toLowerCase()}))v=base+' '+(k++);
      dn.value=v;de.hidden=true;dn.closest('.v36-dfw').classList.remove('bad');dCheck();setTimeout(function(){dn.focus();dn.select()},40)}
    document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-open="v33-dir"]'))setTimeout(dOpen,0)});
    dn.addEventListener('input',function(){dCheck(true)});
    dn.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();dok.click()}});
    $('.v36-dx',DM).addEventListener('click',function(e){stop(e);DM.classList.remove('on')});
    dok.addEventListener('click',function(e){stop(e);var m=dCheck(true);if(m){dn.focus();return}var n=dn.value.trim(),id=LVA.uid();
      LVA.cur().push({id:id,n:n,k:'dir',c:[],d:'2026-10-01 10:5'+(5+Math.floor(Math.random()*4))});DM.classList.remove('on');LVA.clear();LVA.render();
      var row=$('#drive .v33-r[data-id="'+id+'"]');if(row){row.classList.add('v36-flash');setTimeout(function(){row.classList.remove('v36-flash')},1800)}
      say('Dossier « '+n+' » créé',{type:'ok',action:{label:'Ouvrir',fn:function(){var r=$('#drive .v33-r[data-id="'+id+'"]');if(r)r.click()}}})});
  }

  // ================= 16. Livrables : « Connecter votre Drive » (Composio), puis « Copier dans votre Drive »
  var LVT=EX&&$('#drive .v33-imp');
  if(LVT){var CLOUD=svg('<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>'),DK='v36-drive',DA='v36-drauto';
    var GD='<img src="https://www.google.com/s2/favicons?sz=64&domain=drive.google.com" alt="" width="16" height="16">',OD='<img src="https://www.google.com/s2/favicons?sz=64&domain=onedrive.live.com" alt="" width="16" height="16">';
    var dw=document.createElement('div');dw.className='v36-drw';LVT.insertAdjacentElement('afterend',dw);
    var pick=document.createElement('div');pick.className='modal v36-drm';pick.id='v36-drm';
    pick.innerHTML='<div class="ov" data-v36z></div><div class="pn v36-pn v36-info" role="dialog" aria-modal="true" aria-labelledby="v36-drt"><button type="button" class="v36-mx" data-v36z data-h="1" aria-label="Fermer">'+IC.x+'</button><span class="v36-mi">'+CLOUD+'</span>'+
      '<h2 id="v36-drt">Connecter votre Drive</h2><p>Vous pourrez copier les livrables de '+NOM[EX]+' dans votre Drive. Ils restent aussi dans son espace.</p>'+
      '<div class="v36-drc"><button type="button" class="v36-drx" data-h="1" data-d="Google Drive">'+GD+'<b>Google Drive</b></button><button type="button" class="v36-drx" data-h="1" data-d="OneDrive">'+OD+'<b>OneDrive</b></button></div></div>';
    document.body.appendChild(pick);
    function dname(){return ls(DK)}
    function dpath(){return dname()+' › Yelema › '+NOM[EX]}
    function draw(){var n=dname();if(!n){dw.innerHTML='<button type="button" class="btn o sm v36-drb" data-h="1">'+CLOUD+'<span class="lbl">Connecter votre Drive</span><span class="v36-drl">'+GD+OD+'</span></button>';}
      else dw.innerHTML='<button type="button" class="v36-drp" data-h="1" aria-haspopup="menu" aria-expanded="false"><span class="v36-drk">'+IC.check+'</span>'+(n==='OneDrive'?OD:GD)+'<span class="lbl">'+esc(n)+' connecté</span>'+IC.chev+'</button>'+
        '<div class="v36-drmn" role="menu" hidden><button type="button" role="menuitem" class="v36-drd" data-h="1">Choisir le dossier de destination<small>'+esc(dpath())+'</small></button>'+
        '<button type="button" role="menuitemcheckbox" class="v36-dra" data-h="1" aria-checked="'+(ls(DA)==='1')+'"><span>Copier automatiquement les nouveaux livrables</span><i class="v36-sw" aria-hidden="true"></i></button>'+
        '<button type="button" role="menuitem" class="v36-dro" data-h="1">Déconnecter</button></div>';
      document.documentElement.classList.toggle('v36-drv-on',!!n);cxSync()}
    function cxSync(){var n=dname();$$('#connecteurs .v33-cx').forEach(function(c){var t=(c.dataset.n||c.textContent||'').trim();if(!/^(Google Drive|OneDrive|Microsoft OneDrive)\b/.test(t))return;
      var on=n&&t.indexOf(n)===0;c.classList.toggle('on',!!on);var b=$('.v33-cxk,.v33-cxb',c);if(b)b.outerHTML=on?'<button type="button" class="v33-cxk" data-h="1" title="Connecté" aria-label="'+esc(t)+' connecté">'+IC.check+'</button>':'<a class="btn o sm v33-cxb" href="#" data-h="1">Connecter</a>'})}
    draw();var pendD=null;
    dw.addEventListener('click',function(e){var t=e.target;
      if(t.closest('.v36-drb')){stop(e);pick.classList.add('on');setTimeout(function(){$('.v36-drx',pick).focus()},40);return}
      if(t.closest('.v36-drp')){stop(e);var m=$('.v36-drmn',dw),b=$('.v36-drp',dw);m.hidden=!m.hidden;b.setAttribute('aria-expanded',!m.hidden);return}
      if(t.closest('.v36-drd')){stop(e);$('.v36-drmn',dw).hidden=true;say('Destination : '+dpath(),'info');return}
      if(t.closest('.v36-dra')){stop(e);var on=ls(DA)!=='1';ls(DA,on?'1':null);t.closest('.v36-dra').setAttribute('aria-checked',on);say(on?'Les nouveaux livrables de '+NOM[EX]+' seront copiés dans '+dname():'Copie automatique arrêtée',on?'ok':'info');return}
      if(t.closest('.v36-dro')){stop(e);var n=dname();ls(DK,null);ls(DA,null);draw();say(n+' déconnecté','info')}});
    document.addEventListener('click',function(e){var m=$('.v36-drmn',dw);if(m&&!m.hidden&&!e.target.closest('.v36-drw')){m.hidden=true;$('.v36-drp',dw).setAttribute('aria-expanded','false')}});
    pick.addEventListener('click',function(e){if(e.target.closest('[data-v36z]')){stop(e);pick.classList.remove('on');return}var b=e.target.closest('.v36-drx');if(!b)return;stop(e);pendD=b.dataset.d;pick.classList.remove('on');
      var z=$('#cz');if(z){var p=$('.pn',z);p.classList.remove('done');$$('.czn',z).forEach(function(x){x.textContent=pendD});z.classList.add('on')}else{ls(DK,pendD);draw();say(pendD+' connecté','ok')}});
    $$('#cz .czgo').forEach(function(g){g.addEventListener('click',function(){if(!pendD)return;var d=pendD;pendD=null;ls(DK,d);setTimeout(function(){draw();say(d+' connecté : copiez les livrables de '+NOM[EX]+' en un clic','ok')},300)})});
    function copyTo(nm){say('Copié dans '+dpath(),{type:'ok',action:{label:'Ouvrir',fn:function(){window.open(dname()==='OneDrive'?'https://onedrive.live.com/':'https://drive.google.com/','_blank','noopener')}}})}
    var LTL=$('#drive .v33-lt');
    function addCopy(){if(!dname())return;$$('.v33-mm',LTL).forEach(function(m){if($('.v36-cpd',m))return;var a=document.createElement('a');a.href='#';a.dataset.h='1';a.className='v36-cpd';a.textContent='Copier dans votre Drive';m.insertBefore(a,m.firstChild)});
      var pf=$('#v33-pv .v33-pvf');if(pf&&!$('.v36-cpd',pf)){var b=document.createElement('a');b.href='#';b.dataset.h='1';b.className='btn o v36-cpd';b.innerHTML=CLOUD+' Copier dans votre Drive';pf.appendChild(b)}}
    new MutationObserver(addCopy).observe(LTL,{childList:true,subtree:true});var PVF=$('#v33-pv .v33-pvf');if(PVF)new MutationObserver(addCopy).observe(PVF,{childList:true});addCopy();
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.v36-cpd');if(!a)return;stop(e);var row=a.closest('.v33-r'),nm='';
      if(row){var b=$('.v33-nm b',row);nm=b?b.textContent:'';var mm=a.closest('.v33-mm');if(mm)mm.hidden=true}else{var h=$('#v33-pv .v33-pvh');nm=h?h.textContent:''}copyTo(nm)});
    var oldDraw=draw;draw=function(){oldDraw();addCopy()};
  }

  // ================= 17. API et MCP (Leslie, 03/10 08:30) : chacun gère les siens ; Créer une clé, Ajouter un serveur MCP ; menu ⋯ par ligne
  var AM=EX&&$('#connecteurs .v35-am');
  if(AM){ss('v35-acc',null);ls('v35-acc',null);var note=$('.v35-note',AM);if(note)note.remove();AM.classList.add('v36-am');
    var MEF=ME.n.split(' ')[0],KEYI=svg('<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>'),
      SRV=svg('<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>'),COPY=svg('<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>');
    var secs=$$('.v35-sec',AM),SK=secs[0],SM=secs[1],TK=$('.v35-t',SK),TM=$('.v35-t',SM);
    function head(sec,cls,lab){var h=$('h3',sec),w=document.createElement('div');w.className='v36-sech';h.parentNode.insertBefore(w,h);w.appendChild(h);
      var b=document.createElement('button');b.type='button';b.className='btn o sm '+cls;b.dataset.h='1';b.innerHTML=PLUS+' '+lab;w.appendChild(b);return b}
    var bK=head(SK,'v36-kadd','Créer une clé'),bM=head(SM,'v36-sadd','Ajouter un serveur MCP');
    function canDel(r){return !MEMBRE||r.dataset.by===ME.n}
    function menuCell(r,kind){var by=r.dataset.by||'Aïcha Diabaté';r.dataset.by=by;r.dataset.kind=kind;var nm=$('.v35-nm',r)||$('b',r);
      if(nm&&!$('.v36-by',r)){var sm=document.createElement('small');sm.className='v36-by';sm.textContent=by===ME.n?'Ajouté par vous':'Ajouté par '+by.split(' ')[0];nm.appendChild(sm)}
      if($('.v36-rm',r))return;var c=document.createElement('span');c.className='v36-rm';c.setAttribute('role','cell');
      c.innerHTML='<button type="button" class="v36-rmb" data-h="1" aria-haspopup="menu" aria-expanded="false" aria-label="Plus d’actions">'+IC.more+'</button><span class="v36-rmm" role="menu" hidden>'+
        (kind!=='mdl'?'<button type="button" role="menuitem" class="v36-rren" data-h="1">Renommer</button>':'')+
        (canDel(r)?'<button type="button" role="menuitem" class="v36-rdel" data-h="1">'+(kind==='key'?'Révoquer':'Retirer')+'</button>':'<span class="v36-rno">Seul '+esc(by.split(' ')[0])+' ou l’admin peut '+(kind==='key'?'la révoquer':'le retirer')+'</span>')+'</span>';r.appendChild(c)}
    $$('.v35-r:not(.v35-th)',TK).forEach(function(r){menuCell(r,'key')});$$('.v35-r:not(.v35-th)',TM).forEach(function(r){menuCell(r,'mcp')});
    $$('.v35-th',AM).forEach(function(h){var c=document.createElement('span');c.innerHTML='<span class="v36-sr">Actions</span>';h.appendChild(c)});
    function closeRm(){$$('.v36-rmm',AM).forEach(function(m){m.hidden=true});$$('.v36-rmb',AM).forEach(function(b){b.setAttribute('aria-expanded','false')})}
    document.addEventListener('click',function(e){if(!e.target.closest('.v36-rm'))closeRm()});
    function rname(r){var b=$('.v35-nm',r)||$('b',r);return b?b.firstChild.textContent.trim():''}
    AM.addEventListener('click',function(e){var t=e.target;
      var mb=t.closest('.v36-rmb');if(mb){stop(e);var m=mb.nextElementSibling,was=!m.hidden;closeRm();m.hidden=was;mb.setAttribute('aria-expanded',!was);if(!was){var f=$('button',m);if(f)f.focus()}return}
      var rr=t.closest('.v36-rren');if(rr){stop(e);closeRm();var r=rr.closest('.v35-r,.v36-mdi'),old=rname(r);
        modal({ic:r.dataset.kind==='key'?KEYI:SRV,tone:'info',t:'Renommer',p:'Un nom qui dit à quoi '+(r.dataset.kind==='key'?'sert cette clé.':'sert ce serveur.'),sel:1,
          body:'<label class="v36-fl"><span>Nom</span><input class="fi v36-in" type="text" maxlength="60" value="'+esc(old)+'"></label>',
          a:{l:'Enregistrer',fn:function(){var v=$('#v36-m .v36-in').value.trim();if(!v){say('Donnez un nom','warn');return}var b=$('.v35-nm',r)||$('b',r);b.firstChild.textContent=v;closeModal();say('Renommé : '+v,'ok')}},b:{l:'Annuler'}});
        setTimeout(function(){var i=$('#v36-m .v36-in');if(i)i.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();$('#v36-m .v36-mb1').click()}})},60);return}
      var rd=t.closest('.v36-rdel');if(rd){stop(e);closeRm();var r2=rd.closest('.v35-r,.v36-mdi'),k=r2.dataset.kind,n=rname(r2);
        modal({ic:k==='key'?KEYI:k==='mcp'?SRV:CPU,tone:'ko',t:k==='key'?'Révoquer la clé « '+n+' » ?':'Retirer « '+n+' » ?',p:k==='key'?'Les logiciels qui l’utilisent ne pourront plus confier de travail à '+NOM[EX]+'. Cette action est définitive.':k==='mcp'?NOM[EX]+' n’aura plus accès aux outils de ce serveur.':NOM[EX]+' ne pourra plus utiliser ce modèle dans le chat.',
          a:{l:k==='key'?'Révoquer':'Retirer',fn:function(){r2.remove();closeModal();if(k==='mdl'&&V36.mdlRead)V36.mdlRead();say((k==='key'?'Clé révoquée : ':k==='mcp'?'Serveur retiré : ':'Modèle retiré : ')+n,'ok')}},b:{l:'Annuler'}});var mb1=$('#v36-m .v36-mb1');if(mb1)mb1.classList.add('dng');return}});
    // Créer une clé : nom, puis la clé complète une seule fois
    function rnd(n){var c='abcdef0123456789',o='';for(var i=0;i<n;i++)o+=c[Math.floor(Math.random()*16)];return o}
    bK.addEventListener('click',function(e){stop(e);modal({ic:KEYI,tone:'info',t:'Créer une clé',p:'Pour qu’un de vos logiciels confie un travail à '+NOM[EX]+'.',
      body:'<label class="v36-fl"><span>Nom de la clé</span><input class="fi v36-in" type="text" maxlength="60" placeholder="Par exemple : site web"></label>',
      a:{l:'Créer',fn:function(b){var v=$('#v36-m .v36-in').value.trim();if(!v){say('Donnez un nom à la clé','warn');$('#v36-m .v36-in').focus();return}busy(b,'Création…');
        setTimeout(function(){var key='yl_live_'+rnd(24),mask='yl_live_••••'+key.slice(-4);
          modal({ic:KEYI,tone:'warn',nox:1,t:'Votre nouvelle clé',p:'Copiez-la maintenant et gardez-la en lieu sûr. Vous ne la reverrez plus.',
            body:'<div class="v36-kshow"><code>'+key+'</code><button type="button" class="btn o sm v36-kcp" data-h="1">'+COPY+' Copier</button></div>',
            a:{l:'J’ai copié la clé',fn:function(){closeModal();var r=document.createElement('div');r.className='v35-r';r.setAttribute('role','row');r.dataset.by=ME.n;
              r.innerHTML='<b role="cell" class="v35-nm">'+esc(v)+'</b><span role="cell" data-l="Clé"><span class="v35-k"><code>'+mask+'</code></span></span><span role="cell" class="v35-m" data-l="Créée le">01/10</span><span role="cell" class="v35-m" data-l="Dernière utilisation">jamais</span><span role="cell" class="v35-ok"><i></i>Active</span>';
              TK.appendChild(r);menuCell(r,'key');r.classList.add('v36-flash');say('Clé « '+v+' » créée','ok')}}});
          $('#v36-m .v36-kcp').addEventListener('click',function(ev){stop(ev);try{var _p=navigator.clipboard&&navigator.clipboard.writeText(key);if(_p&&_p.catch)_p.catch(function(){})}catch(_){}ev.currentTarget.innerHTML=IC.check+' Copiée';say('Clé copiée dans le presse-papiers','ok')})},700)}},b:{l:'Annuler'}})});
    // Ajouter un serveur MCP : nom, adresse, jeton, test de connexion
    // point 97 h : nom, adresse, authentification, test de connexion, outils détectés
    bM.addEventListener('click',function(e){stop(e);var tested=0,TOOLS=['lire_stock','chercher_produit','lister_commandes','créer_commande','mettre_à_jour_prix','exporter_inventaire','alertes_rupture','fiche_fournisseur'];
      modal({ic:SRV,tone:'info',t:'Ajouter un serveur MCP',p:'Il donne à '+NOM[EX]+' les outils de vos logiciels internes.',
      body:'<div class="v38-mcp"><label class="v36-fl"><span>Nom</span><input class="fi v36-in v36-sn" type="text" maxlength="60" placeholder="Par exemple : stock Unifood"></label>'+
        '<label class="v36-fl"><span>Adresse du serveur</span><input class="fi v36-su2" type="url" placeholder="https://mcp.unifood.info/stock"></label>'+
        '<div class="v36-fl"><span>Authentification</span><div class="seg v38-mca" role="radiogroup" aria-label="Authentification"><a href="#" data-h="1" data-a="none">Aucune</a><a href="#" class="on" data-h="1" data-a="bearer">Jeton</a><a href="#" data-h="1" data-a="hdr">En-têtes</a><a href="#" data-h="1" data-a="oauth">OAuth</a></div></div>'+
        '<div class="v38-mcz" data-a="bearer"><label class="v36-fl"><span>Jeton d’accès</span><input class="fi v36-st" type="password" autocomplete="off" placeholder="Bearer …"></label></div>'+
        '<div class="v38-mcz" data-a="hdr" hidden><div class="v38-mch"><input class="fi" placeholder="Nom de l’en-tête, ex. X-Api-Key"><input class="fi" type="password" placeholder="Valeur"></div><a href="#" class="link sm v38-mchadd" data-h="1">+ Ajouter un en-tête</a></div>'+
        '<div class="v38-mcz" data-a="oauth" hidden><p class="v38-aih">Vous serez redirigé vers la page de connexion du logiciel, puis ramené ici.</p></div>'+
        '<div class="v38-mct" aria-live="polite"></div></div>',
      a:{l:'Tester la connexion',fn:function(b){var n=$('#v36-m .v36-sn').value.trim(),u=$('#v36-m .v36-su2').value.trim(),o=$('#v36-m .v38-mct');
        if(!n){say('Donnez un nom au serveur','warn');$('#v36-m .v36-sn').focus();return}if(!/^https?:\/\/\S+\.\S+/.test(u)){say('Entrez une adresse qui commence par https://','warn');$('#v36-m .v36-su2').focus();return}
        if(!tested){busy(b,'Test en cours…');setTimeout(function(){unbusy(b);tested=TOOLS.length-Math.floor(Math.random()*3);
            o.innerHTML='<p class="v36-ok2">'+IC.check+' Connexion réussie : '+tested+' outils détectés</p><div class="v38-mctl">'+TOOLS.slice(0,tested).map(function(t){return '<label><input type="checkbox" checked> <code>'+t+'</code></label>'}).join('')+'</div><p class="v38-aih">Décochez les outils que '+NOM[EX]+' ne doit pas utiliser.</p>';b.textContent='Ajouter le serveur'},1100);return}
        var k=$$('#v36-m .v38-mctl input:checked').length;closeModal();var r=document.createElement('div');r.className='v35-r';r.setAttribute('role','row');r.dataset.by=ME.n;
        r.innerHTML='<b role="cell" class="v35-nm">'+esc(n)+'</b><span role="cell" data-l="Adresse"><span class="v35-k"><code>'+esc(u.replace(/^https?:\/\//,''))+'</code></span></span><span role="cell" class="v35-m" data-l="Outils">'+k+' outils</span><span role="cell" class="v35-m" data-l="Dernier appel">jamais</span><span role="cell" class="v35-ok"><i></i>Actif</span>';
        TM.appendChild(r);menuCell(r,'mcp');r.classList.add('v36-flash');say('Serveur « '+n+' » ajouté, '+k+' outils','ok')}},b:{l:'Annuler'}});
      var M=$('#v36-m');M.addEventListener('click',function(ev){var x=ev.target.closest('.v38-mca a');if(x){stop(ev);$$('.v38-mca a',M).forEach(function(y){y.classList.toggle('on',y===x)});$$('.v38-mcz',M).forEach(function(z){z.hidden=z.dataset.a!==x.dataset.a});return}
        var h=ev.target.closest('.v38-mchadd');if(h){stop(ev);var d=document.createElement('div');d.className='v38-mch';d.innerHTML='<input class="fi" placeholder="Nom de l’en-tête"><input class="fi" type="password" placeholder="Valeur">';h.parentNode.insertBefore(d,h)}})});
  }

  // ================= 18. Agenda d’un expert : Jour, Semaine, Mois, précédent, suivant, Aujourd’hui (même segment que l’Analytique)
  var AGP=EX&&$('#calendrier .v33-agp[data-v33p="ag"]');
  if(AGP){var WH=$('.ws-h',AGP),SUB=$('.ws-h .xs',AGP),CTL=$('.ws-h .row',AGP),CAL=$('.cal2',AGP),AGL=$('.agl',AGP);
    var MOISN=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],JN=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],JC=['lun.','mar.','mer.','jeu.','ven.','sam.','dim.'];
    var BASE=new Date(2026,8,28),TODAY=new Date(2026,9,1),view=matchMedia('(max-width:760px)').matches?'jour':'semaine',cur=new Date(TODAY);
    $$('.cnv, a[data-toast="Retour à aujourd’hui"]',CTL).forEach(function(a){a.remove()});
    var C=document.createElement('div');C.className='v36-agc';
    C.innerHTML='<div class="seg an-per v36-agseg" role="group" aria-label="Période"><a href="#" data-h="1" data-v="jour">Jour</a><a href="#" data-h="1" data-v="semaine">Semaine</a><a href="#" data-h="1" data-v="mois">Mois</a></div>'+
      '<button type="button" class="ib v36-agpv" data-h="1" aria-label="Précédent">'+svg('<path d="m15 18-6-6 6-6"/>')+'</button><button type="button" class="btn o sm v36-agtd" data-h="1">Aujourd’hui</button><button type="button" class="ib v36-agnx" data-h="1" aria-label="Suivant">'+svg('<path d="m9 18 6-6-6-6"/>')+'</button>';
    CTL.appendChild(C);var V=document.createElement('div');V.className='v36-agv';(AGL||CAL).insertAdjacentElement('afterend',V);
    function ymd(d){return d.getFullYear()*10000+d.getMonth()*100+d.getDate()}
    function evs(d){var di=Math.round((new Date(d.getFullYear(),d.getMonth(),d.getDate())-BASE)/864e5),wd=(d.getDay()+6)%7,inb=di>=0&&di<7;
      if(!inb&&(d<new Date(2026,8,1)||d>new Date(2026,10,30)))return [];var col=$$('.col',CAL)[wd];if(!col)return [];
      return $$('.ev',col).filter(function(e){return inb||!e.classList.contains('v33-new')}).map(function(e){var tp=parseFloat(e.style.top)||2,hg=parseFloat(e.style.height)||48,h=8+(tp-2)/52,m=Math.round((h%1)*60/15)*15;
        var b=$('b',e),sp=$('span',e);return {t:(Math.floor(h)<10?'0':'')+Math.floor(h)+':'+(m<10?'0':'')+m,n:b?b.textContent:'',s:sp?sp.textContent:'',k:(e.className.match(/\b(h|b|c)\b/)||[,''])[1],d:Math.round((hg+4)/52*60)}}).sort(function(a,b){return a.t<b.t?-1:1})}
    function monday(d){var x=new Date(d);x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
    function lab(){if(view==='jour')return (ymd(cur)===ymd(TODAY)?'Aujourd’hui, ':'')+JN[cur.getDay()]+' '+(cur.getDate()===1?'1er':cur.getDate())+' '+MOISN[cur.getMonth()];
      if(view==='semaine'){var a=monday(cur),b=new Date(a);b.setDate(b.getDate()+6);return 'Semaine du '+(a.getDate()===1?'1er':a.getDate())+' '+MOISN[a.getMonth()]+' au '+(b.getDate()===1?'1er':b.getDate())+' '+MOISN[b.getMonth()]}
      return MOISN[cur.getMonth()].charAt(0).toUpperCase()+MOISN[cur.getMonth()].slice(1)+' '+cur.getFullYear()}
    function evh(e,full){return '<div class="v36-ev '+e.k+'"><time>'+e.t+'</time><b>'+esc(e.n)+'</b>'+(full&&e.s?'<span>'+esc(e.s)+'</span>':'')+'</div>'}
    function draw(){$$('.v36-agseg a',C).forEach(function(a){var on=a.dataset.v===view;a.classList.toggle('on',on);a.setAttribute('aria-pressed',on)});if(SUB)SUB.textContent=lab();
      var base=view==='semaine'&&ymd(monday(cur))===ymd(BASE);AGP.classList.toggle('v36-agbase',base);V.hidden=base;
      var td=$('.v36-agtd',C);td.setAttribute('aria-pressed',ymd(cur)===ymd(TODAY));
      if(base){V.innerHTML='';return}
      var h='';
      if(view==='jour'){var L=evs(cur);h='<div class="v36-agd">'+(L.length?L.map(function(e){return evh(e,1)}).join(''):'<p class="v36-age">Rien de prévu ce jour-là.</p>')+'</div>'}
      else if(view==='semaine'){var a=monday(cur);h='<div class="v36-agw">';for(var i=0;i<7;i++){var d=new Date(a);d.setDate(a.getDate()+i);var L2=evs(d);
          h+='<div class="v36-agwd'+(ymd(d)===ymd(TODAY)?' tdy':'')+'"><button type="button" class="v36-agdh" data-h="1" data-d="'+d.getTime()+'">'+JC[i]+' <b>'+d.getDate()+'</b></button>'+(L2.length?L2.map(function(e){return evh(e)}).join(''):'<span class="v36-age">Libre</span>')+'</div>'}h+='</div>'}
      else{var f=new Date(cur.getFullYear(),cur.getMonth(),1),st=monday(f);h='<div class="v36-agm" role="grid"><div class="v36-agmh">'+JC.map(function(j){return '<span>'+j+'</span>'}).join('')+'</div><div class="v36-agmg">';
        for(var k=0;k<42;k++){var d2=new Date(st);d2.setDate(st.getDate()+k);if(k>=35&&d2.getMonth()!==cur.getMonth())break;var L3=evs(d2),out=d2.getMonth()!==cur.getMonth();
          h+='<button type="button" class="v36-agmd'+(out?' out':'')+(ymd(d2)===ymd(TODAY)?' tdy':'')+'" data-h="1" data-d="'+d2.getTime()+'" aria-label="'+JN[d2.getDay()]+' '+d2.getDate()+' '+MOISN[d2.getMonth()]+', '+L3.length+' rendez-vous"><b>'+d2.getDate()+'</b>'+
            L3.slice(0,2).map(function(e){return '<i class="'+e.k+'">'+esc(e.n)+'</i>'}).join('')+(L3.length>2?'<em>+'+(L3.length-2)+'</em>':'')+'</button>'}h+='</div></div>'}
      V.innerHTML=h}
    C.addEventListener('click',function(e){var a=e.target.closest('[data-v]');if(a){stop(e);view=a.dataset.v;draw();return}
      if(e.target.closest('.v36-agtd')){stop(e);cur=new Date(TODAY);draw();return}
      var dir=e.target.closest('.v36-agpv')?-1:e.target.closest('.v36-agnx')?1:0;if(!dir)return;stop(e);
      if(view==='jour')cur.setDate(cur.getDate()+dir);else if(view==='semaine')cur.setDate(cur.getDate()+7*dir);else cur=new Date(cur.getFullYear(),cur.getMonth()+dir,1);draw()});
    V.addEventListener('click',function(e){var b=e.target.closest('[data-d]');if(!b)return;stop(e);cur=new Date(+b.dataset.d);view='jour';draw()});
    draw();V36.agenda=function(v){view=v;draw()};
  }

  // ================= 19. Membres : fenêtre « Attribuer » (personne en tête, cartes d’experts cochables, compteur)
  var AT=$('#v33-att');
  if(AT){var apn=$('.pn',AT);apn.classList.add('v36-atp');var ROLE={'Djénéba':'Chief of Staff','Fatima':'Marketing et contenu','Koffi':'Design'};
    var hdr=document.createElement('div');hdr.className='v36-ath';hdr.innerHTML='<img alt=""><span><b class="v36-atn"></b><small class="v36-atr"></small></span>';apn.insertBefore(hdr,$('h2',apn));
    var h2=$('h2',apn);h2.id='v36-att';AT.setAttribute('role','dialog');AT.setAttribute('aria-labelledby','v36-att');
    $$('.v33-atl label',apn).forEach(function(l){var i=$('input',l),im=$('img',l),n=l.textContent.trim();l.className='v36-atc';im.removeAttribute('style');
      l.innerHTML='';l.appendChild(i);l.insertAdjacentHTML('beforeend','<img src="'+im.getAttribute('src')+'" alt=""><span class="grow"><b>'+esc(n)+'</b><small>'+esc(ROLE[n]||'')+'</small></span><span class="v36-atk" aria-hidden="true">'+IC.check+'</span>')});
    var cnt=document.createElement('p');cnt.className='v36-atcnt';cnt.setAttribute('aria-live','polite');$('.v33-atl',apn).insertAdjacentElement('afterend',cnt);
    function cn(){var n=$$('.v33-atl input:checked',apn).length;cnt.textContent=n?n+' Expert'+(n>1?'s attribués':' attribué'):'Aucun Expert attribué'}
    apn.addEventListener('change',cn);
    document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-open="v33-att"]');if(!b)return;setTimeout(function(){var w=b.dataset.who||'',tr=b.closest('tr'),im=tr&&$('img.av',tr),rl=tr&&$('.pill',tr);
      $('img',hdr).src=im?im.getAttribute('src'):'../img/aicha.jpg';$('.v36-atn',hdr).textContent=w;$('.v36-atr',hdr).textContent=rl?rl.textContent.trim():'Membre';
      h2.innerHTML='Experts de '+esc(w.split(' ')[0])+'<span class="v33-atw" hidden>'+esc(w)+'</span>';cn();var f=$('.v33-atl input',apn);if(f)f.focus()},0)});
    gate('#v33-att .v33-atok','Enregistrement…',700)}

  // ================= 20. Routines : 2e onglet des Réglages (Profil, Routines, Canaux, Connecteurs) ; l’Agenda redevient le calendrier seul
  var RTP=EX&&$('#routines.panel .v36-rtw'),RTS=EX&&$('#calendrier .v33-agp[data-v33p="rt"]');
  if(RTP&&RTS){RTP.appendChild(RTS);RTS.hidden=false;RTS.classList.add('v36-rtmv');var agt=$('#calendrier .v33-agt');if(agt)agt.hidden=true;var agp=$('#calendrier .v33-agp[data-v33p="ag"]');if(agp)agp.hidden=false;
    var rgn=$('.xnav .v33-rgn');function regOn(){var p=$('#routines.panel');if(rgn&&p&&p.classList.contains('on'))rgn.classList.add('on')}
    document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-t],[data-go]'))setTimeout(regOn,10)});
    goRoutines=function(){var a=$('.v33-rgt a[data-t="routines"]');if(a)a.click();regOn();window.scrollTo(0,0)};V36.routines=goRoutines;
    if(location.hash==='#routines'||Q.get('onglet')==='routines')setTimeout(function(){goRoutines();try{history.replaceState(null,'','#routines')}catch(_){}},0)}

  // ================= 21. Nouvelle routine : panneau à droite en 3 blocs (Que doit faire, Quand, Où recevoir)
  var RTM=EX&&$('#v33-rtm');
  if(RTM){var rpn=$('.pn',RTM),old=$('.v33-rtg',rpn),NM=NOM[EX],now=new Date(2026,9,1,10,52);
    var EXR={djeneba:['Fais-moi le point du jour : rendez-vous, validations en attente et urgences, en cinq lignes.','Résume ce qui a été fait aujourd’hui et ce qui reste pour demain.','Prépare le bilan de la semaine pour le directeur général : décisions, engagements tenus, retards.'],
      fatima:['Prépare les posts de la semaine pour Sossa et Super Mint.','Fais le rapport des réseaux sociaux du mois écoulé, avec les trois publications qui ont le mieux marché.','Regarde ce que les concurrents ont publié aujourd’hui et note ce qui compte.'],
      koffi:['Décline les visuels validés de la semaine dans tous les formats des réseaux.','Vérifie que les visuels livrés aujourd’hui respectent la charte de chaque marque.','Exporte les visuels validés de la semaine en PNG et PDF, rangés par marque.']}[EX];
    var JL=['L','M','M','J','V','S','D'],JLONG=['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'],MN=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
    var ZONES=[['Abidjan','Heure d’Abidjan (GMT)'],['Dakar','Heure de Dakar (GMT)'],['Lagos','Heure de Lagos (GMT+1)'],['Paris','Heure de Paris (GMT+2)']];
    var R={f:'week',days:[0],dom:1,date:'2026-10-05',h:'08:00',z:'Abidjan',ch:'tg'};
    rpn.classList.add('v36-rtpn');old.classList.add('v36-hid');var ox=$(':scope > .ib.x',rpn);if(ox)ox.classList.add('v36-hid');
    var TGI='<img src="../img/lg/telegram.png" alt="" width="18" height="18">',WEB='<img src="../img/yelema_y.png" alt="" width="18" height="18">';
    var F=document.createElement('div');F.className='v36-rtf';
    F.innerHTML='<div class="v36-rth"><h2 id="v36-rtt">Nouvelle routine</h2><button type="button" class="v36-mx" data-h="1" aria-label="Fermer">'+IC.x+'</button></div><div class="v36-rtb">'+
      '<section class="v36-rts1"><label class="v36-rtnm"><span>Nom</span><input class="v36-rn" type="text" maxlength="60" placeholder="Il se remplit tout seul"></label>'+
      '<h3><label for="v36-rc">Que doit faire '+NM+' ?</label></h3><textarea id="v36-rc" class="v36-rc" rows="4" placeholder="Dites-le simplement, comme à une collègue"></textarea>'+
      '<div class="v36-rtx">'+EXR.map(function(x){return '<button type="button" data-h="1">'+esc(x)+'</button>'}).join('')+'</div>'+
      '<button type="button" class="v36-rtai" data-h="1">'+svg('<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>')+' Aide-moi à l’écrire</button></section>'+
      '<section><h3>Quand ?</h3><div class="seg v36-rtq" role="group" aria-label="Fréquence"><a href="#" data-h="1" data-f="day">Chaque jour</a><a href="#" data-h="1" data-f="week">Chaque semaine</a><a href="#" data-h="1" data-f="month">Chaque mois</a><a href="#" data-h="1" data-f="once">Ponctuel</a></div>'+
      '<div class="v36-rtd" role="group" aria-label="Jours de la semaine">'+JL.map(function(j,i){return '<button type="button" data-h="1" data-j="'+i+'" aria-label="'+JLONG[i]+'" aria-pressed="false">'+j+'</button>'}).join('')+'</div>'+
      '<div class="v36-rtm2"><span>Le</span><div class="v36-dd" data-k="dom"></div><span>du mois</span></div><label class="v36-rtdt"><span>Date</span><input type="date" class="fi" value="2026-10-05" min="2026-10-01"></label>'+
      '<div class="v36-rtrow"><span>À</span><div class="v36-dd" data-k="h"></div><div class="v36-dd v36-ddz" data-k="z"></div></div><p class="v36-rtsum" aria-live="polite"></p></section>'+
      '<p class="v36-rtcan">'+svg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>')+' Le résultat arrive dans tous ses canaux.</p></section></div>'+
      '<div class="v36-rtft"><button type="button" class="btn o v36-rtx2" data-h="1">Annuler</button><button type="button" class="btn p v36-rtok" data-h="1">Créer la routine</button></div>';
    rpn.appendChild(F);RTM.setAttribute('role','dialog');RTM.setAttribute('aria-labelledby','v36-rtt');
    // listes maison (heure par 15 min, jour du mois, fuseau)
    var dd=function(el,opts,val,cb){el.innerHTML='<button type="button" class="v36-ddb" data-h="1" aria-haspopup="listbox" aria-expanded="false"><span></span>'+IC.chev+'</button><div class="v36-ddl" role="listbox" hidden>'+opts.map(function(o){return '<button type="button" role="option" data-h="1" data-v="'+esc(o[0])+'">'+esc(o[1])+'</button>'}).join('')+'</div>';
      var b=$('.v36-ddb',el),l=$('.v36-ddl',el);function set(v){val=v;var o=opts.filter(function(x){return String(x[0])===String(v)})[0];$('span',b).textContent=o?o[1]:v;$$('[role=option]',l).forEach(function(x){x.setAttribute('aria-selected',x.dataset.v===String(v))})}
      set(val);b.addEventListener('click',function(e){stop(e);var was=!l.hidden;$$('.v36-ddl',F).forEach(function(x){x.hidden=true});l.hidden=was;b.setAttribute('aria-expanded',!was);if(!was){var c=$('[aria-selected="true"]',l);if(c){l.scrollTop=c.offsetTop-60;c.focus()}}});
      l.addEventListener('click',function(e){var o=e.target.closest('[role=option]');if(!o)return;stop(e);set(o.dataset.v);l.hidden=true;b.setAttribute('aria-expanded','false');b.focus();cb(o.dataset.v)});
      l.addEventListener('keydown',function(e){var L=$$('[role=option]',l),i=L.indexOf(document.activeElement);if(e.key==='ArrowDown'){e.preventDefault();(L[i+1]||L[0]).focus()}if(e.key==='ArrowUp'){e.preventDefault();(L[i-1]||L[L.length-1]).focus()}if(e.key==='Escape'){e.stopPropagation();l.hidden=true;b.focus()}});return set};
    var HRS=[];for(var hh=0;hh<24;hh++)for(var mi=0;mi<60;mi+=15){var tt=(hh<10?'0':'')+hh+':'+(mi?mi:'00');HRS.push([tt,tt])}
    var DOM2=[];for(var di=1;di<=28;di++)DOM2.push([di,di===1?'1er':String(di)]);
    var sum=function(){};
    var setH=dd($('[data-k=h]',F),HRS,R.h,function(v){R.h=v;sum()}),setDom=dd($('[data-k=dom]',F),DOM2,R.dom,function(v){R.dom=+v;sum()}),setZ=dd($('[data-k=z]',F),ZONES,R.z,function(v){R.z=v;sum()});
    document.addEventListener('click',function(e){if(!(e.target.closest&&e.target.closest('.v36-dd')))$$('.v36-ddl',F).forEach(function(x){x.hidden=true})});
    var nextRun=function(){var p=R.h.split(':'),n;
      if(R.f==='once'){n=new Date(R.date+'T'+R.h+':00')}
      else if(R.f==='day'){n=new Date(now);n.setHours(+p[0],+p[1],0,0);if(n<=now)n.setDate(n.getDate()+1)}
      else if(R.f==='week'){if(!R.days.length)return null;n=new Date(now);n.setHours(+p[0],+p[1],0,0);for(var i=0;i<9;i++){if(R.days.indexOf((n.getDay()+6)%7)>=0&&n>now)break;n.setDate(n.getDate()+1)}}
      else{n=new Date(now.getFullYear(),now.getMonth(),R.dom,+p[0],+p[1]);if(n<=now)n=new Date(now.getFullYear(),now.getMonth()+1,R.dom,+p[0],+p[1])}
      return n};
    var dl=function(n){return JLONG[(n.getDay()+6)%7]+' '+(n.getDate()===1?'1er':n.getDate())+' '+MN[n.getMonth()]};
    sum=function(){var z=ZONES.filter(function(x){return x[0]===R.z})[0],zl=z?z[1].replace(/^Heure/,'heure').replace(/ \(.*\)$/,''):'',t;
      var ds=R.days.slice().sort().map(function(i){return JLONG[i]});
      if(R.f==='once')t='Ponctuel, le '+dl(new Date(R.date+'T12:00'))+' à '+R.h;else if(R.f==='day')t='Chaque jour à '+R.h;
      else if(R.f==='week')t=ds.length?'Chaque '+(ds.length>1?ds.slice(0,-1).join(', ')+' et '+ds[ds.length-1]:ds[0])+' à '+R.h:'Choisissez au moins un jour';else t='Chaque mois, le '+(R.dom===1?'1er':R.dom)+' à '+R.h;
      var n=nextRun();$('.v36-rtsum',F).innerHTML=esc(t)+(R.f==='week'&&!ds.length?'.':', '+esc(zl)+'.')+(n?' <b>Prochain passage : '+esc(dl(n))+'.</b>':'');
      $$('.v36-rtq a',F).forEach(function(a){var on=a.dataset.f===R.f;a.classList.toggle('on',on);a.setAttribute('aria-pressed',on)});
      $('.v36-rtd',F).hidden=R.f!=='week';$('.v36-rtm2',F).hidden=R.f!=='month';$('.v36-rtdt',F).hidden=R.f!=='once';
      $$('.v36-rtd button',F).forEach(function(b){var on=R.days.indexOf(+b.dataset.j)>=0;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
    };
    var rn=$('.v36-rn',F),rc=$('.v36-rc',F),nameTouched=false;
    var autoName=function(){if(nameTouched)return;var w=rc.value.trim().replace(/[.,:;!?].*$/,'').split(/\s+/).slice(0,4).join(' ');rn.value=w?w.charAt(0).toUpperCase()+w.slice(1):''};
    rn.addEventListener('input',function(){nameTouched=!!rn.value.trim()});rc.addEventListener('input',autoName);
    $('.v36-rtx',F).addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;stop(e);rc.value=b.textContent;autoName();rc.focus()});
    $('.v36-rtai',F).addEventListener('click',function(e){stop(e);var q=rc.value.trim();if(!q){say('Écrivez d’abord quelques mots, '+NM+' les met au propre','warn');rc.focus();return}var b=e.currentTarget;busy(b,'Je réécris…');
      setTimeout(function(){unbusy(b);var c=q.replace(/\.$/,'');rc.value=c.charAt(0).toUpperCase()+c.slice(1)+'. Range le résultat le fichier dans les Livrables. Demande mon accord avant tout envoi à l’extérieur.';autoName();say('Consigne réécrite, relisez-la','info')},700)});
    $('.v36-rtq',F).addEventListener('click',function(e){var a=e.target.closest('[data-f]');if(!a)return;stop(e);R.f=a.dataset.f;sum()});
    $('.v36-rtd',F).addEventListener('click',function(e){var b=e.target.closest('[data-j]');if(!b)return;stop(e);var j=+b.dataset.j,i=R.days.indexOf(j);if(i<0)R.days.push(j);else R.days.splice(i,1);sum()});
    $('.v36-rtdt input',F).addEventListener('change',function(e){R.date=e.target.value||R.date;sum()});
    [$('.v36-rth .v36-mx',F),$('.v36-rtx2',F)].forEach(function(b){b.addEventListener('click',function(e){stop(e);RTM.classList.remove('on')})});
    document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('[data-open="v33-rtm"]'))setTimeout(function(){R={f:'week',days:[0],dom:1,date:'2026-10-05',h:'08:00',z:'Abidjan',ch:'tg'};rc.value='';rn.value='';nameTouched=false;setH(R.h);setDom(R.dom);setZ(R.z);sum();rc.focus()},0)});
    $('.v36-rtok',F).addEventListener('click',function(e){stop(e);var b=e.currentTarget;if(b._v36b)return;var c=rc.value.trim();
      if(!c){say('Dites à '+NM+' ce qu’'+(FEM[EX]?'elle':'il')+' doit faire','warn');rc.focus();return}if(R.f==='week'&&!R.days.length){say('Choisissez au moins un jour','warn');return}
      var n=nextRun(),ymd=function(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)};
      $('.v33-rc',RTM).value=c;$('.v33-rn',RTM).value=rn.value.trim();$('.v33-rf',RTM).value=R.f;$('.v33-rd',RTM).value=R.f==='once'?R.date:ymd(n||now);$('.v33-rh',RTM).value=R.h;$('.v33-rz',RTM).value=R.z;
      window.v36rt={days:R.f==='week'?R.days.map(function(j){return (j+1)%7}).sort():null};
      busy(b,'Création…');setTimeout(function(){unbusy(b);var ok=$('.v33-rok',RTM);ok._v36go=1;try{ok.click()}finally{ok._v36go=0}window.v36rt=null;
        var first=$('#routines .v33-rt')||$('#calendrier .v33-rt');if(first){first.classList.add('v36-flash');setTimeout(function(){first.classList.remove('v36-flash')},1800)}},700)});
    sum()}
  // routines prêtes : lignes pleine largeur avec icône
  var PRB=EX&&$('.v33-rtp');
  if(PRB){var RPI=svg('<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>');
    var prIc=function(){$$('.v33-pr',PRB).forEach(function(p){if($('.v36-pri',p))return;var i=document.createElement('span');i.className='v36-pri';i.innerHTML=RPI;p.insertBefore(i,p.firstChild)})};
    prIc();new MutationObserver(prIc).observe(PRB,{childList:true});var h3=PRB.previousElementSibling&&PRB.previousElementSibling.previousElementSibling;if(h3&&h3.classList.contains('v33-h3'))h3.textContent='Routines prêtes'}

  // ================= 22. Fiche membre : rôle Admin ou Membre (segment), ce que le rôle permet en lecture seule
  $$('[data-perm]').forEach(function(b){var sel=$('.prmrole',b),seg=$('.v36-rseg',b);if(!sel||!seg)return;
    function sync(){$$('a',seg).forEach(function(a){var on=a.dataset.r===sel.value;a.classList.toggle('on',on);a.setAttribute('aria-pressed',on)});$$('.v36-rl',b).forEach(function(l){l.hidden=l.dataset.r!==sel.value})}
    seg.addEventListener('click',function(e){var a=e.target.closest('[data-r]');if(!a)return;stop(e);if(sel.value===a.dataset.r)return;sel.value=a.dataset.r;sel.dispatchEvent(new Event('change',{bubbles:true}));sync()});
    var no=$('.prmno',b);if(no)no.addEventListener('click',function(){setTimeout(sync,0)});sync()});

  // ================= 23. Recruter depuis l’Administration : experts déjà recrutés = badge « Recruté », recrutement pour un collègue
  if(page==='recruter'&&Q.get('depuis')==='admin'&&!MEMBRE){document.documentElement.classList.add('v36-radm');
    var PRIX={djeneba:'Incluse',fatima:'200 000 FCFA par mois',koffi:'200 000 FCFA par mois'},COL=[['Nadège Touré','m_women_36'],['Yao Kra','m_men_53'],['Serge Bamba','m_men_80'],['Jean-Marc Aka','m_men_83']];
    $$('.pc2.mine2').forEach(function(c){var k=(c.getAttribute('href')||'').replace('.html',''),n=NOM[k]||k;c.dataset.v36k=k;c.removeAttribute('href');c.setAttribute('aria-label',n+', déjà recruté');
      var it=$('.inteam',c);if(it)it.innerHTML=IC.check+' Recruté';
      $$('.rcrow .rb',c).forEach(function(r){r.remove()});var row=$('.rcrow',c)||c;var b=document.createElement('button');b.type='button';b.className='rb v36-rcol';b.dataset.h='1';b.innerHTML=PLUS+' Recruter pour un collègue';row.appendChild(b)});
    document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.v36-rcol');if(!b)return;e.preventDefault();e.stopImmediatePropagation();var c=b.closest('.pc2'),k=c.dataset.v36k,n=NOM[k]||k;
      modal({ic:PLUS,tone:'info',t:'Recruter '+n+' pour un collègue',p:n+' de plus, avec son propre espace pour votre collègue. '+(PRIX[k]&&PRIX[k]!=='Incluse'?PRIX[k]+'.':''),
        body:'<div class="v36-cl" role="radiogroup" aria-label="Pour qui">'+COL.map(function(x,i){return '<label class="v36-clo"><input type="radio" name="v36cl" value="'+esc(x[0])+'"'+(i?'':' checked')+'><img src="../img/'+x[1]+'.jpg" alt=""><span>'+esc(x[0])+'</span></label>'}).join('')+'</div>',
        a:{l:'Recruter',fn:function(bt){var w=$('#v36-m input[name=v36cl]:checked');busy(bt,'Recrutement…');setTimeout(function(){closeModal();say(n+' recruté'+(FEM[k]?'e':'')+' pour '+(w?w.value.split(' ')[0]:'votre collègue')+', son espace est prêt','ok')},800)}},b:{l:'Annuler'}})},true)}

  // ================= 10. catalogue des états : un bouton « Déclencher » par cas
  var CAT=$('.v36-cat');
  if(CAT){
    var T={ 't-ok':function(){say('Profil enregistré','ok')},'t-info':function(){say('Fatima vous répond en général en moins de 5 minutes','info')},
      't-warn':function(){say('Écrivez d’abord votre message','warn')},
      't-err':function(){var tr=function(){say('Impossible d’enregistrer le profil, vérifiez votre connexion',{type:'err',action:{label:'Réessayer',fn:function(){say('Profil enregistré','ok')}}})};tr()},
      't-undo':function(){var r=$('.v36-cfr');if(!r||r.hidden){say('Le fichier est déjà supprimé','info');return}r.hidden=true;$('.v36-cfe').hidden=false;
        say('Fichier supprimé : Plan média T4',{type:'ok',action:{label:'Annuler',fn:function(){r.hidden=false;$('.v36-cfe').hidden=true;say('Fichier rétabli : Plan média T4','ok')}}})},
      'ouverture':function(){splash(true)},
      'busy':function(){var b=$('.v36-cdb');if(!b||b._v36b)return;busy(b,'Envoi…');setTimeout(function(){unbusy(b);say('Message envoyé','ok')},1400)},
      'import':function(){progress([{name:'Plan média T4.pdf',size:3.2*1048576},{name:'Film Sossa 30 s.mp4',size:18*1048576},{name:'Photos boutique.zip',size:9*1048576}],function(f){say(f.length+' fichier'+(f.length>1?'s ajoutés':' ajouté')+' à Livrables','ok')})},
      'reflechit':function(){var th=$('.v36-cth');if(!th)return;var d=document.createElement('div');d.className='msg moi';d._v36=1;d.innerHTML='<div class="bub">Prépare les posts de la semaine pour Sossa</div><time>à l’instant</time>';th.appendChild(d);think(th,d,'fatima')},
      'lent':function(){if(window.v35&&window.v35.lent)window.v35.lent();else say('Chargement lent indisponible ici','info')},
      'offline':function(){netSim(!OFF)},
      'notifs':function(){var b=$('[data-pop="notifs"]');if(b){setTimeout(function(){b.click()},0)}},
      '404':function(){location.href='404.html'},'erreur':function(){location.href='erreur.html'}};
    CAT.addEventListener('click',function(e){var b=e.target.closest('[data-v36]');if(!b)return;stop(e);var k=b.dataset.v36;if(T[k])T[k]();else if(CASES[k])CASES[k].run()});
  }
  // ================= 24. Clés et connexions (Leslie, 03/10 08:41) : une ligne par fournisseur, une clé par défaut, bascule de secours
  var KEYI2=svg('<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>');
  $$('.v36-aik').forEach(function(S){var L=$('.v36-ail',S),FB=$('.v36-aifb',S),ADD=$('.v36-aiadd',S);if(!L)return;
    function mine(x){return x.by===ME.n}
    function draw(fl){var a=aikGet();
      L.innerHTML=a.length?a.map(function(x,i){var P=PROV[x.p]||{d:''},can=!MEMBRE||mine(x);
        return '<div class="v36-air'+(x.def?' def':'')+(fl===x.p?' v36-flash':'')+'" role="listitem" data-p="'+esc(x.p)+'"><img src="https://www.google.com/s2/favicons?sz=64&domain='+P.d+'" alt=""><span class="grow"><b>'+esc(x.p)+(x.def?' <em class="v36-aidf">Par défaut</em>':'')+'</b>'+
          '<code>'+esc(x.k)+'</code><small>'+(mine(x)?'Ajouté par vous':'Ajouté par '+esc(x.by))+'</small></span>'+
          '<span class="v36-rm"><button type="button" class="v36-rmb" data-h="1" aria-haspopup="menu" aria-expanded="false" aria-label="Plus d’actions pour la clé '+esc(x.p)+'">'+IC.more+'</button><span class="v36-rmm" role="menu" hidden>'+
          (x.def?'':'<button type="button" role="menuitem" class="v36-aidef" data-h="1">Définir par défaut</button>')+
          (can?'<button type="button" role="menuitem" class="v36-airep" data-h="1">Remplacer la clé</button><button type="button" role="menuitem" class="v36-rdel v36-aidel" data-h="1">Supprimer</button>':'<span class="v36-rno">Seul '+esc(x.by.split(' ')[0])+' ou l’admin peut la remplacer ou la supprimer</span>')+'</span></span></div>'}).join('')
        :'<p class="v36-aie">Aucune clé branchée. Ajoutez la clé d’un fournisseur pour que vos Experts puissent travailler.</p>'}
    draw();
    if(FB){var on=ls('v36-aifb')!=='0';FB.setAttribute('aria-checked',on);FB.dataset.h='1';
      FB.addEventListener('click',function(e){stop(e);var v=FB.getAttribute('aria-checked')!=='true';FB.setAttribute('aria-checked',v);ls('v36-aifb',v?'1':'0');say(v?'Bascule activée : si la clé par défaut ne répond pas, une autre prend le relais':'Bascule désactivée','info')})}
    function closeM(){$$('.v36-rmm',S).forEach(function(m){m.hidden=true});$$('.v36-rmb',S).forEach(function(b){b.setAttribute('aria-expanded','false')})}
    document.addEventListener('click',function(e){if(!e.target.closest('.v36-aik .v36-rm'))closeM()});
    function keyStep(p,rep){var P=PROV[p];
      modal({ic:'<img class="v36-aimg" src="https://www.google.com/s2/favicons?sz=64&domain='+P.d+'" alt="">',tone:'info',t:(rep?'Remplacer la clé ':'Clé ')+p,p:'Collez la clé d’API créée dans votre compte '+p+'.',
        body:(P.u?'<label class="v36-fl"><span>Lien de l’API du fournisseur</span><input class="fi v38-aiu" type="url" placeholder="'+(P.nok?'http://localhost:11434/v1':'https://…/v1')+'"></label><p class="v38-aih">Donné par votre fournisseur, commence par https://</p>':'')+
          (P.nok?'<input class="v36-in" type="hidden" value="local-sans-cle-0000">':'<label class="v36-fl"><span>Clé d’API</span><input class="fi v36-in" type="password" autocomplete="off" spellcheck="false" placeholder="'+(P.p?P.p+'…':'Collez la clé')+'"></label>')+'<p class="v36-fe" aria-live="polite"></p>',
        a:{l:rep?'Remplacer':'Ajouter',fn:function(b){var i=$('#v36-m .v36-in'),v=i.value.trim(),er=$('#v36-m .v36-fe');
          var uu=$('#v36-m .v38-aiu');if(uu&&!/^https?:\/\/\S+/.test(uu.value.trim())){er.textContent='Indiquez le lien de l’API, il commence par https://';uu.focus();return}
          if(v.length<12){er.textContent='Cette clé est trop courte. Copiez-la en entier depuis '+p+'.';i.focus();return}er.textContent='';busy(b,'Vérification…');
          setTimeout(function(){var a=aikGet(),m=(P.p&&v.indexOf(P.p)===0?P.p:'')+'••••'+v.slice(-4),x=a.filter(function(z){return z.p===p})[0];
            if(x){x.k=m;x.by=ME.n}else a.push({p:p,k:m,by:ME.n,def:a.length?0:1});aikSet(a);closeModal();draw(p);V36.mdlRead();
            say(rep?'Clé '+p+' remplacée':'Clé '+p+' ajoutée : ses modèles sont dans la barre du chat','ok')},800)}},b:{l:'Annuler'}});
      setTimeout(function(){var i=$('#v36-m .v36-in');if(i)i.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();$('#v36-m .v36-mb1').click()}})},60)}
    if(ADD)ADD.addEventListener('click',function(e){stop(e);var a=aikGet(),has={};a.forEach(function(x){has[x.p]=1});
      modal({ic:KEYI2,tone:'info',t:'Ajouter une clé',p:'Choisissez le fournisseur, puis collez la clé.',
        body:'<label class="v36-fl v38-aiq"><input class="fi" type="search" placeholder="Chercher un fournisseur" aria-label="Chercher un fournisseur"></label><div class="v36-aipv" role="list">'+Object.keys(PROV).map(function(p){return '<button type="button" class="v36-aipo" role="listitem" data-h="1" data-p="'+p+'"'+(has[p]?' aria-disabled="true"':'')+'><img src="https://www.google.com/s2/favicons?sz=64&domain='+PROV[p].d+'" alt=""><b>'+p+'</b>'+(has[p]?'<small>Déjà branchée</small>':'')+'</button>'}).join('')+'</div>',
        b:{l:'Annuler'}});
      var aq=$('#v36-m .v38-aiq input');if(aq)aq.addEventListener('input',function(){var q=aq.value.trim().toLowerCase();$$('#v36-m .v36-aipo').forEach(function(o){o.hidden=!!q&&o.dataset.p.toLowerCase().indexOf(q)<0})});
      $('#v36-m .v36-aipv').addEventListener('click',function(ev){var o=ev.target.closest('.v36-aipo');if(!o)return;stop(ev);
        if(o.getAttribute('aria-disabled')){say('Une clé '+o.dataset.p+' est déjà branchée : passez par ⋯ puis Remplacer la clé','info');return}keyStep(o.dataset.p)})});
    S.addEventListener('click',function(e){var t=e.target;
      var mb=t.closest('.v36-rmb');if(mb){stop(e);var m=mb.nextElementSibling,was=!m.hidden;closeM();m.hidden=was;mb.setAttribute('aria-expanded',!was);if(!was){var f=$('button',m);if(f)f.focus()}return}
      var r=t.closest('.v36-air');if(!r)return;var p=r.dataset.p;
      if(t.closest('.v36-aidef')){stop(e);var a=aikGet();a.forEach(function(x){x.def=x.p===p?1:0});aikSet(a);ls('v36-llm',null);draw(p);V36.mdlRead();say(p+' est la clé par défaut','ok');return}
      if(t.closest('.v36-airep')){stop(e);closeM();keyStep(p,1);return}
      if(t.closest('.v36-aidel')){stop(e);closeM();modal({ic:KEYI2,tone:'ko',t:'Supprimer la clé '+p+' ?',p:'Les modèles '+p+' ne seront plus proposés dans le chat.',
        a:{l:'Supprimer',fn:function(){var a=aikGet(),w=a.filter(function(x){return x.p===p})[0],i=a.indexOf(w);a.splice(i,1);if(w.def&&a[0])a[0].def=1;aikSet(a);closeModal();draw();V36.mdlRead();
          say('Clé '+p+' supprimée',{type:'ok',action:{label:'Annuler',fn:function(){var b=aikGet();if(w.def)b.forEach(function(x){x.def=0});b.splice(i,0,w);aikSet(b);draw(p);V36.mdlRead();say('Clé '+p+' rétablie','ok')}}})}},b:{l:'Annuler'}});
        var d1=$('#v36-m .v36-mb1');if(d1)d1.classList.add('dng')}});
  });

  // ================= 25. Administration : retour vers la liste parente, avec de vrais liens (Précédent du navigateur)
  var BACK=svg('<path d="m12 19-7-7 7-7M19 12H5"/>');
  (function(){var tgt=null,lab='';
    if(Q.get('depuis')==='admin'&&(EX||page==='recruter')){tgt='admin-experts.html';lab='Experts'}
    if(page==='admin-membre'){var ob=$('.sform > a.back');if(ob){ob.innerHTML=BACK+' Membres';ob.classList.add('v36-bk');ob.setAttribute('aria-label','Retour aux membres');return}tgt='admin-membres.html';lab='Membres'}
    if(!tgt)return;var a=document.createElement('a');a.className='v36-bk v36-bkf';a.href=tgt;a.innerHTML=BACK+' '+lab;a.setAttribute('aria-label','Retour à la liste des '+lab.toLowerCase());
    var host=$('main .page')||$('main');if(host)host.insertBefore(a,host.firstChild);
    // garder le paramètre dans les liens internes de l’espace de l’expert
    if(EX)$$('a[href^="#"]').forEach(function(x){x.dataset.v36dp=1})})();

  // ================= 26. Consommation IA (Leslie, 03/10 08:38, option A) : seuil d’alerte réglable
  $$('.v36-cia').forEach(function(B){var dd=$('.v36-ciad',B),sw=$('.v36-ciasw',B),lab=$('.v36-cial',B);if(!dd)return;
    var V=['10','20','30','50','80','100'];var cur=ls('v36-cia')||'30';
    function set(v){cur=v;ls('v36-cia',v);$$('.v36-ciav',B).forEach(function(x){x.textContent=v+' €'});if(sw)sw.setAttribute('aria-label','Me prévenir au-delà de '+v+' € ce mois-ci')}
    set(cur);var btn=$('.v36-ddb',dd),list=$('.v36-ddl',dd);
    list.innerHTML=V.map(function(v){return '<button type="button" role="option" data-h="1" data-v="'+v+'">'+v+' €</button>'}).join('');
    btn.addEventListener('click',function(e){stop(e);list.hidden=!list.hidden;btn.setAttribute('aria-expanded',!list.hidden);if(!list.hidden){var o=$('[data-v="'+cur+'"]',list)||$('button',list);$$('button',list).forEach(function(x){x.setAttribute('aria-selected',x===o)});o.focus()}});
    list.addEventListener('click',function(e){var o=e.target.closest('button');if(!o)return;stop(e);set(o.dataset.v);list.hidden=true;btn.setAttribute('aria-expanded','false');btn.focus();say('Alerte réglée : au-delà de '+o.dataset.v+' € ce mois-ci','ok')});
    list.addEventListener('keydown',function(e){var L=$$('button',list),i=L.indexOf(document.activeElement);if(e.key==='ArrowDown'){e.preventDefault();L[(i+1)%L.length].focus()}if(e.key==='ArrowUp'){e.preventDefault();L[(i-1+L.length)%L.length].focus()}if(e.key==='Escape'){list.hidden=true;btn.focus()}});
    document.addEventListener('click',function(e){if(!dd.contains(e.target))list.hidden=true});
    if(sw)sw.addEventListener('click',function(e){stop(e);var v=sw.getAttribute('aria-checked')!=='true';sw.setAttribute('aria-checked',v);sw.classList.toggle('on',v);say(v?'Alerte activée':'Alerte coupée','info')})});

  // ================= 27. Analytique admin : filtres Membres et Experts à cases multiples, par service ; libellé qui résume
  function msInit(M){if(M._v36)return;M._v36=1;var btn=$('.v36-msb',M),pan=$('.v36-msp',M),lab=$('.v36-msb span',M),kind=M.dataset.k;
    var all=$('.v36-msall',pan),items=$$('input[data-n]',pan),svc=$$('.v36-mssv',pan);
    function sum(){var on=items.filter(function(i){return i.checked}),n=on.length;
      if(!n||n===items.length){all.checked=true;return kind==='m'?'Tous les membres':'Tous les Experts'}all.checked=false;
      if(kind==='m'){var s0=on[0].dataset.s;if(on.every(function(i){return i.dataset.s===s0})&&items.filter(function(i){return i.dataset.s===s0}).length===n)return 'Service '+s0}
      return n===1?on[0].dataset.n:n+(kind==='m'?' membres':' Experts')}
    function upd(t){var s=sum();lab.textContent=s;svc.forEach(function(b){var its=items.filter(function(i){return i.dataset.s===b.dataset.s});b.setAttribute('aria-pressed',its.length&&its.every(function(i){return i.checked})&&!all.checked)});if(t)say('Analytique : '+s,'info')}
    function close(){pan.hidden=true;btn.setAttribute('aria-expanded','false')}
    btn.addEventListener('click',function(e){stop(e);var was=!pan.hidden;$$('.v36-msp').forEach(function(p){p.hidden=true});pan.hidden=was;btn.setAttribute('aria-expanded',!was);if(!was){var f=$('input,button',pan);if(f)f.focus()}});
    all.addEventListener('change',function(){items.forEach(function(i){i.checked=false});all.checked=true;upd(1)});
    items.forEach(function(i){i.addEventListener('change',function(){if(items.every(function(x){return !x.checked}))all.checked=true;upd(1)})});
    svc.forEach(function(b){b.dataset.h='1';b.addEventListener('click',function(e){stop(e);items.forEach(function(i){i.checked=i.dataset.s===b.dataset.s});upd(1)})});
    pan.addEventListener('keydown',function(e){if(e.key==='Escape'){close();btn.focus()}});
    document.addEventListener('click',function(e){if(!M.contains(e.target))close()});upd();M._sum=sum}
  V36.msInit=msInit;$$('.v36-af .v36-ms').forEach(msInit);
  // ================= 28. Analytique admin : Par membre | Par expert ; Facturation : un moyen choisi = sa seule étape, hauteur fixe ; demande d’export ; recherche plus large
  $$('.v36-pts').forEach(function(seg){var sec=seg.closest('section');seg.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;stop(e);
    $$('a',seg).forEach(function(x){var on=x===a;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});
    $('.v36-ptm',sec).hidden=a.dataset.v!=='m';$('.v36-ptx',sec).hidden=a.dataset.v!=='x'})});
  var PAY=page==='admin-facturation'&&$('#payer');
  if(PAY){var PDS=$$('.pyd',PAY),Z=document.createElement('div');Z.className='v36-pyz';PDS[0].parentNode.insertBefore(Z,PDS[0]);PDS.forEach(function(p){Z.appendChild(p);p.hidden=true});
    $$('.pyo',PAY).forEach(function(o){o.classList.remove('on');o.setAttribute('role','radio');o.setAttribute('aria-checked','false');o.tabIndex=0});
    var MM={'Wave':'mm','Orange Money':'mm','MTN MoMo':'mm','Moov Money':'mm','Djamo':'djamo','Carte bancaire':'carte','Dépôt ou virement':'dep'};
    function fit(){var h=0;PDS.forEach(function(p){var w=p.hidden;p.hidden=false;p.style.position='absolute';p.style.visibility='hidden';p.style.width=Z.clientWidth+'px';h=Math.max(h,p.offsetHeight);p.hidden=w;p.style.position='';p.style.visibility='';p.style.width=''});Z.style.height=h+'px'}
    fit();window.addEventListener('resize',fit);
    function choose(o){$$('.pyo',PAY).forEach(function(x){var on=x===o;x.classList.toggle('on',on);x.setAttribute('aria-checked',on)});var k=MM[o.dataset.pay];PDS.forEach(function(p){p.hidden=p.dataset.pd!==k});
      var mm=$('[data-pd="mm"] .xs',PAY);if(mm)mm.textContent='Numéro '+o.dataset.pay}
    document.addEventListener('click',function(e){var o=e.target.closest&&e.target.closest('#payer .pyo');if(!o)return;e.preventDefault();e.stopImmediatePropagation();choose(o)},true);
    PAY.addEventListener('keydown',function(e){var o=e.target.closest&&e.target.closest('.pyo');if(o&&(e.key==='Enter'||e.key===' ')){e.preventDefault();choose(o)}});
  }
  var EXB=$('.v36-exb');
  if(EXB){var EXL=$('.v36-exl');
    function msHTML(kind,label,items,svc){return '<div class="v36-ms" data-k="'+kind+'"><button type="button" class="v36-msb" data-h="1" aria-haspopup="true" aria-expanded="false"><span>'+label+'</span>'+IC.chev+'</button><div class="v36-msp" hidden><label class="v36-msi v36-msa"><input type="checkbox" class="v36-msall" checked><span>'+label+'</span></label>'+
      (svc?'<div class="v36-mss"><span>Par service</span>'+svc.map(function(x){return '<button type="button" class="v36-mssv" data-s="'+x+'" aria-pressed="false">'+x+'</button>'}).join('')+'</div>':'')+
      '<div class="v36-msl">'+items.map(function(x){return '<label class="v36-msi"><input type="checkbox" data-n="'+esc(x[0])+'" data-s="'+esc(x[1])+'"><span>'+esc(x[0])+'<small>'+esc(x[1])+'</small></span></label>'}).join('')+'</div></div></div>'}
    var XS=[['Djénéba','Chief of Staff'],['Fatima','Marketing et contenu'],['Koffi','Design'],['Kouassi','Ventes'],['Adjoua','Recrutement'],['Mamadou','Finance']],
      MS=[['Aïcha Diabaté','Marketing'],['Nadège Touré','Marketing'],['Yao Kra','Marketing'],['Fanta Bakayoko','Commercial'],['Mariam Koné','RH'],['Ibrahim Sylla','Finance'],['Jean-Marc Aka','Direction'],['Serge Bamba','Direction']];
    EXB.addEventListener('click',function(e){stop(e);
      modal({ic:IC.up.replace('m17 8-5-5-5 5M12 3v12','m7 10 5 5 5-5M12 15V3'),tone:'info',t:'Demander un export',p:'Vous recevez un lien de téléchargement par email.',
        body:'<div class="v36-exf"><span class="v36-exk">Pour qui</span><div class="seg v36-exw" role="radiogroup" aria-label="Pour qui"><a href="#" class="on" role="radio" aria-checked="true" data-h="1" data-v="ent">Toute l’entreprise</a><a href="#" role="radio" aria-checked="false" data-h="1" data-v="x">Des Experts</a><a href="#" role="radio" aria-checked="false" data-h="1" data-v="m">Des membres</a></div>'+
          '<div class="v36-exs" data-v="x" hidden>'+msHTML('x','Tous les Experts',XS)+'</div><div class="v36-exs" data-v="m" hidden>'+msHTML('m','Tous les membres',MS,['Direction','Marketing','Commercial','Finance','RH'])+'</div>'+
          '<span class="v36-exk">Période</span><div class="v36-exd"><label>Du<input class="fi v36-ex1" type="date" value="2026-09-01"></label><label>au<input class="fi v36-ex2" type="date" value="2026-09-30"></label></div>'+
          '<span class="v36-exk">Quoi</span><div class="v36-exq"><label><input type="checkbox" checked value="Conversations et messages"> Conversations et messages</label><label><input type="checkbox" checked value="Livrables"> Livrables</label><label><input type="checkbox" checked value="Documents fournis aux experts"> Documents fournis aux Experts</label></div>'+
          '<span class="v36-exk">Format</span><p class="v36-exfm">'+IC.file+' ZIP avec JSON et fichiers</p></div>',
        a:{l:'Envoyer la demande',fn:function(b){var M=$('#v36-m'),w=$('.v36-exw a.on',M).dataset.v,q=$$('.v36-exq input:checked',M).map(function(x){return x.value});
          if(!q.length){say('Cochez au moins un contenu à exporter','warn');return}
          var d1=$('.v36-ex1',M).value,d2=$('.v36-ex2',M).value;if(!d1||!d2||d1>d2){say('Choisissez une période valide','warn');return}
          var who=w==='ent'?'Toute l’entreprise':$('.v36-exs[data-v="'+w+'"] .v36-msb span',M).textContent;
          function fr(x){var p=x.split('-');return p[2]+'/'+p[1]}
          busy(b,'Envoi…');setTimeout(function(){closeModal();say('Demande envoyée. Le lien de téléchargement arrive par email sous 48 h.','ok');
            if(EXL){var r=document.createElement('div');r.className='v36-exr v36-flash';r.setAttribute('role','listitem');r.innerHTML='<span class="num">03/10</span><span class="grow">'+esc(who)+', du '+fr(d1)+' au '+fr(d2)+'</span><span class="pill">En préparation</span>';EXL.insertBefore(r,EXL.firstChild)}},800)}},
        b:{l:'Annuler'}});
      var M=$('#v36-m');$$('.v36-ms',M).forEach(msInit);
      $('.v36-exw',M).addEventListener('click',function(ev){var a=ev.target.closest('a');if(!a)return;stop(ev);$$('.v36-exw a',M).forEach(function(x){var on=x===a;x.classList.toggle('on',on);x.setAttribute('aria-checked',on)});$$('.v36-exs',M).forEach(function(x){x.hidden=x.dataset.v!==a.dataset.v})})});
  }
  if(page==='memoire')document.body.classList.add('v36-pgm');
  var SB=$('.v35-sb span');if(SB){SB.textContent='Chercher dans les conversations, les livrables, les membres…';SB.parentNode.classList.add('v36-sbw')}
})();
/* v4.37 (add87) : historique des conversations par-dessus le chat entre 761 et 1679 px (le chat garde sa largeur, la colonne de droite reste),
   lien « Gérer les connecteurs de l’entreprise » réservé à l’admin. Préfixe v37-. */
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  var vue;try{vue=localStorage.getItem('v33-vue')}catch(e){}
  if(vue&&vue!=='admin')$$('.v37-adm').forEach(function(p){p.hidden=true});
  var MQ=window.matchMedia('(min-width:761px) and (max-width:1679px)');
  $$('.v36-hw:not(.v36-hwg)').forEach(function(w){var col=$('.v36-hcol',w),tg=$('.v36-ctg',w);if(!col||!tg)return;
    function aria(){var on=w.classList.contains('plie');tg.setAttribute('aria-expanded',!on);tg.setAttribute('aria-label',on?'Déplier l’historique':'Replier l’historique');tg.title=tg.getAttribute('aria-label')}
    function close(){if(!w.classList.contains('plie')){w.classList.add('plie');aria()}}
    function sync(){var ov=MQ.matches&&!w.classList.contains('plie');if(w.classList.contains('v37-ov')!==ov)w.classList.toggle('v37-ov',ov)}
    // à cette largeur, la page s’ouvre colonne repliée ; la déplier la pose par-dessus le chat
    if(MQ.matches){w.classList.add('plie');aria()}
    sync();new MutationObserver(sync).observe(w,{attributes:true,attributeFilter:['class']});
    if(MQ.addEventListener)MQ.addEventListener('change',sync);
    col.addEventListener('click',function(e){if(!w.classList.contains('v37-ov'))return;if(e.target.closest('.v35-hi'))setTimeout(close,60)},true);
    document.addEventListener('click',function(e){if(w.classList.contains('v37-ov')&&!col.contains(e.target))close()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&w.classList.contains('v37-ov')){close();tg.focus()}})});
})();
/* compteur « Connectés » : Google Drive ou OneDrive suit la connexion des Livrables (add86), le compteur suit les cartes */
(function(){var g=document.querySelector('#connecteurs .v33-cxg'),em=document.querySelector('#connecteurs .v33-cxs [data-v33cx="c"] em');if(!g||!em)return;
  function n(){var k=g.querySelectorAll('.v33-cx.on').length;if(em.textContent!==String(k))em.textContent=k}
  n();setTimeout(n,0);new MutationObserver(n).observe(g,{subtree:true,attributes:true,attributeFilter:['class']})})();
/* point 36 : mobile. Discussion d’un expert en en-tête compact, composeur collé en bas, Discussions en liste puis conversation,
   tableaux de l’administration en cartes. Le style est dans add87.css (media max-width:760px). */
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  var MOB=window.matchMedia('(max-width:760px)');
  var BACK='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>';
  // composeurs : zone collée en bas
  $$('.chat2>.comp,.cm>.comp,.gin2.v36-comp').forEach(function(c){c.classList.add('v37-sticky')});
  // espace d’un expert : Discussion
  var D=$('#discussion.panel');
  if(D&&$('.xcol .pcard')){var was=null;
    function disc(){var on=D.classList.contains('on');document.body.classList.toggle('v37-disc',on);
      if(on&&MOB.matches&&was===false)window.scrollTo(0,0);was=on}
    disc();new MutationObserver(disc).observe(D,{attributes:true,attributeFilter:['class']});
    if(MOB.matches&&D.classList.contains('on')){window.scrollTo(0,0);setTimeout(function(){window.scrollTo(0,0)},60);setTimeout(function(){window.scrollTo(0,0)},400)}}
  // Discussions : la liste d’abord, puis la conversation en plein écran
  var CP=$('.chatp');
  if(CP&&$('.cl',CP)&&$('.cm',CP)){
    function list(){document.body.classList.add('v37-cl');document.body.classList.remove('v37-cv')}
    function conv(){document.body.classList.add('v37-cv');document.body.classList.remove('v37-cl');window.scrollTo(0,0)}
    $$('.cm .chd',CP).forEach(function(h){var b=document.createElement('button');b.type='button';b.className='v37-back';b.setAttribute('data-h','1');b.setAttribute('aria-label','Retour aux discussions');b.innerHTML=BACK;
      b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();list();window.scrollTo(0,0)});h.insertBefore(b,h.firstChild)});
    $$('.cl a.cv',CP).forEach(function(a){a.addEventListener('click',function(){if(MOB.matches)setTimeout(conv,0)})});
    if(/^#c-/.test(location.hash)){conv();setTimeout(function(){window.scrollTo(0,0)},60);setTimeout(function(){window.scrollTo(0,0)},400)}else list()}
  // tableaux : une carte par ligne en 390 (libellé de colonne devant chaque valeur)
  $$('main table.tbl:not(.drt)').forEach(function(t){var rows=[].slice.call(t.rows);if(rows.length<2)return;var h=rows[0];if(!h.querySelector('th'))return;
    var L=[].map.call(h.cells,function(c){return (c.textContent||'').trim()});h.classList.add('v37-th');t.classList.add('v37-cards');
    rows.slice(1).forEach(function(r){[].forEach.call(r.cells,function(c,i){if(L[i]&&!c.hasAttribute('data-l'))c.setAttribute('data-l',L[i])})})});
})();
/* hors ligne simulé : jamais plus de 2 minutes pour un vrai visiteur (la file d’attente part au retour) */
(function(){var k='v37-offt',now=Date.now(),t;try{if(!sessionStorage.getItem('v36-off')){sessionStorage.removeItem(k);return}t=+sessionStorage.getItem(k)||0;if(!t){sessionStorage.setItem(k,now);t=now}}catch(e){return}
  function back(){var b=document.querySelector('.v36-net .v36-netb');try{sessionStorage.removeItem(k)}catch(e){}if(b)b.click()}
  var left=120000-(now-t);if(left<=0)setTimeout(back,300);else setTimeout(back,left)})();
/* points 41 et 44 : la même icône de repli partout */
(function(){var C='<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  OPEN='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+C+'<path d="m14 9 3 3-3 3"/></svg>',
  CLOSE='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+C+'<path d="m16 15-3-3 3-3"/></svg>';
  function sb(){var mini=document.body.classList.contains('sbmini');[].forEach.call(document.querySelectorAll('.sbt'),function(b){var want=mini?OPEN:CLOSE;if(b._v37!==want){b.innerHTML=want;b._v37=want}})}
  sb();new MutationObserver(sb).observe(document.body,{attributes:true,attributeFilter:['class']});
  [].forEach.call(document.querySelectorAll('.v36-ctg'),function(b){b.innerHTML=CLOSE});
  [].forEach.call(document.querySelectorAll('.v36-copen'),function(b){b.innerHTML=OPEN;b.setAttribute('aria-label','Déplier l’historique');b.title='Déplier l’historique'});
  // la colonne étroite ne coupe jamais le bouton : « + » seul avec une infobulle si le libellé ne tient pas
  function fit(){[].forEach.call(document.querySelectorAll('.v36-chd .v36-cnew'),function(b){var s=b.querySelector('span');if(!s)return;b.classList.remove('v37-ico');s.hidden=false;
    if(b.scrollWidth>b.clientWidth+1||b.getBoundingClientRect().right>b.parentNode.getBoundingClientRect().right+1){s.hidden=true;b.classList.add('v37-ico');b.title='Nouvelle conversation'}})}
  fit();window.addEventListener('resize',fit);
  [].forEach.call(document.querySelectorAll('.v36-hw'),function(w){new MutationObserver(function(){setTimeout(fit,0)}).observe(w,{attributes:true,attributeFilter:['class']})})})();
/* point 42 : dans le chat entreprise et chez Yélé, Envoyer (bouton ou Entrée) montre vraiment le message, puis la réponse */
(function(){function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function offl(){return document.documentElement.classList.contains('v36-offl')}
  var GM=$('.gpt .gmain'),Y=$('#yele');
  function memSend(v){var conv=$('.gconv',GM),ga=$('.gm2.lui .ga',GM),gai=ga?ga.innerHTML:'',f=document.createElement('div');f.className='gfil';f.id='v37-g'+Date.now();
    f.innerHTML='<div class="gm2 moi"><div class="bq">'+esc(v)+'</div></div><div class="gm2 lui v37-wait"><span class="ga">'+gai+'</span><div class="ba"><p class="v37-th">Yelema cherche dans les documents de l’entreprise…</p></div></div>';
    $$('.gfil',GM).forEach(function(x){x.style.display='none'});conv.appendChild(f);f.style.display='block';GM.classList.remove('vide');var t=$('.gtt',GM);if(t)t.textContent=v.length>48?v.slice(0,46)+'…':v;
    setTimeout(function(){var l=$('.v37-wait',f);if(!l)return;l.classList.remove('v37-wait');$('.ba',l).innerHTML='<p>Voici ce que j’ai trouvé dans les documents de l’entreprise sur « '+esc(v)+' ». Les sources sont citées sous la réponse ; demandez un détail si besoin.</p>'},1400)}
  function yeleSend(v){var inp=$('.inp',Y),m=document.createElement('div');m.className='msg moi';m.style.marginTop='10px';m.innerHTML='<div class="bub">'+esc(v)+'</div>';
    var a=document.createElement('div');a.className='msg lui';a.style.marginTop='8px';a.innerHTML='<div class="bub">Yélé réfléchit…</div>';inp.parentNode.insertBefore(m,inp);inp.parentNode.insertBefore(a,inp);
    var sg=$('.sugg',Y);if(sg)sg.hidden=true;
    setTimeout(function(){$('.bub',a).textContent='Bonne question. Je vous réponds tout de suite, et si c’est plus complexe, je passe le relais à l’équipe Yelema qui vous écrit ici.'},1200)}
  function host(el){if(GM&&GM.contains(el))return 'mem';if(Y&&Y.contains(el))return 'yele';return null}
  function go(box,e){var i=$('.v33-in',box);if(!i)return;var v=i.value.trim();if(!v||offl())return;var h=host(box);if(!h)return;e.preventDefault();e.stopImmediatePropagation();
    if(h==='mem')memSend(v);else yeleSend(v);i.value='';i.dispatchEvent(new Event('input',{bubbles:true}))}
  document.addEventListener('keydown',function(e){if(e.key!=='Enter'||e.shiftKey||e.isComposing)return;var i=e.target.closest&&e.target.closest('.v36-comp .v33-in');if(!i)return;go(i.closest('.v36-comp'),e)},true);
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.v36-comp .v36-sb');if(!b)return;go(b.closest('.v36-comp'),e)},true);
  // Yélé : la suggestion pose la question
  if(Y)$$('.sugg span',Y).forEach(function(s){s.setAttribute('role','button');s.tabIndex=0;s.addEventListener('click',function(e){e.stopPropagation();yeleSend(s.textContent.trim())})});
})();
/* v4.38 (add88) : demandes de recrutement membre / admin (points 54, 77, 78), Yélé animé (80), carte de pied admin (72 ter),
   facturation (69 à 71), choix d’un service dans « Assigner à » (79). Préfixe v38-. */
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
  function stop(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
  function svg(p){return '<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
  var IC={send:svg('<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>'),
    clock:svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),check:svg('<path d="M20 6 9 17l-5-5"/>'),ok:svg('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
    x:svg('<path d="M18 6 6 18M6 6l12 12"/>'),user:svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>'),
    card:svg('<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>'),more:svg('<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>'),
    users:svg('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
    chev:svg('<path d="m6 9 6 6 6-6"/>'),star:svg('<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/>'),
    trash:svg('<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'),plus:svg('<path d="M5 12h14M12 5v14"/>')};
  var V=window.v36||{},say=function(m,t){(V.toast||window.toast||function(){})(m,t)};
  var page=(location.pathname.split('/').pop()||'').replace('.html','');
  var Q=new URLSearchParams(location.search);
  var VUE=ls('v33-vue')||'admin',MEMBRE=VUE!=='admin',ADMP=!!$('.sbadm');
  var ME={admin:{n:'Aïcha Diabaté',f:'Aïcha',p:'aicha'},membre:{n:'Nadège Touré',f:'Nadège',p:'m_women_36'},membre0:{n:'Didier Yapi',f:'Didier',p:'m_men_30'}}[VUE]||{n:'Aïcha Diabaté',f:'Aïcha',p:'aicha'};
  // experts proposés (pas encore dans l’équipe) : prénom, métier, accord féminin
  var CAT={adjoua:['Adjoua','Recrutement',1],alioune:['Alioune','Investissement',0],awa:['Awa','Service client',1],fatou:['Fatou','RH et paie',1],ibrahim:['Ibrahim','Juridique',0],
    kouassi:['Kouassi','Ventes',0],mamadou:['Mamadou','Finance',0],nadia:['Nadia','Données',1],salif:['Salif','Opérations',0]};
  var PRIX='200 000 FCFA';
  function slug(n){return String(n).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z]/g,'')}
  function pron(k){return CAT[k]&&CAT[k][2]?'Elle':'Il'}

  // ================= 1. demandes de recrutement (points 54, 77, 78)
  var DK='v38-dem';
  var SEED=[{id:'d1',e:'fatou',m:'Nadège Touré',mp:'m_women_36',msg:'Pour suivre les congés et les contrats des saisonniers de la campagne Sossa.',t:'02/10 à 16:40',st:'att'},
    {id:'d2',e:'nadia',m:'Fanta Bakayoko',mp:'m_women_16',msg:'Pour sortir chaque lundi les ventes par région.',t:'02/10 à 09:15',st:'att'},
    {id:'d0',e:'salif',m:'Didier Yapi',mp:'m_men_30',msg:'Pour suivre les livraisons des fournisseurs.',t:'29/09 à 11:02',st:'ko',motif:'On attend la fin du trimestre.',dt:'30/09'}];
  function dems(){var v=ls(DK);if(v){try{var a=JSON.parse(v);if(Array.isArray(a))return a}catch(_){}}return SEED.map(function(x){return Object.assign({},x)})}
  function demSet(a){ls(DK,JSON.stringify(a))}
  function now(){var d=new Date();function z(n){return (n<10?'0':'')+n}return z(d.getDate())+'/'+z(d.getMonth()+1)+' à '+z(d.getHours())+':'+z(d.getMinutes())}
  function mine(k){return dems().filter(function(d){return d.e===k&&d.m===ME.n&&d.st==='att'})[0]}
  function pending(){return dems().filter(function(d){return d.st==='att'})}
  window.v38={dems:dems,demSet:demSet};

  // --- côté membre : « Demander à l’admin », jamais « rejoint votre équipe »
  function askModal(k){var c=CAT[k];if(!c||!V.modal)return;
    V.modal({ic:IC.send,tone:'info',t:'Demander '+c[0]+' à votre admin',p:'Votre admin reçoit la demande et décide. Rien n’est facturé de votre côté.',
      body:'<label class="v36-fl v38-f"><span>Pourquoi, en une phrase (facultatif)</span><input class="fi v36-in v38-why" type="text" maxlength="140" placeholder="Pour préparer les contrats des saisonniers"></label>',
      a:{l:'Envoyer la demande',fn:function(b){var w=$('#v36-m .v38-why');var a=dems();a.unshift({id:'d'+Date.now(),e:k,m:ME.n,mp:ME.p,msg:w?w.value.trim():'',t:now(),st:'att'});demSet(a);
        try{var r=JSON.parse(ls('v33-req')||'[]');r.unshift({m:ME.n,p:ME.p,e:c[0],t:Date.now()});ls('v33-req',JSON.stringify(r.slice(0,12)))}catch(_){}
        V.close();say('Demande envoyée à votre admin. Vous serez prévenu'+(VUE==='membre'?'e':'')+' dès '+(/^[AEIOUÉ]/.test(c[0])?'qu’':'que ')+c[0]+' rejoint l’équipe.','ok');memberSync()}},b:{l:'Annuler'}})}
  function pendHTML(){return IC.clock+' Demande en attente'}
  function memberSync(){if(!MEMBRE||ADMP)return;
    // cartes de Recruter
    $$('.pc2:not(.mine2)').forEach(function(c){var h=c.getAttribute('href')||'',k=(/recrue-([a-z]+)/.exec(h)||[])[1];if(!k||!CAT[k])return;var rb=$('.rb',c);if(!rb)return;
      if(mine(k)){rb.innerHTML=pendHTML();rb.classList.add('v38-pend');c.classList.add('v38-pc-pend')}else{rb.innerHTML=IC.send+' Demander à l’admin';rb.classList.remove('v38-pend')}});
    // fiche d’une recrue
    var k=(/^recrue-([a-z]+)$/.exec(page)||[])[1];if(k&&CAT[k]){document.documentElement.classList.add('v38-mreq');
      $$('.rqgo,.rqok').forEach(function(b){if(mine(k)){b.innerHTML=pendHTML();b.classList.add('v38-pend')}else{b.innerHTML=IC.send+' Demander à l’admin';b.classList.remove('v38-pend')}})}}
  if(MEMBRE&&!ADMP){
    window.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.pc2 .rb, .rqgo, .rqok, .rqgo2');if(!t)return;
      var c=t.closest('.pc2'),h=c?(c.getAttribute('href')||''):'',k=(/recrue-([a-z]+)/.exec(h)||/^recrue-([a-z]+)$/.exec(page)||[])[1];if(!k||!CAT[k])return;
      if(c&&c.classList.contains('mine2'))return;stop(e);if(mine(k)){say('Votre demande pour '+CAT[k][0]+' attend la réponse de votre admin','info');return}askModal(k)},true);
    memberSync();
    // décisions de l’admin : le membre est prévenu une fois
    dems().forEach(function(d){if(d.m===ME.n&&d.st!=='att'&&!d.vu){var c=CAT[d.e];if(!c)return;
      setTimeout(function(){say(d.st==='ok'?'Votre admin a accepté : '+c[0]+' rejoint l’équipe.':'Votre admin a refusé la demande pour '+c[0]+(d.motif?' : '+d.motif:'.'),d.st==='ok'?'ok':'info')},900);
      var a=dems();a.forEach(function(x){if(x.id===d.id)x.vu=1});demSet(a)}})}

  // --- côté admin : section « Demandes » (Admin > Experts), pastilles, approuver et payer, refuser
  function badge(){var n=pending().length;
    $$('.sbadm a.it[href="admin-experts.html"]').forEach(function(a){var b=$('.v38-bdg',a);if(!n){if(b)b.remove();return}if(!b){b=document.createElement('span');b.className='v38-bdg';a.appendChild(b)}b.textContent=n;b.setAttribute('aria-label',n+' demande'+(n>1?'s':'')+' en attente')})}
  function payModal(d){var c=CAT[d.e];if(!c||!V.modal)return;var mm=defMoyen();
    V.modal({ic:IC.card,tone:'info',t:'Recruter '+c[0]+' pour '+d.m.split(' ')[0],p:'',
      body:'<div class="v39-apx"><img src="../img/'+d.e+'.jpg" alt=""><div><p>Vous êtes sur le point de recruter <b>'+esc(c[0])+'</b>, '+esc(c[1])+', pour <b>'+esc(d.m)+'</b> de votre équipe.</p><small>'+PRIX+' par mois, ajouté à votre prochaine facture.</small></div></div>'+
        '<div class="v38-pm v39-apm"><span class="v38-pml">Payer avec</span><div class="v38-pmo"><span class="v38-pmi">'+IC.card+'</span><span class="grow"><b>'+esc(mm)+'</b><small>Moyen par défaut</small></span><a class="link sm" href="admin-facturation.html#v38-moyens">Changer</a></div>'+
        '<div class="v38-pmr"><span>Premier mois</span><b class="num">'+PRIX+'</b></div></div>',
      a:{l:'Payer '+PRIX,fn:function(b){V.busy&&V.busy(b,'Paiement…');setTimeout(function(){V.unbusy&&V.unbusy(b);var a=dems();a.forEach(function(x){if(x.id===d.id){x.st='ok';x.dt=now()}});demSet(a);V.close();
        say(c[0]+' rejoint votre équipe. '+pron(d.e)+' vous écrit dans quelques minutes.','ok');renderAdm();badge()},1100)}},b:{l:'Annuler'}})}
  function refuseModal(d){var c=CAT[d.e];if(!c||!V.modal)return;
    V.modal({ic:IC.x,tone:'warn',t:'Refuser la demande de '+d.m.split(' ')[0],p:d.m.split(' ')[0]+' est prévenu'+(/a$|e$/.test(d.m.split(' ')[0])?'e':'')+'. Vous pourrez recruter '+c[0]+' plus tard.',
      body:'<label class="v36-fl v38-f"><span>Motif (facultatif)</span><input class="fi v36-in v38-mot" type="text" maxlength="140" placeholder="On en reparle au prochain trimestre"></label>',
      a:{l:'Refuser',fn:function(){var m=$('#v36-m .v38-mot'),a=dems();a.forEach(function(x){if(x.id===d.id){x.st='ko';x.motif=m?m.value.trim():'';x.dt=now()}});demSet(a);V.close();
        say('Demande refusée, '+d.m.split(' ')[0]+' est prévenu'+(/a$|e$/.test(d.m.split(' ')[0])?'e':''),'ok');renderAdm();badge()}},b:{l:'Annuler'}})}
  var SEC=null;
  function card(d){var c=CAT[d.e]||[d.e,'',0],me=d.m.split(' ')[0];
    return '<tr class="v38-dq" data-id="'+d.id+'"><td><span class="v38-tw"><img src="../img/'+d.mp+'.jpg" alt=""><span><b>'+esc(d.m)+'</b>'+(d.pour&&d.pour!==d.m?'<small>pour '+esc(d.pour)+'</small>':'')+'</span></span></td>'+
      '<td><span class="v38-tw"><img src="../img/'+d.e+'.jpg" alt=""><span><b>'+esc(c[0])+'</b><small>'+esc(c[1])+'</small></span></span>'+(d.msg?'<span class="v39-dqr" tabindex="0" role="button" aria-expanded="false" title="'+esc(d.msg)+'">'+esc(d.msg)+'</span>':'')+'</td>'+
      '<td class="num">'+esc(d.t)+'</td>'+
      '<td class="v38-dqa"><button type="button" class="btn o sm v38-ko" data-h="1">Refuser</button><button type="button" class="btn p sm v38-ok" data-h="1">Approuver</button></td></tr>'}
  function hist(d){var c=CAT[d.e]||[d.e];return '<li class="v38-dh"><img src="../img/'+d.mp+'.jpg" alt=""><span class="grow"><b>'+esc(c[0])+'</b> pour '+esc(d.m)+(d.motif?'<small>Motif : '+esc(d.motif)+'</small>':'')+'</span>'+
    '<span class="v38-st '+(d.st==='ok'?'ok':'ko')+'">'+(d.st==='ok'?IC.ok+' Approuvée':IC.x+' Refusée')+'</span><time>'+esc(d.dt||d.t)+'</time></li>'}
  function renderAdm(){if(!SEC)return;var a=dems(),p=a.filter(function(d){return d.st==='att'}),h=a.filter(function(d){return d.st!=='att'});
    $('.v38-dqn',SEC).textContent=p.length;$('.v38-dqn',SEC).hidden=!p.length;
    $('.v38-dql',SEC).innerHTML=p.length?'<table class="tbl v38-dqt"><thead><tr><th>Demandeur</th><th>Expert demandé</th><th>Date</th><th><span class="v38-sr">Actions</span></th></tr></thead><tbody>'+p.map(card).join('')+'</tbody></table>':'<div class="v38-empty">'+IC.users+'<b>Aucune demande en attente</b><span>Quand un membre demande un Expert, sa demande arrive ici et dans vos notifications.</span></div>';
    $('.v38-dhl',SEC).innerHTML=h.length?h.map(hist).join(''):'<li class="v38-dh mute3">Aucune demande traitée pour l’instant.</li>'}
  if(page==='admin-experts'){var hl=($('.tbex2')||{}).closest?$('.tbex2').closest('.box'):$('.sform .hello');if(hl){SEC=document.createElement('section');SEC.className='box v38-dem';SEC.id='demandes';
      SEC.innerHTML='<div class="ch"><h2>Demandes de recrutement <span class="v38-dqn"></span></h2><span class="xs mute3">Approuver ouvre le paiement, avec votre moyen par défaut</span></div><div class="v38-dql"></div>'+
        '<details class="v38-dhw"><summary>Demandes traitées</summary><ul class="v38-dhl"></ul></details>';
      hl.insertAdjacentElement('afterend',SEC);renderAdm();
      SEC.addEventListener('click',function(e){var b=e.target.closest('.v38-ok,.v38-ko');if(!b)return;stop(e);var id=b.closest('.v38-dq').dataset.id,d=dems().filter(function(x){return x.id===id})[0];if(!d)return;
        if(b.classList.contains('v38-ok'))payModal(d);else refuseModal(d)});
      if(location.hash==='#demandes')setTimeout(function(){SEC.scrollIntoView({block:'start'});scrollBy(0,-80)},200)}}
  if(ADMP){badge();
    // Vue d’ensemble : un rappel cliquable
    if(page==='admin'&&pending().length){var h0=$('.sform .hello');if(h0){var r=document.createElement('a');r.className='box v38-dov';r.href='admin-experts.html#demandes';
      r.classList.add('v39-dov');r.setAttribute('aria-label',pending().length+' demandes de recrutement, voir les demandes');
      r.innerHTML='<span class="v38-dovi">'+IC.users+'</span><span class="grow"><b>'+pending().length+' demande'+(pending().length>1?'s':'')+' de recrutement</b><span class="v39-dovl">'+pending().map(function(d){var c=CAT[d.e]||[d.e];return '<span class="v39-dovp"><img src="../img/'+d.mp+'.jpg" alt="">'+esc(d.m.split(' ')[0])+svg('<path d="M5 12h14M12 5l7 7-7 7"/>')+'<img src="../img/'+d.e+'.jpg" alt="">'+esc(c[0])+'</span>'}).join('')+'</span></span><span class="v39-dovgo">Voir les demandes '+svg('<path d="M5 12h14M12 5l7 7-7 7"/>')+'</span>';
      h0.insertAdjacentElement('afterend',r)}}}
  // notifications de l’admin : les demandes en attente arrivent dans la cloche (même source que add83 / add86)
  if(!MEMBRE){try{var R=JSON.parse(ls('v33-req')||'[]'),P=pending(),chg=0;P.forEach(function(d){var n=(CAT[d.e]||[d.e])[0];if(!R.some(function(r){return r.m===d.m&&r.e===n})){R.push({m:d.m,p:d.mp,e:n,t:Date.now()-3600e3});chg=1}});
      R=R.filter(function(r){var x=dems().filter(function(d){return d.m===r.m&&(CAT[d.e]||[])[0]===r.e})[0];if(x&&x.st!=='att'){chg=1;return false}return true});
      if(chg)ls('v33-req',JSON.stringify(R))}catch(_){}}
  // le recrutement côté admin (fiche recrue) dit « rejoint votre équipe » seulement après le paiement : bouton « Payer et recruter »
  if(!MEMBRE)$$('.rqok').forEach(function(b){if(/Recruter/.test(b.textContent))b.innerHTML=IC.card+' Payer et recruter '+esc(b.dataset.nom||'')});

  // ================= 2. « Assigner à » : choisir un ou plusieurs services (point 79)
  var MEMB=[['Jean-Marc Aka','Direction','m_men_83'],['Serge Bamba','Direction','m_men_80'],['Sarah Diallo','Direction','m_women_69'],['Aïcha Diabaté','Marketing','aicha'],['Nadège Touré','Marketing','m_women_36'],['Yao Kra','Marketing','m_men_53'],
    ['Fanta Bakayoko','Commercial','m_women_16'],['Kader Ouattara','Commercial','m_men_59'],['Rokia Traoré','Commercial','m_women_89'],['Mariam Koné','RH','m_women_30'],['Ibrahim Sylla','Finance','m_men_91'],
    ['Hervé N’Guessan','Opérations','m_men_49'],['Olivier Kacou','Opérations','m_men_16'],['Didier Yapi','Opérations','m_men_30']];
  var SERV=[];MEMB.forEach(function(m){if(SERV.indexOf(m[1])<0)SERV.push(m[1])});
  function first(n){return n.split(' ')[0]}
  function pillFor(box,m){var f=first(m[0]),p=$$('.as',box).filter(function(x){var w=x.dataset.who;return w===f||w===m[0]||(w==='Moi'&&m[0]===ME.n)})[0];
    if(!p){p=document.createElement('span');p.className='as v38-as';p.dataset.who=f;p.innerHTML='<img class="av" src="../img/'+m[2]+'.jpg" alt="" style="width:28px;height:28px;object-fit:cover;border-radius:50%">'+esc(f);
      var sv=$('.as[data-who="tout le service"]',box);box.insertBefore(p,sv);
      p.addEventListener('click',function(){var on=box.querySelectorAll('.as.on');if(p.classList.contains('on')&&on.length===1)return;p.classList.toggle('on')})}return p}
  function svcLabel(sv,sel){var n=0;sel.forEach(function(s){n+=MEMB.filter(function(m){return m[1]===s}).length});
    sv.innerHTML=IC.users+' '+(sel.length===0?'Tout un service':sel.length===1?'Service '+esc(sel[0])+' ('+n+')':sel.length+' services ('+n+')')+' '+IC.chev;sv.classList.toggle('on',sel.length>0)}
  var MENU=null;
  function closeMenu(){if(MENU){MENU.remove();MENU=null}}
  window.addEventListener('click',function(e){var sv=e.target.closest&&e.target.closest('.as[data-who="tout le service"]');
    if(!sv){if(MENU&&!MENU.contains(e.target))closeMenu();return}stop(e);if(MENU&&MENU._sv===sv){closeMenu();return}closeMenu();
    var box=sv.parentNode,sel=sv._sel||(sv._sel=[]);MENU=document.createElement('div');MENU.className='v38-svm';MENU._sv=sv;MENU.setAttribute('role','listbox');MENU.setAttribute('aria-multiselectable','true');
    MENU.innerHTML='<b class="v38-svh">Choisir un ou plusieurs services</b>'+SERV.map(function(s){var L=MEMB.filter(function(m){return m[1]===s});
      return '<button type="button" class="v38-svo'+(sel.indexOf(s)>=0?' on':'')+'" role="option" aria-selected="'+(sel.indexOf(s)>=0)+'" data-s="'+esc(s)+'" data-h="1"><span class="v38-svk">'+IC.check+'</span><span class="grow"><b>'+esc(s)+'</b><small>'+L.length+' personne'+(L.length>1?'s':'')+'</small></span><span class="v38-svf">'+
        L.slice(0,4).map(function(m){return '<img src="../img/'+m[2]+'.jpg" alt="">'}).join('')+'</span></button>'}).join('');
    document.body.appendChild(MENU);var r=sv.getBoundingClientRect(),w=Math.min(320,innerWidth-24);MENU.style.width=w+'px';MENU.style.left=Math.max(12,Math.min(r.left,innerWidth-w-12))+'px';
    var top=r.bottom+6+scrollY;if(r.bottom+6+360>innerHeight&&r.top>380)top=r.top-6+scrollY-Math.min(360,MENU.offsetHeight);MENU.style.top=top+'px';
    MENU.addEventListener('click',function(ev){var o=ev.target.closest('.v38-svo');if(!o)return;stop(ev);var s=o.dataset.s,i=sel.indexOf(s),on=i<0;if(on)sel.push(s);else sel.splice(i,1);
      o.classList.toggle('on',on);o.setAttribute('aria-selected',on);MEMB.filter(function(m){return m[1]===s}).forEach(function(m){var p=pillFor(box,m);p.classList.toggle('on',on||sel.some(function(x){return x===m[1]}))});
      if(!$$('.as.on:not([data-who="tout le service"])',box).length){var mo=$('.as[data-who="Moi"]',box);if(mo)mo.classList.add('on')}svcLabel(sv,sel)})},true);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});
  $$('.as[data-who="tout le service"]').forEach(function(sv){sv.setAttribute('role','button');sv.tabIndex=0;svcLabel(sv,[])});

  // ================= 3. carte de pied admin : « Admin », sans bouclier (point 72 ter) ; fait au build (post88), ici le menu du compte
  // ================= 4. facturation (points 69 à 71) : formule Team, Yelema Plus en option, moyens de paiement retirables
  var MK='v38-moy';
  function moyens(){try{var a=JSON.parse(ls(MK)||'null');if(Array.isArray(a))return a}catch(_){}return [{n:'Wave',d:'+225 07 •• •• 12',def:1},{n:'Carte bancaire',d:'Visa •••• 4242'}]}
  function moySet(a){ls(MK,JSON.stringify(a))}
  function defMoyen(){var a=moyens(),d=a.filter(function(x){return x.def})[0]||a[0];return d?d.n+', '+d.d:'Aucun moyen enregistré'}
  if(page==='admin-facturation'){
    // point 99 : un seul bandeau, formule + prochaine facture, sans offre Yelema Plus
    var x3=$('.fx3');if(x3&&!$('.v38-fxb',x3)){x3.classList.add('v38-fxb');x3.innerHTML='<div class="v38-fxbi"><small>Formule</small><b>Team</b><span>6 Experts en service, jusqu’à 50 membres</span></div>'+
      '<div class="v38-fxbi"><small>Prochaine facture</small><b class="num">1 300 000 FCFA</b><span>le 01/11/2026, '+esc(defMoyen())+'</span></div>'+
      '<button type="button" class="btn p v38-paynow" data-h="1">'+IC.card+' Payer maintenant</button>'}
    $$('.sform p').forEach(function(p){if(/est en pause\s:\selle n.est pas factur/.test(p.textContent))p.remove()});
    var pay=$('#payer');if(pay&&!$('#v38-moyens')){var S=document.createElement('section');S.className='box v38-moys';S.id='v38-moyens';pay.parentNode.parentNode.insertBefore(S,pay.parentNode.nextSibling);
      var LOGO={'Wave':'<img src="https://www.google.com/s2/favicons?sz=64&domain=wave.com" alt="">','Carte bancaire':IC.card,'Orange Money':'<b>OM</b>','MTN MoMo':'<b>MTN</b>','Moov Money':'<b>moov</b>','Djamo':'<b>djamo</b>'};
      var COL={'Wave':'#1DC8F2','Carte bancaire':'#1A1F71','Orange Money':'#FF7900','MTN MoMo':'#FFCB05','Moov Money':'#0B4EA2','Djamo':'#111111'};
      function draw(){var a=moyens();S.innerHTML='<div class="ch"><h2>Moyens de paiement enregistrés</h2><button type="button" class="btn o sm v38-madd" data-h="1">'+IC.plus+' Ajouter</button></div><div class="v38-ml">'+
        (a.length?a.map(function(m,i){return '<div class="v38-mc'+(m.def?' def':'')+'"><span class="pyl" style="--pc:'+(COL[m.n]||'#5B5BD6')+'">'+(LOGO[m.n]||IC.card)+'</span><span class="grow"><b>'+esc(m.n)+'</b><small>'+esc(m.d)+'</small></span>'+
          (m.def?'<span class="v38-mdef">'+IC.check+' Par défaut</span>':'')+'<div class="v38-mm"><button type="button" class="v38-mb" data-h="1" data-i="'+i+'" aria-label="Actions pour '+esc(m.n)+'" aria-haspopup="menu">'+IC.more+'</button></div></div>'}).join(''):
          '<p class="xs mute3">Aucun moyen enregistré. Ajoutez-en un pour payer en un clic.</p>')+'</div>'}
      draw();
      S.addEventListener('click',function(e){var b=e.target.closest('.v38-mb'),it=e.target.closest('.v38-mi'),ad=e.target.closest('.v38-madd');
        if(ad){stop(e);var a=moyens(),opt=['Orange Money','MTN MoMo','Moov Money','Djamo','Wave','Carte bancaire'].filter(function(n){return !a.some(function(m){return m.n===n})});
          if(!opt.length){say('Tous les moyens sont déjà enregistrés','info');return}
          V.modal({ic:IC.card,tone:'info',t:'Ajouter un moyen de paiement',p:'Choisissez le moyen, vous le validerez au premier paiement.',body:'<div class="v38-mopt">'+opt.map(function(n,i){return '<label class="v38-mo"><input type="radio" name="v38mo" value="'+esc(n)+'"'+(i?'':' checked')+'><span class="pyl" style="--pc:'+(COL[n]||'#5B5BD6')+'">'+(LOGO[n]||IC.card)+'</span><b>'+esc(n)+'</b></label>'}).join('')+'</div>',
            a:{l:'Ajouter',fn:function(){var v=$('#v36-m input[name=v38mo]:checked'),a2=moyens();if(v){a2.push({n:v.value,d:v.value==='Carte bancaire'?'Visa •••• 0000':'+225 07 •• •• 00',def:a2.length?0:1});moySet(a2);draw();say(v.value+' ajouté','ok')}V.close()}},b:{l:'Annuler'}});return}
        if(b){stop(e);var o=$('.v38-mmu',S);if(o){var same=o._i===b.dataset.i;o.remove();if(same)return}var a=moyens(),m=a[+b.dataset.i],u=document.createElement('div');u.className='v38-mmu';u._i=b.dataset.i;u.setAttribute('role','menu');
          u.innerHTML=(m.def?'':'<button type="button" class="v38-mi" role="menuitem" data-a="def" data-i="'+b.dataset.i+'" data-h="1">'+IC.star+' Définir par défaut</button>')+
            '<button type="button" class="v38-mi ko" role="menuitem" data-a="rm" data-i="'+b.dataset.i+'" data-h="1">'+IC.trash+' Retirer</button>';b.parentNode.appendChild(u);return}
        if(it){stop(e);var a=moyens(),i=+it.dataset.i,m=a[i];var u2=$('.v38-mmu',S);if(u2)u2.remove();
          if(it.dataset.a==='def'){a.forEach(function(x,j){x.def=j===i?1:0});moySet(a);draw();say(m.n+' est maintenant le moyen par défaut','ok');return}
          if(m.def&&a.length===1){V.modal({ic:IC.card,tone:'warn',t:'Ce moyen ne peut pas être retiré',p:'C’est votre seul moyen de paiement. Ajoutez-en un autre, puis retirez celui-ci.',b:{l:'Fermer'}});return}
          V.modal({ic:IC.trash,tone:'warn',t:'Retirer '+m.n+' ?',p:m.n+' ('+m.d+') ne servira plus aux paiements.'+(m.def?' Le moyen suivant devient celui par défaut.':''),
            a:{l:'Retirer',fn:function(){var a2=moyens();a2.splice(i,1);if(m.def&&a2.length)a2[0].def=1;moySet(a2);draw();V.close();say(m.n+' retiré','ok')}},b:{l:'Annuler'}});return}
        var o2=$('.v38-mmu',S);if(o2)o2.remove()});
      document.addEventListener('click',function(e){var o=$('.v38-mmu',S);if(o&&!e.target.closest('.v38-mm'))o.remove()})}}

  // ================= 5. Yélé animé (points 80, 91) : WebP animé transparent, lu par tous les navigateurs (iPhone compris)
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  // point 104 b : dans « Besoin d’aide ? », les trois billes de Myriel qui s’interchangent doucement ; le visage WebP reste dans le panneau
  // point 109 c : comme chez Myriel, la bulle montre Yélé animé (même animation, ici en WebP animé transparent, lu par Safari iPhone) sur fond blanc
  function orbs(){$$('.ybtn svg.yele').forEach(function(s){if(s._v38)return;s._v38=1;var w=document.createElement('img');w.className='v39-yb';w.alt='';w.setAttribute('aria-hidden','true');w.decoding='async';w.src='../img/yele/yele_smile.webp';s.parentNode.insertBefore(w,s);s.style.display='none';
    var b=w.closest('.ybtn');if(b&&!b._v39){b._v39=1;b.addEventListener('mouseenter',function(){w.src='../img/yele/yele_laugh.webp'});b.addEventListener('mouseleave',function(){w.src='../img/yele/yele_smile.webp'})}})}
  orbs();
  function yele(){$$('svg.yele').forEach(function(s){if(s._v38)return;s._v38=1;var w=document.createElement('span');w.className='v38-yw ok'+(s.classList.contains('big')?' big':'');
      var im=document.createElement('img');im.className='v38-yv';im.alt='';im.setAttribute('aria-hidden','true');im.decoding='async';im.src='../img/yele/yele_smile.webp';
      s.parentNode.insertBefore(w,s);w.appendChild(s);w.appendChild(im);s.style.display='none'})}
  var LT=0;function laugh(){if(RM)return;clearTimeout(LT);$$('#yele .v38-yv').forEach(function(im){im.src='../img/yele/yele_laugh.webp'});
    LT=setTimeout(function(){$$('#yele .v38-yv').forEach(function(im){im.src='../img/yele/yele_smile.webp'})},4000)}
  V.yeleLaugh=laugh;
  yele();
  var YP=$('#yele');if(YP)new MutationObserver(function(){if(YP.classList.contains('on'))laugh()}).observe(YP,{attributes:true,attributeFilter:['class']});

  // ================= 6. catalogue des états : tout « Déclencher » que rien n'a pris en charge montre un état réel (spinner puis confirmation)
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.v36-go');if(!b||b._v38b)return;e.preventDefault();
    var card=b.closest('div'),t=card&&card.querySelector('b,h3'),nm=t?t.textContent.trim():'Routine';b._v38b=1;
    if(V.busy)V.busy(b,'Lancement…');else{b.disabled=true;b.textContent='Lancement…'}
    setTimeout(function(){if(V.unbusy)V.unbusy(b);else{b.disabled=false;b.textContent='Déclencher'}b._v38b=0;say((nm==='Routine'?'Routine lancée':nm+' : déclenché'),'ok')},900)});
  // copie sûre dans le presse-papiers (jamais de promesse rejetée non gérée)
  V.copy=function(t){function fb(){try{var a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();document.execCommand('copy');a.remove()}catch(_){}}
    try{var p=navigator.clipboard&&navigator.clipboard.writeText(t);if(p&&p.catch)p.catch(fb);else fb()}catch(_){fb()}};

  // ================= 7. accueil (points 81, 81 bis, 87) : date du jour, barre de demande qui se range en dock, cartes Mon équipe
  (function(){var d=$('.hello .date');if(d&&$('.v38-team')){try{var t=new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});d.textContent=t.charAt(0).toUpperCase()+t.slice(1)}catch(_){}}
    var ask=$('.v38-ask'),dock=$('.dock');
    if(ask&&dock){document.body.classList.add('v38-hasask');
      if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(e){document.body.classList.toggle('v38-dkon',!e.isIntersecting&&e.boundingClientRect.top<0)})},{threshold:0}).observe(ask)}
    var team=$('.v38-team');if(!team)return;
    var EX={admin:['djeneba','fatima','koffi'],membre:['fatima','koffi'],membre0:[]}[VUE]||['djeneba','fatima','koffi'];
    var n=0;$$('.v38-tc[data-x]',team).forEach(function(c){var on=EX.indexOf(c.dataset.x)>-1;c.hidden=!on;if(on)n++});
    var cnt=$('.v38-cnt');if(cnt)cnt.textContent='('+n+')';
    if(ask){$$('.who img',ask).forEach(function(im){var k=(im.getAttribute('src')||'').split('/').pop().replace('.jpg','');im.hidden=EX.indexOf(k)<0});if(!n)ask.hidden=true}
  })();

  // ================= 8. menu du compte (points 83, 95) : deux comptes de démo, plus d'outils de test, Contacter Yélé, Apparence en vignettes
  (function(){var mx=$$('#modes .mdx');
    var SW={yelema:['#301667','#8D68FA','#E4765A'],client:['#E00040','#F8B400','#5A1022']};
    var th=mx.map(function(a){var cl=/\/client\//.test(a.getAttribute('href'));return '<a class="v38-tile v38-tht'+(a.classList.contains('on')?' on':'')+'" href="'+a.getAttribute('href')+'" data-h="1"><span class="v38-sws">'+SW[cl?'client':'yelema'].map(function(c){return '<i style="background:'+c+'"></i>'}).join('')+'</span><span>'+(cl?'Entreprise':'Yelema')+'</span></a>'}).join('');
    var ap=[['clair','Clair'],['sombre','Sombre'],['auto','Auto']].map(function(x){return '<a class="v38-tile" href="#" data-ap="'+x[0]+'" data-h="1"><span class="v38-prv '+x[0]+'"><i></i><i></i><i></i></span><span>'+x[1]+'</span></a>'}).join('');
    var html='<div class="v38-apx"><p class="v38-aph">'+svg('<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>')+' Apparence</p>'+
      '<div class="v38-seg apseg v38-aps">'+ap+'</div>'+(th?'<div class="v38-seg v38-th">'+th+'</div>':'')+'</div>';
    function put(m,before){if($('.v38-apx',m))return;var d=document.createElement('div');d.innerHTML=html;var x=d.firstChild;if(before)m.insertBefore(x,before);else m.appendChild(x)}
    function clean(m){$$('[data-v33v="membre0"], .v33-pz, .v35-lz, .v36-sim',m).forEach(function(x){x.remove()});
      // point 112 c : une seule entrée « Changer de compte », vers l'autre compte de la démo (membre Nadège <-> admin Aïcha)
      var l=$('.v33-vwl',m);if(l)l.remove();
      var oth=VUE==='admin'?'membre':'admin';
      $$('.v33-vw',m).forEach(function(a){if(a.closest('.v33-demo'))return;var k=a.dataset.v33v;if(k!==oth){a.remove();return}
        var im=k==='admin'?'aicha':'m_women_36',t=k==='admin'?'Aïcha Diabaté, Admin':'Nadège Touré, Membre';
        a.innerHTML=svg('<path d="M16 3h5v5"/><path d="M21 3l-7 7"/><path d="M8 21H3v-5"/><path d="M3 21l7-7"/>')+'<span class="grow"><b>Changer de compte</b><small><img src="../img/'+im+'.jpg" alt="">'+t+'</small></span>';a.classList.add('v38-acc','v39-chg')});
      $$('[data-yele]',m).forEach(function(a){a.innerHTML='<img class="v38-yf" src="../img/yele/yele_smile.webp" alt=""> Contacter Yélé'})}
    $$('.acm').forEach(function(m){clean(m);$$('.acx[href="profil.html"], .acx[href="notifications.html"], .acx[href^="admin-membres"]:not(.v33-vw)',m).forEach(function(a){if(!a.querySelector('.adav'))a.remove()});put(m,$('.acsep',m))});
    $$('#sh-moi .mspn').forEach(function(m){clean(m);put(m,$('.msi[href^="connexion"]',m)||$('.pby',m))});
    var cur;try{cur=localStorage.getItem('yap')||'clair'}catch(_){cur='clair'}
    $$('.v38-aps a').forEach(function(a){a.classList.toggle('on',a.dataset.ap===cur)});
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.v38-aps a');if(!a)return;e.preventDefault();e.stopPropagation();
      var o=$('#eclair .apo[data-ap="'+a.dataset.ap+'"]');if(o)o.click();$$('.v38-aps a').forEach(function(x){x.classList.toggle('on',x.dataset.ap===a.dataset.ap)})},true);
    document.documentElement.classList.add('v38-noap');
    // connexion : deux comptes de démo, Aïcha (admin) ou Nadège (membre)
    var LF=$('[data-login]');if(LF)window.addEventListener('submit',function(e){if(e.target!==LF)return;var em=($('input[type=email]',LF)||{}).value||'';em=em.trim().toLowerCase();
      if(/^nadege\.toure@unifood\.info$/.test(em))ls('v33-vue','membre');else if(/^aicha\.diabate@unifood\.info$/.test(em))ls('v33-vue','admin')},true)})();

  // ================= 9. menu latéral (point 84) : statut mot + forme sous le prénom de chaque expert
  $$('.sb a.mt').forEach(function(a){var i=$('.p i',a),sm=$('small',a);if(!i||!sm||a._v38)return;a._v38=1;var w=!i.classList.contains('idle')||/djeneba\.html/.test(a.getAttribute('href')||'');if(w)i.classList.remove('idle');
    sm.className='ell v38-mst '+(w?'work':'ok');sm.innerHTML=(w?svg('<path d="M21 12a9 9 0 1 1-6.219-8.56"/>'):IC.ok)+(w?' Au travail':' Disponible')});

  // ================= 10. page d'un expert (point 82) : un seul fil d'Ariane, Appeler en secondaire, Écrire en principal,
  //                      même activité en cours partout (en-tête, En ce moment, ligne « écrit… », Son ordinateur)
  (function(){var pc=$('.xcol .pcard');if(!pc)return;var k=page,NOM={djeneba:'Djénéba',fatima:'Fatima',koffi:'Koffi'}[k];if(!NOM)return;
    var ACT={fatima:{t:'rédige les 3 posts de la promo Sossa',p:60,r:'encore 10 min'},djeneba:{t:'prépare le point du jour de demain',p:60,r:'encore 15 min'}}[k];
    var st=$('.st',pc);if(st){st.className='st v38-pst '+(ACT?'work':'ok');st.innerHTML=(ACT?svg('<path d="M21 12a9 9 0 1 1-6.219-8.56"/>'):IC.ok)+(ACT?' Au travail':' Disponible')}
    var cta=$('.cta',pc),call=$('.call',pc);
    if(cta&&!$('.v38-wr2',cta)){var w=document.createElement('a');w.href='#discussion';w.className='v38-wr2';w.dataset.h='1';w.innerHTML=svg('<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>')+' Écrire';cta.insertBefore(w,cta.firstChild);
      w.addEventListener('click',function(e){e.preventDefault();var d=$('.xnav [data-t="discussion"]');if(d&&!d.classList.contains('on'))d.click();
        setTimeout(function(){var t=$('#discussion .comp textarea, #discussion .comp input[type=text], #discussion .comp [contenteditable]');if(t){t.focus();return}var ph=$('#discussion .comp .ph');if(ph)ph.click()},120)})}
    if(call)call.classList.add('v38-call2');
    if(!ACT)return;
    var full=NOM+' '+ACT.t+', '+ACT.p+' %, '+ACT.r;
    var nm=$('.nm',pc);if(nm&&!$('.v38-pact',pc)){var a=document.createElement('div');a.className='v38-pact';a.innerHTML='<span class="ell">'+esc(ACT.t.charAt(0).toUpperCase()+ACT.t.slice(1))+'</span><span class="v38-pbar"><i style="width:'+ACT.p+'%"></i></span><small>'+ACT.p+' %, '+ACT.r+'</small>';nm.appendChild(a)}
    $$('#discussion .rail .lvnow .lvtt').forEach(function(t){if($('.v38-lvp',t.parentNode))return;var x=document.createElement('span');x.className='v38-lvp';x.innerHTML='<span class="v38-pbar"><i style="width:'+ACT.p+'%"></i></span>'+ACT.p+' %, '+ACT.r;t.parentNode.insertBefore(x,t.nextSibling)});
    $$('#discussion .thread .typing').forEach(function(t){var tm=t.parentNode.querySelector('time');if(tm)tm.textContent=full});
    $$('#discussion .rail .doing').forEach(function(d){var dot=$('.dot',d);d.textContent=' '+full;if(dot)d.insertBefore(dot,d.firstChild)})})();

  // ================= 11. tableaux de bord (point 89) : liste des tableaux en colonne repliable, état retenu
  (function(){var x=$('.tbx'),r=x&&$('.tbrail',x);if(!r)return;
    var C='<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',CL=svg(C+'<path d="m16 15-3-3 3-3"/>'),OP=svg(C+'<path d="m14 9 3 3-3 3"/>');
    var b=document.createElement('button');b.type='button';b.className='v38-tbt';b.dataset.h='1';r.insertBefore(b,r.firstChild);
    function set(m){document.documentElement.classList.toggle('v38-tbmini',m);b.innerHTML=m?OP:CL;var l=m?'Afficher la liste des tableaux':'Masquer la liste des tableaux';b.setAttribute('aria-label',l);b.title=l;b.setAttribute('aria-expanded',m?'false':'true')}
    set(ls('v38-tbr')==='1');
    b.addEventListener('click',function(e){stop(e);var m=!document.documentElement.classList.contains('v38-tbmini');ls('v38-tbr',m?'1':'0');set(m);try{window.dispatchEvent(new Event('resize'))}catch(_){}});
    $$('.tbli a[data-t]',r).forEach(function(a){var t=$('b',a);if(t&&!a.title)a.title=t.textContent})})();

  // ================= 12. période « Personnalisée » (point 90) : calendrier Du / Au partagé par tous les filtres à dates
  (function(){$$('.tdper, .an-per').forEach(function(sg){if($('.v38-pers',sg))return;var box=sg.closest('.fdp')||sg.parentNode,rb=$('.anr .rngb',box);if(!rb)return;
      var a=document.createElement('a');a.className='v38-pers';a.dataset.per='perso';a.dataset.h='1';a.textContent='Personnalisée';sg.appendChild(a);
      var anr=rb.closest('.anr');anr.classList.add('v38-anrh');var h=box.querySelector('.fdh');if(h)h.hidden=true;
      a.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();rb.click();
        setTimeout(function(){var g=$('.rgc.on');if(!g||innerWidth<=760)return;var rc=a.getBoundingClientRect(),w=g.offsetWidth,hh=g.offsetHeight;
          g.style.left=Math.max(12,Math.min(rc.left,innerWidth-w-12))+'px';g.style.top=(rc.bottom+hh+12<innerHeight?rc.bottom+8:Math.max(12,rc.top-hh-8))+'px'},0)});
      $$('a',sg).forEach(function(o){if(o!==a)o.addEventListener('click',function(){a.classList.remove('on')})})});
    document.addEventListener('change',function(e){var i=e.target;if(!i.matches||!i.matches('.v38-anrh input[type=date]'))return;var anr=i.closest('.anr'),box=anr.closest('.fdp')||anr.parentNode,sg=$('.tdper, .an-per',box),
        lab=($('.rngb span',anr)||{}).textContent||'';if(!sg)return;
      $$('a',sg).forEach(function(o){o.classList.toggle('on',o.classList.contains('v38-pers'))});
      var d=anr.closest('.fdd');if(d){var l=$('.fdl',d);if(l)l.textContent=lab;d.classList.add('on');setTimeout(function(){d.removeAttribute('open')},0)}
      var pn=anr.closest('.panel')||document;$$('.mw, .v36-an, .an-k',pn).forEach(function(w){w.classList.remove('v38-rcl');void w.offsetWidth;w.classList.add('v38-rcl')});
      say('Période du '+lab+' : les blocs sont recalculés','ok')});})();

  // ================= 13. tableau de Djénéba (point 85) : cartes à onglets, une action par ligne envoyée à Djénéba
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-v38tab]');if(t){stop(e);var w=t.closest('.v38-mw'),i=+t.dataset.v38tab;
      $$('[data-v38tab]',w).forEach(function(x){var on=x===t;x.classList.toggle('on',on);x.setAttribute('aria-selected',on?'true':'false')});$$('.v38-tp',w).forEach(function(p,j){p.hidden=j!==i;p.classList.toggle('on',j===i)});return}
    var a=e.target.closest&&e.target.closest('[data-v38do]');if(!a)return;stop(e);if(a._v38d)return;a._v38d=1;
    if(V.busy)V.busy(a,'Envoi…');setTimeout(function(){if(V.unbusy)V.unbusy(a);a.classList.add('done');a.innerHTML=IC.check+' Demandé à Djénéba';say('Djénéba s’en occupe : '+a.dataset.v38do.charAt(0).toLowerCase()+a.dataset.v38do.slice(1)+'. Elle vous confirme dans la discussion.','ok')},700)},true);

  // ================= 14. Analytique de l'expert (point 49) : une icône par carte, plus de carte « Documents », Conversations et Messages définis
  (function(){var A=$('#analytique');if(!A)return;
    var M={'Temps de travail moyen':'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>','Temps de travail total':'<path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',
      'Temps gagné estimé':'<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>','Délai moyen de réponse':'<path d="M10 2h4M12 14l3-3"/><circle cx="12" cy="14" r="8"/>',
      'Conversations':'<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>','Messages':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
      'Appels':'<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
      'Emails':'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>','Compétences utilisées':'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
      'Routines actives':'<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>','Livrables':'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>'};
    var SUB={'Conversations':'fils de discussion ouverts, web et Telegram','Messages':'messages échangés dans ces conversations'};
    $$('.an-k, .v36-k',A).forEach(function(k){var sp=k.querySelector(':scope>span');if(!sp)return;var l=sp.textContent.trim();
      if(l==='Documents'){k.remove();return}if(M[l]&&!$('svg',k)&&!$('.v38-kic',k)){var i=document.createElement('span');i.className='v38-kic';i.innerHTML=svg(M[l]);k.insertBefore(i,k.firstChild)}
      if(SUB[l]){var sm=k.querySelector(':scope>small');if(sm)sm.textContent=SUB[l]}})})();

  // ================= 15. Nouveau rendez-vous (point 51) : commentaire, invités membres ou adresses email
  (function(){var mm=$('#v33-meet');if(!mm||$('.v38-gw',mm))return;var inv=$('.v33-mi',mm),vis=$('.v33-vis',mm);if(!inv||!vis)return;
    var P=[['Aïcha Diabaté','aicha'],['Nadège Touré','m_women_36'],['Yao Kra','m_men_53'],['Serge Bamba','m_men_80'],['Fanta Bakayoko','m_women_16'],['Jean-Marc Aka','m_men_83'],['Kader Ouattara','m_men_59'],['Mariam Koné','m_women_44']];
    var w=document.createElement('div');w.className='v38-gw';w.innerHTML='<div class="v38-gps"></div><div class="v38-gin"><input type="text" class="fi" placeholder="Ajouter un membre ou une adresse email" aria-label="Ajouter un invité" autocomplete="off"><div class="v38-gsg" role="listbox" hidden></div></div><small class="v38-gh">Les invités hors de l’espace reçoivent l’invitation par email.</small>';
    inv.parentNode.appendChild(w);var cm=document.createElement('label');cm.className='fl2 v38-cm';cm.innerHTML='<span>Commentaire <small class="mute3">facultatif</small></span><textarea class="fi" rows="3" placeholder="Ex. : ordre du jour, lien du document"></textarea>';vis.closest('.fl2').parentNode.insertBefore(cm,vis.closest('.fl2'));
    var inp=$('input',w),sg=$('.v38-gsg',w),ps=$('.v38-gps',w);
    function pill(n,img,mail){if($$('.v38-gp',ps).some(function(x){return x.dataset.v===n}))return;var p=document.createElement('span');p.className='v38-gp'+(mail?' mail':'');p.dataset.v=n;
      p.innerHTML=(mail?svg('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'):'<img src="../img/'+img+'.jpg" alt="">')+'<span>'+esc(n)+'</span><button type="button" data-h="1" aria-label="Retirer '+esc(n)+'">'+IC.x+'</button>';ps.appendChild(p)}
    function sug(){var q=inp.value.trim().toLowerCase();var L=P.filter(function(x){return !q||x[0].toLowerCase().indexOf(q)>-1}).slice(0,5);
      var h=L.map(function(x){return '<button type="button" role="option" data-h="1" data-n="'+esc(x[0])+'" data-i="'+x[1]+'"><img src="../img/'+x[1]+'.jpg" alt="">'+esc(x[0])+'</button>'}).join('');
      if(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(q))h='<button type="button" role="option" data-h="1" data-m="'+esc(inp.value.trim())+'">'+svg('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>')+'Inviter '+esc(inp.value.trim())+'</button>'+h;
      sg.innerHTML=h;sg.hidden=!h}
    inp.addEventListener('focus',sug);inp.addEventListener('input',sug);
    inp.addEventListener('keydown',function(e){if(e.key!=='Enter')return;e.preventDefault();var v=inp.value.trim();if(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)){pill(v,null,1);inp.value='';sg.hidden=true}else if(v)say('Adresse email incomplète : '+v,'warn')});
    sg.addEventListener('mousedown',function(e){e.preventDefault()});
    sg.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;stop(e);if(b.dataset.m)pill(b.dataset.m,null,1);else pill(b.dataset.n,b.dataset.i);inp.value='';sg.hidden=true;inp.focus()});
    inp.addEventListener('blur',function(){setTimeout(function(){sg.hidden=true},120)});
    ps.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;stop(e);b.closest('.v38-gp').remove()});
    var ok=$('.v33-mok',mm);if(ok)ok.addEventListener('click',function(){var ext=$$('.v38-gp.mail',ps).length;if(ext)setTimeout(function(){say(ext+' invitation'+(ext>1?'s envoyées':' envoyée')+' par email','ok')},900);
      setTimeout(function(){ps.innerHTML='';$('textarea',cm).value=''},400)})})();

  // ================= 16. appel avec un expert (points 37, 117, 125 a, 129 1A et 2A) : sonnerie WebAudio (2 sonneries puis l'expert décroche),
  //   vignette « Vous » en haut à droite, Réduire (bouton en haut à gauche, Échap) = mini fenêtre flottante qui suit sur toutes les pages
  //   (sessionStorage v44-call), Revenir à l'appel, raccrocher. Le résumé arrive dans la discussion de l'expert.
  (function(){var EXP={djeneba:['Djénéba','Chief of Staff',1,'Bonjour Aïcha. Point du jour : deux rendez-vous ce matin, le brief Banque Atlantique est prêt, et le devis de la machine d’emballage est toujours bloqué chez Serge.','C’est noté. Je relance Serge maintenant et je vous mets la réponse dans notre discussion avant midi.'],
      fatima:['Fatima','Marketing et contenu',1,'Bonjour Aïcha. Les trois posts de la promo Sossa sont presque prêts. Le post Facebook a déjà 1 200 vues, je finis la version Instagram.','Très bien. Je mets le prix en plus gros sur les trois visuels et je vous les envoie pour validation dans dix minutes.'],
      koffi:['Koffi','Design et marque',0,'Bonjour Aïcha. Le packaging Super Mint v2 est livré. Je prépare maintenant les déclinaisons pour les affiches A2 de la rentrée.','D’accord. Je vous propose deux pistes de couleur d’ici ce soir, dans la charte Super Mint.']};
    var USR='Parfait. Tu peux me l’envoyer dès que c’est prêt ?';
    var SK='v44-call',RINGS=2,ON=1200,OFF=1400;
    var ov,mini,tm=[],tick,t0=0,muted=false,hp=true,st0='',AC=null,GAIN=null;
    function T(f,ms){tm.push(setTimeout(f,ms))}
    function clear(){tm.forEach(clearTimeout);tm=[];clearInterval(tick)}
    function ss(v){try{if(v===undefined)return JSON.parse(sessionStorage.getItem(SK)||'null');if(v===null)sessionStorage.removeItem(SK);else sessionStorage.setItem(SK,JSON.stringify(v))}catch(e){return null}}
    function save(){if(!ov||!ov.dataset.k)return;ss({k:ov.dataset.k,t0:t0,muted:muted,hp:hp})}
    var I_MIC=svg('<path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>'),
        I_MICX=svg('<path d="M12 19v3"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M16.95 16.95A7 7 0 0 1 5 12v-2"/><path d="M18.89 13.23A7 7 0 0 0 19 12v-2"/><path d="m2 2 20 20"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/>'),
        I_END=svg('<path d="M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473"/><path d="m22 2-20 20"/>'),
        I_MIN=svg('<path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/>'),
        I_MAX=svg('<path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/>');
    // --- son : tonalité de retour d'appel (440 Hz), générée en WebAudio, aucun fichier
    function audio(){try{if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();GAIN=AC.createGain();GAIN.connect(AC.destination)}if(AC.state==='suspended')AC.resume();GAIN.gain.value=hp?1:0;return AC}catch(e){return null}}
    function tone(f,at,dur,vol){var a=audio();if(!a)return;try{var o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=f;o.connect(g);g.connect(GAIN);
      var s=a.currentTime+at/1000,d=dur/1000;g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(vol,s+.03);g.gain.setValueAtTime(vol,s+d-.05);g.gain.linearRampToValueAtTime(0,s+d);o.start(s);o.stop(s+d+.02);(ov._osc=ov._osc||[]).push(o)}catch(e){}}
    function hush(){if(ov&&ov._osc){ov._osc.forEach(function(o){try{o.stop()}catch(e){}});ov._osc=[]}}
    function ring(){for(var i=0;i<RINGS;i++){tone(440,i*(ON+OFF),ON,.16);tone(480,i*(ON+OFF),ON,.08)}}
    function chime(up){tone(up?660:520,0,140,.12);tone(up?880:390,150,180,.12)}
    function lab(st){var x=EXP[ov.dataset.k];return {ring:'Appel en cours…',talk:x[0]+' parle…',listen:x[0]+' vous écoute',user:x[0]+' vous écoute',think:x[0]+' réfléchit…'}[st]||''}
    function mlab(st){return {ring:'Appel en cours…',talk:'parle…',listen:'vous écoute',user:'vous écoute',think:'réfléchit…'}[st]||''}
    function state(st,l){st0=st;ov.classList.remove('ring','talk','listen','think','user');if(st)ov.classList.add(st);$('.v38-cl',ov).textContent=l||lab(st);
      var v=$('.v38-cv',ov);if(st==='talk'&&!RM&&ov.classList.contains('on')){var p=v.play();if(p&&p.catch)p.catch(function(){})}else{try{v.pause()}catch(_){}}
      if(mini){mini.className='v44-mini '+(mini.classList.contains('on')?'on ':'')+st+(mini.classList.contains('v44-mtop')?' v44-mtop':'');$('.v44-mst b',mini).textContent=mlab(st)}}
    function say2(txt,who,ms){var p=$('.v38-csub p',ov),w=txt.split(' '),i=0,step=Math.max(60,Math.floor(ms/w.length));p.innerHTML=(who?'<b>'+who+' : </b>':'')+'<span></span>';var sp=$('span',p);
      (function n(){if(i>=w.length)return;sp.textContent+=(i?' ':'')+w[i++];T(n,step)})()}
    function clock(){var el=$('.v38-ctm',ov),me=mini&&$('.v44-mtm',mini);if(!t0){el.textContent='';if(me)me.textContent='';return}var s2=Math.floor((Date.now()-t0)/1000),t=('0'+Math.floor(s2/60)).slice(-2)+':'+('0'+s2%60).slice(-2);el.textContent=t;if(me)me.textContent=t}
    function build(k){var x=EXP[k];if(!ov){ov=document.createElement('div');ov.className='v38-call';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');document.body.appendChild(ov)}
      ov.setAttribute('aria-label','Appel avec '+x[0]);ov.dataset.k=k;
      ov.innerHTML='<div class="v38-chd"><button type="button" class="v44-cmin" data-h="1" aria-label="Réduire l’appel (Échap)">'+I_MIN+'<span>Réduire</span></button><div class="grow"><b>'+x[0]+'</b><span>'+x[1]+'</span></div><span class="v38-ctm num"></span></div>'+
        '<div class="v38-cst"><div class="v38-cfig"><span class="v38-halo" aria-hidden="true"></span><video class="v38-cv" muted playsinline loop preload="auto" poster="../img/vid/'+k+'.webp" src="../img/vid/'+k+'.mp4" aria-hidden="true"></video></div>'+
        '<div class="v38-cstate" aria-live="polite"><span class="v40-cdot" aria-hidden="true"></span><span class="v44-rg" aria-hidden="true"><i></i><i></i><i></i></span><span class="v38-wv" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="v40-cthk" aria-hidden="true"><i></i><i></i><i></i></span><b class="v38-cl"></b></div>'+
        '<div class="v38-csub"><p></p><button type="button" class="v38-cst2" data-h="1">Masquer les sous-titres</button></div></div>'+
        '<div class="v38-me v44-me"><img src="../img/'+(ME.p||'aicha')+'.jpg" alt=""><span class="v44-mef"><span class="v44-mmic">'+I_MIC+'</span><small>Vous</small><span class="v44-mwv" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></span></div>'+
        '<div class="v38-cbs"><button type="button" class="v38-cb" data-c="mic" data-h="1" aria-label="Couper le micro" aria-pressed="false">'+I_MIC+'</button>'+
        '<button type="button" class="v38-cb" data-c="hp" data-h="1" aria-label="Haut-parleur" aria-pressed="true">'+svg('<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/>')+'</button>'+
        '<button type="button" class="v38-cb" data-c="scr" data-h="1" aria-label="Voir son écran">'+svg('<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>')+'</button>'+
        '<button type="button" class="v38-cb end" data-c="end" data-h="1" aria-label="Raccrocher">'+I_END+'</button></div>';
      ov._osc=[];return x}
    function setMute(m){muted=m;ov.classList.toggle('muted',m);var c=$('.v38-cb[data-c="mic"]',ov);if(c){c.classList.toggle('off',m);c.setAttribute('aria-pressed',m?'true':'false');c.setAttribute('aria-label',m?'Activer le micro':'Couper le micro');c.innerHTML=m?I_MICX:I_MIC}
      $('.v44-mmic',ov).innerHTML=m?I_MICX:I_MIC;if(mini){var b=$('.v44-mmc',mini);b.classList.toggle('off',m);b.innerHTML=m?I_MICX:I_MIC;b.setAttribute('aria-label',m?'Activer le micro':'Couper le micro');b.setAttribute('aria-pressed',m?'true':'false')}save()}
    // déroulé de la démo une fois décroché (écoute, réfléchit, parle) ; first = premier échange avec sous-titres
    function talk(first){var x=EXP[ov.dataset.k];
      if(first){T(function(){state('talk');say2(x[3],x[0],6000)},300);
        T(function(){state('listen','À vous. '+x[0]+' vous écoute')},6500);
        T(function(){state('user');say2(USR,'Vous',2200)},7700);
        T(function(){state('think')},10300);
        T(function(){state('talk');say2(x[4],x[0],5000)},11500);
        T(function(){state('listen')},16900);T(loop,19300)}else{state('listen');T(loop,1500)}
      var MORE=['Autre chose pour aujourd’hui ?','Je vous envoie le détail par écrit dans la discussion.','Je m’en occupe tout de suite.'],mi=0;
      function loop(){state('user');say2(['Merci, c’est clair.','Oui, et pour demain ?','D’accord, vas-y.'][mi%3],'Vous',2000);
        T(function(){state('think')},3600);
        T(function(){state('talk');say2(MORE[mi++%3],x[0],3200)},6400);
        T(function(){state('listen')},10200);T(loop,13000)}}
    function connect(first){t0=t0||Date.now();save();clock();tick=setInterval(clock,1000);if(first)chime(true);talk(first)}
    function show(){ov.classList.add('on');document.body.classList.add('v38-incall');document.body.classList.remove('v44-mini-on');if(mini)mini.classList.remove('on');
      if(st0==='talk')state('talk');var e=$('.v38-cb[data-c="end"]',ov);try{e.focus()}catch(_){}}
    function open(k){var cur=ss();if(ov&&ov.dataset.k&&(ov.classList.contains('on')||(mini&&mini.classList.contains('on')))){if(ov.dataset.k!==k)say('Vous êtes déjà en appel avec '+EXP[ov.dataset.k][0]+'. Raccrochez d’abord pour appeler '+EXP[k][0]+'.','info');show();return true}
      var x=EXP[k];if(!x)return false;clear();build(k);t0=0;muted=false;hp=true;setMute(false);clock();show();
      // 125 a : ça sonne d'abord (2 sonneries), raccrocher reste actif ; puis l'expert décroche
      state('ring');ss({k:k,t0:0,muted:false,hp:true});audio();ring();
      T(function(){hush();connect(true)},RINGS*(ON+OFF)-OFF+400);
      return true}
    // --- 2A : mini fenêtre d'appel flottante (bas droite), suit sur toutes les pages
    function buildMini(){var x=EXP[ov.dataset.k],k=ov.dataset.k;if(!mini){mini=document.createElement('div');mini.setAttribute('role','region');document.body.appendChild(mini)}
      mini.setAttribute('aria-label','Appel en cours avec '+x[0]);
      mini.innerHTML='<div class="v44-mh"><span class="v44-mph"><img src="../img/'+k+'.jpg" alt=""></span><span class="grow"><span class="v44-mnm"><b>'+x[0]+'</b><span class="v44-mtm num"></span></span><span class="v44-mst"><span class="v44-mwv2" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><b></b></span></span></div>'+
        '<div class="v44-mb"><button type="button" class="v44-mmc" data-h="1" aria-label="Couper le micro" aria-pressed="false">'+I_MIC+'</button><button type="button" class="v44-mret" data-h="1" aria-label="Revenir à l’appel">'+I_MAX+'<span>Revenir à l’appel</span></button><button type="button" class="v44-mend" data-h="1" aria-label="Raccrocher">'+I_END+'</button></div>';
      return mini}
    function place(){if(!mini)return;mini.style.top='';mini.style.bottom='';mini.classList.remove('v44-mtop');
      // si la mini fenêtre couvre un bouton ou un champ de la page, elle monte en haut à droite (sous la barre du haut)
      var r=mini.getBoundingClientRect(),hit=false;mini.style.visibility='hidden';
      for(var y=r.top+6;y<r.bottom;y+=18)for(var xx=r.left+6;xx<r.right;xx+=18){var e=document.elementFromPoint(xx,y);if(e&&e.closest&&e.closest('button,a,input,textarea,select,[role=button],.v39-send,.v38-cmpc')&&!e.closest('.v44-mini')){hit=true;break}}
      mini.style.visibility='';if(hit&&innerWidth>760)mini.classList.add('v44-mtop')}
    function reduce(){if(!ov||!ov.dataset.k)return;buildMini();ov.classList.remove('on');document.body.classList.remove('v38-incall');document.body.classList.add('v44-mini-on');try{$('.v38-cv',ov).pause()}catch(_){}
      mini.className='v44-mini on '+st0;$('.v44-mst b',mini).textContent=mlab(st0);clock();setMute(muted);place();save()}
    function end(){if(!ov||!ov.dataset.k)return;var k=ov.dataset.k,x=EXP[k],d=$('.v38-ctm',ov).textContent,was=!!t0;clear();hush();if(was)chime(false);ss(null);t0=0;
      ov.classList.remove('on');document.body.classList.remove('v38-incall','v44-mini-on');if(mini)mini.classList.remove('on');try{$('.v38-cv',ov).pause()}catch(_){}
      ov.dataset.k='';if(!was){say('Appel annulé.','info');return}
      var th=$('#discussion .thread');var pts=k==='djeneba'?['Deux rendez-vous ce matin, brief Banque Atlantique prêt','Devis de la machine d’emballage bloqué chez Serge','Relance de Serge, réponse avant midi']:k==='fatima'?['Posts de la promo Sossa presque prêts, 1 200 vues sur Facebook','Prix en plus gros sur les trois visuels','Envoi pour validation dans dix minutes']:['Packaging Super Mint v2 livré','Déclinaisons pour les affiches A2','Deux pistes de couleur d’ici ce soir'];
      var html='<div class="bub v38-csum"><b>Résumé de l’appel, '+d+'</b><ul>'+pts.map(function(p){return '<li>'+esc(p)+'</li>'}).join('')+'</ul><span class="v38-cact">'+IC.check+' Action créée : '+esc(pts[2])+'</span></div><time>à l’instant</time>';
      if(th&&page===k){var m=document.createElement('div');m.className='msg lui';m.innerHTML=html;th.appendChild(m);try{m.scrollIntoView({block:'nearest'})}catch(_){}}
      else ls('v38-csum-'+k,html);
      say('Appel terminé ('+d+'). Le résumé est dans votre discussion avec '+x[0]+'.','ok')}
    if(EXP[page]){var sv=ls('v38-csum-'+page),th0=$('#discussion .thread');if(sv&&th0){var m0=document.createElement('div');m0.className='msg lui';m0.innerHTML=sv;th0.appendChild(m0);ls('v38-csum-'+page,null)}}
    // reprise après un changement de page : l'appel continue en mini fenêtre
    (function(){var c=ss();if(!c||!EXP[c.k])return;build(c.k);t0=c.t0||Date.now();muted=!!c.muted;hp=c.hp!==false;setMute(muted);st0='listen';reduce();connect(false);if(!c.t0)save()})();
    addEventListener('resize',function(){if(mini&&mini.classList.contains('on'))place()});
    window.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-call]');if(b&&EXP[b.dataset.call]){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open(b.dataset.call);return}
      if(mini&&mini.contains(e.target)){var mb=e.target.closest('button');if(!mb)return;stop(e);
        if(mb.classList.contains('v44-mret')){show();return}
        if(mb.classList.contains('v44-mend')){end();return}
        if(mb.classList.contains('v44-mmc')){setMute(!muted);say(muted?'Micro coupé':'Micro activé','info');return}return}
      if(!ov||!ov.classList.contains('on'))return;var c=e.target.closest('.v38-cb, .v38-cst2, .v44-cmin');if(!c)return;stop(e);
      if(c.classList.contains('v44-cmin')){reduce();return}
      if(c.classList.contains('v38-cst2')){var on=ov.classList.toggle('nosub');c.textContent=on?'Afficher les sous-titres':'Masquer les sous-titres';return}
      var k2=c.dataset.c;if(k2==='end'){end();return}
      if(k2==='mic'){setMute(!muted);say(muted?'Micro coupé':'Micro activé','info');return}
      if(k2==='hp'){hp=!hp;c.setAttribute('aria-pressed',hp?'true':'false');c.classList.toggle('off',!hp);if(GAIN)GAIN.gain.value=hp?1:0;save();say(hp?'Haut-parleur activé':'Haut-parleur coupé','info');return}
      // point 126 d : le bouton écran emmène vers l'espace de l'expert ; l'appel continue en mini fenêtre
      if(k2==='scr'){var k3=ov.dataset.k;if(!t0){say(EXP[k3][0]+' n’a pas encore décroché.','info');return}reduce();location.href=k3+'.html#direct'}},true);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov&&ov.classList.contains('on')){stop(e);reduce()}},true);
    window.v44call={open:open,reduce:reduce,end:end,show:show}})();

  // ================= 17. Agenda d'un expert (point 50) : plus de bandeau Rendez-vous au-dessus du calendrier
  $$('#calendrier .v36-rdv').forEach(function(x){x.remove()});

  // ================= 18. « Demander à mon équipe » (points 92 b, 104, 106) : grande carte de Myriel en haut de l'accueil, qui envoie vraiment
  (function(){var C=$('.v38-cmp');if(C){var F=$('form',C),I=$('.v38-aski',C),B=$('.v38-askm',C),fi=$('.v38-askc input',C),FL=$('.v38-files',C),files=[];
      var NMS={djeneba:'Djénéba',fatima:'Fatima',koffi:'Koffi'},EXL={admin:['djeneba','fatima','koffi'],membre:['fatima','koffi'],membre0:[]}[VUE]||['djeneba','fatima','koffi'];
      $$('.v38-to',C).forEach(function(t){t.hidden=EXL.indexOf(t.dataset.x)<0});
      // point 107 b : idées tirées des experts recrutés et des marques de l’entreprise, elles suivent le destinataire choisi
      var IDX={djeneba:['Prépare le point du jour','Relance Serge pour le devis','Résume la semaine pour la direction'],fatima:['3 posts pour la promo Sossa','Calendrier éditorial d’octobre','Réponds aux commentaires Super Mint'],
        koffi:['Une affiche A2 Super Mint','Décline le visuel Sossa en story','Packaging Super Mint, version 3']};
      var IW=$('.v38-ideas',C);function ideas(){if(!IW)return;var k=to(),L=[];if(k==='djeneba'||!IDX[k]){L.push(['djeneba',IDX.djeneba[0]]);EXL.forEach(function(x){if(x!=='djeneba'&&IDX[x])L.push([x,IDX[x][0]])});L.push(['djeneba',IDX.djeneba[2]])}else IDX[k].forEach(function(t){L.push([k,t])});
        IW.innerHTML=L.slice(0,4).map(function(x){return '<button type="button" class="v38-idea" data-h="1" data-x="'+x[0]+'">'+esc(x[1])+'</button>'}).join('')}
      var first=$('.v38-to:not([hidden]) input',C);if(first)first.checked=true;if(!EXL.length)C.hidden=true;
      function to(){var r=$('.v38-to input:checked',C);return r?r.value:EXL[0]}
      function upd(){B.disabled=false;B.setAttribute('aria-disabled',(!I.value.trim()&&!files.length)?'true':'false');I.placeholder='Que voulez-vous confier à '+(NMS[to()]||'votre équipe')+' ?'}
      function grow(){I.style.height='auto';I.style.height=Math.min(I.scrollHeight,200)+'px'}
      I.addEventListener('input',function(){upd();grow()});C.addEventListener('change',function(e){if(e.target.name==='v38to'){upd();ideas()}});upd();ideas();
      I.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(B.getAttribute('aria-disabled')!=='true')F.requestSubmit?F.requestSubmit():B.click()}});
      fi.addEventListener('change',function(){[].forEach.call(fi.files||[],function(x){files.push(x.name)});FL.hidden=!files.length;FL.innerHTML=files.map(function(n,i){return '<li>'+esc(n)+'<button type="button" data-h="1" data-i="'+i+'" aria-label="Retirer '+esc(n)+'">'+IC.x+'</button></li>'}).join('');upd()});
      FL.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;stop(e);files.splice(+b.dataset.i,1);fi.dispatchEvent(new Event('change'))});
      $('.v38-askv',C).addEventListener('click',function(e){stop(e);var mv=e.currentTarget;if(mv.classList.contains('rec'))return;mv.classList.add('rec');mv.setAttribute('aria-label','Écoute en cours');var ph0=I.placeholder;I.placeholder='Je vous écoute…';
        setTimeout(function(){mv.classList.remove('rec');mv.setAttribute('aria-label','Dicter un message vocal');I.placeholder=ph0;var k=to(),L=IDX[k]||IDX.djeneba;I.value=(I.value?I.value+' ':'')+L[1];upd();grow();I.focus()},1600)});
      if(IW)IW.addEventListener('click',function(e){var b=e.target.closest('.v38-idea');if(!b)return;stop(e);if(to()!=='djeneba'){var r=$('.v38-to[data-x="'+b.dataset.x+'"] input',C);if(r)r.checked=true}I.value=b.textContent;upd();grow();I.focus()});
      F.addEventListener('submit',function(e){e.preventDefault();e.stopPropagation();var t=I.value.trim();if(!t&&!files.length){I.focus();return}
        try{sessionStorage.setItem('v38-ask',JSON.stringify({t:t,a:files.join(', ')}))}catch(_){}location.href=to()+'.html#discussion'},true);
      document.body.classList.add('v38-nodock')}
    var th=$('#discussion .thread'),q=null;try{q=JSON.parse(sessionStorage.getItem('v38-ask')||'null')}catch(_){}
    if(th&&q&&{djeneba:1,fatima:1,koffi:1}[page]){try{sessionStorage.removeItem('v38-ask')}catch(_){}
      var nm={djeneba:'Djénéba',fatima:'Fatima',koffi:'Koffi'}[page];
      var m=document.createElement('div');m.className='msg moi';m.innerHTML='<div class="bub">'+esc(q.t||'')+(q.a?'<span class="v38-att">'+esc(q.a)+'</span>':'')+'</div><time>à l’instant</time>';m._v36=1;th.appendChild(m);
      var w=document.createElement('div');w.className='msg lui';w.innerHTML='<span class="typing"><i></i><i></i><i></i></span><time>'+nm+' écrit…</time>';th.appendChild(w);
      setTimeout(function(){try{m.scrollIntoView({block:'center'})}catch(_){}},300);
      setTimeout(function(){w.innerHTML='<div class="bub">Bien reçu. '+(page==='djeneba'?'Je m’en occupe et je répartis avec l’équipe si besoin. ':'Je m’y mets tout de suite. ')+'Je vous tiens au courant ici.</div><time>à l’instant</time>'},1800)}})();

  // ================= 19. Recruter (point 94) : la carte ouvre la fiche, pastille « Déjà recruté(e) », admin peut assigner à un nouveau membre
  (function(){var FEMX={djeneba:1,fatima:1,koffi:0};
    // point 107 i : « Déjà recruté(e) » à la place du bouton, même niveau et même format que « Recruter <prénom> »
    $$('.pc2.mine2').forEach(function(c){var k=(c.getAttribute('href')||c.dataset.v36k||'').replace(/^recrue-|\.html$/g,''),lab=IC.check+' Déjà recruté'+(FEMX[k]?'e':'');
      var it=$('.inteam',c);if(it)it.remove();var rb=$('.rb',c);if(!rb){rb=document.createElement('span');rb.className='rb';($('.nm',c)||c).appendChild(rb)}rb.classList.add('v39-rbd');rb.innerHTML=lab});
    if(MEMBRE)return;
    $$('.asg').forEach(function(g){if($('.v38-nm',g))return;var b=document.createElement('span');b.className='as v38-nm';b.dataset.h='1';b.setAttribute('role','button');b.tabIndex=0;b.innerHTML=IC.plus+' Un nouveau membre';g.appendChild(b)});
    document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.v38-nm');if(!b)return;stop(e);if(!V.modal)return;
      var who=(document.querySelector('.rqbox h3')||{}).textContent||'';who=who.replace(/^Recruter\s+/,'');
      V.modal({ic:IC.user,tone:'info',t:'Inviter un nouveau membre',p:'Il ou elle reçoit une invitation par email'+(who?', puis '+who+' lui est assigné'+(/a$/.test(who)?'e':'')+' dès son arrivée':'')+'.',
        body:'<div class="v38-nmf"><label class="fl2"><span>Prénom et nom</span><input class="fi v38-nmn" placeholder="Awa Koné"></label><label class="fl2"><span>Adresse email</span><input class="fi v38-nme" type="email" placeholder="prenom.nom@entreprise.com"></label></div>',
        a:{l:'Inviter et assigner',fn:function(){var n=$('#v36-m .v38-nmn').value.trim(),m=$('#v36-m .v38-nme').value.trim();if(!n||!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(m)){say('Indiquez un nom et une adresse email valide','warn');return}
          var p=document.createElement('span');p.className='as on v38-as';p.dataset.who=n;p.innerHTML=IC.user+' '+esc(n);b.parentNode.insertBefore(p,b);V.close();say('Invitation envoyée à '+n+(who?'. '+who+' lui sera assigné'+(/a$/.test(who)?'e':'')+'.':''),'ok')}},b:{l:'Annuler'}})},true)})();

  // ================= 20. page profil (points 56, 96) : édition au clic, carte par carte ; vue membre = Nadège
  (function(){var P=$('.v38-pf');if(!P)return;
    if(MEMBRE){var h=$('.v38-pfh',P);$('img',h).src='../img/'+ME.p+'.jpg';$('h1',h).textContent=ME.n;var r=$('.v38-pfrole',h);if(r)r.textContent='Membre';
      var em=ME.f.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')+'.'+(ME.n.split(' ')[1]||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')+'@unifood.info';
      var e2=$('.v38-pfem',h);if(e2)e2.lastChild.textContent=' '+em;var m=$('.v38-pfm',h);if(m)m.textContent=(VUE==='membre'?'Chargée de communication, service Marketing':'Acheteur, service Opérations');
      var ex={membre:['fatima','koffi'],membre0:[]}[VUE]||[];$$('.v38-pfx2',P).forEach(function(a){a.hidden=ex.indexOf((a.getAttribute('href')||'').replace('.html',''))<0});
      var r0=$('.v38-pfr[data-k="email"]',P);if(r0){$('.v',r0).textContent=em;$('input',r0).value=em}}
    P.addEventListener('click',function(e){var c=e.target.closest('.v38-pfc');if(!c)return;
      if(e.target.closest('.v38-pfe')){stop(e);c.classList.add('ed');var i=$('input',c);if(i)i.focus();return}
      if(e.target.closest('.v38-pfx')){stop(e);c.classList.remove('ed');$$('.v38-pfr',c).forEach(function(r){var i=$('input',r);if(i)i.value=i.defaultValue});return}
      if(e.target.closest('.v38-pfs')){stop(e);$$('.v38-pfr',c).forEach(function(r){var i=$('input',r),v=$('.v',r);if(!i||!v)return;i.defaultValue=i.value;var ex=$('.v38-pfa',v);v.textContent=i.value+' ';if(ex)v.appendChild(ex)});c.classList.remove('ed');say('Profil enregistré','ok');return}
      if(e.target.closest('.v38-pfall')){stop(e);V.modal&&V.modal({ic:IC.x,tone:'warn',t:'Se déconnecter ?',p:'Vous reviendrez à la page de connexion.',a:{l:'Se déconnecter',fn:function(){V.close();location.href='connexion.html'}},b:{l:'Annuler'}});return}
      if(e.target.closest('.v38-pfph')){stop(e);var f=document.createElement('input');f.type='file';f.accept='image/*';f.onchange=function(){var x=f.files&&f.files[0];if(!x)return;var u=URL.createObjectURL(x);$('.v38-pfp img',P).src=u;say('Photo mise à jour','ok')};f.click()}})})();

  // ================= 21. fenêtre de paiement (points 99, 127 c, 130 d) : largeur FIXE quel que soit le moyen, hauteur fixe, rien ne déborde ;
  //   moyens à gauche (vrais logos), détail à droite ; Wave peut se payer par QR code ; dépôt : RIB compact + bordereau en largeur
  (function(){if(page!=='admin-facturation'||!V.modal)return;
    var MM=[['Wave','../img/pay/wave.png','mm'],['Orange Money','../img/pay/orange-money.png','mm'],['MTN MoMo','../img/pay/mtn-momo.png','mm'],['Moov Money','../img/pay/moov-money.png','mm'],['Djamo','../img/pay/djamo.png','card'],['Carte bancaire','','card'],['Dépôt ou virement','','bank']];
    function logo(m){if(m[1])return '<span class="v38-pl v44-pl"><img src="'+m[1]+'" alt=""></span>';return '<span class="v38-pl v44-pl v44-pli">'+(m[2]==='bank'?svg('<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l9 5H3z"/>'):IC.card)+'</span>'}
    // QR code de démonstration (motif fixe, 25 x 25, trois repères) : se lit comme un QR, pas un vrai lien de paiement
    function qr(){var n=25,s='',seed=7;function r(){seed=(seed*9301+49297)%233280;return seed/233280}
      function fin(x,y){return '<rect x="'+x+'" y="'+y+'" width="7" height="7" fill="#17112B"/><rect x="'+(x+1)+'" y="'+(y+1)+'" width="5" height="5" fill="#fff"/><rect x="'+(x+2)+'" y="'+(y+2)+'" width="3" height="3" fill="#17112B"/>'}
      for(var y=0;y<n;y++)for(var x=0;x<n;x++){if((x<8&&y<8)||(x>16&&y<8)||(x<8&&y>16))continue;if(r()<.5)s+='<rect x="'+x+'" y="'+y+'" width="1" height="1"/>'}
      return '<svg class="v44-qr" viewBox="-1 -1 27 27" role="img" aria-label="QR code de paiement Wave"><rect x="-1" y="-1" width="27" height="27" fill="#fff"/><g fill="#17112B">'+s+'</g>'+fin(0,0)+fin(18,0)+fin(0,18)+'</svg>'}
    function open(){var d=(moyens().filter(function(x){return x.def})[0]||{n:'Wave',d:''}),cur=d.n;if(!MM.some(function(m){return m[0]===cur}))cur='Wave';
      var body='<div class="v38-pm v44-pm"><div class="v38-pml" role="radiogroup" aria-label="Moyen de paiement">'+MM.map(function(m){return '<button type="button" role="radio" data-h="1" class="v38-pmo'+(m[0]===cur?' on':'')+'" aria-checked="'+(m[0]===cur)+'" data-m="'+m[0]+'">'+logo(m)+'<span>'+m[0]+'</span></button>'}).join('')+'</div><div class="v38-pmd"></div></div>';
      V.modal({ic:IC.card,tone:'info',t:'Payer 1 300 000 FCFA',p:'Facture du 01/11/2026, formule Team.',body:body,a:{l:'Payer',fn:function(b){var m=$('#v36-m .v38-pmo.on'),k=m&&m.dataset.m,t=MM.filter(function(x){return x[0]===k})[0];
          if(t&&t[2]==='mm'&&!$('#v36-m .v44-qrb.on')){var i=$('#v36-m .v38-pmn');if(!i||i.value.replace(/\D/g,'').length<10){say('Indiquez votre numéro '+k+' (10 chiffres)','warn');if(i)i.focus();return}}
          if(t&&t[2]==='bank'){var r=$('#v36-m .v38-pmr');if(!r||!r.files||!r.files.length){say('Joignez le bordereau de votre dépôt ou virement','warn');return}}
          if(t&&t[2]==='card'){var c=$('#v36-m .v38-pmc');if(!c||c.value.replace(/\D/g,'').length<(k==='Djamo'?10:16)){say(k==='Djamo'?'Indiquez le numéro lié à votre carte Djamo':'Indiquez le numéro de carte (16 chiffres)','warn');if(c)c.focus();return}}
          if(V.busy)V.busy(b,'Paiement…');setTimeout(function(){if(V.unbusy)V.unbusy(b);V.close();say(t&&t[2]==='bank'?'Bordereau reçu : la facture passe en Payée dès réception du virement':'Paiement envoyé : validez-le sur votre téléphone, le reçu arrive par email','ok')},1000)}},b:{l:'Annuler'}});
      var M=$('#v36-m');if(M)M.classList.add('v44-paym');
      draw(cur)}
    function draw(k){var Z=$('#v36-m .v38-pmd');if(!Z)return;var t=MM.filter(function(x){return x[0]===k})[0]||MM[0];
      var head='<p class="v44-pmt">'+logo(t)+'<b>'+esc(t[0])+'</b></p>';
      if(t[2]==='mm'){Z.innerHTML=head+'<label class="fl2"><span>Numéro '+esc(t[0])+'</span><input class="fi v38-pmn" type="tel" inputmode="numeric" placeholder="07 00 00 00 00" value="'+(t[0]==='Wave'?'07 08 45 12 12':'')+'"></label><p class="v38-pmh">Vous recevez une demande de validation sur ce numéro.</p>'+
          (t[0]==='Wave'?'<button type="button" class="v44-qrb" data-h="1" aria-expanded="false">'+svg('<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1"/>')+'<span>Payer plutôt avec un QR code</span></button><div class="v44-qrz" hidden>'+qr()+'<p><b>Scannez avec l’app Wave</b><span>Ouvrez Wave, touchez Scanner, puis validez 1 300 000 FCFA.</span></p></div>':'')}
      else if(t[2]==='card'&&t[0]==='Djamo')Z.innerHTML=head+'<label class="fl2"><span>Numéro lié à votre carte Djamo</span><input class="fi v38-pmc" type="tel" inputmode="numeric" placeholder="07 00 00 00 00"></label><p class="v38-pmh">Djamo vous envoie une notification : validez le paiement dans l’app.</p>';
      else if(t[2]==='card')Z.innerHTML=head+'<label class="fl2"><span>Numéro de carte</span><input class="fi v38-pmc" inputmode="numeric" placeholder="1234 5678 9012 3456" value="4242 4242 4242 4242"></label><div class="g2i"><label class="fl2"><span>Expiration</span><input class="fi" placeholder="MM/AA" value="12/28"></label><label class="fl2"><span>Code</span><input class="fi" inputmode="numeric" placeholder="123"></label></div><p class="v38-pmh">Paiement sécurisé, la carte n’est pas enregistrée.</p>';
      else Z.innerHTML=head+'<div class="v38-rib v44-rib"><p><span>Bénéficiaire</span><b>Mstudio SAS, Yelema</b></p><p><span>Banque</span><b>Société Générale CI</b></p><p class="v44-ribw"><span>IBAN</span><b class="num">CI93 CI00 8010 0000 0000 0000 0123</b></p><p><span>Référence</span><b class="num">INV-2026-11-0003</b></p><p><span>Montant</span><b class="num">1 300 000 FCFA</b></p></div>'+
        '<label class="v38-pmu v44-pmu"><input type="file" class="v38-pmr" accept="image/*,.pdf" hidden>'+svg('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>')+'<span><b>Joindre le bordereau</b><small>Photo ou PDF du dépôt ou du virement</small></span></label>';
      var r=$('#v36-m .v38-pmr');if(r)r.addEventListener('change',function(){var sp=r.parentNode.querySelector('span');if(r.files&&r.files[0]){sp.innerHTML='<b>Bordereau joint</b><small>'+esc(r.files[0].name)+'</small>';r.parentNode.classList.add('ok')}})}
    document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.v38-paynow, a[href="#payer"]');if(b){stop(e);open();return}
      var q=e.target.closest&&e.target.closest('#v36-m .v44-qrb');if(q){stop(e);var z=$('#v36-m .v44-qrz'),on=!q.classList.contains('on');q.classList.toggle('on',on);q.setAttribute('aria-expanded',on);z.hidden=!on;$('span',q).textContent=on?'Payer plutôt avec mon numéro':'Payer plutôt avec un QR code';
        $$('#v36-m .v38-pmn, #v36-m .v38-pmh').forEach(function(x){x.closest('label')?x.closest('label').hidden=on:x.hidden=on});return}
      var o=e.target.closest&&e.target.closest('#v36-m .v38-pmo');if(o){stop(e);$$('#v36-m .v38-pmo').forEach(function(x){var on=x===o;x.classList.toggle('on',on);x.setAttribute('aria-checked',on)});draw(o.dataset.m)}},true)})();

  // ================= 22. Yélé (point 101) : raccourci « Créer une routine »
  document.addEventListener('click',function(e){var sp=e.target.closest&&e.target.closest('#yele .sugg span');if(!sp||sp.textContent.trim()!=='Créer une routine')return;stop(e);
    var nb=$('[data-open="v33-rtm"]');if(nb&&V.routines){V.routines();setTimeout(function(){nb.click()},150);var y=$('#yele');if(y)y.classList.remove('on');return}
    var to=(VUE==='admin'?'djeneba':'fatima');location.href=to+'.html?onglet=routines&nouvelle=1'},true);
  if(Q.get('nouvelle')==='1'){setTimeout(function(){var nb=$('[data-open="v33-rtm"]');if(nb)nb.click()},400)}

  // ================= 23. Yélé (point 103) : raccourci « Créer un tableau »
  document.addEventListener('click',function(e){var sp=e.target.closest&&e.target.closest('#yele .sugg span');if(!sp||sp.textContent.trim()!=='Créer un tableau')return;stop(e);
    var nb=$('[data-open="newtdb"]');if(nb){var y=$('#yele');if(y)y.classList.remove('on');nb.click();return}location.href='tableau-de-bord.html?nouveau=1'},true);
  if(page==='tableau-de-bord'&&Q.get('nouveau')==='1'){setTimeout(function(){var nb=$('[data-open="newtdb"]');if(nb)nb.click()},400)}

  // ================= 24. connexion d'un outil (point 97 h, modèle Composio) : permissions détaillées avant de connecter
  (function(){var Z=$('#cz');if(!Z)return;var go=$('.czgo',Z),cs=$('.czs',Z);if(!go)return;
    var R={'Gmail':['Emails','Brouillons','Libellés'],'Google Drive':['Fichiers','Dossiers','Partages'],'Google Agenda':['Événements','Invitations'],'Notion':['Pages','Bases de données'],'HubSpot':['Contacts','Entreprises','Transactions'],'Slack':['Messages','Canaux'],'Canva':['Designs','Dossiers']};
    var box=document.createElement('div');box.className='v38-perm';if(cs)cs.parentNode.insertBefore(box,cs);else go.parentNode.insertBefore(box,go);
    function fill(){var n=($('.czn',Z)||{}).textContent||'',L=R[n]||['Données','Fichiers'];
      box.innerHTML='<p class="v38-permh">Ce que vos Experts pourront faire dans '+esc(n)+'</p><div class="v38-pt"><span></span><span>Lire</span><span>Modifier</span></div>'+
        L.map(function(r,i){return '<div class="v38-pt"><b>'+esc(r)+'</b><label><input type="checkbox" checked aria-label="Lire : '+esc(r)+'"></label><label><input type="checkbox"'+(i===0?' checked':'')+' aria-label="Modifier : '+esc(r)+'"></label></div>'}).join('')+
        '<p class="v38-aih">Modifiable à tout moment dans Connecteurs.</p>'}
    new MutationObserver(function(){if(Z.classList.contains('on'))fill()}).observe(Z,{attributes:true,attributeFilter:['class']});
    if(cs)cs.innerHTML='<span>'+IC.check+' Partagé avec les Experts que vous choisissez</span>'})();
  // ================= 25. points 105 et 109 l : page d'un expert, bascule Version A (mise en page de Myriel) / Version B (la nôtre).
  //   A = le même contenu réel que B (photo, boutons, Livrables, Résumé, Analytique, Réglages, Mail, Agenda), seule la mise en page change. Pas de bascule sur l'accueil.
  ls('v39-ver',null);ls('v39-base',null);
  (function(){var X={djeneba:'Djénéba',fatima:'Fatima',koffi:'Koffi'}[page];if(!X)return;var R=document.documentElement,pc=$('.xcol .pcard');if(!pc)return;
    var av=document.createElement('img');av.className='v39-vav';av.alt='';av.src='../img/'+page+'.jpg';pc.insertBefore(av,pc.firstChild);
    // point 111 g : en version A, sous le métier, l'adresse email de l'expert avec un bouton copier (au lieu de la tâche en cours)
    var em=(($('.xcol .xmail span')||{}).textContent||'').trim()||(page+'@unifood.yelema.ai'),nm0=$('.nm',pc);
    if(nm0&&!$('.v39-vml',nm0)){var ml=document.createElement('span');ml.className='v39-vml';ml.innerHTML=svg('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>')+'<span class="ell">'+esc(em)+'</span><button type="button" data-h="1" aria-label="Copier l’adresse email" title="Copier l’adresse email">'+svg('<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>')+'</button>';nm0.appendChild(ml);
      $('button',ml).addEventListener('click',function(e){stop(e);(V.copy||function(){})(em);say('Adresse copiée : '+em,'ok')})}
    function fit(){var g=$('#discussion .dgrid');if(!g)return;if(innerWidth<=760){g.style.height='';return}g.style.height='';var t=g.getBoundingClientRect().top+scrollY;var h=Math.max(420,innerHeight-t-20);g.style.height=h+'px';var over=document.documentElement.scrollHeight-innerHeight;if(over>0&&h-over>=420)g.style.height=(h-over)+'px'}
    addEventListener('resize',function(){clearTimeout(fit._t);fit._t=setTimeout(fit,80)});
    function set(v){R.classList.toggle('v39-va',v==='A');setTimeout(fit,0);$$('.v39-ver button').forEach(function(b){var on=b.dataset.v===v;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false')});try{window.dispatchEvent(new Event('resize'))}catch(_){}}
    function put(){if($('.v39-ver'))return;var top=$('.top');if(!top)return;var d=document.createElement('div');d.className='v39-ver';d.setAttribute('role','group');d.setAttribute('aria-label','Mise en page de l’espace de travail');
      d.innerHTML='<button type="button" data-h="1" data-v="A" title="Version A, mise en page de Myriel"><span class="v39-l">Version </span>A</button><button type="button" data-h="1" data-v="B" title="Version B, notre mise en page"><span class="v39-l">Version </span>B</button>';
      var ref=$('[data-pop="ping"]',top)||$('[data-pop="notifs"]',top);if(ref)top.insertBefore(d,ref);else top.appendChild(d);
      d.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;stop(e);var v=b.dataset.v;if(v===(ls('v39-xv')||'B')){say('Vous êtes déjà sur la version '+v,'info');return}ls('v39-xv',v);set(v);say('Version '+v+(v==='A'?', mise en page de Myriel':', notre mise en page'),'info')})}
    put();setTimeout(function(){put();set(ls('v39-xv')||'B')},0);set(ls('v39-xv')||'B');setTimeout(fit,500);$$('.xnav a[data-t="discussion"]').forEach(function(x){x.addEventListener('click',function(){setTimeout(fit,60)})})})();
  // ================= 26. point 107 e : icônes Tableau de bord et Chat entreprise de la maquette de Myriel, partout dans les menus
  (function(){var P={'tableau-de-bord.html':'<path d="M4 20V11M10 20V5M16 20v-7M21 20H3"/>','memoire.html':'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/>'};
    Object.keys(P).forEach(function(h){$$('.sb a[href="'+h+'"] > svg, .mnav a[href="'+h+'"] svg, #sh-menu a[href="'+h+'"] svg, .mspn a[href="'+h+'"] > svg, .xmn a[href="'+h+'"] > svg').forEach(function(v){
      var n=document.createElement('span');n.innerHTML=svg(P[h]);var x=n.firstChild;x.setAttribute('class',v.getAttribute('class')||'i s');v.parentNode.replaceChild(x,v)})})})();
  // ================= 27. points 107 j / 108 a : tous les chats = trombone, modèle (à gauche), champ, micro, bouton « Envoyer » visible
  (function(){var MIC=svg('<path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>');
    function fix(c){if(c._v39)return;var sb=$('.v36-sb',c),clip=$('.v36-clip',c),llm=$('.v36-llm',c);if(!sb||sb.classList.contains('v36-sbfake'))return;
      var inp=$('.v33-in',c)||$('textarea',c)||$('input[type=text]',c);if(!inp)return;c._v39=1;c.classList.add('v39-comp');
      if(clip&&llm&&clip.parentNode===llm.parentNode)clip.insertAdjacentElement('afterend',llm);
      var mic=document.createElement('button');mic.type='button';mic.className='v39-mic';mic.dataset.h='1';mic.setAttribute('aria-label','Dicter un message');mic.title='Dicter un message';mic.innerHTML=MIC;
      var go=document.createElement('button');go.type='button';go.className='v39-send';go.dataset.h='1';go.innerHTML=IC.send+'<span>Envoyer</span>';
      sb.insertAdjacentElement('afterend',go);sb.insertAdjacentElement('afterend',mic);sb.classList.add('v39-hsb');sb.tabIndex=-1;sb.setAttribute('aria-hidden','true');
      function st(){var on=!!String(inp.value||'').trim();go.setAttribute('aria-disabled',on?'false':'true')}
      st();inp.addEventListener('input',st);inp.addEventListener('keyup',st);new MutationObserver(function(){setTimeout(st,0)}).observe(sb,{attributes:true,attributeFilter:['class']});
      setInterval(function(){if(document.visibilityState==='visible')st()},700);
      go.addEventListener('click',function(e){stop(e);if(!String(inp.value||'').trim()){inp.focus();say('Écrivez votre message, puis envoyez','info');return}sb.click();setTimeout(st,50)});
      mic.addEventListener('click',function(e){stop(e);if(mic.classList.contains('rec'))return;var keep=String(inp.value||'').trim();if(keep){inp.value='';inp.dispatchEvent(new Event('input',{bubbles:true}))}
        mic.classList.add('rec');var ph0=inp.placeholder;inp.placeholder='Je vous écoute…';sb.click();setTimeout(function(){mic.classList.remove('rec');inp.placeholder=ph0;if(keep){inp.value=keep+' '+inp.value;inp.dispatchEvent(new Event('input',{bubbles:true}))}st()},1700)})}
    function all(){$$('.v36-comp').forEach(fix)}
    all();setTimeout(all,300);setTimeout(all,1200)})();
  // ================= 28. point 108 c : Résumé, période Aujourd’hui / Cette semaine / Ce mois-ci / Personnalisée (Du / Au)
  (function(){$$('.seg.rps').forEach(function(sg){if($('.v39-rpp',sg))return;var a=document.createElement('a');a.className='v39-rpp';a.dataset.h='1';a.href='#';a.textContent='Personnalisée';sg.appendChild(a);
      var pop=document.createElement('div');pop.className='v39-rpop';pop.hidden=true;pop.setAttribute('role','dialog');pop.setAttribute('aria-label','Période personnalisée');
      pop.innerHTML='<label><span>Du</span><input type="date" class="fi" value="2026-09-12"></label><label><span>Au</span><input type="date" class="fi" value="2026-10-03"></label><button type="button" class="btn p sm" data-h="1">Appliquer</button>';
      sg.parentNode.style.position='relative';sg.parentNode.appendChild(pop);
      function fr(v){try{return new Date(v+'T12:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}catch(_){return v}}
      a.addEventListener('click',function(e){stop(e);pop.hidden=!pop.hidden;if(!pop.hidden)$('input',pop).focus()});
      $('button',pop).addEventListener('click',function(e){stop(e);var i=$$('input',pop),d1=i[0].value,d2=i[1].value;if(!d1||!d2||d1>d2){say('Choisissez une date de début avant la date de fin','warn');return}
        $$('a',sg).forEach(function(x){x.classList.toggle('on',x===a)});a.textContent=fr(d1)+' au '+fr(d2);pop.hidden=true;
        var pn=sg.closest('.panel')||document;$$('.rcp',pn).forEach(function(r){r.classList.toggle('on',r.dataset.rp==='mois')});say('Résumé du '+fr(d1)+' au '+fr(d2),'ok')});
      $$('a',sg).forEach(function(o){if(o!==a)o.addEventListener('click',function(){a.textContent='Personnalisée';pop.hidden=true})});
      document.addEventListener('click',function(e){if(!pop.hidden&&!pop.contains(e.target)&&e.target!==a)pop.hidden=true})})})();
  // ================= 29. point 108 e : rédiger un email avec Cc, Cci et pièces jointes
  (function(){var M=$('#mcomp');if(!M||$('.v39-cc',M))return;var to=$('input[type=email]',M);if(!to)return;var l0=to.closest('.fl2');
    var cl=document.createElement('div');cl.className='v39-ccl';cl.innerHTML='<button type="button" class="link sm" data-h="1" data-c="cc">Ajouter Cc</button><button type="button" class="link sm" data-h="1" data-c="cci">Ajouter Cci</button>';
    l0.insertAdjacentElement('afterend',cl);
    ['cci','cc'].forEach(function(k){var f=document.createElement('label');f.className='fl2 v39-cc';f.dataset.c=k;f.hidden=true;f.innerHTML='<span>'+(k==='cc'?'Cc':'Cci')+'</span><input class="fi" type="text" inputmode="email" placeholder="nom@entreprise.com, autre@entreprise.com" style="width:100%">';cl.insertAdjacentElement('afterend',f)});
    cl.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;stop(e);var f=$('.v39-cc[data-c="'+b.dataset.c+'"]',M);f.hidden=false;b.hidden=true;$('input',f).focus();if(!$$('button:not([hidden])',cl).length)cl.hidden=true});
    var ta=$('textarea',M),z=document.createElement('div');z.className='v39-att';
    z.innerHTML='<ul class="v39-attl"></ul><label class="v39-attb"><input type="file" multiple hidden>'+svg('<path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"/>')+'<span>Joindre des fichiers</span></label>';
    (ta?ta.closest('.fl2'):l0).insertAdjacentElement('afterend',z);var F=[],fi=$('input[type=file]',z),ul=$('.v39-attl',z);
    function draw(){ul.innerHTML=F.map(function(n,i){return '<li>'+svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>')+'<span class="ell">'+esc(n)+'</span><button type="button" data-h="1" data-i="'+i+'" aria-label="Retirer '+esc(n)+'">'+IC.x+'</button></li>'}).join('');ul.hidden=!F.length}
    draw();fi.addEventListener('change',function(){[].forEach.call(fi.files||[],function(x){F.push(x.name)});fi.value='';draw()});
    ul.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;stop(e);F.splice(+b.dataset.i,1);draw()});
    var go=$('.v30-mcgo',M);if(go)go.addEventListener('click',function(){var n=F.length,c=$$('.v39-cc input',M).filter(function(i){return i.value.trim()}).length;if(n||c)setTimeout(function(){say((n?n+' pièce'+(n>1?'s jointes':' jointe'):'')+(n&&c?', ':'')+(c?'copies ajoutées':'')+' : '+(n?'jointes':'reprises')+' dans le brouillon','info')},1400);
      setTimeout(function(){F=[];draw();$$('.v39-cc',M).forEach(function(f){f.hidden=true;$('input',f).value=''});cl.hidden=false;$$('button',cl).forEach(function(b){b.hidden=false})},600)})})();
  // ================= 30. point 107 f / g : tableaux de bord, liste = Mes tableaux + Partagés avec moi ; un seul lien, Enregistrer en haut
  (function(){var L=$('.tbrail .tbli');if(L){$$('p.tbg',L).forEach(function(g){if(/Nouveaux experts/i.test(g.textContent))g.remove()});
      var gs=$$('p.tbg',L);gs.forEach(function(g,i){var n=0,e=g.nextElementSibling;while(e&&!e.matches('p')){if(e.matches('a[data-t]')&&getComputedStyle(e).display!=='none')n++;e=e.nextElementSibling}var b=$('b',g);if(b&&n)b.textContent=n})}
    function swap(){$$('.tbact .tbcl').forEach(function(cl){var pn=cl.closest('.panel')||document,tp=$('.tbtpl',pn);if(!tp||cl._v39)return;cl._v39=1;var m=document.createElement('i');tp.parentNode.insertBefore(m,tp);cl.parentNode.insertBefore(tp,cl);m.parentNode.insertBefore(cl,m);m.remove();
      tp.innerHTML=svg('<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>')+' <span>Enregistrer</span>';tp.title='Enregistrer comme modèle';tp.setAttribute('aria-label','Enregistrer comme modèle')})}
    swap();setTimeout(swap,0);setTimeout(swap,400)})();
  // ================= 31. point 107 j : la carte « Demander à mon équipe » a aussi le choix du modèle, à gauche à côté du trombone
  (function(){var C=$('.v38-cmp .v38-cbar');if(!C||$('.v39-mdl',C))return;var L=['Claude Sonnet','Claude Opus','GPT-5','Gemini 2.5 Pro'];
    function cur(){var m=ls('v36-llm');return m||L[0]}
    var w=document.createElement('div');w.className='v39-mdl';w.innerHTML='<button type="button" class="v39-mdb" data-h="1" aria-haspopup="listbox" aria-expanded="false" title="Modèle d’IA">'+svg('<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>')+'<span></span>'+IC.chev+'</button><div class="v39-mdm" role="listbox" hidden></div>';
    var clip=$('.v38-askc',C);if(clip)clip.insertAdjacentElement('afterend',w);else C.insertBefore(w,C.firstChild);var mv=$('.v38-askv',C),sd=$('.v38-askm',C);if(mv&&sd)sd.parentNode.insertBefore(mv,sd);
    var b=$('.v39-mdb',w),m=$('.v39-mdm',w);function draw(){$('span',b).textContent=cur();m.innerHTML=L.map(function(x){return '<button type="button" role="option" data-h="1" aria-selected="'+(x===cur())+'" class="'+(x===cur()?'on':'')+'">'+esc(x)+(x===cur()?IC.check:'')+'</button>'}).join('')}draw();
    b.addEventListener('click',function(e){stop(e);m.hidden=!m.hidden;b.setAttribute('aria-expanded',m.hidden?'false':'true')});
    m.addEventListener('click',function(e){var o=e.target.closest('button');if(!o)return;stop(e);ls('v36-llm',o.textContent);draw();m.hidden=true;b.setAttribute('aria-expanded','false');say('Modèle choisi : '+o.textContent,'info')});
    document.addEventListener('click',function(e){if(!m.hidden&&!w.contains(e.target)){m.hidden=true;b.setAttribute('aria-expanded','false')}})})();
  // ================= 32. v4.40 : la bulle « Besoin d’aide ? » ne cache jamais un titre, un bouton ou un champ
  (function(){var Y=$('.ybtn');if(!Y)return;var SEL='h1,h2,h3,h4,button,a.btn,.btn,input,textarea,select,[role="button"],.v38-addf,.v38-adda,summary';
    function hits(){var r=Y.getBoundingClientRect();if(!r.width)return false;var L=$$(SEL).filter(function(e){if(Y.contains(e)||e.closest('#yele,.ypop,.modal,#v36-m,.v38-call'))return false;var q=e.getBoundingClientRect();
        if(!q.width||!q.height||q.width>700||q.height>400)return false;if(q.right<=r.left||q.left>=r.right||q.bottom<=r.top||q.top>=r.bottom)return false;var cs=getComputedStyle(e);return cs.visibility!=='hidden'&&cs.opacity!=='0'&&!!e.offsetParent});
      return L.length>0}
    var busy=0;function place(){if(busy)return;busy=1;Y.classList.remove('v39-yc');Y.style.transform='';
      if(hits()){Y.classList.add('v39-yc');var d=0;while(hits()&&d<480){d+=16;Y.style.transform='translateY(-'+d+'px)'}if(hits()){Y.style.transform=''}}busy=0}
    var t;function later(){clearTimeout(t);t=setTimeout(place,120)}
    place();setTimeout(place,600);setTimeout(place,1500);addEventListener('scroll',later,{passive:true,capture:true});addEventListener('resize',later);document.addEventListener('click',function(){setTimeout(place,350)})})();
  // ================= 33. point 110 : mobile sans défilement horizontal
  (function(){var MQ=matchMedia('(max-width:760px)');
    // tableaux larges : cartes empilées (chaque cellule reçoit le titre de sa colonne)
    $$('.v38-dem table, .v37-drt, .v36-ptm, .v36-ptx, table.v38-dqt').forEach(function(t){var H=$$('thead th',t).map(function(h){return h.textContent.trim()});if(!H.length)return;t.classList.add('v39-stk');
      $$('tbody tr',t).forEach(function(r){$$('td',r).forEach(function(td,i){if(H[i]&&!td.dataset.l)td.dataset.l=H[i]})})});
    // graphiques larges : défilement interne signalé
    $$('.v36-tw').forEach(function(w){var t=$('table',w);if(!t||t.classList.contains('v39-stk')||w._v39)return;w._v39=1;w.classList.add('v39-hs');var h=document.createElement('p');h.className='v39-hsh';h.innerHTML=svg('<path d="M18 8l4 4-4 4M6 8l-4 4 4 4M2 12h20"/>')+' Faites glisser pour voir la suite';w.parentNode.insertBefore(h,w)});
    // menu de l'admin en téléphone : un bouton qui déroule la liste, au lieu d'une barre qui défile
    var A=$('.sb.sbadm');if(A&&!$('.v39-amb',A)){var on=$('a.it.on',A),b=document.createElement('button');b.type='button';b.className='v39-amb';b.dataset.h='1';b.setAttribute('aria-expanded','false');
      b.innerHTML='<span class="ell">'+esc(on?on.textContent.trim():'Menu')+'</span>'+IC.chev;var bk=$('.back2',A);(bk||A.firstChild).insertAdjacentElement('afterend',b);
      b.addEventListener('click',function(e){stop(e);var o=A.classList.toggle('v39-amo');b.setAttribute('aria-expanded',o?'true':'false')})}
  })();
  // ================= 39. point 113 : raison d'une demande sur 2 lignes, texte complet au clic
  document.addEventListener('click',function(e){var r=e.target.closest&&e.target.closest('.v39-dqr');if(!r)return;var o=r.classList.toggle('v39-dqo');r.setAttribute('aria-expanded',o?'true':'false')});
  document.addEventListener('keydown',function(e){var r=e.target.closest&&e.target.closest('.v39-dqr');if(!r||(e.key!=='Enter'&&e.key!==' '))return;e.preventDefault();r.click()});
  // ================= 40. point 119 : Mes connexions personnelles, une seule fenêtre « Ajouter une connexion » au gabarit des modales admin (97 h, 97 i)
  (function(){var pe=$('.v33-perso');if(!V||!V.modal)return; // 127 d : la même fenêtre sert aussi à l’admin (window.v44conn)
    var PLUG=svg('<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>'),
        DOTS=svg('<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>'),
        KEY=svg('<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>'),
        SRV=svg('<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>');
    var FOUR=[['Anthropic','anthropic.com'],['OpenAI','openai.com'],['Google','gemini.google.com'],['Mistral','mistral.ai']];
    var MENU='<span class="v40-pim"><button type="button" class="ib v40-pib" data-h="1" aria-label="Actions" aria-expanded="false">'+DOTS+'</button><span class="v40-pimm" role="menu" hidden><button type="button" role="menuitem" class="v40-pied" data-h="1">Modifier</button><button type="button" role="menuitem" class="v40-pirm" data-h="1">Retirer</button></span></span>';
    if(pe){var old=$$('[data-open="v33-key"]',pe),host=old.length?old[0].parentNode:pe;old.forEach(function(b){b.parentNode.removeChild(b)});
    var add=document.createElement('a');add.href='#';add.className='btn o sm v40-pcadd';add.dataset.h='1';add.innerHTML=svg('<path d="M5 12h14M12 5v14"/>')+' Ajouter une connexion';host.appendChild(add)}
    function body(){return '<div class="v40-pcm"><div class="seg v40-pck" role="radiogroup" aria-label="Type de connexion"><a href="#" data-h="1" data-k="ia" class="on" role="radio" aria-checked="true">Modèle d’IA</a><a href="#" data-h="1" data-k="api" role="radio" aria-checked="false">Clé d’un service</a><a href="#" data-h="1" data-k="mcp" role="radio" aria-checked="false">Serveur MCP</a></div>'+
      '<div class="v40-pcz" data-k="ia"><div class="v36-fl"><span>Fournisseur</span><div class="v40-pcf">'+FOUR.map(function(f,i){return '<a href="#" data-h="1" class="v40-pcfo'+(i?'':' on')+'" data-n="'+f[0]+'" data-d="'+f[1]+'"><img src="https://www.google.com/s2/favicons?sz=64&domain='+f[1]+'" alt="">'+f[0]+'</a>'}).join('')+'</div></div>'+
        '<label class="v36-fl"><span>Clé</span><input class="fi v40-pkv" type="password" autocomplete="off" placeholder="Collez la clé"></label></div>'+
      '<div class="v40-pcz" data-k="api" hidden><label class="v36-fl"><span>Service</span><input class="fi v40-psn" type="text" maxlength="60" placeholder="Par exemple : Notion"></label><label class="v36-fl"><span>Clé</span><input class="fi v40-psv" type="password" autocomplete="off" placeholder="Collez la clé"></label></div>'+
      '<div class="v40-pcz" data-k="mcp" hidden><label class="v36-fl"><span>Nom</span><input class="fi v40-pmn" type="text" maxlength="60" placeholder="Par exemple : mon agenda"></label><label class="v36-fl"><span>Adresse du serveur</span><input class="fi v40-pmu" type="url" placeholder="https://…/mcp"></label><label class="v36-fl"><span>Jeton d’accès (facultatif)</span><input class="fi" type="password" autocomplete="off" placeholder="Bearer …"></label></div></div>'}
    var OPT={};function item(ic,t,sub,kind){if(OPT.onAdd)return OPT.onAdd(ic,t,sub,kind);if(kind==='mcp')sub=sub.replace(/^https?:\/\//,'')+', 6 outils';var l=$('.v33-pl',pe)||pe,d=document.createElement('div');d.className='v33-pi v40-pi';
      d.innerHTML=ic+'<span class="grow"><b class="v40-pin">'+esc(t)+'</b>'+(sub?'<small class="xs mute3">'+esc(sub)+'</small>':'')+'</span><span class="pill v33-pe">Personnel</span>'+MENU;
      l.appendChild(d);d.classList.add('v36-flash')}
    function mark(){var M=$('#v36-m');if(M)$('.pn',M).classList.add('v40-pcp');return M}
    function open(o){OPT=o||{};V.modal({ic:PLUG,tone:'info',t:'Ajouter une connexion',p:OPT.p||'Pour vous seule, avec vos Experts.',body:body(),
      a:{l:'Ajouter',fn:function(b){var M=$('#v36-m'),z=$('.v40-pck a.on',M).dataset.k;
        if(z==='ia'){var f=$('.v40-pcfo.on',M),v=$('.v40-pkv',M).value.trim();if(v.length<8){say('Collez la clé '+f.dataset.n,'warn');$('.v40-pkv',M).focus();return}
          V.close();item('<img src="https://www.google.com/s2/favicons?sz=64&domain='+f.dataset.d+'" alt="">',f.dataset.n,'Clé d’IA ••••'+v.slice(-4),'ia');say('Clé '+f.dataset.n+' ajoutée','ok');return}
        if(z==='api'){var n=$('.v40-psn',M).value.trim(),k2=$('.v40-psv',M).value.trim();if(!n){say('Donnez le nom du service','warn');$('.v40-psn',M).focus();return}if(k2.length<6){say('Collez la clé','warn');$('.v40-psv',M).focus();return}
          V.close();item(KEY,n,'Clé ••••'+k2.slice(-4),'api');say('Clé '+n+' ajoutée','ok');return}
        var mn=$('.v40-pmn',M).value.trim(),mu=$('.v40-pmu',M).value.trim();if(!mn){say('Donnez un nom au serveur','warn');$('.v40-pmn',M).focus();return}if(!/^https?:\/\/\S+\.\S+/.test(mu)){say('Entrez une adresse qui commence par https://','warn');$('.v40-pmu',M).focus();return}
        if(V.busy)V.busy(b,'Test en cours…');setTimeout(function(){if(V.unbusy)V.unbusy(b);V.close();item(SRV,mn,mu,'mcp');say('Serveur « '+mn+' » ajouté, 6 outils','ok')},700)}},b:{l:'Annuler'}});mark();
      if(OPT.k&&OPT.k!=='ia'){var kb=$('#v36-m .v40-pck a[data-k="'+OPT.k+'"]');if(kb){var P=kb.closest('.pn');$$('.v40-pck a',P).forEach(function(a){var on=a===kb;a.classList.toggle('on',on);a.setAttribute('aria-checked',on)});$$('.v40-pcz',P).forEach(function(z){z.hidden=z.dataset.k!==OPT.k})}}}
    window.v44conn=open;
    document.addEventListener('click',function(e){var t=e.target;if(!t.closest)return;
      if(t.closest('.v40-pcadd')){stop(e);open();return}
      // 127 d : Admin > Connecteurs > Serveurs MCP : la même fenêtre, onglet Serveur MCP, la ligne s’ajoute au tableau de l’entreprise
      var am=t.closest('.v33-mcp [data-open="v33-key"][data-v33s="ent"]');if(am){stop(e);open({k:'mcp',p:'Pour l’entreprise : vous la donnez ensuite aux Experts qui en ont besoin.',onAdd:function(ic,n,sub,kind){
        if(kind!=='mcp'){say('« '+n+' » ajouté pour l’entreprise. Retrouvez-le dans Clés et connexions.','ok');return}var tb=$('.v33-mcp .v33-kl');if(!tb)return;var tr=document.createElement('tr');tr.className='v36-flash';
        tr.innerHTML='<td><b>'+esc(n)+'</b> <span class="pill br">Entreprise</span></td><td class="hide-m"><code class="xs">'+esc(sub)+'</code></td><td><span class="xs mute3">Aucun Expert</span></td><td><a class="btn o sm" href="#" data-open="cxa" data-h="1" data-app="'+esc(n)+'"> Attribuer</a></td>';(tb.tBodies[0]||tb).appendChild(tr);
        var at=$('[data-open="cxa"]',tr);at.addEventListener('click',function(ev){ev.preventDefault();var m=document.getElementById('cxa'),z=m&&$('.czn',m);if(z)z.textContent=at.dataset.app;if(m)m.classList.add('on')})}});return}
      var kk=t.closest('.v40-pck a');if(kk){stop(e);var P=kk.closest('.pn');$$('.v40-pck a',P).forEach(function(a){var on=a===kk;a.classList.toggle('on',on);a.setAttribute('aria-checked',on)});$$('.v40-pcz',P).forEach(function(z){z.hidden=z.dataset.k!==kk.dataset.k});var f=$('.v40-pcz:not([hidden]) input',P);if(f)f.focus();return}
      var fo=t.closest('.v40-pcfo');if(fo){stop(e);$$('.v40-pcfo',fo.parentNode).forEach(function(a){a.classList.toggle('on',a===fo)});return}
      var mb=t.closest('.v40-pib');if(mb){stop(e);var mm=mb.nextElementSibling,was=!mm.hidden;$$('.v40-pimm').forEach(function(x){x.hidden=true});mm.hidden=was;mb.setAttribute('aria-expanded',!was);return}
      var ed=t.closest('.v40-pied');if(ed){stop(e);var r=ed.closest('.v40-pi'),nb=$('.v40-pin',r);ed.parentNode.hidden=true;
        V.modal({ic:PLUG,tone:'info',t:'Modifier la connexion',p:'Un nom qui dit à quoi elle sert.',sel:1,body:'<label class="v36-fl"><span>Nom</span><input class="fi v36-in" type="text" maxlength="60" value="'+esc(nb.textContent)+'"></label>',
          a:{l:'Enregistrer',fn:function(){var v=$('#v36-m .v36-in').value.trim();if(!v){say('Donnez un nom','warn');return}nb.textContent=v;V.close();say('Connexion modifiée','ok')}},b:{l:'Annuler'}});mark();return}
      var rt=t.closest('.v40-pirm');if(rt){stop(e);var r2=rt.closest('.v40-pi'),n2=$('.v40-pin',r2).textContent;rt.parentNode.hidden=true;
        V.modal({ic:PLUG,tone:'ko',t:'Retirer « '+n2+' » ?',p:'Vos Experts ne pourront plus s’en servir.',a:{l:'Retirer',fn:function(){r2.parentNode.removeChild(r2);V.close();say('Connexion retirée : '+n2,'ok')}},b:{l:'Annuler'}});var M3=mark(),b1=M3&&$('.v36-mb1',M3);if(b1)b1.classList.add('dng');return}
      if(!t.closest('.v40-pim'))$$('.v40-pimm').forEach(function(x){x.hidden=true})},true);
    // les connexions posées par les boutons Gmail / Agenda reçoivent aussi Modifier / Retirer
    if(pe)new MutationObserver(function(){$$('.v33-pi:not(.v40-pi)',pe).forEach(function(d){d.classList.add('v40-pi');var b=$('b',d);if(b)b.classList.add('v40-pin');var s=document.createElement('span');s.innerHTML=MENU;d.appendChild(s.firstChild)})}).observe(pe,{childList:true,subtree:true});
  })();
  // ================= 41. point 118 : Yélé répond vraiment (réponse selon la question, avec un lien d'action), bouton Fermer, accès mobile
  (function(){var Y=$('#yele');if(!Y)return;var GEN='Bonne question. Je vous réponds';
    var ADM=VUE==='admin';
    var KB=[
      [/recrut|embauch|nouvel? expert|ajouter un expert/i,'Ouvrez Recruter : chaque Expert a sa fiche de poste. '+(ADM?'Vous recrutez pour vous ou pour un collègue ; le premier Expert coûte 300 000 FCFA par mois, les suivants 200 000 FCFA, Djénéba est incluse.':'Vous signalez votre intérêt, votre admin reçoit la demande et recrute.'),'recruter.html','Ouvrir Recruter'],
      [/outil|connect|gmail|drive|slack|teams|notion|mcp|cl[ée]/i,'Chaque Expert a ses connecteurs : ouvrez son espace, puis Réglages, Connecteurs. Vos clés et serveurs MCP personnels se gèrent dans Réglages, API et MCP.','fatima.html#connecteurs','Ouvrir les connecteurs'],
      [/factur|paie|paiement|payer|prix|tarif|co[uû]t|abonnement/i,ADM?'Vos factures et moyens de paiement sont dans Administration, Facturation : Wave, Orange Money, MTN, Moov, Djamo ou carte. La prochaine facture se règle en un clic.':'La facturation est gérée par votre admin, Aïcha Diabaté. Je peux lui transmettre votre question.',ADM?'admin-facturation.html':'',ADM?'Ouvrir la facturation':''],
      [/routine|chaque (matin|jour|semaine)|automati/i,'Une routine, c’est une consigne qui revient : ouvrez l’espace d’un Expert, Réglages, Routines, puis Nouvelle routine. Le résultat arrive dans tous ses canaux.','djeneba.html#routines','Ouvrir les routines'],
      [/tableau|dashboard|indicateur/i,'Ouvrez Tableaux de bord, puis Nouveau tableau : choisissez l’Expert et décrivez ce que vous voulez suivre. Chaque tableau a son lien de partage.','tableau-de-bord.html','Ouvrir les tableaux'],
      [/membre|invit|coll[eè]gue|r[ôo]le|acc[eè]s/i,ADM?'Administration, Membres : Inviter un membre, puis choisir Admin ou Membre.':'Les invitations et les rôles sont gérés par votre admin, Aïcha Diabaté.',ADM?'admin-membres.html':'',ADM?'Ouvrir les membres':''],
      [/canal|canaux|telegram|whatsapp|web/i,'Un Expert vous répond sur Telegram, le Web, Slack, Teams ou WhatsApp. Ouvrez son espace, Réglages, Canaux, pour en ajouter un.','fatima.html#canaux','Ouvrir les canaux'],
      [/livrable|fichier|document|t[ée]l[ée]charg/i,'Les fichiers d’un Expert sont dans son onglet Livrables, rangés par dossier. Vous pouvez aussi connecter votre Drive pour en garder une copie.','fatima.html#drive','Ouvrir les Livrables'],
      [/mot de passe|connexion|compte|profil/i,'Votre compte se règle dans Mon profil : nom, photo, mot de passe, langue.','profil.html','Ouvrir mon profil']];
    function answer(q){for(var i=0;i<KB.length;i++)if(KB[i][0].test(q))return KB[i];return null}
    function fix(b){if(!b||b._v40||b.textContent.indexOf(GEN)!==0)return;b._v40=1;var m=b.closest('.msg'),p=m&&m.previousElementSibling,q=p&&p.classList.contains('moi')?p.textContent.trim():'';var a=answer(q);
      if(a){b.innerHTML=esc(a[1])+(a[2]?' <a class="v40-ya" href="'+a[2]+'">'+esc(a[3])+' '+svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>')+'</a>':'')}
      else b.innerHTML='Je n’ai pas la réponse tout de suite. Je transmets votre question à l’équipe Yelema, qui vous répond ici sous une heure ouvrée.';
      var s=$('.sugg',Y);if(s){s.hidden=false;s.classList.add('v40-ys')}
      Y.scrollTop=Y.scrollHeight}
    new MutationObserver(function(){$$('.msg.lui .bub',Y).forEach(fix)}).observe(Y,{subtree:true,childList:true,characterData:true});
    // bouton Fermer en haut à droite du panneau
    var hd=Y.firstElementChild;if(hd&&!$('.v40-yx',Y)){var x=document.createElement('button');x.type='button';x.className='ib v40-yx';x.dataset.h='1';x.setAttribute('aria-label','Fermer');x.innerHTML=svg('<path d="M18 6 6 18M6 6l12 12"/>');
      x.addEventListener('click',function(e){stop(e);Y.classList.remove('on');var yb=$('.ybtn');if(yb)yb.setAttribute('aria-expanded','false')});hd.appendChild(x)}
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&Y.classList.contains('on'))Y.classList.remove('on')});
    // micro chez Yélé : une question de support dictée (pas une consigne d'expert)
    var DQ=['Comment ajouter un canal Telegram ?','Comment connecter mes outils ?','Où sont les livrables de Fatima ?'],di=0;
    Y.addEventListener('click',function(e){var mc=e.target.closest&&e.target.closest('.v39-mic, .mic');if(!mc)return;stop(e);var i=$('.v33-in, textarea, input[type=text]',Y);if(mc.classList.contains('rec'))return;mc.classList.add('rec');if(i)i.placeholder='Yélé vous écoute…';
      setTimeout(function(){mc.classList.remove('rec');if(i){i.placeholder='Posez votre question à Yélé';i.value=DQ[di++%DQ.length];i.dispatchEvent(new Event('input',{bubbles:true}));i.focus()}},1400)},true);
    // les échanges défilent dans le panneau, le champ reste en bas
    Y.classList.add('v40-yp');
  })();
  // ================= 42. point 120 : repère de page pour la couche de cohérence v40 (CSS en fin de chaîne)
  document.documentElement.classList.add('v40-pg-'+String(page||'x').replace(/[^a-z0-9-]/g,''));
  // ================= 43. point 124 b : chaque groupe de la liste des tableaux défile dans sa propre zone bornée
  (function(){var L=$('.tbrail .tbli');if(!L)return;$$('p.tbg',L).forEach(function(g){var z=document.createElement('div');z.className='v40-tbz';var e=g.nextElementSibling;
      while(e&&!e.matches('p')){var nx=e.nextElementSibling;z.appendChild(e);e=nx}g.insertAdjacentElement('afterend',z);z.setAttribute('role','group');z.setAttribute('aria-label',g.firstChild?g.firstChild.textContent.trim():'Tableaux')});
    function mark(){$$('.v40-tbz',L).forEach(function(z){z.classList.toggle('v40-tbzs',z.scrollHeight>z.clientHeight+1)})}mark();setTimeout(mark,400);addEventListener('resize',mark)})();
})();
/* v4.44 (add89) : points 125 à 131. Préfixe v44-. */
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function stop(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
  function svg(p){return '<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
  var V=window.v36||{},say=function(m,t){(V.toast||window.toast||function(){})(m,t)};
  var page=(location.pathname.split('/').pop()||'').replace('.html','');
  // ================= 126 f : clic sur la photo du profil = Changer la photo (même gestionnaire que le bouton, add88)
  //   (le gestionnaire d'add88 ne regardait que l'intérieur des cartes : le badge photo ne faisait rien)
  document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.v38-pfp img, .v38-pfph');if(!t)return;stop(e);
    var f=document.createElement('input');f.type='file';f.accept='image/*';f.style.display='none';document.body.appendChild(f);
    f.onchange=function(){var x=f.files&&f.files[0];if(x){var u=URL.createObjectURL(x);$$('.v38-pfp img').forEach(function(i){i.src=u});say('Photo mise à jour','ok')}f.parentNode.removeChild(f)};f.click()},true);
  var EXP={djeneba:['Djénéba','Chief of Staff'],fatima:['Fatima','Marketing et contenu'],koffi:['Koffi','Design et marque']};
  var I_BACK=svg('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>'),I_TEL=svg('<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>'),
      I_MIN=svg('<path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/>');
  // ================= 129, 3A : chat agrandi = vrai plein écran (A et B) : barre « ← Retour », photo + prénom + métier, Appeler et Réduire, Échap
  (function(){var x=EXP[page],cw=$('#discussion .chwide');if(!x||!cw)return;
    var bar=document.createElement('div');bar.className='v44-fsb';bar.setAttribute('role','toolbar');bar.setAttribute('aria-label','Chat en plein écran');
    bar.innerHTML='<button type="button" class="btn o v44-fsback" data-h="1">'+I_BACK+' Retour</button><img src="../img/'+page+'.jpg" alt=""><span class="v44-fsn"><b>'+x[0]+'</b><small>'+x[1]+'</small></span><span class="grow"></span>'+
      '<button type="button" class="btn o v44-fscall" data-call="'+page+'" data-h="1">'+I_TEL+' Appeler</button><button type="button" class="btn o v44-fsmin" data-h="1">'+I_MIN+' Réduire</button><span class="v44-fsk">Échap pour revenir</span>';
    var bg=document.createElement('div');bg.className='v44-fsbg';bg.setAttribute('aria-hidden','true');document.body.appendChild(bg);document.body.appendChild(bar);
    function out(){if(document.body.classList.contains('chat-wide'))cw.click()}
    bar.addEventListener('click',function(e){if(e.target.closest('.v44-fsback,.v44-fsmin')){stop(e);out()}});
    // le plein écran ne se rouvre pas tout seul au chargement d'une page
    if(document.body.classList.contains('chat-wide'))out();try{localStorage.removeItem('chatWide')}catch(_){}
    new MutationObserver(function(){try{localStorage.removeItem('chatWide')}catch(_){}var on=document.body.classList.contains('chat-wide');bar.classList.toggle('on',on);bg.classList.toggle('on',on);
      if(on){var t=$('#discussion textarea, #discussion .v33-in');}}).observe(document.body,{attributes:true,attributeFilter:['class']});
  })();
  // ================= 130 c : version B, Appeler et l'écran en haut à droite de la page (comme en A) ; la carte photo garde photo, nom, métier
  (function(){var x=EXP[page],cta=$('.pcard .cta'),h=$('header.top');if(!x||!cta||!h)return;var call=$('.call',cta),sq=$('.sq',cta);if(!call)return;
    var w=document.createElement('div');w.className='v44-tcta';
    w.innerHTML='<a class="btn o v44-tcall" href="#" data-call="'+page+'" data-h="1">'+I_TEL+' Appeler</a>'+(sq?'<a class="btn o v44-tscr" href="#" data-h="1" aria-label="Voir son écran" title="Voir son écran">'+svg('<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>')+'</a>':'');
    var ref=$('.v39-ver',h)||$('.tbtn',h);h.insertBefore(w,ref);
    var ts=$('.v44-tscr',w);if(ts)ts.addEventListener('click',function(e){stop(e);sq.click()});
    document.documentElement.classList.add('v44-hasct')})();

  // ================= 127 b : fiche membre, rôle bien visible (badge), listes sans doublon, Membre → Admin simple, Admin → Membre avec confirmation
  (function(){var b=$('[data-perm]');if(!b)return;var sel=$('.prmrole',b);if(!sel)return;
    var OK=svg('<path d="M20 6 9 17l-5-5"/>');function li(a){return a.map(function(t){return '<li>'+OK+'<span>'+t+'</span></li>'}).join('')}
    var MEM=['Discuter avec ses Experts et ouvrir leur espace','Créer et gérer ses routines','Ses clés API, serveurs MCP et clés d’IA','Connecter son Drive aux livrables','Créer et partager ses tableaux de bord','Demander un nouvel Expert à l’admin'];
    var ADM=['Inviter et retirer des membres, changer les rôles','Recruter un Expert pour soi ou pour un collègue, et choisir qui y a accès','Valider les demandes des membres','Mettre en pause, arrêter ou retirer un Expert','Facturation et budget','Détails de l’entreprise, charte, canaux','Connecteurs de l’entreprise','Suivi de l’équipe'];
    var lm=$('.v36-rl[data-r="Membre de l’équipe"]',b),la=$('.v36-rl[data-r="Administrateur"]',b);
    $$('.v36-rl',b).forEach(function(d){var same=$$('.v36-rl[data-r="'+d.dataset.r+'"]',b);if(same[0]!==d)d.parentNode.removeChild(d)});lm=$('.v36-rl[data-r="Membre de l’équipe"]',b);la=$('.v36-rl[data-r="Administrateur"]',b);
    if(lm)lm.innerHTML='<ul class="v36-rlu">'+li(MEM)+'</ul>';
    if(la)la.innerHTML='<p class="v36-rlp">Tout ce que fait un membre, plus :</p><ul class="v36-rlu">'+li(ADM.filter(function(t){return t!=='Demander un nouvel Expert à l’admin'}))+'</ul>';
    var nm=($('h1')||{}).textContent||'ce membre',pre=nm.trim().split(' ')[0];
    var bd=document.createElement('span');bd.className='v44-role';
    var hd=$('h1');var row=hd&&hd.parentNode&&$$('span',hd.parentNode).filter(function(x){return /Service|Active/.test(x.textContent)})[0];
    if(row)row.parentNode.insertBefore(bd,row);else if(hd)hd.insertAdjacentElement('afterend',bd);
    function badge(){var a=sel.value==='Administrateur';bd.className='v44-role '+(a?'adm':'mem');bd.innerHTML=(a?svg('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'):svg('<circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>'))+(a?'Admin':'Membre')}
    badge();sel.addEventListener('change',badge);var go=false;
    document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.v36-rseg [data-r]');if(!a||!b.contains(a))return;
      if(go){go=false;setTimeout(badge,0);return}
      if(a.dataset.r==='Membre de l’équipe'&&sel.value==='Administrateur'){stop(e);
        if(V.modal)V.modal({ic:svg('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),tone:'warn',t:'Retirer le rôle Admin à '+pre+' ?',
          p:pre+' ne pourra plus inviter de membres, recruter, valider les demandes, gérer la facturation ni les réglages de l’entreprise. Vous pourrez lui redonner ce rôle à tout moment.',
          a:{l:'Passer '+pre+' en Membre',fn:function(){V.close();go=true;a.click();say(pre+' est maintenant Membre','ok')}},b:{l:'Annuler'}});
        return}
      if(a.dataset.r==='Administrateur'&&sel.value!=='Administrateur'){setTimeout(function(){badge();say(pre+' est maintenant Admin','ok')},0)}},true);
  })();
  // ================= 131 : Réglages > Routines sur le modèle Agent 37 : « Routines actives » en cartes pleine largeur, pause verte ronde + corbeille,
  //   « + Ajouter » à droite du titre ; Nouvelle routine = grande fenêtre deux colonnes (formulaire + Assistant IA qui remplit le formulaire)
  (function(){var x=EXP[page],RT=$('#routines'),RTM=$('#v33-rtm');if(!x||!RT||!RTM)return;var NM=x[0],FEM=page!=='koffi';
    var I_REP=svg('<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'),
        I_PAUSE='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24"><rect x="7" y="5" width="3.6" height="14" rx="1.2" fill="currentColor"/><rect x="13.4" y="5" width="3.6" height="14" rx="1.2" fill="currentColor"/></svg>',
        I_PLAY='<svg class="i s" aria-hidden="true" viewBox="0 0 24 24"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor"/></svg>',
        I_TRASH=svg('<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>'),
        I_PLUS=svg('<path d="M5 12h14M12 5v14"/>'),I_X=svg('<path d="M18 6 6 18M6 6l12 12"/>'),I_CAL=svg('<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
        I_CLK=svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),I_GLB=svg('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>'),
        I_BELL=svg('<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>'),
        I_CLIP=svg('<path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"/>'),
        I_SK=svg('<path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z"/>'),
        I_SEND=svg('<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>'),I_MIC=svg('<path d="M12 19v3"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>'),
        I_CHEV=svg('<path d="m6 9 6 6 6-6"/>'),I_CR=svg('<path d="m9 18 6-6-6-6"/>'),I_GO=svg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>');
    // --- a. liste « Routines actives »
    var hd=$('.v36-rtmv .ws-h',RT);if(hd){var h2=$('h2',hd);if(h2)h2.textContent='Routines actives';var sub=$('.xs',hd);if(sub)sub.textContent='Ce que '+NM+' fait seul'+(FEM?'e':'')+', à heure fixe.';var ad=$('.v33-rtadd',hd);if(ad){ad.className='v33-rtadd v44-rtadd';ad.innerHTML=I_PLUS+' Ajouter'}}
    var ZN={Abidjan:'GMT',Dakar:'GMT',Lagos:'GMT+1',Paris:'Europe/Paris'};
    var JS=['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
    function line(t){var off=/en pause/.test(t),h=(t.match(/(\d\d:\d\d)/)||[])[1]||'',z='GMT';for(var k in ZN)if(t.indexOf(k)>=0)z=ZN[k];
      var f;if(/Tous les jours|Chaque jour/i.test(t))f='Tous les jours';else{var j=JS.filter(function(d){return new RegExp('\\b'+d+'\\b','i').test(t)})[0];if(j&&/Chaque|semaine/i.test(t))f='Tous les '+j+'s';else if(/semaine/i.test(t))f='Toutes les semaines';
        else if(/mois/i.test(t)){var dm=t.match(/le (\d+|1er)/);f='Tous les mois'+(dm?', le '+dm[1]:'')}else{var u=t.match(/le (\d+ [^,\s]+)/);f='Une fois'+(u?', le '+u[1]:'')}}
      var nx=(t.match(/prochaine (dans [^,]*)/)||[])[1]||'';nx=nx.replace(/ h$/,' heures').replace(/ min$/,' minutes').replace(/ j$/,' jours');
      return [f,h+' ('+z+')',off?'en pause':nx].filter(Boolean)}
    function deco(){$$('.v33-rts .v33-rt',RT).forEach(function(r){var sm=$('small',r),rp=$('.v33-rp',r),rx=$('.v33-rx',r);if(!sm)return;var key=sm.textContent+(r.classList.contains('off')?'0':'1');if(r.dataset.v44===key)return;
      var name=($('b',r)||{}).textContent||'',tg=window.v44trig&&window.v44trig[name],L=tg?tg:line(sm.textContent);
      sm.innerHTML=I_REP+'<span>'+L.map(function(p,i){return i===L.length-1&&!tg&&L.length>2?'<em>'+esc(p)+'</em>':esc(p)}).join(' · ')+'</span>';sm.classList.add('v44-rtl');
      if(rp){var on=!r.classList.contains('off');rp.className='v33-rp v44-rtpz'+(on?'':' off');rp.innerHTML=on?I_PAUSE:I_PLAY;rp.setAttribute('aria-label',(on?'Mettre en pause ':'Reprendre ')+name);rp.title=on?'Mettre en pause':'Reprendre'}
      if(rx){rx.className='v33-rx v44-rtx';rx.innerHTML=I_TRASH;rx.title='Supprimer'}
      r.dataset.v44=sm.textContent+(r.classList.contains('off')?'0':'1')})}
    var box=$('.v33-rts',RT);if(box){deco();new MutationObserver(deco).observe(box,{childList:true,subtree:true,characterData:true})}
    // --- b. fenêtre Nouvelle routine (Agent 37), en français, aux couleurs Yelema
    var SKL=$$('.v33-rsk label',RTM).map(function(l){return l.textContent.trim()});if(!SKL.length)SKL=['Rédaction','Synthèse','Recherche'];
    var TRG=['Quand un email arrive dans sa boîte','Quand un fichier arrive dans ses Livrables','Quand vous lui écrivez sur Telegram','Quand un rendez-vous est ajouté à son agenda'];
    var REP=[['day','Tous les jours'],['week','Toutes les semaines'],['month','Tous les mois']],ZZ=[['Abidjan','Africa/Abidjan · GMT'],['Dakar','Africa/Dakar · GMT'],['Lagos','Africa/Lagos · GMT+1'],['Paris','Europe/Paris · GMT+2']];
    var EXQ={djeneba:'Chaque lundi à 9 h, prépare le point de la semaine pour la direction',fatima:'Tous les jours à 10 h, prépare un post pour la promo Sossa',koffi:'Chaque vendredi à 16 h, décline les visuels validés de la semaine'}[page];
    var M=document.createElement('div');M.className='v44-rtm';M.setAttribute('role','dialog');M.setAttribute('aria-modal','true');M.setAttribute('aria-label','Nouvelle routine');
    M.innerHTML='<div class="v44-rtov" data-x="1"></div><div class="v44-rtp2"><section class="v44-rtf">'+
      '<header class="v44-rth"><img src="../img/'+page+'.jpg" alt=""><span>'+NM+'</span>'+I_CR+'<b>Nouvelle routine</b><span class="grow"></span><button type="button" class="v44-rtc" data-h="1" data-x="1" aria-label="Fermer">'+I_X+'</button></header>'+
      '<input class="v44-rtn" type="text" maxlength="60" placeholder="Nom de la routine (facultatif)…" aria-label="Nom de la routine (facultatif)">'+
      '<textarea class="v44-rtd" placeholder="Décrivez la tâche à faire…" aria-label="Décrivez la tâche à faire"></textarea>'+
      '<div class="v44-rtatt" hidden></div>'+
      '<div class="v44-rtbar"><span class="v44-rtdd" data-k="d" data-m="date"></span><span class="v44-rtdd" data-k="h" data-m="time"></span>'+
        '<span class="v44-rtdd" data-k="z"></span><span class="v44-rtdd" data-k="f" data-m="rec"></span>'+
        '<span class="v44-rtdd v44-rtdd2" data-k="t" data-m="trg"></span></div>'+
      '<footer class="v44-rtft"><div class="v44-rtmo" role="radiogroup" aria-label="Quand"><button type="button" role="radio" data-h="1" data-mo="date" class="on" aria-checked="true">'+I_CAL+'Plus tard</button><button type="button" role="radio" data-h="1" data-mo="rec" aria-checked="false">'+I_REP+'Récurrent</button></div>'+
        '<span class="v44-rtsep" aria-hidden="true"></span><label class="v44-rtclip" title="Joindre un fichier"><input type="file" hidden>'+I_CLIP+'<span class="v44-sr">Joindre un fichier</span></label>'+
        '<span class="v44-rtskw"><button type="button" class="v44-rtsk" data-h="1" aria-expanded="false">'+I_SK+'Compétences <em></em></button><span class="v44-rtskl" hidden>'+SKL.map(function(t,i){return '<label><input type="checkbox"'+(i<2?' checked':'')+'> '+esc(t)+'</label>'}).join('')+'</span></span>'+
        '<span class="grow"></span><button type="button" class="btn p v44-rtgo" data-h="1">'+I_GO+'Créer</button></footer></section>'+
      '<aside class="v44-rta"><h3>Assistant IA</h3><div class="v44-rtam" aria-live="polite"><p class="v44-rtah">Décrivez la tâche que vous voulez créer…<small>Par exemple : « '+esc(EXQ)+' ». Je remplis le formulaire pour vous.</small></p></div>'+
        '<div class="v44-rtai"><textarea class="v44-rtaq" rows="2" placeholder="Décrivez votre tâche…" aria-label="Décrivez votre tâche à l’assistant"></textarea><div class="v44-rtaib"><span class="grow"></span><button type="button" class="v44-rtmic" data-h="1" aria-label="Dicter">'+I_MIC+'</button><button type="button" class="v44-rtsend" data-h="1" aria-label="Envoyer à l’assistant" disabled>'+I_SEND+'</button></div></div></aside></div>';
    document.body.appendChild(M);
    var JJ=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],DATES=[],HOURS=[];
    for(var di=0;di<31;di++){var dz=new Date(2026,9,4+di);DATES.push([dz.getFullYear()+'-'+('0'+(dz.getMonth()+1)).slice(-2)+'-'+('0'+dz.getDate()).slice(-2),(di===0?'Aujourd’hui':di===1?'Demain':JJ[dz.getDay()].charAt(0).toUpperCase()+JJ[dz.getDay()].slice(1))+' '+dz.getDate()+' '+(dz.getMonth()===9?'oct.':'nov.')+' 2026'])}
    for(var hz=0;hz<24;hz++)for(var mz=0;mz<60;mz+=15)HOURS.push([('0'+hz).slice(-2)+':'+('0'+mz).slice(-2),('0'+hz).slice(-2)+':'+('0'+mz).slice(-2)]);
    var S={mo:'date',f:'day',z:'Abidjan',t:0,d:'2026-10-05',h:'09:00'};
    function dd(el,opts,get,set){el.innerHTML='<button type="button" class="v44-rtq v44-ddb" data-h="1" aria-haspopup="listbox" aria-expanded="false">'+({z:I_GLB,f:I_REP,t:I_BELL,d:I_CAL,h:I_CLK}[el.dataset.k])+'<span></span>'+I_CHEV+'</button><span class="v44-ddl" role="listbox" hidden>'+opts.map(function(o,i){return '<button type="button" role="option" data-h="1" data-v="'+i+'">'+esc(o[1])+'</button>'}).join('')+'</span>';
      var b=$('.v44-ddb',el),l=$('.v44-ddl',el);function paint(){var v=get(),o=opts.filter(function(q){return q[0]===v})[0];$('span',b).textContent=o?o[1]:'';$$('[role=option]',l).forEach(function(q){q.setAttribute('aria-selected',opts[+q.dataset.v][0]===v)})}
      b.addEventListener('click',function(e){stop(e);var was=!l.hidden;$$('.v44-ddl',M).forEach(function(q){q.hidden=true});l.hidden=was;b.setAttribute('aria-expanded',!was);if(!was){var c=$('[aria-selected="true"]',l);if(c)l.scrollTop=c.offsetTop-80}});
      l.addEventListener('click',function(e){var o=e.target.closest('[role=option]');if(!o)return;stop(e);set(opts[+o.dataset.v][0]);l.hidden=true;b.setAttribute('aria-expanded','false');paint()});paint();return paint}
    var pz=dd($('[data-k=z]',M),ZZ,function(){return S.z},function(v){S.z=v}),pf=dd($('[data-k=f]',M),REP,function(){return S.f},function(v){S.f=v}),
        pt=dd($('[data-k=t]',M),TRG.map(function(t,i){return [i,t]}),function(){return S.t},function(v){S.t=v}),
        pd=dd($('[data-k=d]',M),DATES,function(){return S.d},function(v){S.d=v}),ph=dd($('[data-k=h]',M),HOURS,function(){return S.h},function(v){S.h=v});
    function mode(m){S.mo=m;M.dataset.mo=m;$$('.v44-rtmo button',M).forEach(function(b){var on=b.dataset.mo===m;b.classList.toggle('on',on);b.setAttribute('aria-checked',on)})}
    var N=$('.v44-rtn',M),D=$('.v44-rtd',M),AQ=$('.v44-rtaq',M),AM=$('.v44-rtam',M),SEND=$('.v44-rtsend',M);
    function skc(){var n=$$('.v44-rtskl input:checked',M).length;$('.v44-rtsk em',M).textContent=n?'('+n+')':''}skc();
    function open(){N.value='';D.value='';AQ.value='';SEND.disabled=true;AM.innerHTML='<p class="v44-rtah">Décrivez la tâche que vous voulez créer…<small>Par exemple : « '+esc(EXQ)+' ». Je remplis le formulaire pour vous.</small></p>';
      S={mo:'date',f:'day',z:'Abidjan',t:0,d:'2026-10-05',h:'09:00'};mode('date');pz();pf();pt();pd();ph();var at=$('.v44-rtatt',M);at.hidden=true;at.innerHTML='';
      M.classList.add('on');document.body.classList.add('v44-rtopen');setTimeout(function(){try{D.focus()}catch(_){}},50)}
    function close(){M.classList.remove('on');document.body.classList.remove('v44-rtopen');$$('.v44-ddl',M).forEach(function(q){q.hidden=true})}
    // l'assistant lit la demande et remplit le formulaire (nom, consigne, quand)
    function fill(q){var t=q.toLowerCase(),h=t.match(/(\d{1,2})\s*(?:h|:)\s*(\d{2})?/),hh=h?('0'+h[1]).slice(-2)+':'+(h[2]||'00'):'09:00';
      var j=JS.filter(function(d){return t.indexOf(d)>=0})[0];
      if(/tous les jours|chaque jour|chaque matin|chaque soir/.test(t)){mode('rec');S.f='day'}else if(j||/semaine/.test(t)){mode('rec');S.f='week';if(j){S.d='2026-10-'+('0'+(5+JS.indexOf(j))).slice(-2)}}
      else if(/mois/.test(t)){mode('rec');S.f='month'}else if(/quand|dès qu|chaque fois/.test(t)){mode('trg');S.t=/mail/.test(t)?0:/fichier|livrable/.test(t)?1:/telegram|message/.test(t)?2:3}else mode('date');
      if(HOURS.some(function(o){return o[0]===hh}))S.h=hh;pf();pt();pd();ph();
      var c=q.replace(/^(chaque|tous les|toutes les)\s+\S+(\s+(à|a)\s+\d{1,2}\s*(h|:)\s*\d{0,2})?,?\s*/i,'').replace(/\.$/,'');c=c.charAt(0).toUpperCase()+c.slice(1);
      D.value=c+'. Range le résultat dans les Livrables et préviens-moi dans tous mes canaux. Demande mon accord avant tout envoi à l’extérieur.';
      var nm=c.replace(/^(prépare|fais|rédige|décline|envoie|écris)\s+(moi\s+)?(le|la|les|un|une|des)?\s*/i,'').split(/\s+/).slice(0,4).join(' ');N.value=nm.charAt(0).toUpperCase()+nm.slice(1);
      var when=S.mo==='rec'?(S.f==='day'?'tous les jours':S.f==='week'?(j?'tous les '+j+'s':'toutes les semaines'):'tous les mois')+' à '+hh:S.mo==='trg'?TRG[S.t].toLowerCase():'le 5 octobre à '+hh;
      return 'C’est rempli : <b>'+esc(N.value)+'</b>, '+esc(when)+'. Relisez à gauche, ajustez si besoin, puis touchez Créer.'}
    function ask(){var q=AQ.value.trim();if(!q){AQ.focus();return}var h=$('.v44-rtah',AM);if(h)h.parentNode.removeChild(h);AM.insertAdjacentHTML('beforeend','<p class="v44-rtu">'+esc(q)+'</p><p class="v44-rtr v44-rtwait">Je prépare la routine…</p>');AQ.value='';SEND.disabled=true;AM.scrollTop=AM.scrollHeight;
      setTimeout(function(){var w=$('.v44-rtwait',AM);if(w){w.classList.remove('v44-rtwait');w.innerHTML=fill(q)}AM.scrollTop=AM.scrollHeight},600)}
    function create(b){var c=D.value.trim();if(!c){say('Décrivez la tâche à faire','warn');D.focus();return}
      var f=S.mo==='date'?'once':S.mo==='trg'?'day':S.f,dt=S.d,hh=S.h;
      var nm=N.value.trim()||c.split(/\s+/).slice(0,5).join(' ').replace(/[.,;:]$/,'');
      $('.v33-rc',RTM).value=c;$('.v33-rn',RTM).value=nm;$('.v33-rf',RTM).value=f;$('.v33-rd',RTM).value=dt;$('.v33-rh',RTM).value=hh;$('.v33-rz',RTM).value=S.z;
      if(S.mo==='trg'){window.v44trig=window.v44trig||{};window.v44trig[nm]=['Déclencheur',TRG[S.t].charAt(0).toLowerCase()+TRG[S.t].slice(1)]}
      window.v36rt={days:f==='week'?[new Date(dt+'T12:00').getDay()]:null};
      b.disabled=true;b.classList.add('v44-busy');setTimeout(function(){b.disabled=false;b.classList.remove('v44-busy');var ok=$('.v33-rok',RTM);ok._v36go=1;try{ok.click()}finally{ok._v36go=0}window.v36rt=null;RTM.classList.remove('on');close();
        var first=$('#routines .v33-rt');if(first){first.classList.add('v36-flash');setTimeout(function(){first.classList.remove('v36-flash')},1800)}},600)}
    M.addEventListener('click',function(e){var t=e.target;
      var chip=t.closest('.v44-rtchip button');if(chip){stop(e);var at0=$('.v44-rtatt',M);at0.hidden=true;at0.innerHTML='';$('.v44-rtclip input',M).value='';return}
      if(t.closest('[data-x]')){stop(e);close();return}
      var mo=t.closest('.v44-rtmo button');if(mo){stop(e);mode(mo.dataset.mo);return}
      var sk=t.closest('.v44-rtsk');if(sk){stop(e);var l=$('.v44-rtskl',M);l.hidden=!l.hidden;sk.setAttribute('aria-expanded',!l.hidden);return}
      if(t.closest('.v44-rtsend')){stop(e);ask();return}
      if(t.closest('.v44-rtmic')){stop(e);var mc=t.closest('.v44-rtmic');if(mc.classList.contains('rec'))return;mc.classList.add('rec');AQ.placeholder='Je vous écoute…';setTimeout(function(){mc.classList.remove('rec');AQ.placeholder='Décrivez votre tâche…';AQ.value=EXQ;SEND.disabled=false;AQ.focus()},1300);return}
      if(t.closest('.v44-rtgo')){stop(e);create(t.closest('.v44-rtgo'));return}
      if(!t.closest('.v44-rtdd'))$$('.v44-ddl',M).forEach(function(q){q.hidden=true});
      if(!t.closest('.v44-rtskw')){var l2=$('.v44-rtskl',M);if(l2&&!l2.hidden){l2.hidden=true;$('.v44-rtsk',M).setAttribute('aria-expanded','false')}}});
    M.addEventListener('change',function(e){if(e.target.closest('.v44-rtskl'))skc();var fi=e.target.closest('.v44-rtclip input');if(fi&&fi.files&&fi.files[0]){var at=$('.v44-rtatt',M);at.hidden=false;at.innerHTML='<span class="v44-rtchip">'+I_CLIP+esc(fi.files[0].name)+'<button type="button" data-h="1" aria-label="Retirer la pièce jointe">'+I_X+'</button></span>'}});
    AQ.addEventListener('input',function(){SEND.disabled=!AQ.value.trim()});
    AQ.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask()}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&M.classList.contains('on')){stop(e);close()}},true);
    // tout ce qui ouvrait l’ancienne fenêtre (bouton Ajouter, raccourci Yélé « Créer une routine », ?nouvelle=1) ouvre celle-ci
    window.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-open="v33-rtm"]');if(!b)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();RTM.classList.remove('on');
      var y=$('#yele');if(y)y.classList.remove('on');open()},true);
    window.v44routine=open})();

  // ================= 128 : Yélé, 6 raccourcis dans l'ordre de Leslie ; « Signaler un bug » demande page, action, ce qui s'est passé, puis relaie
  (function(){var Y=$('#yele');if(!Y)return;var sg=$('.sugg',Y);
    var L=['Recruter un Expert','Connecter mes outils','Ma facture','Créer une routine','Créer un tableau','Signaler un bug'];
    // on garde les raccourcis existants (leurs gestionnaires sont posés dessus), on renomme le premier et on ajoute « Signaler un bug »
    if(sg){var ex=$$('span',sg);if(ex[0]&&/recruter/i.test(ex[0].textContent))ex[0].textContent=L[0];
      var have=$$('span',sg).map(function(x){return x.textContent.trim()});L.forEach(function(t){if(have.indexOf(t)<0){var n=document.createElement('span');n.textContent=t;if(t==='Signaler un bug')n.className='v44-bug';sg.appendChild(n)}});
      L.forEach(function(t){var e=$$('span',sg).filter(function(x){return x.textContent.trim()===t})[0];if(e)sg.appendChild(e)})}
    var bug=false;
    function add(cls,html){var inp=$('.inp',Y),m=document.createElement('div');m.className='msg '+cls;m.style.marginTop=cls==='moi'?'10px':'8px';m.innerHTML='<div class="bub">'+html+'</div>';inp.parentNode.insertBefore(m,inp);return m}
    Y.addEventListener('click',function(e){var sp=e.target.closest&&e.target.closest('.sugg span');if(!sp||sp.textContent.trim()!=='Signaler un bug')return;stop(e);
      $$('.msg.lui .bub',Y).forEach(function(b){b.dataset.v44='old'});
      add('moi','Signaler un bug');if(sg)sg.hidden=true;
      add('lui v44-bugq','Merci de me le signaler. Décrivez-moi en quelques mots :<ol class="v44-bugl"><li>la page où vous étiez,</li><li>ce que vous avez fait (le bouton, l’action),</li><li>ce qui s’est passé, et ce que vous attendiez.</li></ol>Je transmets tout à l’équipe Yelema.');
      bug=true;var i=$('.v33-in, textarea, input[type=text]',Y);if(i){i.placeholder='Page, action, ce qui s’est passé…';try{i.focus()}catch(_){}}
      Y.scrollTop=Y.scrollHeight},true);
    new MutationObserver(function(){if(!bug)return;$$('.msg.lui .bub',Y).forEach(function(b){if(b.dataset.v44||!b.closest('.msg').previousElementSibling)return;var t=b.textContent;if(/^Yélé réfléchit/.test(t))return;
      if(b.closest('.v44-bugq'))return;b.dataset.v44='bug';b._v40=1;bug=false;
      b.innerHTML='C’est noté, merci. J’ai transmis votre signalement à l’équipe Yelema, avec la page où vous êtes ('+esc(document.title.split(/[|·]/)[0].trim()||page)+'). Elle vous répond ici, sous une heure ouvrée.';
      var i=$('.v33-in, textarea, input[type=text]',Y);if(i)i.placeholder='Posez votre question à Yélé';Y.scrollTop=Y.scrollHeight})}).observe(Y,{subtree:true,childList:true,characterData:true});
  })();
})();
/* v4.45 (add89, suite) : point 132 b, fenêtre « Ajouter un serveur MCP » (admin et Réglages > Connecteurs d’un expert). Préfixe v45-. */
(function(){
  function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
  function esc(t){return String(t==null?'':t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function stop(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
  function svg(p){return '<svg class="i s" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>'}
  var V=window.v36||{},say=function(m,t){(V.toast||window.toast||function(){})(m,t)};if(!V.modal)return;
  var page=(location.pathname.split('/').pop()||'').replace('.html','');
  var SRV=svg('<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>'),
      OK=svg('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),KO=svg('<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>'),
      CHK=svg('<path d="M20 6 9 17l-5-5"/>'),CHEV=svg('<path d="m6 9 6 6 6-6"/>'),EYE=svg('<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>'),
      EYEX=svg('<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>'),
      EXT=svg('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3"/>');
  var EXP=[['djeneba','Djénéba'],['fatima','Fatima'],['koffi','Koffi']],NOMS={djeneba:'Djénéba',fatima:'Fatima',koffi:'Koffi'};
  var TOOLS=['chercher','lire_fiche','lister_elements','creer_element','modifier_element','supprimer_element','exporter_csv','lire_historique','lister_utilisateurs','envoyer_notification','lire_stock','resume_du_jour'];
  // nom proposé à partir de l'adresse : https://mcp.notion.com/sse → Notion
  function guess(u){var m=/^https?:\/\/([^\/:?#]+)/i.exec(u.trim());if(!m)return '';var p=m[1].toLowerCase().split('.').filter(function(x){return !/^(www|mcp|api|app|server|srv)$/.test(x)});
    if(p.length>1)p.pop();var n=p.length>1&&p[p.length-1].length<=3?p[0]:p[p.length-1]||p[0]||'';return n?n.charAt(0).toUpperCase()+n.slice(1):''}
  function valid(u){return /^https:\/\/[^\s\/.]+\.[^\s\/]{2,}(\/\S*)?$/i.test(u)}
  function open(o){var adm=!!o.admin,st={ok:0,auth:'none',oauth:0,named:0};
    var body='<div class="v45-mcp'+(adm?' v45-adm':'')+'">'+
      '<div class="v45-f"><label class="v45-l" for="v45-u">Adresse du serveur</label><div class="v45-ur"><input id="v45-u" class="fi v45-u" type="url" inputmode="url" autocomplete="off" spellcheck="false" placeholder="https://mcp.exemple.com/mcp"><button type="button" class="btn o v45-tst" data-h="1">Tester</button></div>'+
        '<div class="v45-res" aria-live="polite"></div></div>'+
      '<div class="v45-f"><label class="v45-l" for="v45-n">Nom</label><input id="v45-n" class="fi v45-n" type="text" maxlength="60" placeholder="Rempli depuis l’adresse"></div>'+
      '<div class="v45-f"><span class="v45-l" id="v45-cl">Connexion</span><div class="v45-seg" role="radiogroup" aria-labelledby="v45-cl">'+
        [['none','Aucune'],['key','Clé d’accès'],['oauth','Se connecter avec le compte']].map(function(a,i){return '<button type="button" class="v45-pil'+(i?'':' on')+'" role="radio" aria-checked="'+(i?'false':'true')+'" data-c="'+a[0]+'" data-h="1">'+a[1]+'</button>'}).join('')+'</div>'+
        '<div class="v45-cz">'+
          '<p class="v45-cp" data-c="none">Le serveur est ouvert : aucune clé à donner.</p>'+
          '<div class="v45-cp" data-c="key" hidden><div class="v45-kw"><input class="fi v45-k" type="password" autocomplete="off" spellcheck="false" placeholder="Collez la clé d’accès du service" aria-label="Clé d’accès"><button type="button" class="v45-eye" data-h="1" aria-label="Afficher la clé" aria-pressed="false">'+EYE+'</button></div></div>'+
          '<div class="v45-cp" data-c="oauth" hidden><button type="button" class="btn o v45-oa" data-h="1">'+EXT+' <span>Ouvrir la page de connexion du service</span></button></div>'+
        '</div></div>'+
      (adm?'<div class="v45-f"><span class="v45-l" id="v45-xl">Experts qui y ont accès</span><div class="v45-xs" role="group" aria-labelledby="v45-xl"><button type="button" class="v45-all on" data-h="1" aria-pressed="true">Tous</button>'+
        EXP.map(function(x){return '<button type="button" class="v45-x on" data-x="'+x[0]+'" data-h="1" aria-pressed="true"><span class="v45-xp"><img src="../img/'+x[0]+'.jpg" alt=""><i>'+CHK+'</i></span><small>'+x[1]+'</small></button>'}).join('')+'</div></div>':'')+
      '</div>';
    var M=V.modal({ic:SRV,tone:'info',t:'Ajouter un serveur MCP',p:adm?'Branché une fois pour l’entreprise, puis donné aux Experts choisis.':'Il donne à '+(NOMS[page]||'votre Expert')+' les outils de vos logiciels internes.',body:body,
      a:{l:'Ajouter',fn:function(){if(!st.ok){res('ko','Testez d’abord le serveur : « Ajouter » s’active après un test réussi.');T.focus();return}
        var sel=adm?$$('.v45-x.on',P).map(function(b){return b.dataset.x}):[];if(adm&&!sel.length){say('Choisissez au moins un Expert','warn');return}
        var n=N.value.trim()||guess(U.value)||'Serveur MCP';V.close();(o.onAdd||function(){})({n:n,u:U.value.trim(),k:st.ok,ex:sel,all:adm&&sel.length===EXP.length});say('Serveur « '+n+' » ajouté, '+st.ok+' outils','ok')}},b:{l:'Annuler'}});
    var P=$('.pn',M);P.classList.add('v45-pn');if(adm)P.classList.add('v45-pna');var U=$('.v45-u',P),N=$('.v45-n',P),T=$('.v45-tst',P),R=$('.v45-res',P),A=$('.v36-mb1',P),K=$('.v45-k',P);
    A.classList.add('v45-off');A.title='Testez d’abord le serveur';setTimeout(function(){U.focus()},60);
    function res(k,h){R.className='v45-res v45-'+k;R.innerHTML=k==='ko'?KO+'<span>'+esc(h)+'</span>':h}
    function reset(){if(st.ok){st.ok=0;A.classList.add('v45-off');A.title='Testez d’abord le serveur'}if(!T._v36b)res('', '')}
    function test(){var u=U.value.trim();if(T._v36b)return;
      if(!u){res('ko','Entrez l’adresse du serveur. Elle commence par https://');U.focus();return}
      if(!valid(u)){res('ko',(/^http:\/\//i.test(u)?'Adresse non sécurisée : elle doit commencer par https://, pas http://':'Cette adresse n’est pas valide. Exemple : https://mcp.exemple.com/mcp'));U.focus();U.select();return}
      if(st.auth==='key'&&K.value.trim().length<6){res('ko','Collez la clé d’accès avant de tester.');K.focus();return}
      if(st.auth==='oauth'&&!st.oauth){res('ko','Connectez-vous au compte du service avant de tester.');$('.v45-oa',P).focus();return}
      if(!N.value.trim())N.value=guess(u);res('wait','<span class="v36-spin" aria-hidden="true"></span><span>Connexion au serveur…</span>');V.busy&&V.busy(T,'Test…');
      setTimeout(function(){V.unbusy&&V.unbusy(T);st.ok=TOOLS.length;A.removeAttribute('title');A.classList.remove('v45-off');
        res('ok','<button type="button" class="v45-tg" data-h="1" aria-expanded="false">'+OK+'<b>'+st.ok+' outils trouvés</b><span class="v45-tgl">Voir les outils</span>'+CHEV+'</button><ul class="v45-tl" hidden>'+TOOLS.map(function(t){return '<li><code>'+t+'</code></li>'}).join('')+'</ul>')},1100)}
    T.addEventListener('click',function(e){stop(e);test()});
    U.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();test()}});
    U.addEventListener('input',function(){reset();if(!st.named)N.value=guess(U.value)});
    N.addEventListener('input',function(){st.named=!!N.value.trim()});
    K.addEventListener('input',reset);
    P.addEventListener('click',function(e){var t=e.target;
      var pl=t.closest('.v45-pil');if(pl){stop(e);st.auth=pl.dataset.c;$$('.v45-pil',P).forEach(function(b){var on=b===pl;b.classList.toggle('on',on);b.setAttribute('aria-checked',on)});
        $$('.v45-cp',P).forEach(function(z){z.hidden=z.dataset.c!==st.auth});reset();if(st.auth==='key')K.focus();return}
      var ey=t.closest('.v45-eye');if(ey){stop(e);var sh=K.type==='password';K.type=sh?'text':'password';ey.innerHTML=sh?EYEX:EYE;ey.setAttribute('aria-pressed',sh);ey.setAttribute('aria-label',sh?'Masquer la clé':'Afficher la clé');return}
      var oa=t.closest('.v45-oa');if(oa){stop(e);if(st.oauth){st.oauth=0;oa.classList.remove('v45-oaok');oa.innerHTML=EXT+' <span>Ouvrir la page de connexion du service</span>';reset();return}
        var h=(/^https?:\/\/([^\/]+)/i.exec(U.value.trim())||[,''])[1];V.busy&&V.busy(oa,'Page de connexion'+(h?' de '+h:'')+' ouverte…');
        setTimeout(function(){V.unbusy&&V.unbusy(oa);st.oauth=1;oa.classList.add('v45-oaok');oa.innerHTML=OK+' <span>Compte connecté'+(h?' ('+esc(h)+')':'')+'</span><small>Changer</small>';reset();say('Compte connecté','ok')},1300);return}
      var tg=t.closest('.v45-tg');if(tg){stop(e);var l=tg.nextElementSibling,op=l.hidden;l.hidden=!op;tg.setAttribute('aria-expanded',op);$('.v45-tgl',tg).textContent=op?'Masquer les outils':'Voir les outils';tg.classList.toggle('v45-tgo',op);return}
      var al=t.closest('.v45-all');if(al){stop(e);$$('.v45-x',P).forEach(function(b){b.classList.add('on');b.setAttribute('aria-pressed','true')});al.classList.add('on');al.setAttribute('aria-pressed','true');return}
      var x=t.closest('.v45-x');if(x){stop(e);var on=!x.classList.contains('on');x.classList.toggle('on',on);x.setAttribute('aria-pressed',on);var all=$$('.v45-x.on',P).length===EXP.length,ab=$('.v45-all',P);ab.classList.toggle('on',all);ab.setAttribute('aria-pressed',all);return}});
  }
  window.v45mcp=open;
  // admin : Connecteurs > Serveurs MCP > « Ajouter un serveur MCP » (avant le gestionnaire d’add88 qui ouvrait « Ajouter une connexion »)
  window.addEventListener('click',function(e){var t=e.target;if(!t.closest)return;
    var am=t.closest('.v33-mcp [data-open="v33-key"][data-v33s="ent"]');if(am){stop(e);open({admin:1,onAdd:function(r){var tb=$('.v33-mcp .v33-kl');if(!tb)return;var tr=document.createElement('tr');tr.className='v36-flash';
        tr.innerHTML='<td><b>'+esc(r.n)+'</b> <span class="pill br">Entreprise</span><span class="v45-co">'+CHK+'Connecté</span></td><td class="hide-m"><code class="xs">'+esc(r.u)+'</code></td><td>'+(r.all?'Tous les Experts':esc(r.ex.map(function(x){return NOMS[x]}).join(', ')))+'</td><td><a class="btn o sm" href="#" data-open="cxa" data-h="1" data-app="'+esc(r.n)+'"> Attribuer</a></td>';
        (tb.tBodies[0]||tb).appendChild(tr);var at=$('[data-open="cxa"]',tr);at.addEventListener('click',function(ev){ev.preventDefault();var m=document.getElementById('cxa'),z=m&&$('.czn',m);if(z)z.textContent=at.dataset.app;if(m)m.classList.add('on')})}});return}
    // expert : Réglages > Connecteurs > API et MCP > « Ajouter un serveur MCP » (remplace la fenêtre d’add86)
    var sa=t.closest('#connecteurs .v36-sadd');if(sa){stop(e);var sec=sa.closest('.v35-sec'),TM=sec&&$('.v35-t',sec);open({onAdd:function(r){if(!TM)return;var d=document.createElement('div');d.className='v35-r v36-flash';d.setAttribute('role','row');
        d.dataset.by='vous';d.dataset.kind='mcp';
        d.innerHTML='<b role="cell" class="v35-nm">'+esc(r.n)+'<small class="v36-by">Ajouté par vous</small></b><span role="cell" data-l="Adresse"><span class="v35-k"><code>'+esc(r.u.replace(/^https?:\/\//,''))+'</code></span></span><span role="cell" class="v35-m" data-l="Outils">'+r.k+' outils</span><span role="cell" class="v35-m" data-l="Dernier appel">jamais</span><span role="cell" class="v35-ok v45-co">'+CHK+'Connecté</span>';
        var mb=$('.v36-rmb',TM),c=document.createElement('span');c.className='v36-rm';c.setAttribute('role','cell');
        c.innerHTML='<button type="button" class="v36-rmb" data-h="1" aria-haspopup="menu" aria-expanded="false" aria-label="Plus d’actions">'+(mb?mb.innerHTML:'⋯')+'</button><span class="v36-rmm" role="menu" hidden><button type="button" role="menuitem" class="v36-rren" data-h="1">Renommer</button><button type="button" role="menuitem" class="v36-rdel" data-h="1">Retirer</button></span>';
        d.appendChild(c);TM.appendChild(d)}});return}},true);
})();

/* couche 91 */
/* Couche 90 (passe qualité V1, 04/10) : réservé aux retouches de comportement de la passe. */
