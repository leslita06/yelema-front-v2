P = "build4.py"
s = open(P).read()
def R(a, b, n=1):
    global s
    assert s.count(a) >= 1, a[:90]
    s = s.replace(a, b, n)

# --- apprentissages : 3 de chaque + prochaines étapes
R('''for _k, (_a, _d, _b, _n) in LEARN.items():''', '''LEARN_PLUS = {
 "djeneba": (["Le DG valide plus vite quand la note tient sur une page."], ["Le calendrier de la ligne dépend de la livraison de la machine.", "Trois réunions par semaine avec la mairie, c'est trop."],
             ["Permis d'extension : deux pièces manquent à la mairie.", "Budget média Super Mint pas encore signé."],
             ["Relancer la mairie de Yopougon vendredi avec les deux pièces.", "Préparer la note de comité du 8 octobre."]),
 "fatima": (["Les visuels avec le prix en grand vendent mieux en boutique."], ["Tenir quatre réseaux avec le même budget.", "Les newsletters perdent des abonnés après le troisième envoi du mois."],
            ["Budget TikTok de Super Mint en attente de validation.", "Pas encore d'accès à la page LinkedIn d'Unifood."],
            ["Publier le bilan de la promo Sossa lundi.", "Proposer un calendrier éditorial d'octobre."]),
 "koffi": (["Livrer en trois formats d'un coup évite les allers et retours."], ["Les délais de l'imprimeur passent à huit jours en octobre.", "Deux marques à faire vivre avec la même équipe."],
           ["Photos HD des produits Sossa manquantes.", "Le fichier vectoriel du logo Super Mint n'est pas retrouvé."],
           ["Présenter trois pistes de packaging Super Mint.", "Commander les bâches du salon SIAL."]),
 "adjoua": (["Les annonces avec le salaire reçoivent trois fois plus de candidatures."], ["Les profils de commerciaux terrain se font rares à Korhogo.", "Délai moyen de recrutement : 24 jours, objectif 18."],
            ["Deux managers n'ont pas rempli leurs grilles d'entretien.", "Le budget des annonces payantes n'est pas validé."],
            ["Relancer les managers pour les scorecards avant jeudi.", "Préparer les contrats des deux commerciaux retenus."]),
 "kouassi": (["Les grossistes répondent mieux sur WhatsApp que par téléphone.", "Les promotions de fin de mois vident les stocks trop tôt."], ["Objectif du trimestre à 82 %.", "Peu de visibilité sur les ventes des boutiques de Bouaké."],
             ["Le fichier clients du Nord n'est pas à jour."], ["Relancer les deux factures d'Adjamé.", "Proposer un réassort Sossa 200 g pour Bouaké."]),
}
for _k, (_a2, _d2, _b2, _n2) in LEARN_PLUS.items():
    _a, _d, _b, _n = LEARN[_k]
    LEARN[_k] = ((_a + _a2)[:3], (_d + _d2)[:3], (_b + _b2)[:3], [_n] + _n2)
for _k, (_a, _d, _b, _n) in LEARN.items():''')
R('''        return (f'<div class="lrns">{col("Ce qu’on a appris", "lightbulb", d["a"], "a")}{col("Défis", "mountain", d["d"], "d")}{col("Blocages", "octagon-alert", d["b"], "b")}</div>'
                f'<p class="lrnx">{ic("arrow-right", "s")} <b>Prochaine étape :</b> {d["n"]}</p>')''',
  '''        return (f'<div class="lrns l4">{col("Ce qu’on a appris", "lightbulb", d["a"], "a")}{col("Défis", "mountain", d["d"], "d")}{col("Blocages", "octagon-alert", d["b"], "b")}'
                f'{col("Prochaines étapes", "circle-arrow-right", d["n"] if isinstance(d["n"], list) else [d["n"]], "n")}</div>')''')
R('''("learn", "Apprentissages, défis et blocages",''', '''("learn", "Apprentissages, défis, blocages et prochaines étapes",''')

