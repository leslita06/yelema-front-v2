#!/bin/sh
# reconstruit v4.23 depuis les sauvegardes avant73 + lot73.py, add73.css, add73.js
cd "$(dirname "$0")"
cp build4_avant73.py build4.py && python3 patch73.py >/dev/null && python3 patch73b.py >/dev/null && python3 patch74.py >/dev/null && python3 patch75.py >/dev/null && python3 patch76.py >/dev/null && cp app_avant73.js app.js && cp delos_avant73.css delos.css && sed -i "s/on?'Terminer':'Modifier'/on?'Enregistrer':'Modifier'/" app.js && cat add73.css add74.css add75.css add76.css add77.css >> delos.css && cat add_url.js add73.js add74.js add75.js add76.js add77.js >> app.js && python3 build4.py | tail -1  && python3 premier_jour.py && python3 can77.py && sh logo_guard.sh
