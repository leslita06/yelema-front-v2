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


PHOTO = {"AD": "m_women_62", "SB": "m_men_80", "YK": "m_men_53", "NT": "m_women_36", "KO": "m_men_59", "MK": "m_women_30", "IS": "m_men_91",
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
    elle = "elle" if f["tl"].startswith("Elle") else "il"
    sk = "".join(f'<div class="fsk"><span class="ic">{ic("sparkles", "s")}</span><div><b>{esc(a)}</b><span>{esc(b)}</span></div></div>' for a, b in f.get("competences", []))
    q = "".join(f'<li>{ic("check", "s")}<span>{esc(x)}</span></li>' for x in f.get("quotidien", []))
    ac = "".join(f'<li>{ic("lock", "s")}<span>{esc(x)}</span></li>' for x in f.get("accord", []))
    be = "".join(f'<li>{ic("file-input", "s")}<span>{esc(x)}</span></li>' for x in f.get("besoins", []))
    ri = "".join(f'<div class="rt"><span class="ib" style="width:36px;height:36px">{ic("repeat", "s")}</span><div class="grow"><b>{esc(t)}</b><span>{esc(w)}</span></div><span class="sw"></span></div>' for t, w in f.get("rituels", []))
    lv = "".join(f'<div class="flv"><span class="ic">{ic("file-text", "s")}</span><div><b>{esc(a)}</b><span>{esc(b)}</span></div></div>' for a, b in f.get("livrables", []))
    ou = "".join(f'<span class="ochip"><img src="{FAV}{DOM.get(o, "yelema.ai")}" alt="">{esc(o)}</span>' for o in f.get("outils", []))
    refs = "".join(f'<span class="pill" style="background:var(--soft-2)">{esc(r)}</span>' for r in f.get("refs", []))
    seul = "seule" if elle == "elle" else "seul"
    return f"""<div class="fp">
<div class="fph"><span class="k">Fiche de poste</span><h1>{nom}, {esc(f['role'])}</h1><p class="lead">{esc(f.get('mission', ''))}</p>
<p class="sm mute">{esc(f.get('valeur', f['tl']))}</p></div>
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
            f'<a class="aci{" on" if admin else ""}" href="admin.html"><span class="adav">{ic("shield-check", "s")}</span><span class="grow"><b>Admin Unifood</b><small>Compte administrateur</small></span>{ic("check", "s") if admin else ""}</a>'
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
  <div class="acw"><a class="me{" on" if actif == "admin-profil" else ""}" href="admin-profil.html"><span class="adav">{ic("shield-check", "s")}</span><span class="grow"><b class="ell">Admin Unifood</b><small class="ell">Compte administrateur</small></span><button class="acsw" aria-label="Changer de compte">{ic("chevrons-up-down", "s")}</button></a>{acmenu(True)}</div>
  <a class="pby" href="https://leslita06.github.io/yelema-site-preview/">Powered by <img src="{B}yelema_logo_final_long.svg" alt="Yelema"></a></div>
</aside>"""

def sidebar(actif, brand):
    items = [("accueil", "house", "Accueil"), ("tableau-de-bord", "layout-dashboard", "Tableau de bord"), ("recruter", "user-plus", "Recruter"), ("memoire", "book-open", "Chat entreprise")]
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
  <div class="acw"><a class="me{" on" if actif == "profil" else ""}" href="profil.html">{face("AD", "", 36)}<span class="grow"><b class="ell">Aïcha Diabaté</b><small class="ell">Directrice marketing</small></span><button class="acsw" aria-label="Changer de compte">{ic("chevrons-up-down", "s")}</button></a>{ACMENU}</div>
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
           ("user-plus", "Nadège a rejoint Unifood", "Invitée par Aïcha Diabaté")]
    nl = "".join(f'<div class="nt"><span class="ic">{ic(i, "s")}</span><div><b>{t}</b><span>{d}</span></div></div>' for i, t, d in nts)
    return f"""<div class="pop" id="ping"><h3>Messages</h3>
<div class="srch">{ic("search", "s")} Chercher une conversation</div>{lst}</div>
<div class="pop" id="notifs"><h3>Notifications <a class="link sm mk" href="#">{ic("check-check", "s")} Marquer comme lu</a></h3>{nl}<a class="seeall" href="notifications.html">Tout voir {FLECHE}</a></div>"""

def topbar(crumb, actif, brand):
    autre = "client" if brand == "yelema" else "yelema"
    lib = "Couleurs Unifood" if brand == "yelema" else "Couleurs Yelema"
    return f"""<header class="top"><div class="crumb grow">{crumb}</div>
<a class="tbtn ico hide-m" href="../{autre}/{actif}.html" title="{lib}" aria-label="{lib}">{ic("palette", "s")}</a>
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
            + inner + '</main></div>' + pops() + yele() + modales() + d + fin())

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
    return f"""<div class="cw"><a class="big" href="{k}.html"><img src="{B}{e['photo']}" alt="">{'<span class="st"><span class="dot"></span> En train de travailler</span>' if e['live'] else ''}{tag}
<span class="nm"><h3>{e['prenom']} {ic("chevron-right", "s")}</h3><span class="rl">{e['role']}</span></span></a>
<div class="acts">{acts}</div>
<div class="bar2"><a class="p" href="{k}.html#discussion">{ic("message-circle", "s")} Écrire</a><a class="ic tel" href="#" data-call="{k}" aria-label="Appeler {e['prenom']}">{ic("phone", "s")}</a></div></div>"""

def carte_equipe(k):
    e, fi = EXPERTS[k], fiche_de(k)
    st = '<span class="inteam live">' + '<span class="dot"></span> En train de travailler</span>' if e["live"] else ""
    return (f'<div class="pc2 eq"><a class="cov" href="{k}.html" aria-label="Ouvrir l\'espace de {e["prenom"]}"></a>{vid(k, e["prenom"])}{st}'
            f'<span class="nm"><b>{e["prenom"]}</b><span class="rl">{esc(fi.get("role", e["role"]))}</span><span class="tl">{DESC[k]}</span>'
            f'<span class="eqb"><a class="rb" href="{k}.html#discussion">{ic("message-circle", "s")} Écrire</a><a class="rb tel" href="#" data-call="{k}" aria-label="Appeler {e["prenom"]}">{ic("phone", "s")}</a></span></span></div>')

def page_accueil(brand):
    fan = "".join(f'<img src="{B}{x}.jpg" alt="">' for x in ("salif", "kouassi", "adjoua", "mamadou", "nadia"))
    team = "".join(carte_equipe(k) for k in ("djeneba", "fatima", "koffi"))
    stack = "".join(f'<img src="{B}{x}.jpg" alt="">' for x in ("adjoua", "mamadou", "nadia")) + f'<span class="gplus">{ic("plus")}</span>'
    team += (f'<a class="cw grow2" href="recruter.html"><div class="gstk">{stack}</div>'
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
          ("Hier", [(None, "user-plus", "Nadège a rejoint Unifood", "Invitée par Aïcha Diabaté", "17:20", "admin-membres.html", "Voir", False),
                    ("fatima", "calendar", "Calendrier éditorial d'octobre prêt", "12 publications, à valider avant lundi", "16:02", "fatima.html#livrables", "Ouvrir", False),
                    (None, "receipt", "Facture d'octobre payée", "500 000 F CFA par Jèko, Wave", "11:15", "admin-facturation.html", "Voir", False)])]

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

def page_tdb(brand):
    d = DASH["equipe"]
    tabs = f'<a href="#" data-t="codir" class="on"><span class="cdr">{"".join(f'<img src="{B}{EXPERTS[x]["photo"]}" alt="">' for x in ("djeneba", "fatima", "koffi"))}</span> Codir</a>' + "".join(
        f'<a href="#" data-t="tb-{k}"><img class="tav" src="{B}{EXPERTS[k]["photo"]}" alt=""> {EXPERTS[k]["prenom"]}</a>' for k in ("djeneba", "fatima", "koffi"))
    tabs += f'<a href="#" data-t="temps">{ic("calendar-check", "s")} Temps rendu</a>'
    par = ""
    for k in ("djeneba", "fatima", "koffi"):
        dk = DASH[k]; e = EXPERTS[k]
        att = [a for a in b3.ATTENTE_TEAM if a[0] == k]
        par += (f'<div class="panel" id="tb-{k}"><div class="tbh"><img src="{B}{e["photo"]}" alt=""><div class="grow"><b>{e["prenom"]}, {e["role"]}</b><span class="xs mute3">Pour Aïcha Diabaté et son équipe</span></div><a class="btn o sm" href="{k}.html">{ic("arrow-right", "s")} Son espace</a></div>'
                f'{b3.kpis(dk)}<div class="g2">{b3.chart(dk, [k])}{donut4(dk)}</div>{projets4(dk)}{livr4(dk, att)}</div>')
    corps = f"""<div class="hello"><div class="grow"><p class="date">Semaine du 28 septembre</p><h1>Tableau de bord</h1></div><a class="btn o hide-m" href="https://t.me/" target="_blank" rel="noopener">{TG} Recevoir dans Telegram</a><a class="btn o" href="#" data-open="share">{ic("share-2", "s")} Partager</a><a class="btn g" href="djeneba.html#discussion" title="Avec {EXPERTS['djeneba']['prenom']}, votre Chief of Staff"><img class="tav" src="{B}{EXPERTS['djeneba']['photo']}" alt=""> Modifier votre tableau de bord</a></div>
