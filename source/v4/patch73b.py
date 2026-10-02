P = "build4.py"
s = open(P).read()
def R(a, b):
    global s
    assert a in s, a[:90]
    s = s.replace(a, b, 1)
R('''<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:12px"><span class="pill" style="background:var(--soft-2)"><b>{len(fi.get("competences", []))}</b>&nbsp;compétences</span><span class="pill" style="background:var(--soft-2)"><b>{len(fi.get("livrables", []))}</b>&nbsp;livrables</span><span class="pill" style="background:var(--soft-2)"><b>{len(fi.get("outils", []))}</b>&nbsp;outils</span></div>''', '')
R('''            html = html.replace('href="ecran.html"', 'href="fatima.html#direct"')''', '''            html = _nav_fix(html.replace('href="ecran.html"', 'href="fatima.html#direct"'))''')
open(P, "w").write(s)
print("ok")
s = open(P).read()
if 'os.environ.get("YOUT"' not in s:
    s = s.replace('OUT = os.path.join(ICI, "site")', 'OUT = os.environ.get("YOUT") or os.path.join(ICI, "site")', 1)
    open(P, "w").write(s)
