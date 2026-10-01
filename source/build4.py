#!/usr/bin/env python3
"""Front client Yelema v4, structure façon Delos (captures envoyées par Leslie le 01/10/26).

Vue utilisateur : menu latéral fixe (pages + équipe), barre haute avec Ping et notifications,
accueil équipe en tête, espace d'un expert (Discussion, Résumé, Profil, Connecteurs Composio,
Suivi, Sécurité, Drive, Mail, Calendrier, En direct, Livrables), recrutement, chat entreprise.
Vue admin : réglages en barre latérale (Général, Experts, Membres et droits, Chat entreprise,
Suivi, Facturation). Deux habillages : couleurs Yelema + logo du client, couleurs du client.

    python3 build4.py  ->  site/index.html, site/{yelema,client}/*.html
Démo : Unifood (vrai prospect), personnes, projets et chiffres inventés.
"""
import os, sys, json, shutil, glob
ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ICI, "..", "v3"))
import build3 as b3
from build3 import ic, EXPERTS, DASH, MOI, CLIENT, m

OUT = os.path.join(ICI, "site")
B = "../img/"
FAV = "https://www.google.com/s2/favicons?sz=64&domain="

PRO = {
    "djeneba": {"now": "Prépare votre point de 15 h avec le DG", "faces": [("AD", "#7A4E2D")], "duo": "Avec vous",
                "mail": "djeneba@unifood.yelema.ai", "depuis": "le 2 septembre",
                "act": [("ok", "Point du jour envoyé sur WhatsApp", "08:00"), ("ok", "Note au comité de direction", "08:50"), ("go", "Chiffres pour le point DG", "en cours")],
                "skills": [("Tableau de bord", "Construit et met à jour vos widgets à partir de vos demandes, à la voix ou par écrit."),
                           ("Point du jour", "Chaque matin à 8 h, ce qui compte aujourd'hui, ce qui attend votre accord, ce qui a bougé."),
                           ("Notes de direction", "Comptes rendus, notes au comité, relevés de décisions, au format Unifood."),
                           ("Coordination de l'équipe", "Répartit vos demandes entre Fatima, Koffi et les futurs experts.")],
                "rout": [("Point du jour", "Chaque jour, 08:00"), ("Bilan de la semaine", "Chaque vendredi, 17:00"), ("Préparation du comité", "Chaque jeudi, 16:00")]},
    "fatima": {"now": "Adapte le visuel Sossa pour Instagram", "faces": [("AD", "#7A4E2D"), ("NT", "#8A3B12")], "duo": "Avec Aïcha et Nadège",
               "mail": "fatima@unifood.yelema.ai", "depuis": "le 2 septembre",
               "act": [("ok", "Post Facebook promo Sossa", "10:31"), ("ok", "Rapport réseaux de septembre", "09:05"), ("go", "Visuel Sossa pour Instagram", "4 / 5")],
               "skills": [("Posts et campagnes", "Rédige et met en forme vos posts Facebook, Instagram et LinkedIn dans la voix de chaque marque."),
                          ("Calendrier éditorial", "Planifie le mois, propose les sujets, relance quand un visuel manque."),
                          ("Rapports réseaux", "Chaque mois, portée, engagement et meilleurs posts, avec trois recommandations."),
                          ("Veille concurrence", "Suit les pages de vos concurrents et vous signale leurs promos.")],
               "rout": [("Calendrier de la semaine", "Chaque lundi, 09:00"), ("Rapport réseaux", "Le 1er du mois, 09:00"), ("Veille concurrence", "Chaque jour, 18:00")]},
    "koffi": {"now": "Décline le packaging pour l'affiche du point de vente", "faces": [("YK", "#0F7B5F")], "duo": "Avec Yao Kra",
              "mail": "koffi@unifood.yelema.ai", "depuis": "le 15 septembre",
              "act": [("ok", "Maquette packaging v2", "09:40"), ("ok", "6 visuels Super Mint", "mardi"), ("go", "Affiche point de vente", "en cours")],
              "skills": [("Affiches et visuels", "Crée vos affiches, bannières et visuels réseaux dans la charte de chaque marque."),
                         ("Packaging", "Maquettes et déclinaisons de vos emballages, prêtes pour l'imprimeur."),
                         ("Déclinaisons", "Un visuel validé, tous les formats : story, post, affiche A2, kakémono."),
                         ("Chartes de marque", "Tient à jour les couleurs, polices et logos de Sossa et Super Mint.")],
              "rout": [("Déclinaisons du jour", "Chaque jour, 10:00"), ("Brief créatif", "Chaque lundi, 11:00")]},
}

DESC = {"djeneba": "Votre bras droit : point du jour, tableau de bord, notes de direction. Elle coordonne toute l'équipe.",
        "fatima": "Posts, campagnes et calendrier éditorial de Sossa et Super Mint, sur Facebook, Instagram et LinkedIn.",
        "koffi": "Affiches, packaging et déclinaisons de vos visuels, dans la charte de chaque marque."}

INBOX = {
    "fatima": [("arrow-up-right", "Visuels promo Sossa, pour accord", "À Aïcha Diabaté", "10:42", "WhatsApp",
                "Bonjour Aïcha, les trois visuels de la promo rentrée Sossa sont prêts. Le prix est passé en grand comme demandé. Dès votre accord, je publie sur Facebook et j'envoie la version print à Yao."),
               ("arrow-down-left", "Devis impression affiches A2", "De Imprimerie du Plateau", "09:12", "Email", ""),
               ("phone", "Appel avec Aïcha, 4 min", "Résumé disponible", "hier", "Appel", ""),
               ("arrow-up-right", "Relance : photos du point de vente de Yopougon", "À Nadège Touré", "hier", "Email", ""),
               ("arrow-down-left", "Brief campagne de fin d'année", "De Aïcha Diabaté", "mardi", "Email", "")],
    "koffi": [("arrow-up-right", "Maquette packaging v2", "À Yao Kra", "09:40", "Email",
               "Bonjour Yao, la v2 de la maquette est en pièce jointe, avec les deux couleurs. Aïcha garde la version rouge. Je prépare la déclinaison pour l'affiche du point de vente."),
              ("arrow-down-left", "Contraintes d'impression du carton", "De l'imprimeur", "hier", "Email", ""),
              ("arrow-up-right", "Super Mint, 6 visuels Instagram", "À Fatima", "mardi", "Interne", "")],
    "djeneba": [("arrow-up-right", "Point du jour, jeudi 1er octobre", "À Aïcha Diabaté", "08:00", "WhatsApp",
                 "Bonjour Aïcha. Aujourd'hui : comité demain à 9 h (note prête), deux validations en attente, ventes Sossa sous l'objectif. Votre point avec le DG est à 15 h, je prépare les chiffres."),
                ("arrow-down-left", "Ordre du jour du comité", "De Serge Bamba", "hier", "Email", ""),
                ("calendar", "Invitation : point DG 15 h", "Agenda", "hier", "Agenda", "")],
}

RECAP = {
    "djeneba": ("Journée chargée mais sous contrôle. Le plus urgent : votre accord sur la note au comité.",
                ["Point du jour envoyé à 8 h", "Note au comité rédigée", "Ventes Sossa ajoutées à votre tableau de bord"],
                ["Chiffres pour le point DG de 15 h"], ["Valider la note au comité"], 14),
    "fatima": ("Le post Sossa est prêt, il attend votre accord pour partir avant midi. Je finis la version Instagram.",
               ["Post Facebook de la promo Sossa", "Rapport réseaux de septembre", "Relance des photos de Yopougon"],
               ["Visuel Sossa pour Instagram, étape 4 sur 5"], ["Valider le post Facebook avant 12 h"], 31),
    "koffi": ("Yao a la v2 du packaging. Je décline la version rouge pour l'affiche du point de vente.",
              ["Maquette packaging v2 envoyée à Yao", "6 visuels Super Mint"], ["Affiche du point de vente"], ["Rien pour l'instant"], 9),
}

DRIVE = {
    "djeneba": [("doc", "Note au comité, 2 octobre", "Document, il y a 2 h"), ("sheet", "Tableau de bord, données", "Tableur, ce matin"), ("doc", "Points du jour, septembre", "Dossier, 22 fichiers")],
    "fatima": [("poster", "Sossa promo rentrée", "Visuel, il y a 1 h"), ("sheet", "Calendrier éditorial octobre", "Tableur, hier"), ("doc", "Rapport réseaux septembre", "Document, ce matin"),
               ("poster", "Super Mint, stories", "Visuels, mardi"), ("doc", "Brief fin d'année", "Document, mardi"), ("sheet", "Veille concurrence", "Tableur, chaque soir")],
    "koffi": [("poster", "Packaging édition limitée v2", "Visuel, ce matin"), ("poster", "Super Mint, 6 visuels", "Visuels, mardi"), ("doc", "Charte Super Mint", "PDF, 28/09")],
}

CAL = {  # (jour 0 à 6, heure de début, durée en h, titre, précision, classe)
    "djeneba": [(0, 8, .6, "Point du jour", "", ""), (1, 8, .6, "Point du jour", "", ""), (2, 8, .6, "Point du jour", "", ""), (3, 8, .6, "Point du jour", "", ""),
                (4, 8, .6, "Point du jour", "", ""), (3, 15, 1, "Point DG", "avec Aïcha", "h"), (3, 16, 1, "Préparation comité", "", "b"), (4, 9, 1.5, "Comité de direction", "note prête", "h"), (4, 17, .8, "Bilan semaine", "", "c")],
    "fatima": [(0, 9, .8, "Calendrier semaine", "", ""), (0, 14, 1, "Brief Super Mint", "avec Nadège", "h"), (1, 10, 1.5, "Posts Sossa", "", "b"), (2, 11, 1, "Rapport réseaux", "", ""),
               (3, 10, 1.5, "Visuel Instagram", "en cours", "c"), (3, 14, 1, "Revue avec Aïcha", "", "h"), (4, 10, 1, "Publication promo", "", "b"), (5, 10, .6, "Veille", "", "")],
    "koffi": [(0, 11, 1, "Brief créatif", "", ""), (1, 10, .8, "Déclinaisons", "", "b"), (2, 10, .8, "Déclinaisons", "", "b"), (3, 9, 1.5, "Packaging v2", "avec Yao", "h"),
              (3, 11, 1.5, "Affiche point de vente", "en cours", "c"), (4, 10, .8, "Déclinaisons", "", "b")],
}

CONNECT = [("Gmail", "gmail.com", True), ("WhatsApp Business", "whatsapp.com", True), ("Google Drive", "drive.google.com", True),
           ("Outlook", "outlook.com", False), ("LinkedIn", "linkedin.com", False), ("Microsoft Teams", "teams.microsoft.com", False)]
CONNECT_FAT = [("Meta Business", "facebook.com", True), ("Canva", "canva.com", True), ("Instagram", "instagram.com", True)]
MORE = [("Notion", "notion.so"), ("HubSpot", "hubspot.com"), ("Calendly", "calendly.com"), ("Slack", "slack.com"), ("Airtable", "airtable.com"), ("Google Sheets", "sheets.google.com"),
        ("Trello", "trello.com"), ("Dropbox", "dropbox.com"), ("Zoom", "zoom.us")]


PHOTO = {"AD": "m_women_62", "SB": "m_men_80", "YK": "m_men_53", "NT": "m_women_36", "KO": "m_men_59", "MK": "m_women_30", "IS": "m_men_91",
         "FB": "m_women_16", "HN": "m_men_49", "RT": "m_women_89", "OK": "m_men_16", "JA": "m_men_83", "SD": "m_women_69", "DY": "m_men_30"}

