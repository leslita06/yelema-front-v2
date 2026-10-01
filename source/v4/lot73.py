
# ---------- v4.18 mobile (barre d'onglets, feuilles), deux boutons d'affichage, tableaux de bord retravaillés, dates en français, états en cours
def modes_btn(actif, brand):
    return (f'<button class="tbtn ico apbtn" data-pop="eclair" aria-label="Éclairage" title="Éclairage">{ic("sun", "s")}{ic("moon", "s")}</button>'
            f'<button class="tbtn ico" data-pop="modes" aria-label="Couleurs" title="Couleurs">{ic("palette", "s")}</button>')

def modes_pop(actif, brand):
    def th(b, nom, sub, sw):
        on = " on" if b == brand else ""
        return (f'<a class="mdx{on}" href="../{b}/{actif}.html"><span class="msw">{sw}</span>'
                f'<span class="grow"><b>{nom}</b><small>{sub}</small></span><span class="mck">{ic("check", "s")}</span></a>')
    ap = "".join(f'<a class="apo" data-ap="{k}"><span class="ic">{ic(i, "s")}</span><span class="grow"><b>{l}</b><small>{d}</small></span><span class="mck">{ic("check", "s")}</span></a>' for k, i, l, d in
                 [("clair", "sun", "Clair", "Fond blanc, pour la journée"), ("sombre", "moon", "Sombre", "Fond foncé, repose les yeux le soir"),
                  ("auto", "sun-moon", "Automatique", "Suit le réglage de votre appareil")])
    return f"""<div class="pop mpop" id="eclair"><h3>Éclairage</h3><div class="apseg apl">{ap}</div></div>
<div class="pop mpop" id="modes"><h3>Couleurs</h3>
{th("yelema", "Yelema", "Les couleurs Yelema", '<i style="background:#301667"></i><i style="background:#8D68FA"></i><i style="background:#E4765A"></i>')}
{th("client", "Votre entreprise", "La charte d’Unifood", '<i style="background:#E00040"></i><i style="background:#F8B400"></i><i style="background:#5A1022"></i>')}</div>"""

def topbar(crumb, actif, brand):
    return f"""<header class="top"><a class="mlogo" href="accueil.html" aria-label="Accueil"><img src="{B}{CLIENT['logo']}" alt="{CLIENT['nom']}"></a><div class="crumb grow">{crumb}</div>
{modes_btn(actif, brand)}
<button class="tbtn ico" data-pop="ping" aria-label="Messages">{ic("message-circle", "s")}<span class="bdg">2</span></button>
<button class="tbtn ico" data-pop="notifs" aria-label="Notifications">{ic("bell", "s")}<span class="bdg">4</span></button>
</header>"""

