#!/usr/bin/env python3
"""Front client Yelema v3 (ordinateur d'abord), deux habillages tirés des mêmes données.

    python3 build3.py   ->  site/index.html (choix A / B), site/yelema/*.html, site/client/*.html

Données fictives : Unifood est un vrai prospect (démo faite), tous les interlocuteurs,
projets et chiffres sont inventés.
"""
import os, re, shutil, glob, urllib.request

ICI = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ICI, "site")
CACHE = os.path.join(ICI, "..", "icons")
IMG_SRC = os.path.join(ICI, "..", "img")
os.makedirs(CACHE, exist_ok=True)

# ---------------------------------------------------------------- icônes
def ic(nom, cls=""):
    f = os.path.join(CACHE, nom + ".svg")
    if not os.path.exists(f):
        url = f"https://cdn.jsdelivr.net/npm/lucide-static@0.469.0/icons/{nom}.svg"
        with urllib.request.urlopen(url, timeout=20) as r, open(f, "wb") as o:
            o.write(r.read())
    s = open(f, encoding="utf-8").read()
    s = re.sub(r"<!--.*?-->", "", s, flags=re.S).strip()
    s = re.sub(r'\sclass="[^"]*"', "", s)
    s = re.sub(r'\s(width|height)="24"', "", s)
    return s.replace("<svg", f'<svg class="i {cls}" aria-hidden="true"', 1)

PERSON = '<svg viewBox="0 0 24 24" class="{c}"><circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z"/></svg>'
CURSOR = '<svg class="cursor" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#17112B" stroke-width="1.5" stroke-linejoin="round"/></svg>'

# ---------------------------------------------------------------- données
CLIENT = {"nom": "Unifood", "logo": "unifood.png"}
MOI = {"ini": "AD", "prenom": "Aïcha", "nom": "Aïcha Diabaté", "poste": "Directrice marketing", "couleur": "#7A4E2D"}

EXPERTS = {
    "djeneba": {"prenom": "Djénéba", "role": "Chief of Staff", "photo": "djeneba.jpg", "statut": "Disponible", "live": False,
                "binome": ("AD", "#7A4E2D", "Avec vous"), "c": "c3"},
    "fatima": {"prenom": "Fatima", "role": "Marketing et contenu", "photo": "fatima.jpg", "statut": "Au travail", "live": True,
               "binome": ("AD", "#7A4E2D", "Avec Aïcha Diabaté"), "c": "c1"},
    "koffi": {"prenom": "Koffi", "role": "Design", "photo": "koffi.jpg", "statut": "Disponible", "live": False,
              "binome": ("YK", "#0F7B5F", "Avec Yao Kra, graphiste"), "c": "c2"},
}
JOURS = ["lun 28", "mar 29", "mer 30", "jeu 1", "ven 2", "sam 3", "dim 4"]

L_TEAM = [
    ("image", "Sossa, post Facebook de la promo rentrée", "fatima", "visuel", "01/10", ["PNG"], ("ac", "À valider")),
    ("package", "Packaging édition limitée, maquette 3D", "koffi", "visuel", "01/10", ["PDF", "PNG"], ("br", "v2")),
    ("file-text", "Note au comité de direction du 2 octobre", "djeneba", "note", "01/10", ["DOCX"], ("ac", "À valider")),
    ("table", "Super Mint, calendrier éditorial d'octobre", "fatima", "tableur", "30/09", ["XLSX"], ("br", "v3")),
    ("clapperboard", "Sossa, scénario du film de 30 secondes", "fatima", "document", "30/09", ["DOCX", "PDF"], ("br", "v1")),
    ("presentation", "Rapport des réseaux sociaux de septembre", "fatima", "présentation", "30/09", ["PPTX", "PDF"], ("br", "v1")),
    ("image", "Super Mint, 6 visuels Instagram", "koffi", "visuel", "29/09", ["PNG"], ("ok", "Validé")),
]

