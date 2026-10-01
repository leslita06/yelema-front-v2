# Front client Yelema : fiche pour l'intégration (v3, ordinateur d'abord)

Maquettes HTML statiques. Démo avec Unifood comme client (vrai prospect), personnes, projets et chiffres inventés. Deux habillages : `yelema/` (couleurs Yelema, logo du client) et `client/` (couleurs du client), produits par `source/build3.py` à partir des mêmes données. La v2 mobile reste dans `v2/`. Elles fixent le parcours, la hiérarchie et les composants ; l'équipe tech les intègre dans le front React existant (Clerk pour la connexion, Supabase pour la base, chat des experts via Hermès / Agent 37).

## V3 : écrans ordinateur

| Écran | Fichier | Rôle |
|---|---|---|
| Tableau de bord de l'équipe | `accueil.html` | Brief de Djénéba, bandeau d'impact, en direct, à valider, compteurs, activité, formats, projets, livrables, équipe ; Djénéba ouverte à droite |
| Tableau de bord d'un expert | `fatima.html`, `koffi.html`, `djeneba.html` | Même structure que les tableaux de bord Experts existants (mstudio-frames), discussion avec l'expert à droite |
| En direct | `ecran.html` | Écran de l'expert, étapes, outils utilisés |
| Recruter | `recruter.html` | Experts disponibles, prix, recrutement |
| Espace entreprise | `entreprise.html` | Facture, droits, membres |

Habillage : tokens sous `[data-brand="yelema"]` et `[data-brand="client"]` dans `source/app.css`. Pour un nouveau client, changer `--brand`, `--accent`, `--band` et les couleurs de graphique `--c1` à `--c6`, plus le logo.

## V2 : parcours mobile (vue utilisateur)

| Écran | Fichier | Rôle |
|---|---|---|
| Accueil | `index.html` (sombre : `index-sombre.html`) | Brief de Djénéba, tableau de bord, équipe, recruter, mémoire |
| Chat d'un expert | `fatima.html` | Discussion, étapes repliables, livrable avec « Valider et publier » |
| Djénéba | `djeneba.html` | Modifier le tableau de bord en parlant (vocal), aperçu du widget avant ajout |
| Expert en direct | `ecran.html` | Écran de l'expert, étapes en cours, pause |
| Échanges de l'expert | `boite-mail.html` | Emails, WhatsApp, appels de l'expert |
| Livrables | `livrables.html` | Livrés, en cours, à valider ; les fichiers restent chez le client |
| Recruter | `recruter.html`, `recruter-ok.html` | Catalogue en cartes portrait, fiche, prix, binôme, confirmation |
| Personnaliser | `personnaliser.html` | Prénom, visage, tutoiement de la Chief of Staff |
| Mémoire | `memoire.html` | Chat entreprise sans expert attitré |
| Premier jour | `premier-jour.html` | État vide : Djénéba propose 3 widgets |
| Chargement | `chargement.html` | Squelettes + bandeau connexion lente |
| Espace entreprise | `admin.html` | Facture, droits par rôle, membres (admin seulement) |
| Ordinateur | `web-accueil.html` | Tableau de bord à gauche, Djénéba ouverte à droite |

Navigation : pas de barre latérale ni de menu. Accueil, puis clic sur un expert. Le compte (avatar en haut à droite) mène à l'Espace entreprise si le rôle le permet.

## Tokens (source unique : `source/app.css`)

- Couleurs charte v2 : indigo `#301667`, violet `#8D68FA`, lavande `#C5C4FF`, bleu `#2E4EC4`, lavande pâle `#E0E1FF`, corail `#E4765A`. Corail réservé à ce qui demande une action (à valider, micro, recruter).
- Fond `#F4F4F9`, surface `#FFFFFF`, surface 2 `#ECEBF6`, texte `#17112B` / `#4A4563` / `#625D7C` (AA vérifié sur fond et surface).
- Thème sombre : mêmes rôles sous `[data-theme="dark"]`.
- Polices : Funnel Sans (interface), Space Grotesk (salutation, chiffres, prénoms des experts).
- Rayons : 24 (cartes portrait), 20 (tuiles), 14 (boutons, champs). Cibles tactiles 44 px minimum, texte 13 px minimum, 15 px pour le corps.
- Mouvements : 150 à 250 ms, courbe `cubic-bezier(.22,1,.36,1)`, coupés si `prefers-reduced-motion`.

## Composants

- `brief` : résumé du jour écrit par Djénéba, une phrase, une mise en avant corail.
- `tile` (bento 2 colonnes mobile, 4 ordinateur) : `t-live` (expert en direct, aperçu de son écran), `t-val` (à valider, action en un geste), ventes (barres par jour + ligne d'objectif, jour en cours hachuré), fil du jour.
- `worker` : carte portrait 3:4, statut en direct en haut, prénom, métier, pastille du binôme humain en bas.
- `dock` : barre « Demander à mon équipe » fixe en bas de l'accueil, micro corail.
- Chat : bulles, `steps` (étapes repliables), `deliv` (aperçu du livrable + Valider et publier / Modifier), indicateur « écrit ».
- États à prévoir partout : chargement (squelettes), vide (premier jour), erreur réseau (bandeau, données de la veille gardées), expert hors service (statut gris).

## Données attendues par écran

- Accueil : brief du jour (texte), tâche en cours (expert, libellé, étape n sur N, heure de fin estimée, aperçu), livrables à valider, widgets configurés par l'utilisateur, fil d'activité (expert, action, heure), experts du compte avec statut et binôme.
- Chat : messages, étapes d'une tâche, livrables liés (titre, emplacement chez le client, statut).
- Admin : prochaine facture, rôles (Direction, Responsable, Équipe) et droits, membres.

## Points à trancher

- Renommage : Djénéba seule ou tous les experts.
- Couleurs : charte v2 ou nouveau branding.
- Écran de l'expert en direct : faisable côté Hermès / Agent 37 (flux d'écran ou suite d'étapes) ?