# --- carte de bloc : poignée en mode modification
R('''<header><h4>{titre}</h4>''', '''<header><span class="mwgrip" aria-hidden="true">{ic("grip-vertical", "s")}</span><h4>{titre}</h4>''')

# --- en-tête d'un tableau
FORMATS = '[("hash", "Chiffres clés"), ("chart-column", "Histogramme"), ("chart-bar", "Barres"), ("chart-pie", "Camembert"), ("chart-line", "Courbe"), ("chart-area", "Aires"), ("gauge", "Jauge"), ("target", "Objectif"), ("filter", "Entonnoir"), ("table", "Tableau"), ("kanban", "Kanban"), ("calendar", "Calendrier"), ("chart-gantt", "Planning"), ("map", "Carte"), ("align-left", "Texte"), ("list-checks", "Liste"), ("trophy", "Classement"), ("activity", "Fil d’activité")]'
R('''def tdb_agent(k, part=None):''', '''TB_TITRE = {"djeneba": "Pilotage de la direction", "fatima": "Marketing et contenu", "koffi": "Studio design"}
TB_FMTS = ''' + FORMATS + '''
TB_ASK = {"djeneba": ["Quels engagements risquent de glisser ?", "Le temps du DG par projet", "Les courriers à signer cette semaine"],
          "fatima": ["Quel réseau rapporte le plus de contacts ?", "Les posts les plus vus du mois", "Le coût par contact de la publicité"],
          "koffi": ["Les créations en attente de validation", "Le délai moyen d'un BAT", "Les commandes chez l'imprimeur"],
          "adjoua": ["Quel est le meilleur canal de recrutement ?", "Le délai moyen par poste", "Les candidats en attente de réponse"],
          "kouassi": ["Les clients à relancer cette semaine", "Le chiffre d'affaires par zone", "Les ruptures de stock"]}
def dl_menu(nom):
    return (f'<details class="dlm"><summary class="btn o sm">{ic("download", "s")} <span>Télécharger</span></summary><div class="dlml">'
            f'<a href="#" data-toast="Google Slides créé dans votre Drive : {nom}"><img src="{FAV}slides.google.com" alt=""><span><b>Google Slides</b><small>Modifiable, une page par bloc</small></span></a>'
            f'<a href="#" data-toast="PDF téléchargé : {nom}.pdf"><span class="pdfi">PDF</span><span><b>PDF</b><small>Prêt à imprimer ou à envoyer</small></span></a></div></details>')
def tb_editbar(k):
    e = qui(k)
    fm = "".join(f'<label class="fmc"><input type="radio" name="fm2-{k}"{" checked" if n == 0 else ""}>{ic(i_, "s")} {l}</label>' for n, (i_, l) in enumerate(TB_FMTS))
    sg_ = "".join(f'<span data-sw="{x}">{ic("sparkles", "s")} {x}</span>' for x in TB_ASK.get(k, SUGG_W.get(k, [])))
    return (f'<div class="tbedit"><div class="tbeh"><span class="ic">{ic("pencil", "s")}</span><div class="grow"><b>Vous modifiez ce tableau</b><span>Glissez les blocs pour les déplacer, masquez-les dans les partages ou retirez-les. Pour en ajouter un, demandez-le à {e["prenom"]}.</span></div>'
            f'<a class="btn p sm tbdone" href="#">{ic("check", "s")} Terminer</a></div>'
            f'<form class="tbask" data-k="{k}"><img src="{B}{e["photo"]}" alt=""><textarea rows="2" placeholder="Que voulez-vous voir ? Par exemple : {TB_ASK.get(k, ["les chiffres de la semaine"])[0].lower()}" aria-label="Décrivez le bloc à ajouter"></textarea><button class="btn p sm" type="submit">{ic("sparkles", "s")} Créer le bloc</button></form>'
            f'<div class="mws">{sg_}</div><p class="tbfl">Format du bloc</p><div class="fmts sm">{fm}</div></div>')

def tdb_agent(k, part=None):''')