DASH = {
    "equipe": {
        "imp": ("92 h", "+18 h vs semaine passée à date", "2,9", 4, 11.5),
        "kpis": [("package", "46", "livrables", "+12"), ("sparkles", "38", "documents neufs", "+10"), ("refresh-cw", "8", "révisions", "+2"),
                 ("folder-open", "9", "projets actifs", "+3"), ("target", "84 %", "acceptés sans révision", None), ("hourglass", "2", "en attente de votre retour", "warn")],
        "jours": [{"fatima": 5, "koffi": 4, "djeneba": 1}, {"fatima": 7, "koffi": 5, "djeneba": 2}, {"fatima": 6, "koffi": 4, "djeneba": 1}, {"fatima": 6, "koffi": 4, "djeneba": 1}],
        "avant": [7, 8, 6, 7, 9, 0, 0],
        "formats": [("Visuel", 18), ("Présentation", 9), ("Vidéo", 7), ("Document", 6), ("Tableur", 4), ("Autre", 2)],
        "projets": [("Sossa, campagne rentrée", 12, "01/10"), ("Super Mint, réseaux sociaux", 9, "30/09"), ("Rapport mensuel des réseaux", 6, "01/10"),
                    ("Packaging édition limitée", 5, "01/10"), ("Comité de direction", 4, "01/10")],
        "livrables": L_TEAM,
    },
    "fatima": {
        "imp": ("48 h", "+9 h vs semaine passée à date", "1,5", 4, 6),
        "kpis": [("package", "24", "livrables", "+6"), ("sparkles", "20", "documents neufs", "+5"), ("refresh-cw", "4", "révisions", "+1"),
                 ("folder-open", "5", "projets actifs", "+1"), ("target", "88 %", "acceptés sans révision", None), ("hourglass", "1", "en attente de votre retour", "warn")],
        "jours": [{"fatima": 5}, {"fatima": 7}, {"fatima": 6}, {"fatima": 6}], "avant": [4, 5, 4, 5, 6, 0, 0],
        "formats": [("Visuel", 10), ("Présentation", 5), ("Vidéo", 4), ("Document", 3), ("Tableur", 2)],
        "projets": [("Sossa, campagne rentrée", 9, "01/10"), ("Super Mint, réseaux sociaux", 8, "30/09"), ("Rapport mensuel des réseaux", 4, "30/09"),
                    ("Veille de la concurrence", 2, "29/09"), ("Avis Google", 1, "28/09")],
        "livrables": [l for l in L_TEAM if l[2] == "fatima"],
    },
    "koffi": {
        "imp": ("34 h", "+6 h vs semaine passée à date", "1,1", 4, 4.3),
        "kpis": [("package", "17", "livrables", "+4"), ("sparkles", "13", "documents neufs", "+3"), ("refresh-cw", "4", "révisions", "+1"),
                 ("folder-open", "4", "projets actifs", "0"), ("target", "76 %", "acceptés sans révision", None), ("hourglass", "1", "en attente chez Yao", "warn")],
        "jours": [{"koffi": 4}, {"koffi": 5}, {"koffi": 4}, {"koffi": 4}], "avant": [3, 4, 3, 4, 4, 0, 0],
        "formats": [("Visuel", 9), ("Présentation", 3), ("Vidéo", 3), ("Autre", 2)],
        "projets": [("Packaging édition limitée", 6, "01/10"), ("Sossa, campagne rentrée", 5, "30/09"), ("Super Mint, réseaux sociaux", 4, "29/09"),
                    ("Charte des marques", 2, "28/09")],
        "livrables": [l for l in L_TEAM if l[2] == "koffi"] + [("palette", "Charte Super Mint, planche couleurs", "koffi", "visuel", "28/09", ["PDF"], ("ok", "Validé"))],
    },
    "djeneba": {
        "imp": ("10 h", "+2 h vs semaine passée à date", "0,3", 4, 1.3),
        "kpis": [("package", "5", "livrables", "+1"), ("sparkles", "5", "documents neufs", "+1"), ("refresh-cw", "0", "révisions", "0"),
                 ("folder-open", "2", "projets actifs", "0"), ("target", "100 %", "acceptés sans révision", None), ("hourglass", "1", "en attente de votre retour", "warn")],
        "jours": [{"djeneba": 1}, {"djeneba": 2}, {"djeneba": 1}, {"djeneba": 1}], "avant": [1, 1, 1, 1, 0, 0, 0],
        "formats": [("Document", 3), ("Présentation", 1), ("Tableur", 1)],
        "projets": [("Comité de direction", 4, "01/10"), ("Point de la semaine", 1, "28/09")],
        "livrables": [l for l in L_TEAM if l[2] == "djeneba"] + [("calendar-check", "Point de la semaine, lundi 28", "djeneba", "note", "28/09", ["PDF"], ("ok", "Validé"))],
    },
}

# ---------------------------------------------------------------- briques
def head(titre, brand):
    return f"""<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>{titre}, Yelema</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../app.css"></head>
<body data-brand="{brand}">"""

def barre(actif, brand):
    autre = "client" if brand == "yelema" else "yelema"
    lib = "Couleurs Unifood" if brand == "yelema" else "Couleurs Yelema"
    nav = f'<a href="accueil.html" class="{"on" if actif == "accueil" else ""}">{ic("layout-dashboard","s")} Tableau de bord</a><span class="sep"></span>'
    for k in ("djeneba", "fatima", "koffi"):
        e = EXPERTS[k]
        nav += f'<a href="{k}.html" class="{"on" if actif == k else ""}"><img src="../img/{e["photo"]}" alt="">{e["prenom"]}</a>'
    nav += f'<a href="recruter.html" class="{"on" if actif == "recruter" else ""}">{ic("plus","s")} Recruter</a>'
    return f"""<header class="bar">
  <a class="logo-c" href="accueil.html"><img src="../img/{CLIENT['logo']}" alt="{CLIENT['nom']}"><div><b>{CLIENT['nom']}</b><span>avec <img src="../img/yelema_logo_final_long.svg" alt="Yelema"></span></div></a>
  <nav class="nav">{nav}</nav>
  <span class="grow"></span>
  <a class="link hide-m" href="../{autre}/{actif if actif != 'entreprise' else 'accueil'}.html">{ic("palette","s")} {lib}</a>
  <a class="link hide-m" href="entreprise.html">{ic("building-2","s")} Espace entreprise</a>
  <span class="me" style="background:{MOI['couleur']}">{MOI['ini']}</span>
</header>"""

