// tableau de bord : niveau 1 = lien web + Google Slides + Enregistrer comme modèle ; niveau 2 = Modifier, Télécharger, Copier le lien, Partager
(function(){var ARW='<svg class="i s" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>',
  LNK='<svg class="i s" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>';
  function slug(t){return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\(copie\)/,'copie').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  document.querySelectorAll('.tbh2').forEach(function(h){var act=h.querySelector('.tbact');if(!act||h.nextElementSibling&&h.nextElementSibling.classList.contains('tblv1'))return;
    var t=(h.querySelector('h2')||{}).textContent||'tableau',u='yelema.ai/t/'+slug(t);
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
