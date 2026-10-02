
# ---------- v4.23 lot 3 (vocaux du 01/10, 23:00 à 23:16)
# connecteurs admin : attribuer aux experts en service et aux membres
_modal_cxa_avant75 = modal_cxa
def modal_cxa():
    xs = "".join(f'<label class="cxo"><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{n}</b><small>{r}</small></span><button class="sw swx{"" if k in ("djeneba", "fatima", "kouassi") else " off"}" data-nom="{n}" aria-label="Accès de {n}"></button></label>'
                 for k, n, r, sv, u, lv, p, on in ALL_EXPERTS if on)
    ms = "".join(f'<label class="cxo">{face(i, "", 36)}<span class="grow"><b>{n}</b><small>{po}</small></span><button class="sw swx{"" if i in ("AD", "NT") else " off"}" data-nom="{n}" aria-label="Accès de {n}"></button></label>'
                 for i, n, po, *_ in MEMBRES[:8])
    return f"""<div class="modal" id="cxa"><div class="ov" data-close></div><div class="pn shpn cxpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Attribuer <span class="czn">l’outil</span></h2><p class="sm mute">Donnez cet outil aux experts en service et aux membres qui en ont besoin.</p>
<div class="seg cxt"><a class="on" data-cx="x">{ic("sparkles", "s")} Experts <em class="num">{len([1 for *_, on in ALL_EXPERTS if on])}</em></a><a data-cx="m">{ic("users", "s")} Membres <em class="num">{len(MEMBRES[:8])}</em></a></div>
<div class="cxl on" data-cx="x">{xs}</div><div class="cxl" data-cx="m">{ms}</div>
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><a class="btn o" href="#" data-close>Annuler</a><a class="btn p" href="#" data-close data-toast="Attributions enregistrées">Enregistrer</a></div></div></div>"""

def _cx75(html):
    if '<th>Experts qui y ont accès</th>' not in html:
        return html
    html = html.replace('<th>Experts qui y ont accès</th>', '<th>Experts</th><th class="hide-m">Membres</th>', 1)
    mb = [("AD", "NT"), ("AD", "JA", "SB"), ("AD", "SB"), ("AD", "NT", "YK"), ("AD", "NT"), ("FB", "KO"), ("JA",)]
    n = [0]
    def addm(m):
        f = mb[n[0] % len(mb)]; n[0] += 1
        return m.group(1) + '<td class="hide-m"><span class="row mbx2" style="gap:0">' + "".join(face(i, "", 26) for i in f) + '</span></td>' + m.group(2)
    html = re.sub(r'(</span></td>)(<td><a class="btn o sm" href="#" data-open="cxa")', addm, html)
    html = html.replace('>Choisir les experts</a>', f'>{ic("user-plus", "s")} Attribuer</a>')
    return html

# experts de l'équipe : on peut en reprendre un pour un autre collègue
def _rec75(html):
    html = re.sub(r'(<a class="pc2 mine2" data-m="[^"]*" href="([a-z]+)\.html">.*?)(<span class="rb">(?:(?!</span>).)*?</svg>\s*Ouvrir son espace</span>)',
                  lambda m: m.group(1) + '<span class="rcrow">' + m.group(3) + f'<span class="rb rcag" role="button" tabindex="0" data-rcag="{m.group(2)}" title="Recruter à nouveau pour un collègue">{ic("user-plus", "s")} Pour un collègue</span></span>', html, flags=re.S)
    cols = "".join(f'<option>{n}</option>' for i, n, *_ in MEMBRES[:10])
    return html.replace('</main>', f"""</main><div class="modal" id="rcagm"><div class="ov" data-close></div><div class="pn shpn rcpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<div class="row" style="gap:12px;align-items:center"><img class="rcimg" src="" alt=""><div><h2 style="margin:0" class="rct">Recruter à nouveau</h2><p class="sm mute">Pour un collègue, avec son propre espace</p></div></div>
<label class="fl2"><span>Pour qui</span><select class="fi rcwho">{cols}</select></label>
<div class="rcpr"><span>Prix</span><b class="num">200 000 F CFA par mois</b><small>Facturé dès la mise en service, sans engagement</small></div>
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px"><a class="btn o" href="#" data-close>Annuler</a><a class="btn p rcgo" href="#">{ic("user-plus", "s")} Recruter</a></div></div></div>""", 1)

