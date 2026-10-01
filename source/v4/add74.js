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
    if(![].some.call(s.options,function(o){return o.value==='autre'||o.text==='Autre'}))return;
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
    m.querySelector('.tpln').value='Modèle : '+a.dataset.tpl;
    var p=a.closest('.panel'),n=p?p.querySelectorAll('.mwg2>*').length:0,f=p?[].map.call(p.querySelectorAll('.mwg2 .wt,.mwg2 h3'),function(x){return x.textContent.trim()}).slice(0,4):[];
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