def impact(d):
    h, delta, pers, jours, parjour = d["imp"]
    n = float(pers.replace(",", "."))
    pp = "".join(PERSON.format(c="") for _ in range(int(n))) + (PERSON.format(c="half") if n - int(n) >= .3 else "")
    pj = f"{parjour:g}".replace(".", ",")
    return f"""<section class="impact">
  <div class="imp"><span class="ic">{ic("timer")}</span><div><div class="v">{h}</div><div class="l">gagnées cette semaine (estimation)</div><span class="d">▲ {delta}</span></div></div>
  <div class="imp"><span class="ic">{ic("users")}</span><div><div class="v">comme {pers} pers.</div><div class="l">à plein temps, sur {jours} jours ouvrés</div><div class="people">{pp}</div></div></div>
  <div class="imp"><span class="ic">{ic("zap")}</span><div><div class="v">{pj}</div><div class="l">livrables par jour ouvré</div></div></div>
</section>"""

def filtres(d):
    fm = "".join(f'<span class="chip">{n} <em>{v}</em></span>' for n, v in d["formats"])
    return f"""<div class="filters">
  <div class="seg"><a>Jour</a><a class="on">Semaine</a><a>Mois</a><a>Tout</a></div>
  <span class="pick">{ic("search","s")} Rechercher un livrable</span>
  <span class="pick">{ic("folder","s")} Tous les projets ({len(d['projets'])}) {ic("chevron-down","s")}</span>
  <div class="chips"><span class="chip on">Tout</span>{fm}</div>
</div>"""

def kpis(d):
    out = ""
    for icn, v, l, delta in d["kpis"]:
        warn = delta == "warn"
        dl = "" if (delta is None or warn) else f'<span class="pill {"ok" if not delta.startswith("0") else "br"}">{"▲ " if delta.startswith("+") else ""}{delta} vs sem. passée</span>'
        out += f'<div class="kpi{" warn" if warn else ""}"><span class="ic">{ic(icn,"s")}</span><div class="v">{v}</div><div class="l">{l}</div>{dl}</div>'
    return f'<section class="kpis">{out}</section>'

def chart(d, cles):
    W, H, B, T = 640, 210, 26, 18
    mx = max(max(sum(j.values()) for j in d["jours"]), max(d["avant"])) or 1
    col = (W - 20) / 7
    s = f'<svg class="chart" viewBox="0 0 {W} {H}" role="img" aria-label="Livrables par jour, cette semaine et la semaine passée">'
    for g in (0.25, 0.5, 0.75, 1):
        y = H - B - (H - B - T) * g
        s += f'<line x1="0" x2="{W}" y1="{y:.1f}" y2="{y:.1f}" stroke="var(--line)"/>'
    for i in range(7):
        x = 10 + i * col
        av = d["avant"][i]
        if av:
            h = (H - B - T) * av / mx
            s += f'<rect x="{x + col*0.56:.1f}" y="{H-B-h:.1f}" width="{col*0.2:.1f}" height="{h:.1f}" rx="3" fill="var(--c4)" opacity=".75"/>'
        if i < len(d["jours"]):
            y = H - B
            tot = sum(d["jours"][i].values())
            for k in cles:
                v = d["jours"][i].get(k, 0)
                if not v: continue
                h = (H - B - T) * v / mx
                y -= h
                s += f'<rect x="{x + col*0.18:.1f}" y="{y:.1f}" width="{col*0.36:.1f}" height="{h:.1f}" fill="var(--{EXPERTS[k]["c"]})"/>'
            s += f'<text x="{x + col*0.36:.1f}" y="{y-6:.1f}" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink-2)">{tot}</text>'
        s += f'<text x="{x + col*0.45:.1f}" y="{H-6}" text-anchor="middle" font-size="12" fill="var(--ink-3)" {"font-weight=\"700\"" if i == 3 else ""}>{JOURS[i]}</text>'
    s += "</svg>"
    tot = sum(sum(j.values()) for j in d["jours"]); totav = sum(d["avant"][:4])
    leg = "".join(f'<span><i style="background:var(--{EXPERTS[k]["c"]})"></i>{EXPERTS[k]["prenom"]}</span>' for k in cles)
    leg += f'<span><i style="background:var(--c4)"></i>Semaine passée</span>'
    return f"""<div class="card"><div class="ch"><h2>{ic("chart-column")} Activité de la semaine</h2><span class="pill ok">{tot} livrables, contre {totav} à date la semaine passée</span></div>{s}<div class="legend">{leg}</div></div>"""