<div data-tabs><nav class="tabs tbs" style="margin-top:14px">{tabs}</nav>
<div class="panel on" id="codir"><p class="sm mute" style="margin:2px 0 12px">Vue Codir : tout ce que l'équipe d'experts a produit, pour tous les services d'Unifood.</p>{b3.kpis(d)}<div class="g2">{b3.chart(d, ["fatima", "koffi", "djeneba"])}{donut4(d)}</div>{projets4(d)}{livr4(d, b3.ATTENTE_TEAM, True)}</div>
{par}<div class="panel" id="temps">{temps_rendu(d, ["fatima", "koffi", "djeneba"])}</div></div>"""
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
    voix = "".join(f'<span class="vx{" on" if j == 0 else ""}"><button class="pl" aria-label="Écouter {n}">{ic("play", "s")}</button><span><b>{n}</b><small>{t}</small></span></span>' for j, (n, t) in enumerate([("Awa", "Chaleureuse"), ("Mariam", "Posée"), ("Aminata", "Énergique")]))
    acct = "".join(f'<div class="ac2"><img src="{FAV}{dd}" alt=""><span class="grow"><b>{n}</b><small>{v}</small></span><span class="sti on">{ic("circle-check")}</span></div>' for n, dd, v in
                   [("Boîte mail", "gmail.com", p["mail"]), ("Agenda", "calendar.google.com", "Agenda Unifood"), ("Drive", "drive.google.com", "Drive Unifood, dossier " + e["prenom"]), ("Telegram", "telegram.org", "Sujet « " + e["prenom"] + " »")])
    nom = (f'<div class="nmf2"><span class="inp2">{e["prenom"]}</span><a class="btn o sm" href="#" data-open="pz">{ic("pencil", "s")} Modifier</a></div>' if dj
           else f'<span class="inp2">{e["prenom"]}</span>')
    note = '<p class="xs mute3">Seule votre Chief of Staff se renomme : prénom et visage à votre goût.</p>' if dj else '<p class="xs mute3">Le prénom et le visage des experts sont fixes. Seule votre Chief of Staff se personnalise.</p>'
    return f"""<div class="pf"><div class="pfh"><div class="pfav"><img src="{B}{e['photo']}" alt="">{pen}</div>
