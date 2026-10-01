"""Captures v4. Arguments : marque/page[#onglet][!pop][@m]. !ping, !notifs ouvrent un panneau, !pz la personnalisation, !x la fiche de recrutement."""
import sys, os
from playwright.sync_api import sync_playwright
ICI=os.path.dirname(os.path.abspath(__file__)); S=ICI+"/site"; O=ICI+"/captures"; os.makedirs(O,exist_ok=True)
FIX=".ybtn{position:absolute!important}.sb,.xcol{position:static!important;height:auto!important}.top{position:static!important}body{position:relative}.dock{position:absolute!important}.rail{position:static!important}"
with sync_playwright() as p:
    b=p.chromium.launch()
    for a in sys.argv[1:]:
        mob=a.endswith("@m"); a=a.replace("@m","")
        act=a.split("!")[1] if "!" in a else ""; a=a.split("!")[0]
        f,_,tab=a.partition("#")
        w=390 if mob else 1440
        pg=b.new_page(viewport={"width":w,"height":844 if mob else 900},device_scale_factor=2 if mob else 1.5)
        pg.goto(f"file://{S}/{f}.html"+(f"#{tab}" if tab else "")); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(400)
        full = not act
        if act in ("ping","notifs"): pg.click(f'[data-pop="{act}"]')
        elif act=="pz": pg.click('[data-open="pz"] >> nth=0')
        elif act=="x": pg.click('.pc >> nth=0')
        elif act=="yele": pg.click('.ybtn')
        elif act=="cz": pg.click('[data-open="cz"] >> nth=0')
        elif act.startswith("o-"): pg.click(f'[data-open="{act[2:]}"] >> nth=0')
        pg.wait_for_timeout(350)
        d=pg.evaluate("document.documentElement.scrollWidth-innerWidth")
        if full: pg.add_style_tag(content=FIX)
        out=f"{O}/{f.replace('/','_')}{'_'+tab if tab else ''}{'_'+act if act else ''}{'_m' if mob else ''}.png"
        pg.screenshot(path=out,full_page=full); print(os.path.basename(out), "DEBORDEMENT %d"%d if d>0 else "ok")
    b.close()
