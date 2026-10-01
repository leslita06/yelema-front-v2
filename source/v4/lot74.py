import re

# ---------- v4.19 retours du parcours complet (vocal du 01/10, 21:51)
# admin : pleine largeur
_admin_page_avant = admin_page
def admin_page(actif, titre, corps, brand):
    h = _admin_page_avant(actif, titre, corps, brand)
    h = h.replace('<div class="sform" style="max-width:1080px">', '<div class="sform">', 1)
    if actif not in ("admin-general", "admin-profil"):
        h = h.replace('<div class="sform">', '<div class="sform sfw">', 1)
    if actif == "admin-membres" and titre != "Membres et droits":
        h = h.replace(f'<div class="crumb grow"><a href="admin.html">Administration</a> {ic("chevron-right", "s")} <b>{titre}</b></div>',
                      f'<div class="crumb grow"><a href="admin.html">Administration</a> {ic("chevron-right", "s")} <a href="admin-membres.html">Membres et droits</a> {ic("chevron-right", "s")} <b>{titre}</b></div>', 1)
        h = h.replace('<div class="sform sfw">', f'<div class="sform sfw"><a class="back" href="admin-membres.html" style="margin-bottom:14px">{ic("arrow-left", "s")} Membres et droits</a>', 1)
    return h

# vue d'ensemble : une seule ligne de petites cartes, sans les livrables
_adm_vue_avant = adm_vue
def adm_vue(brand):
    h = _adm_vue_avant(brand)
    a = h.index('<div class="stat4 st6">')
    b = h.index('<div class="h2x" style="margin-top:24px"><h2>Vos experts</h2>')
    st = "".join(f'<div class="kp5"><span class="ic">{ic(i, "s")}</span><span><b class="num">{v}</b><small>{l}</small></span></div>' for i, v, l in
                 [("user-plus", "8", "experts recrutés"), ("sparkles", "7", "experts en service"), ("users", "14", "membres"), ("users-round", "1,8", "experts par membre"), ("plug", "7", "connecteurs branchés")])
    return h[:a] + f'<div class="kp5s">{st}</div>' + h[b:]

# canaux : un seul composant, partout, dans l'ordre Telegram, Web, Slack, Teams, WhatsApp
def chan_card(n, logo, sub, on, action="", sel=None):
    chk = f'<span class="chk">{ic("circle-check", "s")}</span>' if on else '<span class="chk off"></span>'
    inp = f'<input type="{sel[0]}" name="{sel[1]}"{" checked" if on else ""}>' if sel else ""
    tag = "label" if sel else "div"
    return (f'<{tag} class="chc{"" if on else " off"}">{inp}<span class="chl">{logo}</span>{chk}<b>{n}</b><small>{sub}</small>{action}</{tag}>')
WEB_LOGO = f'<img src="{B}yelema_y.svg" alt="">'
def chan_logo(n, d):
    return TG if n == "Telegram" else (WEB_LOGO if n == "Web" else f'<img src="{FAV}{d}" alt="">')
CH_ORDRE = ["Telegram", "Web", "Slack", "Microsoft Teams", "WhatsApp", "Email"]
def canaux_strip():
    t = chan_card("Web", WEB_LOGO, "", True)
    for n, d, on, det, u, lib in CANAUX:
        t += chan_card(n, chan_logo(n, d), "", on)
    cards = sorted(re.findall(r'<div class="chc.*?</div>', t, flags=re.S), key=lambda c: next((i for i, x in enumerate(CH_ORDRE) if f"<b>{x}</b>" in c), 9))
    return f'<a class="chcs chcs-mini" href="admin-canaux.html">{"".join(cards)}</a>'