def donut(d):
    cols = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--c5)", "var(--c6)"]
    tot = sum(v for _, v in d["formats"]); C = 2 * 3.14159 * 52; off = 0; arcs = ""; lis = ""
    for i, (n, v) in enumerate(d["formats"]):
        L = C * v / tot
        arcs += f'<circle r="52" cx="70" cy="70" fill="none" stroke="{cols[i]}" stroke-width="20" stroke-dasharray="{L-2:.1f} {C-L+2:.1f}" stroke-dashoffset="{-off:.1f}" transform="rotate(-90 70 70)"/>'
        off += L
        lis += f'<li><i style="background:{cols[i]}"></i><b>{n}</b><span class="mute3">{v}, {round(100*v/tot)} %</span></li>'
    return f"""<div class="card"><div class="ch"><h2>{ic("shapes")} Formats livrés</h2></div>
<div class="donut"><svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">{arcs}<text x="70" y="68" text-anchor="middle" font-family="Space Grotesk" font-size="26" font-weight="600" fill="var(--brand-ink)">{tot}</text><text x="70" y="88" text-anchor="middle" font-size="12" fill="var(--ink-3)">livrables</text></svg><ul>{lis}</ul></div></div>"""

def projets(d):
    mx = max(v for _, v, _ in d["projets"])
    p = "".join(f'<div class="proj"><div class="sm mute ell">{n}</div><div class="v">{v}</div><div class="bar2"><i style="width:{100*v/mx:.0f}%"></i></div><div class="xs mute3">dernier livrable le {dt}</div></div>' for n, v, dt in d["projets"])
    return f"""<div class="card" style="margin-top:14px"><div class="ch"><h2>{ic("folder-kanban")} Projets les plus actifs</h2><span class="xs mute3">Touchez un projet pour filtrer</span></div><div class="projs">{p}</div></div>"""

def livrables(d, attente):
    rows = ""
    for icn, t, k, typ, dt, fm, (pc, pl) in d["livrables"]:
        e = EXPERTS[k]
        f = "".join(f"<span>{x}</span>" for x in fm)
        rows += f'<a class="dl" href="{k}.html"><span class="ic">{ic(icn,"s")}</span><span class="grow"><b class="ell">{t} {ic("arrow-up-right","s")}</b><span class="xs mute3">{e["prenom"]}, {typ}, {dt}</span><span class="fmt">{f}</span></span><span class="pill {pc}">{pl}</span></a>'
    att = ""
    for k, t, th, depuis in attente:
        e = EXPERTS[k]
        thumb = '<span class="th poster" style="padding:0"></span>' if th == "poster" else f'<span class="th doc">{ic("file-text")}</span>'
        att += f'<div class="val">{thumb}<span class="grow"><b class="ell">{t}</b><span class="xs mute3">{e["prenom"]}, {depuis}</span></span><a class="btn p" href="{k}.html">{ic("check","s")} Valider</a><a class="btn g" href="{k}.html">Voir</a></div>'
    if not att:
        att = f'<p class="sm mute" style="padding:18px 0;text-align:center">{ic("circle-check","s")} Rien n\'attend votre retour.</p>'
    return f"""<div class="g2e">
<div class="card"><div class="ch"><h2>{ic("archive")} Livrables</h2><span class="xs mute3">{len(d['livrables'])} les plus récents</span></div>{rows}<a class="link" href="#">{ic("chevron-down","s")} Afficher plus</a></div>
<div class="card"><div class="ch"><h2>{ic("hourglass")} En attente de votre retour</h2></div>{att}
<div class="sm mute3" style="margin-top:16px;display:flex;gap:8px;align-items:flex-start">{ic("shield-check","s")} Les fichiers restent dans le Drive d'Unifood. Yelema n'y a pas accès.</div>
<details class="steps" style="margin-top:12px"><summary>{ic("info","s")} Comment on calcule le temps gagné</summary><ol><li>Chaque livrable vaut le temps qu'un professionnel aurait mis à le faire seul : présentation 4 h, vidéo 3 h, rapport 3 h, visuel 2 h, tableur 2 h, email 1 h.</li><li>On additionne et on compare à une journée de 8 h.</li></ol></details>
</div></div>"""

def live_card(grand=False):
    h = 330 if grand else 190
    return f"""<a class="live" href="ecran.html">
  <div class="scr" style="height:{h}px"><div class="tb"><i style="background:#E4765A"></i><i style="background:#C5C4FF"></i><i style="background:#8D68FA"></i><span>Éditeur de visuels, sossa-promo-rentree-instagram</span></div>
    <div class="canvas"><div class="poster" style="width:{'46%' if grand else '52%'};flex:none"><b>SOSSA</b><div class="p1">Promo<br>rentrée</div><div class="p2">-20 %</div></div><div class="tools"><i></i><i style="width:70%"></i><i class="k1"></i><i class="k2"></i><i></i><i style="width:50%"></i></div></div>{CURSOR}</div>
  <div class="lb"><span class="row sm" style="color:#D9D4F5"><span class="dot"></span> En direct, étape 4 sur 5</span>
    <div class="who"><img src="../img/fatima.jpg" alt=""><div class="grow"><b style="font-size:16px">Fatima adapte le visuel Sossa pour Instagram</b><div class="sm" style="color:#D9D4F5">Demandé par Aïcha à 10:15, fin prévue vers 11:30</div></div>{ic("chevron-right")}</div>
    <div class="prog"><i style="width:72%"></i></div></div>
</a>"""