def tabbar(actif):
    eq = actif in ("djeneba", "fatima", "koffi", "recruter") or actif.startswith("recrue")
    its = [("house", "Accueil", "accueil.html", actif == "accueil", ""), ("layout-dashboard", "Tableaux", "tableau-de-bord.html", actif == "tableau-de-bord", ""),
           ("message-square-text", "Chat", "memoire.html", actif in ("memoire", "chat"), ""), ("users", "Équipe", "#", eq, ' data-sheet="sh-equipe"'),
           ("circle-user-round", "Moi", "#", actif in ("profil", "notifications"), ' data-sheet="sh-moi"')]
    a = "".join(f'<a href="{h}"{x}{" class=on aria-current=page" if on else ""}><span class="tbi">{ic(i, "s")}</span>{l}</a>' for i, l, h, on, x in its)
    rows = ""
    for k in ("djeneba", "fatima", "koffi"):
        e = EXPERTS[k]
        st = '<span class="mslive"><span class="dot"></span> Au travail</span>' if e["live"] else '<span class="xs mute3">Disponible</span>'
        rows += (f'<a class="msr{" on" if actif == k else ""}" href="{k}.html"><img src="{B}{e["photo"]}" alt=""><span class="grow"><b>{e["prenom"]}</b><small>{e["role"]}</small></span>{st}</a>')
    eqs = (f'<div class="msheet" id="sh-equipe" role="dialog" aria-modal="true" aria-label="Mon équipe"><div class="msov" data-shclose></div><div class="mspn"><span class="msgrip"></span>'
           f'<h3>Mon équipe</h3>{rows}<div class="msb"><a class="btn o" href="chat.html">{ic("messages-square", "s")} Discussions</a><a class="btn p" href="recruter.html">{ic("user-plus", "s")} Recruter un expert</a></div></div></div>')
    moi = (f'<div class="msheet" id="sh-moi" role="dialog" aria-modal="true" aria-label="Mon compte"><div class="msov" data-shclose></div><div class="mspn"><span class="msgrip"></span>'
           f'<a class="msme" href="profil.html">{face("AD", "", 48)}<span class="grow"><b>Aïcha Diabaté</b><small>Directrice marketing, Unifood</small></span>{ic("chevron-right", "s")}</a>'
           f'<a class="msi" href="notifications.html">{ic("bell", "s")} Notifications<span class="n">4</span></a>'
           f'<a class="msi" href="admin.html">{ic("settings", "s")} Administration</a>'
           f'<a class="msi" href="#" data-yele>{ic("life-buoy", "s")} Aide, avec Yélé</a>'
           f'<a class="msi" href="connexion.html#out">{ic("log-out", "s")} Se déconnecter</a>'
           f'<a class="pby" href="https://leslita06.github.io/yelema-site-preview/">Powered by <img src="{B}yelema_logo_final_long.svg" alt="Yelema"></a></div></div>')
    return f'<nav class="tabbar" aria-label="Navigation principale">{a}</nav>{eqs}{moi}'

def page(actif, brand, titre, crumb, corps, wrap=True, dock=False):
    d = ""
    if dock:
        d = (f'<a class="dock" href="djeneba.html#discussion"><div class="in"><span class="who"><img src="{B}djeneba.jpg" alt=""><img src="{B}fatima.jpg" alt=""><img src="{B}koffi.jpg" alt=""></span>'
             f'<span class="ph">Demander à mon équipe</span><span class="mic">{ic("mic", "s")}</span></div></a>')
    inner = f'<div class="page">{corps}</div>' if wrap else corps
    return (b3.head(titre, brand) + '<div class="app">' + sidebar(actif, brand) + '<main style="min-width:0">' + topbar(crumb, actif, brand)
            + inner + '</main></div>' + pops() + modes_pop(actif, brand) + yele() + modales() + d + tabbar(actif) + fin())

# états en cours, vivants
LIVE = {"fatima": ("Rédige les 3 posts de la promo Sossa", ["Relit le brief de la campagne", "Écrit le texte du post 2 sur 3", "Choisit le visuel avec Koffi", "Vérifie la charte et les mentions"], 64, "environ 12 min")}
def live_now(k, compact=False):
    if k not in LIVE:
        return ""
    e = EXPERTS[k]
    t, steps, pc, rest = LIVE[k]
    st = "".join(f'<span{" class=on" if n == 1 else ""}>{s}</span>' for n, s in enumerate(steps))
    return (f'<a class="lvnow{" sm" if compact else ""}" href="{k}.html#direct" data-live><span class="lvav"><img src="{B}{e["photo"]}" alt=""><i></i></span>'
            f'<span class="grow"><span class="lvtt"><b>{e["prenom"]}</b> {t[0].lower() + t[1:]}</span><span class="lvs2" aria-live="polite">{st}</span>'
            f'<span class="lvbar"><i style="width:{pc}%"></i></span></span><span class="lvr"><b class="num" data-pc="{pc}">{pc} %</b><small>{rest}</small></span></a>')