def face(i, c, s=26):
    if i in PHOTO:
        return f'<img class="av" src="{B}{PHOTO[i]}.jpg" alt="" style="width:{s}px;height:{s}px;object-fit:cover">'
    return f'<span class="av" style="background:{c};width:{s}px;height:{s}px">{i}</span>'

def fin():
    return '<script src="../app.js"></script></body></html>'

# ---------------------------------------------------------------- coquille
def sidebar(actif, brand):
    items = [("accueil", "house", "Accueil"), ("tableau-de-bord", "layout-dashboard", "Tableau de bord"), ("chat", "messages-square", "Discussions"),
             ("recruter", "user-plus", "Recruter"), ("memoire", "book-open", "Chat entreprise")]
    nav = "".join(f'<a class="it{" on" if actif == k else ""}" href="{k}.html">{ic(i, "s")} {l}{"<span class=n>3</span>" if k == "chat" else ""}</a>' for k, i, l in items)
    team = ""
    for k in ("djeneba", "fatima", "koffi"):
        e = EXPERTS[k]
        tag = '<span class="tag">Incluse</span>' if k == "djeneba" else ""
        team += (f'<a class="mt{" on" if actif == k else ""}" href="{k}.html"><span class="p"><img src="{B}{e["photo"]}" alt=""><i class="{"" if e["live"] else "idle"}"></i></span>'
                 f'<span class="grow"><span class="ell" style="display:block">{e["prenom"]}</span><small class="ell">{e["role"]}</small></span>{tag}</a>')
    team += f'<a class="mt add" href="recruter.html"><span class="p">{ic("plus", "s")}</span>Ajouter un expert</a>'
    return f"""<aside class="sb">
  <a class="org" href="accueil.html"><img src="{B}{CLIENT['logo']}" alt="{CLIENT['nom']}"><div><b>{CLIENT['nom']}</b><span>Espace de travail</span></div></a>
  {nav}
  <div class="lb">Mon équipe <a href="recruter.html" aria-label="Ajouter un expert">{ic("plus", "s")}</a></div>
  {team}
  <div class="foot"><a class="it" href="admin.html">{ic("shield", "s")} Espace admin</a>
  <a class="pby" href="https://leslita06.github.io/yelema-site-preview/">Propulsé par <img src="{B}yelema_logo_final_long.svg" alt="Yelema"></a></div>
</aside>"""

def pops():
    cv = [("hash", "Général", "Djénéba : comité demain à 9 h, la note est prête.", "10:50", True),
          ("fatima", "Fatima", "Les trois visuels de la promo rentrée Sossa sont prêts…", "10:42", True),
          ("djeneba", "Djénéba", "Votre point du jour : deux validations en attente…", "08:00", False),
          ("koffi", "Koffi", "La v2 du packaging est chez Yao.", "09:40", False),
          (("NT", "#8A3B12"), "Nadège Touré", "Je t'envoie les photos de Yopougon ce soir.", "hier", False),
          (("YK", "#0F7B5F"), "Yao Kra", "Ok pour la version rouge.", "hier", False)]
    lst = ""
    for p, n, t, h, u in cv:
        if p == "hash":
            av, href = '<span class="hash">#</span>', "chat.html"
        elif isinstance(p, tuple):
            av, href = face(p[0], p[1], 42), "chat.html"
        else:
            av, href = f'<img src="{B}{EXPERTS[p]["photo"]}" alt="">', f"{p}.html#discussion"
        lst += f'<a class="cv{" unread" if u else ""}" href="{href}"><span class="p">{av}</span><span class="grow"><b><span class="ell">{n}</span><time>{h}</time></b><p>{t}</p></span></a>'
    nts = [("circle-check", "Fatima attend votre accord", "Post Facebook de la promo Sossa, depuis 10:31"),
           ("file-text", "Note au comité prête", "Djénéba, à relire avant demain 9 h"),
           ("trending-down", "Ventes Sossa sous l'objectif", "6 % sous la cible cette semaine"),
           ("user-plus", "Nadège a rejoint Unifood", "Invitée par Serge Bamba")]
    nl = "".join(f'<div class="nt"><span class="ic">{ic(i, "s")}</span><div><b>{t}</b><span>{d}</span></div></div>' for i, t, d in nts)
    return f"""<div class="pop" id="ping"><h3>Ping <span class="row">{ic("check-check", "s")}{ic("maximize-2", "s")}</span></h3>
<div class="srch">{ic("search", "s")} Chercher une conversation</div>
<div class="seg2"><span class="on">Tout</span><span>Canaux</span><span>Collègues</span><span>Experts</span></div>{lst}</div>
<div class="pop" id="notifs"><h3>Notifications <a class="link sm" href="#">Tout lire</a></h3>{nl}</div>"""

def topbar(crumb, actif, brand):
    autre = "client" if brand == "yelema" else "yelema"
    lib = "Couleurs Unifood" if brand == "yelema" else "Couleurs Yelema"
    return f"""<header class="top"><div class="crumb grow">{crumb}</div>
<a class="tbtn hide-m" href="../{autre}/{actif}.html">{ic("palette", "s")} {lib}</a>
<a class="tbtn hide-m" href="#">{ic("user-plus", "s")} Inviter un collègue</a>
<button class="tbtn ico" data-pop="ping" aria-label="Ping, messagerie interne">{ic("message-circle", "s")}<span class="bdg">2</span></button>
<button class="tbtn ico" data-pop="notifs" aria-label="Notifications">{ic("bell", "s")}<span class="bdg">4</span></button>
<a href="admin-membre.html" aria-label="Mon profil">{face("AD", "", 38)}</a></header>"""

def page(actif, brand, titre, crumb, corps, wrap=True, dock=False):
    d = ""
    if dock:
        d = (f'<a class="dock" href="djeneba.html#discussion"><div class="in"><span class="who"><img src="{B}djeneba.jpg" alt=""><img src="{B}fatima.jpg" alt=""><img src="{B}koffi.jpg" alt=""></span>'
             f'<span class="ph">Demander à mon équipe</span><span class="mic">{ic("mic", "s")}</span></div></a>')
    inner = f'<div class="page">{corps}</div>' if wrap else corps
    return (b3.head(titre, brand) + '<div class="app">' + sidebar(actif, brand) + '<main style="min-width:0">' + topbar(crumb, actif, brand)
            + inner + '</main></div>' + pops() + yele() + modal_cz() + d + fin())

# ---------------------------------------------------------------- accueil
def carte(k):
    e, p = EXPERTS[k], PRO[k]
    faces = "".join(face(i, c) for i, c in p["faces"])
    tag = f'<span class="tag">{ic("gift", "s")} Incluse</span>' if k == "djeneba" else ""
    acts = f'<p class="desc">{DESC[k]}</p>' + (f'<div class="act cur"><span class="dot"></span><span class="ell">{p["now"]}</span></div>' if e["live"] else "")
    extra = (f'<a href="djeneba.html#profil" class="ic" aria-label="Personnaliser Djénéba">{ic("wand-sparkles", "s")}</a>' if k == "djeneba"
             else f'<a href="{k}.html#direct" class="ic" aria-label="Voir son écran">{ic("monitor-play", "s")}</a>')
    return f"""<div class="cw"><a class="big" href="{k}.html"><img src="{B}{e['photo']}" alt=""><span class="st"><span class="dot{'' if e['live'] else ' idle'}"></span> {'Au travail' if e['live'] else 'Disponible'}</span>{tag}
<span class="nm"><h3>{e['prenom']} {ic("chevron-right", "s")}</h3><span class="rl">{e['role']}</span></span></a>
<span class="pair"><span class="faces">{faces}</span>{p['duo']}</span>
<div class="acts">{acts}</div>
<div class="bar2"><a class="p" href="{k}.html#discussion">{ic("message-circle", "s")} Écrire</a><a class="ic" href="#" aria-label="Appeler">{ic("phone", "s")}</a><a class="ic" href="{k}.html#mail" aria-label="Sa boîte mail">{ic("mail", "s")}</a>{extra}</div></div>"""

def page_accueil(brand):
    fan = "".join(f'<img src="{B}{x}.jpg" alt="">' for x in ("salif", "kouassi", "adjoua", "mamadou", "nadia"))
    team = "".join(carte(k) for k in ("djeneba", "fatima", "koffi"))
    team += (f'<a class="cw grow" href="recruter.html"><span class="k">AGRANDIR L’ÉQUIPE</span><div class="fan">{fan}</div>'
             f'<span class="sm mute">Ventes, RH, finance, juridique, données. <b style="color:var(--ink)">Recruter un expert {ic("arrow-right", "s")}</b></span></a>')
    val = "".join(f'<div class="val"><span class="th {"poster" if th == "poster" else "doc"}" style="padding:0">{"" if th == "poster" else ic("file-text")}</span><span class="grow"><b class="ell">{t}</b><span class="xs mute3">{EXPERTS[k]["prenom"]}, {dep}</span></span><a class="btn p sm" href="{k}.html#discussion">Valider</a></div>'
                  for k, t, th, dep in b3.ATTENTE_TEAM)
    corps = f"""<div class="hello"><div class="grow"><p class="date">Jeudi 1er octobre</p><h1>Bonjour Aïcha</h1></div></div>
<a class="brief" href="djeneba.html#discussion"><img src="{B}djeneba.jpg" alt=""><p><b>Djénéba :</b> Fatima a fini le post de la promo Sossa et la note au comité est prête <span class="hl">2 à valider</span>. Koffi a livré la v2 du packaging.</p></a>
<div class="h2x" style="margin-top:28px"><h2>Mon équipe</h2><a class="link" href="recruter.html">{ic("plus", "s")} Ajouter un expert</a></div>
<section class="crew">{team}</section>
{canaux_strip()}
<div class="h2x" style="margin-top:30px"><h2>Mon tableau de bord</h2><a class="link" href="tableau-de-bord.html">Tout voir {ic("arrow-right", "s")}</a></div>
<section class="today">
  <div class="wtile"><div class="t">{ic("circle-alert")} À valider <span class="grow"></span><span class="pill ac">2</span></div>{val}</div>
  <div class="wtile imp"><div class="t">{ic("timer")} Temps rendu cette semaine</div><div class="big">92 h</div><div class="sm" style="opacity:.92">comme 2,9 personnes à plein temps</div><span class="pill" style="background:rgba(255,255,255,.18);color:#fff;align-self:flex-start">+18 h vs semaine passée</span></div>
  <div class="wtile"><div class="t">{ic("trending-down")} Ventes Sossa de la semaine</div><div class="big">18,4 M <span class="sm mute" style="font-family:var(--f-ui)">F CFA</span></div><span class="pill ko" style="align-self:flex-start">6 % sous l'objectif</span><span class="xs mute3">Ajouté par Djénéba à votre demande</span></div>
</section>
<div class="g2">{b3.chart(DASH["equipe"], ["fatima", "koffi", "djeneba"])}{b3.live_card()}</div>"""
    return page("accueil", brand, "Accueil", "<b>Accueil</b>", corps, dock=True)

def page_tdb(brand):
    d = DASH["equipe"]
    corps = f"""<div class="hello"><div class="grow"><p class="date">Toute l'équipe, semaine du 28 septembre</p><h1>Mon tableau de bord</h1></div><a class="btn o hide-m" href="https://t.me/" target="_blank" rel="noopener">{ic("send", "s")} Aussi chaque matin dans Telegram</a><a class="btn g" href="djeneba.html#discussion">{ic("sparkles", "s")} Le modifier avec Djénéba</a></div>
{b3.impact(d)}{b3.filtres(d)}{b3.kpis(d)}<div class="g2">{b3.chart(d, ["fatima", "koffi", "djeneba"])}{b3.donut(d)}</div>{b3.projets(d)}{b3.livrables(d, b3.ATTENTE_TEAM)}"""
    return page("tableau-de-bord", brand, "Tableau de bord", "<b>Tableau de bord</b>", corps, dock=True)