# remplace la construction de l'en-tête
i = s.index("def tdb_agent(k, part=None):")
j = s.index("def page_tdb(brand):")
s = s[:i] + '''def tdb_agent(k, part=None, titre=None):
    e = qui(k)
    ws = "".join(wcard(k, *w) for w in TDB[k])
    if part:
        _, par_, ini, droit, exp, titre_ = part
        head = (f'<div class="tbh2"><div class="grow"><h2>{titre_}</h2><span class="tbby">{face(ini, "", 22)} Partagé par {par_}, '
                f'{ic("pencil" if droit == "Édition" else "eye", "s")} {droit.lower()} jusqu’au {exp}</span></div>'
                f'<div class="tbact">{dl_menu(titre_)}<a class="btn p sm" href="#" data-toast="Tableau copié dans Mes tableaux, vous pouvez l’adapter">{ic("copy-plus", "s")} Copier dans mes tableaux</a></div></div>')
        bar = ""
    else:
        titre = titre or TB_TITRE.get(k, "Tableau de " + e["prenom"])
        head = (f'<div class="tbh2"><div class="grow"><h2>{titre}</h2><span class="tbby"><img src="{B}{e["photo"]}" alt=""> Tenu par {e["prenom"]}, {e["role"]}, mis à jour aujourd’hui à 10:31</span></div>'
                f'<div class="tbact"><a class="btn o sm tbed" href="#">{ic("pencil", "s")} <span>Modifier</span></a>'
                f'<a class="btn o sm" href="#" data-dup="{titre}">{ic("copy-plus", "s")} Dupliquer</a>{dl_menu(titre)}'
                f'<a class="btn p sm" href="#" data-open="share" data-shk="{k}">{ic("share-2", "s")} Partager</a></div></div>')
        bar = tb_editbar(k)
    return f'{head}{bar}{filtres(k)}<section class="mwg2">{ws}</section>'

''' + s[j:]

# --- page : liste latérale des tableaux, prévue pour beaucoup de tableaux
i = s.index("def page_tdb(brand):")
j = s.index("    xs = \"\".join(f'<label class=\"nx\">", i)
s = s[:i] + '''def page_tdb(brand):
    MINE = [("djeneba", "djeneba", "Pilotage de la direction", "Aujourd’hui, 10:31"), ("djeneba2", "djeneba", "Nouvelle ligne de confiserie", "Aujourd’hui, 09:12"),
            ("fatima", "fatima", "Marketing et contenu", "Aujourd’hui, 10:05"), ("koffi", "koffi", "Studio design", "Hier, 18:40")]
    it = lambda tid, x, t, sub, g, extra="": (f'<a href="#" data-t="tb-{tid}" data-g="{g}"{" class=on" if tid == "djeneba" else ""}><span class="tbav"><img src="{B}{qui(x)["photo"]}" alt="">{extra}</span>'
                                             f'<span class="grow"><b>{t}</b><small>{sub}</small></span></a>')
    mine = "".join(it(tid, x, t, f'{qui(x)["prenom"]}, {d}', "mine") for tid, x, t, d in MINE)
    shared = "".join(it(p[0], p[0], p[5], f'Partagé par {p[1]}', "shared", face(p[2], "", 20)) + ("" if n else "") for n, p in enumerate(TDB_PART))
    shared = shared.replace('</small></span></a>', '</small></span><i class="nw" title="Nouveau"></i></a>', 1)
    rail = (f'<aside class="tbrail"><label class="srch tbq">{ic("search", "s")}<input type="search" placeholder="Chercher un tableau" aria-label="Chercher un tableau"></label>'
            f'<nav class="tabs tbli"><p class="tbg">Mes tableaux <b class="num">{len(MINE)}</b></p>{mine}'
            f'<p class="tbg">Partagés avec moi <b class="num">{len(TDB_PART)}</b></p>{shared}<p class="tbnone" hidden>Aucun tableau ne correspond.</p></nav>'
            f'<a class="tbnewb" href="#" data-open="newtdb">{ic("plus", "s")} Nouveau tableau</a></aside>')
    par = f'<div class="panel on" id="tb-djeneba">{tdb_agent("djeneba")}</div>'
    par += f'<div class="panel" id="tb-djeneba2" data-preset="usine">{tdb_agent("djeneba", titre="Nouvelle ligne de confiserie")}</div>'
    par += "".join(f'<div class="panel" id="tb-{k}">{tdb_agent(k)}</div>' for k in ("fatima", "koffi"))
    par += "".join(f'<div class="panel" id="tb-{p[0]}">{tdb_agent(p[0], p)}</div>' for p in TDB_PART)
    corps = f"""<div class="hello"><div class="grow"><p class="date">Semaine du 28 septembre</p><h1>Tableaux de bord</h1></div><a class="btn g" href="#" data-open="newtdb">{ic("plus", "s")} Créer un tableau</a></div>
<div data-tabs class="tbwrap tbl">{rail}<div class="tbmain">{par}</div></div>"""
''' + s[j:]