# experts : quantité, prix unitaire, total, en service ; plus de colonne livrables
def adm_experts(brand):
    NOMS = {i: n for i, n, *_ in MEMBRES}
    rows = ""
    tot = 0
    for no, (k, n, r, sv, u, lv, p, on) in enumerate(ALL_EXPERTS, 1):
        ppl = "".join(f'<span class="mbx">{face(i, "", 26)}<span>{NOMS[i].split(" ")[0]}</span></span>' for i in UTIL[k])
        q = 2 if k == "kouassi" else 1
        pu = 0 if p == "incluse" else (200000 if not str(p)[0].isdigit() else int("".join(c for c in str(p) if c.isdigit())))
        t_ = pu * q if on else 0
        tot += t_
        f_ = lambda v: f"{v:,}".replace(",", " ") + " F"
        rows += (f'<tr><td class="xno num">{no}</td><td><a class="who" href="{xh(k)}"><img src="{B}{k}.jpg" alt=""><span><b>{n}</b><span class="xs mute3">{r}</span></span></a></td>'
                 f'<td class="hide-m"><div class="mbs">{ppl}<a class="ib mba" href="#" data-open="inv" aria-label="Ajouter un membre">{ic("plus", "s")}</a></div></td>'
                 f'<td class="num">{q}</td><td class="num">{"Incluse" if p == "incluse" else f_(pu)}</td><td class="num"><b>{"Incluse" if p == "incluse" else (f_(t_) if on else "Pas facturé")}</b></td>'
                 f'<td><label class="xst {"on" if on else "pa"}">{ic("circle", "s")}<select aria-label="État de {n}" data-xst="{n}">' + "".join(f'<option value="{v}"{" selected" if v == ("on" if on else "pa") else ""}>{t}</option>' for v, t in [("on", "En service"), ("pa", "En pause"), ("st", "Arrêté")]) + '</select></label></td></tr>')
    corps = f"""<div class="hello"><div class="grow"><h1>Experts</h1><p class="sub">7 en service dont Kouassi en deux exemplaires, 1 en pause</p></div><a class="btn p" href="recruter.html">{ic("user-plus", "s")} Recruter un expert</a></div>
<div class="box" style="margin-top:16px"><table class="tbl tbex2"><tr><th class="xno">N°</th><th>Expert</th><th class="hide-m">Membres qui l'utilisent</th><th>Quantité</th><th>Prix unitaire</th><th>Total par mois</th><th>État</th></tr>{rows}
<tr class="tot"><td colspan="5"><b>Total par mois</b></td><td class="num"><b>{f"{tot:,}".replace(",", " ")} F CFA</b></td><td></td></tr></table></div>"""
    return admin_page("admin-experts", "Experts", corps, brand)

# modèles d'IA : clés posées, fournisseurs, modèles par expert, clés partagées
PROV = [("Anthropic", "anthropic.com", "sk-ant-••••8f2", "Aïcha Diabaté", "12 sept.", ["djeneba", "fatima", "mamadou"], ["Aïcha", "Nadège"], "Claude Sonnet, Claude Opus, Claude Haiku"),
        ("Google", "gemini.google.com", "AIza••••Qe4", "Serge Bamba", "3 sept.", ["koffi"], ["Serge"], "Gemini 2.5 Pro, Gemini 2.5 Flash"),
        ("OpenAI", "openai.com", "", "", "", [], [], "GPT-5, GPT-5 mini, GPT-4.1"),
        ("Mistral AI", "mistral.ai", "Fourni par Yelema", "", "", ["adjoua", "kouassi"], [], "Mistral Large, Mistral Medium"),
        ("Meta", "meta.com", "Fourni par Yelema, sur votre cloud dédié", "", "", ["awa"], [], "Llama 4 Maverick, Llama 4 Scout")]