_page_accueil_avant = page_accueil
def page_accueil(brand):
    h = _page_accueil_avant(brand)
    return h.replace('<div class="h2x" style="margin-top:22px"><h2>Mon équipe</h2></div>',
                     f'<div class="h2x" style="margin-top:22px"><h2>En ce moment</h2></div>{live_now("fatima")}<div class="h2x" style="margin-top:26px"><h2>Mon équipe</h2></div>', 1)

_page_expert_avant = page_expert
def page_expert(k, brand):
    h = _page_expert_avant(k, brand)
    if k in LIVE:
        h = h.replace('<div class="rail"><div class="rbox">', f'<div class="rail"><div class="rbox lvbox"><h4>{ic("loader", "s")} En ce moment</h4>{live_now(k, True)}</div><div class="rbox">', 1)
    return h

# tableaux de bord : filtres sur une ligne, période étendue
PERIODES = [("semaine", "Semaine"), ("mois", "Mois"), ("trimestre", "Trimestre"), ("semestre", "Semestre"), ("annee", "Année")]
def fdd(cls, icone, label, corps, extra=""):
    return (f'<details class="fdd {cls}"{extra}><summary>{ic(icone, "s")}<span class="fdl ell">{label}</span>{ic("chevron-down", "s")}</summary>'
            f'<div class="fdp">{corps}</div></details>')

def filtres(k=None):
    used = [p for p in PROJ if k and any(p in w[2] for w in TDB[k])] or list(PROJ)[:4]
    tout = FILT_LBL.get(k, "Tous les projets")
    nom = {"Tous les postes": "un poste", "Toutes les zones": "une zone", "Toutes les campagnes": "une campagne"}.get(tout, "un projet")
    items = f'<a class="fdo on" data-fp="">{ic("layers", "s")} <span>{tout}</span>{ic("check", "s")}</a>' + "".join(
        f'<a class="fdo" data-fp="{p}">{ic(PROJ[p][0], "s")} <span>{PROJ[p][1]}</span>{ic("check", "s")}</a>' for p in used)
    pr = fdd("fdpj", "folder-kanban", tout, f'<label class="fdq">{ic("search", "s")}<input type="search" placeholder="Chercher {nom}" aria-label="Chercher {nom}"></label><div class="fdos">{items}</div><p class="fdnone" hidden>Aucun résultat.</p>')
    per = '<div class="seg tdper">' + "".join(f'<a data-per="{v}"{" class=on" if v == "semaine" else ""}>{l}</a>' for v, l in PERIODES) + '</div>'
    dt = f'<p class="fdh">Ou des dates précises</p><label class="anr tddt">{ic("calendar", "s")}<input type="date" value="2026-09-28" aria-label="Du"><span>au</span><input type="date" value="2026-10-04" aria-label="Au"></label>'
    pe = fdd("fdpe", "calendar-range", "Cette semaine", per + dt)
    ty = ""
    if k:
        ty = (f'<label class="tdty fsel">{ic("shapes", "s")}<select aria-label="Type de bloc"><option value="">Tous les blocs</option>'
              + "".join(f'<option>{w[1]}</option>' for w in TDB[k] if w[0] != "kst") + f'</select>{ic("chevron-down", "s")}</label>')
    q = f'<label class="srch tdq">{ic("search", "s")}<input type="search" placeholder="Chercher dans le tableau" aria-label="Chercher dans le tableau"></label>'
    return f'<div class="tdf tdf1">{pr}{pe}{ty}{q}</div>'

def dl_menu(nom):
    return (f'<details class="dlm"><summary class="btn o sm">{ic("download", "s")} <span>Télécharger</span></summary><div class="dlml">'
            f'<a href="#" data-toast="PowerPoint téléchargé : {nom}.pptx"><span class="pdfi ppt">PPT</span><span><b>PowerPoint</b><small>Modifiable, une diapositive par bloc</small></span></a>'
            f'<a href="#" data-toast="PDF téléchargé : {nom}.pdf"><span class="pdfi">PDF</span><span><b>PDF</b><small>Prêt à imprimer ou à envoyer</small></span></a><p class="dlsig">Chaque export porte la signature Yelema en bas de page.</p></div></details>')

