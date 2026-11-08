# Binaire

Un casse-tête de logique sur une grille carrée : remplis chaque case d'un soleil ou d'une lune en respectant trois règles simples. Chaque grille est générée au hasard et n'a qu'une seule solution, qu'on trouve par déduction, sans jamais deviner.

*English version: [README.en.md](README.en.md)*

## Les règles

1. **Jamais trois pareils à la suite** : pas trois soleils ni trois lunes côte à côte, en ligne comme en colonne.
2. **Autant de chaque** : chaque ligne et chaque colonne contient exactement autant de soleils que de lunes (3 et 3 sur une grille de 6).
3. **Pas de doublon** : deux lignes complètes ne sont jamais identiques, deux colonnes non plus.

## Comment jouer

- **Clic** sur une case : vide → soleil → lune → vide.
- **Clic droit** : pose directement une lune (ou vide la case si c'en est déjà une).
- **Retour** annule le dernier coup, autant de fois que tu veux.
- Les cases de départ, plus foncées et marquées d'un petit trait, sont fixes.
- **Nouvelle partie** tire une nouvelle grille ; la liste **Grille** choisit la taille : 6 × 6, 8 × 8 ou 10 × 10.

## Les aides

- Trois symboles pareils à la suite **s'allument en rouge**.
- Les **barres au bord** de la grille comptent les soleils de chaque ligne (à droite) et de chaque colonne (en bas) : grises tant qu'il en manque, **vertes** quand il y en a juste la moitié, **rouges** quand il y en a trop.
- La grille est finie dès que toutes les cases correspondent à la solution : « Grille résolue ! » s'affiche avec ton temps.

## Comment les grilles sont faites

Une grille complète valide est d'abord tirée au hasard, puis les cases sont retirées une par une tant que la solution reste unique (un solveur le vérifie à chaque retrait). Il reste donc juste assez d'indices pour tout déduire.

## Statistiques

Le chrono tourne pendant la partie. Le panneau Records montre ton **meilleur temps** pour la taille choisie et le nombre de **grilles résolues**.

## Données et synchronisation

Tes records de temps par taille et ton compteur sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Binaire → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
