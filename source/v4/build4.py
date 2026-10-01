import json
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
_b3head = b3.head
def _head_modes(titre, brand):
    return _b3head(titre, brand).replace('<link rel="stylesheet" href="../app.css"></head>', '<link rel="stylesheet" href="../app.css"><script>try{var a=localStorage.getItem("yap")||"clair";if(a==="sombre"||(a==="auto"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.setAttribute("data-mode","nuit")}catch(e){}</script></head>')
b3.head = _head_modes

OUT = os.environ.get("YOUT") or os.path.join(ICI, "site")
B = "../img/"
TG = '<svg class="tg" viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="120" fill="#2AABEE"/><path fill="#fff" d="M54 117.4c35-15.2 58.3-25.3 70-30.2 33.3-13.9 40.2-16.3 44.7-16.4 1 0 3.2.2 4.7 1.4 1.2 1 1.5 2.3 1.7 3.3.2 1 .4 3.1.2 4.8-1.8 19-9.6 65.1-13.6 86.3-1.7 9-5 12-8.2 12.3-7 .6-12.3-4.6-19-9.1-10.6-6.9-16.5-11.2-26.8-18-11.9-7.8-4.2-12.1 2.6-19.1 1.8-1.8 32.6-29.9 33.2-32.4.1-.3.1-1.5-.6-2.1-.7-.6-1.7-.4-2.5-.2-1.1.2-17.8 11.3-50.2 33.1-4.7 3.3-9 4.9-12.9 4.8-4.2-.1-12.4-2.4-18.4-4.4-7.4-2.4-13.3-3.7-12.8-7.8.3-2.1 3.2-4.3 8.8-6.5z"/></svg>'
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


PHOTO = {"AD": "aicha", "SB": "m_men_80", "YK": "m_men_53", "NT": "m_women_36", "KO": "m_men_59", "MK": "m_women_30", "IS": "m_men_91",
         "FB": "m_women_16", "HN": "m_men_49", "RT": "m_women_89", "OK": "m_men_16", "JA": "m_men_83", "SD": "m_women_69", "DY": "m_men_30"}

FICHES = json.load(open(os.path.join(ICI, "fiches.json"), encoding="utf-8"))
FK = {"djeneba": "chiefofstaff"}
DOM = {"Agenda": "calendar.google.com", "Banques": "bceao.int", "Buffer": "buffer.com", "Calendly": "calendly.com", "Canva": "canva.com", "DocuSign": "docusign.com",
       "Excel": "office.com", "Facebook": "facebook.com", "Figma": "figma.com", "Fireflies": "fireflies.ai", "Gmail": "gmail.com", "Google Drive": "drive.google.com",
       "Google Sheets": "sheets.google.com", "Google Workspace": "workspace.google.com", "HubSpot": "hubspot.com", "Instagram": "instagram.com", "LinkedIn": "linkedin.com",
       "Looker": "lookerstudio.google.com", "Notion": "notion.so", "Odoo": "odoo.com", "QuickBooks": "quickbooks.intuit.com", "Sage": "sage.com", "Slack": "slack.com",
       "Telegram": "telegram.org", "WhatsApp": "whatsapp.com", "Zendesk": "zendesk.com", "Zoom": "zoom.us"}
def fiche_de(k):
    return FICHES[FK.get(k, k)]
def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;")

def x_fiche(k):
    f = fiche_de(k); nom = f["nom"] if k != "djeneba" else EXPERTS[k]["prenom"]
    elle = "elle" if (k == "djeneba" or f["tl"].startswith("Elle")) else "il"
    sk = "".join(f'<div class="fsk"><span class="ic num">{n + 1:02d}</span><div><b>{esc(a)}</b><span>{esc(b)}</span></div></div>' for n, (a, b) in enumerate(f.get("competences", [])))
    q = "".join(f'<li>{ic("check", "s")}<span>{esc(x)}</span></li>' for x in f.get("quotidien", []))
    ac = "".join(f'<li>{ic("lock", "s")}<span>{esc(x)}</span></li>' for x in f.get("accord", []))
    be = "".join(f'<li>{ic("file-input", "s")}<span>{esc(x)}</span></li>' for x in f.get("besoins", []))
    ri = "".join(f'<div class="rt"><span class="ib" style="width:36px;height:36px">{ic("repeat", "s")}</span><div class="grow"><b>{esc(t)}</b><span>{esc(w)}</span></div><span class="sw"></span></div>' for t, w in f.get("rituels", []))
    lv = "".join(f'<div class="flv"><span class="ic">{ic("file-text", "s")}</span><div><span class="mwg">{ic("layout-template", "s")} Gabarit</span><b>{esc(a)}</b><span>{esc(b)}</span></div></div>' for a, b in f.get("livrables", []))
    ou = "".join(f'<span class="ochip"><img src="{FAV}{DOM.get(o, "yelema.ai")}" alt="">{esc(o)}</span>' for o in f.get("outils", []))
    refs = "".join(f'<span class="pill" style="background:var(--soft-2)">{esc(r)}</span>' for r in f.get("refs", []))
    seul = "seule" if elle == "elle" else "seul"
    return f"""<div class="fp">
<div class="fph fph2"><div class="grow"><span class="k">Fiche de poste</span><h1>{nom}, {esc(f['role'])}</h1><p class="lead">{esc(f.get('mission', ''))}</p>
{"" if f.get('valeur', f['tl']).strip()[:40] in f.get('mission', '') or f.get('mission', '').strip()[:40] in f.get('valeur', f['tl']) else f'<p class="sm mute">{esc(f.get("valeur", f["tl"]))}</p>'}
<div class="fpn"><span><b class="num">{len(f.get("competences", []))}</b> compétences</span><span><b class="num">{len(f.get("livrables", []))}</b> livrables</span><span><b class="num">{len(f.get("rituels", []))}</b> routines</span><span><b class="num">{len(f.get("outils", []))}</b> outils</span></div></div>
<img class="fpp" src="{B}pied/{k if k in EXPERTS else k}.jpg" alt=""></div>
<div class="fpa"><span class="tag">{ic("play", "s")} En action</span><p>{esc(f.get('action', ''))}</p></div>
<h3 class="h3s">Ses compétences</h3><p class="sub">Des savoir-faire déjà construits dans l'atelier Yelema</p><div class="fsks">{sk}</div>
<div class="g2 fpg"><div class="box"><h3 class="bt">{ic("sun", "s")} Au quotidien</h3><ul class="fl3">{q}</ul></div>
<div class="box"><h3 class="bt">{ic("shield-check", "s")} Soumis à votre accord</h3><ul class="fl3 lk">{ac}</ul><p class="xs mute3" style="margin-top:8px">{nom} demande votre validation avant chacune de ces actions.</p></div></div>
<h3 class="h3s">Ce qu'{elle} fait sans qu'on le demande</h3><p class="sub">Ses rendez-vous, tenus {seul}, sans relance</p>{ri}
<h3 class="h3s">Ses livrables</h3><p class="sub">Prêts à relire, envoyés seulement après votre accord</p><div class="flvs">{lv}</div>
<div class="g2 fpg"><div class="box"><h3 class="bt">{ic("inbox", "s")} Ce dont {elle} a besoin</h3><ul class="fl3">{be}</ul></div>
<div class="box"><h3 class="bt">{ic("plug", "s")} Ses outils</h3><div class="ochips">{ou}</div><p class="xs mute3" style="margin-top:10px">Vous autorisez, vous révoquez quand vous voulez.</p></div></div>
<div class="box" style="margin-top:14px"><h3 class="bt">{ic("map-pin", "s")} Sa maîtrise du terrain</h3><p class="sm" style="line-height:1.6;max-width:820px">{esc(f.get('terrain', ''))}</p><div class="row" style="gap:6px;flex-wrap:wrap;margin-top:10px">{refs}</div></div>
</div>"""

FLECHE = '<svg class="flc" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h13.5M12.5 5.5 19 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'

def face(i, c, s=26):
    if i in PHOTO:
        return f'<img class="av" src="{B}{PHOTO[i]}.jpg" alt="" style="width:{s}px;height:{s}px;object-fit:cover">'
    return f'<span class="av" style="background:{c};width:{s}px;height:{s}px">{i}</span>'

def fin():
    return '<script src="../app.js"></script></body></html>'

# ---------------------------------------------------------------- coquille
def acmenu(admin):
    return (f'<div class="acm" hidden><div class="acl">Comptes</div>'
            f'<a class="aci{"" if admin else " on"}" href="accueil.html">{face("AD", "", 32)}<span class="grow"><b>Aïcha Diabaté</b><small>Compte utilisateur</small></span>{"" if admin else ic("check", "s")}</a>'
            f'<a class="aci{" on" if admin else ""}" href="admin.html"><span class="adav">{ic("shield-check", "s")}</span><span class="grow"><b>Administrateur</b><small>Compte administrateur</small></span>{ic("check", "s") if admin else ""}</a>'
            f'<a class="aco" href="connexion.html#{"out-admin" if admin else "out"}">{ic("log-out", "s")} Se déconnecter</a></div>')
ACMENU = acmenu(False)

def sidebar_admin(actif, brand):
    nav = ""
    for g, its in ADM_NAV:
        nav += f'<div class="lb">{g}</div>' + "".join(f'<a class="it{" on" if k == actif or (k == "admin-membres" and actif == "admin-membre") else ""}" href="{k}.html">{ic(i, "s")} {l}</a>' for k, i, l in its)
    return f"""<aside class="sb sbadm">
  <div class="orgw"><a class="org" href="admin.html"><img src="{B}{CLIENT['logo']}" alt="{CLIENT['nom']}"><div><b>{CLIENT['nom']}</b><span>Administration</span></div></a><button class="sbt" aria-label="Replier le menu" title="Replier le menu">{ic("panel-left-close", "s")}</button></div>
  <a class="back2" href="accueil.html">{ic("arrow-left", "s")} Retour à mon espace</a>
  {nav}
  <div class="foot">
  <div class="acw"><a class="me{" on" if actif == "admin-profil" else ""}" href="admin-profil.html"><span class="adav">{ic("shield-check", "s")}</span><span class="grow"><b class="ell">Administrateur</b><small class="ell">Compte administrateur</small></span><button class="acsw" aria-label="Changer de compte ou se déconnecter" title="Changer de compte">{ic("ellipsis", "s")}</button></a>{acmenu(True)}</div>
  <a class="pby" href="https://leslita06.github.io/yelema-site-preview/">Powered by <img src="{B}yelema_logo_final_long.svg" alt="Yelema"></a></div>
</aside>"""

def sidebar(actif, brand):
    items = [("accueil", "house", "Accueil"), ("tableau-de-bord", "layout-dashboard", "Tableau de bord"), ("recruter", "user-plus", "Recruter"), ("memoire", "message-square-text", "Chat entreprise")]
    nav = "".join(f'<a class="it{" on" if actif == k else ""}" href="{k}.html">{ic(i, "s")} {l}{"<span class=n>3</span>" if k == "chat" else ""}</a>' for k, i, l in items)
    team = ""
    for k in ("djeneba", "fatima", "koffi"):
        e = EXPERTS[k]
        tag = ""
        team += (f'<a class="mt{" on" if actif == k else ""}" href="{k}.html"><span class="p"><img src="{B}{e["photo"]}" alt=""><i class="{"" if e["live"] else "idle"}"></i></span>'
                 f'<span class="grow"><span class="ell" style="display:block">{e["prenom"]}</span><small class="ell">{e["role"]}</small></span>{tag}</a>')
    org = "".join(f'<a class="it{" on" if actif == k or (k == "admin-membres" and actif == "admin-membre") else ""}" href="{k}.html">{ic(i, "s")} {l}</a>' for k, i, l in ORG_NAV)
    return f"""<aside class="sb">
  <div class="orgw"><a class="org" href="accueil.html"><img src="{B}{CLIENT['logo']}" alt="{CLIENT['nom']}"><div><b>{CLIENT['nom']}</b><span>Espace de travail</span></div></a><button class="sbt" aria-label="Replier le menu" title="Replier le menu">{ic("panel-left-close", "s")}</button></div>
  {nav}
  <div class="lb">Mon équipe</div>
  {team}
  <div class="foot"><a class="it{" on" if actif.startswith("admin") else ""}" href="admin.html">{ic("settings", "s")} Administration</a>
  <div class="acw"><a class="me{" on" if actif == "profil" else ""}" href="profil.html">{face("AD", "", 36)}<span class="grow"><b class="ell">Aïcha Diabaté</b><small class="ell">Directrice marketing</small></span><button class="acsw" aria-label="Changer de compte ou se déconnecter" title="Changer de compte">{ic("ellipsis", "s")}</button></a>{ACMENU}</div>
  <a class="pby" href="https://leslita06.github.io/yelema-site-preview/">Powered by <img src="{B}yelema_logo_final_long.svg" alt="Yelema"></a></div>
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
           ("user-plus", "Nadège a rejoint l’équipe", "Invitée par Aïcha Diabaté")]
    nl = "".join(f'<div class="nt"><span class="ic">{ic(i, "s")}</span><div><b>{t}</b><span>{d}</span></div></div>' for i, t, d in nts)
    return f"""<div class="pop" id="ping"><h3>Messages</h3>
<div class="srch">{ic("search", "s")} Chercher une conversation</div>{lst}</div>
<div class="pop" id="notifs"><h3>Notifications <a class="link sm mk" href="#">{ic("check-check", "s")} Marquer comme lu</a></h3>{nl}<a class="seeall" href="notifications.html">Tout voir {FLECHE}</a></div>"""

def modes_btn(actif, brand):
    return f'<button class="tbtn ico" data-pop="modes" aria-label="Mode d’affichage" title="Mode d’affichage">{ic("swatch-book", "s")}</button>'

def modes_pop(actif, brand):
    def th(b, nom, sub, sw):
        on = " on" if b == brand else ""
        return (f'<a class="mdx{on}" href="../{b}/{actif}.html"><span class="msw">{sw}</span>'
                f'<span class="grow"><b>{nom}</b><small>{sub}</small></span><span class="mck">{ic("check", "s")}</span></a>')
    ap = "".join(f'<a data-ap="{k}"{" class=on" if k == "clair" else ""}>{ic(i, "s")} {l}</a>' for k, i, l in
                 [("clair", "sun", "Clair"), ("sombre", "moon", "Sombre"), ("auto", "monitor-smartphone", "Automatique")])
    return f"""<div class="pop mpop" id="modes"><h3>Affichage</h3>
<p class="mpk">Thème</p>
{th("yelema", "Yelema", "Couleurs Yelema, logo Unifood", '<i style="background:#301667"></i><i style="background:#8D68FA"></i><i style="background:#E4765A"></i>')}
{th("client", "Unifood", "Couleurs de votre entreprise", '<i style="background:#E00040"></i><i style="background:#F8B400"></i><i style="background:#5A1022"></i>')}
<p class="mpk">Apparence</p><div class="seg apseg">{ap}</div>
<p class="xs mute3" style="margin-top:10px">Automatique suit le réglage de votre téléphone ou de votre ordinateur.</p></div>"""

def topbar(crumb, actif, brand):
    autre = "client" if brand == "yelema" else "yelema"
    lib = "Couleurs de l’entreprise" if brand == "yelema" else "Couleurs Yelema"
    return f"""<header class="top"><div class="crumb grow">{crumb}</div>
{modes_btn(actif, brand)}
<button class="tbtn ico" data-pop="ping" aria-label="Messages">{ic("message-circle", "s")}<span class="bdg">2</span></button>
<button class="tbtn ico" data-pop="notifs" aria-label="Notifications">{ic("bell", "s")}<span class="bdg">4</span></button>
</header>"""

def page(actif, brand, titre, crumb, corps, wrap=True, dock=False):
    d = ""
    if dock:
        d = (f'<a class="dock" href="djeneba.html#discussion"><div class="in"><span class="who"><img src="{B}djeneba.jpg" alt=""><img src="{B}fatima.jpg" alt=""><img src="{B}koffi.jpg" alt=""></span>'
             f'<span class="ph">Demander à mon équipe</span><span class="mic">{ic("mic", "s")}</span></div></a>')
    inner = f'<div class="page">{corps}</div>' if wrap else corps
    return (b3.head(titre, brand) + '<div class="app">' + sidebar(actif, brand) + '<main style="min-width:0">' + topbar(crumb, actif, brand)
            + inner + '</main></div>' + pops() + modes_pop(actif, brand) + yele() + modales() + d + fin())

# ---------------------------------------------------------------- temps rendu (journées de travail, onglet à part)
def jours(d):
    return int(float(d["imp"][0].split()[0]) // 8)

def impact4(d):
    h, delta, pers, nj, parjour = d["imp"]
    j = jours(d)
    blocs = "".join('<i></i>' for _ in range(min(j, 14)))
    pj = f"{parjour:g}".replace(".", ",")
    return f"""<section class="impact">
  <div class="imp"><span class="ic">{ic("calendar-check")}</span><div><div class="v">{j} journée{"s" if j > 1 else ""}</div><div class="l">de travail rendue{"s" if j > 1 else ""} à l'équipe cette semaine, soit {h}</div><div class="days">{blocs}</div></div></div>
  <div class="imp"><span class="ic">{ic("trending-up")}</span><div><div class="v">{delta.split(" vs")[0]}</div><div class="l">de plus que la semaine passée, à date</div></div></div>
  <div class="imp"><span class="ic">{ic("zap")}</span><div><div class="v">{pj}</div><div class="l">livrables par jour ouvré</div></div></div>
</section>"""

def temps_rendu(d, qui):
    rows = ""
    for k in qui:
        dk = DASH[k]; j = jours(dk); hh = dk["imp"][0]
        w = max(6, int(100 * float(hh.split()[0]) / 92))
        rows += f'<div class="trw"><img src="{B}{EXPERTS[k]["photo"]}" alt=""><span class="nm2"><b>{EXPERTS[k]["prenom"]}</b><span class="xs mute3">{EXPERTS[k]["role"]}</span></span><span class="bar3"><i style="width:{w}%"></i></span><b class="num">{j if j else "moins d\'une"} journée{"s" if j > 1 else ""}</b><span class="xs mute3 num">{hh}</span></div>'
    sem = [("31 août", 41), ("7 sept.", 55), ("14 sept.", 63), ("21 sept.", 74), ("28 sept.", 92)]
    bars = "".join(f'<div class="wk"><span class="num">{int(v // 8)} j</span><i style="height:{int(v / 92 * 100)}%"></i><em>{l}</em></div>' for l, v in sem)
    return f"""{impact4(d)}
<div class="g2" style="margin-top:16px"><div class="box"><div class="ch"><h2 style="font-size:16px;font-weight:650">Par expert, cette semaine</h2></div>{rows}</div>
<div class="box"><div class="ch"><h2 style="font-size:16px;font-weight:650">Journées rendues, 5 dernières semaines</h2></div><div class="wks">{bars}</div></div></div>
<p class="xs mute3" style="margin-top:10px">Estimation : temps qu'aurait pris chaque livrable à une personne de l'équipe, 8 h par journée.</p>"""

# ---------------------------------------------------------------- accueil
def carte(k):
    e, p = EXPERTS[k], PRO[k]
    faces = "".join(face(i, c) for i, c in p["faces"])
    tag = ""
    acts = f'<p class="desc">{DESC[k]}</p>'
    extra = (f'<a href="djeneba.html#profil" class="ic" aria-label="Personnaliser Djénéba">{ic("wand-sparkles", "s")}</a>' if k == "djeneba"
             else f'<a href="{k}.html#direct" class="ic" aria-label="Voir son écran">{ic("monitor-play", "s")}</a>')
    return f"""<div class="cw"><a class="big" href="{k}.html"><img src="{B}{e['photo']}" alt="">{'<span class="st"><span class="dot"></span> Au travail</span>' if e['live'] else ''}{tag}
<span class="nm"><h3>{e['prenom']} {ic("chevron-right", "s")}</h3><span class="rl">{e['role']}</span></span></a>
<div class="acts">{acts}</div>
<div class="bar2"><a class="p" href="{k}.html#discussion">{ic("message-circle", "s")} Écrire</a><a class="ic tel" href="#" data-call="{k}" aria-label="Appeler {e['prenom']}">{ic("phone", "s")}</a></div></div>"""

def carte_equipe(k):
    e, fi = EXPERTS[k], fiche_de(k)
    st = '<span class="inteam live">' + '<span class="dot"></span> Au travail</span>' if e["live"] else ""
    return (f'<div class="pc2 eq"><a class="cov" href="{k}.html" aria-label="Ouvrir l\'espace de {e["prenom"]}"></a>{vid(k, e["prenom"])}{st}'
            f'<span class="nm"><b>{e["prenom"]}</b><span class="rl">{esc(fi.get("role", e["role"]))}</span><span class="tl">{DESC[k]}</span>'
            f'<span class="eqb"><a class="rb" href="{k}.html#discussion">{ic("message-circle", "s")} Écrire</a><a class="rb tel" href="#" data-call="{k}" aria-label="Appeler {e["prenom"]}">{ic("phone", "s")}</a></span></span></div>')

YS_TRUST = [("message-circle", "Conversationnel", ", sur vos canaux"), ("mic", "Commande", " vocale"), ("globe", "Open source", " et interopérable"),
            ("lock", "Données", " sécurisées"), ("monitor-smartphone", "Mobile", " et web"), ("clock", "24h/24", ", 7j/7"), ("landmark", "Secteurs privé et public", "")]
def ys_trust():
    g = "".join(f'<span>{ic(i, "s")} <b>{b}</b>{t}</span>' for i, b, t in YS_TRUST)
    return f'<div class="ys-trust" aria-label="Ce que font vos Experts"><div class="ys-track"><div class="ys-grp">{g}</div><div class="ys-grp" aria-hidden="true">{g}</div></div></div>'

def ys_outils():
    t = lambda xs: "".join(f'<span class="ys-t"><img src="{B}lg/{f}.png" alt="">{n}</span>' for f, n in xs)
    outils = t([("hubspot", "HubSpot"), ("zoom", "Zoom"), ("sage", "Sage"), ("odoo", "Odoo"), ("figma", "Figma"), ("github", "GitHub"), ("notion", "Notion"), ("drive", "Drive"), ("excel", "Excel")])
    canaux = t([("telegram", "Telegram"), ("whatsapp", "WhatsApp"), ("gmail", "Gmail"), ("slack", "Slack"), ("teams", "Teams")]) + f'<span class="ys-t">{ic("globe", "s")}Espace web</span>'
    et = "".join(f'<span class="ys-et"><b>{i}</b><span><em>{a}</em>{b}</span></span>' for i, a, b in [(1, "Vous choisissez l'outil", "Dans la liste ci-dessous, ou par recherche."), (2, "Vous l'autorisez", "Une fois, pour toute l'organisation."), (3, "Vous choisissez les experts", "Seuls ceux-là y ont accès.")])
    return f"""<div class="ys-3">
<div class="ys-p"><span class="ys-ic">{ic("plug")}</span><div class="ys-big">3 000+</div><h3>outils connectables</h3><p>Vos Experts lisent, écrivent et agissent dans ce que vous utilisez déjà. Vous autorisez, vous révoquez quand vous voulez.</p><div class="ys-tools">{outils}</div></div>
<div class="ys-p"><span class="ys-ic">{ic("clock")}</span><div class="ys-big">24h/24</div><h3>7 jours sur 7</h3><p>Ils vous parlent sur vos canaux, et parlent à vos clients sur les leurs.</p><div class="ys-tools ys-2c">{canaux}</div></div>
<div class="ys-p"><span class="ys-ic">{ic("rocket")}</span><div class="ys-big">5 minutes</div><h3>pour brancher un outil</h3><p>Pas besoin d'équipe technique : trois clics, et l'expert s'en sert dès sa prochaine tâche.</p><div class="ys-steps">{et}</div></div></div>"""

def ys_cta():
    return f"""<div class="ys-ctav"><img class="ys-ctap" src="{B}cta-people.webp" alt="Trois Experts Yelema"><div class="ys-band"><div class="ys-fl" aria-hidden="true"><i></i><i></i></div>
<h2>Votre prochain Expert peut commencer dès demain.</h2><p>Vous décrivez le métier, on branche l'Expert sur l'activité d'Unifood, il travaille avec vous dès la première semaine.</p>
<a class="btn ys-light" href="#ask" data-ask>{ic("sparkles", "s")} Décrire mon besoin</a></div></div>"""

def page_accueil(brand):
    fan = "".join(f'<img src="{B}{x}.jpg" alt="">' for x in ("salif", "kouassi", "adjoua", "mamadou", "nadia"))
    team = "".join(carte_equipe(k) for k in ("djeneba", "fatima", "koffi"))
    stack = "".join(f'<img src="{B}{x}.jpg" alt="">' for x in ("adjoua", "mamadou", "nadia")) + f'<span class="gplus">{ic("plus")}</span>'
    stack = f'<img class="ys-caps" src="{B}hero-site.webp" alt="Fatou, Ibrahim et Fatima, Experts Yelema">'
    team += (f'<a class="cw grow2 ys-grow" href="recruter.html"><div class="gstk">{stack}</div>'
             f'<div class="gtx"><b>Agrandir l\'équipe</b><span>Des spécialistes pour tous vos métiers</span></div><span class="rbtn">{ic("plus", "s")} Recruter un expert</span></a>')
    val = "".join(f'<div class="val"><span class="th {"poster" if th == "poster" else "doc"}" style="padding:0">{"" if th == "poster" else ic("file-text")}</span><span class="grow"><b class="ell">{t}</b><span class="xs mute3">{EXPERTS[k]["prenom"]}, {dep}</span></span><a class="btn p sm" href="{k}.html#discussion">Valider</a></div>'
                  for k, t, th, dep in b3.ATTENTE_TEAM)
    cards, drawer = catalogue(), ""
    nts = [("fatima", "attend votre accord sur le post Facebook de la promo Sossa", "fatima.html#discussion", "10:31"),
           ("djeneba", "a préparé la note au comité de demain, 9 h", "djeneba.html#discussion", "08:50"),
           ("koffi", "a livré la v2 du packaging Super Mint à Yao", "koffi.html#livrables", "09:40"),
           ("fatima", "voit les ventes Sossa 6 % sous l'objectif cette semaine", "tableau-de-bord.html", "08:05")]
    ti = "".join(f'<a class="ti{" on" if i == 0 else ""}" href="{h}"><img src="{B}{EXPERTS[k]["photo"]}" alt=""><span class="ell"><b>{EXPERTS[k]["prenom"]}</b> {t}</span><time>{tm}</time></a>' for i, (k, t, h, tm) in enumerate(nts))
    dots = "".join(f'<i{" class=on" if i == 0 else ""}></i>' for i in range(len(nts)))
    corps = f"""<div class="hello"><div class="grow"><p class="date">Jeudi 1er octobre</p><h1>Bonjour Aïcha</h1></div></div>
<div class="tick" data-tick><span class="yl-mini">{YELE_SVG}</span><div class="tw">{ti}</div><span class="tdots">{dots}</span><button class="tnx" aria-label="Notification suivante">{ic("chevron-right", "s")}</button></div>
<div class="h2x" style="margin-top:22px"><h2>Mon équipe</h2></div>
<section class="pcs2 crew2">{team}</section>
<div class="h2x" style="margin-top:34px"><h2>Experts à recruter</h2><a class="link" href="recruter.html">Tous les experts {FLECHE}</a></div>
<section class="pcs2">{cards}</section>"""
    return page("accueil", brand, "Accueil", "<b>Accueil</b>", corps, dock=True)

NOTIFS = [("Aujourd'hui", [("fatima", "circle-check", "Fatima attend votre accord", "Post Facebook de la promo Sossa", "10:31", "fatima.html#discussion", "Voir le post", True),
                            ("djeneba", "file-text", "Note au comité prête", "À relire avant demain 9 h", "08:50", "djeneba.html#discussion", "Relire", True),
                            ("koffi", "package", "Packaging Super Mint v2 livré", "Envoyé à Yao pour l'impression", "09:40", "koffi.html#livrables", "Ouvrir", False),
                            ("djeneba", "trending-down", "Ventes Sossa sous l'objectif", "6 % sous la cible cette semaine", "08:05", "tableau-de-bord.html", "Tableau de bord", True)]),
          ("Hier", [(None, "user-plus", "Nadège a rejoint l’équipe", "Invitée par Aïcha Diabaté", "17:20", "admin-membres.html", "Voir", False),
                    ("fatima", "calendar", "Calendrier éditorial d'octobre prêt", "12 publications, à valider avant lundi", "16:02", "fatima.html#livrables", "Ouvrir", False),
                    (None, "receipt", "Facture d'octobre payée", "1 300 000 F CFA par Wave", "11:15", "admin-facturation.html", "Voir", False)])]

def page_notifs(brand):
    out = ""
    for g, its in NOTIFS:
        rows = "".join(f'<a class="nrow{" unread" if u else ""}" href="{h}"><span class="nic">{ic(i, "s")}</span>'
                       + (f'<img class="nav" src="{B}{EXPERTS[k]["photo"]}" alt="">' if k else "")
                       + f'<span class="grow"><b>{t}</b><span>{d}</span></span><time>{tm}</time><span class="nact">{a} {FLECHE}</span></a>' for k, i, t, d, tm, h, a, u in its)
        out += f'<div class="ngrp"><div class="lb2">{g}</div>{rows}</div>'
    corps = f"""<div class="hello"><div class="grow"><h1>Notifications</h1><p class="sub">3 non lues</p></div><a class="btn o" href="#" data-toast="Tout est lu">{ic("check-check", "s")} Tout marquer comme lu</a></div>
<div class="seg" style="margin:6px 0 14px"><a class="on">Toutes</a><a>Non lues</a><a>À valider</a></div>{out}"""
    return page("notifications", brand, "Notifications", "<b>Notifications</b>", corps)

FMT_IC = {"Visuel": "image", "Présentation": "presentation", "Vidéo": "clapperboard", "Document": "file-text", "Tableur": "table", "Autre": "shapes", "Note": "notebook-text"}
def donut4(d):
    h = b3.donut(d)
    for n, _ in d["formats"]:
        h = h.replace(f'<b>{n}</b>', f'<b>{ic(FMT_IC.get(n, "file"), "s")} {n}</b>', 1)
    return h

def proj_of(t, d):
    for n, *_ in d["projets"]:
        if n.split(",")[0].split(" ")[0].lower() in t.lower():
            return n
    return d["projets"][0][0] if "Sossa" in t else (d["projets"][-1][0])

AGE = {"01/10": 0, "30/09": 1, "29/09": 2, "28/09": 3, "24/09": 7, "22/09": 9, "15/09": 16, "02/09": 29}
EXTRA = [("image", "Sossa, affiche des points de vente", "koffi", "visuel", "24/09", ["PDF"], ("ok", "Validé")),
         ("presentation", "Super Mint, présentation aux distributeurs", "fatima", "présentation", "22/09", ["PPTX"], ("ok", "Validé")),
         ("file-text", "Comité de direction, relevé de décisions du 15 septembre", "djeneba", "document", "15/09", ["DOCX"], ("ok", "Validé")),
         ("clapperboard", "Sossa, vidéo courte pour les statuts WhatsApp", "fatima", "vidéo", "02/09", ["MP4"], ("ok", "Validé"))]
def projets4(d):
    return b3.projets(d).replace('<div class="proj">', '<div class="proj" role="button" tabindex="0">').replace("Touchez un projet pour filtrer", "Touchez un projet pour filtrer les livrables")

def livr4(d, attente, extra=False):
    items = list(d["livrables"]) + (EXTRA if extra else [])
    rows = ""
    for icn, t, k, typ, dt, fm, (pc, pl) in items:
        e = EXPERTS[k]; T = typ.capitalize() if typ != "note" else "Document"
        f = "".join(f"<span>{x}</span>" for x in fm)
        rows += (f'<a class="dl" href="#" data-doc="{esc(t)}" data-age="{AGE.get(dt, 0)}" data-fmt="{T}" data-proj="{esc(proj_of(t, d))}" data-q="{esc((t + " " + e["prenom"]).lower())}">'
                 f'<span class="ic">{ic(icn, "s")}</span><span class="grow"><b class="ell">{t}</b><span class="xs mute3">{e["prenom"]}, {T.lower()}, {dt}</span><span class="fmt">{f}</span></span><span class="pill {pc}">{pl}</span></a>')
    fmts = sorted({(r[3].capitalize() if r[3] != "note" else "Document") for r in items})
    chips = '<span class="chip on" data-lf="">Tous</span>' + "".join(f'<span class="chip" data-lf="{x}">{ic(FMT_IC.get(x, "file"), "s")} {x}</span>' for x in fmts)
    opts = '<option value="">Tous les projets</option>' + "".join(f'<option>{esc(n)}</option>' for n, *_ in d["projets"])
    old = b3.livrables(d, attente)
    att = old.split('<div class="card"><div class="ch"><h2>', 2)[2]
    return f"""<div class="g2e lvw">
<div class="card"><div class="ch"><h2>{ic("archive")} Livrables</h2><span class="xs mute3 lvn">{len(items)} livrables</span></div>
<div class="lvf"><div class="seg lvp"><a data-p="0">Aujourd'hui</a><a data-p="3">Cette semaine</a><a data-p="30" class="on">Ce mois-ci</a><a data-p="999">Tout</a></div>
<label class="pick lvs">{ic("search", "s")}<input type="search" placeholder="Rechercher un livrable" aria-label="Rechercher un livrable"></label>
<label class="pick lvj">{ic("folder", "s")}<select aria-label="Filtrer par projet">{opts}</select></label></div>
<div class="chips lvc">{chips}</div><div class="lvl">{rows}</div><p class="sm mute lv0" hidden>Aucun livrable pour ces filtres.</p></div>
<div class="card"><div class="ch"><h2>{att}"""

