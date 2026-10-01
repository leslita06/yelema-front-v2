#!/usr/bin/env python3
"""Construit le prototype : src/*.html -> site/*.html.

- {{head:Titre}} : en-tête commun (polices, app.css, viewport).
- {{i:nom}} ou {{i:nom:classe}} : icône Lucide en SVG inline (cache local dans icons/).
"""
import os, re, glob, shutil, urllib.request

ICI = os.path.dirname(os.path.abspath(__file__))
SRC, OUT, CACHE = (os.path.join(ICI, d) for d in ("src", "site", "icons"))
os.makedirs(OUT, exist_ok=True); os.makedirs(CACHE, exist_ok=True)

HEAD = """<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex">
<title>{t}, Yelema</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="app.css"></head>"""

def icone(m):
    nom, cls = m.group(1), (m.group(2) or "")
    f = os.path.join(CACHE, nom + ".svg")
    if not os.path.exists(f):
        url = f"https://cdn.jsdelivr.net/npm/lucide-static@0.469.0/icons/{nom}.svg"
        with urllib.request.urlopen(url, timeout=20) as r, open(f, "wb") as o:
            o.write(r.read())
    svg = open(f, encoding="utf-8").read()
    svg = re.sub(r"<!--.*?-->", "", svg, flags=re.S).strip()
    svg = re.sub(r'\sclass="[^"]*"', "", svg)
    svg = re.sub(r'\s(width|height)="24"', "", svg)
    return svg.replace("<svg", f'<svg class="i {cls}" aria-hidden="true"', 1)

for f in sorted(glob.glob(os.path.join(SRC, "*.html"))):
    s = open(f, encoding="utf-8").read()
    s = re.sub(r"\{\{head:([^}]+)\}\}", lambda m: HEAD.format(t=m.group(1)), s)
    s = re.sub(r"\{\{i:([a-z0-9-]+)(?::([a-z0-9 -]+))?\}\}", icone, s)
    assert "{{" not in s, f"balise non remplacée dans {f}"
    open(os.path.join(OUT, os.path.basename(f)), "w", encoding="utf-8").write(s)
    print("ok", os.path.basename(f))
# Variante B : accueil en thème sombre, tirée de la même source
s = open(os.path.join(OUT, "index.html"), encoding="utf-8").read()
s = s.replace("<body>", '<body data-theme="dark">', 1)
s = s.replace('href="index-sombre.html" class="ib" aria-label="Version sombre"', 'href="index.html" class="ib" aria-label="Version claire"', 1)
s = s.replace(icone(re.match(r"(moon)()", "moon")), icone(re.match(r"(sun)()", "sun")), 1)
open(os.path.join(OUT, "index-sombre.html"), "w", encoding="utf-8").write(s)
print("ok index-sombre.html")
shutil.copy(os.path.join(SRC, "app.css"), OUT)