<div class="grow"><span class="meta">Dans l'équipe depuis {p['depuis']}, Abidjan</span><h1>{e['prenom']}</h1><div class="mute">{e['role']}</div>{note}</div></div>
<div class="pfg"><div class="box"><h3 class="bt">{ic("id-card", "s")} Identité</h3><div class="kv2"><span>Prénom</span>{nom}</div><div class="kv2"><span>Langue</span><span class="inp2">Français</span></div>
<div class="kv2"><span>Ton</span><div class="seg"><a class="on">Vouvoiement</a><a>Tutoiement</a></div></div><div class="kv2"><span>Réponses</span><div class="seg"><a class="on">Courtes</a><a>Détaillées</a></div></div></div>
<div class="box"><h3 class="bt">{ic("audio-lines", "s")} Sa voix</h3><p class="xs mute3" style="margin-bottom:10px">Pour les appels et les messages vocaux. Touchez pour écouter, choisissez pour changer.</p><div class="vxs">{voix}</div></div></div>
<div class="box" style="margin-top:14px"><div class="row" style="justify-content:space-between"><h3 class="bt" style="margin:0">{ic("users", "s")} L'équipe qui travaille avec {e['prenom']}</h3><a class="btn o sm" href="#" data-open="inv">{ic("user-plus", "s")} Ajouter</a></div><div class="tms">{team}</div></div>
<div class="pfg" style="margin-top:14px"><div class="box"><h3 class="bt">{ic("brain", "s")} Sa mémoire d'Unifood</h3><div class="mem3"><div><b class="num">128</b><span>choses apprises</span></div><div><b class="num">312</b><span>documents lus</span></div><div><b class="num">ce matin</b><span>dernière mise à jour</span></div></div>
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
<div><span class="ic">{ic("briefcase", "s")}</span><div class="grow"><b>Compte de travail Unifood</b><span>Le compte avec lequel {e['prenom']} écrit, range et reçoit</span><div class="dots"><span>Mail : {p['mail']}</span><span>Agenda</span><span>Drive Unifood</span><span>WhatsApp</span></div></div></div>
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
    return f"""<div class="czw" data-ct><div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:10px"><div class="ctabs cts"><span class="on" data-c="cz-a">{ic("layout-grid", "s")} Connecteurs</span><span data-c="cz-b">{ic("wrench", "s")} Sur mesure</span><span data-c="cz-c">{ic("code-xml", "s")} API et MCP</span><span data-c="cz-d">{ic("monitor", "s")} Ordinateur</span></div>
<span class="composio">{ic("plug-zap", "s")} Fournis par Composio, plus de 250 outils</span></div>
<div class="czp on" id="cz-a"><div class="cfil"><label class="srch czs">{ic("search", "s")}<input type="search" placeholder="Chercher un outil" aria-label="Chercher un outil"></label>{cats}</div>
<p class="sm mute" style="margin:4px 0 10px">{nb} outils connectés pour {e['prenom']}</p><div class="cz2g">{tiles}</div></div>
<div class="czp" id="cz-b"><div class="box"><h3 class="bt">{ic("wrench", "s")} Un outil qui n'est pas dans la liste</h3><p class="sm mute">Décrivez-le, l'équipe Yelema le branche pour {e['prenom']}, en général sous 48 h.</p>
<label class="shmask" style="margin-top:10px"><textarea rows="3" placeholder="Ex. : notre logiciel de caisse Sage 100, ou l'extranet de notre distributeur"></textarea></label><a class="btn p sm" href="#" data-toast="Demande envoyée à l'équipe Yelema" style="margin-top:10px">Envoyer la demande</a></div></div>
<div class="czp" id="cz-c"><div class="pfg"><div class="box"><h3 class="bt">{ic("key-round", "s")} Clé d'API</h3><p class="sm mute">Pour qu'un de vos logiciels confie un travail à {e['prenom']}.</p><div class="lnk" style="margin-top:10px"><span class="ell num">yl_live_••••••••••••7Hk2</span><a class="btn o sm" href="#" data-toast="Clé copiée">{ic("copy", "s")} Copier</a></div><a class="btn o sm" href="#" data-toast="Nouvelle clé créée" style="margin-top:10px">{ic("plus", "s")} Nouvelle clé</a></div>
<div class="box"><h3 class="bt">{ic("server", "s")} Serveur MCP</h3><p class="sm mute">Branchez un serveur MCP : ses outils deviennent disponibles pour {e['prenom']}.</p><span class="inp3" style="margin-top:10px;display:block">https://mcp.votre-outil.com</span><a class="btn p sm" href="#" data-toast="Serveur MCP ajouté, 6 outils trouvés" style="margin-top:10px">Ajouter le serveur</a></div></div></div>
<div class="czp" id="cz-d"><div class="box"><h3 class="bt">{ic("monitor", "s")} L'ordinateur de {e['prenom']}</h3><p class="sm mute">Un ordinateur sécurisé, hébergé pour Unifood, sur lequel {e['prenom']} ouvre les sites et logiciels sans connecteur.</p>
<div class="ac2" style="margin-top:10px"><img src="{FAV}google.com" alt=""><span class="grow"><b>Navigateur</b><small>Sites autorisés : canva.com, unifood.info, facebook.com</small></span><a class="btn o sm" href="#" data-toast="Liste des sites ouverte">Modifier</a></div>
<div class="ac2"><img src="{FAV}office.com" alt=""><span class="grow"><b>Bureautique</b><small>Documents, tableurs, présentations</small></span><span class="sti on">{ic("circle-check")}</span></div>
<div class="ac2"><span class="ib" style="width:22px;height:22px">{ic("eye", "s")}</span><span class="grow"><b>Vous voyez son écran</b><small>En direct, depuis sa carte</small></span><a class="btn o sm" href="#" data-go="direct">Voir son écran</a></div></div></div></div>"""

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
    lt = [x[1] for x in d["livrables"]]
    sem = (fait + [t for t in lt[:4] if t not in fait])[:6]
    per = {"jour": (fait, cours, vous), "semaine": (sem, cours + [f"{len(lt)} livrables en relecture chez vous"][:2], vous),
           "mois": ([f"{d['kpis'][0][1]} livrables cette semaine, {int(d['kpis'][0][1]) * 3} sur le mois"] + sem[:3], cours, vous + ["Bilan du mois à relire"])}
    kb = ""
    for pk, (a, b_, c) in per.items():
        kb += (f'<div class="recap rcp{" on" if pk == "jour" else ""}" data-rp="{pk}"><div class="box"><h3>{ic("circle-check", "s")} Fait <span class="cnt">{len(a)}</span></h3><ul>{li(a, "check", "var(--ok)")}</ul></div>'
               f'<div class="box"><h3>{ic("loader", "s")} En cours <span class="cnt">{len(b_)}</span></h3><ul>{li(b_, "clock", "var(--accent-ink)")}</ul></div>'
               f'<div class="box"><h3>{ic("hand", "s")} Attend votre accord <span class="cnt">{len(c)}</span></h3><ul>{li(c, "arrow-right", "var(--brand-ink)")}</ul></div></div>')
    return f"""<div class="h2x"><h2>Résumé</h2><div class="seg rps"><a class="on" data-rp="jour">Aujourd'hui</a><a data-rp="semaine">Cette semaine</a><a data-rp="mois">Ce mois-ci</a></div></div>
<div class="brief" style="margin-top:0"><img src="{B}{e['photo']}" alt=""><p><b>{e['prenom']} :</b> {mot}</p></div>
<div style="margin-top:12px">{kb}</div>
<form class="askx" data-go-to="discussion"><span class="ic2">{ic("sparkles", "s")}</span><input type="text" placeholder="Demander un point précis à {e['prenom']}, par exemple « où en est la campagne Sossa ? »" aria-label="Demander un point précis"><button type="submit" aria-label="Envoyer">{ic("arrow-up", "s")}</button></form>
<div class="h2x"><h2>Cette semaine</h2><a class="link" href="tableau-de-bord.html">Son tableau de bord {FLECHE}</a></div>
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
           ("drive.google.com", "A lu la charte Sossa dans le Drive Unifood", "10:28"), ("canva.com", "Lance l'export en PNG", "10:41")]
    lg = "".join(f'<div class="lg"><img src="{FAV}{d}" alt=""><span class="grow">{t}</span><time>{h}</time></div>' for d, t, h in log)
    return f"""<div class="scrv"><div class="scrh"><span class="live2"><span class="dot"></span> En direct</span><b class="grow">{e['prenom']} adapte le visuel Sossa pour Instagram</b>
<a class="btn o sm" href="#" data-toast="Vous avez la main, {e['prenom']} attend">{ic("mouse-pointer-2", "s")} Prendre la main</a><a class="btn o sm" href="#" data-toast="{e['prenom']} est en pause">{ic("pause", "s")} Pause</a></div>
{ecran_win(k)}
<div class="g2 scrg"><div class="box"><h3 class="bt">{ic("list-checks", "s")} Étapes, 4 sur 5</h3><div class="prog2"><i style="width:72%"></i></div><ul class="tl st2">{st}</ul></div>
<div class="box"><h3 class="bt">{ic("history", "s")} Ce qu'{"elle" if k != "koffi" else "il"} a fait sur l'ordinateur</h3>{lg}<p class="xs mute3" style="margin-top:10px">Demandé par Aïcha à 10:15. Fin prévue vers 11:30.</p></div></div></div>"""

def page_expert(k, brand):
    e, p, d = EXPERTS[k], PRO[k], DASH[k]
    fil = {"fatima": b3.FIL_FATIMA, "koffi": b3.FIL_KOFFI, "djeneba": b3.FIL_DJENEBA}[k]
    sugg = {"fatima": ["Valider le post", "Nouvelle campagne", "Résumé de la semaine"], "koffi": ["Nouvelle affiche", "Déclinaisons", "Résumé de la semaine"],
            "djeneba": ["Ajouter un indicateur à mon tableau de bord", "Mon point du jour", "Résumé pour le DG"]}[k]
    s = "".join(f"<span>{x}</span>" for x in sugg)
    tl = "".join(f'<li class="{st}"><i></i><span class="grow">{t}</span><time>{h}</time></li>' for st, t, h in p["act"])
    docs = "".join(f'<a href="#" data-go="drive"><span class="th {"poster" if t == "poster" else ""}">{"" if t == "poster" else ic("file-text" if t == "doc" else "table")}</span><span class="ell">{n}</span></a>' for t, n, _ in DRIVE[k][:3])
    term = (f'<a href="#" data-go="direct" class="minis">{ecran_win(k, True)}</a><a class="link sm" href="#" data-go="direct" style="margin-top:8px">Voir son écran en grand {ic("arrow-right", "s")}</a>'
            if e["live"] else f'<div class="sm mute3">Écran en veille. Dernière tâche à {p["act"][0][2]}.</div>')
    dl = "".join(f'<a class="dl" href="#"><span class="ic">{ic(icn, "s")}</span><span class="grow"><b class="ell">{t}</b><span class="xs mute3">{typ}, {dt}</span></span><span class="pill {pc}">{pl}</span></a>'
                 for icn, t, kk, typ, dt, fm, (pc, pl) in d["livrables"])
    nav1 = [("discussion", "message-circle", "Discussion"), ("resume", "notebook-text", "Résumé"), ("fiche", "id-card", "Fiche de poste"), ("profil", "sliders-horizontal", "Profil"),
            ("connecteurs", "plug", "Connecteurs"), ("canaux", "radio-tower", "Canaux")]
    nav2 = [("drive", "hard-drive", "Drive", "#E66A4E"), ("mail", "mail", "Mail", "#E5677D"), ("calendrier", "calendar", "Calendrier", "#F0955A"),
            ("livrables", "archive", "Livrables", "#5B5BD6")]
    n1 = "".join(f'<a href="#" data-t="{t}"{" class=on" if t == "discussion" else ""}>{ic(i, "s")} {l}</a>' for t, i, l in nav1)
    n2 = "".join(f'<a href="#" data-t="{t}"><span class="ap" style="background:{c}">{ic(i, "s")}</span> {l}</a>' for t, i, l, c in nav2)
    direct = ecran(k)
    corps = f"""<div class="xp" data-tabs>