WIDGETS = {
    "djeneba": {"kpi": [("Décisions suivies", "14", "3 en retard", "warn"), ("Réunions préparées", "6", "+2 cette semaine", "up"), ("Engagements tenus", "92 %", "+4 pts", "up")],
                "bars": [3, 5, 2, 6, 4, 1, 0], "note": "Comité de direction demain à 9 h : la note est prête, deux décisions à trancher.", "att": 1},
    "fatima": {"kpi": [("Publications", "18", "+5 cette semaine", "up"), ("Portée", "42 k", "+18 %", "up"), ("Engagement", "4,8 %", "-0,3 pt", "down")],
               "bars": [2, 4, 3, 5, 3, 1, 0], "note": "Promo Sossa de la rentrée : +22 % de clics par rapport à septembre.", "att": 1},
    "koffi": {"kpi": [("Visuels livrés", "17", "+4 cette semaine", "up"), ("Acceptés du premier coup", "76 %", "+6 pts", "up"), ("Délai moyen", "1,2 j", "-0,3 j", "up")],
              "bars": [1, 3, 4, 2, 5, 2, 0], "note": "Packaging Super Mint v2 envoyé à l'imprimeur, maquette validée par Yao.", "att": 0},
}
JOURS7 = ["L", "M", "M", "J", "V", "S", "D"]

def widget(k):
    e, w = EXPERTS[k], WIDGETS[k]
    mx = max(w["bars"]) or 1
    bars = "".join(f'<span class="wgb"><i style="height:{max(6, round(v / mx * 100))}%"></i><em>{j}</em></span>' for v, j in zip(w["bars"], JOURS7))
    kp = "".join(f'<div class="wgk"><span>{l}</span><b class="num">{v}</b><small class="{c}">{d}</small></div>' for l, v, d, c in w["kpi"])
    live = '<span class="wgl"><span class="dot"></span> Au travail</span>' if e["live"] else ""
    att = (f'<a class="wga" href="{k}.html#discussion">{ic("circle-alert", "s")} {w["att"]} en attente de votre accord</a>' if w["att"] else f'<span class="wga ok">{ic("circle-check", "s")} Rien en attente</span>')
    return f"""<article class="wg"><header class="wgh"><img src="{B}{e['photo']}" alt=""><div class="grow"><b>{e['prenom']}</b><span>{e['role']}</span>{live}</div></header>
<div class="wgks">{kp}</div>
<div class="wgc"><div class="wgct"><span class="xs mute3">Livrables par jour, cette semaine</span></div><div class="wgbars">{bars}</div></div>
<p class="wgn">{ic("sparkles", "s")} {w['note']}</p>
<footer class="wgf">{att}<a class="wgo" href="#" data-tab="tb-{k}">Son tableau de bord {FLECHE}</a></footer></article>"""

def codir_widgets():
    ws = "".join(widget(k) for k in ("djeneba", "fatima", "koffi"))
    add = f'<a class="wg wgadd" href="djeneba.html#discussion"><span class="wgplus">{ic("plus")}</span><b>Ajouter un widget</b><span class="sm mute3">Demandez à votre Chief of Staff le suivi que vous voulez voir ici : ventes, recrutement, trésorerie…</span></a>'
    sumr = (f'<div class="wgsum"><a href="#" data-tab="temps"><b class="num">5 journées</b> de travail rendues cette semaine</a>'
            f'<a href="#" data-tab="tb-fatima"><b class="num">46</b> livrables, dont 38 acceptés sans révision</a>'
            f'<a href="notifications.html"><b class="num">2</b> en attente de votre accord</a></div>')
    return f'{sumr}<section class="wgg">{ws}{add}</section>'

PROJ = {"usine": ("factory", "Nouvelle ligne de confiserie, Yopougon"), "sossa": ("megaphone", "Promo Sossa de la rentrée"),
        "mint": ("sparkles", "Super Mint, édition limitée"), "nord": ("map-pin", "Équipe commerciale Nord")}
TDB_EXT = {"adjoua": {"prenom": "Adjoua", "role": "Recrutement", "photo": "adjoua.jpg", "live": False, "service": "Service RH"},
           "kouassi": {"prenom": "Kouassi", "role": "Ventes", "photo": "kouassi.jpg", "live": False, "service": "Service commercial"}}
TDB_QUI = ["djeneba", "fatima", "koffi"]
# Tableaux que des collègues ont partagés avec Aïcha : (expert, qui partage, initiales, droit, expiration)
TDB_PART = [("adjoua", "Fanta Bakayoko", "FB", "Lecture", "15/10/2026", "Pipeline des commerciaux du Nord"),
            ("kouassi", "Kader Ouattara", "KO", "Édition", "31/10/2026", "Ventes de la rentrée par zone")]

# Un widget : (type, titre, projets, données)
TDB = {
 "djeneba": [
  ("agenda", "Rendez-vous à venir", ["usine", "nord", "sossa"], {"items": [
     ("Jeu 2 oct", "10:00", "Banque Atlantique, financement de la ligne", "Jean-Marc Aka, Serge Bamba", "ok", "Brief prêt", "usine"),
     ("Jeu 2 oct", "15:30", "Point promo Sossa avec l'agence", "Aïcha Diabaté, Nadège Touré", "ok", "Brief prêt", "sossa"),
     ("Ven 3 oct", "09:00", "Mairie de Yopougon, permis d'extension", "Jean-Marc Aka", "mid", "Brief en cours", "usine"),
     ("Lun 6 oct", "15:00", "Distributeur de Korhogo", "Fanta Bakayoko", "mid", "Brief en cours", "nord")]}),
  ("eng", "Tableau des engagements", ["usine", "sossa", "mint", "nord"], {"items": [
     ("Envoyer le devis de la machine d'emballage", "SB", "Serge Bamba", "30/09", "late", "En retard", "usine"),
     ("Valider le budget média Super Mint", "FB", "Fanta Bakayoko", "03/10", "mid", "En cours", "mint"),
     ("Signer le contrat du fournisseur de cacao", "JA", "Jean-Marc Aka", "06/10", "mid", "En cours", "usine"),
     ("Partager les ventes Sossa par boutique", "AD", "Aïcha Diabaté", "29/09", "ok", "Tenu", "sossa"),
     ("Recruter deux commerciaux à Korhogo", "FB", "Fanta Bakayoko", "15/10", "mid", "En cours", "nord")],
     "parts": [("Tenus", 29, "ok"), ("En cours", 6, "mid"), ("En retard", 3, "late")]}),
  ("cr", "Comptes rendus", ["usine", "sossa", "mint"], {"items": [
     ("Comité de direction", "Lun 29 sept", 6, 4, "usine"), ("Revue de la promo Sossa", "Ven 26 sept", 3, 5, "sossa"),
     ("Lancement Super Mint", "Jeu 25 sept", 4, 2, "mint"), ("Visite du site d'extension", "Mar 23 sept", 2, 3, "usine")]}),
  ("week", "Point hebdomadaire", ["usine", "sossa", "mint", "nord"], {"cols": [("Avancé", ["Choix du site d'extension validé", "Promo Sossa lancée dans 420 boutiques"]), ("Bloque", ["Devis machine d'emballage en attente"]), ("À trancher", ["Date d'inauguration de la ligne"])]}),
  ("solli", "Sollicitations triées", ["usine", "sossa", "nord"], {"v": (42, 9, 33), "items": [
     ("Demande d'interview, Fraternité Matin", "Remontée : à vous de décider", "usine"), ("Invitation au salon de l'agroalimentaire", "Remontée : date à confirmer", "sossa"),
     ("Relance d'un fournisseur d'emballage", "Traitée : renvoyée à Serge", "usine")]}),
 ],
 "fatima": [
  ("edcal", "Calendrier éditorial", ["sossa", "mint", "usine"], {"days": [
     ("Lun 29", [("fb", "Carrousel goûter de la rentrée", "pub", "sossa"), ("ig", "Story jeu concours", "pub", "sossa")]),
     ("Mar 30", [("li", "Article : 200 emplois à Yopougon", "pub", "usine")]),
     ("Mer 1", [("fb", "Vidéo recette Super Mint", "pub", "mint"), ("tt", "Défi Super Mint", "prog", "mint")]),
     ("Jeu 2", [("ig", "Réel coulisses de l'usine", "prog", "usine")]),
     ("Ven 3", [("fb", "Post gagnants du concours", "val", "sossa"), ("li", "Offre d'emploi chef d'équipe", "prog", "usine")]),
     ("Sam 4", [("ig", "Carrousel goûter du week-end", "val", "sossa")]),
     ("Dim 5", [])]}),
  ("posts", "Posts publiés", ["sossa", "mint", "usine"], {"items": [
     ("flyer-sossa.jpg", "Carrousel « Le goûter de la rentrée »", "fb", "Facebook, lun 29", "18 400", "1 240", "6,7 %", "sossa"),
     ("flyer-supermint.jpg", "Vidéo recette Super Mint", "fb", "Facebook, mer 1", "9 800", "610", "6,2 %", "mint"),
     ("flyer-sossa.jpg", "Story jeu concours", "ig", "Instagram, lun 29", "6 300", "870", "13,8 %", "sossa"),
     ("", "Article : 200 emplois à Yopougon", "li", "LinkedIn, mar 30", "4 100", "320", "7,8 %", "usine")]}),
  ("rs", "Rapport réseaux sociaux", ["sossa", "mint", "usine"], {"rows": [
     ("fb", "Facebook", "48 200", "+1 120", "64 300", "5,9 %"), ("ig", "Instagram", "21 700", "+860", "31 900", "8,1 %"),
     ("li", "LinkedIn", "6 900", "+240", "9 400", "6,4 %"), ("tt", "TikTok", "12 300", "+2 050", "41 200", "9,7 %")]}),
  ("blog", "Blog", ["usine", "mint"], {"v": ("3", "5 840", "2 min 40"), "items": [
     ("Comment on fabrique un biscuit Sossa", "2 910 lectures", "usine"), ("Super Mint : l'histoire d'une recette", "1 980 lectures", "mint"), ("Nos 200 nouveaux emplois", "950 lectures", "usine")]}),
  ("lvr", "Rapport par livrable", ["sossa", "mint"], {"items": [
     ("Campagne Sossa rentrée", "1,2 M F CFA engagés, 412 contacts, 2 900 F CFA par contact", "Rapport prêt", "sossa"),
     ("Jeu concours Instagram", "1 870 participations, 640 nouveaux abonnés", "Rapport prêt", "sossa"),
     ("Lancement Super Mint", "Portée 78 000, 3 cas sensibles traités", "En cours", "mint")]}),
 ],
 "koffi": [
  ("kanban", "Créations en cours", ["sossa", "mint", "usine"], {"cols": [
     ("Brief reçu", [("Kakémono salon agroalimentaire", "sossa")]),
     ("En création", [("Packaging Super Mint 250 g", "mint"), ("Signalétique de la nouvelle ligne", "usine")]),
     ("En attente de BAT", [("Affiche A2 gagnants du concours", "sossa"), ("T-shirts de l'inauguration", "usine")]),
     ("Livré", [("Flyer goûter de la rentrée", "sossa"), ("Visuel Super Mint, 10 formats", "mint")])]}),
  ("bat", "Visuels à valider", ["sossa", "usine"], {"items": [("flyer-sossa.jpg", "Affiche A2 gagnants du concours", "Pour l'imprimeur, 600 exemplaires", "sossa"), ("flyer-supermint.jpg", "T-shirts de l'inauguration", "Recto verso, 120 pièces", "usine")]}),
  ("lvr", "Rapport par livrable", ["sossa", "mint", "usine"], {"items": [
     ("Flyer goûter de la rentrée", "600 imprimés, 3 formats, validé du premier coup", "Livré", "sossa"),
     ("Visuel Super Mint", "10 déclinaisons, du kakémono au statut WhatsApp", "Livré", "mint"),
     ("Signalétique de la ligne", "12 panneaux, 2 corrections demandées", "En cours", "usine")]}),
  ("count", "Déclinaisons d'un même visuel", ["mint", "sossa"], {"v": (34, 120, 300), "unit": "formats déclinés", "by": [("mint", 20), ("sossa", 14)], "fait": "Visuel Super Mint décliné en 10 formats, du kakémono au statut WhatsApp."}),
  ("prog", "Charte graphique", ["mint"], {"pct": 80, "steps": [("Logo et couleurs", True), ("Typographies", True), ("Règles d'usage", True), ("Exemples d'application", False)], "fait": "Charte Super Mint v2, à valider avec Yao avant le 10 octobre."}),
 ],
 "adjoua": [
  ("funnel", "Pipeline de recrutement", ["nord", "usine"], {"steps": [("Sourcés", 64), ("Contactés", 31), ("Entretiens", 9), ("Offres", 2), ("Embauchés", 1)], "fait": "5 commerciaux terrain pour Korhogo et 2 chefs d'équipe pour la nouvelle ligne."}),
  ("list", "Fiches de poste publiées", ["nord", "usine"], {"items": [("Commercial terrain, Korhogo", "Publiée, 41 candidatures", "nord"), ("Chef d'équipe ligne confiserie", "Publiée, 23 candidatures", "usine"), ("Technicien de maintenance", "Attend votre accord", "usine")]}),
  ("count", "Profils sourcés", ["nord", "usine"], {"v": (22, 64, 150), "unit": "profils sourcés", "by": [("nord", 40), ("usine", 24)], "fait": "Sourcés sur LinkedIn, Emploi.ci et le vivier interne, avec la raison de chaque choix."}),
 ],
 "kouassi": [
  ("count", "Commandes des boutiques", ["sossa", "nord"], {"v": (312, 1240, 3600), "unit": "commandes prises", "by": [("sossa", 210), ("nord", 102)], "fait": "Relance automatique des boutiques sans commande depuis 10 jours : 38 ont recommandé."}),
  ("list", "Comptes à relancer", ["nord", "sossa"], {"items": [("Supermarché Prosuma, Korhogo", "Pas de commande depuis 14 jours", "nord"), ("Grossiste Adjamé Liberté", "Facture en attente", "sossa")]}),
  ("funnel", "Prospects distributeurs", ["nord"], {"steps": [("Repérés", 40), ("Contactés", 22), ("Rendez-vous", 7), ("Signés", 2)], "fait": "Deux distributeurs signés à Korhogo et Ferkessédougou."}),
 ],
}
GAB_BASE = {"djeneba": "rendez-vous, comptes rendus, engagements, point hebdomadaire, sollicitations",
            "fatima": "calendrier éditorial, posts, réseaux sociaux, blog, rapports",
            "koffi": "créations en cours, visuels à valider, rapports, déclinaisons, charte",
            "adjoua": "pipeline, fiches de poste, profils sourcés", "kouassi": "commandes, relances, prospects"}
SUGG_W = {"djeneba": ["Déplacements du directeur général", "Courriers à signer", "Radar de la semaine"],
          "fatima": ["Avis clients Google", "Newsletter mensuelle", "Veille des concurrents"],
          "koffi": ["Bibliothèque des visuels", "Commandes chez l'imprimeur", "Pistes de nom"],
          "adjoua": ["Délai moyen de recrutement"], "kouassi": ["Ventes par commercial"]}
RSI = {"fb": ("facebook.com", "Facebook"), "ig": ("instagram.com", "Instagram"), "li": ("linkedin.com", "LinkedIn"), "tt": ("tiktok.com", "TikTok")}
def rsi(c, s=18):
    return f'<img class="rsi" src="{FAV}{RSI[c][0]}" alt="{RSI[c][1]}" title="{RSI[c][1]}" style="width:{s}px;height:{s}px">'

def qui(k):
    return EXPERTS.get(k) or TDB_EXT[k]

def ptag(p):
    i, n = PROJ[p]
    return f'<span class="ptag" data-p="{p}">{ic(i, "s")} {n}</span>'

def wbody(t, d):
    if t == "count":
        mx = max(v for _, v in d["by"]) or 1
        by = "".join(f'<div class="wbr" data-p="{p}"><span class="ell">{PROJ[p][1]}</span><i><b style="width:{round(v / mx * 100)}%"></b></i><em class="num">{v}</em></div>' for p, v in d["by"])
        w, m_, tr = d["v"]
        return (f'<div class="wbig"><b class="num" data-per=\'{{"semaine":"{w}","mois":"{m_}","trimestre":"{tr}"}}\'>{w}</b><span>{d["unit"]}</span></div>'
                f'<div class="wbys">{by}</div><p class="wfait">{ic("check", "s")} {d["fait"]}</p>')
    if t == "split":
        tot = sum(v for _, v, _ in d["parts"])
        bar = "".join(f'<i class="{c}" style="width:{v / tot * 100:.1f}%"></i>' for _, v, c in d["parts"])
        lg = "".join(f'<span><i class="{c}"></i>{n} <b class="num">{v}</b></span>' for n, v, c in d["parts"])
        it = "".join(f'<li data-p="{p}"><b>{a}</b><span>{b_}</span></li>' for a, b_, p in d["items"])
        return f'<div class="wsplit">{bar}</div><div class="wleg">{lg}</div><ul class="witems">{it}</ul>'
    if t == "list":
        it = "".join(f'<li data-p="{p}"><b>{a}</b><span>{b_}</span></li>' for a, b_, p in d["items"])
        return f'<ul class="witems big">{it}</ul>'
    if t == "week":
        cols = "".join(f'<div><h5>{h}</h5><ul>{"".join(f"<li>{x}</li>" for x in xs)}</ul></div>' for h, xs in d["cols"])
        return f'<div class="wweek">{cols}</div>'
    if t == "cal":
        mx = max(v for _, v in d["by"])
        by = "".join(f'<div class="wbr"><span>{n}</span><i><b style="width:{round(v / mx * 100)}%"></b></i><em class="num">{v}</em></div>' for n, v in d["by"])
        return (f'<div class="wbig"><b class="num">{d["done"]}</b><span>publiées sur {d["total"]} prévues ce mois-ci</span></div>'
                f'<div class="wprog"><i style="width:{d["done"] / d["total"] * 100:.0f}%"></i></div><div class="wbys">{by}</div>')
    if t == "camp":
        rows = "".join(f'<div class="wkv"><span>{a}</span><b class="num">{b_}</b></div>' for a, b_ in d["rows"])
        return f'{rows}<p class="wfait">{ic("check", "s")} {d["fait"]}</p>'
    if t == "prog":
        st = "".join(f'<li class="{"ok" if ok else ""}">{ic("circle-check" if ok else "circle", "s")} {n}</li>' for n, ok in d["steps"])
        return f'<div class="wbig"><b class="num">{d["pct"]} %</b><span>terminée</span></div><div class="wprog"><i style="width:{d["pct"]}%"></i></div><ul class="wsteps">{st}</ul><p class="wfait">{ic("check", "s")} {d["fait"]}</p>'
    if t == "funnel":
        mx = d["steps"][0][1]
        fs = "".join(f'<div class="wfn"><span>{n}</span><i><b style="width:{max(4, round(v / mx * 100))}%"></b></i><em class="num">{v}</em></div>' for n, v in d["steps"])
        return f'{fs}<p class="wfait">{ic("check", "s")} {d["fait"]}</p>'
    if t == "pie":
        tot = sum(v for _, v, _ in d["parts"]); acc = 0; seg = []
        for _, v, c in d["parts"]:
            seg.append(f"{c} {acc / tot * 360:.0f}deg {(acc + v) / tot * 360:.0f}deg"); acc += v
        lg = "".join(f'<li><i style="background:{c}"></i>{n}<b class="num">{v / tot * 100:.0f} %</b></li>' for n, v, c in d["parts"])
        return f'<div class="pie"><div class="pd" style="background:conic-gradient({", ".join(seg)})"><span><b class="num">{tot}</b><small>{d["unit"]}</small></span></div><ul>{lg}</ul></div>'
    if t == "bars":
        mx = max(v for _, v in d["items"])
        b = "".join(f'<div class="hb"><i style="height:{v / mx * 100:.0f}%"><b class="num">{v}</b></i><span>{l}</span></div>' for l, v in d["items"])
        return f'<div class="hbs">{b}</div><p class="xs mute3">{d["note"]}</p>'
    if t == "learn":
        col = lambda h, i_, xs, c: f'<div class="lrn {c}"><h5>{ic(i_, "s")} {h}</h5><ul>{"".join(f"<li>{x}</li>" for x in xs)}</ul></div>'
        return (f'<div class="lrns l4">{col("Ce qu’on a appris", "lightbulb", d["a"], "a")}{col("Défis", "mountain", d["d"], "d")}{col("Blocages", "octagon-alert", d["b"], "b")}'
                f'{col("Prochaines étapes", "circle-arrow-right", d["n"] if isinstance(d["n"], list) else [d["n"]], "n")}</div>')
    if t in ("mails", "news", "lib"):
        tri = "".join(f'<div><b class="num">{v}</b><span>{l}</span></div>' for l, v in d["v"])
        if t == "mails":
            it = "".join(f'<li data-p="{p}"><span class="ic">{ic("mail", "s")}</span><span class="grow"><b>{a}</b><small>{b_}</small></span><a href="#" class="pill {"late" if "répondre" in s_ else "ok"}" data-toast="Ouverture : {a}">{s_}</a></li>' for a, b_, p, s_ in d["items"])
            return f'<div class="wtri w4">{tri}</div><ul class="wcr">{it}</ul>'
        it = "".join(f'<li data-p="{p}"><b>{a}</b><span>{b_}</span></li>' for a, b_, p in d["items"])
        return f'<div class="wtri">{tri}</div><ul class="witems">{it}</ul>'
    if t == "depl":
        it = "".join(f'<li data-p="{p}"><span class="ic">{ic("plane" if v == "Paris" or v == "Korhogo" else "car", "s")}</span><span class="grow"><b>{v}, {dt}</b><small>{o}</small></span><span class="pill {c}">{st}</span></li>' for v, dt, o, st, c, p in d["items"])
        return f'<ul class="wcr">{it}</ul>'
    if t == "ads":
        rows = "".join(f'<tr data-p="{p}"><td><span class="who">{rsi(c)} {n}</span></td><td class="num">{dp}</td><td class="num">{im}</td><td class="num">{ctr}</td><td class="num">{cpc}</td><td class="num"><b>{cv}</b></td></tr>' for c, n, dp, im, ctr, cpc, cv, p in d["rows"])
        return f'<div class="wtw"><table class="wtab"><thead><tr><th>Plateforme</th><th>Dépense</th><th>Impressions</th><th>Taux de clic</th><th>Coût par clic</th><th>Contacts</th></tr></thead><tbody>{rows}</tbody></table></div>'
    if t == "sites":
        it = "".join(f'<li data-p="{p}"><span class="ic">{ic("globe", "s")}</span><span class="grow"><b>{a}</b><small>{b_}</small></span><a href="#" class="pill {"ok" if s_ == "Livré" else "mid"}" data-toast="Ouverture : {a}">{s_}</a></li>' for a, b_, s_, p in d["items"])
        return f'<ul class="wcr">{it}</ul>'
    if t == "kst":
        it = "".join(f'<div class="kk"><span>{l}</span><b class="num" data-kv=\'{json.dumps(v, ensure_ascii=False)}\'>{v[""]}</b><small class="{c}">{x}</small></div>' for l, v, x, c in d["items"])
        n = len(d["items"])
        return f'<div class="kks" style="--kc:{4 if n == 8 else n}">{it}</div>'
    if t == "postes":
        rows = "".join(f'<tr data-p="{p}" class="clk" data-pick="{p}"><td><b>{n}</b><small>{m}</small></td><td class="num">{a}</td><td class="num">{b_}</td><td class="num">{c}</td><td class="num">{o}</td><td class="num"><b>{r}</b></td><td class="num">{dl}</td><td><span class="pill {pc}">{st}</span></td></tr>'
                       for p, n, m, a, b_, c, o, r, dl, pc, st in d["items"])
        return (f'<div class="wtw"><table class="wtab"><thead><tr><th>Poste et manager</th><th>Candidatures</th><th>Entretiens</th><th>Liste courte</th><th>Offres</th><th>Recrutés</th><th>Délai</th><th>État</th></tr></thead><tbody>{rows}</tbody></table></div>'
                f'<p class="xs mute3">{ic("mouse-pointer-click", "s")} Touchez un poste pour voir tout le tableau de bord de ce poste.</p>')
    if t == "funnel2":
        mx = d["steps"][0][1]
        fs = ""
        for n, v in d["steps"]:
            w = {kk: f'{max(3, round(vv / (mx[kk] or 1) * 100))}%' for kk, vv in v.items()}
            fs += f'<div class="wfn"><span>{n}</span><i><b data-kw=\'{json.dumps(w)}\' style="width:{w[""]}"></b></i><em class="num" data-kv=\'{json.dumps({kk: str(vv) for kk, vv in v.items()})}\'>{v[""]}</em></div>'
        cv = {kk: f'{round(d["steps"][-1][1][kk] / (vv or 1) * 100, 1)} %'.replace(".", ",") for kk, vv in mx.items()}
        return f'{fs}<p class="wfait">{ic("target", "s")} Taux de conversion, de la candidature à l’embauche : <b data-kv=\'{json.dumps(cv, ensure_ascii=False)}\'>{cv[""]}</b></p>'
    if t == "itv":
        it = "".join(f'<li class="ag" data-p="{p}"><img class="cav" src="{B}{im}.jpg" alt=""><span class="grow"><b>{n}</b><small>{PROJ[p][1]}, avec {w}</small><small>{ic("calendar", "s")} {dt}, {lieu}</small></span><span class="pill {"ok" if "prêt" in st or "envoyé" in st else "mid"}">{st}</span></li>' for im, n, p, dt, w, lieu, st in d["items"])
        return f'<ul class="wag">{it}</ul>'
    if t == "score":
        hd = "".join(f'<th>{c}</th>' for c in d["crit"])
        rows = "".join(f'<tr data-p="{p}"><td><span class="who"><img class="cav" src="{B}{im}.jpg" alt=""><span><b>{n}</b><small>{PROJ[p][1]}</small></span></span></td>'
                       + "".join(dots(v) for v in sc)
                       + f'<td class="num"><b>{tot}</b></td><td><span class="pill {pc}">{st}</span></td></tr>' for im, n, p, sc, tot, pc, st in d["items"])
        return f'<div class="wtw"><table class="wtab"><thead><tr><th>Finaliste</th>{hd}<th>Note</th><th>Avis</th></tr></thead><tbody>{rows}</tbody></table></div>'
    if t == "sources":
        mx = max(x[2] for x in d["items"])
        rows = "".join(f'<tr><td><span class="who">{srci(dom)} {n}</span></td><td><span class="mbar"><i style="width:{a / mx * 100:.0f}%"></i></span><span class="num">{a}</span></td><td class="num">{e}</td><td class="num"><b>{r}</b></td><td class="num">{e / a * 100:.0f} %</td></tr>' for dom, n, a, e, r in d["items"])
        return f'<div class="wtw"><table class="wtab"><thead><tr><th>Source</th><th>Candidatures</th><th>Entretiens</th><th>Recrutés</th><th>Conversion</th></tr></thead><tbody>{rows}</tbody></table></div>'
    if t == "satis":
        it = "".join(f'<div class="sat"><span>{n}</span><b class="num">{v}<small> / 5</small></b><span class="stars">{"".join(ic("star", "s") for _ in range(5))}<i style="width:{float(v.replace(",", ".")) / 5 * 100:.0f}%">{"".join(ic("star", "s") for _ in range(5))}</i></span><small>{nb} réponses, {pct} % satisfaits</small></div>' for n, v, nb, pct in d["items"])
        q, a = d["quote"]
        return f'<div class="sats">{it}</div><div class="wkv"><span>Délai de réponse aux candidats</span><b class="num">{d["delai"]}</b></div><blockquote class="wq">{q}<small>{a}</small></blockquote>'
    if t == "recrues":
        it = "".join(f'<li data-p="{p}"><img class="cav" src="{B}{im}.jpg" alt=""><span class="grow"><b>{n}</b><small>{PROJ[p][1]}, {ar}</small><span class="wprog sm"><i style="width:{pc}%"></i></span></span><span class="num xs mute3">{pc} %</span></li>' for im, n, p, ar, pc in d["items"])
        return f'<ul class="wcr">{it}</ul><p class="xs mute3">Intégration : accès, matériel, formation, premier objectif.</p>'
    if t == "engresp":
        mx = max(a + b_ + c for _, _, a, b_, c in d["items"])
        rows = "".join(f'<div class="er"><span class="who">{face(i, "", 26)} {n}</span><span class="erb"><i class="ok" style="width:{a / mx * 100:.0f}%"></i><i class="mid" style="width:{b_ / mx * 100:.0f}%"></i><i class="late" style="width:{c / mx * 100:.0f}%"></i></span><span class="num xs">{a}/{a + b_ + c}</span></div>' for i, n, a, b_, c in d["items"])
        return f'<div class="ers">{rows}</div><div class="wleg"><span><i class="ok"></i>Tenus</span><span><i class="mid"></i>En cours</span><span><i class="late"></i>En retard</span></div>'
    if t == "camp2":
        rows = "".join(f'<tr data-p="{p}" class="clk" data-pick="{p}"><td><b>{n}</b></td><td class="num">{bu}</td><td class="num">{po}</td><td class="num">{cl}</td><td class="num"><b>{co}</b></td><td class="num">{cpc}</td><td><span class="pill {pc}">{st}</span></td></tr>' for p, n, bu, po, cl, co, cpc, pc, st in d["items"])
        return f'<div class="wtw"><table class="wtab"><thead><tr><th>Campagne</th><th>Budget</th><th>Portée</th><th>Clics</th><th>Résultat</th><th>Coût par contact</th><th>État</th></tr></thead><tbody>{rows}</tbody></table></div><p class="xs mute3">{ic("mouse-pointer-click", "s")} Touchez une campagne pour voir son détail.</p>'
    if t == "agenda":
        it = "".join(f'<li class="ag" data-p="{p}"><span class="agt"><b>{h}</b><small>{j}</small></span><span class="grow"><b>{a}</b><small>{qu}</small></span>'
                     f'<a href="#" class="pill {c}" data-toast="Ouverture du brief : {a}">{ic("file-text", "s")} {st}</a></li>' for j, h, a, qu, c, st, p in d["items"])
        return f'<ul class="wag">{it}</ul><a class="wlink" href="djeneba.html#calendrier">{ic("calendar", "s")} Tout l’agenda</a>'
    if t == "eng":
        tot = sum(v for _, v, _ in d["parts"])
        bar = "".join(f'<i class="{c}" style="width:{v / tot * 100:.1f}%"></i>' for _, v, c in d["parts"])
        lg = "".join(f'<span><i class="{c}"></i>{n} <b class="num">{v}</b></span>' for n, v, c in d["parts"])
        rows = "".join(f'<tr data-p="{p}"><td><b>{a}</b></td><td><span class="who">{face(i, "", 24)} {n}</span></td><td class="num">{dt}</td><td><span class="pill {c}">{st}</span></td></tr>' for a, i, n, dt, c, st, p in d["items"])
        return (f'<div class="wsplit">{bar}</div><div class="wleg">{lg}</div><div class="wtw"><table class="wtab"><thead><tr><th>Engagement</th><th>Responsable</th><th>Échéance</th><th>État</th></tr></thead><tbody>{rows}</tbody></table></div>'
                f'<a class="wlink" href="#" data-toast="Relance envoyée aux responsables en retard">{ic("bell-ring", "s")} Relancer les retards</a>')
    if t == "cr":
        it = "".join(f'<li data-p="{p}"><span class="ic">{ic("notebook-text", "s")}</span><span class="grow"><b>{a}</b><small>{dt}, {nd} décisions, {ne} engagements</small></span>'
                     f'<a href="#" class="ib" aria-label="Lire le compte rendu" data-toast="Ouverture du compte rendu : {a}">{ic("arrow-up-right", "s")}</a></li>' for a, dt, nd, ne, p in d["items"])
        return f'<ul class="wcr">{it}</ul>'
    if t == "solli":
        r, m_, tr = d["v"]
        it = "".join(f'<li data-p="{p}"><b>{a}</b><span>{b_}</span></li>' for a, b_, p in d["items"])
        return (f'<div class="wtri"><div><b class="num">{r}</b><span>reçues</span></div><div class="up"><b class="num">{m_}</b><span>remontées</span></div><div><b class="num">{tr}</b><span>traitées sans vous</span></div></div>'
                f'<ul class="witems">{it}</ul>')
    if t == "edcal":
        lab = {"e-pub": "Publié", "e-prog": "Programmé", "e-val": "À valider"}
        days = "".join(f'<div class="edd"><h5>{j}</h5>' + ("".join(f'<a href="#" class="edp e-{s}" data-p="{p}" data-toast="{a} : {lab["e-" + s]}">{rsi(c, 14)}<span>{a}</span></a>' for c, a, s, p in ps) or '<span class="edv">Rien de prévu</span>') + '</div>' for j, ps in d["days"])
        lg = "".join(f'<span><i class="{s}"></i>{l}</span>' for s, l in lab.items())
        return f'<div class="edc">{days}</div><div class="edl">{lg}<a class="wlink" href="#" data-toast="Calendrier d’octobre ouvert">{ic("calendar-range", "s")} Voir le mois</a></div>'
    if t == "posts":
        th = lambda im: f'<img src="{B}{im}" alt="">' if im else f'<span class="psi">{ic("file-text", "s")}</span>'
        rows = "".join(f'<tr data-p="{p}"><td><span class="pst">{th(im)}<span><b>{a}</b><small>{rsi(c, 12)} {q}</small></span></span></td><td class="num">{v}</td><td class="num">{n}</td><td class="num"><b>{e}</b></td></tr>'
                       for im, a, c, q, v, n, e, p in d["items"])
        return f'<div class="wtw"><table class="wtab"><thead><tr><th>Post</th><th>Vues</th><th>Réactions</th><th>Engagement</th></tr></thead><tbody>{rows}</tbody></table></div>'
    if t == "rs":
        rows = "".join(f'<tr><td><span class="who">{rsi(c)} {n}</span></td><td class="num">{ab}</td><td class="num up">{gn}</td><td class="num">{po}</td><td class="num"><b>{en}</b></td></tr>' for c, n, ab, gn, po, en in d["rows"])
        return (f'<div class="wtw"><table class="wtab"><thead><tr><th>Réseau</th><th>Abonnés</th><th>Gagnés</th><th>Portée</th><th>Engagement</th></tr></thead><tbody>{rows}</tbody></table></div>'
                f'<div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap"><a class="btn o sm" href="#" data-toast="Rapport de la semaine en PDF">{ic("download", "s")} Rapport de la semaine</a><a class="btn o sm" href="#" data-toast="Rapport du mois en PDF">{ic("download", "s")} Rapport du mois</a></div>')
    if t == "blog":
        a_, l_, tl = d["v"]
        it = "".join(f'<li data-p="{p}"><b>{a}</b><span>{b_}</span></li>' for a, b_, p in d["items"])
        return (f'<div class="wtri"><div><b class="num">{a_}</b><span>articles ce mois-ci</span></div><div><b class="num">{l_}</b><span>lectures</span></div><div><b class="num">{tl}</b><span>de lecture moyenne</span></div></div><ul class="witems">{it}</ul>')
    if t == "lvr":
        it = "".join(f'<li data-p="{p}"><span class="grow"><b>{a}</b><small>{b_}</small></span><a href="#" class="pill {"ok" if s in ("Rapport prêt", "Livré") else "mid"}" data-toast="Ouverture : {a}">{s}</a></li>' for a, b_, s, p in d["items"])
        return f'<ul class="wcr">{it}</ul>'
    if t == "kanban":
        cols = "".join(f'<div class="wkb"><h5>{h} <span class="cnt">{len(xs)}</span></h5>' + "".join(f'<a href="#" class="wkc" data-p="{p}" data-toast="Ouverture : {x}">{x}{ptag(p)}</a>' for x, p in xs) + '</div>' for h, xs in d["cols"])
        return f'<div class="wkbs">{cols}</div>'
    if t == "bat":
        it = "".join(f'<div class="wbat" data-p="{p}"><img src="{B}{im}" alt=""><span class="grow"><b>{a}</b><small>{b_}</small></span><span class="row" style="gap:6px"><a href="#" class="btn p sm" data-toast="BAT validé, envoyé à l’imprimeur">Valider</a></span></div>' for im, a, b_, p in d["items"])
        return f'<div class="wbats">{it}</div>'
    return ""