def gs_btn(nom):
    return f'<a class="btn o sm gsb" href="#" data-open="gslides" data-gs="{nom}"><img src="{FAV}slides.google.com" alt=""> <span>Google Slides</span></a>'

def tb_editbar(k):
    e = qui(k)
    fm = "".join(f'<label class="fmc"><input type="checkbox"{" checked" if n == 0 else ""} value="{l}">{ic(i_, "s")} {l}</label>' for n, (i_, l) in enumerate(TB_FMTS))
    sg_ = "".join(f'<span data-sw="{x}">{ic("sparkles", "s")} {x}</span>' for x in TB_ASK.get(k, SUGG_W.get(k, [])))
    ex = TB_ASK.get(k, ["les chiffres de la semaine"])[0].lower()
    return (f'<div class="tbedit"><div class="tbeh"><span class="ic">{ic("pencil", "s")}</span><div class="grow"><b>Vous modifiez ce tableau</b><span>Glissez les blocs pour les déplacer, masquez-les dans les partages ou retirez-les.</span></div>'
            f'<a class="btn p sm tbdone" href="#">{ic("check", "s")} Enregistrer</a></div>'
            f'<div class="tbcmp"><div class="seg tbmode"><a class="on" data-m="new">{ic("square-plus", "s")} Nouveau bloc</a><a data-m="fb">{ic("message-square-text", "s")} Retour sur le tableau</a></div>'
            f'<div class="tbfmw"><p class="tbfl">Formats du bloc <small>un ou plusieurs</small></p><div class="fmts sm tbfm">{fm}</div></div>'
            f'<div class="tbthr" aria-live="polite"></div>'
            f'<form class="tbask" data-k="{k}" data-who="{e["prenom"]}"><img src="{B}{e["photo"]}" alt=""><div class="tbin"><textarea rows="2" data-ph-new="Décrivez le bloc à {e["prenom"]}, par exemple : {ex}" data-ph-fb="Dites à {e["prenom"]} ce qu’il faut changer, par exemple : les chiffres en mois plutôt qu’en semaines" placeholder="Décrivez le bloc à {e["prenom"]}, par exemple : {ex}" aria-label="Votre demande à {e["prenom"]}"></textarea>'
            f'<div class="tbinb"><span class="tbsel xs mute3"></span><button class="tbsend" type="submit" aria-label="Envoyer à {e["prenom"]}">{ic("arrow-up", "s")}</button></div></div></form>'
            f'<div class="mws">{sg_}</div></div></div>')

