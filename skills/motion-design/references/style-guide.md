# ADN des 7 vidéos de référence

Mesuré sur les 7 vidéos fournies (robimotion, zensu.visuals ×2, troiscoups ×2, xzecreative, mcvisuals) : des pubs de 16 à 39 s, en 16:9 (1024×576) et en 9:16 (576×1024), qui présentent un produit numérique sans jamais le filmer. Tout est interface, texte et lumière.

## La structure (identique partout)

| Temps | Rôle | Exemple vu |
|---|---|---|
| 0-3 s | **Accroche texte** : 1 phrase en 2 morceaux, mot à mot, sur fond sombre et une lueur | « What took developers / Now takes one look. » |
| 3-12 s | **Démo d'interface** : un prompt qui se tape, un curseur qui clique, un résultat qui apparaît | prompt Claude/ChatGPT, appli Spotify, réservation sur iPhone |
| 12-15 s | **Preuve** : un chiffre, un score, un graphique qui pousse | Score 42, barres qui montent, « 30 secondes » |
| 15-18 s | **Logo** : le symbole tourne/grossit, le nom s'écrit à côté | Claude, Spotify 2.0, Opal, Trois Coups |
| fin | Signature (handle, slogan) | « Zéro tournage. » + @troiscoups.fr |

## Les mouvements

- **Mots qui sortent du flou** : chaque mot arrive avec flou 14 px → 0, montée de 0,35 em, opacité 0 → 1, décalage de 80 à 120 ms entre les mots. C'est la signature n°1 (6 vidéos sur 7). → scène `title`.
- **Un mot en couleur d'accent** par phrase (« phrase. », « playing. », « réservent. »), souvent souligné. → `*mot*` dans `text`.
- **Interfaces en verre** : cartes semi-transparentes, bord clair 1 px, ombre portée profonde, halo de la couleur d'accent. → `prompt`, `pills`, `stat`.
- **Caméra lente** : push-in de 92 % à 106 % sur toute la scène, légère rotation 3D à l'entrée (rotateX 14° → 0). Jamais de caméra fixe.
- **Profondeur de champ** : ce qui sort de la scène se floute (16 px) au lieu de juste disparaître.
- **Curseur macOS** avec une onde au clic ; le bouton cliqué s'allume dans la couleur d'accent. → `prompt`, `pills`.
- **Transitions** : flash blanc/lumineux très court ou flou plein écran, pas de glissements. → `flash`.
- **Chiffres qui comptent** en accélération exponentielle, une barre « héros » lumineuse parmi des barres grises. → `stat`.

## Les palettes

| Ambiance | Fond | Accent | Vu chez |
|---|---|---|---|
| Braise (défaut) | `#07070a` | `#ff7a3d` / `#ffb36b` | robimotion, zensu (Claude) |
| Glace | `#05070c` | `#38bdf8` / `#9be7ff` | zensu (ChatGPT) |
| Néon vert | `#060806` | `#1ed760` / `#7dffaf` | xzecreative |
| Violet nuit | `#08070d` | `#a78bfa` / `#e0d4ff` | mcvisuals |
| Bleu clair premium | `#1d2fb8` → `#eef0f6` | `#3b4cff` | troiscoups |

Change `accent`, `accent2`, `bg` dans `spec.json`.

## Typo

- Sans géométrique grasse (Inter 600, interlettrage -0,035 em) pour les phrases.
- Serif élégante (Instrument Serif) pour un « Welcome, … » ou un nom de marque : le contraste sans/serif fait « premium ».
- Mono (Geist Mono) en petites capitales espacées pour les étiquettes de données.

## Le son

Pas de musique forte : une nappe grave ou un beat minimal sous la voix, des « clics » doux sur les interactions, un riser avant le logo, un impact grave (boom + sub) sur le logo. Voix off posée, phrases courtes (voir `voiceover.md`).

## Rythme

Un plan change toutes les 1,5 à 3 s. Le texte reste lisible au moins 0,8 s après son dernier mot. 9:16 : tout dans la zone sûre (marges 8 % gauche/droite, 15 % haut, 20 % bas).