# qui peut faire quoi : trois rôles bien distincts
DROITS = [("Voir son tableau de bord", 1, 1, 1), ("Parler à ses experts", 1, 1, 1), ("Utiliser le chat entreprise", 1, 1, 1),
          ("Créer et partager ses tableaux de bord", 1, 1, 1), ("Parler aux experts de toute son équipe", 1, 1, 0), ("Suivre l’activité de son équipe", 1, 1, 0),
          ("Voir les tableaux de son équipe", 1, 1, 0), ("Attribuer un expert à un membre de son équipe", 1, 1, 0), ("Recruter un expert", 1, 0, 0),
          ("Inviter des membres", 1, 0, 0), ("Gérer les connecteurs et les clés d’IA", 1, 0, 0), ("Voir la facturation", 1, 0, 0)]
def _droits75(html):
    m = re.search(r'<h2 style="font-size:16px;font-weight:650">Qui peut faire quoi</h2></div><table class="tbl">.*?</table>', html, flags=re.S)
    if not m:
        return html
    ok = f'<span class="drok">{ic("check", "s")}</span>'
    no = f'<span class="drno">{ic("minus", "s")}</span>'
    rows = "".join(f'<tr><td>{t}</td>' + "".join(f'<td align="center">{ok if v else no}</td>' for v in vs) + '</tr>' for t, *vs in DROITS)
    head = ('<tr><th></th>' + "".join(f'<th style="text-align:center"><span class="drh"><b>{r}</b><small>{d}</small></span></th>' for r, d in
            [("Administrateur", "Tout l’espace"), ("Responsable", "Son service"), ("Membre", "Son travail")]) + '</tr>')
    return html[:m.start()] + f'<h2 style="font-size:16px;font-weight:650">Qui peut faire quoi</h2></div><table class="tbl drt">{head}{rows}</table>' + html[m.end():]

# invitation : un seul champ « Autre », email seulement, un email qui fait sérieux
def _inv75(html):
    if 'id="inv"' not in html:
        return html
    html = re.sub(r'<div class="fl2"><span>Envoyer l\'invitation par</span><div class="fmts">.*?</div></div>\n?', '', html, count=1, flags=re.S)
    html = re.sub(r'<span class="phk">.*?</span></div></div>', '</div></div>', html, count=1, flags=re.S)
    html = re.sub(r'<div class="lnk"><span class="ell">yelema\.ai/invite/[^<]*</span>.*?</a></div>', '', html, count=1, flags=re.S)
    html = html.replace("Invitation envoyée par email et par Telegram.", "Invitation envoyée par email.")
    html = html.replace("Envoyer l'invitation</a>", "Envoyer l'invitation par email</a>", 1)
    html = html.replace('<span>Téléphone</span>', '<span>Téléphone <small class="xs mute3">facultatif, pour Telegram</small></span>', 1)
    xs = "".join(f'<div class="ivx" data-ivx="{n}"><img src="{B}{k}.jpg" alt=""><span><b>{n}</b><small>{r}</small></span></div>' for k, n, r, *_ in ALL_EXPERTS)
    mail = f"""<div class="ivm on" data-iv="mail"><div class="ivh"><span class="xs mute3">De : Yelema pour Unifood &lt;invitations@yelema.ai&gt;</span><span class="xs mute3">À : <span class="ivto">awa.kone@unifood.info</span></span><b>Aïcha Diabaté vous invite à rejoindre Unifood sur Yelema</b></div>
<div class="ivb ivb2"><div class="ivtop"><img class="ivcl" src="{B}{CLIENT["logo"]}" alt="{CLIENT["nom"]}"><span class="ivx2">×</span><img class="ivl" src="{B}yelema_long.png" alt="Yelema"></div>
<h3 class="ivt">Bonjour <span class="ivfn">Awa</span>, votre équipe vous attend</h3>
<p><b>Aïcha Diabaté</b>, administratrice de l’espace Yelema d’<b>Unifood</b>, vous invite à rejoindre l’espace de travail de l’entreprise. Vous y travaillerez avec ces experts :</p>
<div class="ivxs">{xs}</div>
<a class="btn p ivcta" href="bienvenue.html">Rejoindre l’espace Unifood</a>
<ol class="ivst"><li>Vous choisissez votre mot de passe</li><li>Vous rencontrez vos experts</li><li>Vous leur parlez ici, sur Telegram, Slack ou Teams</li></ol>
<p class="xs mute3">Cette invitation est valable 7 jours. Vous ne connaissez pas Aïcha Diabaté ? Ignorez ce message, rien ne se passera.</p>
<div class="ivfoot"><span>Powered by</span><img src="{B}yelema_long.png" alt="Yelema"></div></div></div>"""
    if '<div class="seg ivs">' in html:
        i = html.index('<div class="seg ivs">')
        j = html.index('<div class="row" style="justify-content:flex-end;margin-top:12px"><a class="btn o" href="bienvenue.html">', i)
        html = html[:i] + mail + html[j:]
    return html