def filtres(k=None):
    used = [p for p in PROJ if k and any(p in w[2] for w in TDB[k])] or list(PROJ)[:4]
    pr = f'<span class="chip on" data-fp="">{FILT_LBL.get(k, "Tous les projets")}</span>' + "".join(f'<span class="chip" data-fp="{p}">{ic(PROJ[p][0], "s")} {PROJ[p][1]}</span>' for p in used)
    per = '<div class="seg tdper"><a data-per="semaine" class="on">Semaine</a><a data-per="mois">Mois</a><a data-per="trimestre">Trimestre</a></div>'
    ty = ""
    if k:
        ty = '<label class="tdty"><span class="xs mute3">Type de livrable</span><select><option value="">Tous</option>' + "".join(f'<option>{w[1]}</option>' for w in TDB[k] if w[0] != "kst") + '</select></label>'
    dt = f'<label class="anr tddt">{ic("calendar", "s")}<input type="date" value="2026-09-28" aria-label="Du"><span>au</span><input type="date" value="2026-10-04" aria-label="Au"></label>'
    q = f'<label class="srch tdq">{ic("search", "s")}<input type="search" placeholder="Chercher dans le tableau" aria-label="Chercher dans le tableau"></label>'
    return f'<div class="tdf"><div class="chips tdp">{pr}</div><div class="row tdr">{q}{per}{dt}{ty}</div></div>'

WIDE = ("eng", "edcal", "posts", "rs", "kanban")
FULL = ("edcal", "kanban")

# ---------- v4.15 tableaux de bord : indicateurs du métier, détail par poste, projet ou campagne
PROJ.update({"pcom": ("briefcase", "Commercial terrain, Korhogo"), "pceq": ("briefcase", "Chef d'équipe, ligne confiserie"),
             "ptec": ("briefcase", "Technicien de maintenance"), "pcg": ("briefcase", "Contrôleur de gestion"),
             "zab": ("map-pin", "Abidjan"), "zbk": ("map-pin", "Bouaké"), "zko": ("map-pin", "Korhogo")})
FILT_LBL = {"adjoua": "Tous les postes", "kouassi": "Toutes les zones", "fatima": "Toutes les campagnes"}
def KV(**d):
    return {("" if k == "tout" else k): v for k, v in d.items()}

TDB["adjoua"] = [
 ("kst", "Indicateurs du recrutement", ["pcom", "pceq", "ptec", "pcg"], {"items": [
   ("Postes ouverts", KV(tout="4", pcom="1", pceq="1", ptec="1", pcg="1"), "+1 ce mois-ci", ""),
   ("Candidatures", KV(tout="187", pcom="96", pceq="51", ptec="28", pcg="12"), "+42 sur 7 jours", "up"),
   ("Entretiens", KV(tout="34", pcom="14", pceq="11", ptec="6", pcg="3"), "9 cette semaine", ""),
   ("Offres faites", KV(tout="6", pcom="3", pceq="2", ptec="1", pcg="0"), "4 acceptées", ""),
   ("Recrutés", KV(tout="4", pcom="3", pceq="1", ptec="0", pcg="0"), "objectif 7", "up"),
   ("Délai moyen d'embauche", KV(tout="23 j", pcom="19 j", pceq="27 j", ptec="en cours", pcg="en cours"), "-5 j sur le trimestre", "up"),
   ("Taux d'acceptation", KV(tout="67 %", pcom="100 %", pceq="50 %", ptec="en attente", pcg="pas d'offre"), "des offres faites", ""),
   ("Satisfaction des candidats", KV(tout="4,5 / 5", pcom="4,6 / 5", pceq="4,4 / 5", ptec="4,5 / 5", pcg="4,3 / 5"), "64 réponses", "up")]}),
 ("postes", "Postes ouverts", ["pcom", "pceq", "ptec", "pcg"], {"items": [
   ("pcom", "Commercial terrain, Korhogo", "Fanta Bakayoko", 96, 14, 6, 3, 3, "19 j", "ok", "3 recrutés sur 5"),
   ("pceq", "Chef d'équipe, ligne confiserie", "Serge Bamba", 51, 11, 4, 2, 1, "27 j", "mid", "Offre en attente"),
   ("ptec", "Technicien de maintenance", "Serge Bamba", 28, 6, 3, 1, 0, "en cours", "mid", "Offre envoyée"),
   ("pcg", "Contrôleur de gestion", "Ibrahim Sylla", 12, 3, 0, 0, 0, "en cours", "late", "Peu de candidatures")]}),
 ("funnel2", "Entonnoir de recrutement", ["pcom", "pceq", "ptec", "pcg"], {"steps": [
   ("Candidatures", KV(tout=187, pcom=96, pceq=51, ptec=28, pcg=12)), ("Présélectionnés", KV(tout=58, pcom=31, pceq=16, ptec=8, pcg=3)),
   ("Entretiens", KV(tout=34, pcom=14, pceq=11, ptec=6, pcg=3)), ("Liste courte", KV(tout=13, pcom=6, pceq=4, ptec=3, pcg=0)),
   ("Offres", KV(tout=6, pcom=3, pceq=2, ptec=1, pcg=0)), ("Recrutés", KV(tout=4, pcom=3, pceq=1, ptec=0, pcg=0))]}),
 ("itv", "Entretiens à venir", ["pcom", "pceq", "ptec"], {"items": [
   ("m_women_62", "Mariam Coulibaly", "pcom", "Jeu 2 oct, 10:00", "Fanta Bakayoko", "Visio", "Brief envoyé"),
   ("m_men_30", "Didier Yao", "pceq", "Jeu 2 oct, 14:30", "Serge Bamba", "Sur place", "Épreuve pratique prête"),
   ("m_men_49", "Hamed Niang", "ptec", "Ven 3 oct, 09:00", "Serge Bamba", "Sur place", "Brief envoyé"),
   ("m_women_69", "Salimata Diallo", "pcom", "Lun 6 oct, 11:00", "Fanta Bakayoko", "Visio", "À planifier avec le manager")]}),
 ("score", "Scorecards des finalistes", ["pcom", "pceq"], {"crit": ["Expérience", "Négociation", "Terrain", "Motivation"], "items": [
   ("m_women_62", "Mariam Coulibaly", "pcom", (5, 4, 5, 4), "4,5", "ok", "À recruter"),
   ("m_men_16", "Olivier Kouamé", "pcom", (4, 4, 3, 5), "4,0", "mid", "À revoir"),
   ("m_men_30", "Didier Yao", "pceq", (5, 3, 4, 4), "4,0", "ok", "À recruter"),
   ("m_women_89", "Rokia Traoré", "pceq", (3, 4, 3, 4), "3,5", "late", "Écarté")]}),
 ("sources", "Efficacité des sources", ["pcom", "pceq", "ptec", "pcg"], {"items": [
   ("linkedin.com", "LinkedIn", 64, 12, 2), ("emploi.ci", "Emploi.ci", 58, 9, 1), ("facebook.com", "Facebook", 39, 6, 0), ("", "Cooptation", 14, 5, 1), ("", "Vivier interne", 12, 2, 0)]}),
 ("satis", "Satisfaction", ["pcom", "pceq", "ptec", "pcg"], {"items": [("Candidats", "4,5", 64, 90), ("Managers", "4,7", 9, 94)], "delai": "1,2 jour",
   "quote": ("« Réponse en moins de 48 h et retour après l’entretien, c’est rare. »", "Candidat, poste Commercial terrain")}),
 ("recrues", "Recrues et intégration", ["pcom", "pceq"], {"items": [
   ("m_women_36", "Awa Konaté", "pcom", "Arrivée le 22 sept", 80), ("m_men_83", "Jean Kouadio", "pcom", "Arrivée le 22 sept", 75),
   ("m_women_30", "Aminata Sanogo", "pcom", "Arrive le 6 oct", 20), ("m_men_59", "Koné Brahima", "pceq", "Arrive le 13 oct", 10)]}),
]
TDB["djeneba"] = [("kst", "Indicateurs du cabinet", ["usine", "sossa", "mint", "nord"], {"items": [
   ("Réunions préparées", KV(tout="12", usine="6", sossa="3", mint="2", nord="1"), "+3 sur 7 jours", "up"),
   ("CR envoyés sous 24 h", KV(tout="100 %", usine="100 %", sossa="100 %", mint="100 %", nord="100 %"), "11 envoyés", "up"),
   ("Engagements tenus", KV(tout="76 %", usine="68 %", sossa="91 %", mint="80 %", nord="75 %"), "29 sur 38", ""),
   ("Engagements en retard", KV(tout="3", usine="2", sossa="0", mint="1", nord="0"), "dont 1 de plus de 5 jours", "warn"),
   ("Décisions suivies", KV(tout="47", usine="22", sossa="12", mint="9", nord="4"), "15 ce mois-ci", ""),
   ("Temps rendu au DG", KV(tout="9 h", usine="4 h", sossa="2 h", mint="2 h", nord="1 h"), "cette semaine", "up")]})] + TDB["djeneba"][:3] + [
 ("engresp", "Engagements par responsable", ["usine", "sossa", "mint", "nord"], {"items": [("SB", "Serge Bamba", 8, 2, 2), ("JA", "Jean-Marc Aka", 7, 2, 0), ("FB", "Fanta Bakayoko", 6, 2, 1), ("AD", "Aïcha Diabaté", 5, 0, 0), ("IS", "Ibrahim Sylla", 3, 0, 0)]}),
] + TDB["djeneba"][3:]
TDB["fatima"] = [("kst", "Indicateurs marketing", ["sossa", "mint", "usine"], {"items": [
   ("Posts publiés", KV(tout="14", sossa="8", mint="4", usine="2"), "+3 sur 7 jours", "up"),
   ("Portée totale", KV(tout="146 800", sossa="92 400", mint="41 200", usine="13 200"), "+18 %", "up"),
   ("Engagement moyen", KV(tout="7,2 %", sossa="8,4 %", mint="6,2 %", usine="6,9 %"), "+0,8 pt", "up"),
   ("Abonnés gagnés", KV(tout="4 270", sossa="2 610", mint="1 380", usine="280"), "tous réseaux", ""),
   ("Contacts générés", KV(tout="412", sossa="412", mint="en cours", usine="0"), "via la campagne", ""),
   ("Coût par contact", KV(tout="2 900 F", sossa="2 900 F", mint="en cours", usine="pas de budget"), "-12 %", "up")]}),
 TDB["fatima"][0],
 ("camp2", "Par campagne", ["sossa", "mint", "usine"], {"items": [
   ("sossa", "Promo Sossa de la rentrée", "1,2 M F", "92 400", "3 140", "412", "2 900 F", "ok", "En cours"),
   ("mint", "Super Mint, édition limitée", "600 000 F", "41 200", "1 260", "en cours", "en cours", "mid", "Lancée le 1er oct"),
   ("usine", "Nouvelle ligne, marque employeur", "0 F", "13 200", "410", "62 candidatures", "gratuit", "ok", "Organique")]}),
] + TDB["fatima"][1:]
TDB["koffi"] = [("kst", "Indicateurs design", ["sossa", "mint", "usine"], {"items": [
   ("Créations livrées", KV(tout="27", sossa="14", mint="9", usine="4"), "+6 sur 7 jours", "up"),
   ("BAT validés du premier coup", KV(tout="87 %", sossa="93 %", mint="78 %", usine="75 %"), "+5 pts", "up"),
   ("Délai moyen", KV(tout="1,6 j", sossa="1,2 j", mint="2,1 j", usine="2,4 j"), "du brief au BAT", ""),
   ("Retouches demandées", KV(tout="4", sossa="1", mint="2", usine="1"), "sur 31 créations", ""),
   ("Déclinaisons", KV(tout="34", sossa="14", mint="20", usine="0"), "formats", ""),
   ("En attente de BAT", KV(tout="2", sossa="1", mint="0", usine="1"), "à valider", "warn")]})] + TDB["koffi"]
TDB["kouassi"] = [("kst", "Indicateurs commerciaux", ["zab", "zbk", "zko"], {"items": [
   ("Chiffre d'affaires", KV(tout="48,6 M F", zab="31,2 M F", zbk="9,8 M F", zko="7,6 M F"), "+11 % sur 7 jours", "up"),
   ("Commandes", KV(tout="312", zab="198", zbk="64", zko="50"), "+38 relances réussies", "up"),
   ("Boutiques actives", KV(tout="286", zab="171", zbk="62", zko="53"), "sur 340", ""),
   ("Panier moyen", KV(tout="156 000 F", zab="158 000 F", zbk="153 000 F", zko="152 000 F"), "stable", ""),
   ("Ruptures signalées", KV(tout="9", zab="4", zbk="3", zko="2"), "Sossa 200 g", "warn"),
   ("Nouveaux distributeurs", KV(tout="2", zab="0", zbk="0", zko="2"), "Korhogo, Ferkessédougou", "up")]}),
 ("count", "Commandes des boutiques", ["zab", "zbk", "zko"], {"v": (312, 1240, 3600), "unit": "commandes prises", "by": [("zab", 198), ("zbk", 64), ("zko", 50)], "fait": "Relance automatique des boutiques sans commande depuis 10 jours : 38 ont recommandé."}),
 ("list", "Comptes à relancer", ["zko", "zab"], {"items": [("Supermarché Prosuma, Korhogo", "Pas de commande depuis 14 jours", "zko"), ("Grossiste Adjamé Liberté", "Facture en attente", "zab")]}),
 ("funnel", "Prospects distributeurs", ["zko"], {"steps": [("Repérés", 40), ("Contactés", 22), ("Rendez-vous", 7), ("Signés", 2)], "fait": "Deux distributeurs signés à Korhogo et Ferkessédougou."}),
]
TDB_PART[0] = ("adjoua", "Fanta Bakayoko", "FB", "Lecture", "15/10/2026", "Recrutement de l'équipe commerciale et de la ligne")
WIDE = ("eng", "edcal", "posts", "rs", "kanban", "postes", "score", "camp2", "kst", "sources")
FULL = ("edcal", "kanban", "kst", "postes", "camp2")

# ---------- v4.16 encore plus de contenu métier
TDB["djeneba"].insert(4, ("mails", "Boîte mail de direction", ["usine", "sossa", "mint", "nord"], {"v": [("Reçus", "214"), ("Envoyés", "96"), ("Traités sans vous", "141"), ("Attendent votre réponse", "6")],
   "items": [("Banque Atlantique", "Conditions du prêt pour la ligne, réponse attendue avant jeudi", "usine", "À répondre"), ("Agence média", "Bilan de la première semaine de la promo Sossa", "sossa", "Résumé prêt"),
             ("Mairie de Yopougon", "Pièces manquantes pour le permis d'extension", "usine", "Brouillon prêt")]}))
TDB["djeneba"].insert(6, ("depl", "Déplacements et agenda du DG", ["usine", "nord"], {"items": [("Korhogo", "6 au 7 octobre", "Distributeurs du Nord", "Vols et hôtel réservés", "ok", "nord"),
   ("Yopougon", "Ven 3 octobre", "Mairie et visite du site", "Chauffeur prévu", "ok", "usine"), ("Paris", "20 au 23 octobre", "Salon SIAL", "Visa en cours", "mid", "usine")]}))
TDB["fatima"].insert(2, ("ads", "Publicité payante", ["sossa", "mint"], {"rows": [
   ("fb", "Facebook Ads", "620 000 F", "184 000", "2,4 %", "14 F", "246", "sossa"), ("ig", "Instagram Ads", "380 000 F", "121 000", "2,9 %", "11 F", "131", "sossa"),
   ("tt", "TikTok Ads", "200 000 F", "96 000", "1,8 %", "12 F", "35", "mint")]}))
TDB["fatima"].append(("news", "Newsletter", ["sossa", "mint", "usine"], {"v": [("Abonnés", "3 240"), ("Taux d'ouverture", "41 %"), ("Taux de clic", "6,8 %")],
   "items": [("Le goûter de la rentrée", "Envoyée le 29 sept, 1 330 ouvertures", "sossa"), ("Super Mint arrive", "Programmée le 8 oct", "mint")]}))
TDB["koffi"].insert(3, ("sites", "Sites et pages", ["mint", "usine"], {"items": [("Page Super Mint, édition limitée", "En ligne, 4 120 visites, 3,1 % de clics vers les boutiques", "Livré", "mint"),
   ("Page carrières de la nouvelle ligne", "En ligne, 1 860 visites, 62 candidatures", "Livré", "usine"), ("Refonte de la page Sossa", "Maquette en validation", "En cours", "sossa")]}))
TDB["koffi"].insert(4, ("lib", "Bibliothèque de la marque", ["sossa", "mint", "usine"], {"v": [("Visuels", "412"), ("Vidéos et animations", "38"), ("Logos et chartes", "16")],
   "items": [("Pack Sossa rentrée", "64 fichiers, tous formats", "sossa"), ("Kit Super Mint", "48 fichiers, dont 6 vidéos", "mint")]}))
TDB["koffi"][0][3]["items"].append(("Sites et pages livrés", KV(tout="2", sossa="0", mint="1", usine="1"), "1 en cours", ""))
TDB["koffi"][0][3]["items"].append(("Vidéos et animations", KV(tout="6", sossa="2", mint="4", usine="0"), "+2 sur 7 jours", "up"))
TDB["fatima"][0][3]["items"].extend([("Articles et newsletters", KV(tout="5", sossa="2", mint="1", usine="2"), "41 % d'ouverture", ""), ("Budget publicitaire", KV(tout="1,2 M F", sossa="1 M F", mint="200 000 F", usine="0 F"), "sur 1,8 M F", "")])
TDB["djeneba"][0][3]["items"].extend([("Emails traités", KV(tout="141", usine="62", sossa="38", mint="24", nord="17"), "sur 214 reçus", "up"), ("Sollicitations écartées", KV(tout="33", usine="14", sossa="9", mint="6", nord="4"), "sur 42", "")])
SUGG_W["koffi"] = ["Commandes chez l'imprimeur", "Pistes de nom", "Habillage des camions"]
FULL = FULL + ("ads",)
WIDE = WIDE + ("ads", "mails")

