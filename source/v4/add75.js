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