MODS = ["Claude Sonnet", "Claude Opus", "Claude Haiku", "GPT-5", "GPT-5 mini", "GPT-4.1", "Gemini 2.5 Pro", "Gemini 2.5 Flash", "Mistral Large", "Mistral Medium", "Llama 4 Maverick", "Llama 4 Scout", "DeepSeek V3"]
def adm_modeles(brand):
    rows = ""
    for n, d, cle, par, quand, xs, mbr, mods in PROV:
        own = cle.startswith(("sk", "AIza"))
        st = (f'<span class="kst ok">{ic("circle-check", "s")} Clé active</span>' if own else (f'<span class="kst yl">{ic("shield-check", "s")} Inclus par Yelema</span>' if cle else '<span class="kst no">Pas de clé</span>'))
        ex = "".join(f'<img class="xav" src="{B}{k}.jpg" alt="" title="{dict((a, b) for a, b, *_ in ALL_EXPERTS).get(k, k)}">' for k in xs) or '<span class="xs mute3">Aucun</span>'
        sh = (", ".join(mbr) if mbr else "")
        det = (f'<span class="kcle num">{cle}</span><small>Ajoutée par {par} le {quand}{", partagée avec " + sh if sh else ""}</small>' if own else f'<small>{cle or "Ajoutez votre clé pour utiliser ces modèles"}</small>')
        act = (f'<a class="btn o sm" href="#" data-open="mkey" data-app="{n}">{ic("pencil", "s")} Gérer</a>' if own else
               (f'<a class="btn p sm" href="#" data-open="mkey" data-app="{n}">{ic("plus", "s")} Ajouter une clé</a>' if not cle else f'<a class="btn o sm" href="#" data-open="mkey" data-app="{n}">{ic("key-round", "s")} Utiliser ma clé</a>'))
        rows += (f'<div class="kpv"><span class="kpl"><img src="{FAV}{d}" alt=""></span><div class="kpm"><div class="row" style="gap:8px;flex-wrap:wrap"><b>{n}</b>{st}</div>{det}<span class="xs mute3">Modèles : {mods}</span></div>'
                 f'<div class="kpx"><small>Experts</small><span class="row" style="gap:0">{ex}</span></div><div class="kpa">{act}</div></div>')
    opt = lambda cur: "".join(f'<option{" selected" if m == cur else ""}>{m}</option>' for m in MODS) + '<option value="autre">Autre</option>'
    cur = {"djeneba": "Claude Sonnet", "fatima": "Claude Sonnet", "koffi": "Gemini 2.5 Pro", "kouassi": "Mistral Large", "adjoua": "Mistral Large", "mamadou": "Claude Opus", "awa": "Llama 4 Scout"}
    xs = "".join(f'<tr><td><span class="who"><img src="{B}{k}.jpg" alt=""><span><b>{nm}</b><span class="xs mute3">{r}</span></span></span></td><td><span class="mdv"><b class="mdn">{cur.get(k, "Claude Sonnet")}</b><select class="fi mds" hidden aria-label="Modèle de {nm}">{opt(cur.get(k, "Claude Sonnet"))}</select><a class="btn o sm mde" href="#">{ic("pencil", "s")} Modifier</a></span></td>'
                 f'<td class="hide-m"><span class="xs mute3">{"Clé Anthropic de l’entreprise" if "Claude" in cur.get(k, "") else ("Clé Google de l’entreprise" if "Gemini" in cur.get(k, "") else "Fourni par Yelema")}</span></td></tr>' for k, nm, r, *_ in ALL_EXPERTS)
    exs = "".join(f'<label class="kxo"><input type="checkbox"{" checked" if k in ("djeneba", "fatima") else ""}><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{nm}</b><small>{r}</small></span></label>' for k, nm, r, *_ in ALL_EXPERTS)
    mbs = "".join(f'<label class="kxo"><input type="checkbox"{" checked" if i in ("AD",) else ""}>{face(i, "", 32)}<span class="grow"><b>{n}</b><small>{po}</small></span></label>' for i, n, po, svc, r in MEMBRES[:6])
    MCUR = [("AD", "Claude Sonnet", "Clé Anthropic de l’entreprise"), ("JA", "Claude Opus", "Clé Anthropic de l’entreprise"), ("SB", "Gemini 2.5 Pro", "Clé personnelle de Serge"),
            ("NT", "Claude Sonnet", "Clé Anthropic de l’entreprise"), ("FB", "Mistral Large", "Fourni par Yelema"), ("YK", "Gemini 2.5 Flash", "Clé Google de l’entreprise")]
    NOMS_ = {i: (n, po) for i, n, po, *_ in MEMBRES}
    mrows = "".join(f'<tr><td><span class="who">{face(i, "", 32)}<span><b>{NOMS_.get(i, (i, ""))[0]}</b><span class="xs mute3">{NOMS_.get(i, (i, ""))[1]}</span></span></span></td>'
                    f'<td><span class="mdv"><b class="mdn">{m}</b><select class="fi mds" hidden aria-label="Modèle">{opt(m)}</select><a class="btn o sm mde" href="#">{ic("pencil", "s")} Modifier</a></span></td>'
                    f'<td class="hide-m"><span class="xs {"kpers" if "personnelle" in c else "mute3"}">{c}</span></td></tr>' for i, m, c in MCUR)
    pv = "".join(f"<option>{x}</option>" for x in ("Anthropic", "OpenAI", "Google", "Mistral AI", "Meta", "DeepSeek", "xAI", "Cohere")) + '<option value="autre">Autre</option>'
    corps = f"""<div class="hello"><div class="grow"><h1>Modèles d'IA</h1><p class="sub">Yelema fournit des modèles par défaut. Branchez aussi vos propres clés, puis choisissez quel expert utilise quel modèle.</p></div><a class="btn p" href="#" data-open="mkey">{ic("plus", "s")} Ajouter une clé</a></div>
<h3 class="h3s">Fournisseurs et clés</h3><div class="kpvs">{rows}</div>
<h3 class="h3s">Modèle par expert</h3><p class="sub">Chaque membre peut aussi choisir un autre modèle dans la discussion</p>
<div class="box" style="margin-top:10px"><table class="tbl"><tr><th>Expert</th><th>Modèle par défaut</th><th class="hide-m">Clé utilisée</th></tr>{xs}</table></div>
<h3 class="h3s">Modèle par membre</h3><p class="sub">Le modèle que chaque membre utilise par défaut dans ses discussions, et la clé qui paie</p>
<div class="box" style="margin-top:10px"><table class="tbl"><tr><th>Membre</th><th>Modèle par défaut</th><th class="hide-m">Clé utilisée</th></tr>{mrows}</table></div>
<div class="modal" id="mkey"><div class="ov" data-close></div><div class="pn shpn mkp"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button><h2>Ajouter une clé d’API</h2><p class="sm mute">La clé reste chiffrée. Vous la retirez à tout moment.</p>
<div class="g2i"><label class="fl2"><span>Fournisseur</span><select class="fi mkpv">{pv}</select></label><label class="fl2"><span>Nom de la clé</span><input class="fi" placeholder="Par exemple : Clé marketing"></label></div>
<div class="fl2"><span>Type de clé</span><div class="rlc rlc2"><label><input type="radio" name="kty" checked><span class="rli">{ic("building-2", "s")}</span><b>Clé de l’entreprise</b><small>Payée par l’entreprise, attribuée aux experts et aux membres</small></label><label><input type="radio" name="kty"><span class="rli">{ic("user-round", "s")}</span><b>Clé personnelle</b><small>Celle d’un membre, pour son propre usage</small></label></div></div>
<label class="fl2"><span>Commentaire <small class="xs mute3">facultatif</small></span><input class="fi" style="width:100%" placeholder="Par exemple : budget marketing, plafond 50 $ par mois"></label>
<label class="fl2"><span>Clé d’API</span><input class="fi" type="password" placeholder="sk-..." style="width:100%"></label>
<label class="fl2"><span>Modèles autorisés</span><select class="fi">{opt("Claude Sonnet")}</select></label>
<p class="tbfl" style="margin-top:12px">Attribuer la clé à des experts</p><div class="kxs">{exs}</div>
<p class="tbfl" style="margin-top:12px">Attribuer la clé à des membres <small>leur usage est compté sur la même clé</small></p><div class="kxs">{mbs}</div>
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px"><a class="btn o" href="#" data-close>Annuler</a><a class="btn p" href="#" data-close data-toast="Clé enregistrée et vérifiée">Enregistrer la clé</a></div></div></div>"""
    return admin_page("admin-modeles", "Modèles d'IA", corps, brand)

