# lot 4 (vocal 44633, 02/10 00:18 UTC)
import re
def _inv76(html):
    # invitation : le téléphone revient, avec Telegram et WhatsApp en dessous (vocal 44633)
    if 'id="inv"' in html:
        html = html.replace('<span class="phk">', '<span class="phk"><small class="xs mute3" style="width:100%">Ce numéro est aussi sur</small>', 1)
    return html

LINK_IC = None
def _mb76(html):
    # fiche membre : Autre lien avec une vraie icône, Ajouter un lien qui ajoute une ligne, Changer la photo qui marche
    html = html.replace('<img src="https://www.google.com/s2/favicons?sz=64&domain=" alt="">', f'<span class="rsxi">{ic("link", "s")}</span>')
    html = html.replace('<a class="link sm" href="#" data-toast="Nouveau lien ajouté">', '<a class="link sm rsxadd" href="#">', 1)
    html = html.replace('<a class="btn o" href="#" data-toast="Choisissez une photo">', '<a class="btn o mbph" href="#">', 1)
    return html

def _can76(html):
    # canal Email : une enveloppe, pas le G de Google (mêmes icônes côté utilisateur et admin)
    mail = f'<span class="chmail">{ic("mail", "s")}</span>'
    html = re.sub(r'<img src="[^"]*domain=gmail\.com"[^>]*>(?=(?:(?!<img).){0,500}?(?:<b>Email</b>|title="Email))', mail, html, flags=re.S)
    return html

PROV76 = [("Claude", "Anthropic"), ("Gemini", "Google"), ("GPT", "OpenAI"), ("Mistral", "Mistral AI"), ("Llama", "Meta"), ("DeepSeek", "DeepSeek")]
def _mod76(html):
    # modèles d'IA : un seul tableau fournisseurs, avec les experts ET les membres associés (vocal 44633)
    a = html.find('<h3 class="h3s">Modèle par expert</h3>')
    b = html.find('<h3 class="h3s">Modèle par membre</h3>')
    if a < 0 or b < 0:
        return html
    e = html.find('</table></div>', b)
    if e < 0:
        return html
    e += len('</table></div>')
    seg = html[b:e]
    mem = {}
    for row in re.findall(r'<tr>(.*?)</tr>', seg, flags=re.S):
        im = re.search(r'<img class="av" src="([^"]+)"', row); nm = re.search(r'<b>([^<]+)</b>', row); md = re.search(r'<b class="mdn">([^<]+)</b>', row)
        if not (im and nm and md):
            continue
        prov = next((p for k, p in PROV76 if md.group(1).startswith(k)), None)
        if prov:
            mem.setdefault(prov, []).append((im.group(1), nm.group(1), md.group(1)))
    html = html[:a] + '<p class="xs mute3 kpnote">Un expert ou un membre peut utiliser plusieurs modèles : son modèle par défaut, et ceux qu’il choisit dans la discussion.</p>' + html[e:]
    def addm(m):
        blk = m.group(0)
        pn = re.search(r'<b>([^<]+)</b>', blk)
        lst = mem.get(pn.group(1) if pn else "", [])
        av = "".join(f'<img class="xav" src="{i}" alt="" title="{n}, {md}">' for i, n, md in lst) or '<span class="xs mute3">Aucun</span>'
        blk = blk.replace('<div class="kpx"><small>Experts</small>', '<div class="kpx"><small>Experts associés</small>', 1)
        return blk.replace('<div class="kpa">', f'<div class="kpx kpxm"><small>Membres associés</small><span class="row" style="gap:0">{av}</span></div><div class="kpa">', 1)
    html = re.sub(r'<div class="kpv">.*?<div class="kpa">', addm, html, flags=re.S)
    html = re.sub(r'<span class="xs mute3">Modèles : ([^<]+)</span>', lambda m: '<span class="kmods">' + "".join(f'<i>{x.strip()}</i>' for x in m.group(1).split(",")) + '</span>', html)
    return html

def _an76(html):
    # analytique : chaque export en CSV ou en PDF, plus le rapport complet en PDF
    if 'Télécharger les métriques' not in html:
        return html
    html = html.replace('<span>mois en cours, au format CSV</span>', '<span>mois en cours, en CSV ou en PDF</span><a class="btn o sm anpdf" href="#" data-toast="Rapport complet téléchargé : unifood-analytique-octobre.pdf">' + ic("file-text", "s") + ' Rapport complet en PDF</a>', 1)
    html = re.sub(r'<a class="an-dl" href="#" data-toast="Téléchargement : ([a-z-]+)\.csv">(.*?)</a>',
                  lambda m: f'<div class="an-dl an-dl2">{m.group(2)}<span class="an-fm"><a href="#" data-toast="Téléchargement : {m.group(1)}.csv">{ic("download", "s")} CSV</a><a href="#" data-toast="Téléchargement : {m.group(1)}.pdf">{ic("download", "s")} PDF</a></span></div>', html, flags=re.S)
    return html

def _ic76(html):
    # icônes : barres = Tableau de bord seulement ; Analytique = courbe, partout (utilisateur, expert, admin)
    cc, cl = ic("chart-column", "s"), ic("chart-line", "s")
    html = re.sub(r'(href="admin-analytics\.html"[^>]*>\s*)' + re.escape(cc), lambda m: m.group(1) + cl, html)
    html = re.sub(r'(data-t="analytique"[^>]*>\s*)' + re.escape(cc), lambda m: m.group(1) + cl, html)
    html = re.sub(re.escape(cc) + r'(\s*Analytique)', lambda m: cl + m.group(1), html)
    return html

def _fix76(html):
    html = _ic76(html)
    html = _an76(html)
    html = _mod76(html)
    html = _can76(html)
    html = _mb76(html)
    html = _inv76(html)
    return html
