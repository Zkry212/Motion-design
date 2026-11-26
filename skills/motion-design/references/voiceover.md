# Voix off de qualité publicitaire

Une voix off « pub » tient en 4 choses : **un texte écrit pour l'oreille**, **une bonne voix bien dirigée**, **un traitement broadcast**, **un mix où la voix reste devant**. Le moteur fait les deux dernières tout seul (`mix.mjs`), ce guide couvre les deux premières.

## 1. Choisir la source de la voix

| Option | Qualité | Coût | Quand |
|---|---|---|---|
| **ElevenLabs TTS** (`voiceover.mjs`) | Très bonne, quasi indiscernable sur 15-30 s | ~5-22 $/mois | Le défaut : itérations rapides, timings mot à mot automatiques |
| **Ta voix clonée** (ElevenLabs *Professional Voice Clone*) | Excellente, c'est *ta* signature | Plan Creator+ | Marque perso, série de vidéos |
| **Comédien voix off** (Voice123, Fiverr Pro, Malt, agences) | Le top, vraie interprétation | 80-400 € la pub web | Campagne payante, client exigeant |
| **Toi au micro** | Bonne si la pièce est traitée | 0 € (+ micro) | Ton authentique, créateur face caméra |

Les vidéos de référence (troiscoups, zensu, robimotion…) utilisent toutes la même recette : voix grave et posée, phrases très courtes, un silence avant le nom de marque.

## 2. Écrire le script (le plus important)

- **2,3 à 2,6 mots par seconde** en français pour une pub posée. 15 s ≈ 35 mots, 30 s ≈ 70 mots. Le moteur rend la vidéo à la durée de la voix, pas l'inverse.
- **Une idée par phrase, 3 à 7 mots.** « Pas de caméra. Pas de micro. Pas dix prises. » Les phrases courtes laissent le temps aux mots à l'écran d'arriver.
- **Structure pub** : accroche (problème ou promesse, < 2 s) → démonstration (2-3 bénéfices concrets) → preuve (chiffre) → marque + slogan → appel à l'action.
- **Écrire les nombres en lettres** (« trente secondes », pas « 30 s ») et les sigles comme ils se prononcent (« I A », « S a a S »).
- **Les pauses** : `<break time="0.4s" />` (max 3 s) avant le nom de marque et avant le slogan. Les points de suspension « … » donnent une respiration plus naturelle.
- **Lire à voix haute** une fois avant de générer : si tu bafouilles, la voix aussi.

Exemple (15 s, 36 mots) — `examples/demo-launch/voiceover.txt` :

```
Ce qui prenait des jours… <break time="0.3s" /> prend une phrase.
Décrivez votre idée. <break time="0.4s" /> Choisissez le format.
Votre vidéo est prête en trente secondes.
<break time="0.5s" /> Lumen. <break time="0.3s" /> Zéro tournage.
```

## 3. ElevenLabs : la voix et les réglages

1. Crée un compte sur elevenlabs.io, copie ta clé API (Profile → API Keys).
2. Mets-la dans `<projet>/.env` : `ELEVENLABS_API_KEY=sk_...` (jamais dans le chat, jamais commitée : `.env` est dans le `.gitignore`).
3. Choisis une voix dans **Voice Library** : filtre *Language: French*, *Use case: Advertisement* ou *Narration*, écoute avec TON texte. Ajoute-la à « My Voices », puis `node engine/voiceover.mjs <projet> --voices` pour avoir son id.
4. Mets l'id dans `spec.json` → `"voice": { "id": "..." }`.
5. `node engine/voiceover.mjs <projet> --takes 3` : génère 3 prises, écoute, garde la meilleure (renomme-la `assets/voice.mp3` + son `.words.json`).

### Modèles

| Modèle | Pour |
|---|---|
| `eleven_multilingual_v2` | **Défaut pub.** Le plus stable et le plus propre en français, gère `<break>`. |
| `eleven_v3` | Le plus expressif : balises d'émotion `[excited]`, `[whispers]`, `[confident]` dans le texte. Plus variable : fais plus de prises. Pas de `<break>` (utilise la ponctuation et `[pause]`). |
| `eleven_flash_v2_5` | Rapide et moins cher, pour les brouillons de timing. |

### Presets par ton (dans `spec.json` → `voice`)

| Ton | stability | similarity | style | speed |
|---|---|---|---|---|
| **Pub tech premium** (Apple-like, posé, grave) | 0.50 | 0.80 | 0.20 | 0.95 |
| **Lancement énergique** (startup, TikTok) | 0.35 | 0.80 | 0.45 | 1.05 |
| **Luxe / intimiste** (presque chuchoté) | 0.60 | 0.85 | 0.15 | 0.90 |
| **Narration documentaire** | 0.55 | 0.75 | 0.25 | 1.00 |