# analytique admin : coûts expliqués, alertes en couleur, échanges retravaillés
_adm_analytics_avant = adm_analytics
def adm_analytics(brand):
    h = _adm_analytics_avant(brand)
    h = h.replace('<div class="an-k"><span>Coût par livrable</span><b class="num">10 300 F</b><small class="up">-14 % sur le mois</small></div>',
                  '<div class="an-k"><span>Coût par livrable</span><b class="num">10 300 F</b><small>1 300 000 F ÷ 126 livrables</small><em class="dlt up">↓ 14 % sur le mois</em></div>', 1)
    h = h.replace('<div class="an-k"><span>Coût par membre</span><b class="num">92 900 F</b><small>14 membres</small></div>',
                  '<div class="an-k"><span>Coût par membre</span><b class="num">92 900 F</b><small>1 300 000 F ÷ 14 membres</small><em class="dlt">stable</em></div>', 1)
    a = h.index(f'<h3 class="an-h">{ic("messages-square", "s")} Échanges</h3>')
    b = h.index('<section class="an-c"><header><h2>Télécharger les métriques</h2>')
    ks = "".join(f'<div class="ech"><span class="ic">{ic(i, "s")}</span><span class="grow"><b class="num">{v}</b><small>{l}</small></span><em class="dlt {c}">{d}</em></div>' for i, v, l, d, c in
                 [("phone", "23", "appels, 5 h 10 au téléphone", "↑ 4", "up"), ("send", "176", "emails envoyés, 392 reçus et triés", "↑ 12 %", "up"),
                  ("calendar-days", "21", "rendez-vous suivis, dont 12 préparés", "↓ 3", "down"), ("message-circle", "1 240", "messages avec l’équipe", "↑ 18 %", "up")])
    parts = [("Telegram", 62, "#2AABEE"), ("Web", 21, "#6B58FB"), ("Slack", 9, "#E01E5A"), ("Teams", 6, "#5059C9"), ("WhatsApp", 2, "#25D366")]
    bar = "".join(f'<i style="width:{v}%;background:{c}" title="{n} {v} %"></i>' for n, v, c in parts)
    lg = "".join(f'<span><i style="background:{c}"></i>{n} <b class="num">{v} %</b></span>' for n, v, c in parts)
    ech = (f'<h3 class="an-h">{ic("messages-square", "s")} Échanges</h3><div class="echs">{ks}</div>'
           f'<section class="an-c"><header><h2>Où l’équipe parle aux experts</h2><span>part des messages, ce mois-ci</span></header><div class="chbar">{bar}</div><div class="chlg">{lg}</div></section>')
    return h[:a] + ech + h[b:]

# fiche d'un membre : ajouter un lien qui marche
# composeur des tableaux et création : le micro en plus
_tb_editbar_avant = tb_editbar
def tb_editbar(k):
    return _tb_editbar_avant(k).replace('<button class="tbsend" type="submit"', f'<button class="tbmic" type="button" aria-label="Dicter à la voix">{ic("mic", "s")}</button><button class="tbsend" type="submit"', 1)

_page_tdb_avant2 = page_tdb
def page_tdb(brand):
    h = _page_tdb_avant2(brand)
    return h.replace('<h3 class="shh">De quoi doit-il parler</h3><textarea class="fi fta" style="width:100%"',
                     f'<h3 class="shh">De quoi doit-il parler</h3><div class="tamic"><button class="tbmic" type="button" aria-label="Dicter à la voix">{ic("mic", "s")}</button><textarea class="fi fta" style="width:100%"', 1).replace(
                     'les rendez-vous et les blocages"></textarea>', 'les rendez-vous et les blocages"></textarea></div>', 1)