ATTENTE_TEAM = [("fatima", "Sossa, post Facebook de la promo rentrée", "poster", "depuis 10:31"), ("djeneba", "Note au comité de direction", "doc", "depuis 08:50")]

def equipe():
    cards = ""
    stats = {"djeneba": ("5", "10 h"), "fatima": ("24", "48 h"), "koffi": ("17", "34 h")}
    for k in ("djeneba", "fatima", "koffi"):
        e = EXPERTS[k]; a, b, lib = e["binome"]; lv, hh = stats[k]
        dot = '<span class="dot"></span>' if e["statut"] else ""
        cards += f"""<a class="worker" href="{k}.html"><div class="ph"><img src="../img/{e['photo']}" alt=""><div class="st"><span>{dot} {e['statut']}</span></div><div class="nm"><h3>{e['prenom']}</h3><div class="rl">{e['role']}</div></div></div>
<div class="stats"><div><b>{lv}</b><span>livrables cette semaine</span></div><div><b>{hh}</b><span>gagnées</span></div></div>
<div class="pair"><span class="av" style="background:{b}">{a}</span>{lib}</div></a>"""
    cards += f"""<a class="add" href="recruter.html"><span class="faces"><img src="../img/kouassi.jpg" alt=""><img src="../img/adjoua.jpg" alt=""><img src="../img/mamadou.jpg" alt=""></span><b>Recruter un expert</b><span class="sm">Ventes, RH, finance, juridique, données</span><span class="btn g">{ic("plus","s")} Voir les experts</span></a>"""
    return f"""<section style="margin-top:28px"><div class="ch"><h2 style="font-size:20px;font-weight:650">Mon équipe</h2><span class="sm mute3">3 experts, 500 000 F CFA par mois</span></div><div class="team">{cards}</div></section>"""

def panneau(k, fil, sugg, ph):
    e = EXPERTS[k]
    dot = '<span class="dot"></span>' if e["live"] else '<span class="dot"></span>'
    s = "".join(f"<span>{x}</span>" for x in sugg)
    return f"""<aside class="aside">
  <div class="ah"><span class="ava"><img src="../img/{e['photo']}" alt="">{dot}</span><div class="grow"><b>{e['prenom']}</b><div class="xs mute3">{e['role']}</div></div>
    <a class="ib" href="#" aria-label="Appeler {e['prenom']}">{ic("phone","s")}</a><a class="ib" href="ecran.html" aria-label="Voir son écran">{ic("monitor-play","s")}</a></div>
  <div class="thread">{fil}</div>
  <div class="comp"><div class="sugg">{s}</div><div class="inp"><button class="ib" aria-label="Joindre un fichier">{ic("paperclip","s")}</button><span class="ph">{ph}</span><button class="mic" aria-label="Message vocal">{ic("mic","s")}</button></div></div>
</aside>"""

def m(qui, html, t):
    return f'<div class="msg {qui}"><div class="bub">{html}</div><time>{t}</time></div>'

FIL_DJENEBA = (
    '<span class="day">Aujourd\'hui</span>'
    + m("lui", "Bonjour Aïcha. Deux documents attendent votre accord, et Koffi a livré la v2 du packaging. Les ventes Sossa de jeudi sont basses : je regarde avec Fatima&nbsp;?", "08:52")
    + m("moi", "Oui, et ajoute les ventes Sossa à mon tableau de bord, en rouge si on est sous l'objectif.", "09:10")
    + m("lui", "C'est fait, depuis le fichier Ventes 2026 du Drive. Je vous préviens sur WhatsApp si l'écart dépasse 10 %.", "09:11")
)
FIL_FATIMA = (
    '<span class="day">Aujourd\'hui</span>'
    + m("lui", "Bonjour Aïcha. Le post Facebook de la promo Sossa est prêt."
        + f'<details class="steps"><summary>{ic("list-checks","s")} 4 étapes faites, 16 min <span class="grow"></span>{ic("chevron-down","s")}</summary><ol><li>{ic("check","s")} Lu votre brief WhatsApp</li><li>{ic("check","s")} Repris les prix du fichier Ventes</li><li>{ic("check","s")} Vérifié la charte Sossa</li><li>{ic("check","s")} Créé le visuel et le texte</li></ol></details>'
        + f'<div class="deliv"><div class="poster"><b>SOSSA</b><div class="p1">Promo rentrée</div><div class="p2">-20 %</div></div><div class="m"><div class="grow"><b class="sm" style="display:block">Post Facebook, promo rentrée</b><span class="xs mute3">Drive Unifood, Marketing</span></div><span class="pill ac">À valider</span></div><div class="a"><a class="btn p" href="#">{ic("check","s")} Valider et publier</a><a class="btn g" href="#">Modifier</a></div></div>', "10:31")
    + m("moi", "Mets le prix en plus gros et envoie-le à Yao pour la version print.", "10:38")
    + m("lui", "C'est fait, Yao l'a reçu sur WhatsApp à 10:42.", "10:42")
    + '<div class="msg lui"><span class="typing"><i></i><i></i><i></i></span><time>Fatima prépare la version Instagram</time></div>'
)
FIL_KOFFI = (
    '<span class="day">Aujourd\'hui</span>'
    + m("lui", "Bonjour Aïcha. La v2 de la maquette du packaging édition limitée est prête, avec les deux couleurs demandées par Yao.", "09:40")
    + m("moi", "Super. Garde la version rouge, et prépare une déclinaison pour l'affiche du point de vente.", "09:55")
    + m("lui", "D'accord, je vous l'envoie avant 16 h. Yao la relira avant l'impression.", "09:56")
)