# --- création : formats étendus + export
R('''<h3 class="shh">Formats préférés</h3><div class="fmts">{"".join(f'<label class="fmc"><input type="checkbox"{" checked" if n < 3 else ""}>{ic(i_, "s")} {l}</label>' for n, (i_, l) in enumerate([("hash", "Chiffres clés"), ("chart-column", "Histogramme"), ("chart-pie", "Camembert"), ("chart-line", "Courbe"), ("table", "Tableau"), ("kanban", "Kanban"), ("calendar", "Calendrier"), ("align-left", "Texte"), ("list-checks", "Liste")]))}</div>''',
  '''<h3 class="shh">Formats préférés</h3><div class="fmts">{"".join(f'<label class="fmc"><input type="checkbox"{" checked" if n < 3 else ""}>{ic(i_, "s")} {l}</label>' for n, (i_, l) in enumerate(TB_FMTS))}</div>
<h3 class="shh">Le recevoir aussi en</h3><div class="fmts">{f'<label class="fmc"><input type="checkbox" checked><img src="{FAV}slides.google.com" alt="" style="width:16px;height:16px"> Google Slides</label><label class="fmc"><input type="checkbox">{ic("file-text", "s")} PDF</label>'}</div><p class="xs mute3" style="margin-top:6px">Mis à jour à chaque nouvelle version du tableau, dans votre Drive.</p>''')

# --- partage : droits en pastilles, canaux sous le lien
R('''<select class="fi shr" aria-label="Droit de {n}"><option{" selected" if d == "Lecture" else ""}>Lecture</option><option{" selected" if d == "Édition" else ""}>Édition</option></select>''',
  '''<span class="seg shr2" role="radiogroup" aria-label="Droit de {n}"><a{" class=on" if d == "Lecture" else ""} data-v="l">{ic("eye", "s")} Lecture</a><a{" class=on" if d == "Édition" else ""} data-v="e">{ic("pencil", "s")} Édition</a></span>''')
R('''<select class="fi" aria-label="Droit"><option>Lecture</option><option>Édition</option></select><button class="btn p sm" type="button" data-toast="Invitation envoyée">Inviter</button>''',
  '''<button class="btn p sm" type="button" data-toast="Invitation envoyée, en lecture">Inviter</button>''')
R('''<h3 class="shh">Envoyer</h3><div class="shch">{SHCH}</div>''', '''<h3 class="shh">Ou l’envoyer directement</h3><div class="shch">{SHCH}</div>''')
R('''<h2>Partager le tableau de bord</h2><p class="sm mute">Tableau de Djénéba, semaine du 28 septembre</p>''', '''<h2>Partager le tableau</h2><p class="sm mute">Pilotage de la direction, semaine du 28 septembre</p>''')
open(P, "w").write(s)
print("ok")