# invitation : rôle en cartes, experts en liste, vrai aperçu de ce que reçoit la personne
_modal_inv_avant = modal_inv
def modal_inv():
    h = _modal_inv_avant()
    h = h.replace('<label class="fl2"><span>Rôle</span><select class="fi"><option>Membre</option><option>Responsable de service</option><option>Administrateur</option></select></label></div>', '</div>'
                  + '<div class="fl2"><span>Rôle</span><div class="rlc">' + "".join(f'<label><input type="radio" name="irl"{" checked" if n == 0 else ""}><b>{t}</b><small>{d}</small></label>' for n, (t, d) in enumerate(
                      [("Membre", "Parle à ses experts"), ("Responsable", "Gère les experts de son service"), ("Administrateur", "Gère tout l’espace")])) + '</div></div>', 1)
    h = h.replace('<a class="link sm" href="bienvenue.html" style="align-self:center">', '<a class="link sm" href="#" data-open="invprev" style="align-self:center">', 1)
    prev = f"""<div class="modal" id="invprev"><div class="ov" data-close></div><div class="pn shpn ivp"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Ce que reçoit la personne invitée</h2><div class="seg ivs"><a class="on" data-iv="mail">{ic("mail", "s")} Email</a><a data-iv="tg">{TG} Telegram</a></div>
<div class="ivm on" data-iv="mail"><div class="ivh"><span class="xs mute3">De : Yelema pour Unifood &lt;invitations@yelema.ai&gt;</span><b>Aïcha Diabaté vous invite dans l’espace Unifood</b></div>
<div class="ivb"><img class="ivl" src="{B}yelema_logo_final_long.svg" alt="Yelema"><p>Bonjour Awa,</p><p>Aïcha Diabaté vous invite à rejoindre l’espace de travail <b>Unifood</b> sur Yelema. Vous y retrouverez vos experts : <b>Djénéba</b>, Chief of Staff.</p>
<a class="btn p" href="bienvenue.html">Rejoindre l’espace Unifood</a><p class="xs mute3">Le lien est valable 7 jours. Si vous ne connaissez pas Aïcha, ignorez ce message.</p></div></div>
<div class="ivm" data-iv="tg"><div class="ivtg"><div class="bub">Bonjour Awa 👋 Aïcha Diabaté vous invite dans l’espace Unifood sur Yelema. Djénéba, votre Chief of Staff, vous attend.</div><a class="btn k sm" href="bienvenue.html">Ouvrir l’invitation</a></div></div>
<div class="row" style="justify-content:flex-end;margin-top:12px"><a class="btn o" href="bienvenue.html">{ic("eye", "s")} Voir la page d’arrivée</a></div></div></div>"""
    return h + prev

# équipe d'un expert : les vrais postes
_x_profil2_avant = x_profil2
def x_profil2(k):
    h = _x_profil2_avant(k)
    for n, r, po in [("Aïcha Diabaté", "Responsable", "Directrice marketing"), ("Nadège Touré", "Binôme", "Chargée de communication"), ("Yao Kra", "Binôme", "Graphiste"),
                     ("Jean-Marc Aka", "Direction", "Directeur général"), ("Serge Bamba", "Direction", "Directeur administratif")]:
        h = h.replace(f'<b>{n}</b><small>{r}</small>', f'<b>{n}</b><small>{po}</small>')
    return h

# détails de l'entreprise : logo long et icône carrée (menu replié)
_adm_general_avant = adm_general
def adm_general(brand):
    h = _adm_general_avant(brand)
    ico = (f'<div class="row" style="gap:10px;align-items:center"><span class="icsq"><img src="{B}{CLIENT.get("icone", CLIENT["logo"])}" alt=""></span>'
           f'<a class="btn o sm" href="#" data-toast="Choisissez une image carrée, 512 × 512 px">{ic("upload", "s")} Changer</a></div>')
    return h.replace('<div class="sg"><div><div class="grow"><b>Logo</b><span class="d">Plusieurs formats</span></div>',
        '<div class="sg"><div><div class="grow"><b>Logo</b><span class="d">Plusieurs formats, version longue</span></div>', 1).replace(
        '<div><div class="grow"><b>Couleurs</b>', f'<div><div class="grow"><b>Icône carrée</b><span class="d">Affichée quand le menu est replié</span></div><div class="ctl">{ico}</div></div><div><div class="grow"><b>Couleurs</b>', 1)