def page_dash(cle, actif, brand):
    d = DASH[cle]
    cles = [k for k in ("fatima", "koffi", "djeneba") if any(k in j for j in d["jours"])]
    if cle == "equipe":
        haut = f"""<div class="hello"><div class="grow"><p class="date">Jeudi 1er octobre</p><h1>Bonjour Aïcha</h1></div><a class="btn g" href="djeneba.html">{ic("sliders-horizontal","s")} Modifier mon tableau de bord</a></div>
<a class="brief" href="djeneba.html"><img src="../img/djeneba.jpg" alt=""><p><b>Djénéba :</b> Fatima a fini le post de la promo Sossa et la note au comité est prête <span class="hl">2 à valider</span>. Koffi a livré la v2 du packaging.</p></a>"""
        milieu = f"""<div class="g2e">{live_card()}<div class="card"><div class="ch"><h2>{ic("circle-alert")} À valider</h2><span class="pill ac">2</span></div>{"".join(f'<div class="val"><span class="th {"poster" if th=="poster" else "doc"}" style="padding:0">{"" if th=="poster" else ic("file-text")}</span><span class="grow"><b class="ell">{t}</b><span class="xs mute3">{EXPERTS[k]["prenom"]}, {dep}</span></span><a class="btn p" href="{k}.html">{ic("check","s")} Valider</a></div>' for k,t,th,dep in ATTENTE_TEAM)}
<a class="link" href="#" style="margin-top:8px">{ic("trending-down","s")} Ventes Sossa : 6 % sous l'objectif cette semaine</a></div></div>"""
        att = ATTENTE_TEAM
        aside = panneau("djeneba", FIL_DJENEBA, ["Ajouter un indicateur", "Mon point du jour", "Résumé pour le DG"], "Demander à Djénéba")
        bas = equipe()
    else:
        e = EXPERTS[cle]; a, b, lib = e["binome"]
        dot = '<span class="dot"></span>'
        haut = f"""<section class="xhero"><img class="pp" src="../img/{e['photo']}" alt=""><div class="grow"><h1>{e['prenom']}</h1><div class="mute">{('Expert ' + e['role'].lower()) if cle != 'djeneba' else 'Chief of Staff, tient votre tableau de bord'}</div>
<div class="row" style="margin-top:8px;flex-wrap:wrap"><span class="pill ok">{dot} {e['statut']}, à jour à 11:40</span><span class="pill br"><span class="av" style="background:{b};width:18px;height:18px;font-size:8px">{a}</span> {lib}</span></div></div>
<div class="acts"><a class="btn g" href="#">{ic("phone","s")} Appeler</a><a class="btn g" href="#">{ic("mail","s")} Sa boîte mail</a><a class="btn g" href="ecran.html">{ic("monitor-play","s")} Son écran</a>{f'<a class="btn g" href="#">{ic("pencil","s")} Renommer</a>' if cle=="djeneba" else ""}</div></section>"""
        milieu = live_card() if cle == "fatima" else ""
        milieu = f'<div style="margin-top:14px">{milieu}</div>' if milieu else ""
        att = {"fatima": [ATTENTE_TEAM[0]], "djeneba": [ATTENTE_TEAM[1]], "koffi": [("koffi", "Packaging édition limitée, maquette v2", "poster", "chez Yao depuis 09:40")]}[cle]
        fil = {"fatima": FIL_FATIMA, "koffi": FIL_KOFFI, "djeneba": FIL_DJENEBA}[cle]
        sugg = {"fatima": ["Valider le post", "Nouvelle campagne", "Résumé de la semaine"], "koffi": ["Nouvelle affiche", "Déclinaisons", "Résumé de la semaine"], "djeneba": ["Ajouter un indicateur", "Mon point du jour", "Résumé pour le DG"]}[cle]
        aside = panneau(cle, fil, sugg, f"Écrire à {e['prenom']}")
        bas = ""
    corps = f"""{haut}{impact(d)}{filtres(d)}{milieu}{kpis(d)}<div class="g2">{chart(d, cles)}{donut(d)}</div>{projets(d)}{livrables(d, att)}{bas}"""
    return head("Tableau de bord" if cle == "equipe" else EXPERTS[cle]["prenom"], brand) + barre(actif, brand) + f'<div class="shell"><main class="main">{corps}</main>{aside}</div></body></html>'