- `stability` bas = plus d'émotion mais plus d'aléas ; haut = monotone. 0.4-0.55 pour une pub.
- `style` exagère le caractère de la voix : au-delà de 0.5 ça devient théâtral.
- `speed` entre 0.9 et 1.1 seulement, sinon artefacts. Pour accélérer, raccourcis le texte.
- `seed` fixe une prise reproductible une fois qu'elle te plaît.

### Défauts fréquents et corrections

| Problème | Correction |
|---|---|
| Mot mal prononcé (marque, anglicisme) | Écris-le phonétiquement : « Lumen » → « Lu-mène », « SaaS » → « sasse » |
| Intonation montante en fin de phrase | Termine par un point, pas une virgule ; baisse `style` |
| Débit trop régulier, « robot » | Varie la longueur des phrases, ajoute des `…`, baisse `stability` à 0.4 |
| Une phrase ratée dans une bonne prise | Régénère seulement cette phrase et monte-la (les timings restent bons si tu gardes la même durée) |

## 4. S'enregistrer soi-même (ou recevoir le fichier d'un comédien)

- **Micro** : un dynamique type Shure MV7+/SM7B ou Rode PodMic pardonne une pièce non traitée ; un statique (Rode NT1, NT-USB) demande une pièce mate.
- **Pièce** : petite, pleine de tissus (un placard à vêtements marche très bien). Pas de cuisine ni de salle de bain.
- **Position** : 10-15 cm de la bouche, légèrement de côté (évite les plosives), anti-pop.
- **Niveau** : crêtes vers -12 dBFS, jamais de saturation. 48 kHz / 24 bits, WAV.
- **Jeu** : debout, sourire sur les phrases positives, 3 prises de chaque phrase, 1 seconde de silence entre.
- Puis : `node engine/voiceover.mjs <projet> --file prise.wav` → copie dans `assets/`, et si une clé ElevenLabs existe, timings mot à mot via Scribe.
- Bruit de fond : passe d'abord le fichier dans un débruiteur (Adobe Podcast *Enhance Speech*, gratuit, ou ElevenLabs *Voice Isolator*), le traitement du moteur n'enlève pas un frigo.

## 5. Le traitement « broadcast » (automatique)

`mix.mjs` applique la chaîne d'une voix de pub radio/TV, dans cet ordre :

1. **Passe-haut 80 Hz** : enlève les grondements.
2. **De-esser** : adoucit les « s » sifflants.
3. **EQ** : -2,5 dB à 250 Hz (le « carton »), +2 dB à 3,5 kHz (présence, intelligibilité), +2,5 dB au-dessus de 11 kHz (l'air).
4. **Deux compresseurs doux** (3:1 puis 6:1 sur les crêtes) : la voix devient dense, « collée » à l'oreille.
5. **-16 LUFS** pour la voix seule.

Puis le mix :

- **Musique** à `musicGain` dB sous la voix (-12 par défaut ; -10 si la musique est discrète, -15 si elle est chargée) et **ducking** : elle baisse automatiquement quand la voix parle (sidechain), remonte dans les silences.
- **SFX** calés au mot près, 8 à 14 dB sous la voix.
- **Master -14 LUFS, -1 dBTP** : le niveau de TikTok, Reels et YouTube. Rendu aussi en `.mix.wav` 24 bits pour CapCut/Premiere.

## 6. Synchroniser l'image sur la voix

`voiceover.mjs` écrit `assets/voice.words.json` (chaque mot avec son temps). Dans `spec.json` :

```json
"words": "assets/voice.words.json",
"audio": { "voice": "assets/voice.mp3", "voiceAt": 0.4 },
"scenes": [ { "type": "title", "at": 0.5, "dur": 1.6, "text": "Ce qui prenait des jours", "sync": true } ]
```

Avec `"sync": true`, chaque mot à l'écran apparaît 60 ms avant d'être prononcé. Pour caler les autres scènes, lis les temps dans `voice.words.json` (+ `voiceAt`) et règle leurs `at`. Les SFX tombent sur les mots forts : le nom de marque prend l'impact.

## 7. Check-list avant export

- [ ] Écoutée au casque **et** sur le haut-parleur d'un téléphone (là où la pub sera vue).
- [ ] Aucun mot couvert par un SFX ou la musique.
- [ ] Le nom de marque est précédé d'un silence et prononcé correctement.
- [ ] La voix finit au moins 0,8 s avant la fin de la vidéo.
- [ ] Droits : voix ElevenLabs = usage commercial OK sur plan payant ; comédien = cession de droits écrite (durée, supports, territoires).
