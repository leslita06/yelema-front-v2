#!/bin/sh
# RÈGLE EN DUR (Leslie, 02/10/26) : le logo Yelema = fichiers EXACTS du site, jamais une autre version.
#   long : img/yelema_long.png (images/logos/yelema-long.png du site)   carré : img/yelema_y.png = carré violet découpé au pixel dans ce logo long (PAS le favicon.svg, plus bleu)
# Toute autre version (blanche, redessinée, ancienne) est remplacée, ses fichiers supprimés, et le build échoue s'il en reste une trace.
cd "$(dirname "$0")"
OLD='yelema_logo_final_long_blanc\.svg\|yelema_logo_final_long\.svg\|yelema_logo_blanc\|yelema-logo-white'
find site -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -exec sed -i "s/$OLD/yelema_long.png/g; s/yelema_y\\.svg/yelema_y.png/g" {} +
cp ref_logo/yelema_y.png site/img/yelema_y.png
find site/img ../publication/img -maxdepth 1 -type f \( -name 'yelema_logo_final_long*.svg' -o -name '*yelema*blanc*' \) -delete 2>/dev/null
if grep -rl "yelema_y\\.svg" site >/dev/null 2>&1; then echo "ÉCHEC logo : Y bleu (favicon) encore référencé"; exit 1; fi
if grep -rl "$OLD" site >/dev/null 2>&1; then echo "ÉCHEC logo : ancienne version encore référencée"; grep -rl "$OLD" site; exit 1; fi
cmp -s site/img/yelema_long.png ref_logo/yelema_long.png && cmp -s site/img/yelema_y.png ref_logo/yelema_y.png || { echo "ÉCHEC logo : fichier différent de la référence du site"; exit 1; }
echo "logo ok"