<aside class="xcol"><div class="xsw"><a href="accueil.html" aria-label="Retour à l'équipe">{ic("arrow-left", "s")}</a><span class="grow">{e['prenom']}</span><span class="faces">{"".join(f'<a href="{x}.html"><img src="{B}{EXPERTS[x]["photo"]}" alt="{EXPERTS[x]["prenom"]}"></a>' for x in ("djeneba", "fatima", "koffi") if x != k)}</span></div><div class="pcard"><img src="{B}{e['photo']}" alt="">{'<span class="st"><span class="dot"></span> En train de travailler</span>' if e['live'] else ''}
<div class="nm">{e['prenom']} <span>{e['role']}</span></div>
<div class="cta"><a class="call" href="#" data-call="{k}">{ic("phone", "s")} Appeler</a><a class="sq" href="#" data-go="direct" aria-label="Voir son écran">{ic("monitor", "s")}</a><a class="sq pause" href="#" aria-label="Mettre en pause">{ic("power", "s")}</a></div></div>
<div class="xmail"><span>{p['mail']}</span>{ic("copy", "s")}</div>
<nav class="xnav">{n1}<div class="lb">Son espace de travail</div>{n2}</nav></aside>
<div class="xmain">
  <div class="panel on" id="discussion"><div class="dgrid"><div class="chat2"><div class="thread">{fil}</div><div class="comp"><div class="sugg">{s}</div><div class="inp"><button class="ib" aria-label="Joindre un fichier">{ic("plus", "s")}</button><span class="ph">Écrire à {e['prenom']}</span><span class="mode hide-m">{ic("zap", "s")} Rapide {ic("chevron-down", "s")}</span><button class="mic" aria-label="Message vocal">{ic("mic", "s")}</button></div></div></div>
    <div class="rail"><div class="rbox"><h4>{ic("clipboard-list", "s")} Activité de {e['prenom']}</h4><p class="xs mute3">Aujourd'hui</p><ul class="tl">{tl}</ul></div>
    <div class="rbox"><h4>{ic("files", "s")} Documents récents</h4><div class="docs">{docs}</div></div>
    <div class="rbox"><h4>{ic("monitor", "s")} Son ordinateur</h4>{term}</div></div></div></div>
  <div class="panel" id="resume">{x_resume(k)}</div>
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
                    [("Web", "yelema.ai", "Dans cet espace", True), ("WhatsApp", "whatsapp.com", "Clients et équipes", True), ("Telegram", "telegram.org", "Un sujet dans votre groupe", False), ("E-mail", "gmail.com", "Adresse dédiée", False)])
    corps = f"""<div class="rq"><aside class="rqc"><a class="back" href="recruter.html">{ic("arrow-left", "s")} Tous les experts</a>
<div class="rqp">{vid(ph, nom)}<span class="nm"><b>{nom}</b><span>{esc(fi["role"])}</span></span></div>
<p class="sm" style="margin-top:12px">{esc(fi["tl"])}</p>
<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:12px"><span class="pill" style="background:var(--soft-2)"><b>{len(fi.get("competences", []))}</b>&nbsp;compétences</span><span class="pill" style="background:var(--soft-2)"><b>{len(fi.get("livrables", []))}</b>&nbsp;livrables</span><span class="pill" style="background:var(--soft-2)"><b>{len(fi.get("outils", []))}</b>&nbsp;outils</span></div>
<div class="rqprice"><b class="num">200 000 F CFA</b><span class="xs mute3">par mois, prêt en quelques minutes</span><a class="btn p rqgo" href="#rq-go">{ic("user-plus", "s")} Recruter {nom}</a></div></aside>
<div class="rqm">{x_fiche(ph)}
<div class="rqbox" id="rq-go"><h3 class="h3s" style="margin-top:0">Recruter {nom}</h3>
<b class="sm">Assigner à</b><p class="xs mute3">La personne qui travaillera avec {nom}. Vous pourrez en ajouter d'autres.</p><div class="asg">{ASSIGN}</div>
<b class="sm" style="margin-top:16px;display:block">Où le joindre</b><p class="xs mute3">Modifiable à tout moment.</p><div class="dts">{tiles}</div>
<div class="row rqend"><span class="xs mute3 grow">200 000 F CFA par mois. Rien n'est facturé si la mise en place échoue.</span><a class="btn p rqok" href="#" data-nom="{nom}" data-pron="{pron}">{ic("user-plus", "s")} Recruter {nom}</a></div>
<div class="rqdone">{ic("circle-check", "s")} <span></span></div></div></div></div>"""
    crumb = f'<a href="recruter.html">Recruter</a> {ic("chevron-right", "s")} <b>{nom}</b>'
    return page("recruter", brand, f"{nom}, {met}", crumb, corps)

ASSIGN = "".join(f'<span class="as{" on" if i == 0 else ""}" data-who="{n}">{face(c, "", 28)}{n}</span>' for i, (c, n) in enumerate(
    [("AD", "Moi"), ("FB", "Fanta"), ("KO", "Kader"), ("NT", "Nadège"), ("MK", "Mariam"), ("IS", "Ibrahim")])) + f'<span class="as" data-who="tout le service">{ic("users", "s")} Tout un service</span>'