def page_ecran(brand):
    etapes = [("check", "Lire le brief d'Aïcha", "10:15, sur WhatsApp", "ok"), ("check", "Reprendre les prix du fichier Ventes", "10:21, Drive Unifood", "ok"),
              ("check", "Créer le post Facebook", "10:31, envoyé à Aïcha", "ok"), ("loader-circle", "Adapter pour Instagram", "En cours", "now"), ("send", "Publier après l'accord d'Aïcha", "À venir", "")]
    li = ""
    for icn, t, s, st in etapes:
        sty = {"ok": "background:var(--ok-pale);color:var(--ok)", "now": "background:var(--brand);color:var(--on-brand)", "": ""}[st]
        li += f'<div class="dl"><span class="ic" style="{sty}">{ic(icn,"s")}</span><span class="grow"><b>{t}</b><span class="xs mute3">{s}</span></span></div>'
    corps = f"""<div class="hello"><div class="grow"><p class="date">Fatima, expert marketing et contenu</p><h1>En direct</h1></div><a class="btn g" href="#">{ic("pause","s")} Mettre en pause</a><a class="btn p" href="fatima.html">{ic("layout-dashboard","s")} Son tableau de bord</a></div>
<div style="margin-top:16px">{live_card(True)}</div>
<div class="g2e"><div class="card"><div class="ch"><h2>{ic("list-checks")} Ses étapes</h2><span class="xs mute3">Commencé à 10:15</span></div>{li}</div>
<div class="card"><div class="ch"><h2>{ic("plug")} Outils utilisés</h2></div><div class="chips"><span class="chip">Drive Unifood</span><span class="chip">WhatsApp</span><span class="chip">Éditeur de visuels</span><span class="chip">Meta Business</span></div>
<p class="sm mute" style="margin-top:14px">Fatima ne publie rien sans votre accord. Vous pouvez reprendre la main à tout moment.</p></div></div>"""
    return head("Fatima en direct", brand) + barre("fatima", brand) + f'<div class="shell"><main class="main">{corps}</main>{panneau("fatima", FIL_FATIMA, ["Valider le post", "Mettre en pause"], "Écrire à Fatima")}</div></body></html>'

def page_recruter(brand):
    cat = [("kouassi", "Kouassi", "Ventes", "Relances clients, devis, suivi des prospects sur WhatsApp et par email"),
           ("adjoua", "Adjoua", "Recrutement", "Tri des CV, convocations, comptes rendus d'entretien"),
           ("fatou", "Fatou", "RH et paie", "Contrats, congés, bulletins, pointage des équipes terrain"),
           ("mamadou", "Mamadou", "Finance", "Trésorerie, rapprochements, relances de factures"),
           ("nadia", "Nadia", "Données", "Tableaux de suivi, rapports hebdomadaires"),
           ("ibrahim", "Ibrahim", "Juridique", "Contrats, conformité, veille réglementaire")]
    cards = "".join(f"""<div class="worker"><div class="ph"><img src="../img/{p}.jpg" alt=""><div class="nm"><h3>{n}</h3><div class="rl">{r}</div></div></div><div style="padding:12px 14px" class="sm mute">{t}</div><div class="pair" style="justify-content:space-between"><span><b class="num" style="color:var(--brand-ink)">200 000</b> F CFA par mois</span><a class="btn p" href="accueil.html" style="min-height:38px">Recruter</a></div></div>""" for p, n, r, t in cat)
    corps = f"""<div class="hello"><div class="grow"><p class="date">Djénéba, Fatima et Koffi sont déjà avec vous</p><h1>Agrandir mon équipe</h1></div></div>
<div class="brief"><span class="ib">{ic("sparkles","s")}</span><p class="grow mute">Décrivez le travail à confier, Djénéba vous propose le bon expert</p><span class="mic">{ic("mic","s")}</span></div>
<div class="filters"><div class="chips"><span class="chip on">Tous</span><span class="chip">Ventes</span><span class="chip">RH</span><span class="chip">Finance</span><span class="chip">Juridique</span><span class="chip">Données</span></div></div>
<div class="team" style="grid-template-columns:repeat(3,1fr)">{cards}</div>
<p class="sm mute3" style="margin-top:16px">Prêt en quelques minutes. Rien n'est facturé si la mise en place échoue.</p>"""
    return head("Recruter", brand) + barre("recruter", brand) + f'<div class="shell"><main class="main">{corps}</main>{panneau("djeneba", FIL_DJENEBA, ["Qui pour les ventes ?", "Comparer deux experts"], "Demander à Djénéba")}</div></body></html>'