def tdb_agent(k, part=None, titre=None, copie=False):
    e = qui(k)
    ws = "".join(wcard(k, *w) for w in TDB[k])
    if part:
        _, par_, ini, droit, exp, titre_ = part
        head = (f'<div class="tbh2"><div class="grow"><h2>{titre_}</h2><span class="tbby">{face(ini, "", 22)} Partagé par {par_}, '
                f'{ic("pencil" if droit == "Édition" else "eye", "s")} {droit.lower()} jusqu’au {exp}</span></div>'
                f'<div class="tbact">{gs_btn(titre_)}{dl_menu(titre_)}<a class="btn p sm" href="#" data-dupk="tb-{part[0]}-copie" data-dup2="{titre_}">{ic("copy-plus", "s")} <span>Copier dans mes tableaux</span></a></div></div>')
        bar = ""
    else:
        titre = titre or TB_TITRE.get(k, "Tableau de " + e["prenom"])
        tid = {"Nouvelle ligne de confiserie": "djeneba2"}.get(titre, k)
        dup = "" if copie else f'<a class="btn o sm tbdup" href="#" data-dupk="tb-{tid}-copie" data-dup2="{titre}" aria-label="Dupliquer">{ic("copy-plus", "s")} <span>Dupliquer</span></a>'
        sub = (f'<span class="tbby tbcp">{ic("copy", "s")} Copie de « {titre[:-8]} », créée à l’instant par vous. Adaptez-la avant de la partager.</span>' if copie else
               f'<span class="tbby"><img src="{B}{e["photo"]}" alt=""> Tenu par {e["prenom"]}, {e["role"]}, mis à jour aujourd’hui à 10:31</span>')
        head = (f'<div class="tbh2"><div class="grow"><h2>{titre}</h2>{sub}</div>'
                f'<div class="tbact"><a class="btn o sm tbed" href="#">{ic("pencil", "s")} <span>Modifier</span></a>'
                f'{dup}{gs_btn(titre)}{dl_menu(titre)}'
                f'<a class="btn p sm" href="#" data-open="share" data-shk="{k}">{ic("share-2", "s")} <span>Partager</span></a></div></div>')
        bar = tb_editbar(k)
    sig = (f'<a class="tbsig" href="https://leslita06.github.io/yelema-site-preview/" target="_blank" rel="noopener"><span>Tableau préparé par {e["prenom"]}, Expert IA Yelema {SIG_SPEC.get(k, "")}.</span>'
           f'<span class="pby2">Powered by <img src="../img/yelema_logo_final_long.svg" alt="Yelema"></span></a>')
    return f'{head}{bar}{filtres(k)}<section class="mwg2">{ws}</section>{sig}'

def modal_gslides():
    return f"""<div class="modal" id="gslides"><div class="ov" data-close></div><div class="pn shpn gspn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<div class="row" style="gap:10px;align-items:center"><img src="{FAV}slides.google.com" alt="" style="width:28px;height:28px"><div><h2 style="margin:0">Présentation Google Slides</h2><p class="sm mute gsn">Tableau</p></div></div>
<div class="gsv"><div class="gss on"><span class="gsk">Diapositive 1</span><b class="gst">Tableau</b><span class="gsd">Semaine du 28 septembre</span><span class="gsf">Powered by <img src="../img/yelema_logo_final_long.svg" alt="Yelema"></span></div>
<div class="gsth"><i class="on"></i><i></i><i></i><i></i><i></i><i></i></div></div>
<p class="xs mute3">Une diapositive par bloc, mise à jour à chaque nouvelle version du tableau. Rangée dans votre Drive, dossier Tableaux de bord.</p>
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px;flex-wrap:wrap"><a class="btn o" href="#" data-close data-toast="Lien de la présentation copié">{ic("link", "s")} Copier le lien</a><a class="btn p" href="#" data-close data-toast="Présentation ouverte dans Google Slides">{ic("external-link", "s")} Ouvrir dans Google Slides</a></div></div></div>"""