# ---------------------------------------------------------------- espace d'un expert
def x_profil(k):
    e, p = EXPERTS[k], PRO[k]
    skills = "".join(f'<div class="box"><b>{t}</b><p>{d}</p></div>' for t, d in p["skills"])
    rout = "".join(f'<div class="rt"><img src="{B}{e["photo"]}" alt=""><div class="grow"><b>{t}</b><span>{ic("repeat", "s")} {w}</span></div><span class="sw"></span></div>' for t, w in p["rout"])
    gens = [("AD", "#7A4E2D", "Aïcha Diabaté", "Responsable")] + ([("NT", "#8A3B12", "Nadège Touré", "Binôme")] if k == "fatima" else []) + ([("YK", "#0F7B5F", "Yao Kra", "Binôme")] if k == "koffi" else [])
    team = "".join(f'<div class="row" style="gap:10px">{face(i, c, 38)}<div><b class="sm" style="display:block">{n}</b><span class="xs mute3">{r}</span></div></div>' for i, c, n, r in gens)
    rename = f'<a href="#" data-open="pz">{ic("pencil", "s")} Changer son prénom</a>' if k == "djeneba" else ""
    note = ('<p class="sm" style="margin-top:12px;padding:10px 12px;border-radius:12px;background:var(--accent-pale);color:var(--accent-ink);max-width:460px">'
            '<b>Incluse dans votre formule.</b> Djénéba est votre Chief of Staff : donnez-lui le prénom et le visage que vous voulez.</p>') if k == "djeneba" else ""
    visage = f'<a class="btn k sm" href="#" data-open="pz" style="margin-top:10px">{ic("sparkles", "s")} Changer son visage</a>' if k == "djeneba" else f'<a class="btn k sm" href="#" style="margin-top:10px">{ic("sparkles", "s")} Changer son visage</a>'
    return f"""<div class="idn"><div><span class="meta">Français, dans l'équipe depuis {p['depuis']}, Abidjan</span>
<h1>{e['prenom']} {rename}</h1><div class="mute">{e['role']}</div>{note}
<div class="fld"><span>VOIX</span><span class="v">{ic("audio-lines", "s")} Awa, chaleureuse</span><a class="btn o sm" href="#">{ic("play", "s")} Écouter</a></div>
<div class="fld"><span>TON</span><span class="v">Vouvoiement, réponses courtes</span></div></div>
<div style="text-align:center"><div class="faces3"><img src="{B}{e['photo']}" alt=""><img src="{B}{e['photo']}" alt=""><img src="{B}{e['photo']}" alt=""></div>{visage}</div></div>
<div class="h2x"><h2>Compétences</h2><a class="btn o sm" href="#">{ic("plus", "s")} Ajouter</a></div><div class="skills">{skills}</div>
<div class="h2x"><h2>Routines</h2><a class="btn o sm" href="#">{ic("plus", "s")} Ajouter</a></div>{rout}
<div class="h2x"><h2>Équipe</h2></div><div class="row" style="gap:22px;flex-wrap:wrap">{team}<a class="btn o sm" href="#">{ic("user-plus", "s")} Ajouter un responsable</a></div>
<div class="h2x"><h2>Réglages avancés</h2></div>
<div class="adv"><div><span class="ic">{ic("brain", "s")}</span><div class="grow"><b>Mémoire</b><span>Ce que {e['prenom']} a appris sur Unifood et garde en tête</span></div><a class="btn o sm" href="#">Gérer</a></div>
<div><span class="ic">{ic("briefcase", "s")}</span><div class="grow"><b>Compte de travail Unifood</b><span>Le compte avec lequel {e['prenom']} écrit, range et reçoit</span><div class="dots"><span>Mail : {p['mail']}</span><span>Agenda</span><span>Drive Unifood</span><span>WhatsApp</span></div></div></div>
<div><span class="ic">{ic("pause", "s")}</span><div class="grow"><b>Mettre en pause</b><span>{e['prenom']} arrête de travailler, rien n'est perdu</span></div><a class="btn o sm" href="#">Pause</a></div>
<div class="danger"><span class="ic">{ic("user-minus", "s")}</span><div class="grow"><b>Retirer de l'équipe</b><span>Plus facturé dès le mois suivant</span></div><a class="btn sm" href="#">Retirer</a></div></div>"""

def cx(n, d, on):
    st = '<span class="st on">Connecté</span>' if on else f'<a class="btn o sm st" href="#" data-open="cz" data-app="{n}">Connecter</a>'
    return f'<div class="cx"><img src="{FAV}{d}" alt=""><span>{n}</span>{st}</div>'

def x_connect(k):
    e, p = EXPERTS[k], PRO[k]
    lst = CONNECT[:3] + (CONNECT_FAT if k == "fatima" else []) + CONNECT[3:]
    ess = "".join(cx(n, d, on) for n, d, on in lst)
    more = "".join(cx(n, d, False) for n, d in MORE)
    cats = "".join(f'<span class="chip{" on" if c == "Tous" else ""}">{c}</span>' for c in ("Tous", "Communication", "Marketing et ventes", "Documents", "Données", "Finance", "Réseaux sociaux", "RH"))
    return f"""<div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:10px"><div class="ctabs"><span class="on">{ic("layout-grid", "s")} Connecteurs</span><span>{ic("wrench", "s")} Sur mesure</span><span>{ic("code-xml", "s")} API et MCP</span><span>{ic("monitor", "s")} Ordinateur</span></div>
<span class="composio">{ic("plug-zap", "s")} Connecteurs fournis par Composio</span></div>
<div class="gbox acct"><span class="lg"><img src="{B}{CLIENT['logo']}" alt=""></span><div class="grow"><b>Compte de travail Unifood</b><div class="sm mute">Le compte avec lequel {e['prenom']} écrit, range et reçoit.</div><div class="dots"><span>Mail : {p['mail']}</span><span>Agenda Unifood</span><span>Drive Unifood</span><span>Messagerie : Ping</span></div></div><a class="btn o sm" href="#">Ouvrir</a></div>
<div class="cfil"><span class="srch">{ic("search", "s")} Chercher un connecteur</span>{cats}</div>
<div class="h2x"><h2>Essentiels <span class="sm">{len(lst)}</span></h2></div><div class="cgrid">{ess}</div>
<div class="h2x"><h2>Plus de connecteurs <span class="sm">plus de 250</span></h2></div><div class="cgrid">{more}</div>"""

def x_secu(k):
    fw = [("users", "#5B5BD6", "Destinataires", "Unifood seulement", False), ("mail", "#E5677D", "Email", "Sans restriction", False),
          ("phone", "#3E7BEA", "Téléphone et SMS", "Sans restriction", False), ("send", "#119D8B", "Messages", "1 règle active", True),
          ("hard-drive", "#E66A4E", "Drive", "Sans restriction", False), ("globe", "#3D4FC4", "Web", "Sans restriction", False),
          ("wallet", "#8A8799", "Budget", "50 000 F CFA par mois", False)]
    fws = "".join(f'<div class="{"on" if on else ""}"><span class="ap" style="background:{c}">{ic(i, "s")}</span>{n}<span>{d}</span></div>' for i, c, n, d, on in fw)
    ch = [("message-circle", "Discussion", "2 sur 2", True), ("mail", "Email", "6 sur 6", False), ("messages-square", "Ping, interne", "7 sur 7", False)]
    cap = [("file-text", "Documents", "26 sur 26"), ("hard-drive", "Drive", "30 sur 30"), ("image", "Médias", "5 sur 5"), ("globe", "Internet", "5 sur 5"),
           ("calendar", "Agenda", "6 sur 6"), ("contact", "Contacts", "13 sur 13"), ("plug", "Connecteurs", "3 sur 3"), ("key-round", "Identifiants", "4 sur 4")]
    t1 = "".join(f'<div>{ic(i, "s")}<span class="grow">{n}<span>{v}</span></span>{ic("lock" if l else "chevron-right", "s r")}</div>' for i, n, v, l in ch)
    t1 += f'<div class="dashed" style="min-height:0">{ic("plus", "s")} Ajouter un canal</div>'
    t2 = "".join(f'<div>{ic(i, "s")}<span class="grow">{n}<span>{v}</span></span>{ic("chevron-right", "s r")}</div>' for i, n, v in cap)
    return f"""<div class="h2x"><h2>Règles</h2><a class="btn o sm" href="#">{ic("plus", "s")} Ajouter</a></div>
<div class="rt"><span class="ib" style="width:36px;height:36px">{ic("shield-check", "s")}</span><div class="grow"><b>Toujours demander mon accord avant d'écrire à un client</b><span>Ajoutée par Serge Bamba, admin</span></div><span class="sw"></span></div>
<div class="dashed" style="margin-top:8px">{ic("plus", "s")} Ajouter une règle</div>
<div class="h2x"><h2>Pare-feu</h2><span class="sm">1 restriction active</span></div><div class="fw">{fws}</div>
<div class="h2x"><h2>Outils</h2><span class="sm">Tout est actif</span></div><p class="sm mute" style="margin-bottom:8px">Canaux</p><div class="tools">{t1}</div>
<p class="sm mute" style="margin:14px 0 8px">Capacités</p><div class="tools">{t2}</div>"""

def x_drive(k):
    e = EXPERTS[k]
    fl = ""
    for t, n, d in DRIVE[k]:
        th = {"poster": f'<div class="th poster"><b>{n.split(",")[0].split(" ")[0].upper()}</b></div>', "sheet": f'<div class="th sheet">{ic("table")}</div>',
              "doc": f'<div class="th">{ic("file-text")}</div>'}[t]
        fl += f'<div class="fl">{th}<div class="mt"><div class="grow"><b class="ell">{n}</b><span>{d}</span></div>{ic("ellipsis", "s")}</div></div>'
    return f"""<div class="drv"><nav class="tree"><a class="on" href="#">{ic("layout-grid", "s")} Accueil</a><a href="#">{ic("users", "s")} Partagé avec {e['prenom']}</a>
<div class="lb">Son drive</div><a href="#">{ic("folder", "s")} Documents de {e['prenom']}</a><a href="#">{ic("folder", "s")} Livrés</a>
<div class="lb">Unifood</div><a href="#">{ic("briefcase", "s")} Drive Unifood</a><a href="#">{ic("palette", "s")} Chartes des marques</a>
<div class="lb">Synchronisation</div><a href="#">{ic("refresh-cw", "s")} Google Drive, à jour</a></nav>
<div><div class="row" style="justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px"><h2 style="font-size:19px;font-weight:650">Drive de {e['prenom']}</h2><span class="row"><span class="cfil" style="margin:0"><span class="srch" style="min-width:160px">{ic("search", "s")} Filtrer</span></span><a class="btn k sm" href="#">{ic("plus", "s")} Nouveau</a></span></div>
<div class="files">{fl}</div></div></div>"""