# canaux de l'organisation : le même composant que partout
def adm_canaux(brand):
    t = chan_card("Web", WEB_LOGO, "Cet espace, sur ordinateur et téléphone", True, f'<a class="btn k sm" href="accueil.html">Ouvrir {ic("arrow-right", "s")}</a>')
    for n, d, on, det, u, lib in CANAUX:
        btn = (f'<a class="btn k sm" href="{u}" target="_blank" rel="noopener">Ouvrir {ic("arrow-up-right", "s")}</a>' if on and u.startswith("http")
               else (f'<a class="btn k sm" href="#" data-toast="Ouverture de la messagerie">Ouvrir {ic("arrow-right", "s")}</a>' if on else f'<a class="btn o sm" href="#" data-open="cz" data-app="{n}">{ic("plus", "s")} Connecter</a>'))
        t += chan_card(n, chan_logo(n, d), det, on, btn)
    cards = sorted(re.findall(r'<div class="chc.*?</div>', t, flags=re.S), key=lambda c: next((i for i, x in enumerate(CH_ORDRE) if f"<b>{x}</b>" in c), 9))
    corps = f"""<div class="hello"><div class="grow"><h1>Canaux</h1><p class="sub">Où vos experts vous parlent, pour toute l'organisation</p></div></div>
<div class="chcs chcs-act" style="margin-top:16px">{"".join(cards)}</div>
<p class="xs mute3" style="margin-top:12px">Telegram est le canal conseillé : un groupe pour l'entreprise, un sujet par expert.</p>"""
    return admin_page("admin-canaux", "Canaux", corps, brand)


# tableaux : « Enregistrer comme modèle » remplace Dupliquer ; les modèles se retrouvent à la création (choix A du 01/10, 22:30)
_tdb_agent_avant74 = tdb_agent
def tdb_agent(k, part=None, titre=None, copie=False):
    h = _tdb_agent_avant74(k, part, titre, copie)
    return re.sub(r'<a class="btn o sm tbdup" href="#" data-dupk="[^"]*" data-dup2="([^"]*)" aria-label="Dupliquer">.*?<span>Dupliquer</span></a>',
                  lambda m: f'<a class="btn o sm tbtpl" href="#" data-open="savetpl" data-tpl="{m.group(1)}" data-tplk="{k}" aria-label="Enregistrer comme modèle">{ic("layout-template", "s")} <span>Enregistrer comme modèle</span></a>', h, count=1, flags=re.S)

TPLS_X = [("Pilotage de la semaine", "djeneba", "Engagements, rendez-vous, blocages"), ("Calendrier éditorial", "fatima", "Posts, vues, engagements"), ("Studio et visuels", "koffi", "Livraisons, retours, formats")]
TPLS_V = [("Revue marketing du lundi", "AD", "Aïcha, partagé avec l’équipe")]
def tpl_card(t, img, sub, cls=""):
    return f'<label class="tpc{cls}"><input type="radio" name="ntpl"><span class="tpi">{img}</span><span class="grow"><b>{t}</b><small>{sub}</small></span></label>'
def modal_savetpl():
    vis = "".join(f'<label><input type="radio" name="tplv"{" checked" if n == 1 else ""}><span class="rli">{ic(i, "s")}</span><b>{t}</b><small>{d}</small></label>' for n, (i, t, d) in enumerate([("lock", "Moi seule", "Visible dans vos modèles"), ("users", "Toute l’équipe", "Chaque membre peut partir de ce modèle")]))
    return f"""<div class="modal" id="savetpl"><div class="ov" data-close></div><div class="pn shpn tplpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Enregistrer comme modèle</h2><p class="sm mute">Le modèle garde les blocs, leurs formats et la période. Les chiffres ne sont pas copiés : l’expert les recalcule pour chaque nouveau tableau.</p>
<label class="fl2"><span>Nom du modèle</span><input class="fi tpln" style="width:100%"></label>
<label class="fl2"><span>Description <small class="xs mute3">facultatif</small></span><input class="fi" style="width:100%" placeholder="Par exemple : à utiliser pour chaque lancement de produit"></label>
<div class="fl2"><span>Qui peut l’utiliser</span><div class="rlc rlc2">{vis}</div></div>
<div class="tplbl"><span class="xs mute3">Contenu du modèle</span><span class="tplbc"></span></div>
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px"><a class="btn o" href="#" data-close>Annuler</a><a class="btn p tplok" href="#">{ic("check", "s")} Enregistrer le modèle</a></div></div></div>"""

_page_tdb_avant74 = page_tdb
def page_tdb(brand):
    h = _page_tdb_avant74(brand)
    xs = "".join(tpl_card(t, f'<img src="{B}{k}.jpg" alt="">', f"Proposé par {qui(k)['prenom']}, {d.lower()}") for t, k, d in TPLS_X)
    vs = "".join(tpl_card(t, face(i, "", 34), d) for t, i, d in TPLS_V)
    bloc = (f'<h3 class="shh">Comment démarrer</h3><div class="seg tpsg"><a class="on" data-tps="mod">{ic("layout-template", "s")} Partir d’un modèle</a><a data-tps="zero">{ic("plus", "s")} Partir de zéro</a></div>'
            f'<div class="tpbox"><p class="tbg2">Vos modèles</p><div class="tpls tplv">{vs}</div><p class="tbg2">Proposés par vos experts</p><div class="tpls">{xs}</div></div>')
    h = h.replace('<label class="fl2 ntn">', bloc + '<label class="fl2 ntn">', 1)
    return h.replace('</main>', '</main>' + modal_savetpl(), 1)