_page_tdb_avant = page_tdb
def page_tdb(brand):
    h = _page_tdb_avant(brand)
    # copies prêtes, révélées par Dupliquer
    cps = [("djeneba", "djeneba", "Pilotage de la direction"), ("djeneba2", "djeneba", "Nouvelle ligne de confiserie"), ("fatima", "fatima", "Marketing et contenu"), ("koffi", "koffi", "Studio design")]
    cps += [(p[0], p[0], p[5]) for p in TDB_PART]
    lis = "".join(f'<a href="#" data-t="tb-{tid}-copie" data-g="mine" hidden><span class="tbav"><img src="{B}{qui(x)["photo"]}" alt=""></span><span class="grow"><b>{t} (copie)</b><small>Vous, à l’instant</small></span></a>' for tid, x, t in cps)
    pans = "".join(f'<div class="panel" id="tb-{tid}-copie">{tdb_agent(x, titre=t + " (copie)", copie=True)}</div>' for tid, x, t in cps)
    h = h.replace('<p class="tbg">Partagés avec moi', lis + '<p class="tbg">Partagés avec moi', 1)
    h = h.replace('<div class="tbmain">', '<div class="tbmain">' + pans, 1)
    # création : le nom d'abord, plusieurs formats, période étendue, Google Slides, PowerPoint, PDF
    h = h.replace('<h3 class="shh">Avec quel expert</h3>', '<label class="fl2 ntn"><span>Nom du tableau</span><input class="fi" style="width:100%" placeholder="Par exemple : Lancement Super Mint" aria-label="Nom du tableau"></label><h3 class="shh">Avec quel expert</h3>', 1)
    h = h.replace('<option>Cette semaine</option><option>Ce mois-ci</option><option>Ce trimestre</option>', '<option>Cette semaine</option><option>Ce mois-ci</option><option>Ce trimestre</option><option>Ce semestre</option><option>Cette année</option>', 1)
    h = h.replace('<h3 class="shh">Formats préférés</h3>', '<h3 class="shh">Formats des blocs <small class="xs mute3">un ou plusieurs</small></h3>', 1)
    h = h.replace(f'<label class="fmc"><input type="checkbox">{ic("file-text", "s")} PDF</label>',
                  f'<label class="fmc"><input type="checkbox"><span class="pdfi ppt sm">PPT</span> PowerPoint</label><label class="fmc"><input type="checkbox" checked><span class="pdfi sm">PDF</span> PDF</label>', 1)
    h = h.replace('data-toast="Tableau en cours de création, il arrive dans Mes tableaux dans quelques minutes"', 'data-newtb data-toast="Tableau en cours de création, il arrive dans Mes tableaux dans quelques minutes"', 1)
    h = h.replace('</main>', '</main>' + modal_gslides(), 1)
    return h

# compte : menu standard (profil, administration, aide, changer de compte, se déconnecter)
def acmenu(admin):
    if admin:
        return (f'<div class="acm" hidden><div class="ach"><span class="adav">{ic("shield-check", "s")}</span><span class="grow"><b>Administrateur</b><small>admin@unifood.info</small></span></div>'
                f'<a class="acx" href="admin-profil.html">{ic("user-round", "s")} Profil administrateur</a>'
                f'<a class="acx" href="accueil.html">{ic("arrow-left", "s")} Retour à mon espace</a><div class="acsep"></div>'
                f'<a class="acx" href="accueil.html">{face("AD", "", 22)} Passer au compte d’Aïcha<span class="xs mute3">Utilisateur</span></a>'
                f'<a class="acx out" href="connexion.html#out-admin">{ic("log-out", "s")} Se déconnecter</a></div>')
    return (f'<div class="acm" hidden><div class="ach">{face("AD", "", 36)}<span class="grow"><b>Aïcha Diabaté</b><small>aicha.diabate@unifood.info</small></span></div>'
            f'<a class="acx" href="profil.html">{ic("user-round", "s")} Mon profil</a>'
            f'<a class="acx" href="notifications.html">{ic("bell", "s")} Notifications</a>'
            f'<a class="acx" href="admin.html">{ic("settings", "s")} Administration</a>'
            f'<a class="acx" href="#" data-yele>{ic("life-buoy", "s")} Aide, avec Yélé</a><div class="acsep"></div>'
            f'<a class="acx" href="admin.html"><span class="adav sm">{ic("shield-check", "s")}</span> Passer au compte administrateur</a>'
            f'<a class="acx out" href="connexion.html#out">{ic("log-out", "s")} Se déconnecter</a></div>')
ACMENU = acmenu(False)

def _sb_fix(h):
    logo = f'<img src="{B}{CLIENT["logo"]}" alt="{CLIENT["nom"]}">'
    ico = CLIENT.get("icone", CLIENT["logo"])
    h = h.replace(logo, f'<img class="{"lgw" if CLIENT.get("large") else "lg"}" src="{B}{CLIENT["logo"]}" alt="{CLIENT["nom"]}"><img class="ico" src="{B}{ico}" alt="">', 1)
    pby = f'<a class="pby" href="https://leslita06.github.io/yelema-site-preview/">Powered by <img src="{B}yelema_logo_final_long.svg" alt="Yelema"></a>'
    return h.replace(pby, pby + f'<a class="pbyy" href="https://leslita06.github.io/yelema-site-preview/" title="Powered by Yelema" aria-label="Powered by Yelema"><img src="{B}yelema_y.svg" alt=""></a>', 1)

