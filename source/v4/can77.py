# v4.26 : canaux d'un expert = même composant que l'admin (Telegram, Web, Slack, Teams, WhatsApp, Email)
import re, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
EM = {"djeneba": "djeneba", "fatima": "fatima", "koffi": "koffi"}
for skin in ("yelema", "client"):
    adm = open(f"site/{skin}/admin-canaux.html").read()
    i = adm.find('<div class="chcs chcs-act"'); j = adm.find('<p ', i)
    blk = adm[i:j].strip()
    assert blk.endswith("</div></div>") or blk.endswith("</div>"), blk[-40:]
    blk = blk.replace(' style="margin-top:16px"', "")
    for k in EM:
        p = f"site/{skin}/{k}.html"
        h = open(p).read()
        a = h.find('<div class="cn2g">')
        if a < 0:
            continue
        nm = re.search(r"Où parler à ([^<]+)</h2>", h).group(1)
        mail = re.search(r"([a-z]+@[a-z.]+yelema\.ai)", h)
        mail = mail.group(1) if mail else f"{k}@yelema.ai"
        # fin du bloc cn2g : on compte les div
        d, q = 0, a
        while True:
            o = h.find("<div", q); c = h.find("</div>", q)
            if o != -1 and o < c:
                d += 1; q = o + 4
            else:
                d -= 1; q = c + 6
                if d == 0:
                    break
        b = blk
        b = b.replace("<small>Groupe de l'entreprise, un sujet par expert</small>", f"<small>Son sujet dans le groupe de l’entreprise</small>")
        b = b.replace('<small>Cet espace, sur ordinateur et téléphone</small><a class="btn k sm" href="accueil.html">', f'<small>Ici, sur ordinateur et téléphone</small><a class="btn k sm" href="#" data-go="discussion">')
        b = re.sub(r"<small>Adresse dédiée par expert</small>", f"<small>{mail}</small>", b)
        b = re.sub(r'(<b>Email</b><small>[^<]*</small><a class="btn k sm" href=")[^"]*(")', r'\1#" data-go="mail\2', b)
        h = h[:a] + b.replace('class="chcs chcs-act"', 'class="chcs chcs-act chcs-x"', 1) + h[q:]
        open(p, "w").write(h)
print("canaux ok")