# ---------- v4.16 apprentissages, défis, blocages : le texte qui accompagne les chiffres
LEARN = {
 "djeneba": (["Les comités sont plus courts quand l'ordre du jour part la veille à 18 h.", "Serge répond plus vite sur Telegram que par email."],
             ["Trois engagements de la ligne de confiserie dépendent du même fournisseur."], ["Devis de la machine d'emballage bloqué depuis 6 jours."],
             "Proposer au DG un point fournisseur jeudi pour débloquer le devis."),
 "fatima": (["Les carrousels font deux fois plus d'engagement que les posts simples.", "Le meilleur créneau est le mardi entre 12 h et 13 h."],
            ["La portée TikTok monte mais convertit encore peu en contacts."], ["Photos des points de vente de Yopougon toujours attendues."],
            "Tester deux visuels Super Mint en publicité la semaine prochaine."),
 "koffi": (["Les BAT passent du premier coup quand le brief contient les prix.", "Les déclinaisons WhatsApp sont les plus réutilisées."],
           ["Le packaging Super Mint doit tenir en quatre couleurs."], ["Validation de la charte Super Mint en attente de Yao."],
           "Livrer la signalétique de la ligne avant le 10 octobre."),
 "adjoua": (["La cooptation donne le meilleur taux de recrutement.", "Les candidats de Korhogo préfèrent un entretien en visio."],
            ["Peu de candidatures pour le contrôleur de gestion."], ["Une offre de chef d'équipe attend la validation du salaire."],
            "Ouvrir la diffusion du poste de contrôleur à LinkedIn et aux écoles."),
 "kouassi": (["Les relances le lundi matin donnent le plus de commandes."], ["Ruptures de Sossa 200 g à Bouaké."], ["Deux factures du grossiste d'Adjamé impayées."],
             "Planifier une tournée à Bouaké avec la logistique."),
}
LEARN_PLUS = {
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
for _k, (_a, _d, _b, _n) in LEARN.items():
    TDB[_k].append(("learn", "Apprentissages, défis, blocages et prochaines étapes", sorted({p for w in TDB[_k] for p in w[2]})[:3], {"a": _a, "d": _d, "b": _b, "n": _n}))
WIDE = WIDE + ("learn",)

TDB["fatima"].insert(4, ("pie", "Posts par réseau", ["sossa", "mint", "usine"], {"unit": "posts", "parts": [("Facebook", 6, "#1877F2"), ("Instagram", 4, "#E1306C"), ("LinkedIn", 2, "#0A66C2"), ("TikTok", 2, "#17112B")]}))
TDB["koffi"].insert(2, ("bars", "Créations livrées par semaine", ["sossa", "mint", "usine"], {"items": [("S36", 14), ("S37", 19), ("S38", 22), ("S39", 21), ("S40", 27)], "note": "Semaine en cours : 27 créations, record du trimestre."}))
TDB["djeneba"].insert(3, ("pie", "Temps du DG par sujet", ["usine", "sossa", "mint", "nord"], {"unit": "h de réunion", "parts": [("Nouvelle ligne", 9, "#301667"), ("Promo Sossa", 4, "#8D68FA"), ("Super Mint", 3, "#C5C4FF"), ("Équipe Nord", 2, "#E4765A")]}))

def dots(v):
    return '<td><span class="dots" title="' + str(v) + ' sur 5">' + "".join('<i class="on"></i>' if j < v else "<i></i>" for j in range(5)) + '</span></td>'
def srci(dom):
    return f'<img class="rsi" src="{FAV}{dom}" alt="" style="width:18px;height:18px">' if dom else f'<span class="rsi0">{ic("users", "s")}</span>'

def wcard(k, t, titre, projs, d, wide=False):
    tags = "".join(ptag(p) for p in projs[:2]) + (f'<span class="ptag more">+{len(projs) - 2}</span>' if len(projs) > 2 else "")
    return (f'<article class="mw{" wide" if wide or t in WIDE else ""}{" full" if t in FULL else ""}" data-ps="{" ".join(projs)}" data-ty="{titre}"><header><span class="mwgrip" aria-hidden="true">{ic("grip-vertical", "s")}</span><h4>{titre}</h4>'
            f'<span class="mwac"><button class="ib mwe" aria-label="Modifier ce bloc" data-toast="{qui(k)["prenom"]} vous propose de modifier ce bloc : période, projets, mesure">{ic("pencil", "s")}</button>'
            f'<button class="ib mwh" aria-label="Masquer ce bloc dans les partages" title="Masquer dans les partages">{ic("eye", "s")}</button>'
            f'<button class="ib mwx" aria-label="Retirer ce bloc" data-toast="Bloc retiré de votre tableau de bord">{ic("x", "s")}</button></span></header>'
            f'{wbody(t, d)}<footer>{tags}<span class="mwhid">{ic("eye-off", "s")} Masqué dans les partages</span></footer></article>')

TB_TITRE = {"djeneba": "Pilotage de la direction", "fatima": "Marketing et contenu", "koffi": "Studio design"}
TB_FMTS = [("hash", "Chiffres clés"), ("chart-column", "Histogramme"), ("chart-bar", "Barres"), ("chart-pie", "Camembert"), ("chart-line", "Courbe"), ("chart-area", "Aires"), ("gauge", "Jauge"), ("target", "Objectif"), ("filter", "Entonnoir"), ("table", "Tableau"), ("kanban", "Kanban"), ("calendar", "Calendrier"), ("chart-gantt", "Planning"), ("map", "Carte"), ("align-left", "Texte"), ("list-checks", "Liste"), ("trophy", "Classement"), ("activity", "Fil d’activité")]
TB_ASK = {"djeneba": ["Quels engagements risquent de glisser ?", "Le temps du DG par projet", "Les courriers à signer cette semaine"],
          "fatima": ["Quel réseau rapporte le plus de contacts ?", "Les posts les plus vus du mois", "Le coût par contact de la publicité"],
          "koffi": ["Les créations en attente de validation", "Le délai moyen d'un BAT", "Les commandes chez l'imprimeur"],
          "adjoua": ["Quel est le meilleur canal de recrutement ?", "Le délai moyen par poste", "Les candidats en attente de réponse"],
          "kouassi": ["Les clients à relancer cette semaine", "Le chiffre d'affaires par zone", "Les ruptures de stock"]}
SIG_SPEC = {"djeneba": "spécialisée en direction et coordination", "fatima": "spécialisée en marketing et contenu", "koffi": "spécialisé en design et création",
            "adjoua": "spécialisée en recrutement", "kouassi": "spécialisé en ventes"}
def dl_menu(nom):
    return (f'<details class="dlm"><summary class="btn o sm">{ic("download", "s")} <span>Télécharger</span></summary><div class="dlml">'
            f'<a href="#" data-toast="Google Slides créé dans votre Drive : {nom}"><img src="{FAV}slides.google.com" alt=""><span><b>Google Slides</b><small>Modifiable, une page par bloc</small></span></a>'
            f'<a href="#" data-toast="PDF téléchargé : {nom}.pdf"><span class="pdfi">PDF</span><span><b>PDF</b><small>Prêt à imprimer ou à envoyer</small></span></a><p class="dlsig">Chaque export porte la signature Powered by Yelema en bas de page.</p></div></details>')
def tb_editbar(k):
    e = qui(k)
    fm = "".join(f'<label class="fmc"><input type="radio" name="fm2-{k}"{" checked" if n == 0 else ""}>{ic(i_, "s")} {l}</label>' for n, (i_, l) in enumerate(TB_FMTS))
    sg_ = "".join(f'<span data-sw="{x}">{ic("sparkles", "s")} {x}</span>' for x in TB_ASK.get(k, SUGG_W.get(k, [])))
    return (f'<div class="tbedit"><div class="tbeh"><span class="ic">{ic("pencil", "s")}</span><div class="grow"><b>Vous modifiez ce tableau</b><span>Glissez les blocs pour les déplacer, masquez-les dans les partages ou retirez-les. Pour en ajouter un, demandez-le à {e["prenom"]}.</span></div>'
            f'<a class="btn p sm tbdone" href="#">{ic("check", "s")} Terminer</a></div>'
            f'<form class="tbask" data-k="{k}"><img src="{B}{e["photo"]}" alt=""><textarea rows="2" placeholder="Que voulez-vous voir ? Par exemple : {TB_ASK.get(k, ["les chiffres de la semaine"])[0].lower()}" aria-label="Décrivez le bloc à ajouter"></textarea><button class="btn p sm" type="submit">{ic("sparkles", "s")} Créer le bloc</button></form>'
            f'<div class="mws">{sg_}</div><p class="tbfl">Format du bloc</p><div class="fmts sm">{fm}</div></div>')

def tdb_agent(k, part=None, titre=None):
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
    sig = (f'<a class="tbsig" href="https://leslita06.github.io/yelema-site-preview/" target="_blank" rel="noopener"><span>Tableau préparé par {e["prenom"]}, Expert IA Yelema {SIG_SPEC.get(k, "")}</span>'
           f'<span class="pby2">Powered by <img src="../img/yelema_logo_final_long.svg" alt="Yelema"></span></a>')
    return f'{head}{bar}{filtres(k)}<section class="mwg2">{ws}</section>{sig}'

def page_tdb(brand):
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
    corps = f"""<div class="hello"><div class="grow"><p class="date">Semaine du 28 septembre</p><h1>Tableaux de bord</h1></div><button class="btn o tbswitch" type="button" aria-expanded="false">{ic("layout-list", "s")} Tous les tableaux <b class="num">{len(MINE) + len(TDB_PART)}</b>{ic("chevron-down", "s")}</button><a class="btn g" href="#" data-open="newtdb">{ic("plus", "s")} Créer un tableau</a></div>
<div data-tabs class="tbx">{rail}<div class="tbmain">{par}</div></div>"""
    xs = "".join(f'<label class="nx"><input type="radio" name="nxe"{" checked" if k == "djeneba" else ""}><img src="{B}{qui(k)["photo"]}" alt=""><b>{qui(k)["prenom"]}</b><small>{qui(k)["role"]}</small></label>' for k in ("djeneba", "fatima", "koffi"))
    pj = "".join(f'<option>{n}</option>' for _, n in list(PROJ.values())[:4])
    corps += f"""<div class="modal" id="newtdb"><div class="ov" data-close></div><div class="pn shpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Créer un tableau</h2><p class="sm mute">L’expert le construit à partir de son travail, vous l’ajustez ensuite.</p>
<h3 class="shh">Avec quel expert</h3><div class="nxs">{xs}</div>
<h3 class="shh">De quoi doit-il parler</h3><textarea class="fi fta" style="width:100%" placeholder="Par exemple : l’avancement de la nouvelle ligne, avec les engagements, les rendez-vous et les blocages"></textarea>
<div class="g2i" style="margin-top:10px"><label class="fl2"><span>Projet</span><select class="fi" style="width:100%"><option>Tous les projets</option>{pj}</select></label><label class="fl2"><span>Période</span><select class="fi" style="width:100%"><option>Cette semaine</option><option>Ce mois-ci</option><option>Ce trimestre</option></select></label></div>
<h3 class="shh">Formats préférés</h3><div class="fmts">{"".join(f'<label class="fmc"><input type="checkbox"{" checked" if n < 3 else ""}>{ic(i_, "s")} {l}</label>' for n, (i_, l) in enumerate(TB_FMTS))}</div>
<h3 class="shh">Le recevoir aussi en</h3><div class="fmts">{f'<label class="fmc"><input type="checkbox" checked><img src="{FAV}slides.google.com" alt="" style="width:16px;height:16px"> Google Slides</label><label class="fmc"><input type="checkbox">{ic("file-text", "s")} PDF</label>'}</div><p class="xs mute3" style="margin-top:6px">Mis à jour à chaque nouvelle version du tableau, dans votre Drive.</p>
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:16px"><a class="btn o" href="#" data-close>Annuler</a><a class="btn p" href="#" data-close data-toast="Tableau en cours de création, il arrive dans Mes tableaux dans quelques minutes">{ic("sparkles", "s")} Générer le tableau</a></div></div></div>"""
    return page("tableau-de-bord", brand, "Tableau de bord", "<b>Tableau de bord</b>", corps, dock=True)


# ---------------------------------------------------------------- espace d'un expert
def x_profil(k):
    return x_profil2(k)

def x_profil2(k):
    e, p = EXPERTS[k], PRO[k]
    dj = k == "djeneba"
    pen = f'<button class="pen" data-open="pz" aria-label="Changer son visage">{ic("pencil", "s")}</button>' if dj else ""
    gens = [("AD", "Aïcha Diabaté", "Responsable")] + ([("NT", "Nadège Touré", "Binôme")] if k == "fatima" else []) + ([("YK", "Yao Kra", "Binôme")] if k == "koffi" else []) + ([("JA", "Jean-Marc Aka", "Direction"), ("SB", "Serge Bamba", "Direction")] if dj else [])
    team = "".join(f'<div class="tm2">{face(i, "", 40)}<span><b>{n}</b><small>{r}</small></span></div>' for i, n, r in gens)
    voix = "".join(f'<span class="vx{" on" if j == 0 else ""}" data-g="{g}"><button class="pl" aria-label="Écouter la voix {n.lower()} {g}">{ic("play", "s")}</button><span><b>{n}</b><small>Voix {g}</small></span></span>' for j, (n, g) in enumerate([("Chaleureuse", "féminine"), ("Posée", "féminine"), ("Énergique", "féminine"), ("Chaleureuse", "masculine"), ("Posée", "masculine"), ("Énergique", "masculine")]))
    voix = '<div class="seg vxf"><a class="on" data-vg="">Toutes</a><a data-vg="féminine">Féminines</a><a data-vg="masculine">Masculines</a></div>' + f'<div class="vxs">{voix}</div>' 
    acct = "".join(f'<div class="ac2"><img src="{FAV}{dd}" alt=""><span class="grow"><b>{n}</b><small>{v}</small></span><span class="sti on">{ic("circle-check")}</span></div>' for n, dd, v in
                   [("Boîte mail", "gmail.com", p["mail"]), ("Agenda", "calendar.google.com", "Agenda de l’entreprise"), ("Drive", "drive.google.com", "Drive de l’entreprise, dossier " + e["prenom"]), ("Telegram", "telegram.org", "Sujet « " + e["prenom"] + " »")])
    nom = (f'<div class="nmf2"><input class="fi pfn" value="{e["prenom"]}" aria-label="Prénom de votre Chief of Staff"><button class="btn sm pfsave">{ic("check", "s")} Enregistrer</button></div>' if dj
           else f'<span class="inp2">{e["prenom"]}</span>')
    note = '<p class="xs mute3">Seule votre Chief of Staff se renomme : prénom et visage à votre goût.</p>' if dj else '<p class="xs mute3">Le prénom et le visage des experts sont fixes. Seule votre Chief of Staff se personnalise.</p>'
    return f"""<div class="pf"><div class="pfh"><div class="pfav"><img src="{B}{e['photo']}" alt="">{pen}</div>
<div class="grow"><span class="meta">Dans l'équipe depuis {p['depuis']}, Abidjan</span><h1>{e['prenom']}</h1><div class="mute">{e['role']}</div>{note}</div></div>
<div class="pfg"><div class="box"><h3 class="bt">{ic("id-card", "s")} Identité</h3><div class="kv2"><span>Prénom</span>{nom}</div><div class="kv2"><span>Langue</span><select class="fi" aria-label="Langue"><option>Français</option><option>English</option><option>Français et English</option></select></div></div>
<div class="box"><h3 class="bt">{ic("audio-lines", "s")} Sa voix</h3><p class="xs mute3" style="margin-bottom:10px">Pour les appels et les messages vocaux. Touchez pour écouter, choisissez pour changer.</p>{voix}</div></div>
<div class="pfvx pfrep" style="margin-top:14px"><div class="box"><h3 class="bt">{ic("message-square-text", "s")} Sa façon de répondre</h3>
<div class="rpg"><div class="kv2"><span>Ton</span><div class="seg pft" data-pk="ton"><a class="on" data-v="v">Vouvoiement</a><a data-v="t">Tutoiement</a></div></div>
<div class="kv2"><span>Longueur</span><div class="seg" data-pk="len"><a data-v="c">Courtes</a><a class="on" data-v="e">Équilibrées</a><a data-v="d">Détaillées</a></div></div>
<div class="kv2"><span>Style</span><div class="seg" data-pk="sty"><a class="on" data-v="p">Points clés</a><a data-v="g">Paragraphes</a><a data-v="t">Tableaux</a></div></div>
<div class="kv2"><span>Registre</span><div class="seg" data-pk="reg"><a class="on" data-v="p">Professionnel</a><a data-v="c">Chaleureux</a><a data-v="d">Direct</a></div></div>
<div class="kv2"><span>Emojis</span><div class="seg" data-pk="emo"><a class="on" data-v="0">Jamais</a><a data-v="1">Parfois</a><a data-v="2">Souvent</a></div></div>
</div><div class="pfap"><span class="xs mute3">Aperçu de la réponse</span><div class="pfapx"></div></div></div></div>
<div class="box" style="margin-top:14px"><div class="row" style="justify-content:space-between"><h3 class="bt" style="margin:0">{ic("users", "s")} L'équipe qui travaille avec {e['prenom']}</h3><a class="btn o sm" href="#" data-open="inv">{ic("user-plus", "s")} Ajouter</a></div><div class="tms">{team}</div></div>
<div class="pfg" style="margin-top:14px"><div class="box"><h3 class="bt">{ic("brain", "s")} Sa mémoire de l’entreprise</h3><div class="mem3"><div><b class="num">128</b><span>choses apprises</span></div><div><b class="num">312</b><span>documents lus</span></div><div><b class="num">ce matin</b><span>dernière mise à jour</span></div></div>
<p class="sm" style="margin-top:10px">Elle retient vos préférences, vos marques, vos clients et vos décisions. Vous pouvez corriger ou effacer ce qu'elle sait.</p><a class="btn o sm" href="#" data-toast="Ouverture de la mémoire" style="margin-top:10px">{ic("eye", "s")} Voir ce qu'elle sait</a></div>
<div class="box"><h3 class="bt">{ic("briefcase", "s")} Son compte de travail</h3><p class="xs mute3" style="margin-bottom:8px">Le compte avec lequel {e['prenom']} écrit, range et reçoit.</p>{acct}</div></div>
<div class="adv" style="margin-top:14px"><div><span class="ic">{ic("pause", "s")}</span><div class="grow"><b>Mettre en pause</b><span>{e['prenom']} arrête de travailler, rien n'est perdu</span></div><a class="btn o sm" href="#" data-toast="{e['prenom']} est en pause">Pause</a></div>
<div class="danger"><span class="ic">{ic("user-minus", "s")}</span><div class="grow"><b>Retirer de l'équipe</b><span>Plus facturé dès le mois suivant</span></div><a class="btn sm" href="#" data-toast="Demande envoyée à l'administration">Retirer</a></div></div></div>"""

def x_profil_ancien(k):
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
<div class="h2x"><h2>Compétences et routines</h2><a class="btn o sm" href="#" data-go="fiche">{ic("id-card", "s")} Voir sa fiche de poste</a></div>
<div class="h2x"><h2>Équipe</h2></div><div class="row" style="gap:22px;flex-wrap:wrap">{team}<a class="btn o sm" href="#">{ic("user-plus", "s")} Ajouter un responsable</a></div>
<div class="h2x"><h2>Réglages avancés</h2></div>
<div class="adv"><div><span class="ic">{ic("brain", "s")}</span><div class="grow"><b>Mémoire</b><span>Ce que {e['prenom']} a appris sur Unifood et garde en tête</span></div><a class="btn o sm" href="#">Gérer</a></div>
<div><span class="ic">{ic("briefcase", "s")}</span><div class="grow"><b>Compte de travail Unifood</b><span>Le compte avec lequel {e['prenom']} écrit, range et reçoit</span><div class="dots"><span>Mail : {p['mail']}</span><span>Agenda</span><span>Drive de l’entreprise</span><span>WhatsApp</span></div></div></div>
<div><span class="ic">{ic("pause", "s")}</span><div class="grow"><b>Mettre en pause</b><span>{e['prenom']} arrête de travailler, rien n'est perdu</span></div><a class="btn o sm" href="#">Pause</a></div>
<div class="danger"><span class="ic">{ic("user-minus", "s")}</span><div class="grow"><b>Retirer de l'équipe</b><span>Plus facturé dès le mois suivant</span></div><a class="btn sm" href="#">Retirer</a></div></div>"""

def cx(n, d, on):
    st = f'<span class="st on sti" title="Connecté" aria-label="Connecté">{ic("circle-check")}</span>' if on else f'<a class="btn o sm st" href="#" data-open="cz" data-app="{n}">Connecter</a>'
    return f'<div class="cx"><img src="{FAV}{d}" alt=""><span>{n}</span>{st}</div>'

CX2 = [("Gmail", "gmail.com", "Lire, trier et envoyer des emails", "Communication", True), ("Google Drive", "drive.google.com", "Ranger et retrouver les fichiers", "Documents", True),
       ("Google Agenda", "calendar.google.com", "Prendre et déplacer des rendez-vous", "Communication", True), ("Canva", "canva.com", "Créer et exporter des visuels", "Marketing et ventes", True),
       ("Meta Business", "facebook.com", "Publier sur Facebook et Instagram", "Réseaux sociaux", True), ("Slack", "slack.com", "Écrire dans vos canaux", "Communication", True),
       ("Microsoft Teams", "teams.microsoft.com", "Réunions et messages d'équipe", "Communication", True), ("Outlook", "outlook.com", "Emails Microsoft 365", "Communication", False),
       ("LinkedIn", "linkedin.com", "Publier et suivre la page", "Réseaux sociaux", False), ("Notion", "notion.so", "Lire et mettre à jour vos pages", "Documents", False),
       ("HubSpot", "hubspot.com", "Contacts, affaires et relances", "Marketing et ventes", False), ("Google Sheets", "sheets.google.com", "Tableaux et suivis", "Données", False),
       ("Airtable", "airtable.com", "Bases de données d'équipe", "Données", False), ("Sage", "sage.com", "Comptabilité", "Finance", False),
       ("QuickBooks", "quickbooks.intuit.com", "Factures et dépenses", "Finance", False), ("Calendly", "calendly.com", "Prise de rendez-vous", "Communication", False),
       ("Zoom", "zoom.us", "Réunions vidéo", "Communication", False), ("Dropbox", "dropbox.com", "Fichiers partagés", "Documents", False),
       ("Trello", "trello.com", "Tableaux de projets", "Documents", False), ("Odoo", "odoo.com", "Gestion commerciale", "Finance", False)]

def x_connect2(k):
    e = EXPERTS[k]
    tiles = "".join(f'<div class="cz2" data-cat="{c}" data-q="{n.lower()} {d.lower()}"><div class="row" style="justify-content:space-between"><img src="{FAV}{dom}" alt=""><span class="cst{" on" if on else ""}">{ic("circle-check", "s") + " Connecté" if on else ""}</span></div>'
                    f'<b>{n}</b><span>{d}</span><div class="row" style="justify-content:space-between;margin-top:auto"><span class="xs mute3">{c}</span>'
                    + (f'<a class="btn o sm" href="#" data-toast="{n} : réglages ouverts">Gérer</a>' if on else f'<a class="btn k sm" href="#" data-open="cz" data-app="{n}">Connecter</a>') + '</div></div>'
                    for n, dom, d, c, on in CX2)
    cats = "".join(f'<span class="chip{" on" if c == "Tous" else ""}" data-cc="{"" if c == "Tous" else c}">{c}</span>' for c in ("Tous", "Communication", "Marketing et ventes", "Documents", "Données", "Finance", "Réseaux sociaux"))
    nb = sum(1 for x in CX2 if x[4])
    return f"""<div class="czw" data-ct><div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:10px"><div class="ctabs cts"><span class="on" data-c="cz-a">{ic("layout-grid", "s")} Connecteurs</span><span data-c="cz-c">{ic("code-xml", "s")} API et MCP</span></div>
<span class="composio">{ic("plug-zap", "s")} Fournis par Composio, plus de 3 000 outils</span></div>
<div class="czp on" id="cz-a"><div class="cfil"><label class="srch czs">{ic("search", "s")}<input type="search" placeholder="Chercher un outil" aria-label="Chercher un outil"></label>{cats}</div>
<p class="sm mute" style="margin:4px 0 10px">{nb} outils connectés pour {e['prenom']}</p><div class="cz2g">{tiles}</div></div>
<div class="czp" id="cz-c"><div class="pfg"><div class="box"><h3 class="bt">{ic("key-round", "s")} Clé d'API</h3><p class="sm mute">Pour qu'un de vos logiciels confie un travail à {e['prenom']}.</p><div class="lnk" style="margin-top:10px"><span class="ell num">yl_live_••••••••••••7Hk2</span><a class="btn o sm" href="#" data-toast="Clé copiée">{ic("copy", "s")} Copier</a></div><a class="btn o sm" href="#" data-toast="Nouvelle clé créée" style="margin-top:10px">{ic("plus", "s")} Nouvelle clé</a></div>
<div class="box"><h3 class="bt">{ic("server", "s")} Serveur MCP</h3><p class="sm mute">Branchez un serveur MCP : ses outils deviennent disponibles pour {e['prenom']}.</p><span class="inp3" style="margin-top:10px;display:block">https://mcp.votre-outil.com</span><a class="btn p sm" href="#" data-toast="Serveur MCP ajouté, 6 outils trouvés" style="margin-top:10px">Ajouter le serveur</a></div></div></div></div>"""

def x_connect(k):
    return x_connect2(k)

def x_connect_ancien(k):
    e, p = EXPERTS[k], PRO[k]
    lst = CONNECT[:3] + (CONNECT_FAT if k == "fatima" else []) + CONNECT[3:]
    ess = "".join(cx(n, d, on) for n, d, on in lst)
    more = "".join(cx(n, d, False) for n, d in MORE)
    cats = "".join(f'<span class="chip{" on" if c == "Tous" else ""}">{c}</span>' for c in ("Tous", "Communication", "Marketing et ventes", "Documents", "Données", "Finance", "Réseaux sociaux", "RH"))
    return f"""<div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:10px"><div class="ctabs"><span class="on">{ic("layout-grid", "s")} Connecteurs</span><span>{ic("wrench", "s")} Sur mesure</span><span>{ic("code-xml", "s")} API et MCP</span><span>{ic("monitor", "s")} Ordinateur</span></div>
<span class="composio">{ic("plug-zap", "s")} Connecteurs fournis par Composio</span></div>
<div class="gbox acct"><span class="lg"><img src="{B}{CLIENT['logo']}" alt=""></span><div class="grow"><b>Compte de travail Unifood</b><div class="sm mute">Le compte avec lequel {e['prenom']} écrit, range et reçoit.</div><div class="dots"><span>Mail : {p['mail']}</span><span>Agenda de l’entreprise</span><span>Drive de l’entreprise</span><span>Messagerie : Ping</span></div></div><a class="btn o sm" href="#">Ouvrir</a></div>
<div class="cfil"><span class="srch">{ic("search", "s")} Chercher un connecteur</span>{cats}</div>
<div class="h2x"><h2>Essentiels <span class="sm">{len(lst)}</span></h2></div><div class="cgrid">{ess}</div>
<div class="h2x"><h2>Plus de connecteurs <span class="sm">plus de 3 000</span></h2></div><div class="cgrid">{more}</div>"""

def x_secu(k):
    fw = [("users", "#5B5BD6", "Destinataires", "L’entreprise seulement", False), ("mail", "#E5677D", "Email", "Sans restriction", False),
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

FMT = {"Vidéo": ("vid", "clapperboard"), "PDF": ("pdf", "file-text"), "Excel": ("xls", "sheet"), "Word": ("doc", "file-text"), "PowerPoint": ("ppt", "presentation"), "PNG": ("img", "image"), "ZIP": ("zip", "folder-archive"),
       "Google Doc": ("doc", "file-text"), "Google Sheets": ("xls", "sheet"), "Canva": ("img", "palette"), "Figma": ("img", "pen-tool")}
EXT = {"PDF": "pdf", "Excel": "xlsx", "Word": "docx", "PowerPoint": "pptx", "PNG": "png", "ZIP": "zip"}
LIEN = {"Google Doc": "https://docs.google.com/", "Google Sheets": "https://sheets.google.com/", "Canva": "https://www.canva.com/", "Figma": "https://www.figma.com/"}
def fmt_btn(f, titre):
    c, i = FMT[f]
    if f in LIEN:
        return f'<a class="fmt {c} lk" href="{LIEN[f]}" target="_blank" rel="noopener" title="Ouvrir dans {f}">{ic(i, "s")} {f} {ic("arrow-up-right", "s")}</a>'
    return f'<a class="fmt {c}" href="#" data-toast="Téléchargement : {titre}.{EXT[f]}" title="Télécharger en {f}">{ic(i, "s")} {f} {ic("download", "s")}</a>'

# formats réels de chaque livrable : fichier téléchargeable ou lien
LIVX = {"Sossa, post Facebook de la promo rentrée": ["PNG", "Canva"], "Packaging édition limitée, maquette 3D": ["PDF", "PNG", "Figma"],
        "Note au comité de direction du 2 octobre": ["Google Doc", "PDF"], "Super Mint, calendrier éditorial d'octobre": ["Google Sheets", "Excel"],
        "Sossa, scénario du film de 30 secondes": ["Google Doc", "PDF"], "Rapport des réseaux sociaux de septembre": ["PowerPoint", "PDF"],
        "Super Mint, 6 visuels Instagram": ["ZIP", "Canva"], "Charte Super Mint, planche couleurs": ["PDF"], "Point de la semaine, lundi 28": ["Google Doc"]}

# Drive : (type, nom, date, format, vignette)
DRIVE2 = {
    "djeneba": [("doc", "Note au comité, 2 octobre", "il y a 2 h", "Google Doc", ""), ("sheet", "Tableau de bord, données", "ce matin", "Google Sheets", ""),
                ("doc", "Points du jour, septembre", "22 fichiers", "Dossier", ""), ("pdf", "Ordre du jour du comité", "hier", "PDF", ""),
                ("sheet", "Suivi des décisions", "hier", "Excel", ""), ("doc", "Compte rendu du point DG", "lundi", "Google Doc", ""),
                ("ppt", "Pack du comité de direction", "vendredi", "PowerPoint", ""), ("pdf", "Relevé de décisions, septembre", "il y a 2 semaines", "PDF", ""), ("vid", "Enregistrement du point DG", "il y a 3 semaines", "Vidéo", "")],
    "fatima": [("img", "Sossa promo rentrée", "il y a 1 h", "PNG", "flyer-sossa.jpg"), ("sheet", "Calendrier éditorial octobre", "hier", "Google Sheets", ""),
               ("doc", "Rapport réseaux septembre", "ce matin", "PowerPoint", ""), ("img", "Super Mint, stories", "mardi", "PNG", "flyer-supermint.jpg"),
               ("doc", "Brief fin d'année", "mardi", "Google Doc", ""), ("sheet", "Veille concurrence", "chaque soir", "Excel", ""),
               ("vid", "Vidéo recette Super Mint", "mercredi", "Vidéo", "flyer-supermint.jpg"), ("ppt", "Bilan campagne Sossa", "il y a 2 semaines", "PowerPoint", ""), ("img", "Story jeu concours", "il y a 3 semaines", "PNG", "flyer-sossa.jpg")],
    "koffi": [("img", "Packaging édition limitée v2", "ce matin", "PDF", "flyer-supermint.jpg"), ("img", "Super Mint, 6 visuels", "mardi", "PNG", "flyer-supermint.jpg"),
              ("img", "Affiche point de vente Sossa", "en cours", "PNG", "flyer-sossa.jpg"), ("pdf", "Charte Super Mint", "28/09", "PDF", ""),
              ("vid", "Animation logo Super Mint", "lundi", "Vidéo", "flyer-supermint.jpg"), ("ppt", "Présentation du packaging", "il y a 2 semaines", "PowerPoint", ""), ("img", "Kakémono salon", "il y a 3 semaines", "PNG", "flyer-sossa.jpg")],
}

def x_drive(k):
    e = EXPERTS[k]
    fl = ""
    for t, n, d, f, th in DRIVE2[k]:
        if th:
            v = f'<div class="dvt im"><img src="{B}{th}" alt="" loading="lazy"></div>'
        elif t == "sheet":
            v = '<div class="dvt sh">' + "".join("<i></i>" for _ in range(24)) + '</div>'
        else:
            v = '<div class="dvt dc"><b></b>' + "".join(f'<i style="width:{w}%"></i>' for w in (92, 80, 88, 64, 84, 50)) + '</div>'
        c, i_ = FMT.get(f, ("dir", "folder"))
        if f == "Dossier":
            act = f'<a class="ib dva" href="#" data-toast="Dossier ouvert" aria-label="Ouvrir le dossier">{ic("folder-open", "s")}</a>'
        elif f in LIEN:
            act = f'<a class="ib dva" href="{LIEN[f]}" target="_blank" rel="noopener" aria-label="Ouvrir dans {f}">{ic("arrow-up-right", "s")}</a>'
        else:
            act = f'<a class="ib dva" href="#" data-toast="Téléchargement : {n}.{EXT.get(f, "pdf")}" aria-label="Télécharger">{ic("download", "s")}</a>'
        age = "mois" if ("semaines" in d or "/" in d) else "sem"
        fl += (f'<article class="dvf" data-dt="{t}" data-age="{age}">{v}<div class="dvm"><span class="fmt {c} sm2">{ic(i_, "s")} {f}</span>'
               f'<b class="ell">{n}</b><span class="xs mute3">{d}</span></div>{act}</article>')
    ch = "".join(f'<span class="chip{" on" if v == "" else ""}" data-dv="{v}">{l}</span>' for v, l in [("", "Tout"), ("img", "Visuels"), ("vid", "Vidéos"), ("doc", "Documents"), ("ppt", "Présentations"), ("sheet", "Tableurs"), ("pdf", "PDF")])
    ch = f'<label class="srch tdq">{ic("search", "s")}<input type="search" placeholder="Chercher un fichier" aria-label="Chercher un fichier" data-flt></label><select class="fi dvage" aria-label="Date"><option value="">Toutes les dates</option><option value="sem">Cette semaine</option><option value="mois">Ce mois-ci</option></select>' + ch
    return f"""<div class="ws-h"><div class="grow"><h2>Drive de {e['prenom']}</h2><span class="xs mute3">{ic("refresh-cw", "s")} Synchronisé avec le Google Drive de l’entreprise</span></div>
<a class="btn o sm" href="https://drive.google.com/" target="_blank" rel="noopener">Ouvrir Google Drive {ic("arrow-up-right", "s")}</a></div>
<div class="chips dvc" data-dvc>{ch}</div><div class="dvg">{fl}</div><p class="dvempty" hidden>Aucun fichier pour ce filtre.</p>"""

MAILX = {
    "fatima": ["Bonjour Fatima, voici notre devis pour 500 affiches A2 en quadrichromie : livraison sous 4 jours ouvrés après validation du BAT.",
               "Bonjour Nadège, pouvez-vous m'envoyer les photos du point de vente de Yopougon d'ici vendredi ? Elles servent au post de la semaine prochaine.",
               "Fatima, je t'envoie le brief de la campagne de fin d'année : deux marques, Sossa et Super Mint, un budget média à proposer."],
    "koffi": ["Bonjour Koffi, le carton accepte quatre couleurs au maximum, et le rouge doit rester en ton direct.", "Fatima, les six visuels Super Mint sont dans le Drive, prêts pour la planification."],
    "djeneba": ["Bonjour Djénéba, voici l'ordre du jour du comité de demain : ventes Sossa, recrutement Nord, budget de fin d'année.", "Point DG à 15 h avec Aïcha Diabaté, salle du 3e étage."],
}
def x_mail(k):
    e, p = EXPERTS[k], PRO[k]
    lst = rd = ""
    autres = iter(MAILX[k])
    for i, (icn, t, w, h, can, body) in enumerate([m for m in INBOX[k] if m[4] not in ("Appel", "Agenda")]):
        body = body or next(autres, "")
        qui = w.split(" ", 1)[1] if " " in w else w
        ini = "".join(x[0] for x in qui.replace("l'", "").split()[:2]).upper()
        sens = "Envoyé" if icn == "arrow-up-right" else "Reçu"
        lst += (f'<a href="#" class="mi{" on" if i == 0 else ""}" data-mi="{i}" data-box="{"env" if sens == "Envoyé" else "rec"}"><span class="mav">{ini}</span><span class="grow"><span class="mrow"><b class="ell">{qui}</b><time>{h}</time></span>'
                f'<span class="ms ell">{t}</span><span class="mp ell">{body}</span></span></a>')
        rd += (f'<div class="mrd{" on" if i == 0 else ""}" data-mr="{i}"><span class="xs mute3">{sens}, {w}, {h}</span><h3>{t}</h3><p>{body}</p>'
               f'<div class="row" style="gap:8px;margin-top:auto"><a class="btn o sm" href="#" data-open="mcomp" data-re="Re : {t}">{ic("reply", "s")} Répondre</a><a class="btn o sm" href="#" data-open="mcomp" data-re="Tr : {t}">{ic("forward", "s")} Transférer</a></div></div>')
    return f"""<div class="ws-h"><div class="grow"><h2>Mail</h2><span class="xs mute3">{ic("at-sign", "s")} {p['mail']}</span></div>
<a class="btn p sm" href="#" data-open="mcomp" data-re="">{ic("pen-line", "s")} Écrire</a></div>
<div class="mlbar"><label class="srch tdq">{ic("search", "s")}<input type="search" placeholder="Chercher un email" aria-label="Chercher un email" data-flt></label><div class="seg mlbox"><a class="on" data-box="">Tous</a><a data-box="rec">Reçus</a><a data-box="env">Envoyés</a><a data-box="brou">Brouillons</a></div></div>
<div class="ml2"><div class="mlst">{lst}<p class="mlempty" hidden>Aucun email ici.</p></div><div class="mrds">{rd}</div></div>"""


def modal_mail(k):
    e, p = EXPERTS[k], PRO[k]
    return f"""<div class="modal" id="mcomp"><div class="ov" data-close></div><div class="pn shpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Nouvel email</h2><p class="sm mute">Envoyé depuis {p['mail']}</p>
<label class="fl2"><span>À</span><input class="fi" type="email" placeholder="nom@entreprise.com" style="width:100%"></label>
<label class="fl2"><span>Objet</span><input class="fi mcsub" style="width:100%"></label>
<label class="fl2"><span>Message</span><textarea class="fi fta" rows="6" style="width:100%" placeholder="Écrivez, ou demandez à {e['prenom']} de rédiger"></textarea></label>
<div class="row" style="justify-content:space-between;gap:8px;margin-top:12px;flex-wrap:wrap"><a class="btn o sm" href="#" data-toast="{e['prenom']} rédige une proposition">{ic("sparkles", "s")} Faire rédiger par {e['prenom']}</a><span class="row" style="gap:8px"><a class="btn o" href="#" data-close data-toast="Brouillon enregistré">Brouillon</a><a class="btn p" href="#" data-close data-toast="Email envoyé">{ic("send", "s")} Envoyer</a></span></div></div></div>"""

def modal_meet(k):
    ppl = "".join(f'<label class="fmc"><input type="checkbox"{" checked" if i == "AD" else ""}>{face(i, "", 20)} {n}</label>' for i, n in [("AD", "Aïcha"), ("JA", "Jean-Marc"), ("SB", "Serge"), ("FB", "Fanta"), ("NT", "Nadège")])
    lieu = "".join(f'<label class="fmc"><input type="radio" name="ml-{k}"{" checked" if n == 0 else ""}>{ic(i_, "s")} {l}</label>' for n, (i_, l) in enumerate([("video", "Google Meet"), ("video", "Teams"), ("video", "Zoom"), ("map-pin", "Sur place")]))
    return f"""<div class="modal" id="meet"><div class="ov" data-close></div><div class="pn shpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Nouvelle réunion</h2><p class="sm mute">{EXPERTS[k]['prenom']} envoie les invitations et prépare le brief.</p>
<label class="fl2"><span>Titre</span><input class="fi" placeholder="Point sur la nouvelle ligne" style="width:100%"></label>
<div class="g2i"><label class="fl2"><span>Date</span><input class="fi" type="date" value="2026-10-02"></label><label class="fl2"><span>Heure</span><input class="fi" type="time" value="10:00"></label></div>
<label class="fl2"><span>Durée</span><select class="fi"><option>30 minutes</option><option selected>1 heure</option><option>1 h 30</option><option>2 heures</option></select></label>
<div class="fl2"><span>Participants</span><div class="fmts">{ppl}</div></div>
<div class="fl2"><span>Lieu</span><div class="fmts">{lieu}</div></div>
<label class="mdc" style="margin-top:6px"><input type="checkbox" checked> {EXPERTS[k]['prenom']} prépare le brief et prend les notes</label>
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px"><a class="btn o" href="#" data-close>Annuler</a><a class="btn p" href="#" data-close data-toast="Réunion créée, invitations envoyées">{ic("calendar-plus", "s")} Créer la réunion</a></div></div></div>"""

def x_cal(k):
    days = [("lun.", 28), ("mar.", 29), ("mer.", 30), ("auj.", 1), ("ven.", 2), ("sam.", 3), ("dim.", 4)]
    H0, H1, SL = 8, 18, 52
    head = '<div class="dh" style="border-left:0"></div>' + "".join(f'<div class="dh{" tdy" if n == 1 else ""}">{d}<b>{n}</b></div>' for d, n in days)
    hours = "".join(f'<div class="hr">{h:02d} h</div>' for h in range(H0, H1))
    cols = ""
    for j in range(7):
        evs = "".join(f'<div class="ev {c}" style="top:{(h - H0) * SL + 2:.0f}px;height:{max(d * SL - 4, 22):.0f}px"><b>{t}</b>{f"<span>{s}</span>" if s and d >= .8 else ""}</div>'
                      for jj, h, d, t, s, c in CAL[k] if jj == j)
        now = f'<div class="now" style="top:{(13.6 - H0) * SL:.0f}px"></div>' if j == 3 else ""
        cols += f'<div class="col">{"".join("<div class=sl></div>" for _ in range(H1 - H0))}{evs}{now}</div>'
    hh = lambda h: f"{int(h):02d} h {int(round((h % 1) * 60)):02d}".replace(" h 00", " h")
    ag = ""
    for j, (dn, n) in enumerate(days):
        evs = sorted([x for x in CAL[k] if x[0] == j], key=lambda x: x[1])
        if not evs:
            continue
        ag += f'<div class="agd{" tdy" if n == 1 else ""}"><span class="agn">{dn}<b>{n}</b></span><div class="grow">' + "".join(
            f'<div class="age {c}"><time>{hh(h)}</time><b>{t}</b>{f"<span>{s}</span>" if s else ""}</div>' for _, h, d, t, s, c in evs) + '</div></div>'
    return f"""<div class="ws-h"><div class="grow"><h2>Calendrier</h2><span class="xs mute3">Semaine du 28 septembre au 4 octobre</span></div>
<div class="row" style="gap:6px"><a class="btn p sm" href="#" data-open="meet">{ic("plus", "s")} Nouvelle réunion</a><a class="ib cnv" href="#" data-toast="Semaine précédente" aria-label="Semaine précédente">{ic("chevron-left", "s")}</a><a class="btn o sm" href="#" data-toast="Retour à aujourd'hui">Aujourd'hui</a><a class="ib cnv" href="#" data-toast="Semaine suivante" aria-label="Semaine suivante">{ic("chevron-right", "s")}</a></div></div>
<div class="cal cal2 hide-m"><div class="grid">{head}<div>{hours}</div>{cols}</div></div><div class="agl">{ag}</div>"""

def x_livrables(k, d):
    rows = ""
    for n_, (icn, t, kk, typ, dt, fm, (pc, pl)) in enumerate(d["livrables"]):
        fs = LIVX.get(t, fm)
        per = "sem" if n_ < 3 else ("mois" if n_ < 6 else "tri")
        c, _ = FMT.get(fs[0], ("doc", "file"))
        rows += (f'<div class="lv2" data-per="{per}" data-fm="{" ".join(fs)}"><span class="lvt {c}">{ic(icn, "s")}</span><div class="grow"><b>{t}</b><span class="lvm"><span class="xs mute3">{typ.capitalize()}, {dt}</span><span class="pill {pc}">{pl}</span></span></div>'
                 f'<div class="lvxf">{"".join(fmt_btn(f, t) for f in fs)}</div></div>')
    return (f'<div class="ws-h"><div class="grow"><h2>Livrables</h2><span class="xs mute3">{ic("download", "s")} se télécharge, {ic("arrow-up-right", "s")} s\'ouvre dans l\'outil</span></div></div>'
            f'<div class="mlbar"><label class="srch tdq">{ic("search", "s")}<input type="search" placeholder="Chercher un livrable" aria-label="Chercher un livrable" data-flt></label>'
            f'<div class="seg lvper"><a class="on" data-per="">Tout</a><a data-per="sem">Cette semaine</a><a data-per="mois">Ce mois-ci</a><a data-per="tri">Trimestre</a></div>'
            f'<select class="fi lvfm" aria-label="Type"><option value="">Tous les formats</option>' + "".join(f"<option>{x}</option>" for x in ("PDF", "Excel", "Word", "PowerPoint", "PNG", "Google Doc", "Google Sheets", "Canva", "Figma")) + '</select></div>'
            f'<div class="lvxs">{rows}</div><p class="mlempty" hidden>Aucun livrable pour ce filtre.</p>')

def x_drive_ancien(k):
    e = EXPERTS[k]
    fl = ""
    for t, n, d in DRIVE[k]:
        th = {"poster": f'<div class="th poster"><b>{n.split(",")[0].split(" ")[0].upper()}</b></div>', "sheet": f'<div class="th sheet">{ic("table")}</div>',
              "doc": f'<div class="th">{ic("file-text")}</div>'}[t]
        fl += f'<div class="fl">{th}<div class="mt"><div class="grow"><b class="ell">{n}</b><span>{d}</span></div>{ic("ellipsis", "s")}</div></div>'
    return f"""<div class="drv"><nav class="tree"><a class="on" href="#">{ic("layout-grid", "s")} Accueil</a><a href="#">{ic("users", "s")} Partagé avec {e['prenom']}</a>
<div class="lb">Son drive</div><a href="#">{ic("folder", "s")} Documents de {e['prenom']}</a><a href="#">{ic("folder", "s")} Livrés</a>
<div class="lb">Unifood</div><a href="#">{ic("briefcase", "s")} Drive de l’entreprise</a><a href="#">{ic("palette", "s")} Chartes des marques</a>
<div class="lb">Synchronisation</div><a href="#">{ic("refresh-cw", "s")} Google Drive, à jour</a></nav>
<div><div class="row" style="justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px"><h2 style="font-size:19px;font-weight:650">Drive de {e['prenom']}</h2><span class="row"><span class="cfil" style="margin:0"><span class="srch" style="min-width:160px">{ic("search", "s")} Filtrer</span></span><a class="btn k sm" href="#">{ic("plus", "s")} Nouveau</a></span></div>
<div class="files">{fl}</div></div></div>"""

def x_mail_ancien(k):
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

def x_cal_ancien(k):
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

USAGE = {"djeneba": (19, "5 h 40", "18 min", 86, "Lun 8 h"), "fatima": (21, "7 h 10", "42 min", 214, "Mar 10 h"), "koffi": (20, "6 h 25", "1 h 05", 132, "Jeu 9 h")}
COMMS = {"djeneba": (14, "3 h 20", 96, 214, 12), "fatima": (6, "1 h 10", 58, 131, 4), "koffi": (3, "40 min", 22, 47, 5)}
def x_analytique(k):
    e, d = EXPERTS[k], DASH[k]
    jours, hj, tmoy, conv, pic = USAGE[k]
    fm_tot = sum(v for _, v in d["formats"]) or 1
    fmts = "".join(f'<div class="an-r" data-fm="{n}"><span class="an-n">{n}</span><i><b style="width:{v / fm_tot * 100:.0f}%"></b></i><em class="num">{v / fm_tot * 100:.0f} %</em></div>' for n, v in d["formats"])
    fch = '<span class="chip on" data-fmc="">Tous les formats</span>' + "".join(f'<span class="chip" data-fmc="{n}">{n}</span>' for n, _ in d["formats"])
    # carte de chaleur : quand {prenom} travaille le plus, par jour et par heure
    import random
    rnd = random.Random(k)
    H = list(range(7, 21))
    hm = '<div class="hm"><span></span>' + "".join(f'<em>{h}h</em>' if h % 3 == 1 else "<em></em>" for h in H)
    for jn in ("Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"):
        hm += f'<span>{jn}</span>'
        for h in H:
            base = 0 if jn in ("Sam", "Dim") else (3 if 8 <= h <= 12 else 2 if 14 <= h <= 17 else 1 if h <= 19 else 0)
            v = max(0, min(4, base + rnd.choice((-1, 0, 0, 1))))
            hm += f'<i class="h{v}" title="{jn} {h} h"></i>'
    hm += '</div>'
    jr = d["imp"][0]
    jtr = round(float(jr.split()[0].replace(",", ".")) / 8, 1)
    kp = "".join(f'<div class="an-k"><span>{l}</span><b class="num">{v}</b><small class="{c}">{x}</small></div>' for l, v, x, c in
                 [("Livrables", d["kpis"][0][1], f"{d['kpis'][0][3]} sur 7 jours", "up"), ("Documents neufs", d["kpis"][1][1], "créés de zéro", ""),
                  ("Révisions", d["kpis"][2][1], "demandées par l'équipe", ""), ("Acceptés sans révision", d["kpis"][4][1], "du premier coup", "up"),
                  ("Projets actifs", d["kpis"][3][1], "en cours", ""), ("En attente", d["kpis"][5][1], "de votre retour", "warn")])
    us = "".join(f'<div class="us"><span class="ic">{ic(i_, "s")}</span><b class="num">{v}</b><span>{l}</span></div>' for i_, v, l in
                 [("calendar-check", f"{jours} jours", "actifs sur 22 ouvrés"), ("clock", hj, "actives par jour en moyenne"), ("timer", tmoy, "pour produire un livrable"),
                  ("messages-square", str(conv), "échanges avec l'équipe"), ("flame", pic, "le moment le plus chargé"),
                  ("phone", f"{COMMS[k][0]} appels", f"{COMMS[k][1]} au téléphone"), ("send", str(COMMS[k][2]), "emails envoyés"), ("inbox", str(COMMS[k][3]), "emails reçus et triés"),
                  ("calendar-days", str(COMMS[k][4]), "rendez-vous suivis"), ("message-circle", "Telegram", "canal le plus utilisé")])
    return f"""<div class="h2x"><h2>Analytique</h2><span class="xs mute3">Ce que {e['prenom']} a produit, et comment l'équipe s'en sert</span></div>
<div class="anf"><div class="seg an-per"><a>Semaine</a><a class="on">Mois</a><a>Trimestre</a></div><label class="anr">{ic("calendar", "s")}<input type="date" value="2026-09-01" aria-label="Du"><span>au</span><input type="date" value="2026-09-30" aria-label="Au"></label></div>
<section class="an-imp"><div><small>Impact</small><b class="num">{str(jtr).replace(".", ",").replace(",0", "")} journée{"s" if jtr >= 2 else ""} de travail</b><span>rendues à l'équipe ce mois-ci, soit {jr} que vous n'avez pas passées à le faire.</span></div>
<div class="an-imp2"><div><b class="num">{d["imp"][1].split(" vs")[0]}</b><span>par rapport à la semaine passée</span></div><div><b class="num">{tmoy}</b><span>en moyenne par livrable</span></div></div></section>
<div class="an-ks an6">{kp}</div>
<div class="an-g"><section class="an-c"><header><h2>Livrables par jour</h2><span>cette semaine et la semaine passée</span></header>{b3.chart(d, [k])}</section>
<section class="an-c"><header><h2>Formats livrés</h2><span>en part des livrables</span></header><div class="chips anfc">{fch}</div><div class="an-rs">{fmts}</div></section></div>
<section class="an-c"><header><h2>Usage</h2><span>quand et combien l'équipe travaille avec {e['prenom']}</span></header><div class="uss">{us}</div>
<h3 class="hmh">Heures de travail</h3>{hm}<div class="hml"><span>Moins</span><i class="h0"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i><i class="h4"></i><span>Plus</span></div></section>"""

INTRO = {"djeneba": "Je prépare vos réunions, je suis vos décisions et je relance ce qui traîne. Demandez-moi un point précis.",
         "fatima": "Je fais vivre Sossa et Super Mint sur vos réseaux, du calendrier aux réponses aux clients. Demandez-moi un point précis.",
         "koffi": "Je dessine vos affiches, packagings et déclinaisons, dans la charte de chaque marque. Demandez-moi un point précis."}

def x_resume(k):
    e, d = EXPERTS[k], DASH[k]
    mot, fait, cours, vous, nb = RECAP[k]
    li = lambda xs, i, c: "".join(f'<li><span style="color:{c}">{ic(i, "s")}</span><span>{x}</span></li>' for x in xs)
    lt = [x[1] for x in d["livrables"]]
    sem = (fait + [t for t in lt[:4] if t not in fait])[:6]
    per = {"jour": (fait, cours, vous), "semaine": (sem, cours + [f"{len(lt)} livrables en relecture chez vous"][:2], vous),
           "mois": ([f"{d['kpis'][0][1]} livrables cette semaine, {int(d['kpis'][0][1]) * 3} sur le mois"] + sem[:3], cours, vous + ["Bilan du mois à relire"])}
    kb = ""
    for pk, (a, b_, c) in per.items():
        kb += (f'<div class="recap rcp{" on" if pk == "jour" else ""}" data-rp="{pk}"><div class="box kc ok"><h3>{ic("circle-check", "s")} Fait <span class="cnt">{len(a)}</span></h3><ul>{li(a, "check", "var(--ok)")}</ul></div>'
               f'<div class="box kc mid"><h3>{ic("loader", "s")} En cours <span class="cnt">{len(b_)}</span></h3><ul>{li(b_, "clock", "var(--accent-ink)")}</ul></div>'
               f'<div class="box kc you"><h3>{ic("hand", "s")} Attend votre accord <span class="cnt">{len(c)}</span></h3><ul>{li(c, "arrow-right", "var(--brand-ink)")}</ul></div></div>')
    return f"""<div class="h2x"><h2>Résumé</h2><div class="seg rps"><a class="on" data-rp="jour">Aujourd'hui</a><a data-rp="semaine">Cette semaine</a><a data-rp="mois">Ce mois-ci</a></div></div>
<p class="rsin">{INTRO[k].replace(" Demandez-moi un point précis.", "")}</p>
<div class="kb2">{kb}</div>
<div class="rsask rsask2"><span class="rsic">{ic("message-square-text")}</span><div class="grow"><b class="sm">Demander un point précis à {e['prenom']}</b>
<form class="askx" data-go-to="discussion"><input type="text" placeholder="Par exemple : « où en est la campagne Sossa ? »" aria-label="Demander un point précis à {e['prenom']}"><button type="submit" aria-label="Envoyer">{ic("arrow-up", "s")}</button></form></div></div>
<div class="row" style="gap:10px;margin-top:16px;flex-wrap:wrap"><a class="btn o sm" href="#" data-go="analytique">{ic("chart-column", "s")} Voir l'analytique</a><a class="btn o sm" href="tableau-de-bord.html">{ic("layout-dashboard", "s")} Son tableau de bord</a></div>"""

def modal_perso():
    o = lambda items: "".join(f'<span class="{"on" if j == 0 else ""}">{x}</span>' for j, x in enumerate(items))
    pose = o([f'{ic("user-round")}Face', f'{ic("rotate-3d")}Trois-quarts', f'{ic("armchair")}Assise', f'{ic("footprints")}En marche'])
    style = o([f'{ic("sparkles")}Auto', f'{ic("shirt")}Décontractée', f'{ic("shopping-bag")}Pagne moderne', f'{ic("briefcase")}Tailleur'])
    acc = o([f'{ic("sparkles")}Auto', f'{ic("headset")}Casque', f'{ic("laptop")}Ordinateur', f'{ic("glasses")}Lunettes'])
    fond = o(['<i class="sw2" style="background:#C5C4FF"></i>Lavande', '<i class="sw2" style="background:#EBDCCB"></i>Sable',
              '<i class="sw2" style="background:#E00040"></i>Couleur de l’entreprise', '<i class="sw2" style="background:#241C33"></i>Sombre'])
    return f"""<div class="modal" id="pz"><div class="ov" data-close></div><div class="pn pzp">
<div class="lf pzl"><figure class="pzb"><img src="{B}pied/djeneba.jpg" alt="Djénéba en pied"><figcaption>Portrait actuel</figcaption></figure><figure class="pzf"><img src="{B}djeneba.jpg" alt="Visage de Djénéba"><figcaption>Visage</figcaption></figure><figure class="pzs"><img src="{B}vid/djeneba.webp" alt="Djénéba en silhouette"><figcaption>Vidéo</figcaption></figure></div>
<div class="rt2"><h2>Personnaliser votre Chief of Staff <button class="ib" data-close aria-label="Fermer">{ic("x", "s")}</button></h2>
<div><p class="oq">Prénom</p><div class="nmf"><span class="v">Djénéba</span><a class="btn o" href="#">Suggérer</a></div><p class="xs mute3" style="margin-top:6px">Toute l'équipe la verra sous ce prénom, ici, sur WhatsApp et dans ses emails.</p></div>
<div class="drop"><span class="fz">{ic("scan-face")}</span><div><b>Choisir son visage</b><div class="sm mute">Déposez une photo ou laissez Yelema en créer un</div></div></div>
<div><p class="oq">Pose</p><div class="opts">{pose}</div></div>
<div><p class="oq">Tenue</p><div class="opts">{style}</div></div>
<div><p class="oq">Accessoire</p><div class="opts">{acc}</div></div>
<div><p class="oq">Fond</p><div class="opts">{fond}</div></div>
<div class="pzgo"><a class="btn k" href="#" data-close data-toast="Nouveau portrait en préparation, prêt dans 2 minutes" style="min-height:50px;border-radius:99px;width:100%;justify-content:center">{ic("sparkles", "s")} Créer son nouveau portrait et sa vidéo</a></div></div></div></div>"""

CURSOR = '<svg class="cur" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#17112B" stroke-width="1.5" stroke-linejoin="round"/></svg>'
def ecran_win(k, mini=False):
    e = EXPERTS[k]
    apps = [("Canva", "canva.com", True), ("Gmail", "gmail.com", False), ("Drive", "drive.google.com", False)]
    tabs = "".join(f'<span class="wt{" on" if on else ""}"><img src="{FAV}{d}" alt="">{n}</span>' for n, d, on in apps)
    side = "".join(f'<i style="width:{w}%"></i>' for w in (80, 60, 70, 45))
    return f"""<div class="win{" mini" if mini else ""}"><div class="wbar"><span class="lights"><i></i><i></i><i></i></span>{"" if mini else tabs}<span class="wurl ell">{ic("lock", "s")} canva.com/design/sossa-promo-rentree</span></div>
<div class="wbody"><div class="wside">{side}</div><div class="wcanvas"><img src="{B}flyer-sossa.jpg" alt="Visuel Sossa en cours"><span class="sel"></span></div>
{CURSOR}<span class="doing"><span class="dot"></span> {e['prenom']} ajuste le visuel Sossa pour Instagram</span></div></div>"""

def ecran(k):
    e, p = EXPERTS[k], PRO[k]
    if not e["live"]:
        return f"""<div class="scrv"><div class="win off"><div class="wbar"><span class="lights"><i></i><i></i><i></i></span><span class="wurl">Écran en veille</span></div>
<div class="wbody idlew"><span class="ib" style="width:56px;height:56px">{ic("moon", "s")}</span><b>{e['prenom']} ne travaille sur rien en ce moment</b><span class="sm mute3">Dernière tâche : {p["act"][0][1].lower()}, à {p["act"][0][2]}</span>
<a class="btn p sm" href="#" data-go="discussion">{ic("message-circle", "s")} Lui confier un travail</a></div></div></div>"""
    steps = [("done", "Ouvrir le visuel validé par Aïcha", "10:15"), ("done", "Adapter au format Instagram 1080 x 1350", "10:24"), ("done", "Vérifier la charte Sossa", "10:29"),
             ("now", "Exporter le visuel", "en cours"), ("next", "Envoyer à Aïcha pour accord", "vers 11:30")]
    st = "".join(f'<li class="{c}"><i></i><span class="grow">{t}</span><time>{h}</time></li>' for c, t, h in steps)
    log = [("canva.com", "A ouvert le design « Sossa promo rentrée »", "10:15"), ("canva.com", "A redimensionné en 1080 x 1350", "10:24"),
           ("drive.google.com", "A lu la charte Sossa dans le Drive de l’entreprise", "10:28"), ("canva.com", "Lance l'export en PNG", "10:41")]
    lg = "".join(f'<div class="lg"><img src="{FAV}{d}" alt=""><span class="grow">{t}</span><time>{h}</time></div>' for d, t, h in log)
    return f"""<div class="scrv"><div class="scrh"><span class="live2"><span class="dot"></span> En direct</span><b class="grow">{e['prenom']} adapte le visuel Sossa pour Instagram</b>
<a class="btn o sm" href="#" data-toast="Vous avez la main, {e['prenom']} attend">{ic("mouse-pointer-2", "s")} Prendre la main</a><a class="btn o sm" href="#" data-toast="{e['prenom']} est en pause">{ic("pause", "s")} Pause</a></div>
{ecran_win(k)}
<div class="g2 scrg"><div class="box"><h3 class="bt">{ic("list-checks", "s")} Étapes, 4 sur 5</h3><div class="prog2"><i style="width:72%"></i></div><ul class="tl st2">{st}</ul></div>
<div class="box"><h3 class="bt">{ic("history", "s")} Ce qu'{"elle" if k != "koffi" else "il"} a fait sur l'ordinateur</h3>{lg}<p class="xs mute3" style="margin-top:10px">Demandé par Aïcha à 10:15. Fin prévue vers 11:30.</p></div></div></div>"""


ACT_PLUS = {"djeneba": [("Hier", [("ok", "Relevé de décisions du comité envoyé", "18:20"), ("ok", "Brief Banque Atlantique préparé", "16:05"), ("ok", "14 emails triés, 3 remontés", "11:40"), ("ok", "Point du jour envoyé", "08:00")]),
                        ("Lundi 29", [("ok", "Pack du comité préparé", "17:30"), ("ok", "Relance de Serge sur le devis", "10:12"), ("ok", "Point de la semaine envoyé", "08:00")])],
            "fatima": [("Hier", [("ok", "Carrousel goûter de la rentrée publié", "12:00"), ("ok", "146 commentaires traités", "18:10"), ("ok", "Rapport de la campagne envoyé", "09:30")]),
                       ("Lundi 29", [("ok", "Calendrier d'octobre validé", "16:45"), ("ok", "Story jeu concours publiée", "12:30"), ("ok", "Newsletter envoyée à 3 240 abonnés", "10:00")])],
            "koffi": [("Hier", [("ok", "Affiche A2 envoyée en BAT", "17:15"), ("ok", "10 déclinaisons Super Mint", "14:20"), ("ok", "Signalétique : 2 corrections faites", "10:05")]),
                      ("Lundi 29", [("ok", "Flyer goûter de la rentrée livré", "16:00"), ("ok", "Animation du logo exportée", "11:30")])]}
def modal_act(k):
    e, p = EXPERTS[k], PRO[k]
    grp = [("Aujourd'hui", p["act"])] + ACT_PLUS[k]
    body = "".join(f'<h5 class="acth">{g}</h5><ul class="tl">' + "".join(f'<li class="{st}"><i></i><span class="grow">{t}</span><time>{h}</time></li>' for st, t, h in its) + '</ul>' for g, its in grp)
    return f"""<div class="modal" id="act-{k}"><div class="ov" data-close></div><div class="pn shpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Activité de {e['prenom']}</h2><p class="sm mute">Tout ce que {e['prenom']} a fait ces derniers jours</p>
<label class="srch tdq" style="margin:6px 0">{ic("search", "s")}<input type="search" placeholder="Chercher une tâche" aria-label="Chercher une tâche" data-flt></label><div class="actall">{body}</div></div></div>"""

def page_expert(k, brand):
    e, p, d = EXPERTS[k], PRO[k], DASH[k]
    fil = {"fatima": b3.FIL_FATIMA, "koffi": b3.FIL_KOFFI, "djeneba": b3.FIL_DJENEBA}[k]
    sugg = {"fatima": ["Valider le post", "Nouvelle campagne", "Résumé de la semaine"], "koffi": ["Nouvelle affiche", "Déclinaisons", "Résumé de la semaine"],
            "djeneba": ["Ajouter un indicateur à mon tableau de bord", "Mon point du jour", "Résumé pour le DG"]}[k]
    s = "".join(f"<span>{x}</span>" for x in sugg)
    tl = "".join(f'<li class="{st}"><i></i><span class="grow">{t}</span><time>{h}</time></li>' for st, t, h in p["act"])
    docs = "".join(f'<a href="#" data-go="drive"><span class="th {FMT.get(f, ("doc", ""))[0]}">{f'<img src="{B}{th}" alt="">' if th else ic(FMT.get(f, ("", "file-text"))[1])}<i class="fmb">{f}</i></span><span class="ell">{n}</span></a>' for t, n, _, f, th in DRIVE2[k][:3])
    term = (f'<a href="#" data-go="direct" class="minis">{ecran_win(k, True)}</a><a class="link sm" href="#" data-go="direct" style="margin-top:8px">Voir son écran en grand {ic("arrow-right", "s")}</a>'
            if e["live"] else f'<a href="#" data-go="direct" class="minis veille">{ecran_win(k, True)}<span class="zz">{ic("moon", "s")} En veille, dernière tâche à {p["act"][0][2]}</span></a><a class="link sm" href="#" data-go="direct" style="margin-top:8px">Ouvrir son ordinateur {ic("arrow-right", "s")}</a>')
    dl = "".join(f'<a class="dl" href="#"><span class="ic">{ic(icn, "s")}</span><span class="grow"><b class="ell">{t}</b><span class="xs mute3">{typ}, {dt}</span></span><span class="pill {pc}">{pl}</span></a>'
                 for icn, t, kk, typ, dt, fm, (pc, pl) in d["livrables"])
    nav1 = [("discussion", "message-circle", "Discussion"), ("resume", "notebook-text", "Résumé"), ("analytique", "chart-column", "Analytique"), ("fiche", "id-card", "Fiche de poste"), ("profil", "sliders-horizontal", "Profil"),
            ("canaux", "radio-tower", "Canaux"), ("connecteurs", "plug", "Connecteurs")]
    nav2 = [("drive", "hard-drive", "Drive", "#E66A4E"), ("mail", "mail", "Mail", "#E5677D"), ("calendrier", "calendar", "Calendrier", "#F0955A"),
            ("livrables", "archive", "Livrables", "#5B5BD6")]
    n1 = "".join(('<div class="lb">Réglages</div>' if t == "profil" else "") + f'<a href="#" data-t="{t}"{" class=on" if t == "discussion" else ""}>{ic(i, "s")} {l}</a>' for t, i, l in nav1)
    n2 = "".join(f'<a href="#" data-t="{t}"><span class="ap" style="background:{c}">{ic(i, "s")}</span> {l}</a>' for t, i, l, c in nav2)
    direct = ecran(k)
    corps = f"""<div class="xp" data-tabs>
<aside class="xcol"><div class="xsw"><a href="accueil.html" aria-label="Retour à l'équipe">{ic("arrow-left", "s")}</a><span class="grow">{e['prenom']}</span><span class="faces">{"".join(f'<a href="{x}.html"><img src="{B}{EXPERTS[x]["photo"]}" alt="{EXPERTS[x]["prenom"]}"></a>' for x in ("djeneba", "fatima", "koffi") if x != k)}</span></div><div class="pcard"><img src="{B}{e['photo']}" alt="">{f'<button class="pen pcpen" data-open="pz" aria-label="Personnaliser {e["prenom"]}" title="Personnaliser">{ic("pencil", "s")}</button>' if k == "djeneba" else ""}{'<span class="st"><span class="dot"></span> Au travail</span>' if e['live'] else ''}
<div class="nm">{e['prenom']} <span>{e['role']}</span></div>
<div class="cta"><a class="call" href="#" data-call="{k}">{ic("phone", "s")} Appeler</a><a class="sq" href="#" data-go="direct" aria-label="Voir son écran">{ic("monitor", "s")}</a><a class="sq pause" href="#" aria-label="Mettre en pause">{ic("power", "s")}</a></div></div>
<div class="xmail">{ic("mail", "s")}<span>{p['mail']}</span>{ic("copy", "s")}</div>
<nav class="xnav">{n1}<div class="lb">Son espace de travail</div>{n2}</nav></aside>
<div class="xmain">
  <div class="panel on" id="discussion"><div class="dgrid"><div class="chat2"><div class="thread">{fil}</div><div class="comp"><div class="sugg">{s}</div><div class="inp"><button class="ib" aria-label="Joindre un fichier">{ic("plus", "s")}</button><span class="ph">Écrire à {e['prenom']}</span><label class="llm" title="Modèle d'IA">{ic("cpu", "s")}<select aria-label="Modèle d'IA"><option>Claude, Anthropic</option><option>GPT, OpenAI</option><option>Gemini, Google</option><option>Mistral Large</option><option>Llama, Meta</option></select>{ic("chevron-down", "s")}</label><button class="mic" aria-label="Message vocal">{ic("mic", "s")}</button></div></div></div>
    <div class="rail"><div class="rbox"><h4>{ic("clipboard-list", "s")} Activité de {e['prenom']} <a class="rmore" href="#" data-open="act-{k}">Voir plus</a></h4><p class="xs mute3">Aujourd'hui</p><ul class="tl">{tl}</ul></div>
    <div class="rbox"><h4>{ic("files", "s")} Documents récents <a class="rmore" href="#" data-go="drive">Voir plus</a></h4><div class="docs">{docs}</div></div>
    <div class="rbox"><h4>{ic("monitor", "s")} Son ordinateur</h4>{term}</div></div></div></div>
  <div class="panel" id="resume">{x_resume(k)}</div>
  <div class="panel" id="analytique">{x_analytique(k)}</div>
  <div class="panel" id="fiche">{x_fiche(k)}</div>
  <div class="panel" id="profil">{x_profil(k)}</div>
  <div class="panel" id="connecteurs">{x_connect(k)}</div>
  <div class="panel" id="canaux">{x_canaux(k)}</div>
  <div class="panel" id="suivi">{b3.kpis(d)}<div class="g2">{b3.chart(d, [k])}{b3.donut(d)}</div>{b3.projets(d)}<h3 class="h3s" style="margin-top:26px">Temps rendu par {e['prenom']}</h3>{impact4(d)}</div>
  <div class="panel" id="securite">{x_secu(k)}</div>
  <div class="panel" id="drive">{x_drive(k)}</div>
  <div class="panel" id="mail">{x_mail(k)}</div>
  <div class="panel" id="calendrier">{x_cal(k)}</div>
  <div class="panel" id="direct">{direct}</div>
  <div class="panel" id="livrables">{x_livrables(k, d)}</div>
</div></div>{modal_perso() if k == "djeneba" else ""}{modal_act(k)}{modal_mail(k)}{modal_meet(k)}"""
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
    ("alioune", "Alioune", "Investissement", "finance", "trending-up", "Instruit chaque investissement avant qu'un franc ne parte.",
     ["Tri des dossiers entrants", "Audit du modèle financier", "Note au comité"], "il"),
]

def vid(k, alt):
    return f'<video class="av-vid" muted loop playsinline preload="none" poster="{B}vid/{k}.webp" data-src="{B}vid/{k}.mp4" aria-label="{alt}"></video>'

def carte_pied(ph, nom, met, f, equipe=False):
    fi = fiche_de(ph)
    href = f"{ph}.html" if equipe else f"recrue-{ph}.html"
    bt = f'{ic("arrow-right", "s")} Ouvrir son espace' if equipe else f'{ic("user-plus", "s")} Recruter {nom}'
    badge = f'<span class="inteam">{ic("circle-check", "s")} Dans votre équipe</span>' if equipe else ""
    return (f'<a class="pc2{" mine2" if equipe else ""}" data-m="{f}" href="{href}">{vid(ph, nom)}{badge}'
            f'<span class="nm"><b>{nom}</b><span class="rl">{esc(fi.get("role", met))}</span><span class="tl">{esc(fi.get("tl", ""))}</span>'
            f'<span class="rb">{bt}</span></span></a>')

EQUIPE_CAT = [("djeneba", "Djénéba", "Chief of Staff", "direction"), ("fatima", "Fatima", "Marketing", "marketing"), ("koffi", "Koffi", "Design", "marketing")]
def catalogue(n=None, avec_equipe=False):
    out = "".join(carte_pied(k, nom, met, f, True) for k, nom, met, f in EQUIPE_CAT) if avec_equipe else ""
    return out + "".join(carte_pied(ph, nom, met, f) for ph, nom, met, f, *_ in (CATALOGUE[:n] if n else CATALOGUE))

def page_recrue(ph, brand):
    c = next(x for x in CATALOGUE if x[0] == ph); nom, met, pron = c[1], c[2], c[7]
    fi = FICHES[ph]
    tiles = "".join(f'<span class="dt{" on" if on else ""}"><img src="{FAV}{d}" alt=""><b>{n}</b><span>{sub}</span><i>{ic("check", "s")}</i></span>' for n, d, sub, on in
                    [("Telegram", "telegram.org", "Un sujet dans votre groupe", True), ("Web", "yelema.ai", "Dans cet espace", True), ("Slack", "slack.com", "Canal de l'équipe", False), ("Microsoft Teams", "teams.microsoft.com", "Canal de l'équipe", False), ("WhatsApp", "whatsapp.com", "Sur demande", False)])
    corps = f"""<div class="rq"><aside class="rqc"><a class="back" href="recruter.html">{ic("arrow-left", "s")} Tous les experts</a>
<div class="rqp">{vid(ph, nom)}<span class="nm"><b>{nom}</b><span>{esc(fi["role"])}</span></span></div>
<p class="sm" style="margin-top:12px">{esc(fi["tl"])}</p>

<div class="rqprice"><a class="btn p rqgo" href="#rq-go">{ic("user-plus", "s")} Recruter {nom}</a></div></aside>
<div class="rqm">{x_fiche(ph)}
<div class="rqbox" id="rq-go"><h3 class="h3s" style="margin-top:0">Recruter {nom}</h3>
<b class="sm">Assigner à</b><p class="xs mute3">Les personnes qui travailleront avec {nom}. Choisissez-en autant que vous voulez.</p><div class="asg">{ASSIGN}</div>
<b class="sm" style="margin-top:16px;display:block">Où le joindre</b><p class="xs mute3">Modifiable à tout moment.</p><div class="dts">{tiles}</div>
<div class="row rqend"><span class="grow"><b class="num" style="font-size:18px">200 000 F CFA</b> <span class="xs mute3">par mois, prêt en quelques minutes. Rien n'est facturé si la mise en place échoue.</span></span><a class="btn p rqok" href="#" data-nom="{nom}" data-pron="{pron}">{ic("user-plus", "s")} Recruter {nom}</a></div>
<div class="rqdone">{ic("circle-check", "s")} <span></span></div></div></div></div>"""
    crumb = f'<a href="recruter.html">Recruter</a> {ic("chevron-right", "s")} <b>{nom}</b>'
    return page("recruter", brand, f"{nom}, {met}", crumb, corps)

ASSIGN = "".join(f'<span class="as{" on" if i == 0 else ""}" data-who="{n}">{face(c, "", 28)}{n}</span>' for i, (c, n) in enumerate(
    [("AD", "Moi"), ("FB", "Fanta"), ("KO", "Kader"), ("NT", "Nadège"), ("MK", "Mariam"), ("IS", "Ibrahim")])) + f'<span class="as" data-who="tout le service">{ic("users", "s")} Tout un service</span>'
CHN3 = "".join(f'<span class="c3{" on" if on else ""}"><img src="{FAV}{d}" alt="">{n}{ic("check", "s")}</span>' for n, d, on in
               [("Telegram", "telegram.org", True), ("Web", "yelema.ai", True), ("Slack", "slack.com", False), ("Teams", "teams.microsoft.com", False), ("WhatsApp", "whatsapp.com", False)])

def recrues(n=None):
    cards = ""
    for ph, nom, met, f, icn, desc, taches, pron in (CATALOGUE[:n] if n else CATALOGUE):
        fi = FICHES.get(ph, {})
        data = json.dumps({"photo": f"{B}{ph}.jpg", "nom": nom, "metier": fi.get("role", met).replace("&", "et"), "desc": fi.get("mission", desc), "taches": fi.get("quotidien", taches),
                           "comp": [c[0] for c in fi.get("competences", [])][:8], "accord": fi.get("accord", [])[:4], "pron": pron,
                           "done": f"{nom} rejoint votre équipe. {pron.capitalize()} vous écrit dans quelques minutes."}, ensure_ascii=False).replace('"', "&quot;")
        cards += (f'<button class="pc" data-m="{f}" data-x="{data}"><div class="ph"><img src="{B}{ph}.jpg" alt=""><span class="badge">{ic(icn, "s")}</span></div>'
                  f'<h3>{nom}</h3><div class="mtr">{met}</div><p>{desc}</p><div class="ft"><span><b class="num" style="color:var(--ink)">200 000</b> F CFA par mois</span></div><span class="hb">Recruter</span></button>')
    drawer = f"""<div class="drawer" data-check='{ic("circle-check", "s")}'><div class="ov" data-close></div><div class="pn">
<div class="ph"><img src="" alt=""><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button></div>
<div class="bd"><div><h2 style="font-size:30px;font-weight:650"></h2><div class="rl mute"></div></div><p class="desc"></p>
<div><b class="sm">Au quotidien</b><ul class="tasks" style="margin-top:8px"></ul></div>
<div><b class="sm">Ses compétences</b><div class="cps"></div></div>
<div><b class="sm">Toujours avec votre accord</b><ul class="acc"></ul></div>
<div class="asgw"><b class="sm">Assigner à</b><p class="xs mute3">Les personnes qui travailleront avec l'expert. Choisissez-en autant que vous voulez.</p><div class="asg">{ASSIGN}</div></div>
<div><b class="sm">Où le joindre</b><div class="chn3">{CHN3}</div></div>
<div class="kv"><div><span>Prêt en</span>quelques minutes</div><div><span>Prix</span>200 000 F CFA par mois</div></div>
<p class="xs mute3">Rien n'est facturé si la mise en place échoue.</p>
<a class="btn p go" href="#">Recruter</a><div class="done"></div></div></div></div>""".replace("{ASSIGN}", ASSIGN).replace("{CHN3}", CHN3)
    return cards, drawer

def page_recruter(brand):
    mine = "".join(f'<a class="who" href="{k}.html"><img src="{B}{EXPERTS[k]["photo"]}" alt="">{EXPERTS[k]["prenom"]}, {EXPERTS[k]["role"]}</a>' for k in ("djeneba", "fatima", "koffi"))
    filt = [("tous", "sparkles", "Tous", 12), ("direction", "crown", "Direction", 1), ("marketing", "megaphone", "Marketing et design", 2), ("ventes", "handshake", "Ventes et clients", 2),
            ("rh", "users", "RH", 2), ("finance", "landmark", "Finance et investissement", 3), ("donnees", "chart-pie", "Données", 1), ("juridique", "scale", "Juridique", 1)]
    chips = "".join(f'<span class="chip{" on" if f == "tous" else ""}" data-f="{f}" role="button" tabindex="0">{ic(i, "s")} {l} <em>{n}</em></span>' for f, i, l, n in filt)
    cards, drawer = catalogue(avec_equipe=True), ""
    kw = json.dumps([{"k": ph, "nom": nom, "role": fiche_de(ph)["role"].replace("&", "et"), "tl": fiche_de(ph)["tl"],
                      "kw": " ".join([met, fiche_de(ph)["role"], fiche_de(ph).get("mission", "")] + [c[0] for c in fiche_de(ph).get("competences", [])]).lower()}
                     for ph, nom, met, *_ in CATALOGUE], ensure_ascii=False).replace("'", "&#39;")
    corps = f"""<div class="hire"><h1>Qui sera votre prochaine recrue&nbsp;?</h1><p class="sub hsub">Les experts prêts à rejoindre votre équipe, par métier.</p>
</div>
<div class="filters" data-filter style="margin-top:16px"><div class="chips">{chips}</div></div>
<section class="pcs2">{cards}</section>"""
    return page("recruter", brand, "Recruter", "<b>Recruter</b>", corps)

# ---------------------------------------------------------------- chat entreprise
SOURCES = [("Drive de l’entreprise", "hard-drive", "312 documents"), ("Ventes 2026", "table", "mis à jour chaque soir"), ("Charte Sossa et Super Mint", "palette", "4 fichiers"),
           ("Comptes rendus de comités", "file-text", "18 notes"), ("Site unifood.info", "globe", "lu le 28/09")]

def fil_memoire():
    return ('<span class="day">Aujourd\'hui</span>'
            + m("moi", "Quelles promos Sossa avons-nous faites l'an dernier à la rentrée&nbsp;?", "11:02")
            + m("lui", "Deux : -15 % sur le prix de gros du 1er au 20 septembre, et un lot offert dès 25 000 F CFA d'achat. La première a mieux marché, +22 % de ventes sur la période."
                + f'<div class="src" style="margin-top:8px">{ic("file-text", "s")}<span class="grow"><b class="sm">Bilan rentrée 2025</b><br><span class="xs mute3">Drive de l’entreprise, Marketing</span></span></div>', "11:02")
            + m("moi", "Et qui avait validé le budget&nbsp;?", "11:03")
            + m("lui", "Le comité du 14 août 2025, d'après le compte rendu. Montant validé : 4,5 M F CFA.", "11:03"))

def memoire_corps(admin=False):
    src = "".join(f'<div class="src"><span class="ib" style="width:34px;height:34px">{ic(i, "s")}</span><span class="grow"><b>{n}</b><br><span class="xs mute3">{d}</span></span>{"<span class=sw></span>" if admin else ""}</div>' for n, i, d in SOURCES)
    chat = f"""<div class="chat2" style="min-height:600px"><div class="row" style="padding:14px 18px;border-bottom:1px solid var(--line)"><span class="ib">{ic("book-open", "s")}</span><div class="grow"><b>Mémoire de l’entreprise</b><div class="xs mute3">Répond à partir des documents de l'entreprise, pour les membres sans expert attitré</div></div></div>
<div class="thread">{fil_memoire()}</div><div class="comp"><div class="inp"><span class="ph" style="padding-left:12px">Posez votre question</span><button class="mic" aria-label="Question à la voix">{ic("mic", "s")}</button></div></div></div>"""
    aide = "Vous choisissez ce que la mémoire peut lire. Chaque membre ne voit que les sources de son équipe." if admin else "Les réponses citent toujours leur source."
    ajout = f'<a class="link" href="#">{ic("plus", "s")} Ajouter une source</a>' if admin else ""
    side = f'<div class="box"><div class="ch"><h2 style="font-size:16px;font-weight:650">Ce qu\'elle connaît</h2>{ajout}</div>{src}<p class="xs mute3" style="margin-top:12px">{aide}</p></div>'
    return (f'<div class="hello"><div class="grow"><p class="date">{"Réglages" if admin else "Pour toute l’équipe"}</p><h1>Chat entreprise</h1></div></div>'
            + (f'<div class="dgrid memg" style="margin-top:16px">{chat}{side}</div>' if admin else f'<div class="memfull" style="margin-top:16px">{chat}</div>'))

GPT_FILS = [("Aujourd'hui", [("Promos Sossa de la rentrée 2025", True), ("Qui gère le compte Carrefour ?", False)]),
            ("Hier", [("Prix de gros Super Mint par région", False), ("Résumé du comité du 24 septembre", False)]),
            ("Cette semaine", [("Fournisseurs d'emballage carton", False), ("Règles de congés terrain", False), ("Objectifs ventes T4", False)])]

def gpt_msg(qui, html, src=None):
    if qui == "moi":
        return f'<div class="gm2 moi"><div class="bq">{html}</div></div>'
    s2 = f'<div class="srcs">{"".join(f"<span>{ic(chr(102)+chr(105)+chr(108)+chr(101)+chr(45)+chr(116)+chr(101)+chr(120)+chr(116), chr(115))} {x}</span>" for x in src)}</div>' if src else ""
    return f'<div class="gm2 lui"><span class="ga">{ic("book-open", "s")}</span><div class="ba">{html}{s2}<div class="acts2">{ic("copy", "s")}{ic("thumbs-up", "s")}{ic("thumbs-down", "s")}{ic("refresh-cw", "s")}</div></div></div>'

def page_memoire(brand):
    fils = "".join(f'<div class="glb">{g}</div>' + "".join(f'<a class="gf" href="#" data-fil="{"c1" if on else "c2"}">{t}</a>' for t, on in its) for g, its in GPT_FILS)
    conv = (gpt_msg("moi", "Quelles promos Sossa avons-nous faites l'an dernier à la rentrée&nbsp;?")
            + gpt_msg("lui", "<p>Deux promotions, toutes les deux en septembre 2025 :</p><ol><li><b>-15 % sur le prix de gros</b> du 1er au 20 septembre, pour tous les distributeurs.</li><li><b>Un lot offert</b> dès 25 000 F CFA d'achat, réservé aux boutiques de quartier.</li></ol><p>La première a mieux marché : <b>+22 % de ventes</b> sur la période, contre +9 % pour le lot offert.</p>", ["Bilan rentrée 2025", "Ventes 2025"])
            + gpt_msg("moi", "Et qui avait validé le budget&nbsp;?")
            + gpt_msg("lui", "<p>Le comité de direction du <b>14 août 2025</b>, sur proposition d'Aïcha Diabaté. Montant validé : <b>4,5 M F CFA</b>.</p>", ["CR comité du 14/08/2025"]))
    conv2 = (gpt_msg("moi", "Qui gère le compte Carrefour&nbsp;?")
             + gpt_msg("lui", "<p><b>Fanta Bakayoko</b>, responsable commerciale, depuis mars 2026. Kader Ouattara suit les livraisons en magasin.</p>", ["Organigramme commercial"]))
    corps = f"""<div class="gpt"><aside class="gside"><a class="gnew" href="#" data-fil="vide">{ic("square-pen", "s")} Nouvelle conversation</a>
<label class="srch tdq">{ic("search", "s")}<input type="search" placeholder="Chercher dans les conversations" aria-label="Chercher dans les conversations" data-flt></label>{fils}</aside>
<section class="gmain vide"><div class="ghead"><b class="gtt">Nouvelle conversation</b></div>
<div class="gconv"><div class="gfil" id="c1">{conv}</div><div class="gfil" id="c2">{conv2}</div></div>
<div class="gfloat" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
<div class="gcomp"><h2 class="ghello">Que puis-je faire pour vous&nbsp;?</h2>
<div class="gin2"><div class="tx">Posez votre question</div><div class="row" style="justify-content:space-between"><span class="row" style="gap:6px"><button class="ib" aria-label="Joindre un fichier">{ic("paperclip", "s")}</button><label class="llm" title="Modèle d'IA">{ic("cpu", "s")}<select aria-label="Modèle d'IA"><option>Claude, Anthropic</option><option>GPT, OpenAI</option><option>Gemini, Google</option><option>Mistral Large</option><option>Llama, Meta</option></select>{ic("chevron-down", "s")}</label></span><span class="row" style="gap:8px"><button class="mic" aria-label="Poser la question à la voix">{ic("mic", "s")}</button><button class="send" aria-label="Envoyer">{ic("arrow-up", "s")}</button></span></div></div>
<p class="xs mute3 gnote">Plus vous donnez de contexte, meilleure est la réponse. Chaque réponse cite ses sources.</p></div></section></div>"""
    return page("memoire", brand, "Chat entreprise", "<b>Chat entreprise</b>", corps, wrap=False)

# ---------------------------------------------------------------- admin (réglages)
ORG_NAV = [("admin", "layout-grid", "Vue d'ensemble"), ("admin-experts", "sparkles", "Experts"), ("admin-membres", "users", "Membres et droits"),
           ("admin-connecteurs", "plug", "Connecteurs"), ("admin-facturation", "receipt", "Facturation"), ("admin-general", "building-2", "Détails de l'entreprise")]
ADM_NAV = [("Organisation", [("admin", "layout-grid", "Vue d'ensemble"), ("admin-experts", "sparkles", "Experts"), ("admin-membres", "users", "Membres et droits"),
                             ("admin-canaux", "radio-tower", "Canaux"), ("admin-connecteurs", "plug", "Connecteurs"), ("admin-modeles", "cpu", "Modèles d'IA")]),
           ("Usage et facturation", [("admin-analytics", "chart-column", "Analytique"), ("admin-facturation", "receipt", "Facturation")]),
           ("Compte", [("admin-general", "building-2", "Détails de l'entreprise"), ("admin-profil", "shield-check", "Compte administrateur")])]

def admin_page(actif, titre, corps, brand):
    nav = ""
    for g, its in ADM_NAV:
        nav += f'<div class="lb">{g}</div>' + "".join(f'<a class="it{" on" if k == actif else ""}" href="{k}.html">{ic(i, "s")} {l}</a>' for k, i, l in its)
    snav = ""
    autre = "client" if brand == "yelema" else "yelema"
    top = f"""<header class="top"><div class="crumb grow"><a href="admin.html">Administration</a> {ic("chevron-right", "s")} <b>{titre}</b></div>{modes_btn(actif, brand)}
<a class="tbtn hide-m" href="#" data-open="inv">{ic("mail-plus", "s")} Inviter un membre</a><a class="tbtn pr" href="recruter.html">{ic("user-plus", "s")} Recruter un expert</a><button class="tbtn ico" data-pop="notifs" aria-label="Notifications">{ic("bell", "s")}<span class="bdg">4</span></button></header>"""
    return (b3.head(titre, brand) + f'<div class="app adm-app">{sidebar_admin(actif, brand)}<main style="min-width:0">{top}<div class="adm adm1">{snav}<div class="page"><div class="sform" style="max-width:1080px">{corps}</div></div></div></main></div>'
            + pops() + modes_pop(actif, brand) + yele() + modales() + fin())

def sg(rows):
    return '<div class="sg">' + "".join(f'<div><div class="grow"><b>{t}</b><span class="d">{d}</span></div>{f"<div class=ctl>{c}</div>" if c else ""}</div>' for t, d, c in rows) + "</div>"

SECTEURS = ["Agroalimentaire", "Biscuits et confiserie", "Grande distribution", "Industrie", "Banque et assurance", "Télécoms", "Énergie", "Santé", "Éducation", "Services", "Secteur public"]
RS = [("LinkedIn", "linkedin.com", "linkedin.com/company/unifood-ci"), ("Facebook", "facebook.com", "facebook.com/unifoodci"), ("Instagram", "instagram.com", "instagram.com/sossa.ci"),
      ("TikTok", "tiktok.com", ""), ("YouTube", "youtube.com", ""), ("X", "x.com", "")]
def fin_(v, ph="", t="text"):
    return f'<input class="fi" type="{t}" value="{v}" placeholder="{ph}">'
def adm_general(brand):
    sw = '<div class="sw3"><i style="background:#E00040"></i><i style="background:#F8B400"></i><i style="background:#5A1022"></i></div>'
    seg = f'<div class="seg"><a href="../yelema/admin-general.html" class="{"on" if brand == "yelema" else ""}">Yelema</a><a href="../client/admin-general.html" class="{"on" if brand == "client" else ""}">Vos couleurs</a></div>'
    sect = '<details class="ms"><summary><span class="msv"><em>Agroalimentaire</em><em>Biscuits et confiserie</em></span>' + ic("chevron-down", "s") + '</summary><div class="msl">' + "".join(
        f'<label><input type="checkbox"{" checked" if x in ("Agroalimentaire", "Biscuits et confiserie") else ""}> {x}</label>' for x in SECTEURS) + '</div></details>'
    rs = "".join(f'<label class="rsx"><img src="{FAV}{d}" alt=""><span>{n}</span>{fin_(v, "Ajouter le lien")}</label>' for n, d, v in RS)
    logo = (f'<img src="{B}unifood.png" alt="" style="width:52px;height:52px"><details class="dlm"><summary class="btn o sm">{ic("download", "s")} Télécharger</summary><div class="dll">'
            + "".join(f'<a href="#" data-toast="Téléchargement : logo-unifood.{x.lower()}">{x}</a>' for x in ("PNG", "SVG", "PDF", "JPG")) + f'</div></details><a class="btn o sm" href="#" data-toast="Choisissez un fichier">Changer</a>')
    corps = f"""<div style="max-width:880px"><h1>Détails de l'entreprise</h1><p class="sub">Ce que vos experts savent de votre entreprise. Tout se modifie ici.</p>
<h3 class="h3s">L'entreprise</h3>
{sg([("Nom de l'entreprise", "Affiché partout dans l'espace", fin_("Unifood")), ("Secteur", "Plusieurs choix possibles", sect),
     ("Description", "Lue par les experts avant chaque travail", '<textarea class="fi fta" rows="3">Fabricant ivoirien de biscuits et de confiseries, présent dans toute l\'Afrique de l\'Ouest avec les marques Sossa et Super Mint.</textarea>'),
     ("Site web", "", fin_("unifood.info", "https://")),
     ("Marques", "Une étiquette par marque", '<div class="tagin"><span>Sossa<button aria-label="Retirer">×</button></span><span>Super Mint<button aria-label="Retirer">×</button></span><input type="text" placeholder="Ajouter une marque" aria-label="Ajouter une marque"></div>'),
     ("Adresse", "", fin_("Zone industrielle de Yopougon, Abidjan")), ("Téléphone", "Standard de l'entreprise", fin_("+225 27 23 00 00 00", "", "tel")),
     ("Email du service client", "Si vous en avez un", fin_("contact@unifood.info", "", "email"))])}
<h3 class="h3s">Réseaux sociaux</h3><div class="rsg">{rs}</div>
<h3 class="h3s">Contacts</h3>
{sg([("Référent administrateur", "La personne que Yelema contacte", '<span class="fi2">' + fin_("Aïcha Diabaté") + fin_("aicha.diabate@unifood.info", "", "email") + fin_("+225 07 00 00 00 00", "Téléphone", "tel") + '</span>'),
     ("Email de facturation", "Les factures y sont envoyées", fin_("compta@unifood.info", "", "email")), ("Compte contribuable", "", fin_("CI-ABJ-2009-B-1234")), ("RCCM", "Registre du commerce", fin_("CI-ABJ-03-2009-B13-01234"))])}
<h3 class="h3s">Identité visuelle</h3><p class="sub">Lue par les experts avant chaque visuel</p>
{sg([("Logo", "Plusieurs formats", logo),
     ("Couleurs", "Dans l'ordre d'importance", sw + '<a class="ib" href="#" data-toast="Choisissez une couleur" style="width:32px;height:32px">' + ic("plus", "s") + '</a>'),
     ("Habillage de l'espace", "Couleurs Yelema avec votre logo, ou vos couleurs", seg),
     ("Charte de marque", "PDF de la charte, lu par les experts", f'<span class="xs mute3">charte-sossa-2026.pdf</span><a class="btn o sm" href="#" data-toast="Choisissez un fichier">{ic("upload", "s")} Remplacer</a>')])}
<h3 class="h3s">Activité</h3>
{sg([("<span class='row'><span class='dot'></span> En service</span>", "Vos 6 experts travaillent et prennent les demandes", f'<a class="btn o sm" href="#" data-toast="Toute l\'équipe d\'experts est en pause">{ic("pause", "s")} Tout mettre en pause</a>')])}
<h3 class="h3s">Hébergement</h3>
{sg([("Cloud dédié", "Vos livrables restent dans votre cloud et sont transférables à tout moment", f'<a class="btn o sm" href="#" data-toast="Demande d’export envoyée : vous recevez le lien par email sous 24 h">{ic("download", "s")} Demander un export</a>')])}
<div class="row" style="justify-content:flex-end;margin-top:18px"><a class="btn p" href="#" data-toast="Modifications enregistrées">Enregistrer</a></div></div>"""
    return admin_page("admin-general", "Détails de l'entreprise", corps, brand)

def adm_general_ancien(brand):
    sw = '<div class="sw3"><i style="background:#E00040"></i><i style="background:#F8B400"></i><i style="background:#5A1022"></i></div>'
    seg = f'<div class="seg"><a href="../yelema/admin.html" class="{"on" if brand == "yelema" else ""}">Yelema</a><a href="../client/admin.html" class="{"on" if brand == "client" else ""}">Unifood</a></div>'
    corps = f"""<div style="max-width:820px"><h1>Détails de l'entreprise</h1><p class="sub">Ce que vos experts savent de votre entreprise, et ce que voient tous les membres</p>
{sg([("Nom de l'entreprise", "Affiché partout dans l'espace", '<span class="inp2">Unifood</span>'), ("Secteur", "", '<span class="inp2">Agroalimentaire, biscuits et confiserie</span>'),
     ("Siège", "", '<span class="inp2">Zone industrielle de Yopougon, Abidjan</span>'), ("Site", "", '<span class="inp2">unifood.info</span>'),
     ("Marques", "Lues par les experts avant chaque contenu", '<span class="inp2">Sossa, Super Mint</span>')])}
<h3 class="h3s">Identité visuelle</h3><p class="sub">Logo, couleurs et charte, lus par les experts avant chaque visuel</p>
{sg([("Logo", "En haut de chaque page et sur les livrables", f'<img src="{B}unifood.png" alt="" style="width:52px;height:52px"><a class="btn o sm" href="#">Changer</a>'),
     ("Couleurs", "Dans l'ordre d'importance", sw + '<a class="ib" href="#" style="width:32px;height:32px">' + ic("plus", "s") + '</a>'),
     ("Habillage de l'espace", "Couleurs Yelema avec votre logo, ou vos couleurs", seg)])}
<div class="sg" style="margin-top:8px"><div style="flex-direction:column;align-items:stretch"><div><b>Charte de marque</b><span class="d">Préparée avec Koffi dans Telegram. Texte libre lu par les experts.</span></div><div class="ta">Sossa : rouge #E00040, jaune #F8B400, ton joyeux et familial. Super Mint : vert menthe, ton jeune. Toujours le logo en haut à gauche…</div></div></div>
<h3 class="h3s">Activité</h3><p class="sub">Mettre toute l'équipe d'experts en pause d'un coup</p>
{sg([("<span class='row'><span class='dot'></span> En service</span>", "Vos 3 experts travaillent et prennent les demandes", f'<a class="btn o sm" href="#">{ic("pause", "s")} Tout mettre en pause</a>')])}
<h3 class="h3s">Hébergement</h3>{sg([("Cloud dédié en Côte d'Ivoire", "Les livrables restent dans le Drive de l’entreprise", '<span class="pill ok">Actif</span>')])}</div>"""
    return admin_page("admin-general", "Détails de l'entreprise", corps, brand)

def adm_connect(brand):
    acc = {"Gmail": "tous", "Google Drive": "tous", "Google Agenda": "tous", "Canva": ["fatima", "koffi"], "Meta Business": ["fatima"], "Slack": "tous", "Microsoft Teams": ["djeneba"]}
    rows = ""
    for n, dom, d, c, on in CX2:
        a = acc.get(n)
        who = ('<span class="pill" style="background:var(--soft-2)">Tous les experts</span>' if a == "tous" else
               ('<span class="row" style="gap:0">' + "".join(f'<img class="xav" src="{B}{k}.jpg" alt="{EXPERTS[k]["prenom"]}" title="{EXPERTS[k]["prenom"]}">' for k in a) + '</span>' if a else '<span class="xs mute3">Aucun</span>'))
        ctl = (f'<a class="btn o sm" href="#" data-open="cxa" data-app="{n}">Choisir les experts</a>' if on else f'<a class="btn k sm" href="#" data-open="cz" data-app="{n}">Connecter</a>')
        rows += f'<tr data-q="{n.lower()}"><td><div class="who"><img src="{FAV}{dom}" alt="" style="width:28px;height:28px;border-radius:7px"><span><b>{n}</b><br><span class="xs mute3">{d}</span></span></div></td><td class="hide-m">{c}</td><td>{who}</td><td>{ctl}</td></tr>'
    corps = f"""<div class="hello"><div class="grow"><h1>Connecteurs</h1><p class="sub">Vos outils branchés une fois, puis donnés aux experts qui en ont besoin</p></div><span class="composio">{ic("plug-zap", "s")} Fournis par Composio</span></div>
<div class="cfil" style="margin-top:12px"><label class="srch czs">{ic("search", "s")}<input type="search" placeholder="Chercher un outil" aria-label="Chercher un outil" data-tq></label></div>
<div class="box" style="margin-top:10px"><table class="tbl"><tr><th>Outil</th><th class="hide-m">Catégorie</th><th>Experts qui y ont accès</th><th></th></tr>{rows}</table></div>"""
    return admin_page("admin-connecteurs", "Connecteurs", corps, brand)

def modal_cxa():
    xs = "".join(f'<label class="cxo"><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{n}</b><small>{r}</small></span><button class="sw swx{"" if k in ("djeneba", "fatima", "kouassi") else " off"}" data-nom="{n}" aria-label="Accès de {n}"></button></label>' for k, n, r, *_ in ALL_EXPERTS)
    return f"""<div class="modal" id="cxa"><div class="ov" data-close></div><div class="pn shpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Accès des experts</h2><p class="sm mute">Donnez cet outil à toute l'équipe d'experts, ou seulement à certains.</p>
<div class="seg shs" data-sh2><a class="on" href="#">Tous les experts</a><a href="#">Choisir</a></div>{xs}
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><a class="btn o" href="#" data-close>Annuler</a><a class="btn p" href="#" data-close data-toast="Accès mis à jour">Enregistrer</a></div></div></div>"""

UTIL = {"djeneba": ["AD", "SB", "JA"], "fatima": ["AD", "NT"], "koffi": ["YK", "AD"], "kouassi": ["FB", "KO"], "adjoua": ["MK"], "mamadou": ["IS"], "awa": ["RT"]}

MODELES = [("Claude", "Anthropic", "anthropic.com", True, "Clé de l'entreprise, sk-ant-••••8f2", "Rédaction, analyse, documents longs"),
           ("Gemini", "Google", "gemini.google.com", True, "Clé de l'entreprise, AIza••••Qe4", "Images, tableurs, Google Workspace"),
           ("GPT", "OpenAI", "openai.com", False, "Pas de clé", "Usage général"),
           ("Mistral Large", "Mistral AI", "mistral.ai", True, "Fourni par Yelema", "Hébergé en Europe"),
           ("Llama", "Meta", "meta.com", True, "Fourni par Yelema, sur votre cloud dédié", "Données qui ne sortent pas")]
def adm_modeles(brand):
    t = ""
    for n, ed, dom, on, cle, use in MODELES:
        btn = (f'<a class="btn o sm" href="#" data-toast="Clé {n} remplacée">{ic("key-round", "s")} Changer la clé</a>' if on and "Clé" in cle
               else (f'<span class="xs mute3">{ic("shield-check", "s")} Inclus</span>' if on else f'<a class="btn k sm" href="#" data-open="mkey" data-app="{n}">{ic("plus", "s")} Ajouter une clé</a>'))
        t += (f'<div class="cn2{"" if on else " off"}"><div class="row" style="justify-content:space-between"><span class="cnl"><img src="{FAV}{dom}" alt=""></span>{f'<span class="sti on">{ic("circle-check")}</span>' if on else ""}</div>'
              f'<b>{n}</b><span class="xs mute3">{ed}, {use}</span><span class="xs">{cle}</span>{btn}</div>')
    xs = "".join(f'<tr><td><span class="who"><img src="{B}{k}.jpg" alt=""><span><b>{nm}</b><br><span class="xs mute3">{r}</span></span></span></td><td><select class="fi"><option>{"Claude" if k != "koffi" else "Gemini"}</option><option>Gemini</option><option>Mistral Large</option><option>Llama</option></select></td></tr>' for k, nm, r, *_ in ALL_EXPERTS[:6])
    corps = f"""<div class="hello"><div class="grow"><h1>Modèles d'IA</h1><p class="sub">Les modèles que vos experts utilisent. Yelema fournit des modèles par défaut, vous pouvez aussi brancher vos propres clés.</p></div></div>
<div class="cn2g" style="margin-top:16px">{t}</div>
<h3 class="h3s">Modèle par expert</h3><p class="sub">Chaque membre peut aussi choisir un autre modèle dans la discussion</p>
<div class="box" style="margin-top:10px"><table class="tbl"><tr><th>Expert</th><th>Modèle par défaut</th></tr>{xs}</table></div>
<div class="modal" id="mkey"><div class="ov" data-close></div><div class="pn shpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button><h2>Ajouter une clé</h2><p class="sm mute">Votre clé reste chiffrée. Vous pouvez la retirer à tout moment.</p>
<label class="fl2"><span>Clé d'API</span><input class="fi" type="password" placeholder="sk-..." style="width:100%"></label>
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px"><a class="btn o" href="#" data-close>Annuler</a><a class="btn p" href="#" data-close data-toast="Clé enregistrée et vérifiée">Enregistrer</a></div></div></div>"""
    return admin_page("admin-modeles", "Modèles d'IA", corps, brand)

def adm_experts(brand):
    NOMS = {i: n for i, n, *_ in MEMBRES}
    rows = ""
    for k, n, r, sv, u, lv, p, on in ALL_EXPERTS:
        ppl = "".join(f'<span class="mbx">{face(i, "", 26)}<span>{NOMS[i].split(" ")[0]}</span></span>' for i in UTIL[k])
        prix = "Incluse" if p == "incluse" else ("Pas facturée" if not on else (f"2 × 200 000 F CFA" if k == "kouassi" else f"{p} F CFA"))
        rows += (f'<tr><td><a class="who" href="{xh(k)}"><img src="{B}{k}.jpg" alt=""><span><b>{n}</b><br><span class="xs mute3">{r}</span></span></a></td>'
                 f'<td class="hide-m"><div class="mbs">{ppl}<a class="ib mba" href="#" data-open="inv" aria-label="Ajouter un membre">{ic("plus", "s")}</a></div></td><td class="num">{lv}</td><td class="num">{prix}</td>'
                 f'<td><button class="sw{"" if on else " off"} swx" data-nom="{n}" aria-label="En service"></button></td></tr>')
    corps = f"""<div class="hello"><div class="grow"><h1>Experts</h1><p class="sub">7 en service dont Kouassi en deux exemplaires, 1 en pause</p></div><a class="btn p" href="recruter.html">{ic("user-plus", "s")} Recruter un expert</a></div>
<div class="box" style="margin-top:16px"><table class="tbl"><tr><th>Expert</th><th class="hide-m">Membres qui l'utilisent</th><th>Livrables</th><th>Par mois</th><th>En service</th></tr>{rows}</table></div>"""
    return admin_page("admin-experts", "Experts", corps, brand)

def adm_canaux(brand):
    t = ""
    for n, d, on, det, u, lib in CANAUX:
        logo = TG if n == "Telegram" else f'<img src="{FAV}{d}" alt="">'
        btn = (f'<a class="btn k sm" href="{u}" target="_blank" rel="noopener">Ouvrir {ic("arrow-up-right", "s")}</a>' if on and u.startswith("http")
               else (f'<a class="btn k sm" href="#" data-toast="Ouverture de la messagerie">Ouvrir {ic("arrow-right", "s")}</a>' if on else f'<a class="btn o sm" href="#" data-open="cz" data-app="{n}">{ic("plus", "s")} Connecter</a>'))
        t += (f'<div class="cn2{"" if on else " off"}"><div class="row" style="justify-content:space-between"><span class="cnl">{logo}</span>{f'<span class="sti on">{ic("circle-check")}</span>' if on else ""}</div>'
              f'<b>{n}</b><span class="xs mute3">{det}</span>{btn}</div>')
    corps = f"""<div class="hello"><div class="grow"><h1>Canaux</h1><p class="sub">Où vos experts vous parlent, pour toute l'organisation</p></div></div>
<div class="cn2g" style="margin-top:16px">{t}</div>
<p class="xs mute3" style="margin-top:12px">Telegram est le canal conseillé : un groupe pour l'entreprise, un sujet par expert.</p>"""
    return admin_page("admin-canaux", "Canaux", corps, brand)

def adm_experts_ancien(brand):
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
    droits = [("Voir son tableau de bord", "ooo"), ("Parler aux experts de son équipe", "ooo"), ("Utiliser le chat entreprise", "ooo"), ("Recruter un expert et l'assigner", "onn"),
              ("Inviter des membres", "onn"), ("Voir la facturation", "onn"), ("Voir le suivi de l'équipe", "oon"), ("Changer la charte et les réglages", "onn")]
    tr = "".join(f'<tr><td>{l}</td>{"".join(ok if c == "o" else no for c in r)}</tr>' for l, r in droits)
    mem = [("AD", "#7A4E2D", "Aïcha Diabaté", "Directrice marketing", "Responsable", "Djénéba, Fatima"), ("SB", "#2E4EC4", "Serge Bamba", "Direction administrative", "Direction", "Djénéba"),
           ("YK", "#0F7B5F", "Yao Kra", "Graphiste", "Équipe", "Koffi"), ("NT", "#8A3B12", "Nadège Touré", "Chargée de communication", "Équipe", "Fatima"),
           ("KO", "#5A1022", "Kader Ouattara", "Commercial", "Équipe", "Chat entreprise")]
    ml = "".join(f'<tr><td><a class="who" href="admin-membre.html">{face(i, "", 36)}<span><b>{n}</b><br><span class="xs mute3">{po}</span></span></a></td><td class="hide-m">{svc}</td><td><span class="pill br">{r}</span></td><td><a class="link" href="admin-membre.html">Voir</a></td></tr>' for i, n, po, svc, r in MEMBRES)
    corps = f"""<div class="hello"><div class="grow"><h1>Membres et droits</h1><p class="sub">14 membres, 2 invitations en attente</p></div><a class="btn p" href="#" data-open="inv">{ic("user-plus", "s")} Inviter un membre</a></div>
<div class="box" style="margin-top:16px"><table class="tbl"><tr><th>Membre</th><th class="hide-m">Service</th><th>Rôle</th><th></th></tr>{ml}</table></div>
<div class="box" style="margin-top:14px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Qui peut faire quoi</h2></div><table class="tbl"><tr><th></th><th style="text-align:center">Admin</th><th style="text-align:center">Responsable</th><th style="text-align:center">Équipe</th></tr>{tr}</table></div>"""
    return admin_page("admin-membres", "Membres et droits", corps, brand)

JEKO_BTN = '<a class="btn jk sm" href="#" data-open="jeko"><b>jèko</b> Payer avec Jèko</a>'
def modal_jeko():
    ms = [("Wave", "wave.com"), ("Orange Money", "orange.ci"), ("MTN MoMo", "mtn.ci"), ("Moov Money", "moov-africa.ci"), ("Carte Visa ou Mastercard", "visa.com")]
    opts = "".join(f'<label class="jm{" on" if i == 0 else ""}"><img src="{FAV}{d}" alt=""><span class="grow">{n}</span><i></i></label>' for i, (n, d) in enumerate(ms))
    return f"""<div class="modal" id="jeko"><div class="ov" data-close></div><div class="pn jkp"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<div class="jkh"><span class="jkl">jèko</span><span class="xs" style="opacity:.85">Paiement sécurisé</span></div>
<div class="jkb"><p class="xs mute3">Facture de novembre, Yelema</p><div class="jka num">1 300 000 F CFA</div>
<b class="sm">Payer avec</b><div class="jms">{opts}</div>
<div class="fl2"><span class="xs mute3">Numéro mobile money</span><input class="fi" type="tel" value="+225 07 00 00 00 00" aria-label="Numéro de paiement"></div>
<a class="btn p jgo" href="#">Payer 1 300 000 F CFA</a>
<p class="xs mute3" style="text-align:center;margin-top:8px">Vous validez sur votre téléphone. Le reçu arrive par email.</p></div></div></div>"""

SHCH = "".join(f'<a class="shc" href="#" data-toast="{t}"><img src="{FAV}{d}" alt="">{n}</a>' for n, d, t in
               [("Telegram", "telegram.org", "Envoyé dans Telegram"), ("Slack", "slack.com", "Envoyé dans Slack"), ("Teams", "teams.microsoft.com", "Envoyé dans Teams"), ("WhatsApp", "whatsapp.com", "Envoyé sur WhatsApp"), ("E-mail", "gmail.com", "Envoyé par e-mail")])
def modal_share():
    ppl = "".join(f'<div class="shp">{face(i, "", 32)}<span class="grow"><b class="sm">{n}</b><span class="xs mute3">{r}</span></span><span class="seg shr2" role="radiogroup" aria-label="Droit de {n}"><a{" class=on" if d == "Lecture" else ""} data-v="l">{ic("eye", "s")} Lecture</a><a{" class=on" if d == "Édition" else ""} data-v="e">{ic("pencil", "s")} Édition</a></span><button class="ib shx" aria-label="Retirer {n}" data-toast="{n} n’a plus accès">{ic("x", "s")}</button></div>'
                  for i, n, r, d in [("JA", "Jean-Marc Aka", "Directeur général", "Lecture"), ("SB", "Serge Bamba", "Directeur administratif", "Édition")])
    blocs = "".join(f'<label class="shb"><input type="checkbox" checked> {w[1]}</label>' for w in TDB["djeneba"])
    return f"""<div class="modal" id="share"><div class="ov" data-close></div><div class="pn shpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Partager le tableau</h2><p class="sm mute">Pilotage de la direction, semaine du 28 septembre</p>
<div class="seg shs" data-sh><a class="on" href="#" data-v="prive">{ic("users", "s")} À des personnes</a><a href="#" data-v="public">{ic("link", "s")} Par un lien</a></div>
<div class="shv on" id="sh-prive"><label class="shadd">{ic("search", "s")}<input type="text" placeholder="Ajouter un membre par son nom ou son email" aria-label="Ajouter un membre"><button class="btn p sm" type="button" data-toast="Invitation envoyée, en lecture">Inviter</button></label>
{ppl}</div>
<div class="shv" id="sh-public"><p class="xs mute3">Pour l’extérieur : un client, un investisseur, un partenaire. Sans connexion, en lecture seule, avec la signature Powered by Yelema en bas de page.</p>
<div class="lnk"><span class="ell">yelema.ai/p/tdb-djeneba-7Hk2</span><a class="btn o sm" href="#" data-toast="Lien copié">{ic("copy", "s")} Copier</a></div></div>
<div class="sg"><div><div class="grow"><b>Masquer les montants</b><span class="d">Budgets, coûts et prix</span></div><button class="sw swx off" data-nom="Montants masqués" aria-label="Masquer les montants"></button></div>
<div><div class="grow"><b>Masquer les noms des membres</b><span class="d">Remplacés par leur service</span></div><button class="sw swx off" data-nom="Noms masqués" aria-label="Masquer les noms"></button></div>
<div><div class="grow"><b>Expire le</b><span class="d">90 jours au maximum, renouvelable</span></div><div class="ctl"><select class="fi shexp" aria-label="Durée"><option>Dans 7 jours</option><option selected>Dans 30 jours</option><option>Dans 90 jours</option><option value="d">Date au choix</option></select><input class="fi shdt" type="date" min="2026-10-02" max="2026-12-30" value="2026-10-31" aria-label="Date d’expiration" hidden></div></div></div>
<h3 class="shh">Ou l’envoyer directement</h3><div class="shch">{SHCH}</div>
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:16px"><a class="btn o" href="#" data-close>Annuler</a><a class="btn p" href="#" data-close data-toast="Tableau de bord partagé">Partager</a></div></div></div>"""


def paylogo(n):
    L = {"Wave": ('<img src="' + FAV + 'wave.com" alt="">', "#1DC8F2"), "Orange Money": ("<b>OM</b>", "#FF7900"), "MTN MoMo": ("<b>MTN</b>", "#FFCB05"),
         "Moov Money": ("<b>moov</b>", "#0B4EA2"), "Djamo": ("<b>djamo</b>", "#111111"), "Carte bancaire": (ic("credit-card", "s"), "#1A1F71"), "Dépôt ou virement": (ic("landmark", "s"), "#5B5BD6")}
    v, c = L[n]
    return f'<span class="pyl" style="--pc:{c}">{v}</span>'
PAYS = [("Wave", "Paiement instantané"), ("Orange Money", "Paiement instantané"), ("MTN MoMo", "Paiement instantané"), ("Moov Money", "Paiement instantané"), ("Djamo", "Carte et compte Djamo"),
        ("Carte bancaire", "Visa ou Mastercard"), ("Dépôt ou virement", "Avec bordereau")]

def adm_factu(brand):
    fac = "".join(f'<tr><td><b class="num">{r}</b><br><span class="xs mute3">{m_}</span></td><td class="num">{v} F CFA</td><td><span class="pill {c}">{l}</span></td><td class="hide-m xs mute3">{mp}</td><td><a class="link" href="#" data-toast="Téléchargement : {r}.pdf">{ic("download", "s")} PDF</a></td></tr>' for r, m_, v, c, l, mp in
                  [("INV-2026-10-0002", "Octobre 2026", "1 300 000", "ok", "Payée", "Wave"), ("INV-2026-09-0001", "Septembre 2026, avec la mise en place", "1 300 000", "ok", "Payée", "Dépôt, bordereau reçu")])
    pays = "".join(f'<label class="pyo{" on" if i == 0 else ""}" data-pay="{n}">{paylogo(n)}<span class="grow"><b>{n}</b><small>{d}</small></span><i></i></label>' for i, (n, d) in enumerate(PAYS))
    lignes = "".join(f'<div class="fxl"><img src="{B}{k}.jpg" alt=""><span class="grow">{n}<small>{r}</small></span><b class="num">{p}</b></div>' for k, n, r, p in
                     [("djeneba", "Djénéba", "Chief of Staff", "Incluse"), ("fatima", "Fatima", "Premier expert", "300 000"), ("koffi", "Koffi", "Design", "200 000"),
                      ("kouassi", "Kouassi", "Ventes, 2 exemplaires (Fanta et Kader)", "400 000"), ("adjoua", "Adjoua", "Recrutement", "200 000"), ("mamadou", "Mamadou", "Finance", "200 000")])
    corps = f"""<div class="hello"><div class="grow"><h1>Facturation</h1><p class="sub">Suivez votre formule et vos factures</p></div></div>
<div class="fx3"><div class="fxk"><small>Formule</small><b>Experts Yelema</b><span>6 experts en service, jusqu'à 50 membres</span></div>
<div class="fxk"><small>Consommation du mois</small><b class="num">126 livrables</b><span class="ok">sans dépassement</span></div>
<div class="fxk fxn"><small>Prochaine facture</small><b class="num">1 300 000 F CFA</b><span>le 01/11/2026</span><a class="btn p sm" href="#payer">{ic("wallet", "s")} Payer maintenant</a></div></div>
<div class="fxg"><section class="box" id="payer"><div class="ch"><h2 style="font-size:16px;font-weight:650">Payer la facture de novembre</h2><b class="num">1 300 000 F CFA</b></div>
<div class="pys">{pays}</div>
<div class="pyd" data-pd="mm"><span class="xs mute3">Numéro mobile money</span><input class="fi" type="tel" value="+225 07 00 00 00 00" aria-label="Numéro de paiement"><a class="btn p" href="#" data-toast="Validez le paiement sur votre téléphone">Payer 1 300 000 F CFA</a><p class="xs mute3">Vous validez sur votre téléphone. Le reçu arrive par email.</p></div>
<div class="pyd" data-pd="dep" hidden><ol class="pyst"><li><b>Téléchargez le bordereau</b><span>Il porte la référence de votre facture et nos coordonnées bancaires.</span><a class="btn o sm" href="#" data-toast="Téléchargement : bordereau-INV-2026-11-0003.pdf">{ic("download", "s")} Bordereau PDF</a></li>
<li><b>Faites le dépôt ou le virement</b><span>En agence ou depuis votre banque, avec la référence INV-2026-11-0003.</span></li>
<li><b>Envoyez-nous le bordereau tamponné</b><span>Une photo ou un PDF suffit. Nous confirmons sous 24 h.</span><label class="drop2"><input type="file" hidden>{ic("upload", "s")} Déposer le bordereau</label></li></ol></div></section>
<section class="box"><div class="ch"><h2 style="font-size:16px;font-weight:650">Ce que vous payez</h2><a class="link sm" href="admin-experts.html">Gérer les experts</a></div>{lignes}
<div class="fxl fxt"><span class="grow"><b>Total par mois</b></span><b class="num">1 300 000 F CFA</b></div><p class="xs mute3" style="margin-top:8px">Awa est en pause : elle n'est pas facturée.</p></section></div>
<section class="box" style="margin-top:14px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Historique</h2><span class="xs mute3">Factures envoyées à compta@unifood.info</span></div><table class="tbl"><tr><th>Facture</th><th>Montant</th><th>État</th><th class="hide-m">Payée par</th><th></th></tr>{fac}</table></section>"""
    return admin_page("admin-facturation", "Facturation", corps, brand)

def adm_factu_ancien(brand):
    fac = "".join(f'<tr><td>{m_}</td><td class="num">{v}</td><td><span class="pill {s}">{l}</span></td><td><a class="link" href="#">{ic("download", "s")} PDF</a></td></tr>' for m_, v, s, l in
                  [("Novembre 2026", "1 300 000", "ac", "À venir"), ("Octobre 2026", "1 300 000", "ok", "Payée par Wave"), ("Septembre 2026", "1 300 000", "ok", "Payée par Jèko, Orange Money")])
    pm = "".join(f'<div class="pm"><img src="{FAV}{d}" alt=""><span class="grow"><b>{n}</b><small>{x}</small></span>{t}</div>' for n, d, x, t in
                 [("Jèko, Wave", "wave.com", "+225 07 •• •• 00 00", '<span class="pill ok">Par défaut</span>'), ("Jèko, Orange Money", "orange.ci", "+225 05 •• •• 11 22", '<a class="link sm" href="#" data-toast="Moyen par défaut changé">Par défaut</a>'),
                  ("Carte Visa", "visa.com", "•••• 4242, expire 08/28", '<a class="link sm" href="#" data-toast="Moyen par défaut changé">Par défaut</a>'), ("Virement bancaire", "bceao.int", "Société Générale CI, RIB sur la facture", '<a class="link sm" href="#" data-toast="RIB copié">Copier le RIB</a>')])
    corps = f"""<div style="max-width:980px"><h1>Facturation</h1><p class="sub">Suivez votre formule, vos moyens de paiement et vos factures</p>
<div class="fk3"><div class="fk"><span>Formule</span><b>Experts Yelema</b><small>6 experts actifs, jusqu'à 50 membres</small></div><div class="fk"><span>Consommation du mois</span><b>126 livrables</b><small class="ok">sans dépassement</small></div><div class="fk"><span>Prochaine facture</span><b class="num">1 300 000 F CFA</b><small>le 1er novembre</small></div></div>
<div class="box" style="margin-top:14px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Moyens de paiement</h2><a class="btn o sm" href="#" data-open="jeko">{ic("plus", "s")} Ajouter</a></div>{pm}</div>
<div class="box" style="margin-top:14px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Compte de facturation</h2><a class="btn o sm" href="#" data-toast="Modification ouverte">Modifier</a></div>
{sg([("Raison sociale", "", '<span class="inp2">Unifood SA</span>'), ("Compte contribuable", "", '<span class="inp2">CI-ABJ-2009-B-1234</span>'), ("Factures envoyées à", "", '<span class="inp2">compta@unifood.info</span>')])}</div>
{sg([("Prochaine facture", "Le 1er novembre", '<b class="num" style="font-size:22px">1 300 000 F CFA</b>'),
     ("Experts", "Djénéba incluse, plus 5 experts à 200 000 F CFA", '<a class="btn o sm" href="admin-experts.html">Gérer</a>'),
     ("Moyen de paiement", "Par Jèko : Wave, Orange Money, MTN, Moov ou carte", JEKO_BTN)])}
<div class="box" style="margin-top:16px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Factures</h2></div><table class="tbl"><tr><th>Mois</th><th>F CFA</th><th>État</th><th></th></tr>{fac}</table>
<p class="xs mute3" style="margin-top:10px">Septembre comprend la mise en place, réglée une fois au démarrage.</p></div></div>"""
    return admin_page("admin-facturation", "Facturation", corps, brand)

AN_SEM = [("S36", 31), ("S37", 48), ("S38", 57), ("S39", 66), ("S40", 74)]
AN_TACHES = [("fatima", "Fatima", 66, 4), ("kouassi", "Kouassi", 56, 5), ("koffi", "Koffi", 48, 3), ("mamadou", "Mamadou", 40, 2), ("adjoua", "Adjoua", 36, 4), ("djeneba", "Djénéba", 30, 1)]
AN_CX = [("Google Drive", "drive.google.com", 486), ("Gmail", "gmail.com", 412), ("Meta Business", "facebook.com", 208), ("Canva", "canva.com", 164),
         ("Slack", "slack.com", 97), ("Microsoft Teams", "teams.microsoft.com", 63), ("Google Agenda", "calendar.google.com", 41), ("Sage", "sage.com", 0)]
AN_FMT = [("PDF", 38), ("Excel", 27), ("Google Doc", 22), ("PNG", 24), ("PowerPoint", 9), ("Autres", 6)]
AN_MEM = [("AD", "Aïcha Diabaté", "Marketing", 31, 64, "aujourd'hui"), ("FB", "Fanta Bakayoko", "Commercial", 18, 40, "aujourd'hui"), ("NT", "Nadège Touré", "Marketing", 9, 21, "aujourd'hui"),
          ("MK", "Mariam Koné", "RH", 11, 19, "hier"), ("IS", "Ibrahim Sylla", "Finance", 8, 15, "hier"), ("YK", "Yao Kra", "Marketing", 6, 18, "hier"), ("SB", "Serge Bamba", "Direction", 3, 7, "mardi")]

def adm_analytics(brand):
    kp = "".join(f'<div class="an-k"><span>{l}</span><b class="num">{v}</b><small class="{c}">{d}</small></div>' for l, v, d, c in
                 [("Coût des experts", "1 300 000 F", "par mois, 6 exemplaires facturés", ""), ("Tâches terminées", "276", "+23 % par rapport au mois dernier", "up"),
                  ("Livrables produits", "126", "+18 % par rapport au mois dernier", "up"), ("Membres actifs", "11", "sur 14 comptes ouverts", "")])
    mx = max(v for _, v in AN_SEM)
    bars = "".join(f'<div class="an-b{" on" if n == len(AN_SEM) - 1 else ""}"><em class="num">{v}</em><i style="height:{v / mx * 100:.0f}%"></i><span>{w}</span></div>' for n, (w, v) in enumerate(AN_SEM))
    mt = max(a + b for _, _, a, b in AN_TACHES)
    tx = "".join(f'<a class="an-r" href="{xh(k)}"><span class="an-n"><img src="{B}{k}.jpg" alt="">{n}</span><i><b style="width:{a / mt * 100:.0f}%"></b><u style="width:{b / mt * 100:.0f}%"></u></i><em class="num">{a + b}</em></a>' for k, n, a, b in AN_TACHES)
    mc = max(v for *_, v in AN_CX)
    cx = "".join(f'<div class="an-r{" off" if not v else ""}"><span class="an-n"><img class="lg" src="{FAV}{d}" alt="">{n}</span><i><b style="width:{v / mc * 100:.0f}%"></b></i><em class="num">{v if v else "non lié"}</em></div>' for n, d, v in AN_CX)
    mf = max(v for _, v in AN_FMT)
    fm = "".join(f'<div class="an-r"><span class="an-n">{n}</span><i><b style="width:{v / mf * 100:.0f}%"></b></i><em class="num">{v}</em></div>' for n, v in AN_FMT)
    mem = "".join(f'<tr><td><a class="who" href="admin-membre.html">{face(i_, "", 34)}<span><b>{n}</b><br><span class="xs mute3">{sv}</span></span></a></td><td class="num">{a}</td><td class="num">{b_}</td><td class="hide-m">{x}</td></tr>' for i_, n, sv, a, b_, x in AN_MEM)
    dl = "".join(f'<a class="an-dl" href="#" data-toast="Téléchargement : {f}.csv"><span class="ic">{ic("download", "s")}</span><span><b>{t}</b><small>{d}</small></span></a>' for t, d, f in
                 [("Experts", "Coût, tâches terminées et en cours, livrables", "unifood-experts-octobre"), ("Membres", "Livrables reçus, messages, dernière connexion", "unifood-membres-octobre"),
                  ("Connecteurs", "État et éléments consultés par les experts", "unifood-connecteurs-octobre"), ("Ressources et livrables", "Documents fournis, produits, partagés, formats", "unifood-livrables-octobre")])
    cost = [("djeneba", "Djénéba", 0), ("fatima", "Fatima", 300000), ("kouassi", "Kouassi ×2", 400000), ("koffi", "Koffi", 200000), ("adjoua", "Adjoua", 200000), ("mamadou", "Mamadou", 200000)]
    cm = max(v for *_, v in cost)
    cst = "".join(f'<div class="an-r"><span class="an-n"><img src="{B}{k}.jpg" alt="">{n}</span><i><b style="width:{max(2, v / cm * 100):.0f}%"></b></i><em class="num">{"incluse" if not v else f"{v:,}".replace(",", " ")}</em></div>' for k, n, v in cost)
    sem = [("S37", 302000), ("S38", 302000), ("S39", 325000), ("S40", 325000)]
    sm_ = max(v for _, v in sem)
    sbar = "".join(f'<div class="an-b{" on" if n == len(sem) - 1 else ""}"><em class="num">{v // 1000} k</em><i style="height:{v / sm_ * 100:.0f}%"></i><span>{w}</span></div>' for n, (w, v) in enumerate(sem))
    ech = "".join(f'<div class="an-k"><span>{l}</span><b class="num">{v}</b><small>{d}</small></div>' for l, v, d in
                  [("Appels", "23", "5 h 10 au téléphone"), ("Emails envoyés", "176", "392 reçus et triés"), ("Rendez-vous suivis", "21", "dont 12 préparés par Djénéba"), ("Messages Telegram", "1 240", "canal le plus utilisé")])
    corps = f"""<div class="hello"><div class="grow"><h1>Analytique</h1><p class="sub">Ce que coûtent vos experts, ce qu'ils produisent, et qui s'en sert</p></div>
<div class="row" style="gap:8px;flex-wrap:wrap"><div class="seg an-per"><a>Semaine</a><a class="on">Mois</a><a>Trimestre</a></div><label class="anr">{ic("calendar", "s")}<input type="date" value="2026-09-01" aria-label="Du"><span>au</span><input type="date" value="2026-09-30" aria-label="Au"></label></div></div>
<h3 class="an-h">{ic("wallet", "s")} Coûts</h3>
<div class="an-ks">{kp.split('<div class="an-k">')[1] and '<div class="an-k">' + kp.split('<div class="an-k">')[1]}<div class="an-k"><span>Coût par livrable</span><b class="num">10 300 F</b><small class="up">-14 % sur le mois</small></div><div class="an-k"><span>Coût par membre</span><b class="num">92 900 F</b><small>14 membres</small></div><div class="an-k"><span>Temps rendu</span><b class="num">41 journées</b><small class="up">de travail ce mois-ci</small></div></div>
<div class="an-g"><section class="an-c"><header><h2>Coût par semaine</h2><span>F CFA, au prorata des jours</span></header><div class="an-bars">{sbar}</div></section>
<section class="an-c"><header><h2>Coût par expert</h2><span>F CFA par mois</span></header><div class="an-rs">{cst}</div></section></div>
<h3 class="an-h">{ic("gauge", "s")} Productivité</h3>
<div class="an-ks">{"".join('<div class="an-k">' + x for x in kp.split('<div class="an-k">')[2:4])}</div>
<div class="an-g"><section class="an-c"><header><h2>Tâches terminées</h2><span>par semaine, depuis l'arrivée des experts</span></header><div class="an-bars">{bars}</div></section>
<section class="an-c"><header><h2>Tâches par expert</h2><span>terminées et en cours</span></header><div class="an-rs">{tx}</div><div class="an-lg"><span><i></i>Terminées</span><span><i class="lt"></i>En cours</span></div></section></div>
<h3 class="an-h">{ic("users", "s")} Usage</h3>
<div class="an-ks">{"".join('<div class="an-k">' + x for x in kp.split('<div class="an-k">')[4:])}<div class="an-k"><span>Connecteurs branchés</span><b class="num">7</b><small>sur 20 proposés</small></div><div class="an-k"><span>Experts par membre</span><b class="num">1,8</b><small>en moyenne</small></div></div>
<div class="an-g"><section class="an-c"><header><h2>Connecteurs</h2><span>éléments consultés par les experts</span></header><div class="an-rs">{cx}</div></section>
<section class="an-c"><header><h2>Ressources et livrables</h2><span>ce mois-ci</span></header><div class="an-3"><div><b class="num">58</b><span>documents fournis</span></div><div><b class="num">126</b><span>livrables produits</span></div><div><b class="num">23</b><span>partagés à l’extérieur</span></div></div><div class="an-rs">{fm}</div></section></div>
<section class="an-c"><header><h2>Par membre</h2><span>ce mois-ci</span></header><table class="tbl"><tr><th>Membre</th><th>Livrables reçus</th><th>Messages aux experts</th><th class="hide-m">Dernière connexion</th></tr>{mem}</table></section>
<h3 class="an-h">{ic("messages-square", "s")} Échanges</h3><div class="an-ks">{ech}</div>
<section class="an-c"><header><h2>Télécharger les métriques</h2><span>mois en cours, au format CSV</span></header><div class="an-dls">{dl}</div></section>"""
    return admin_page("admin-analytics", "Analytique", corps, brand)

def adm_profil(brand):
    corps = f"""<div style="max-width:820px"><h1>Compte administrateur</h1><p class="sub">Séparé de votre compte utilisateur. Il sert seulement à gérer l’espace de l’entreprise.</p><div class="pfh" style="margin:12px 0 14px"><div class="pfav" style="width:96px;height:96px"><span class="adav big">{ic("shield-check")}</span></div><div><b style="font-size:20px">Administrateur</b><p class="sub">Tenu par Aïcha Diabaté, Directrice marketing</p></div></div>
{sg([("Nom du compte", "", '<span class="inp2">Administrateur</span>'), ("Adresse email", "Différente de l'adresse utilisateur", '<span class="inp2">admin@unifood.info</span>'),
     ("Notifications", "Un résumé chaque matin par email", '<span class="sw"></span>'), ("Double authentification", "Code par SMS à chaque connexion", '<span class="sw"></span>'),
     ("Mot de passe", "Différent de celui du compte utilisateur", f'<a class="btn o sm" href="#" data-open="mdp" data-mdwho="Compte administrateur, admin@unifood.info">{ic("key-round", "s")} Changer le mot de passe</a>'),
     ("Se déconnecter", "Quitter le compte administrateur", f'<a class="btn o sm" href="connexion.html#out-admin">{ic("log-out", "s")} Se déconnecter</a>')])}</div>"""
    return admin_page("admin-profil", "Compte administrateur", corps, brand)


# ---------------------------------------------------------------- canaux (Telegram, WhatsApp, Slack, Teams)
CANAUX = [("Telegram", "telegram.org", True, "Groupe de l'entreprise, un sujet par expert", "https://t.me/", "Ouvrir"),
          ("Slack", "slack.com", True, "Canal de l'équipe", "https://slack.com/", "Ouvrir"),
          ("Microsoft Teams", "teams.microsoft.com", True, "Équipe, canal Général", "https://teams.microsoft.com/", "Ouvrir"),
          ("WhatsApp", "whatsapp.com", False, "Numéro WhatsApp Business de l'entreprise", "#", "Connecter"),
          ("Email", "gmail.com", True, "Adresse dédiée par expert", "fatima.html#mail", "Ouvrir")]

def canaux_strip():
    it = "".join(f'<a class="chn{" on" if on else ""}" title="{n} {"activé" if on else "à activer"}" href="{u if on else "#"}"{" target=_blank rel=noopener" if on and u.startswith("http") else ""}{"" if on else " data-open=cz data-app=" + chr(34) + n + chr(34)}><span class="lg"><img src="{FAV}{d}" alt=""><i class="bd{" on" if on else ""}">{ic("check" if on else "plus", "s")}</i></span><b>{n}</b></a>' for n, d, on, _, u, _l in CANAUX)
    return f'<div class="chs"><span class="sm mute">Votre équipe répond aussi sur</span>{it}</div>'

def x_canaux(k):
    e = EXPERTS[k]
    t = ""
    for n, d, on, det, u, lib in CANAUX:
        det2 = (PRO[k]["mail"] if n == "Email" else (f"Sujet « {e['prenom']} » du groupe Unifood" if n == "Telegram" else det))
        logo = TG if n == "Telegram" else f'<img src="{FAV}{d}" alt="">'
        btn = (f'<a class="btn k sm" href="{u}" target="_blank" rel="noopener">{lib} {ic("arrow-up-right", "s")}</a>' if on and u.startswith("http")
               else (f'<a class="btn k sm" href="#" data-go="mail">{lib} {ic("arrow-right", "s")}</a>' if on else f'<a class="btn o sm" href="#" data-open="cz" data-app="{n}">{ic("plus", "s")} Connecter</a>'))
        t += f'<div class="cn2{"" if on else " off"}"><div class="row" style="justify-content:space-between"><span class="cnl">{logo}</span>{f'<span class="sti on">{ic("circle-check")}</span>' if on else ""}</div><b>{n}</b>{btn}</div>'
    return f"""<div class="h2x"><h2>Où parler à {e['prenom']}</h2></div><div class="cn2g">{t}</div>"""

def x_canaux_ancien(k):
    e = EXPERTS[k]
    rows = ""
    for n, d, on, det, u, lib in CANAUX:
        det2 = det.replace("@unifood", PRO[k]["mail"].split("@")[0] + "@unifood") if n == "Email" else (f"Sujet « {e['prenom']} » du groupe Unifood" if n == "Telegram" else det)
        btn = (f'<a class="btn k sm" href="{u}" target="_blank" rel="noopener">{TG if n == "Telegram" else f'<img class="tg" src="{FAV}{d}" alt="">'} {lib}</a>' if on and u.startswith("http")
               else (f'<a class="btn o sm" href="#" data-go="mail">{lib}</a>' if on else f'<a class="btn o sm" href="#" data-open="cz" data-app="{n}">{ic("plus", "s")} {lib}</a>'))
        rows += f'<div class="chrow"><img src="{FAV}{d}" alt=""><div class="grow"><b>{n}</b><span>{det2}</span></div>{f'<span class="sti on" title="Activé" aria-label="Activé">{ic("circle-check")}</span>' if on else f'<span class="sti" title="Non activé" aria-label="Non activé">{ic("circle-dashed")}</span>'}{btn}</div>'
    return f"""<div class="h2x"><h2>Où parler à {e['prenom']}</h2><span class="sm">Les messages arrivent aussi ici, dans Discussion</span></div>
<div class="chlist">{rows}</div>
<div class="gbox" style="margin-top:14px;display:flex;gap:12px;align-items:center"><span class="ib tgb">{TG}</span><div class="grow"><b>Votre tableau de bord dans Telegram</b><div class="sm mute">Chaque matin à 8 h, Djénéba l'envoie dans le sujet « Tableau de bord ».</div></div><a class="btn k sm" href="https://t.me/" target="_blank" rel="noopener">{TG} Ouvrir dans Telegram</a></div>"""

# ---------------------------------------------------------------- modales communes : appel, invitation, aperçu
def modal_call():
    return f"""<div class="modal" id="call"><div class="ov" data-close></div><div class="pn callp"><img class="cph" src="{B}fatima.jpg" alt="">
<div class="cin"><span class="xs" style="opacity:.8">Appel avec</span><h2 class="cnm">Fatima</h2><span class="ctm num">00:00</span><div class="wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
<div class="row" style="gap:14px;justify-content:center"><button class="cb" data-mute aria-label="Couper le micro">{ic("mic", "s")}</button><button class="cb" aria-label="Haut-parleur">{ic("volume-2", "s")}</button><button class="cb end" data-close aria-label="Raccrocher">{ic("phone-off", "s")}</button></div></div></div></div>"""

def modal_inv():
    xs = "".join(f'<label><input type="checkbox"{" checked" if k == "djeneba" else ""}><img src="{B}{k}.jpg" alt=""> {n}<small>{r}</small></label>' for k, n, r, *_ in ALL_EXPERTS)
    sv = "".join(f"<option>{x}</option>" for x in ("Marketing", "Commercial", "Finance", "RH", "Opérations", "Direction", "Juridique", "Logistique"))
    return f"""<div class="modal" id="inv"><div class="ov" data-close></div><div class="pn shpn invp2"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Inviter un membre</h2><p class="sm mute">Il ou elle reçoit un lien pour créer son compte, puis choisit son mot de passe.</p>
<div class="g2i"><label class="fl2"><span>Prénom</span><input class="fi" placeholder="Awa"></label><label class="fl2"><span>Nom</span><input class="fi" placeholder="Koné"></label></div>
<label class="fl2"><span>Adresse email</span><input class="fi" type="email" placeholder="prenom.nom@entreprise.com"></label>
<div class="fl2"><span>Téléphone</span><div class="phw"><input class="fi" type="tel" placeholder="+225 07 00 00 00 00"><span class="phk"><label><input type="checkbox" checked><img src="{FAV}telegram.org" alt=""> Telegram</label><label><input type="checkbox"><img src="{FAV}whatsapp.com" alt=""> WhatsApp</label></span></div></div>
<div class="g2i"><label class="fl2"><span>Service</span><select class="fi isv">{sv}<option value="autre">Autre</option></select><input class="fi isvo" placeholder="Nom du service" hidden></label>
<label class="fl2"><span>Rôle</span><select class="fi"><option>Membre</option><option>Responsable de service</option><option>Administrateur</option></select></label></div>
<div class="fl2"><span>Ses experts</span><details class="ms msx"><summary><span class="msv"><em>Djénéba</em></span>{ic("chevron-down", "s")}</summary><div class="msl">{xs}</div></details></div>
<div class="fl2"><span>Envoyer l'invitation par</span><div class="fmts"><label class="fmc"><input type="checkbox" checked><img src="{FAV}gmail.com" alt="" style="width:14px;height:14px"> Email</label><label class="fmc"><input type="checkbox" checked><img src="{FAV}telegram.org" alt="" style="width:14px;height:14px"> Telegram</label><label class="fmc"><input type="checkbox"><img src="{FAV}whatsapp.com" alt="" style="width:14px;height:14px"> WhatsApp</label></div></div>
<a class="btn p invgo" href="#" style="min-height:48px;justify-content:center;margin-top:6px">{ic("send", "s")} Envoyer l'invitation</a>
<div class="invok">{ic("circle-check", "s")} Invitation envoyée par email et par Telegram.</div>
<a class="link sm" href="bienvenue.html" style="align-self:center">{ic("eye", "s")} Voir ce que reçoit la personne invitée</a>
<div class="lnk"><span class="ell">yelema.ai/invite/unifood-4Rt9</span><a class="btn o sm" href="#" data-toast="Lien d'invitation copié">{ic("copy", "s")} Copier le lien</a></div></div></div>"""

def modal_doc():
    return f"""<div class="modal" id="doc"><div class="ov" data-close></div><div class="pn docp"><div class="rt2">
<h2><span class="dtt">Document</span><button class="ib x2" data-close aria-label="Fermer">{ic("x", "s")}</button></h2>
<div class="dprev"><img src="{B}flyer-sossa.jpg" alt=""></div>
<div class="row" style="gap:8px;flex-wrap:wrap"><a class="btn p" href="#" data-toast="Validé, Fatima publie">{ic("check", "s")} Valider</a><a class="btn o" href="#" data-toast="Demande de modification envoyée">Demander une modification</a><a class="btn o" href="#" data-toast="Téléchargement lancé">{ic("download", "s")} Télécharger</a></div></div></div></div>"""

def modal_mdp():
    regles = "".join(f'<li data-r="{r}">{ic("circle", "s")}{ic("circle-check", "s")} {t}</li>' for r, t in [("len", "8 caractères minimum"), ("num", "Au moins un chiffre"), ("maj", "Au moins une majuscule"), ("eq", "Les deux saisies sont identiques")])
    champ = lambda i, l, p: f'<label class="mdf"><span>{l}</span><span class="mdi"><input type="password" id="{i}" placeholder="{p}" autocomplete="new-password"><button type="button" class="eye" aria-label="Afficher le mot de passe">{ic("eye", "s")}</button></span></label>'
    return f"""<div class="modal" id="mdp"><div class="ov" data-close></div><div class="pn mdpp"><div class="rt2">
<h2>Changer le mot de passe <button class="ib" data-close aria-label="Fermer">{ic("x", "s")}</button></h2>
<p class="sm mute" data-who>Compte utilisateur, aicha.diabate@unifood.info</p>
<form class="mdform">{champ("md0", "Mot de passe actuel", "Votre mot de passe actuel")}{champ("md1", "Nouveau mot de passe", "8 caractères minimum")}{champ("md2", "Confirmer le nouveau mot de passe", "Saisissez-le à nouveau")}
<ul class="mdr">{regles}</ul>
<label class="mdc"><input type="checkbox" checked> Déconnecter mes autres appareils</label>
<button class="btn p mdok" type="submit" disabled>{ic("lock", "s")} Enregistrer le nouveau mot de passe</button>
<a class="link mdlost" href="mot-de-passe.html">Mot de passe actuel oublié ?</a></form>
<div class="mddone">{ic("circle-check")}<b>Mot de passe changé</b><span class="sm mute">Vos autres appareils sont déconnectés. Un email de confirmation vous a été envoyé.</span><a class="btn o" href="#" data-close>Fermer</a></div></div></div></div>"""

def modales():
    return modal_mdp() + modal_cz() + modal_cxa() + modal_jeko() + modal_share() + modal_call() + modal_inv() + modal_doc() + '<div class="toast" role="status"></div>'

# ---------------------------------------------------------------- Composio
def modal_cz():
    return f"""<div class="modal" id="cz"><div class="ov" data-close></div><div class="pn cz"><div class="rt2" style="text-align:center;align-items:center">
<div class="row" style="gap:10px;justify-content:center"><img src="{B}{CLIENT['logo']}" alt="" style="width:44px;height:44px;border-radius:12px;background:#fff">{ic("arrow-left-right", "s")}<span class="ib">{ic("plug", "s")}</span></div>
<h2 style="justify-content:center">Connecter <span class="czn">l'outil</span></h2><p class="sm mute" style="max-width:40ch">Vous allez autoriser l'accès sur la page de l'outil. Yelema ne voit jamais votre mot de passe.</p>
<div class="czs"><span>{ic("shield-check", "s")} Accès en lecture et en écriture, retirable à tout moment</span><span>{ic("users", "s")} Partagé avec les experts que vous choisissez</span></div>
<a class="btn k czgo" href="#" style="min-height:48px;border-radius:99px;width:100%">Continuer</a><div class="czok">{ic("circle-check", "s")} Connecté. Vos experts peuvent l'utiliser.</div>
<span class="xs mute3">Connexion sécurisée par Composio</span><button class="ib x2" data-close aria-label="Fermer">{ic("x", "s")}</button></div></div></div>"""

# ---------------------------------------------------------------- Yélé, l'agent d'aide
YELE_SVG = """<svg class="yele" viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="ylg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9B7BFF"/><stop offset=".55" stop-color="#6B58FB"/><stop offset="1" stop-color="#2E4EC4"/></linearGradient></defs><g class="yl-body"><g class="yl-arms"><rect x="34" y="84" width="132" height="32" rx="16" fill="url(#ylg)" transform="rotate(0 100 100)"/><rect x="34" y="84" width="132" height="32" rx="16" fill="url(#ylg)" transform="rotate(60 100 100)"/><rect x="34" y="84" width="132" height="32" rx="16" fill="url(#ylg)" transform="rotate(120 100 100)"/></g><circle cx="100" cy="100" r="34" fill="#fff"/><g class="yl-look"><g class="yl-blink"><ellipse cx="89" cy="97" rx="7.7" ry="10" fill="#17112B"/><ellipse cx="111" cy="97" rx="7.7" ry="10" fill="#17112B"/><circle cx="91.9" cy="92.6" r="3.1" fill="#fff"/><circle cx="113.9" cy="92.6" r="3.1" fill="#fff"/><circle cx="87.2" cy="100.6" r="1.4" fill="#fff"/><circle cx="109.2" cy="100.6" r="1.4" fill="#fff"/></g></g><ellipse cx="76" cy="109" rx="6" ry="3.6" fill="#FF8FA3" opacity=".65"/><ellipse cx="124" cy="109" rx="6" ry="3.6" fill="#FF8FA3" opacity=".65"/><path d="M94.6 109 q5.4 5.4 10.8 0" stroke="#17112B" stroke-width="2.9" fill="none" stroke-linecap="round"/></g></svg>"""

def yele():
    sug = "".join(f'<span>{t}</span>' for t in ("Comment recruter un expert ?", "Connecter mes outils", "Changer le prénom de Djénéba", "Ma facture"))
    return f"""<button class="ybtn" data-pop="yele" aria-label="Aide, parler à Yélé">{YELE_SVG}<span>Besoin d'aide&nbsp;?</span></button>
<div class="pop ypop" id="yele"><div class="row" style="gap:12px">{YELE_SVG.replace('class="yele"', 'class="yele big"')}<div><h3>Yélé</h3><span class="sm mute">Votre agent IA support client</span></div></div>
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
         ("memoire", "Mémoire de l’entreprise", "Le comité du 14 août 2025 a validé 4,5 M F CFA.", "11:03", 0, "canal")]

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
    xa = lambda k: f'<a class="tbtn ico" href="#" data-call="{k}" aria-label="Appeler">{ic("phone", "s")}</a><a class="tbtn" href="{k}.html">{ic("arrow-up-right", "s")} Son espace</a>'
    th = lambda i, h, body, on=False: f'<div class="cth{" on" if on else ""}" id="c-{i}">{h}<div class="thread">{body}</div></div>'
    threads = (th("fatima", head("fatima", "Fatima", "Expert marketing et contenu, au travail", xa("fatima")), b3.FIL_FATIMA, True)
               + th("general", head("general", "# Général", "14 membres et 3 experts", '<a class="tbtn" href="https://t.me/" target="_blank" rel="noopener">' + TG + ' Aussi dans Telegram</a>'), gen)
               + th("djeneba", head("djeneba", "Djénéba", "Chief of Staff", xa("djeneba")), b3.FIL_DJENEBA)
               + th("koffi", head("koffi", "Koffi", "Expert design", xa("koffi")), b3.FIL_KOFFI)
               + th("NT", head("NT", "Nadège Touré", "Chargée de communication, en ligne", ""), nad)
               + th("marketing", head("marketing", "# Marketing", "6 membres et 2 experts", ""), gen)
               + th("YK", head("YK", "Yao Kra", "Graphiste", ""), '<span class="day">Hier</span>' + m("lui", "Ok pour la version rouge.", "17:40"))
               + th("memoire", head("memoire", "Mémoire de l’entreprise", "Répond à partir des documents de l'entreprise", ""), fil_memoire()))
    corps = f"""<div class="chatp"><aside class="cl"><div class="row" style="justify-content:space-between"><h2 style="font-size:20px;font-weight:650">Discussions</h2><a class="tbtn ico" href="#" aria-label="Nouvelle discussion">{ic("square-pen", "s")}</a></div>
<label class="srch tdq">{ic("search", "s")}<input type="search" placeholder="Chercher une discussion" aria-label="Chercher une discussion" data-flt></label><div class="seg2" data-cf><span class="on" data-f="tous">Tout</span><span data-f="expert">Experts</span><span data-f="collegue">Collègues</span><span data-f="canal">Canaux</span></div>{lst}</aside>
<section class="cm">{threads}<div class="comp"><div class="inp"><button class="ib" aria-label="Joindre un fichier">{ic("plus", "s")}</button><span class="ph">Écrire un message</span><label class="llm" title="Modèle d'IA">{ic("cpu", "s")}<select aria-label="Modèle d'IA"><option>Claude, Anthropic</option><option>GPT, OpenAI</option><option>Gemini, Google</option><option>Mistral Large</option><option>Llama, Meta</option></select>{ic("chevron-down", "s")}</label><button class="mic" aria-label="Message vocal">{ic("mic", "s")}</button></div></div></section></div>"""
    return page("chat", brand, "Discussions", "<b>Discussions</b>", corps, wrap=False)

# ---------------------------------------------------------------- admin : équipe complète
ALL_EXPERTS = [("djeneba", "Djénéba", "Chief of Staff", "Direction", "Aïcha, Serge, Jean-Marc", 5, "incluse", True),
               ("fatima", "Fatima", "Marketing et contenu", "Marketing", "Aïcha, Nadège", 24, "300 000", True),
               ("koffi", "Koffi", "Design", "Marketing", "Yao", 17, "200 000", True),
               ("kouassi", "Kouassi", "Ventes", "Commercial", "Fanta, Kader", 21, "200 000", True),
               ("adjoua", "Adjoua", "Recrutement", "RH", "Mariam", 9, "200 000", True),
               ("mamadou", "Mamadou", "Finance", "Finance", "Ibrahim", 12, "200 000", True),
               ("awa", "Awa", "Service client", "Commercial", "Rokia", 38, "en pause", False)]
MEMBRES = [("JA", "Jean-Marc Aka", "Directeur général", "Direction", "Direction"), ("SB", "Serge Bamba", "Directeur administratif", "Direction", "Direction"),
           ("AD", "Aïcha Diabaté", "Directrice marketing", "Marketing", "Admin"), ("NT", "Nadège Touré", "Chargée de communication", "Marketing", "Équipe"),
           ("YK", "Yao Kra", "Graphiste", "Marketing", "Équipe"), ("FB", "Fanta Bakayoko", "Responsable commerciale", "Commercial", "Responsable"),
           ("KO", "Kader Ouattara", "Commercial terrain", "Commercial", "Équipe"), ("RT", "Rokia Traoré", "Service client", "Commercial", "Équipe"),
           ("MK", "Mariam Koné", "Responsable RH", "RH", "Responsable"), ("IS", "Ibrahim Sylla", "Contrôleur financier", "Finance", "Responsable"),
           ("HN", "Hervé N'Guessan", "Responsable logistique", "Opérations", "Responsable"), ("OK", "Olivier Kacou", "Chef d'usine", "Opérations", "Équipe"),
           ("SD", "Sarah Diallo", "Assistante de direction", "Direction", "Équipe"), ("DY", "Didier Yapi", "Acheteur", "Opérations", "Équipe")]

XN = {k: (n, r, on) for k, n, r, sv, u, lv, p, on in ALL_EXPERTS}
def xh(k):
    return f"{k}.html" if k in ("djeneba", "fatima", "koffi") else "admin-experts.html"

def adm_vue(brand):
    act = "".join(f'<a class="ax2{"" if on else " pz2"}" href="{xh(k)}"><img src="{B}pied/{k}.jpg" alt=""><span class="grow"><b>{n}</b><span>{r}</span></span>'
                  + (f'<span class="xst on" title="Actif" aria-label="Actif">{ic("circle-check", "s")}</span>' if on else f'<span class="xst" title="En pause" aria-label="En pause">{ic("circle-pause", "s")}</span>') + '</a>'
                  for k, n, r, sv, u, lv, p, on in ALL_EXPERTS)
    deja = {k for k, *_ in ALL_EXPERTS}
    dispo = "".join(f'<a class="ax2 off" href="recrue-{ph}.html"><img src="{B}pied/{ph}.jpg" alt=""><span class="grow"><b>{nom}</b><span>{met}</span></span><span class="stt add">{ic("plus", "s")} Recruter</span></a>'
                    for ph, nom, met, *_ in CATALOGUE if ph not in deja)
    xs = "".join(f'<a class="ax" href="{xh(k)}"><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{n}</b><span>{r}</span>{"" if sv == r else f'<span class="xs mute3">Service {sv}</span>'}</span>{"<span class=sw></span>" if on else "<span class=\"sw off\"></span>"}</a>' for k, n, r, sv, u, lv, p, on in ALL_EXPERTS)
    ms = "".join(f'<a class="am" href="admin-membre.html">{face(i, "", 48)}<b>{n.split(" ")[0]}</b><span>{svc}</span></a>' for i, n, po, svc, r in MEMBRES)
    corps = f"""<div class="hello"><div class="grow"><h1>Vue d'ensemble</h1></div></div>
<div class="stat4 st6">{stat("user-plus", "8", "experts recrutés")}{stat("sparkles", "7", "experts actifs")}{stat("users", "14", "membres")}{stat("users-round", "1,8", "experts par membre, en moyenne")}{stat("plug", "7", "connecteurs branchés")}{stat("package", "126", "livrables ce mois-ci", '<span class="pill ok">+31</span>')}</div>
<div class="h2x" style="margin-top:24px"><h2>Vos experts</h2><a class="link" href="admin-experts.html">Gérer {FLECHE}</a></div><div class="axg2">{act}</div>
<div class="h2x"><h2>Canaux de l'organisation</h2></div>{canaux_strip()}"""
    return admin_page("admin", "Vue d'ensemble", corps, brand)

def stat(i, v, l, extra=""):
    return f'<div class="kpi"><span class="ic">{ic(i, "s")}</span><div class="v">{v}</div><div class="l">{l}</div>{extra}</div>'

def adm_membre(brand):
    xs = "".join(f'<a class="ax" href="{k}.html"><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{EXPERTS[k]["prenom"]}</b><span>{EXPERTS[k]["role"]}</span></span>{ic("chevron-right", "s")}</a>' for k in ("djeneba", "fatima", "koffi"))
    lk = "".join(f'<label class="rsx"><img src="{FAV}{d}" alt=""><span>{n}</span>{fin_(v, "Ajouter le lien")}</label>' for n, d, v in
                 [("LinkedIn", "linkedin.com", "linkedin.com/in/aicha-diabate"), ("Portfolio", "behance.net", ""), ("GitHub", "github.com", ""), ("Autre lien", "", "")])
    corps = f"""<div class="mp"><div class="mph">{face("AD", "", 120)}<div class="grow"><h1>Aïcha Diabaté</h1><p class="mute">Directrice marketing</p><div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap"><span class="pill" style="background:var(--soft-2)">Service Marketing</span><span class="pill ok">Active aujourd'hui</span></div></div>
<a class="btn o" href="#" data-toast="Choisissez une photo">{ic("camera", "s")} Changer la photo</a></div>
<div class="g2e"><div>{sg([("Email", "", fin_("aicha.diabate@unifood.info", "", "email")), ("Téléphone", "Coché s'il sert aussi sur ces applications", '<span class="fi2">' + fin_("+225 07 00 00 00 00", "", "tel") + f'<span class="phk"><label><input type="checkbox" checked><img src="{FAV}telegram.org" alt=""> Telegram</label><label><input type="checkbox" checked><img src="{FAV}whatsapp.com" alt=""> WhatsApp</label></span></span>'),
     ("Entreprise", "", fin_("Unifood")), ("Poste", "", fin_("Directrice marketing")), ("Service", "", '<select class="fi"><option selected>Marketing</option><option>Commercial</option><option>Direction</option><option>RH</option><option>Finance</option><option>Opérations</option></select>'),
     ("Secteur", "", '<select class="fi">' + "".join(f'<option{" selected" if x == "Agroalimentaire" else ""}>{x}</option>' for x in SECTEURS) + '<option>Autre</option></select>')])}
<h3 class="h3s">Mes liens</h3><div class="rsg rsg1">{lk}<a class="link sm" href="#" data-toast="Nouveau lien ajouté">{ic("plus", "s")} Ajouter un lien</a></div>
{sg([("Mot de passe", "Modifié il y a 3 mois", f'<a class="btn o sm" href="#" data-open="mdp" data-mdwho="Compte utilisateur, aicha.diabate@unifood.info">{ic("key-round", "s")} Changer le mot de passe</a>'), ("Se déconnecter", "De cet appareil", f'<a class="btn o sm" href="connexion.html#out">{ic("log-out", "s")} Se déconnecter</a>')])}
<div class="row" style="justify-content:flex-end;margin-top:12px"><a class="btn p" href="#" data-toast="Profil enregistré">Enregistrer</a></div></div>
<div><div class="box"><div class="ch"><h2 style="font-size:16px;font-weight:650">Ses experts</h2><span class="row" style="gap:6px"><a class="btn p sm" href="recruter.html">{ic("user-plus", "s")} Recruter un expert</a></span></div><div class="axg" style="grid-template-columns:1fr">{xs}</div></div></div></div></div>"""
    return corps

def adm_membre_ancien(brand):
    xs = "".join(f'<a class="ax" href="{k}.html"><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{EXPERTS[k]["prenom"]}</b><span>{EXPERTS[k]["role"]}</span></span>{ic("chevron-right", "s")}</a>' for k in ("djeneba", "fatima", "koffi"))
    corps = f"""<div class="mp"><div class="mph">{face("AD", "", 120)}<div class="grow"><h1>Aïcha Diabaté</h1><p class="mute">Directrice marketing, Unifood</p><div class="row" style="gap:6px;margin-top:10px;flex-wrap:wrap"><span class="pill br">Responsable de service</span><span class="pill" style="background:var(--soft-2)">Service Marketing</span><span class="pill ok">Active aujourd'hui</span></div></div>
<div class="row" style="gap:8px"><a class="btn o" href="#">{ic("message-circle", "s")} Écrire</a><a class="btn p" href="#">{ic("pencil", "s")} Modifier</a></div></div>
<div class="g2e"><div>{sg([("Email", "", '<span class="inp2">aicha.diabate@unifood.info</span>'), ("Téléphone", "", '<span class="inp2">+225 07 00 00 00 00</span>'), ("Entreprise", "", '<span class="inp2">Unifood, Abidjan</span>'), ("Rôle", "Ce qu'elle peut faire dans l'espace", '<span class="inp2">Responsable : ses experts et ceux du service Marketing</span>')])}
{sg([("Mot de passe", "Modifié il y a 3 mois", f'<a class="btn o sm" href="#" data-open="mdp" data-mdwho="Compte utilisateur, aicha.diabate@unifood.info">{ic("key-round", "s")} Changer le mot de passe</a>'), ("Se déconnecter", "De cet appareil", f'<a class="btn o sm" href="connexion.html#out">{ic("log-out", "s")} Se déconnecter</a>')])}</div>
<div><div class="box"><div class="ch"><h2 style="font-size:16px;font-weight:650">Ses experts</h2><a class="link" href="#">{ic("plus", "s")} Ajouter</a></div><div class="axg" style="grid-template-columns:1fr">{xs}</div></div>
<div class="box" style="margin-top:12px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Ce mois-ci</h2></div><div class="kv" style="font-size:14px;gap:10px"><div><span>Livrables reçus</span><b>31</b></div><div><span>Messages aux experts</span><b>64</b></div><div><span>Canaux</span><b>Telegram, WhatsApp, ici</b></div></div></div></div></div></div>"""
    return corps

def page_admin_membre(brand):
    return admin_page("admin-membres", "Aïcha Diabaté", adm_membre(brand), brand)

def page_profil(brand):
    return page("profil", brand, "Mon profil", "<b>Mon profil</b>", adm_membre(brand))

def auth_page(titre, brand, droite):
    tags = "".join(f'<span class="hero-tag" style="left:{l}"><b>{n}</b><span>{r}</span></span>' for l, n, r in [("3.2%", "Fatou", "Experte RH et Paie"), ("38.6%", "Ibrahim", "Expert Juridique et Conformité"), ("74.2%", "Fatima", "Experte Marketing et Contenu")])
    gauche = f"""<div class="aul"><a class="aulogo" href="connexion.html"><img src="{B}yelema_logo_final_long_blanc.svg" alt="Yelema"></a>
<div class="aut"><h1>Décuplez les forces<br><span class="hl">de votre entreprise</span>.</h1><p>Une IA pensée pour l’Afrique, prête à l’emploi, au service de vos équipes.</p></div>
<div class="hero-img auhero"><img src="{B}hero-site.webp" alt="Trois Experts IA Yelema : Fatou, Ibrahim et Fatima">{tags}</div>
<p class="ausec">{ic("lock", "s")} Espace sécurisé, réservé aux membres de votre entreprise</p></div>"""
    return (b3.head(titre, brand) + f'<div class="auth"><div class="aucard">{gauche}<div class="aur">{droite}'
            + '</div></div></div>'
            + '<div class="toast" role="status"></div>' + fin())

def page_connexion(brand):
    d = f"""<div class="aumsg" data-out hidden>{ic("circle-check", "s")} <span>Vous êtes déconnectée. À bientôt, Aïcha.</span></div>
<h2>Connexion à votre espace</h2><p class="sub">Entrez vos identifiants pour retrouver vos experts.</p>
<form class="auf" data-login><label class="mdf"><span>Adresse email</span><span class="mdi"><input type="email" value="aicha.diabate@unifood.info" autocomplete="username"></span></label>
<label class="mdf"><span>Mot de passe</span><span class="mdi"><input type="password" value="motdepasse" autocomplete="current-password"><button type="button" class="eye" aria-label="Afficher le mot de passe">{ic("eye", "s")}</button></span></label>
<div class="row aurow"><label class="mdc"><input type="checkbox" checked> Restez connecté(e)</label><a class="link" href="mot-de-passe.html">Mot de passe oublié ?</a></div>
<button class="btn p auok" type="submit">Se connecter {ic("arrow-right", "s")}</button></form>
<p class="xs mute3 aunote">Besoin d'un accès ? Demandez à votre administrateur de vous inviter.</p>"""
    return auth_page("Connexion", brand, d)

def page_mdp_oublie(brand):
    d = f"""<a class="back" href="connexion.html">{ic("arrow-left", "s")} Retour à la connexion</a>
<div class="aust" data-st="1"><h2>Mot de passe oublié</h2><p class="sub">Indiquez votre adresse email. Nous vous envoyons un lien pour en choisir un nouveau.</p>
<form class="auf" data-forgot><label class="mdf"><span>Adresse email</span><span class="mdi"><input type="email" value="aicha.diabate@unifood.info"></span></label>
<button class="btn p auok" type="submit">Recevoir le lien {ic("arrow-right", "s")}</button></form></div>
<div class="aust" data-st="2" hidden><span class="aubig">{ic("mail-check")}</span><h2>Vérifiez vos emails</h2><p class="sub">Un lien vient de partir vers <b>aicha.diabate@unifood.info</b>. Il reste valable 30 minutes.</p>
<a class="btn o" href="#" data-next="3">J'ai cliqué sur le lien</a><a class="link" href="#" data-toast="Nouveau lien envoyé" style="margin-top:12px;display:inline-block">Renvoyer le lien</a></div>
<div class="aust" data-st="3" hidden><h2>Nouveau mot de passe</h2><p class="sub">Choisissez-le, puis reconnectez-vous.</p>
<form class="auf" data-reset><label class="mdf"><span>Nouveau mot de passe</span><span class="mdi"><input type="password" placeholder="8 caractères minimum"><button type="button" class="eye" aria-label="Afficher le mot de passe">{ic("eye", "s")}</button></span></label>
<label class="mdf"><span>Confirmer</span><span class="mdi"><input type="password" placeholder="Saisissez-le à nouveau"></span></label>
<button class="btn p auok" type="submit">Enregistrer et me connecter {ic("arrow-right", "s")}</button></form></div>"""
    return auth_page("Mot de passe oublié", brand, d)

def page_bienvenue(brand):
    d = f"""<div class="aust" data-st="1"><span class="pill" style="background:var(--soft-2);align-self:flex-start">Invitation d'Aïcha Diabaté, Unifood</span><h2 style="margin-top:10px">Bienvenue, Awa</h2><p class="sub">Trois informations, et vous retrouvez vos experts.</p>
<form class="auf" data-onb><div class="g2i"><label class="mdf"><span>Prénom</span><span class="mdi"><input value="Awa"></span></label><label class="mdf"><span>Nom</span><span class="mdi"><input value="Koné"></span></label></div>
<label class="mdf"><span>Téléphone</span><span class="mdi"><input type="tel" placeholder="+225 07 00 00 00 00"></span></label>
<div class="phk" style="margin:-4px 0 6px"><label><input type="checkbox" checked><img src="{FAV}telegram.org" alt=""> Ce numéro a Telegram</label><label><input type="checkbox"><img src="{FAV}whatsapp.com" alt=""> Ce numéro a WhatsApp</label></div>
<label class="mdf"><span>Mot de passe</span><span class="mdi"><input type="password" placeholder="8 caractères minimum"><button type="button" class="eye" aria-label="Afficher le mot de passe">{ic("eye", "s")}</button></span></label>
<button class="btn p auok" type="submit">Créer mon compte {ic("arrow-right", "s")}</button></form></div>
<div class="aust" data-st="2" hidden><h2>Où voulez-vous parler à vos experts ?</h2><p class="sub">Vous pourrez changer plus tard. Ils vous répondent aussi ici, sur le web.</p>
<div class="onbc"><label><input type="radio" name="onbc" checked><img src="{FAV}telegram.org" alt=""><b>Telegram</b><small>Un sujet par expert</small></label><label><input type="radio" name="onbc"><img src="{FAV}slack.com" alt=""><b>Slack</b><small>Dans votre espace</small></label><label><input type="radio" name="onbc"><img src="{FAV}teams.microsoft.com" alt=""><b>Teams</b><small>Dans votre équipe</small></label><label><input type="radio" name="onbc"><img src="{FAV}whatsapp.com" alt=""><b>WhatsApp</b><small>Sur votre numéro</small></label></div>
<a class="btn p auok" href="accueil.html">Entrer dans mon espace {ic("arrow-right", "s")}</a></div>"""
    return auth_page("Bienvenue", brand, d)

def page_choix():
    s = b3.page_choix()
    s = s.replace("</div></div></body>", """</div>
<div class="opts" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));margin-top:20px">
<a class="o" href="yelema/chat.html"><div><b>Discussions</b><p class="sm mute">Experts, collègues, canaux et mémoire de l’entreprise</p></div></a>
<a class="o" href="yelema/fatima.html"><div><b>Espace d'un expert</b><p class="sm mute">Discussion, résumé, profil, connecteurs, drive, mail, calendrier</p></div></a>
<a class="o" href="yelema/recruter.html"><div><b>Recruter</b><p class="sm mute">Catalogue filtrable, fiche au clic</p></div></a>
<a class="o" href="yelema/admin.html"><div><b>Réglages admin</b><p class="sm mute">7 experts, 14 membres, profil d'un membre, facturation</p></div></a>
</div><p class="sm mute" style="margin-top:18px">Versions précédentes : <a class="link" href="v3/index.html">v3</a>, <a class="link" href="v2/index.html">v2 mobile</a></p></div></body>""")
    return s

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
    t = chan_card("Web", WEB_LOGO, "Cet espace", True)
    for n, d, on, det, u, lib in CANAUX:
        t += chan_card(n, chan_logo(n, d), "Activé" if on else "À activer", on)
    cards = sorted(re.findall(r'<div class="chc.*?</div>', t, flags=re.S), key=lambda c: next((i for i, x in enumerate(CH_ORDRE) if f"<b>{x}</b>" in c), 9))
    return f'<a class="chcs chcs-mini" href="admin-canaux.html">{"".join(cards)}</a>'

# experts : quantité, prix unitaire, total, en service ; plus de colonne livrables
def adm_experts(brand):
    NOMS = {i: n for i, n, *_ in MEMBRES}
    rows = ""
    tot = 0
    for k, n, r, sv, u, lv, p, on in ALL_EXPERTS:
        ppl = "".join(f'<span class="mbx">{face(i, "", 26)}<span>{NOMS[i].split(" ")[0]}</span></span>' for i in UTIL[k])
        q = 2 if k == "kouassi" else 1
        pu = 0 if p == "incluse" else (200000 if not str(p)[0].isdigit() else int("".join(c for c in str(p) if c.isdigit())))
        t_ = pu * q if on else 0
        tot += t_
        f_ = lambda v: f"{v:,}".replace(",", " ") + " F"
        rows += (f'<tr><td><a class="who" href="{xh(k)}"><img src="{B}{k}.jpg" alt=""><span><b>{n}</b><span class="xs mute3">{r}</span></span></a></td>'
                 f'<td class="hide-m"><div class="mbs">{ppl}<a class="ib mba" href="#" data-open="inv" aria-label="Ajouter un membre">{ic("plus", "s")}</a></div></td>'
                 f'<td class="num">{q}</td><td class="num">{"Incluse" if p == "incluse" else f_(pu)}</td><td class="num"><b>{"Incluse" if p == "incluse" else (f_(t_) if on else "Pas facturé")}</b></td>'
                 f'<td><button class="sw{"" if on else " off"} swx" data-nom="{n}" aria-label="En service"></button></td></tr>')
    corps = f"""<div class="hello"><div class="grow"><h1>Experts</h1><p class="sub">7 en service dont Kouassi en deux exemplaires, 1 en pause</p></div><a class="btn p" href="recruter.html">{ic("user-plus", "s")} Recruter un expert</a></div>
<div class="box" style="margin-top:16px"><table class="tbl tbex2"><tr><th>Expert</th><th class="hide-m">Membres qui l'utilisent</th><th>Quantité</th><th>Prix unitaire</th><th>Total par mois</th><th>En service</th></tr>{rows}
<tr class="tot"><td colspan="4"><b>Total par mois</b></td><td class="num"><b>{f"{tot:,}".replace(",", " ")} F CFA</b></td><td></td></tr></table></div>"""
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
    xs = "".join(f'<tr><td><span class="who"><img src="{B}{k}.jpg" alt=""><span><b>{nm}</b><span class="xs mute3">{r}</span></span></span></td><td><select class="fi">{opt(cur.get(k, "Claude Sonnet"))}</select></td>'
                 f'<td class="hide-m"><span class="xs mute3">{"Clé Anthropic de l’entreprise" if "Claude" in cur.get(k, "") else ("Clé Google de l’entreprise" if "Gemini" in cur.get(k, "") else "Fourni par Yelema")}</span></td></tr>' for k, nm, r, *_ in ALL_EXPERTS)
    exs = "".join(f'<label class="kxo"><input type="checkbox"{" checked" if k in ("djeneba", "fatima") else ""}><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{nm}</b><small>{r}</small></span></label>' for k, nm, r, *_ in ALL_EXPERTS)
    mbs = "".join(f'<label class="kxo"><input type="checkbox"{" checked" if i in ("AD",) else ""}>{face(i, "", 32)}<span class="grow"><b>{n}</b><small>{po}</small></span></label>' for i, n, po, svc, r in MEMBRES[:6])
    pv = "".join(f"<option>{x}</option>" for x in ("Anthropic", "OpenAI", "Google", "Mistral AI", "Meta", "DeepSeek", "xAI", "Cohere")) + '<option value="autre">Autre</option>'
    corps = f"""<div class="hello"><div class="grow"><h1>Modèles d'IA</h1><p class="sub">Yelema fournit des modèles par défaut. Branchez aussi vos propres clés, puis choisissez quel expert utilise quel modèle.</p></div><a class="btn p" href="#" data-open="mkey">{ic("plus", "s")} Ajouter une clé</a></div>
<h3 class="h3s">Fournisseurs et clés</h3><div class="kpvs">{rows}</div>
<h3 class="h3s">Modèle par expert</h3><p class="sub">Chaque membre peut aussi choisir un autre modèle dans la discussion</p>
<div class="box" style="margin-top:10px"><table class="tbl"><tr><th>Expert</th><th>Modèle par défaut</th><th class="hide-m">Clé utilisée</th></tr>{xs}</table></div>
<div class="modal" id="mkey"><div class="ov" data-close></div><div class="pn shpn mkp"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button><h2>Ajouter une clé d’API</h2><p class="sm mute">La clé reste chiffrée. Vous la retirez à tout moment.</p>
<div class="g2i"><label class="fl2"><span>Fournisseur</span><select class="fi mkpv">{pv}</select></label><label class="fl2"><span>Nom de la clé</span><input class="fi" placeholder="Par exemple : Clé marketing"></label></div>
<label class="fl2"><span>Clé d’API</span><input class="fi" type="password" placeholder="sk-..." style="width:100%"></label>
<label class="fl2"><span>Modèles autorisés</span><select class="fi">{opt("Claude Sonnet")}</select></label>
<p class="tbfl" style="margin-top:12px">Experts qui l’utilisent</p><div class="kxs">{exs}</div>
<p class="tbfl" style="margin-top:12px">Membres qui partagent cette clé <small>leur usage est compté sur la même clé</small></p><div class="kxs">{mbs}</div>
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
    return _tdb76(_accueil74(_lien74(html)))


if __name__ == "__main__":
    os.makedirs(os.path.join(OUT, "img"), exist_ok=True)
    for f in glob.glob(os.path.join(ICI, "..", "v3", "site", "img", "*")):
        shutil.copy(f, os.path.join(OUT, "img"))
    for f in glob.glob(os.path.join(ICI, "img", "*")):
        if os.path.isdir(f):
            shutil.copytree(f, os.path.join(OUT, "img", os.path.basename(f)), dirs_exist_ok=True)
        else:
            shutil.copy(f, os.path.join(OUT, "img"))
    css = open(os.path.join(ICI, "app.css"), encoding="utf-8").read() + open(os.path.join(ICI, "delos.css"), encoding="utf-8").read()
    open(os.path.join(OUT, "app.css"), "w", encoding="utf-8").write(css)
    shutil.copy(os.path.join(ICI, "app.js"), OUT)
    for brand in ("yelema", "client"):
        d = os.path.join(OUT, brand); os.makedirs(d, exist_ok=True)
        pages = {"accueil": page_accueil(brand), "tableau-de-bord": page_tdb(brand), "notifications": page_notifs(brand), "recruter": page_recruter(brand), "memoire": page_memoire(brand),
                 "admin": adm_vue(brand), "admin-general": adm_general(brand), "admin-membre": page_admin_membre(brand), "profil": page_profil(brand), "chat": page_chat(brand), "admin-experts": adm_experts(brand), "admin-membres": adm_membres(brand), "admin-facturation": adm_factu(brand), "admin-modeles": adm_modeles(brand),
                 "admin-analytics": adm_analytics(brand), "admin-canaux": adm_canaux(brand), "admin-profil": adm_profil(brand), "admin-connecteurs": adm_connect(brand),
                 "connexion": page_connexion(brand), "mot-de-passe": page_mdp_oublie(brand), "bienvenue": page_bienvenue(brand)}
        for k in ("djeneba", "fatima", "koffi"):
            pages[k] = page_expert(k, brand)
        for c in CATALOGUE:
            pages["recrue-" + c[0]] = page_recrue(c[0], brand)
        for n, html in pages.items():
            html = _fix74(_nav_fix(html.replace('href="ecran.html"', 'href="fatima.html#direct"')))
            open(os.path.join(d, n + ".html"), "w", encoding="utf-8").write(html)
        print("ok", brand, len(pages), "pages")
    open(os.path.join(OUT, "plan.html"), "w", encoding="utf-8").write(page_choix())
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=yelema/connexion.html"><title>Yelema</title></head><body><a href="yelema/connexion.html">Ouvrir Yelema</a></body></html>')
    print("ok index")