CHN3 = "".join(f'<span class="c3{" on" if on else ""}"><img src="{FAV}{d}" alt="">{n}{ic("check", "s")}</span>' for n, d, on in
               [("Ici", "yelema.ai", True), ("WhatsApp", "whatsapp.com", True), ("Telegram", "telegram.org", False), ("Email", "gmail.com", False)])

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
<div class="asgw"><b class="sm">Assigner à</b><p class="xs mute3">La personne qui travaillera avec l'expert. Vous pourrez en ajouter d'autres.</p><div class="asg">{ASSIGN}</div></div>
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
    corps = f"""<div class="hire"><h1>Qui sera votre prochaine recrue&nbsp;?</h1><p class="sub hsub">Décrivez votre besoin, ou parcourez les experts prêts à rejoindre votre équipe.</p>
<form class="ask ask2" data-kw='{kw}'><span class="ic2">{ic("sparkles", "s")}</span><input type="text" placeholder="Décrivez le travail à confier, on vous propose le bon expert" aria-label="Décrivez le travail à confier"><button class="go2" type="submit" aria-label="Trouver l'expert">{ic("arrow-up")}</button></form>
<div class="ares" hidden></div></div>
<div class="filters" data-filter style="margin-top:16px"><div class="chips">{chips}</div></div>
<section class="pcs2">{cards}</section>"""
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
<div class="srch">{ic("search", "s")} Chercher dans les conversations</div>{fils}</aside>
<section class="gmain vide"><div class="ghead"><b class="gtt">Nouvelle conversation</b><span class="xs mute3">Mémoire d'Unifood</span></div>
<div class="gconv"><div class="gfil" id="c1">{conv}</div><div class="gfil" id="c2">{conv2}</div></div>
<div class="gcomp"><h2 class="ghello">Que puis-je faire pour vous&nbsp;?</h2>
<div class="gin2"><div class="tx">Posez votre question sur Unifood</div><div class="row" style="justify-content:space-between"><span class="row" style="gap:6px"><button class="ib" aria-label="Joindre un fichier">{ic("paperclip", "s")}</button><span class="mode">{ic("zap", "s")} Rapide {ic("chevron-down", "s")}</span></span><span class="row" style="gap:8px"><button class="mic" aria-label="Poser la question à la voix">{ic("mic", "s")}</button><button class="send" aria-label="Envoyer">{ic("arrow-up", "s")}</button></span></div></div>
<p class="xs mute3 gnote">Plus vous donnez de contexte, meilleure est la réponse. Chaque réponse cite ses sources.</p>
<div class="sugg gsug"><span>Nos chiffres de septembre</span><span>Dernier comité</span><span>Qui s'occupe de quoi</span></div></div></section></div>"""
    return page("memoire", brand, "Chat entreprise", "<b>Chat entreprise</b>", corps, wrap=False)

# ---------------------------------------------------------------- admin (réglages)
ORG_NAV = [("admin", "layout-grid", "Vue d'ensemble"), ("admin-experts", "sparkles", "Experts"), ("admin-membres", "users", "Membres et droits"),
           ("admin-connecteurs", "plug", "Connecteurs"), ("admin-facturation", "receipt", "Facturation"), ("admin-general", "building-2", "Détails de l'entreprise")]
ADM_NAV = [("Organisation", [("admin", "layout-grid", "Vue d'ensemble"), ("admin-general", "building-2", "Détails de l'entreprise"), ("admin-experts", "sparkles", "Experts"), ("admin-membres", "users", "Membres et droits"),
                             ("admin-connecteurs", "plug", "Connecteurs"), ("admin-chat", "book-open", "Chat entreprise")]),
           ("Usage et facturation", [("admin-analytics", "chart-column", "Suivi"), ("admin-facturation", "receipt", "Facturation")]),
           ("Compte", [("admin-profil", "shield-check", "Compte administrateur")])]

def admin_page(actif, titre, corps, brand):
    nav = ""
    for g, its in ADM_NAV:
        nav += f'<div class="lb">{g}</div>' + "".join(f'<a class="it{" on" if k == actif else ""}" href="{k}.html">{ic(i, "s")} {l}</a>' for k, i, l in its)
    snav = ""
    autre = "client" if brand == "yelema" else "yelema"
    top = f"""<header class="top"><div class="crumb grow"><a href="admin.html">Administration</a> {ic("chevron-right", "s")} <b>{titre}</b></div><a class="tbtn ico hide-m" href="../{autre}/{actif}.html" title="{"Couleurs Unifood" if brand == "yelema" else "Couleurs Yelema"}">{ic("palette", "s")}</a>
<a class="tbtn hide-m" href="#" data-open="inv">{ic("mail-plus", "s")} Inviter un membre</a><a class="tbtn pr" href="recruter.html">{ic("user-plus", "s")} Recruter un expert</a><button class="tbtn ico" data-pop="notifs" aria-label="Notifications">{ic("bell", "s")}<span class="bdg">4</span></button></header>"""
    return (b3.head(titre, brand) + f'<div class="app adm-app">{sidebar_admin(actif, brand)}<main style="min-width:0">{top}<div class="adm adm1">{snav}<div class="page"><div class="sform" style="max-width:1080px">{corps}</div></div></div></main></div>'
            + pops() + yele() + modales() + fin())

def sg(rows):
    return '<div class="sg">' + "".join(f'<div><div class="grow"><b>{t}</b><span class="d">{d}</span></div>{f"<div class=ctl>{c}</div>" if c else ""}</div>' for t, d, c in rows) + "</div>"

def adm_general(brand):
    sw = '<div class="sw3"><i style="background:#E00040"></i><i style="background:#F8B400"></i><i style="background:#5A1022"></i></div>'
    seg = f'<div class="seg"><a href="../yelema/admin.html" class="{"on" if brand == "yelema" else ""}">Yelema</a><a href="../client/admin.html" class="{"on" if brand == "client" else ""}">Unifood</a></div>'
    corps = f"""<div style="max-width:820px"><h1>Détails de l'entreprise</h1><p class="sub">Ce que vos experts savent d'Unifood, et ce que voient tous les membres</p>
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
<h3 class="h3s">Hébergement</h3>{sg([("Cloud dédié en Côte d'Ivoire", "Les livrables restent dans le Drive d'Unifood", '<span class="pill ok">Actif</span>')])}</div>"""
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
    corps = f"""<div class="hello"><div class="grow"><h1>Connecteurs</h1><p class="sub">Les outils d'Unifood branchés une fois, puis donnés aux experts qui en ont besoin</p></div><span class="composio">{ic("plug-zap", "s")} Fournis par Composio</span></div>
<div class="cfil" style="margin-top:12px"><label class="srch czs">{ic("search", "s")}<input type="search" placeholder="Chercher un outil" aria-label="Chercher un outil" data-tq></label></div>
<div class="box" style="margin-top:10px"><table class="tbl"><tr><th>Outil</th><th class="hide-m">Catégorie</th><th>Experts qui y ont accès</th><th></th></tr>{rows}</table></div>"""
    return admin_page("admin-connecteurs", "Connecteurs", corps, brand)