# expert : son compte de travail remplacé par ses modèles d'IA (les canaux disent déjà le reste)
XMOD = {"djeneba": ("Claude Sonnet", "Anthropic", "Clé Anthropic de l’entreprise"), "fatima": ("Claude Sonnet", "Anthropic", "Clé Anthropic de l’entreprise"),
        "koffi": ("Gemini 2.5 Pro", "Google", "Clé Google de l’entreprise")}
def _xmod75(html, k):
    if k not in XMOD or 'Son compte de travail</h3>' not in html:
        return html
    a = html.index('Son compte de travail</h3>')
    a = html.rfind('<div class="box">', 0, a)
    depth, j = 0, a
    for m in re.finditer(r'<(/?)div\b', html[a:]):
        depth += -1 if m.group(1) else 1
        if depth == 0:
            j = a + html[a:].index('>', m.start()) + 1
            break
    md, pv, cle = XMOD[k]
    dom = {"Anthropic": "anthropic.com", "Google": "gemini.google.com"}[pv]
    alt = [("Claude Opus", "anthropic.com", "Pour les analyses longues"), ("Mistral Large", "mistral.ai", "Fourni par Yelema"), ("GPT-5", "openai.com", "Ajoutez une clé OpenAI")]
    alts = "".join(f'<div class="ac2{" off" if "Ajoutez" in d else ""}"><img src="{FAV}{dd}" alt=""><span class="grow"><b>{n}</b><small>{d}</small></span>'
                   + (f'<span class="sti on">{ic("circle-check")}</span>' if "Ajoutez" not in d else f'<a class="btn o sm" href="admin-modeles.html">{ic("plus", "s")} Clé</a>') + '</div>' for n, dd, d in alt)
    box = (f'<div class="box"><h3 class="bt">{ic("cpu", "s")} Ses modèles d’IA</h3><p class="xs mute3" style="margin-bottom:8px">Le modèle qu’elle utilise par défaut, et ceux qu’on peut choisir dans la discussion.</p>'
           f'<div class="ac2 xmd"><img src="{FAV}{dom}" alt=""><span class="grow"><b>{md} <em class="kst ok">Par défaut</em></b><small>{pv}, {cle}</small></span><a class="btn o sm" href="admin-modeles.html">{ic("pencil", "s")} Modifier</a></div>{alts}</div>')
    return html[:a] + box + html[j:]

# personnaliser Djénéba : prénom bien visible, tenue aux couleurs de l'entreprise, beaucoup de fonds
FONDS = [("Lavande", "#C5C4FF"), ("Violet", "#8D68FA"), ("Indigo", "#301667"), ("Ciel", "#BFE3FF"), ("Menthe", "#BDECD6"), ("Sable", "#EBDCCB"),
         ("Terracotta", "#E4765A"), ("Ocre", "#E9B44C"), ("Rose", "#F6C6D8"), ("Gris perle", "#E6E6EC"), ("Ardoise", "#4A5568"), ("Nuit", "#241C33")]