def x_mail(k):
    e, p = EXPERTS[k], PRO[k]
    lst = rd = ""
    for i, (icn, t, w, h, can, body) in enumerate(INBOX[k]):
        lst += f'<div class="it{" on" if i == 0 else ""}"><span class="ic">{ic(icn, "s")}</span><span class="grow"><b class="sm ell" style="display:block">{t}</b><span class="xs mute3">{w}, {h}</span></span><span class="pill br">{can}</span></div>'
        if i == 0:
            rd = (f'<div class="rd"><span class="pill br" style="align-self:flex-start">{can}</span><h3>{t}</h3><span class="sm mute3">{w}, {h}</span><p style="max-width:62ch">{body}</p>'
                  f'<p class="sm mute3" style="border-top:1px solid var(--line);padding-top:10px">{e["prenom"]}<br>{e["role"]}, Unifood<br>{p["mail"]}</p>'
                  f'<div class="row"><a class="btn g" href="#">{ic("reply", "s")} Répondre</a><a class="btn g" href="#">{ic("forward", "s")} Transférer</a></div></div>')
    return f"""<div class="mhead"><div class="box"><div class="row" style="justify-content:space-between;margin-bottom:10px"><b class="row">{ic("mail", "s")} Boîte mail</b><a class="btn o sm" href="#">Configurer</a></div><div class="mline">{ic("at-sign", "s")} <span class="ell">{p['mail']}</span><span class="pill br">Principale</span></div></div>
<div class="box"><div class="row" style="justify-content:space-between;margin-bottom:6px"><b>Signature</b><span class="row sm mute">Signer les emails <span class="sw"></span></span></div><p class="sm"><b>{e['prenom']}</b>, {e['role']}, Unifood<br><span style="color:var(--link)">{p['mail']}</span></p></div></div>
<div class="row" style="gap:6px;margin-bottom:10px;flex-wrap:wrap"><div class="ctabs"><span class="on">{ic("inbox", "s")} Reçus</span><span>{ic("send", "s")} Envoyés</span><span>{ic("file-pen", "s")} Brouillons</span></div><span class="cfil" style="margin:0"><span class="srch">{ic("search", "s")} Chercher un email</span></span></div>
<div class="mail"><div class="lst">{lst}</div>{rd}</div>"""

def x_cal(k):
    days = [("lun.", 28), ("mar.", 29), ("mer.", 30), ("auj.", 1), ("ven.", 2), ("sam.", 3), ("dim.", 4)]
    H0, H1, SL = 8, 18, 56
    head = '<div class="dh" style="border-left:0"></div>' + "".join(f'<div class="dh{" tdy" if n == 1 else ""}">{d}<b>{n}</b></div>' for d, n in days)
    hours = "".join(f'<div class="hr">{h:02d} h</div>' for h in range(H0, H1))
    cols = ""
    for j in range(7):
        evs = "".join(f'<div class="ev {c}" style="top:{(h - H0) * SL + 2:.0f}px;height:{max(d * SL - 4, 22):.0f}px">{t}{f"<span>{s}</span>" if s and d >= .8 else ""}</div>'
                      for jj, h, d, t, s, c in CAL[k] if jj == j)
        now = f'<div class="now" style="top:{(13.6 - H0) * SL:.0f}px"></div>' if j == 3 else ""
        cols += f'<div class="col">{"".join("<div class=sl></div>" for _ in range(H1 - H0))}{evs}{now}</div>'
    return f"""<div class="row" style="justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px"><div class="ctabs"><span class="on">{ic("calendar", "s")} Agenda</span><span>{ic("repeat", "s")} Routines</span></div><a class="btn o sm" href="#">{ic("calendar-plus", "s")} Connecter un agenda</a></div>
<div class="cal"><div class="ct"><div class="seg"><a>Jour</a><a class="on">Semaine</a><a>Mois</a></div>{ic("chevron-left", "s")}<b class="sm">Aujourd'hui</b>{ic("chevron-right", "s")}<b>28 sept. au 4 oct. 2026</b><span class="grow"></span><span class="sm mute3 hide-m">{PRO[k]['mail']}</span></div>
<div class="grid">{head}<div>{hours}</div>{cols}</div></div>"""

def x_resume(k):
    e, d = EXPERTS[k], DASH[k]
    mot, fait, cours, vous, nb = RECAP[k]
    li = lambda xs, i, c: "".join(f'<li><span style="color:{c}">{ic(i, "s")}</span><span>{x}</span></li>' for x in xs)
    return f"""<div class="h2x"><h2>Résumé du jour</h2><span class="sm">Jeudi 1er octobre, mis à jour à 11:05</span></div>
<div class="brief" style="margin-top:0"><img src="{B}{e['photo']}" alt=""><p><b>{e['prenom']} :</b> {mot}</p></div>
<div class="recap" style="margin-top:12px"><div class="box"><h3>{ic("circle-check", "s")} Fait aujourd'hui</h3><ul>{li(fait, "check", "var(--ok)")}</ul></div>
<div class="box"><h3>{ic("loader", "s")} En cours</h3><ul>{li(cours, "clock", "var(--accent-ink)")}</ul></div>
<div class="box"><h3>{ic("hand", "s")} Attend votre accord</h3><ul>{li(vous, "arrow-right", "var(--brand-ink)")}</ul></div></div>
<div class="h2x"><h2>Cette semaine</h2><a class="link" href="#" data-go="suivi">Voir son suivi {ic("arrow-right", "s")}</a></div>
<div class="today" style="margin-top:0"><div class="wtile imp"><div class="t">{ic("timer")} Temps rendu</div><div class="big">{d['imp'][0]}</div><div class="sm" style="opacity:.92">{d['imp'][1]}</div></div>
<div class="wtile"><div class="t">{ic("package")} Livrables</div><div class="big">{d['kpis'][0][1]}</div><span class="xs mute3">{d['kpis'][4][1]} acceptés sans révision</span></div>
<div class="wtile"><div class="t">{ic("phone")} Appels et messages</div><div class="big">{nb}</div><span class="xs mute3">WhatsApp, email, appels</span></div></div>"""

def modal_perso():
    o = lambda items: "".join(f'<span class="{"on" if j == 0 else ""}">{x}</span>' for j, x in enumerate(items))
    pose = o([f'{ic("user-round")}Face', f'{ic("rotate-3d")}Trois-quarts', f'{ic("armchair")}Assise', f'{ic("footprints")}En marche'])
    style = o([f'{ic("sparkles")}Auto', f'{ic("shirt")}Décontractée', f'{ic("shopping-bag")}Pagne moderne', f'{ic("briefcase")}Tailleur'])
    acc = o([f'{ic("sparkles")}Auto', f'{ic("headset")}Casque', f'{ic("laptop")}Ordinateur', f'{ic("glasses")}Lunettes'])
    fond = o(['<i class="sw2" style="background:#C5C4FF"></i>Lavande', '<i class="sw2" style="background:#EBDCCB"></i>Sable',
              '<i class="sw2" style="background:#E00040"></i>Couleur Unifood', '<i class="sw2" style="background:#241C33"></i>Sombre'])
    return f"""<div class="modal" id="pz"><div class="ov" data-close></div><div class="pn">
<div class="lf"><img src="{B}djeneba.jpg" alt=""><img src="{B}djeneba.jpg" alt=""><img src="{B}djeneba.jpg" alt=""></div>
<div class="rt2"><h2>Personnaliser votre Chief of Staff <button class="ib" data-close aria-label="Fermer">{ic("x", "s")}</button></h2>
<div><p class="oq">Prénom</p><div class="nmf"><span class="v">Djénéba</span><a class="btn o" href="#">Suggérer</a></div><p class="xs mute3" style="margin-top:6px">Toute l'équipe la verra sous ce prénom, ici, sur WhatsApp et dans ses emails.</p></div>
<div class="drop"><span class="fz">{ic("scan-face")}</span><div><b>Choisir son visage</b><div class="sm mute">Déposez une photo ou laissez Yelema en créer un</div></div></div>
<div><p class="oq">Pose</p><div class="opts">{pose}</div></div>
<div><p class="oq">Tenue</p><div class="opts">{style}</div></div>
<div><p class="oq">Accessoire</p><div class="opts">{acc}</div></div>
<div><p class="oq">Fond</p><div class="opts">{fond}</div></div>
<a class="btn k" href="#" data-close style="min-height:50px;border-radius:99px">{ic("sparkles", "s")} Créer son nouveau portrait</a></div></div></div>"""

def page_expert(k, brand):
    e, p, d = EXPERTS[k], PRO[k], DASH[k]
    fil = {"fatima": b3.FIL_FATIMA, "koffi": b3.FIL_KOFFI, "djeneba": b3.FIL_DJENEBA}[k]
    sugg = {"fatima": ["Valider le post", "Nouvelle campagne", "Résumé de la semaine"], "koffi": ["Nouvelle affiche", "Déclinaisons", "Résumé de la semaine"],
            "djeneba": ["Ajouter un indicateur à mon tableau de bord", "Mon point du jour", "Résumé pour le DG"]}[k]
    s = "".join(f"<span>{x}</span>" for x in sugg)
    tl = "".join(f'<li class="{st}"><i></i><span class="grow">{t}</span><time>{h}</time></li>' for st, t, h in p["act"])
    docs = "".join(f'<a href="#" data-go="drive"><span class="th {"poster" if t == "poster" else ""}">{"" if t == "poster" else ic("file-text" if t == "doc" else "table")}</span><span class="ell">{n}</span></a>' for t, n, _ in DRIVE[k][:3])
    term = (f'<div class="term"><span class="w">fatima@unifood:~$</span> editeur ouvrir sossa-instagram<br>[ ok ] visuel chargé<br>[ ok ] format 1080 x 1350<br>[ .. ] export en cours ▍</div>'
            f'<a class="link sm" href="#" data-go="direct" style="margin-top:6px">Voir son écran en grand {ic("arrow-right", "s")}</a>'
            if e["live"] else f'<div class="term"><span class="w">{k}@unifood:~$</span> en attente<br><span class="w">Dernière tâche à {p["act"][0][2]}</span></div>')
    dl = "".join(f'<a class="dl" href="#"><span class="ic">{ic(icn, "s")}</span><span class="grow"><b class="ell">{t}</b><span class="xs mute3">{typ}, {dt}</span></span><span class="pill {pc}">{pl}</span></a>'
                 for icn, t, kk, typ, dt, fm, (pc, pl) in d["livrables"])
    nav1 = [("discussion", "message-circle", "Discussion"), ("resume", "notebook-text", "Résumé"), ("profil", "sliders-horizontal", "Profil"),
            ("connecteurs", "plug", "Connecteurs"), ("canaux", "radio-tower", "Canaux"), ("suivi", "chart-line", "Suivi"), ("securite", "shield-check", "Sécurité")]
    nav2 = [("drive", "hard-drive", "Drive", "#E66A4E"), ("mail", "mail", "Mail", "#E5677D"), ("calendrier", "calendar", "Calendrier", "#F0955A"),
            ("direct", "monitor-play", "En direct", "#2FB5A3"), ("livrables", "archive", "Livrables", "#5B5BD6")]
    n1 = "".join(f'<a href="#" data-t="{t}"{" class=on" if t == "discussion" else ""}>{ic(i, "s")} {l}</a>' for t, i, l in nav1)
    n2 = "".join(f'<a href="#" data-t="{t}"><span class="ap" style="background:{c}">{ic(i, "s")}</span> {l}</a>' for t, i, l, c in nav2)
    direct = (b3.live_card(True) if e["live"] else
              f'<div class="box" style="text-align:center;padding:40px"><p class="mute">{e["prenom"]} ne travaille sur rien en ce moment.</p><p class="sm mute3" style="margin-top:6px">Dernière tâche : {p["act"][0][1].lower()}, à {p["act"][0][2]}.</p></div>')
    corps = f"""<div class="xp" data-tabs>
<aside class="xcol"><div class="xsw"><a href="accueil.html" aria-label="Retour à l'équipe">{ic("arrow-left", "s")}</a><span class="grow">{e['prenom']}</span><span class="faces">{"".join(f'<a href="{x}.html"><img src="{B}{EXPERTS[x]["photo"]}" alt="{EXPERTS[x]["prenom"]}"></a>' for x in ("djeneba", "fatima", "koffi") if x != k)}</span></div><div class="pcard"><img src="{B}{e['photo']}" alt=""><span class="st"><span class="dot"></span> {'Au travail' if e['live'] else 'Disponible'}</span>
<div class="nm">{e['prenom']} <span>{e['role']}</span></div>
<div class="cta"><a class="call" href="#">{ic("audio-lines", "s")} Appeler</a><a class="sq" href="#" data-go="direct" aria-label="Voir son écran">{ic("monitor", "s")}</a><a class="sq pause" href="#" aria-label="Mettre en pause">{ic("power", "s")}</a></div></div>
<div class="xmail"><span>{p['mail']}</span>{ic("copy", "s")}</div>
<nav class="xnav">{n1}<div class="lb">Son espace de travail</div>{n2}</nav></aside>
<div class="xmain">
  <div class="panel on" id="discussion"><div class="dgrid"><div class="chat2"><div class="thread">{fil}</div><div class="comp"><div class="sugg">{s}</div><div class="inp"><button class="ib" aria-label="Joindre un fichier">{ic("plus", "s")}</button><span class="ph">Écrire à {e['prenom']}</span><span class="mode hide-m">{ic("zap", "s")} Rapide {ic("chevron-down", "s")}</span><button class="mic" aria-label="Message vocal">{ic("mic", "s")}</button></div></div></div>
    <div class="rail"><div class="rbox"><h4>{ic("clipboard-list", "s")} Activité de {e['prenom']}</h4><p class="xs mute3">Aujourd'hui</p><ul class="tl">{tl}</ul></div>
    <div class="rbox"><h4>{ic("files", "s")} Documents récents</h4><div class="docs">{docs}</div></div>
    <div class="rbox"><h4>{ic("monitor", "s")} Son ordinateur</h4>{term}</div></div></div></div>
  <div class="panel" id="resume">{x_resume(k)}</div>
  <div class="panel" id="profil">{x_profil(k)}</div>
  <div class="panel" id="connecteurs">{x_connect(k)}</div>
  <div class="panel" id="canaux">{x_canaux(k)}</div>
  <div class="panel" id="suivi">{b3.impact(d)}{b3.kpis(d)}<div class="g2">{b3.chart(d, [k])}{b3.donut(d)}</div>{b3.projets(d)}</div>
  <div class="panel" id="securite">{x_secu(k)}</div>
  <div class="panel" id="drive">{x_drive(k)}</div>
  <div class="panel" id="mail">{x_mail(k)}</div>
  <div class="panel" id="calendrier">{x_cal(k)}</div>
  <div class="panel" id="direct">{direct}</div>
  <div class="panel" id="livrables"><div class="box">{dl}</div></div>
</div></div>{modal_perso() if k == "djeneba" else ""}"""
    crumb = f'<a href="accueil.html">Mon équipe</a> {ic("chevron-right", "s")} <b>{e["prenom"]}</b>'
    return page(k, brand, e["prenom"], crumb, corps, wrap=False)