def modal_cxa():
    xs = "".join(f'<label class="cxo"><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{EXPERTS[k]["prenom"]}</b><small>{EXPERTS[k]["role"]}</small></span><span class="sw{"" if k != "koffi" else " off"}"></span></label>' for k in ("djeneba", "fatima", "koffi"))
    return f"""<div class="modal" id="cxa"><div class="ov" data-close></div><div class="pn shpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Qui utilise <span class="czn">cet outil</span>&nbsp;?</h2><p class="sm mute">Donnez l'accès à toute l'équipe d'experts, ou seulement à certains.</p>
<div class="seg shs" data-sh2><a class="on" href="#">Tous les experts</a><a href="#">Choisir</a></div>{xs}
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:12px"><a class="btn o" href="#" data-close>Annuler</a><a class="btn p" href="#" data-close data-toast="Accès mis à jour">Enregistrer</a></div></div></div>"""

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
    droits = [("Voir son tableau de bord", "ooo"), ("Parler aux experts de son équipe", "ooo"), ("Utiliser le chat entreprise", "ooo"), ("Recruter un expert et l'assigner", "onn"),
              ("Inviter des membres", "onn"), ("Voir la facturation", "onn"), ("Voir le suivi de l'équipe", "oon"), ("Changer la charte et les réglages", "onn")]
    tr = "".join(f'<tr><td>{l}</td>{"".join(ok if c == "o" else no for c in r)}</tr>' for l, r in droits)
    mem = [("AD", "#7A4E2D", "Aïcha Diabaté", "Directrice marketing", "Responsable", "Djénéba, Fatima"), ("SB", "#2E4EC4", "Serge Bamba", "Direction administrative", "Direction", "Djénéba"),
           ("YK", "#0F7B5F", "Yao Kra", "Graphiste", "Équipe", "Koffi"), ("NT", "#8A3B12", "Nadège Touré", "Chargée de communication", "Équipe", "Fatima"),
           ("KO", "#5A1022", "Kader Ouattara", "Commercial", "Équipe", "Chat entreprise")]
    ml = "".join(f'<tr><td><a class="who" href="admin-membre.html">{face(i, "", 36)}<span><b>{n}</b><br><span class="xs mute3">{po}</span></span></a></td><td class="hide-m">{svc}</td><td><span class="pill br">{r}</span></td><td><a class="link" href="admin-membre.html">Voir</a></td></tr>' for i, n, po, svc, r in MEMBRES)
    corps = f"""<div class="hello"><div class="grow"><h1>Membres et droits</h1><p class="sub">14 membres dans 5 services, 2 invitations en attente</p></div><a class="btn p" href="#" data-open="inv">{ic("user-plus", "s")} Inviter un membre</a></div>
<div class="box" style="margin-top:16px"><table class="tbl"><tr><th>Membre</th><th class="hide-m">Service</th><th>Rôle</th><th></th></tr>{ml}</table></div>
<div class="box" style="margin-top:14px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Qui peut faire quoi</h2></div><table class="tbl"><tr><th></th><th style="text-align:center">Admin</th><th style="text-align:center">Responsable</th><th style="text-align:center">Équipe</th></tr>{tr}</table></div>"""
    return admin_page("admin-membres", "Membres et droits", corps, brand)

JEKO_BTN = '<a class="btn jk sm" href="#" data-open="jeko"><b>jèko</b> Payer avec Jèko</a>'
def modal_jeko():
    ms = [("Wave", "wave.com"), ("Orange Money", "orange.ci"), ("MTN MoMo", "mtn.ci"), ("Moov Money", "moov-africa.ci"), ("Carte Visa ou Mastercard", "visa.com")]
    opts = "".join(f'<label class="jm{" on" if i == 0 else ""}"><img src="{FAV}{d}" alt=""><span class="grow">{n}</span><i></i></label>' for i, (n, d) in enumerate(ms))
    return f"""<div class="modal" id="jeko"><div class="ov" data-close></div><div class="pn jkp"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<div class="jkh"><span class="jkl">jèko</span><span class="xs" style="opacity:.85">Paiement sécurisé</span></div>
<div class="jkb"><p class="xs mute3">Facture de novembre, Yelema</p><div class="jka num">500 000 F CFA</div>
<b class="sm">Payer avec</b><div class="jms">{opts}</div>
<div class="fl2"><span class="xs mute3">Numéro mobile money</span><span class="inp3">+225 07 00 00 00 00</span></div>
<a class="btn p jgo" href="#">Payer 500 000 F CFA</a>
<p class="xs mute3" style="text-align:center;margin-top:8px">Vous validez sur votre téléphone. Le reçu arrive par email.</p></div></div></div>"""

SHCH = "".join(f'<a class="shc" href="#" data-toast="{t}"><img src="{FAV}{d}" alt="">{n}</a>' for n, d, t in
               [("E-mail", "gmail.com", "Envoyé par e-mail"), ("Telegram", "telegram.org", "Envoyé dans Telegram"), ("WhatsApp", "whatsapp.com", "Envoyé sur WhatsApp")])
def modal_share():
    ppl = "".join(f'<div class="shp">{face(i, "", 32)}<span class="grow"><b class="sm">{n}</b><span class="xs mute3">{r}</span></span><span class="pill" style="background:var(--soft-2)">{d}</span></div>'
                  for i, n, r, d in [("JA", "Jean-Marc Aka", "Directeur général", "Lecture"), ("SB", "Serge Bamba", "Directeur administratif", "Lecture"), ("IS", "Ibrahim Sylla", "Contrôleur financier", "Lecture")])
    return f"""<div class="modal" id="share"><div class="ov" data-close></div><div class="pn shpn"><button class="ib x" data-close aria-label="Fermer">{ic("x")}</button>
<h2>Partager le tableau de bord</h2><p class="sm mute">Vue Codir, semaine du 28 septembre</p>
<div class="seg shs" data-sh><a class="on" href="#" data-v="prive">{ic("lock", "s")} Version privée</a><a href="#" data-v="public">{ic("globe", "s")} Version publique</a></div>
<div class="shv on" id="sh-prive"><p class="xs mute3">Pour les collaborateurs d'Unifood. Tous les chiffres, mis à jour en direct.</p>
<div class="inp3 row" style="gap:8px">{ic("search", "s")} <span class="mute3">Ajouter un membre d'Unifood par nom</span></div>{ppl}
<b class="sm" style="margin-top:6px">Ou envoyer à quelqu'un</b><div class="shch">{SHCH}</div></div>
<div class="shv" id="sh-public"><p class="xs mute3">Pour l'extérieur : un client, un investisseur, un partenaire. Lecture seule, sans connexion.</p>
<div class="sg"><div><div class="grow"><b>Masquer les montants</b><span class="d">Factures, coûts et prix des experts</span></div><span class="sw"></span></div>
<div><div class="grow"><b>Masquer les noms des membres</b><span class="d">Remplacés par leur service</span></div><span class="sw"></span></div>
<div><div class="grow"><b>Expire</b><span class="d">Le lien ne s'ouvre plus après</span></div><span class="inp2">dans 30 jours</span></div></div>
<label class="shmask"><b class="sm">Ce que vous voulez masquer</b><textarea rows="2" placeholder="Ex. : le projet Packaging, les chiffres de Super Mint"></textarea><span class="xs mute3">Votre Chief of Staff retire ces éléments avant de créer le lien.</span></label>
<div class="lnk"><span class="ell">yelema.ai/p/unifood-codir-7Hk2</span><a class="btn o sm" href="#" data-toast="Lien copié">{ic("copy", "s")} Copier</a></div><div class="shch">{SHCH}</div></div>
<div class="row" style="justify-content:flex-end;gap:8px;margin-top:16px"><a class="btn o" href="#" data-close>Annuler</a><a class="btn p" href="#" data-close data-toast="Tableau de bord partagé">Partager</a></div></div></div>"""