# partage : chaque tableau a son lien par défaut, toujours visible (vocal du 01/10, 22:50)
def _lien74(html):
    if 'id="share"' not in html or 'class="seg shs" data-sh' not in html:
        return html
    acc = "".join(f'<option value="{v}"{" selected" if v == "org" else ""}>{t}</option>' for v, t in [("org", "Membres de l’entreprise"), ("perso", "Personnes ajoutées seulement"), ("public", "Toute personne qui a le lien")])
    blk = (f'<div class="tblk"><span class="tblki">{ic("link", "s")}</span><div class="grow"><b class="sm">Lien du tableau</b>'
           f'<span class="ell tblku">yelema.ai/t/pilotage-de-la-direction</span></div><a class="btn p sm tblkc" href="#">{ic("copy", "s")} Copier le lien</a></div>'
           f'<label class="tblka"><span class="xs mute3">Qui peut l’ouvrir</span><select class="fi tblks" aria-label="Qui peut ouvrir le lien">{acc}</select></label>'
           f'<p class="xs mute3 tblkd">Les membres de l’entreprise l’ouvrent en lecture, après connexion.</p>')
    html = re.sub(r'<div class="seg shs" data-sh>.*?</div>\s*<div class="shv on" id="sh-prive">', blk + '<h3 class="shh">Personnes ajoutées</h3><div class="shv on" id="sh-prive">', html, count=1, flags=re.S)
    html = re.sub(r'<div class="shv" id="sh-public"><p class="xs mute3">Pour l’extérieur.*?</div></div>', '<div class="shv on" id="sh-public"><p class="shh" style="margin-top:14px">Si le lien est public</p><p class="xs mute3">Sans connexion, en lecture seule, avec la signature Powered by Yelema en bas de page.</p></div>', html, count=1, flags=re.S)
    html = html.replace(f'<a class="btn p sm" href="#" data-open="share" data-shk=',
                        f'<a class="btn o sm tbcl" href="#" aria-label="Copier le lien du tableau">{ic("link", "s")}</a><a class="btn p sm" href="#" data-open="share" data-shk=')
    return html

# accueil : un seul bloc « En ce moment » (tâche en cours, puis dernière livraison), plus de fil qui défile (choix A, 01/10 22:57)
def _accueil74(html):
    if '<div class="tick" data-tick>' not in html or '<h2>En ce moment</h2>' not in html:
        return html
    html = re.sub(r'<div class="tick" data-tick>.*?<button class="tnx"[^>]*>.*?</svg></button></div>\n?', '', html, count=1, flags=re.S)
    m = re.search(r'<div class="h2x" style="margin-top:22px"><h2>En ce moment</h2></div>(<a class="lvnow".*?</a>)', html, flags=re.S)
    if not m:
        return html
    last = (f'<a class="nowl" href="koffi.html#livrables"><span class="nowi">{ic("circle-check", "s")}</span><img src="{B}koffi.jpg" alt="">'
            f'<span class="grow ell"><b>Koffi</b> a livré la v2 du packaging Super Mint à Yao</span><time>09:40</time></a>')
    box = (f'<div class="h2x" style="margin-top:22px"><h2>En ce moment</h2><a class="wlink" href="notifications.html">Tout voir {ic("arrow-right", "s")}</a></div>'
           f'<div class="nowbox">{m.group(1)}<div class="nowsep"><span>Dernière livraison</span></div>{last}</div>')
    return html[:m.start()] + box + html[m.end():]

# tableaux, vocal du 01/10 23:00 : apprentissages en pleine largeur, icônes des indicateurs, Slides visible, partage à deux, réception web
FULL = FULL + ("learn",)
KK_IC = [("commande", "shopping-cart"), ("boutique", "store"), ("panier", "shopping-basket"), ("rupture", "package-x"), ("distribut", "truck"), ("stock", "boxes"), ("publication", "megaphone"), ("impression", "eye"), ("portée", "radio"), ("partage", "share-2"), ("recrue", "user-plus"), ("embauch", "user-check"), ("profil", "id-card"), ("note", "star"), ("visite", "map-pin"), ("zone", "map"), ("réunion", "calendar-check"), ("cr ", "file-check"), ("compte", "file-check"), ("engagement", "handshake"), ("retard", "alarm-clock"), ("décision", "gavel"),
         ("temps", "clock"), ("email", "mail"), ("mail", "mail"), ("sollicitation", "filter"), ("post", "megaphone"), ("vue", "eye"), ("abonné", "users"),
         ("engag", "heart"), ("clic", "mouse-pointer-click"), ("vente", "shopping-bag"), ("chiffre", "banknote"), ("budget", "wallet"), ("coût", "wallet"),
         ("candidat", "user-search"), ("entretien", "messages-square"), ("poste", "briefcase"), ("visuel", "image"), ("livr", "package-check"), ("retour", "message-circle"),
         ("taux", "percent"), ("prospect", "target"), ("rendez", "calendar"), ("appel", "phone"), ("devis", "file-text"), ("client", "user-round"), ("délai", "timer")]