# ---------------------------------------------------------------- recruter
CATALOGUE = [
    ("kouassi", "Kouassi", "Ventes", "ventes", "handshake", "Relance vos clients, prépare les devis et suit les prospects chaque semaine.",
     ["Relances clients sur WhatsApp et par email", "Devis et propositions", "Suivi du pipeline chaque lundi"], "il"),
    ("awa", "Awa", "Service client", "ventes", "headset", "Répond à vos clients sur WhatsApp et remonte les réclamations.",
     ["Réponses WhatsApp et email", "Suivi des réclamations", "Rapport de satisfaction"], "elle"),
    ("adjoua", "Adjoua", "Recrutement", "rh", "user-search", "Trie les CV, organise les entretiens et rédige les comptes rendus.",
     ["Tri des CV et short-list", "Convocations et relances", "Comptes rendus d'entretien"], "elle"),
    ("fatou", "Fatou", "RH et paie", "rh", "id-card", "Contrats, congés, bulletins et pointage des équipes terrain.",
     ["Contrats et avenants", "Congés et absences", "Préparation de la paie"], "elle"),
    ("mamadou", "Mamadou", "Finance", "finance", "landmark", "Tient la trésorerie, rapproche les comptes et relance les factures.",
     ["Tableau de trésorerie", "Rapprochements bancaires", "Relances de factures"], "il"),
    ("salif", "Salif", "Opérations", "finance", "truck", "Suit les commandes, les stocks et les fournisseurs.",
     ["Suivi des commandes", "Alertes de stock", "Relances fournisseurs"], "il"),
    ("nadia", "Nadia", "Données", "donnees", "chart-pie", "Construit vos tableaux de suivi et vos rapports hebdomadaires.",
     ["Tableaux de suivi", "Rapport hebdomadaire", "Alertes sur vos chiffres"], "elle"),
    ("ibrahim", "Ibrahim", "Juridique", "juridique", "scale", "Relit vos contrats et suit la conformité.",
     ["Relecture de contrats", "Veille réglementaire", "Modèles de documents"], "il"),
]

def page_recruter(brand):
    mine = "".join(f'<a class="who" href="{k}.html"><img src="{B}{EXPERTS[k]["photo"]}" alt="">{EXPERTS[k]["prenom"]}, {EXPERTS[k]["role"]}</a>' for k in ("djeneba", "fatima", "koffi"))
    filt = [("tous", "sparkles", "Tous", 8), ("ventes", "handshake", "Ventes et clients", 2), ("rh", "users", "RH", 2), ("finance", "landmark", "Finance et opérations", 2),
            ("donnees", "chart-pie", "Données", 1), ("juridique", "scale", "Juridique", 1)]
    chips = "".join(f'<span class="chip{" on" if f == "tous" else ""}" data-f="{f}" role="button" tabindex="0">{ic(i, "s")} {l} <em>{n}</em></span>' for f, i, l, n in filt)
    cards = ""
    for ph, nom, met, f, icn, desc, taches, pron in CATALOGUE:
        data = json.dumps({"photo": f"{B}{ph}.jpg", "nom": nom, "metier": met, "desc": desc, "taches": taches,
                           "done": f"{nom} rejoint votre équipe. {pron.capitalize()} vous écrit dans quelques minutes."}, ensure_ascii=False).replace('"', "&quot;")
        cards += (f'<button class="pc" data-m="{f}" data-x="{data}"><div class="ph"><img src="{B}{ph}.jpg" alt=""><span class="badge">{ic(icn, "s")}</span></div>'
                  f'<h3>{nom}</h3><div class="mtr">{met}</div><p>{desc}</p><div class="ft"><span><b class="num" style="color:var(--ink)">200 000</b> F CFA par mois</span></div><span class="hb">Recruter</span></button>')
    drawer = f"""<div class="drawer" data-check='{ic("circle-check", "s")}'><div class="ov" data-close></div><div class="pn">
<div class="ph"><img src="" alt=""><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button></div>
<div class="bd"><div><h2 style="font-size:30px;font-weight:650"></h2><div class="rl mute"></div></div><p class="desc"></p>
<div><b class="sm">Ce qu'il ou elle fera chez vous</b><ul class="tasks" style="margin-top:8px"></ul></div>
<div class="kv"><div><span>Où lui parler</span>Ici, WhatsApp, email</div><div><span>Prêt en</span>quelques minutes</div><div><span>Prix</span>200 000 F CFA par mois</div></div>
<p class="xs mute3">Rien n'est facturé si la mise en place échoue.</p>
<a class="btn p go" href="#">Recruter</a><div class="done"></div></div></div></div>"""
    corps = f"""<div class="hire"><h1>Qui sera votre prochaine recrue&nbsp;?</h1>
<a class="ask" href="djeneba.html#discussion">{ic("sparkles", "s")} Décrivez le travail à confier, Djénéba trouve le bon expert<span class="go2">{ic("arrow-up")}</span></a>
<p class="or">ou choisissez un expert prêt à l'emploi</p></div>
<div class="mine"><span class="sm mute" style="margin-right:4px">Déjà dans votre équipe :</span>{mine}</div>
<div class="filters" data-filter style="margin-top:16px"><div class="chips">{chips}</div></div>
<section class="pcs">{cards}</section>{drawer}"""
    return page("recruter", brand, "Recruter", "<b>Recruter</b>", corps)

# ---------------------------------------------------------------- chat entreprise
SOURCES = [("Drive Unifood", "hard-drive", "312 documents"), ("Ventes 2026", "table", "mis à jour chaque soir"), ("Charte Sossa et Super Mint", "palette", "4 fichiers"),
           ("Comptes rendus de comités", "file-text", "18 notes"), ("Site unifood.info", "globe", "lu le 28/09")]

def fil_memoire():
    return ('<span class="day">Aujourd\'hui</span>'
            + m("moi", "Quelles promos Sossa avons-nous faites l'an dernier à la rentrée&nbsp;?", "11:02")
            + m("lui", "Deux : -15 % sur le prix de gros du 1er au 20 septembre, et un lot offert dès 25 000 F CFA d'achat. La première a mieux marché, +22 % de ventes sur la période."
                + f'<div class="src" style="margin-top:8px">{ic("file-text", "s")}<span class="grow"><b class="sm">Bilan rentrée 2025</b><br><span class="xs mute3">Drive Unifood, Marketing</span></span></div>', "11:02")
            + m("moi", "Et qui avait validé le budget&nbsp;?", "11:03")
            + m("lui", "Le comité du 14 août 2025, d'après le compte rendu. Montant validé : 4,5 M F CFA.", "11:03"))

def memoire_corps(admin=False):
    src = "".join(f'<div class="src"><span class="ib" style="width:34px;height:34px">{ic(i, "s")}</span><span class="grow"><b>{n}</b><br><span class="xs mute3">{d}</span></span>{"<span class=sw></span>" if admin else ""}</div>' for n, i, d in SOURCES)
    chat = f"""<div class="chat2" style="min-height:600px"><div class="row" style="padding:14px 18px;border-bottom:1px solid var(--line)"><span class="ib">{ic("book-open", "s")}</span><div class="grow"><b>Mémoire d'Unifood</b><div class="xs mute3">Répond à partir des documents de l'entreprise, pour les membres sans expert attitré</div></div></div>
<div class="thread">{fil_memoire()}</div><div class="comp"><div class="sugg"><span>Nos chiffres de septembre</span><span>Dernier comité</span><span>Qui s'occupe de quoi</span></div><div class="inp"><span class="ph" style="padding-left:12px">Posez votre question</span><button class="mic" aria-label="Question à la voix">{ic("mic", "s")}</button></div></div></div>"""
    aide = "Vous choisissez ce que la mémoire peut lire. Chaque membre ne voit que les sources de son équipe." if admin else "Les réponses citent toujours leur source."
    ajout = f'<a class="link" href="#">{ic("plus", "s")} Ajouter une source</a>' if admin else ""
    side = f'<div class="box"><div class="ch"><h2 style="font-size:16px;font-weight:650">Ce qu\'elle connaît</h2>{ajout}</div>{src}<p class="xs mute3" style="margin-top:12px">{aide}</p></div>'
    return (f'<div class="hello"><div class="grow"><p class="date">{"Réglages" if admin else "Pour toute l’équipe Unifood"}</p><h1>Chat entreprise</h1></div></div>'
            f'<div class="dgrid" style="margin-top:16px;grid-template-columns:minmax(0,1fr) 340px">{chat}{side}</div>')

def page_memoire(brand):
    return page("memoire", brand, "Chat entreprise", "<b>Chat entreprise</b>", memoire_corps())