_sidebar_avant = sidebar
def sidebar(actif, brand):
    return _sb_fix(_sidebar_avant("recruter" if actif.startswith("recrue") else actif, brand))
_sidebar_admin_avant = sidebar_admin
def sidebar_admin(actif, brand):
    return _sb_fix(_sidebar_admin_avant(actif, brand))

def _nav_fix(html):
    html = html.replace('<div class="h2x" style="margin-top:26px"><h2>Mon équipe</h2></div>', '<div class="h2x" id="equipe" style="margin-top:26px"><h2>Mon équipe</h2></div>', 1)
    html = html.replace('<a href="accueil.html" aria-label="Retour à l\'équipe">', '<a href="accueil.html#equipe" aria-label="Retour à l\'équipe">')
    html = html.replace('<div class="crumb grow"><a href="accueil.html">Mon équipe</a>', '<div class="crumb grow"><a href="accueil.html#equipe">Mon équipe</a>')
    html = html.replace(" Rien n'est facturé si la mise en place échoue.", "").replace('<p class="xs mute3">Rien n\'est facturé si la mise en place échoue.</p>', "")
    html = html.replace('<p class="sm mute3" style="margin-top:16px">Prêt en quelques minutes.</p>', '<p class="sm mute3" style="margin-top:16px">Prêt en quelques minutes.</p>')
    html = html.replace('https://www.google.com/s2/favicons?sz=64&domain=yelema.ai', '../img/yelema_y.svg')
    return html

# fiche d'un membre côté admin : rôle et permissions
PERMS = [("users", "Gestion des membres", "Inviter, retirer, changer les rôles", False), ("credit-card", "Gestion de la facturation", "Factures, moyens de paiement, abonnement", False),
         ("building-2", "Gestion de l’organisation", "Détails de l’entreprise, charte, canaux", False), ("user-plus", "Recruter et assigner les experts", "Ajouter un expert, choisir qui y a accès", True),
         ("chart-column", "Voir le suivi de l’équipe", "Coûts, tâches, connecteurs utilisés", True), ("plug", "Gérer les connecteurs", "Brancher ou retirer un outil", False)]
def perm_box():
    rows = "".join(f'<label class="prm"><input type="checkbox"{" checked" if on else ""}><span class="ic">{ic(i, "s")}</span><span class="grow"><b>{t}</b><small>{d}</small></span></label>' for i, t, d, on in PERMS)
    return (f'<div class="box prmbox" data-perm><div class="ch"><h2 style="font-size:16px;font-weight:650">Rôle et permissions</h2></div>'
            f'<label class="fl2"><span class="xs mute3">Rôle</span><select class="fi prmrole" aria-label="Rôle"><option>Administrateur</option><option selected>Responsable de service</option><option>Membre de l’équipe</option></select></label>'
            f'<p class="xs mute3" style="margin:12px 0 6px">Permissions</p><div class="prms">{rows}</div>'
            f'<div class="row prmact"><a class="btn o sm prmno" href="#">Annuler</a><a class="btn p sm prmok" href="#">Enregistrer</a></div></div>')
def page_admin_membre(brand):
    h = admin_page("admin-membres", "Aïcha Diabaté", adm_membre(brand), brand)
    a = '<div><div class="box"><div class="ch"><h2 style="font-size:16px;font-weight:650">Ses experts</h2>'
    return h.replace(a, '<div>' + perm_box() + '<div class="box" style="margin-top:14px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Ses experts</h2>', 1)