def _kk_ic(lbl):
    l = lbl.lower()
    return next((i for k, i in KK_IC if k in l), "activity")
def _tdb76(html):
    if 'class="kks"' in html:
        html = re.sub(r'<div class="kk"><span>([^<]+)</span>', lambda m: f'<div class="kk"><span><i class="kki">{ic(_kk_ic(m.group(1)), "s")}</i>{m.group(1)}</span>', html)
    html = html.replace('<span>Google Slides</span></a>', f'<span>Google Slides</span>{ic("arrow-up-right", "s")}</a>')
    if 'data-t="tb-kouassi"' in html:
        html = re.sub(r'(<a href="#" data-t="tb-kouassi"[^>]*><span class="tbav"><img[^>]*>)(.*?)(</span><span class="grow"><b>[^<]*</b><small>)Partagé par Kader Ouattara',
                      lambda m: m.group(1) + f'<span class="tbav2">{face("KO", "", 20)}{face("FB", "", 20)}</span>' + m.group(3) + 'Partagé par Kader et Fanta', html, count=1, flags=re.S)
        html = re.sub(r'Partagé par Kader Ouattara, ', 'Partagé par Kader Ouattara et Fanta Bakayoko, ', html)
        html = html.replace(f'{face("KO", "", 22)} Partagé par Kader Ouattara et Fanta', f'<span class="tbby2">{face("KO", "", 22)}{face("FB", "", 22)}</span> Partagé par Kader Ouattara et Fanta')
    if '<h3 class="shh">Le recevoir aussi en</h3><div class="fmts">' in html:
        html = html.replace('<h3 class="shh">Le recevoir aussi en</h3><div class="fmts">',
                            f'<h3 class="shh">Comment le recevoir</h3><div class="fmts"><label class="fmc fmlk"><input type="checkbox" checked disabled>{ic("link", "s")} Lien web <small class="xs mute3">toujours inclus</small></label>', 1)
    return html

def _fix74(html):
    html = html.replace(f'<span class="composio">{ic("plug-zap", "s")} Fournis par Composio, plus de 3 000 outils</span>', f'<span class="composio">{ic("plug-zap", "s")} Plus de 3 000 outils disponibles</span>')
    html = html.replace(f'<span class="composio">{ic("plug-zap", "s")} Connecteurs fournis par Composio</span>', f'<span class="composio">{ic("plug-zap", "s")} Plus de 3 000 outils disponibles</span>')
    html = html.replace(f'<span class="composio">{ic("plug-zap", "s")} Fournis par Composio</span>', f'<span class="composio">{ic("plug-zap", "s")} Plus de 3 000 outils disponibles</span>')
    html = html.replace('<p class="sub">Fournis par Composio, partagés par tous les experts</p>', '<p class="sub">Partagés par tous les experts</p>')
    html = html.replace('Connexion sécurisée par Composio', 'Connexion sécurisée')
    html = html.replace(f'<a class="btn o sm" href="#" data-toast="Ouverture de la mémoire" style="margin-top:10px">{ic("eye", "s")} Voir ce qu\'elle sait</a>', '')
    html = html.replace('<section class="an-imp"><div><small>Impact</small>', '<section class="an-imp"><div><small>Temps rendu</small>')
    # livrables : période au choix
    html = html.replace('<a data-per="tri">Trimestre</a></div>', f'<a data-per="tri">Trimestre</a></div><label class="anr lvdt">{ic("calendar", "s")}<input type="date" value="2026-09-01" aria-label="Du"><span>au</span><input type="date" value="2026-10-01" aria-label="Au"></label>')
    # canaux du recrutement : même composant
    html = re.sub(r'<span class="dt( on)?"><img src="([^"]+)" alt=""><b>([^<]+)</b><span>([^<]+)</span><i>.*?</i></span>',
                  lambda m: chan_card(m.group(3), TG if m.group(3) == "Telegram" else f'<img src="{m.group(2)}" alt="">', m.group(4), bool(m.group(1)), sel=("checkbox", "rqch")), html, flags=re.S)
    html = html.replace('<div class="dts">', '<div class="chcs">')
    html = re.sub(r'<div class="onbc">(.*?)</div>', lambda m: '<div class="chcs">' + "".join(
        chan_card(x.group(2), TG if x.group(2) == "Telegram" else f'<img src="{x.group(1)}" alt="">', x.group(3), "checked" in x.group(0), sel=("radio", "onbc"))
        for x in re.finditer(r'<label><input type="radio" name="onbc"[^>]*><img src="([^"]+)" alt=""><b>([^<]+)</b><small>([^<]+)</small></label>', m.group(1))) + '</div>', html, count=1, flags=re.S)
    html = re.sub(r'<a href="\.\./(yelema|client)/admin-general\.html" class="on">', r'<a href="#" class="on" data-toast="Cet habillage est déjà actif">', html)
    return _tdb76(_accueil74(_lien74(html))).replace('yelema_logo_final_long.svg', 'yelema_long.png')