# ---------------------------------------------------------------- admin (réglages)
ADM_NAV = [("Organisation", [("admin", "layout-grid", "Vue d'ensemble"), ("admin-general", "building-2", "Général"), ("admin-experts", "sparkles", "Experts"), ("admin-membres", "users", "Membres et droits"),
                             ("admin-chat", "book-open", "Chat entreprise")]),
           ("Usage et facturation", [("admin-analytics", "chart-column", "Suivi"), ("admin-facturation", "receipt", "Facturation")]),
           ("Personnel", [("admin-profil", "user", "Mon profil")])]

def admin_page(actif, titre, corps, brand):
    nav = ""
    for g, its in ADM_NAV:
        nav += f'<div class="lb">{g}</div>' + "".join(f'<a class="it{" on" if k == actif else ""}" href="{k}.html">{ic(i, "s")} {l}</a>' for k, i, l in its)
    side = f"""<aside class="sb set"><a class="it" href="accueil.html">{ic("arrow-left", "s")} Retour à mon espace</a><div class="ttl">Réglages</div>{nav}
<div class="foot"><span class="row sm mute" style="padding:6px 10px">{face("SB", "#2E4EC4", 30)} Serge Bamba, admin</span></div></aside>"""
    autre = "client" if brand == "yelema" else "yelema"
    top = f"""<header class="top"><div class="crumb grow">Réglages {ic("chevron-right", "s")} <b>{titre}</b></div><a class="tbtn hide-m" href="../{autre}/{actif}.html">{ic("palette", "s")} {"Couleurs Unifood" if brand == "yelema" else "Couleurs Yelema"}</a>
<a class="tbtn hide-m" href="admin-membres.html">{ic("user-plus", "s")} Inviter un membre</a><button class="tbtn ico" data-pop="notifs" aria-label="Notifications">{ic("bell", "s")}<span class="bdg">4</span></button>{face("SB", "", 38)}</header>"""
    return b3.head(titre, brand) + f'<div class="app">{side}<main style="min-width:0">{top}<div class="page"><div class="sform" style="max-width:1080px">{corps}</div></div></main></div>' + pops() + yele() + fin()

def sg(rows):
    return '<div class="sg">' + "".join(f'<div><div class="grow"><b>{t}</b><span class="d">{d}</span></div>{f"<div class=ctl>{c}</div>" if c else ""}</div>' for t, d, c in rows) + "</div>"

def adm_general(brand):
    sw = '<div class="sw3"><i style="background:#E00040"></i><i style="background:#F8B400"></i><i style="background:#5A1022"></i></div>'
    seg = f'<div class="seg"><a href="../yelema/admin.html" class="{"on" if brand == "yelema" else ""}">Yelema</a><a href="../client/admin.html" class="{"on" if brand == "client" else ""}">Unifood</a></div>'
    corps = f"""<div style="max-width:820px"><h1>Général</h1><p class="sub">Ce que voient tous les membres d'Unifood</p>
{sg([("Nom de l'organisation", "Affiché partout dans l'espace", '<span class="inp2">Unifood</span>')])}
<h3 class="h3s">Identité visuelle</h3><p class="sub">Logo, couleurs et charte, lus par les experts avant chaque visuel</p>
{sg([("Logo", "En haut de chaque page et sur les livrables", f'<img src="{B}unifood.png" alt="" style="width:52px;height:52px"><a class="btn o sm" href="#">Changer</a>'),
     ("Couleurs", "Dans l'ordre d'importance", sw + '<a class="ib" href="#" style="width:32px;height:32px">' + ic("plus", "s") + '</a>'),
     ("Habillage de l'espace", "Couleurs Yelema avec votre logo, ou vos couleurs", seg)])}
<div class="sg" style="margin-top:8px"><div style="flex-direction:column;align-items:stretch"><div><b>Charte de marque</b><span class="d">Préparée avec Koffi dans Telegram. Texte libre lu par les experts.</span></div><div class="ta">Sossa : rouge #E00040, jaune #F8B400, ton joyeux et familial. Super Mint : vert menthe, ton jeune. Toujours le logo en haut à gauche…</div></div></div>
<h3 class="h3s">Activité</h3><p class="sub">Mettre toute l'équipe d'experts en pause d'un coup</p>
{sg([("<span class='row'><span class='dot'></span> En service</span>", "Vos 3 experts travaillent et prennent les demandes", f'<a class="btn o sm" href="#">{ic("pause", "s")} Tout mettre en pause</a>')])}
<h3 class="h3s">Hébergement</h3>{sg([("Cloud dédié en Côte d'Ivoire", "Les livrables restent dans le Drive d'Unifood", '<span class="pill ok">Actif</span>')])}</div>"""
    return admin_page("admin-general", "Général", corps, brand)

def adm_experts(brand):
    rows = "".join(f'<tr><td><div class="who"><img src="{B}{k}.jpg" alt=""><span><b>{XN[k][0]}</b><br><span class="xs mute3">{XN[k][1]}</span></span></div></td><td class="hide-m">{u}</td><td class="num">{lv}</td><td class="num">{p}</td><td><span class="sw{"" if XN[k][2] else " off"}"></span></td><td><a class="link" href="{xh(k)}">Réglages</a></td></tr>'
                   for k, u, lv, p in [(k, u, lv, p) for k, n, r, sv, u, lv, p, on in ALL_EXPERTS])
    orgcx = "".join(cx(n, d, True) for n, d, _ in CONNECT[:3] + CONNECT_FAT[:2])
    corps = f"""<div class="hello"><div class="grow"><h1>Experts</h1><p class="sub">7 experts, dont 6 en service, 126 livrables ce mois-ci</p></div><a class="btn p" href="recruter.html">{ic("plus", "s")} Recruter un expert</a></div>
<div class="box" style="margin-top:16px"><table class="tbl"><tr><th>Expert</th><th class="hide-m">Membres qui l'utilisent</th><th>Livrables</th><th>F CFA par mois</th><th>En service</th><th></th></tr>{rows}</table></div>
<h3 class="h3s">Connecteurs de l'organisation</h3><p class="sub">Fournis par Composio, partagés par tous les experts</p>
<div class="cgrid" style="margin-top:12px">{orgcx}<div class="cx dashed" style="background:transparent">{ic("plus", "s")} Brancher un outil</div></div>"""
    return admin_page("admin-experts", "Experts", corps, brand)

def adm_membres(brand):
    ok = f'<td align="center" style="color:var(--ok)">{ic("check", "s")}</td>'; no = '<td align="center" class="xs mute3">non</td>'
    droits = [("Voir son tableau de bord", "ooo"), ("Parler aux experts de son équipe", "ooo"), ("Utiliser le chat entreprise", "ooo"), ("Recruter un expert", "oon"),
              ("Inviter des membres", "onn"), ("Voir la facturation", "onn"), ("Voir le suivi de l'équipe", "oon"), ("Changer la charte et les réglages", "onn")]
    tr = "".join(f'<tr><td>{l}</td>{"".join(ok if c == "o" else no for c in r)}</tr>' for l, r in droits)
    mem = [("AD", "#7A4E2D", "Aïcha Diabaté", "Directrice marketing", "Responsable", "Djénéba, Fatima"), ("SB", "#2E4EC4", "Serge Bamba", "Direction administrative", "Direction", "Djénéba"),
           ("YK", "#0F7B5F", "Yao Kra", "Graphiste", "Équipe", "Koffi"), ("NT", "#8A3B12", "Nadège Touré", "Chargée de communication", "Équipe", "Fatima"),
           ("KO", "#5A1022", "Kader Ouattara", "Commercial", "Équipe", "Chat entreprise")]
    ml = "".join(f'<tr><td><a class="who" href="admin-membre.html">{face(i, "", 36)}<span><b>{n}</b><br><span class="xs mute3">{po}</span></span></a></td><td class="hide-m">{svc}</td><td><span class="pill br">{r}</span></td><td><a class="link" href="admin-membre.html">Voir</a></td></tr>' for i, n, po, svc, r in MEMBRES)
    corps = f"""<div class="hello"><div class="grow"><h1>Membres et droits</h1><p class="sub">14 membres dans 5 services, 2 invitations en attente</p></div><a class="btn p" href="#">{ic("user-plus", "s")} Inviter un membre</a></div>
<div class="box" style="margin-top:16px"><table class="tbl"><tr><th>Membre</th><th class="hide-m">Service</th><th>Rôle</th><th></th></tr>{ml}</table></div>
<div class="box" style="margin-top:14px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Qui peut faire quoi</h2></div><table class="tbl"><tr><th></th><th style="text-align:center">Direction</th><th style="text-align:center">Responsable</th><th style="text-align:center">Équipe</th></tr>{tr}</table></div>"""
    return admin_page("admin-membres", "Membres et droits", corps, brand)

def adm_factu(brand):
    fac = "".join(f'<tr><td>{m_}</td><td class="num">{v}</td><td><span class="pill {s}">{l}</span></td><td><a class="link" href="#">{ic("download", "s")} PDF</a></td></tr>' for m_, v, s, l in
                  [("Novembre 2026", "500 000", "ac", "À venir"), ("Octobre 2026", "500 000", "ok", "Payée, Wave"), ("Septembre 2026", "1 300 000", "ok", "Payée, Orange Money")])
    corps = f"""<div style="max-width:880px"><h1>Facturation</h1><p class="sub">Formule Experts Yelema</p>
{sg([("Prochaine facture", "Le 1er novembre", '<b class="num" style="font-size:22px">500 000 F CFA</b>'),
     ("Experts", "Djénéba incluse, Fatima et Koffi", '<a class="btn o sm" href="admin-experts.html">Gérer</a>'),
     ("Moyen de paiement", "Wave, Orange Money, MTN ou virement", '<a class="btn p sm" href="#">Payer par mobile money</a>')])}
<div class="box" style="margin-top:16px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Factures</h2></div><table class="tbl"><tr><th>Mois</th><th>F CFA</th><th>État</th><th></th></tr>{fac}</table>
<p class="xs mute3" style="margin-top:10px">Septembre comprend la mise en place, réglée une fois au démarrage.</p></div></div>"""
    return admin_page("admin-facturation", "Facturation", corps, brand)

def adm_analytics(brand):
    d = DASH["equipe"]
    mem = "".join(f'<tr><td><div class="who">{face(i, c, 32)}<b>{n}</b></div></td><td class="num">{a}</td><td class="num">{b_}</td><td class="hide-m">{x}</td></tr>' for i, c, n, a, b_, x in
                  [("AD", "#7A4E2D", "Aïcha Diabaté", 31, 64, "aujourd'hui"), ("NT", "#8A3B12", "Nadège Touré", 9, 21, "aujourd'hui"), ("YK", "#0F7B5F", "Yao Kra", 6, 18, "hier"), ("SB", "#2E4EC4", "Serge Bamba", 3, 7, "mardi")])
    corps = f"""<div class="hello"><div class="grow"><h1>Suivi</h1><p class="sub">Par expert et par membre</p></div><div class="seg"><a>Semaine</a><a class="on">Mois</a><a>Trimestre</a></div><a class="btn g" href="#">{ic("download", "s")} Exporter en CSV</a></div>
{b3.kpis(d)}<div class="g2">{b3.chart(d, ["fatima", "koffi", "djeneba"])}{b3.donut(d)}</div>
<div class="box" style="margin-top:14px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Par membre</h2></div><table class="tbl"><tr><th>Membre</th><th>Livrables reçus</th><th>Messages aux experts</th><th class="hide-m">Dernière connexion</th></tr>{mem}</table></div>"""
    return admin_page("admin-analytics", "Suivi", corps, brand)