def adm_factu(brand):
    fac = "".join(f'<tr><td>{m_}</td><td class="num">{v}</td><td><span class="pill {s}">{l}</span></td><td><a class="link" href="#">{ic("download", "s")} PDF</a></td></tr>' for m_, v, s, l in
                  [("Novembre 2026", "500 000", "ac", "À venir"), ("Octobre 2026", "500 000", "ok", "Payée par Jèko, Wave"), ("Septembre 2026", "1 300 000", "ok", "Payée par Jèko, Orange Money")])
    pm = "".join(f'<div class="pm"><img src="{FAV}{d}" alt=""><span class="grow"><b>{n}</b><small>{x}</small></span>{t}</div>' for n, d, x, t in
                 [("Jèko, Wave", "wave.com", "+225 07 •• •• 00 00", '<span class="pill ok">Par défaut</span>'), ("Jèko, Orange Money", "orange.ci", "+225 05 •• •• 11 22", '<a class="link sm" href="#" data-toast="Moyen par défaut changé">Par défaut</a>'),
                  ("Carte Visa", "visa.com", "•••• 4242, expire 08/28", '<a class="link sm" href="#" data-toast="Moyen par défaut changé">Par défaut</a>'), ("Virement bancaire", "bceao.int", "Société Générale CI, RIB sur la facture", '<a class="link sm" href="#" data-toast="RIB copié">Copier le RIB</a>')])
    corps = f"""<div style="max-width:980px"><h1>Facturation</h1><p class="sub">Suivez votre formule, vos moyens de paiement et vos factures</p>
<div class="fk3"><div class="fk"><span>Formule</span><b>Experts Yelema</b><small>3 experts, jusqu'à 50 membres</small></div><div class="fk"><span>Consommation du mois</span><b>126 livrables</b><small class="ok">sans dépassement</small></div><div class="fk"><span>Prochaine facture</span><b class="num">500 000 F CFA</b><small>le 1er novembre</small></div></div>
<div class="box" style="margin-top:14px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Moyens de paiement</h2><a class="btn o sm" href="#" data-open="jeko">{ic("plus", "s")} Ajouter</a></div>{pm}</div>
<div class="box" style="margin-top:14px"><div class="ch"><h2 style="font-size:16px;font-weight:650">Compte de facturation</h2><a class="btn o sm" href="#" data-toast="Modification ouverte">Modifier</a></div>
{sg([("Raison sociale", "", '<span class="inp2">Unifood SA</span>'), ("Compte contribuable", "", '<span class="inp2">CI-ABJ-2009-B-1234</span>'), ("Factures envoyées à", "", '<span class="inp2">compta@unifood.info</span>')])}</div>
{sg([("Prochaine facture", "Le 1er novembre", '<b class="num" style="font-size:22px">500 000 F CFA</b>'),
     ("Experts", "Djénéba incluse, Fatima et Koffi", '<a class="btn o sm" href="admin-experts.html">Gérer</a>'),
     ("Moyen de paiement", "Par Jèko : Wave, Orange Money, MTN, Moov ou carte", JEKO_BTN)])}
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
    corps = f"""<div style="max-width:820px"><h1>Compte administrateur</h1><p class="sub">Séparé de votre compte utilisateur. Il sert seulement à gérer l'espace Unifood.</p><div class="pfh" style="margin:12px 0 14px"><div class="pfav" style="width:96px;height:96px"><span class="adav big">{ic("shield-check")}</span></div><div><b style="font-size:20px">Admin Unifood</b><p class="sub">Tenu par Aïcha Diabaté, Directrice marketing</p></div></div>
{sg([("Nom du compte", "", '<span class="inp2">Admin Unifood</span>'), ("Adresse email", "Différente de l'adresse utilisateur", '<span class="inp2">admin@unifood.info</span>'),
     ("Notifications", "Un résumé chaque matin par email", '<span class="sw"></span>'), ("Double authentification", "Code par SMS à chaque connexion", '<span class="sw"></span>'),
     ("Mot de passe", "Différent de celui du compte utilisateur", f'<a class="btn o sm" href="#" data-open="mdp" data-mdwho="Compte administrateur, admin@unifood.info">{ic("key-round", "s")} Changer le mot de passe</a>'),
     ("Se déconnecter", "Quitter le compte administrateur", f'<a class="btn o sm" href="connexion.html#out-admin">{ic("log-out", "s")} Se déconnecter</a>')])}</div>"""
    return admin_page("admin-profil", "Compte administrateur", corps, brand)


# ---------------------------------------------------------------- canaux (Telegram, WhatsApp, Slack, Teams)
CANAUX = [("Telegram", "telegram.org", True, "Groupe Unifood, un sujet par expert", "https://t.me/", "Ouvrir"),
          ("Email", "gmail.com", True, "@unifood.yelema.ai", "fatima.html#mail", "Ouvrir"),
          ("Slack", "slack.com", True, "Canal #marketing d'Unifood", "https://slack.com/", "Ouvrir"),
          ("Microsoft Teams", "teams.microsoft.com", True, "Équipe Unifood, canal Général", "https://teams.microsoft.com/", "Ouvrir"),
          ("WhatsApp", "whatsapp.com", False, "Sur demande", "#", "Demander")]

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
               else (f'<a class="btn k sm" href="#" data-go="mail">{lib} {ic("arrow-right", "s")}</a>' if on else f'<a class="btn o sm" href="#" data-toast="Demande envoyée à l\'équipe Yelema">{lib}</a>'))
        t += f'<div class="cn2{"" if on else " off"}"><div class="row" style="justify-content:space-between"><span class="cnl">{logo}</span>{f'<span class="sti on">{ic("circle-check")}</span>' if on else ""}</div><b>{n}</b><span class="ell">{det2}</span>{btn}</div>'
    return f"""<div class="h2x"><h2>Où parler à {e['prenom']}</h2><span class="sm">Tous les messages arrivent aussi ici, dans Discussion</span></div><div class="cn2g">{t}</div>"""

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
    xs = "".join(f'<span class="{"on" if k == "djeneba" else ""}"><img src="{B}{k}.jpg" alt="">{EXPERTS[k]["prenom"]}</span>' for k in ("djeneba", "fatima", "koffi"))
    return f"""<div class="modal" id="inv"><div class="ov" data-close></div><div class="pn invp"><div class="rt2">