def page_entreprise(brand):
    ok = f'<td align="center" style="color:var(--ok)">{ic("check","s")}</td>'; no = '<td align="center" class="xs mute3">non</td>'
    rows = [("Voir son tableau de bord", "ooo"), ("Parler aux experts", "ooo"), ("Recruter un expert", "oon"), ("Inviter des membres", "onn"), ("Voir la facturation", "onn")]
    tr = "".join(f'<tr style="border-top:1px solid var(--line)"><td style="padding:12px 0">{l}</td>{"".join(ok if c=="o" else no for c in r)}</tr>' for l, r in rows)
    mem = [("AD", "#7A4E2D", "Aïcha Diabaté", "Directrice marketing, Responsable"), ("YK", "#0F7B5F", "Yao Kra", "Graphiste, Équipe, avec Koffi"),
           ("SB", "#2E4EC4", "Serge Bamba", "Direction administrative, Direction"), ("NT", "#8A3B12", "Nadège Touré", "Chargée de communication, Équipe, avec Fatima")]
    ml = "".join(f'<div class="dl"><span class="av" style="background:{c};width:40px;height:40px;font-size:13px">{i}</span><span class="grow"><b>{n}</b><span class="xs mute3">{r}</span></span></div>' for i, c, n, r in mem)
    corps = f"""<div class="hello"><div class="grow"><p class="date">Visible par la direction administrative</p><h1>Espace entreprise</h1></div></div>
<section class="impact" style="grid-template-columns:1.2fr 1fr 1fr"><div class="imp"><span class="ic">{ic("receipt")}</span><div><div class="v">500 000 F CFA</div><div class="l">prochaine facture, le 1er novembre</div></div></div>
<div class="imp"><span class="ic">{ic("sparkles")}</span><div><div class="v">3 experts</div><div class="l">300 000 pour les deux premiers, 200 000 pour Koffi</div></div></div>
<div class="imp" style="justify-content:flex-end"><a class="btn w" href="#">Payer par mobile money</a><a class="btn" style="background:rgba(255,255,255,.18);color:#fff" href="#">Factures</a></div></section>
<div class="g2e"><div class="card"><div class="ch"><h2>{ic("shield")} Qui peut faire quoi</h2><a class="link" href="#">Modifier</a></div>
<table style="width:100%;border-collapse:collapse;font-size:14px"><tr class="xs mute3"><th></th><th>Direction</th><th>Responsable</th><th>Équipe</th></tr>{tr}</table></div>
<div class="card"><div class="ch"><h2>{ic("users")} Membres</h2><span class="xs mute3">14, dont 2 invitations</span></div>{ml}<a class="btn g" href="#" style="margin-top:12px">{ic("user-plus","s")} Inviter quelqu'un</a></div></div>"""
    return head("Espace entreprise", brand) + barre("entreprise", brand) + f'<div class="shell" style="grid-template-columns:1fr"><main class="main">{corps}</main></div></body></html>'

def page_choix():
    return """<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Front client, Yelema</title><link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@400;600;700&family=Space+Grotesk:wght@600&display=swap" rel="stylesheet"><link rel="stylesheet" href="app.css"></head>
<body data-brand="yelema"><div class="choose"><img src="img/yelema_logo_final_long.svg" alt="Yelema" style="height:34px">
<h1 class="num" style="font-size:36px;margin-top:22px">Front client, deux habillages</h1>
<p class="mute" style="margin-top:6px">Démo avec Unifood comme client. Personnes, projets et chiffres inventés.</p>
<div class="opts">
<a class="o" href="yelema/accueil.html"><img src="apercu-yelema.png" alt="Aperçu, couleurs Yelema"><div><b>A. Couleurs Yelema</b><p class="sm mute">Logo du client, charte Yelema</p></div></a>
<a class="o" href="client/accueil.html"><img src="apercu-client.png" alt="Aperçu, couleurs Unifood"><div><b>B. Couleurs du client</b><p class="sm mute">Rouge et or Unifood</p></div></a>
</div></div></body></html>"""

# ---------------------------------------------------------------- écriture
if __name__ == "__main__":
    os.makedirs(os.path.join(OUT, "img"), exist_ok=True)
    for f in glob.glob(os.path.join(ICI, "..", "site", "img", "*")):
        shutil.copy(f, os.path.join(OUT, "img"))
    shutil.copy(os.path.join(IMG_SRC, "unifood.png"), os.path.join(OUT, "img"))
    shutil.copy(os.path.join(ICI, "app.css"), OUT)
    for brand in ("yelema", "client"):
        d = os.path.join(OUT, brand); os.makedirs(d, exist_ok=True)
        pages = {"accueil": page_dash("equipe", "accueil", brand), "fatima": page_dash("fatima", "fatima", brand),
                 "koffi": page_dash("koffi", "koffi", brand), "djeneba": page_dash("djeneba", "djeneba", brand),
                 "ecran": page_ecran(brand), "recruter": page_recruter(brand), "entreprise": page_entreprise(brand)}
        for n, html in pages.items():
            open(os.path.join(d, n + ".html"), "w", encoding="utf-8").write(html)
        print("ok", brand, len(pages), "pages")
    open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(page_choix())
    print("ok index")