def adm_profil(brand):
    corps = f"""<div style="max-width:820px"><h1>Mon profil</h1><p class="sub">Serge Bamba, direction administrative</p>
{sg([("Nom", "", '<span class="inp2">Serge Bamba</span>'), ("Adresse email", "", '<span class="inp2">serge.bamba@unifood.info</span>'),
     ("Notifications", "Un résumé chaque matin par email", '<span class="sw"></span>'), ("Double authentification", "Code par SMS à chaque connexion", '<span class="sw"></span>')])}</div>"""
    return admin_page("admin-profil", "Mon profil", corps, brand)


# ---------------------------------------------------------------- canaux (Telegram, WhatsApp, Slack, Teams)
CANAUX = [("Telegram", "telegram.org", True, "Groupe Unifood, un sujet par expert", "https://t.me/", "Ouvrir dans Telegram"),
          ("WhatsApp", "whatsapp.com", True, "+225 07 00 00 00 00", "https://wa.me/", "Ouvrir WhatsApp"),
          ("Email", "gmail.com", True, "@unifood.yelema.ai", "#", "Voir les emails"),
          ("Slack", "slack.com", False, "Pas encore connecté", "#", "Activer"),
          ("Microsoft Teams", "teams.microsoft.com", False, "Pas encore connecté", "#", "Activer")]

def canaux_strip():
    it = "".join(f'<a class="chn{" on" if on else ""}" href="{u if on else "#"}"{" target=_blank rel=noopener" if on and u.startswith("http") else ""}{"" if on else " data-open=cz data-app=" + chr(34) + n + chr(34)}><img src="{FAV}{d}" alt=""><span><b>{n}</b><small>{"Activé" if on else "Activer"}</small></span></a>' for n, d, on, _, u, _l in CANAUX)
    return f'<div class="chs"><span class="sm mute">Votre équipe répond aussi sur</span>{it}</div>'

def x_canaux(k):
    e = EXPERTS[k]
    rows = ""
    for n, d, on, det, u, lib in CANAUX:
        det2 = det.replace("@unifood", PRO[k]["mail"].split("@")[0] + "@unifood") if n == "Email" else (f"Sujet « {e['prenom']} » du groupe Unifood" if n == "Telegram" else det)
        btn = (f'<a class="btn k sm" href="{u}" target="_blank" rel="noopener">{ic("external-link", "s")} {lib}</a>' if on and u.startswith("http")
               else (f'<a class="btn o sm" href="#" data-go="mail">{lib}</a>' if on else f'<a class="btn o sm" href="#" data-open="cz" data-app="{n}">{ic("plus", "s")} {lib}</a>'))
        rows += f'<div class="chrow"><img src="{FAV}{d}" alt=""><div class="grow"><b>{n}</b><span>{det2}</span></div>{"<span class=pill style=background:var(--ok-pale);color:var(--ok)>Activé</span>" if on else "<span class=pill style=background:var(--soft-2);color:var(--ink-3)>Non activé</span>"}{btn}</div>'
    return f"""<div class="h2x"><h2>Où parler à {e['prenom']}</h2><span class="sm">Les messages arrivent aussi ici, dans Discussion</span></div>
<div class="chlist">{rows}</div>
<div class="gbox" style="margin-top:14px;display:flex;gap:12px;align-items:center"><span class="ib">{ic("layout-dashboard", "s")}</span><div class="grow"><b>Votre tableau de bord dans Telegram</b><div class="sm mute">Chaque matin à 8 h, Djénéba l'envoie dans le sujet « Tableau de bord ».</div></div><a class="btn k sm" href="https://t.me/" target="_blank" rel="noopener">{ic("send", "s")} Ouvrir dans Telegram</a></div>"""

# ---------------------------------------------------------------- Composio
def modal_cz():
    return f"""<div class="modal" id="cz"><div class="ov" data-close></div><div class="pn cz"><div class="rt2" style="text-align:center;align-items:center">
<div class="row" style="gap:10px;justify-content:center"><img src="{B}{CLIENT['logo']}" alt="" style="width:44px;height:44px;border-radius:12px;background:#fff">{ic("arrow-left-right", "s")}<span class="ib">{ic("plug", "s")}</span></div>
<h2 style="justify-content:center">Connecter <span class="czn">l'outil</span></h2><p class="sm mute" style="max-width:40ch">Vous allez autoriser l'accès sur la page de l'outil. Yelema ne voit jamais votre mot de passe.</p>
<div class="czs"><span>{ic("shield-check", "s")} Accès en lecture et en écriture, retirable à tout moment</span><span>{ic("users", "s")} Partagé avec les experts que vous choisissez</span></div>
<a class="btn k czgo" href="#" style="min-height:48px;border-radius:99px;width:100%">Continuer</a><div class="czok">{ic("circle-check", "s")} Connecté. Vos experts peuvent l'utiliser.</div>
<span class="xs mute3">Connexion sécurisée par Composio</span><button class="ib x2" data-close aria-label="Fermer">{ic("x", "s")}</button></div></div></div>"""

# ---------------------------------------------------------------- Yélé, l'agent d'aide
YELE_SVG = """<svg class="yele" viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="yg" cx="30%" cy="20%" r="90%"><stop offset="0" stop-color="#0084F5"/><stop offset=".4" stop-color="#5670FF"/><stop offset=".75" stop-color="#6B58FB"/><stop offset="1" stop-color="#3F48AE"/></radialGradient></defs><g class="pt p1" style="--dx:-2.1px;--dy:-2.1px"><circle cx="33.0" cy="33.0" r="7.2"/><circle cx="26.0" cy="26.0" r="5.6"/><circle cx="19.6" cy="19.6" r="4.2"/></g><g class="pt p2" style="--dx:2.1px;--dy:-2.1px"><circle cx="67.0" cy="33.0" r="7.2"/><circle cx="74.0" cy="26.0" r="5.6"/><circle cx="80.4" cy="19.6" r="4.2"/></g><g class="pt p3" style="--dx:0.0px;--dy:3.0px"><circle cx="50.0" cy="74.0" r="7.2"/><circle cx="50.0" cy="84.0" r="5.6"/><circle cx="50.0" cy="93.0" r="4.2"/></g><circle class="core" cx="50" cy="50" r="17"/><g class="eyes"><ellipse cx="44" cy="48" rx="3.6" ry="5" fill="#fff"/><ellipse cx="56" cy="48" rx="3.6" ry="5" fill="#fff"/><circle class="pu" cx="44.6" cy="49.4" r="2.1" fill="#17112B"/><circle class="pu" cx="56.6" cy="49.4" r="2.1" fill="#17112B"/></g><path d="M45.5 56.5 q4.5 3.5 9 0" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>"""

def yele():
    sug = "".join(f'<span>{t}</span>' for t in ("Comment recruter un expert ?", "Connecter WhatsApp", "Changer le prénom de Djénéba", "Ma facture"))
    return f"""<button class="ybtn" data-pop="yele" aria-label="Aide, parler à Yélé">{YELE_SVG}<span>Besoin d'aide&nbsp;?</span></button>
<div class="pop ypop" id="yele"><div class="row" style="gap:12px">{YELE_SVG.replace('class="yele"', 'class="yele big"')}<div><h3>Yélé</h3><span class="sm mute">L'aide de Yelema, ici et sur WhatsApp</span></div></div>
<div class="msg lui" style="margin-top:12px"><div class="bub">Bonjour Aïcha&nbsp;! Je réponds à vos questions sur Yelema : vos experts, vos canaux, vos factures. Que puis-je faire pour vous&nbsp;?</div></div>
<div class="sugg" style="flex-wrap:wrap;margin-top:10px">{sug}</div><div class="inp" style="margin-top:6px"><span class="ph">Posez votre question à Yélé</span><button class="mic" aria-label="Question à la voix">{ic("mic", "s")}</button></div>
<p class="xs mute3" style="margin-top:8px">Une question complexe&nbsp;? Yélé passe le relais à l'équipe Yelema.</p></div>"""

# ---------------------------------------------------------------- page Discussions
CONVS = [("fatima", "Fatima", "Les trois visuels de la promo rentrée Sossa sont prêts…", "10:42", 2, "expert"),
         ("general", "# Général", "Djénéba : comité demain à 9 h, la note est prête.", "10:50", 1, "canal"),
         ("djeneba", "Djénéba", "Votre point du jour : deux validations en attente…", "08:00", 0, "expert"),
         ("koffi", "Koffi", "La v2 du packaging est chez Yao.", "09:40", 0, "expert"),
         ("NT", "Nadège Touré", "Je t'envoie les photos de Yopougon ce soir.", "hier", 0, "collegue"),
         ("marketing", "# Marketing", "Fatima : calendrier d'octobre en ligne.", "hier", 0, "canal"),
         ("YK", "Yao Kra", "Ok pour la version rouge.", "hier", 0, "collegue"),
         ("memoire", "Mémoire d'Unifood", "Le comité du 14 août 2025 a validé 4,5 M F CFA.", "11:03", 0, "canal")]

def conv_av(c, s=40):
    if c in EXPERTS: return f'<img src="{B}{EXPERTS[c]["photo"]}" alt="" style="width:{s}px;height:{s}px">'
    if c in PHOTO: return face(c, "", s)
    return f'<span class="hash" style="width:{s}px;height:{s}px">{ic("book-open", "s") if c == "memoire" else "#"}</span>'