PAL = [("#E00040", "Rouge Unifood"), ("#F8B400", "Jaune Unifood"), ("#5A1022", "Bordeaux Unifood")]
def _pz75(html):
    if 'id="pz"' not in html:
        return html
    html = html.replace('<div><p class="oq">Prénom</p><div class="nmf"><span class="v">Djénéba</span><a class="btn o" href="#">Suggérer</a></div><p class="xs mute3" style="margin-top:6px">Toute l\'équipe la verra sous ce prénom, ici, sur WhatsApp et dans ses emails.</p></div>',
        f'<div class="pzn"><p class="oq">Son prénom <em class="pzn2">{ic("pencil", "s")} modifiable</em></p><label class="nmf nmf3">{ic("pencil", "s")}<input class="fi pzni" value="Djénéba" aria-label="Prénom de votre Chief of Staff"><a class="btn o sm pzsg" href="#">{ic("sparkles", "s")} Suggérer</a></label><p class="xs mute3" style="margin-top:6px">Toute l’équipe la verra sous ce prénom, ici, sur Telegram et dans ses emails.</p></div>', 1)
    pal = "".join(f'<i style="background:{c}"></i>' for c, _ in PAL)
    html = html.replace('<span class="">' + ic("briefcase", "s") + 'Tailleur</span></div></div>', '<span class="">' + ic("briefcase", "s") + f'Tailleur</span><span class="pzbr"><span class="pzpal">{pal}</span>Aux couleurs de l’entreprise</span></div></div>', 1) if ('<span class="">' + ic("briefcase", "s") + 'Tailleur</span></div></div>') in html else re.sub(r'(Tailleur</span>)(</div></div>)', r'\1' + f'<span class="pzbr"><span class="pzpal">{pal}</span>Aux couleurs de l’entreprise</span>' + r'\2', html, count=1)
    sw = "".join(f'<button type="button" class="fsw{" on" if n == 0 else ""}" style="--c:{c}" data-fn="{t}" aria-label="{t}" title="{t}"></button>' for n, (t, c) in enumerate(FONDS))
    pw = "".join(f'<button type="button" class="fsw" style="--c:{c}" data-fn="{t}" aria-label="{t}" title="{t}"></button>' for c, t in PAL)
    fond = (f'<div><p class="oq">Fond <span class="fsl xs mute3">Lavande</span></p><div class="fnd"><p class="fndh">{ic("palette", "s")} Palette de l’entreprise <a class="link xs fauto" href="#">{ic("wand-sparkles", "s")} Choisir pour moi</a></p>'
            f'<div class="fsws">{pw}<button type="button" class="fsw fgr" style="--c:linear-gradient(135deg,#E00040,#F8B400)" data-fn="Dégradé de l’entreprise" aria-label="Dégradé de l’entreprise" title="Dégradé de l’entreprise"></button></div>'
            f'<p class="fndh">{ic("swatch-book", "s")} Toutes les couleurs</p><div class="fsws">{sw}<label class="fsw fcu" title="Couleur au choix">{ic("plus", "s")}<input type="color" value="#8D68FA" aria-label="Couleur au choix"></label></div></div></div>')
    html = re.sub(r'<div><p class="oq">Fond</p><div class="opts">.*?</div></div>', fond, html, count=1, flags=re.S)
    return html

# analytique admin : comparaison au mois passé, semaines du mois passé en couleur, plus d'indicateurs, rétention
def _an75(html):
    if '<h2>Coût par semaine</h2>' not in html:
        return html
    prev = [("S33", "281 k", 86), ("S34", "281 k", 86), ("S35", "290 k", 89), ("S36", "302 k", 93)]
    pb = "".join(f'<div class="an-b prv"><em class="num">{v}</em><i style="height:{h}%"></i><span>{w}</span></div>' for w, v, h in prev)
    html = html.replace('<h2>Coût par semaine</h2><span>F CFA, au prorata des jours</span></header><div class="an-bars">',
                        '<h2>Coût par semaine</h2><span>F CFA, au prorata des jours</span></header><div class="anlg"><span><i class="prv"></i>Mois passé</span><span><i></i>Ce mois-ci</span></div><div class="an-bars an-bars8">' + pb, 1)
    html = html.replace('<small>par mois, 6 exemplaires facturés</small>', '<small>par mois, 6 exemplaires facturés</small><em class="dlt down">↑ 200 000 F vs août</em>', 1)
    html = html.replace('<small class="up">de travail ce mois-ci</small>', '<small class="up">de travail ce mois-ci</small><em class="dlt up">↑ 9 journées vs août</em>', 1)
    html = html.replace('<div class="an-k"><span>Livrables produits</span><b class="num">126</b><small class="up">+18 % par rapport au mois dernier</small></div></div>',
                        '<div class="an-k"><span>Livrables produits</span><b class="num">126</b><small class="up">+18 % par rapport au mois dernier</small></div>'
                        '<div class="an-k"><span>Délai moyen d’une tâche</span><b class="num">2 h 40</b><small class="up">−35 min par rapport au mois dernier</small></div>'
                        '<div class="an-k"><span>Livrables validés du premier coup</span><b class="num">81 %</b><small class="up">+6 points par rapport au mois dernier</small></div></div>', 1)
    html = html.replace('<div class="an-k"><span>Experts par membre</span><b class="num">1,8</b><small>en moyenne</small></div></div>',
                        '<div class="an-k"><span>Experts par membre</span><b class="num">1,8</b><small>en moyenne</small><em class="dlt up">↑ 0,3 vs août</em></div>'
                        '<div class="an-k"><span>Rétention des membres</span><b class="num">92 %</b><small>actifs ce mois-ci et le mois passé</small><span class="anret"><span><b class="num">79 %</b> chaque semaine</span><span><b class="num">92 %</b> chaque mois</span></span></div></div>', 1)
    html = html.replace('<small class="">sur 14 comptes ouverts</small></div>', '<small class="">sur 14 comptes ouverts</small><em class="dlt up">↑ 2 vs août</em></div>', 1)
    html = html.replace('<small>sur 20 proposés</small></div>', '<small>sur 20 proposés</small><em class="dlt up">↑ 1 vs août</em></div>', 1)
    return html

