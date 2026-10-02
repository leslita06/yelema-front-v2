#!/bin/sh
# RÈGLE EN DUR (Leslie, 02/10/26) : le logo Yelema = fichiers EXACTS du site, jamais une autre version.
#   long : img/yelema_long.png (images/logos/yelema-long.png du site)   carré : img/yelema_y.svg (favicon.svg du site)
# Toute autre version (blanche, redessinée, ancienne) est remplacée, ses fichiers supprimés, et le build échoue s'il en reste une trace.
cd "$(dirname "$0")"
OLD='yelema_logo_final_long_blanc\.svg\|yelema_logo_final_long\.svg\|yelema_logo_blanc\|yelema-logo-white'
find site -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -exec sed -i "s/$OLD/yelema_long.png/g" {} +
find site/img ../publication/img -maxdepth 1 -type f \( -name 'yelema_logo_final_long*.svg' -o -name '*yelema*blanc*' \) -delete 2>/dev/null
if grep -rl "$OLD" site >/dev/null 2>&1; then echo "ÉCHEC logo : ancienne version encore référencée"; grep -rl "$OLD" site; exit 1; fi
cmp -s site/img/yelema_long.png ref_logo/yelema_long.png && cmp -s site/img/yelema_y.svg ref_logo/yelema_y.svg || { echo "ÉCHEC logo : fichier différent de la référence du site"; exit 1; }
echo "logo ok"