def page_chat(brand):
    lst = "".join(f'<a class="cv{" on" if i == 0 else ""}{" unread" if u else ""}" href="#" data-conv="{c}" data-k="{t}"><span class="p">{conv_av(c, 42)}</span><span class="grow"><b><span class="ell">{n}</span><time>{h}</time></b><p>{x}</p></span>{f"<span class=nb>{u}</span>" if u else ""}</a>'
                  for i, (c, n, x, h, u, t) in enumerate(CONVS))
    gen = ('<span class="day">Aujourd\'hui</span>'
           + f'<div class="gm"><img src="{B}{PHOTO["SB"]}.jpg" alt=""><div><b>Serge Bamba</b> <time>09:12</time><p>Rappel : comité demain 9 h, salle du 2e étage.</p></div></div>'
           + f'<div class="gm"><img src="{B}djeneba.jpg" alt=""><div><b>Djénéba</b> <span class="pill br">Expert</span> <time>10:50</time><p>La note au comité est prête. Aïcha, elle attend votre accord avant envoi à toute la direction.</p></div></div>'
           + f'<div class="gm"><img src="{B}{PHOTO["NT"]}.jpg" alt=""><div><b>Nadège Touré</b> <time>10:52</time><p>@Fatima tu peux reprendre le visuel Sossa pour la page Instagram&nbsp;?</p></div></div>'
           + f'<div class="gm"><img src="{B}fatima.jpg" alt=""><div><b>Fatima</b> <span class="pill br">Expert</span> <time>10:53</time><p>Oui, je m\'en occupe, fin prévue vers 11:30.</p></div></div>')
    nad = ('<span class="day">Hier</span>' + m("lui", "Je t'envoie les photos de Yopougon ce soir, le gérant était absent ce matin.", "18:02")
           + m("moi", "Parfait, merci. Envoie-les directement à Fatima.", "18:05"))
    head = lambda c, n, sub, extra: f'<div class="chd">{conv_av(c, 40)}<div class="grow"><b>{n}</b><div class="xs mute3">{sub}</div></div>{extra}</div>'
    xa = lambda k: f'<a class="tbtn ico" href="#" aria-label="Appeler">{ic("phone", "s")}</a><a class="tbtn" href="{k}.html">{ic("arrow-up-right", "s")} Son espace</a>'
    th = lambda i, h, body, on=False: f'<div class="cth{" on" if on else ""}" id="c-{i}">{h}<div class="thread">{body}</div></div>'
    threads = (th("fatima", head("fatima", "Fatima", "Expert marketing et contenu, au travail", xa("fatima")), b3.FIL_FATIMA, True)
               + th("general", head("general", "# Général", "14 membres et 3 experts", '<a class="tbtn" href="https://t.me/" target="_blank" rel="noopener">' + ic("send", "s") + ' Aussi dans Telegram</a>'), gen)
               + th("djeneba", head("djeneba", "Djénéba", "Chief of Staff", xa("djeneba")), b3.FIL_DJENEBA)
               + th("koffi", head("koffi", "Koffi", "Expert design", xa("koffi")), b3.FIL_KOFFI)
               + th("NT", head("NT", "Nadège Touré", "Chargée de communication, en ligne", ""), nad)
               + th("marketing", head("marketing", "# Marketing", "6 membres et 2 experts", ""), gen)
               + th("YK", head("YK", "Yao Kra", "Graphiste", ""), '<span class="day">Hier</span>' + m("lui", "Ok pour la version rouge.", "17:40"))
               + th("memoire", head("memoire", "Mémoire d'Unifood", "Répond à partir des documents de l'entreprise", ""), fil_memoire()))
    corps = f"""<div class="chatp"><aside class="cl"><div class="row" style="justify-content:space-between"><h2 style="font-size:20px;font-weight:650">Discussions</h2><a class="tbtn ico" href="#" aria-label="Nouvelle discussion">{ic("square-pen", "s")}</a></div>
<div class="srch">{ic("search", "s")} Chercher une discussion</div><div class="seg2" data-cf><span class="on" data-f="tous">Tout</span><span data-f="expert">Experts</span><span data-f="collegue">Collègues</span><span data-f="canal">Canaux</span></div>{lst}</aside>
<section class="cm">{threads}<div class="comp"><div class="inp"><button class="ib" aria-label="Joindre un fichier">{ic("plus", "s")}</button><span class="ph">Écrire un message</span><span class="mode hide-m">{ic("zap", "s")} Rapide {ic("chevron-down", "s")}</span><button class="mic" aria-label="Message vocal">{ic("mic", "s")}</button></div></div></section></div>"""
    return page("chat", brand, "Discussions", "<b>Discussions</b>", corps, wrap=False)

# ---------------------------------------------------------------- admin : équipe complète
ALL_EXPERTS = [("djeneba", "Djénéba", "Chief of Staff", "Direction", "Aïcha, Serge, Jean-Marc", 5, "incluse", True),
               ("fatima", "Fatima", "Marketing et contenu", "Marketing", "Aïcha, Nadège", 24, "200 000", True),
               ("koffi", "Koffi", "Design", "Marketing", "Yao", 17, "200 000", True),
               ("kouassi", "Kouassi", "Ventes", "Commercial", "Fanta, Kader", 21, "200 000", True),
               ("adjoua", "Adjoua", "Recrutement", "RH", "Mariam", 9, "200 000", True),
               ("mamadou", "Mamadou", "Finance", "Finance", "Ibrahim", 12, "200 000", True),
               ("awa", "Awa", "Service client", "Commercial", "Rokia", 38, "200 000", False)]
MEMBRES = [("JA", "Jean-Marc Aka", "Directeur général", "Direction", "Direction"), ("SB", "Serge Bamba", "Directeur administratif", "Direction", "Direction"),
           ("AD", "Aïcha Diabaté", "Directrice marketing", "Marketing", "Responsable"), ("NT", "Nadège Touré", "Chargée de communication", "Marketing", "Équipe"),
           ("YK", "Yao Kra", "Graphiste", "Marketing", "Équipe"), ("FB", "Fanta Bakayoko", "Responsable commerciale", "Commercial", "Responsable"),
           ("KO", "Kader Ouattara", "Commercial terrain", "Commercial", "Équipe"), ("RT", "Rokia Traoré", "Service client", "Commercial", "Équipe"),
           ("MK", "Mariam Koné", "Responsable RH", "RH", "Responsable"), ("IS", "Ibrahim Sylla", "Contrôleur financier", "Finance", "Responsable"),
           ("HN", "Hervé N'Guessan", "Responsable logistique", "Opérations", "Responsable"), ("OK", "Olivier Kacou", "Chef d'usine", "Opérations", "Équipe"),
           ("SD", "Sarah Diallo", "Assistante de direction", "Direction", "Équipe"), ("DY", "Didier Yapi", "Acheteur", "Opérations", "Équipe")]

XN = {k: (n, r, on) for k, n, r, sv, u, lv, p, on in ALL_EXPERTS}
def xh(k):
    return f"{k}.html" if k in ("djeneba", "fatima", "koffi") else "admin-experts.html"

def adm_vue(brand):
    xs = "".join(f'<a class="ax" href="{xh(k)}"><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{n}</b><span>{r}</span>{"" if sv == r else f'<span class="xs mute3">Service {sv}</span>'}</span>{"<span class=sw></span>" if on else "<span class=\"sw off\"></span>"}</a>' for k, n, r, sv, u, lv, p, on in ALL_EXPERTS)
    ms = "".join(f'<a class="am" href="admin-membre.html">{face(i, "", 48)}<b>{n.split(" ")[0]}</b><span>{svc}</span></a>' for i, n, po, svc, r in MEMBRES)
    corps = f"""<div class="hello"><div class="grow"><p class="date">Espace admin, Serge Bamba</p><h1>Vue d'ensemble</h1></div><a class="btn p" href="recruter.html">{ic("plus", "s")} Recruter un expert</a></div>
<div class="stat4">{stat("sparkles", "7", "experts, dont 6 en service")}{stat("users", "14", "membres dans 5 services")}{stat("package", "126", "livrables ce mois-ci", '<span class="pill ok">+31</span>')}{stat("receipt", "1 300 000", "F CFA, facture du 1er novembre")}</div>
<div class="h2x" style="margin-top:24px"><h2>Experts d'Unifood</h2><a class="link" href="admin-experts.html">Gérer {ic("arrow-right", "s")}</a></div><div class="axg">{xs}</div>
<div class="h2x"><h2>Membres</h2><a class="link" href="admin-membres.html">Membres et droits {ic("arrow-right", "s")}</a></div><div class="amg">{ms}<a class="am add2" href="#"><span class="ib">{ic("user-plus", "s")}</span><b>Inviter</b><span>un membre</span></a></div>
<div class="h2x"><h2>Canaux de l'organisation</h2></div>{canaux_strip()}"""
    return admin_page("admin", "Vue d'ensemble", corps, brand)

def stat(i, v, l, extra=""):
    return f'<div class="kpi"><span class="ic">{ic(i, "s")}</span><div class="v">{v}</div><div class="l">{l}</div>{extra}</div>'

def adm_membre(brand):
    xs = "".join(f'<a class="ax" href="{k}.html"><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{EXPERTS[k]["prenom"]}</b><span>{EXPERTS[k]["role"]}</span></span>{ic("chevron-right", "s")}</a>' for k in ("djeneba", "fatima", "koffi"))
    corps = f"""<div class="mp"><div class="mph">{face("AD", "", 120)}<div class="grow"><h1>Aïcha Diabaté</h1><p class="mute">Directrice marketing, Unifood</p><div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap"><span class="pill br">Responsable</span><span class="pill" style="background:var(--soft-2)">Service Marketing</span><span class="pill ok">Active aujourd'hui</span></div></div>
<div class="row" style="gap:8px"><a class="btn o" href="#">{ic("message-circle", "s")} Écrire</a><a class="btn p" href="#">{ic("pencil", "s")} Modifier</a></div></div>
<div class="g2e"><div>{sg([("Email", "", '<span class="inp2">aicha.diabate@unifood.info</span>'), ("Téléphone", "", '<span class="inp2">+225 07 00 00 00 00</span>'), ("Entreprise", "", '<span class="inp2">Unifood, Abidjan</span>'), ("Rôle", "Ce qu'elle peut faire dans l'espace", '<span class="inp2">Responsable</span>')])}</div>
<div><div class="box"><div class="ch"><h2 style="font-size:16px;font-weight:650">Ses experts</h2><a class="link" href="#">{ic("plus", "s")} Ajouter</a></div><div class="axg" style="grid-template-columns:1fr">{xs}</div></div>
<div class="box" style="margin-top:12px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Ce mois-ci</h2></div><div class="kv" style="font-size:14px;gap:10px"><div><span>Livrables reçus</span><b>31</b></div><div><span>Messages aux experts</span><b>64</b></div><div><span>Canaux</span><b>Telegram, WhatsApp, ici</b></div></div></div></div></div></div>"""
    return admin_page("admin-membres", "Aïcha Diabaté", corps, brand)

def page_choix():
    s = b3.page_choix()
    s = s.replace("</div></div></body>", """</div>
<div class="opts" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-top:20px">
<a class="o" href="yelema/chat.html"><div><b>Discussions</b><p class="sm mute">Experts, collègues, canaux et mémoire d'Unifood</p></div></a>
<a class="o" href="yelema/fatima.html"><div><b>Espace d'un expert</b><p class="sm mute">Discussion, résumé, profil, connecteurs, drive, mail, calendrier</p></div></a>
<a class="o" href="yelema/recruter.html"><div><b>Recruter</b><p class="sm mute">Catalogue filtrable, fiche au clic</p></div></a>
<a class="o" href="yelema/admin.html"><div><b>Réglages admin</b><p class="sm mute">7 experts, 14 membres, profil d'un membre, facturation</p></div></a>
</div><p class="sm mute" style="margin-top:18px">Versions précédentes : <a class="link" href="v3/index.html">v3</a>, <a class="link" href="v2/index.html">v2 mobile</a></p></div></body>""")
    return s

if __name__ == "__main__":
    os.makedirs(os.path.join(OUT, "img"), exist_ok=True)
    for f in glob.glob(os.path.join(ICI, "..", "v3", "site", "img", "*")):
        shutil.copy(f, os.path.join(OUT, "img"))
    for f in glob.glob(os.path.join(ICI, "img", "*")):
        shutil.copy(f, os.path.join(OUT, "img"))
    css = open(os.path.join(ICI, "app.css"), encoding="utf-8").read() + open(os.path.join(ICI, "delos.css"), encoding="utf-8").read()
    open(os.path.join(OUT, "app.css"), "w", encoding="utf-8").write(css)
    shutil.copy(os.path.join(ICI, "app.js"), OUT)
    for brand in ("yelema", "client"):
        d = os.path.join(OUT, brand); os.makedirs(d, exist_ok=True)
        pages = {"accueil": page_accueil(brand), "tableau-de-bord": page_tdb(brand), "recruter": page_recruter(brand), "memoire": page_memoire(brand),
                 "admin": adm_vue(brand), "admin-general": adm_general(brand), "admin-membre": adm_membre(brand), "chat": page_chat(brand), "admin-experts": adm_experts(brand), "admin-membres": adm_membres(brand), "admin-facturation": adm_factu(brand),
                 "admin-analytics": adm_analytics(brand), "admin-chat": admin_page("admin-chat", "Chat entreprise", memoire_corps(True), brand), "admin-profil": adm_profil(brand)}
        for k in ("djeneba", "fatima", "koffi"):
            pages[k] = page_expert(k, brand)
        for n, html in pages.items():
            html = html.replace('href="ecran.html"', 'href="fatima.html#direct"')
            open(os.path.join(d, n + ".html"), "w", encoding="utf-8").write(html)
        print("ok", brand, len(pages), "pages")
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(page_choix())
    print("ok index")