# mot de passe : erreur, oubli, lien reçu, nouveau mot de passe, confirmation, lien expiré
def _mdp75(html):
    if 'data-reset' in html and 'data-st="3"' in html:
        a = "<a class=\"btn o\" href=\"#\" data-next=\"3\">J'ai cliqué sur le lien</a><a class=\"link\" href=\"#\" data-toast=\"Nouveau lien envoyé\" style=\"margin-top:12px;display:inline-block\">Renvoyer le lien</a></div>"
        b = (f'<div class="mdtip">{ic("info", "s")}<span>Rien reçu ? Regardez dans les courriers indésirables, ou vérifiez l’adresse.</span></div>'
             f'<div class="mdbt"><a class="btn p" href="https://mail.google.com" target="_blank" rel="noopener">{ic("mail", "s")} Ouvrir ma boîte mail</a><a class="btn o" href="#" data-next="3">{ic("mouse-pointer-click", "s")} J’ai cliqué sur le lien</a></div>'
             f'<p class="sm mute mdrs">Pas de lien ? <a class="link mdre" href="#">Renvoyer le lien</a> <span class="mdcd"></span></p><p class="sm"><a class="link" href="#" data-next="1">Changer d’adresse</a></p></div>')
        html = html.replace(a, b, 1)
        a = '<label class="mdf"><span>Confirmer</span><span class="mdi"><input type="password" placeholder="Saisissez-le à nouveau"></span></label>'
        b = (f'<ul class="mdrl"><li data-r="len">{ic("check", "s")} 8 caractères au moins</li><li data-r="maj">{ic("check", "s")} Une majuscule</li><li data-r="num">{ic("check", "s")} Un chiffre</li></ul><span class="mdsb"><i></i></span>'
             f'<label class="mdf"><span>Confirmer</span><span class="mdi"><input type="password" placeholder="Saisissez-le à nouveau" class="mdc2"></span></label><p class="mderr" hidden>{ic("circle-alert", "s")} Les deux mots de passe ne sont pas identiques.</p>')
        html = html.replace(a, b, 1)
        html = html.replace('<button class="btn p auok" type="submit">Enregistrer et me connecter', '<button class="btn p auok mdsave" type="submit" disabled>Enregistrer le mot de passe', 1)
        extra = (f'<div class="aust" data-st="4" hidden><span class="aubig okb">{ic("circle-check")}</span><h2>Mot de passe changé</h2><p class="sub">C’est fait. Par sécurité, vous êtes déconnectée de vos autres appareils. Un email de confirmation vient de partir.</p>'
                 f'<a class="btn p" href="connexion.html">Se connecter {ic("arrow-right", "s")}</a></div>'
                 f'<div class="aust" data-st="5" hidden><span class="aubig kob">{ic("clock-alert")}</span><h2>Ce lien a expiré</h2><p class="sub">Un lien de réinitialisation reste valable 30 minutes et ne sert qu’une fois. Demandez-en un nouveau.</p>'
                 f'<a class="btn p" href="#" data-next="1">Recevoir un nouveau lien {ic("arrow-right", "s")}</a><p class="xs mute3" style="margin-top:14px"><a class="link" href="#" data-next="3">Voir l’écran du nouveau mot de passe</a></p></div>')
        i = html.index('data-st="3"'); j = html.index('</form></div>', i) + len('</form></div>')
        html = html[:j] + extra + html[j:]
    if 'data-login' in html:
        html = html.replace('<form class="auf" data-login>', f'<div class="auerr" hidden>{ic("circle-alert", "s")}<span class="auet"><b>Mot de passe incorrect.</b> Il vous reste <b class="aun">2</b> essais avant un blocage de 15 minutes.</span></div><form class="auf" data-login>', 1)
        html = html.replace('<p class="xs mute3 aunote">', '<p class="xs mute3 audemo">Pour voir l’erreur, modifiez le mot de passe puis connectez-vous.</p><p class="xs mute3 aunote">', 1)
    return html