<h2>Inviter un membre <button class="ib x2" data-close aria-label="Fermer">{ic("x", "s")}</button></h2>
<p class="sm mute" style="margin-top:-6px">Il ou elle reçoit un lien pour créer son mot de passe.</p>
<div class="g2i"><label class="fl2"><span>Prénom et nom</span><input class="inp3" placeholder="Awa Koné"></label><label class="fl2"><span>Adresse email</span><input class="inp3" type="email" placeholder="prenom.nom@unifood.info"></label></div>
<div class="fl2"><span>Service</span><div class="opts r3 sv"><span class="on">Marketing</span><span>Commercial</span><span>Finance</span><span>RH</span><span>Opérations</span><span>Direction</span></div></div>
<div class="fl2"><span>Rôle</span><div class="opts r3"><span class="on">Membre</span><span>Responsable de service</span><span>Admin</span></div></div>
<div class="fl2"><span>Ses experts</span><div class="opts r3 ex">{xs}</div></div>
<a class="btn p invgo" href="#" style="min-height:48px;justify-content:center">{ic("send", "s")} Envoyer l'invitation</a>
<div class="invok">{ic("circle-check", "s")} Invitation envoyée. Elle recevra un lien par email et par WhatsApp.</div>
<div class="lnk"><span class="ell">yelema.ai/invite/unifood-4Rt9</span><a class="btn o sm" href="#" data-toast="Lien d'invitation copié">{ic("copy", "s")} Copier le lien</a></div>
<div class="shch">{SHCH}</div></div></div></div>"""

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
    xa = lambda k: f'<a class="tbtn ico" href="#" data-call="{k}" aria-label="Appeler">{ic("phone", "s")}</a><a class="tbtn" href="{k}.html">{ic("arrow-up-right", "s")} Son espace</a>'
    th = lambda i, h, body, on=False: f'<div class="cth{" on" if on else ""}" id="c-{i}">{h}<div class="thread">{body}</div></div>'
    threads = (th("fatima", head("fatima", "Fatima", "Expert marketing et contenu, au travail", xa("fatima")), b3.FIL_FATIMA, True)
               + th("general", head("general", "# Général", "14 membres et 3 experts", '<a class="tbtn" href="https://t.me/" target="_blank" rel="noopener">' + TG + ' Aussi dans Telegram</a>'), gen)
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
    act = "".join(f'<a class="ax2" href="{xh(k)}"><img src="{B}pied/{k}.jpg" alt=""><span class="grow"><b>{n}</b><span>{r}</span></span>'
                  + (f'<span class="stt on">{ic("circle-check", "s")} Actif</span>' if on else f'<span class="stt">{ic("circle-pause", "s")} En pause</span>') + '</a>'
                  for k, n, r, sv, u, lv, p, on in ALL_EXPERTS)
    deja = {k for k, *_ in ALL_EXPERTS}
    dispo = "".join(f'<a class="ax2 off" href="recrue-{ph}.html"><img src="{B}pied/{ph}.jpg" alt=""><span class="grow"><b>{nom}</b><span>{met}</span></span><span class="stt add">{ic("plus", "s")} Recruter</span></a>'
                    for ph, nom, met, *_ in CATALOGUE if ph not in deja)
    xs = "".join(f'<a class="ax" href="{xh(k)}"><img src="{B}{k}.jpg" alt=""><span class="grow"><b>{n}</b><span>{r}</span>{"" if sv == r else f'<span class="xs mute3">Service {sv}</span>'}</span>{"<span class=sw></span>" if on else "<span class=\"sw off\"></span>"}</a>' for k, n, r, sv, u, lv, p, on in ALL_EXPERTS)
    ms = "".join(f'<a class="am" href="admin-membre.html">{face(i, "", 48)}<b>{n.split(" ")[0]}</b><span>{svc}</span></a>' for i, n, po, svc, r in MEMBRES)
    corps = f"""<div class="hello"><div class="grow"><p class="date">Administration Unifood</p><h1>Vue d'ensemble</h1></div><a class="btn p" href="recruter.html">{ic("plus", "s")} Recruter un expert</a></div>
<div class="stat4">{stat("sparkles", "7", "experts, dont 6 en service")}{stat("users", "14", "membres dans 5 services")}{stat("package", "126", "livrables ce mois-ci", '<span class="pill ok">+31</span>')}{stat("receipt", "1 300 000", "F CFA, facture du 1er novembre")}</div>
<div class="h2x" style="margin-top:24px"><h2>Experts d'Unifood <span class="sm">6 actifs, 1 en pause</span></h2><a class="link" href="admin-experts.html">Gérer {FLECHE}</a></div><div class="axg2">{act}</div>
<div class="h2x"><h2>Pas encore dans l'équipe <span class="sm">{len(CATALOGUE) + 3 - len(deja)}</span></h2><a class="link" href="recruter.html">Tous les experts {FLECHE}</a></div><div class="axg2">{dispo}</div>
<div class="h2x"><h2>Canaux de l'organisation</h2></div>{canaux_strip()}"""
    return admin_page("admin", "Vue d'ensemble", corps, brand)

def stat(i, v, l, extra=""):
    return f'<div class="kpi"><span class="ic">{ic(i, "s")}</span><div class="v">{v}</div><div class="l">{l}</div>{extra}</div>'

def adm_membre(brand):
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
<div class="aut"><h1>Chaque métier a<br><span class="hl">son Expert IA</span>.</h1><p>Retrouvez votre équipe d'Experts, là où vous l'avez laissée.</p></div>
<div class="hero-img auhero"><img src="{B}hero-site.webp" alt="Trois Experts IA Yelema : Fatou, Ibrahim et Fatima">{tags}</div>
<p class="ausec">{ic("lock", "s")} Espace sécurisé, réservé aux membres d'Unifood</p></div>"""
    return (b3.head(titre, brand) + f'<div class="auth"><div class="aucard">{gauche}<div class="aur">{droite}'
            + f'<a class="pby aupby" href="https://leslita06.github.io/yelema-site-preview/">Powered by <img src="{B}yelema_logo_final_long.svg" alt="Yelema"></a></div></div></div>'
            + '<div class="toast" role="status"></div>' + fin())

def page_connexion(brand):
    d = f"""<div class="aumsg" data-out hidden>{ic("circle-check", "s")} <span>Vous êtes déconnectée. À bientôt, Aïcha.</span></div>
<h2>Connexion à votre espace</h2><p class="sub">Entrez vos identifiants pour retrouver vos experts.</p>
<form class="auf" data-login><label class="mdf"><span>Adresse email</span><span class="mdi"><input type="email" value="aicha.diabate@unifood.info" autocomplete="username"></span></label>
<label class="mdf"><span>Mot de passe</span><span class="mdi"><input type="password" value="motdepasse" autocomplete="current-password"><button type="button" class="eye" aria-label="Afficher le mot de passe">{ic("eye", "s")}</button></span></label>
<div class="row aurow"><label class="mdc"><input type="checkbox" checked> Rester connectée</label><a class="link" href="mot-de-passe.html">Mot de passe oublié ?</a></div>
<div class="seg auseg"><a class="on" data-acc="accueil.html">{ic("user", "s")} Compte utilisateur</a><a data-acc="admin.html">{ic("shield-check", "s")} Compte admin</a></div>
<button class="btn p auok" type="submit">Se connecter {ic("arrow-right", "s")}</button></form>
<p class="xs mute3 aunote">Besoin d'un accès ? Demandez à l'administrateur d'Unifood de vous inviter.</p>"""
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
                 "admin": adm_vue(brand), "admin-general": adm_general(brand), "admin-membre": page_admin_membre(brand), "profil": page_profil(brand), "chat": page_chat(brand), "admin-experts": adm_experts(brand), "admin-membres": adm_membres(brand), "admin-facturation": adm_factu(brand),
                 "admin-analytics": adm_analytics(brand), "admin-chat": admin_page("admin-chat", "Chat entreprise", memoire_corps(True), brand), "admin-profil": adm_profil(brand), "admin-connecteurs": adm_connect(brand),
                 "connexion": page_connexion(brand), "mot-de-passe": page_mdp_oublie(brand)}
        for k in ("djeneba", "fatima", "koffi"):
            pages[k] = page_expert(k, brand)
        for c in CATALOGUE:
            pages["recrue-" + c[0]] = page_recrue(c[0], brand)
        for n, html in pages.items():
            html = html.replace('href="ecran.html"', 'href="fatima.html#direct"')
            open(os.path.join(d, n + ".html"), "w", encoding="utf-8").write(html)
        print("ok", brand, len(pages), "pages")
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(page_choix())
    print("ok index")
