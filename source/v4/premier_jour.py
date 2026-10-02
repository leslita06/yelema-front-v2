# accueil-premier-jour.html : copie de l'accueil avec le bloc En ce moment à vide (vocal 44607)
import os
for b in ("yelema", "client"):
    s = os.path.join("site", b, "accueil.html")
    h = open(s, encoding="utf-8").read()
    h = h.replace(f'<body data-brand="{b}"', f'<body data-brand="{b}" data-etat="vide"', 1)
    open(os.path.join("site", b, "accueil-premier-jour.html"), "w", encoding="utf-8").write(h)
print("premier jour ok")
p = os.path.join("site", "plan.html")
h = open(p, encoding="utf-8").read()
a = '<a class="o" href="yelema/chat.html">'
if a in h and "accueil-premier-jour" not in h:
    h = h.replace(a, '<a class="o" href="yelema/accueil-premier-jour.html"><div><b>Accueil, premier jour</b><p class="sm mute">Le bloc En ce moment avant le premier travail des experts</p></div></a>' + a, 1)
    open(p, "w", encoding="utf-8").write(h)
print("plan ok")