def _nopause75(html):
    # pause et arrêt d'un expert : réservés à l'admin (vocal 44543)
    P = re.escape(ic("pause", "s"))
    html = re.sub(r'<div class="adv" style="margin-top:14px"><div><span class="ic">' + P + r'</span>.*?Retirer</a></div></div>', '', html, flags=re.S)
    html = re.sub(r'<div><span class="ic">' + P + r'</span><div class="grow"><b>Mettre en pause</b>.*?</a></div>\s*', '', html, flags=re.S)
    html = re.sub(r'<div class="danger"><span class="ic">' + re.escape(ic("user-minus", "s")) + r'</span>.*?Retirer</a></div>', '', html, flags=re.S)
    html = re.sub(r'<a class="btn o sm" href="#" data-toast="[^"]*est en pause">' + re.escape(ic("pause", "s")) + r' Pause</a>', '', html)
    html = re.sub(r'<a class="sq pause" href="#" aria-label="Mettre en pause">.*?</a>', '', html, flags=re.S)
    html = re.sub(r'<a class="btn g" href="#">' + re.escape(ic("pause", "s")) + r' Mettre en pause</a>', '', html)
    return html

def _plan75(html):
    a = '<a class="o" href="yelema/chat.html">'
    if a in html and 'accueil-premier-jour' not in html:
        html = html.replace(a, '<a class="o" href="yelema/accueil-premier-jour.html"><div><b>Accueil, premier jour</b><p class="sm mute">Avant le premier travail des experts : le bloc En ce moment à vide</p></div></a>' + a, 1)
    return html

def _now75(html):
    # accueil, état du premier jour : aucun expert n'a encore travaillé (vocal 44607)
    m = re.search(r'<div class="nowbox">.*?</time></a></div>', html, flags=re.S)
    if not m:
        return html
    sug = [("djeneba", "Djénéba", "Faites le point de ma semaine", "list-checks"),
           ("fatima", "Fatima", "Préparez 3 posts pour notre prochaine promo", "megaphone"),
           ("koffi", "Koffi", "Déclinez notre logo en visuel pour les réseaux", "palette")]
    li = "".join(f'<a class="nwg" href="{k}.html"><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{n}</b><span>« {t} »</span></span>{ic("arrow-right", "s")}</a>' for k, n, t, _ in sug)
    vide = (f'<div class="nowempty"><div class="nwh"><span class="nwi">{ic("sparkles", "s")}</span><div><b>Rien en cours pour l’instant</b>'
            f'<p>Dès qu’un expert commence une tâche, vous la suivez ici en direct. Sa dernière livraison s’affiche juste en dessous.</p></div></div>'
            f'<p class="nwk">Confiez-leur une première mission</p><div class="nwgs">{li}</div></div>')
    return html[:m.end()] + vide + html[m.end():]

def _fix75(html):
    html = html.replace(ic("layout-dashboard", "s"), ic("chart-column", "s")).replace(ic("layout-dashboard"), ic("chart-column"))
    html = html.replace("Point du jour envoyé sur WhatsApp", "Point du jour envoyé sur Telegram").replace("Je vous préviens sur WhatsApp", "Je vous préviens sur Telegram").replace("point du jour envoyé sur whatsapp", "point du jour envoyé sur Telegram")
    html = html.replace("Yao l'a reçu sur WhatsApp", "Yao l'a reçu sur Telegram").replace("Lu votre brief WhatsApp", "Lu votre brief Telegram")
    html = html.replace('<a class="rmore" href="#" data-go="drive">Voir plus</a>', '<a class="rmore" href="#" data-go="livrables">Voir plus</a>')
    html = _plan75(_now75(html))
    html = _mdp75(_an75(_cx75(_droits75(_inv75(_pz75(html))))))
    if 'id="admin-' not in html and 'class="adm' not in html:
        html = _nopause75(html)
    if 'Qui sera votre prochaine recrue' in html:
        html = _rec75(html)
    m = re.search(r'<body[^>]*data-x="([a-z]+)"', html)
    for k in XMOD:
        if f'<h1>{EXPERTS[k]["prenom"] if k in EXPERTS else k}</h1>' in html and 'id="profil"' in html:
            html = _xmod75(html, k)
            break
    return html
