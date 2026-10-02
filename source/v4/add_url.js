// v4.28 : lien d'un tableau = <entreprise>.yelema.ai/<personne>/<tableau>
window.tbSlug=function(t){return (t||'tableau').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\(copie\)/,'copie').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')};
window.tbUrl=function(el){var p=el&&el.closest?el.closest('.panel'):null;var id=p?p.id.replace(/^tb-/,'').replace(/-copie$/,''):'';
  var own={adjoua:'fanta-bakayoko',kouassi:'kader-ouattara'}[id]||'aicha-diabate';var h=p&&p.querySelector('h2');
  return 'unifood.yelema.ai/'+own+'/'+window.tbSlug(h?h.textContent:'')};
