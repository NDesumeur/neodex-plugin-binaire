# Binaire (Binary)

A logic puzzle on a square grid: fill each cell with a sun or a moon following three simple rules. Each grid is generated at random and has only one solution, found by deduction, without ever guessing.

*Version française : [README.md](README.md)*

## The rules

1. **Never three in a row**: no three suns or three moons side by side, in a row or a column.
2. **As many of each**: every row and every column holds exactly as many suns as moons (3 and 3 on a 6-wide grid).
3. **No duplicates**: two complete rows are never identical, and neither are two columns.

## How to play

- **Click** a cell: empty → sun → moon → empty.
- **Right-click**: places a moon directly (or empties the cell if it already is one).
- **Backspace** undoes the last move, as many times as you like.
- The starting cells, darker and marked with a small line, are fixed.
- **New game** draws a new grid; the **Grid** list chooses the size: 6 × 6, 8 × 8 or 10 × 10.

## The aids

- Three identical symbols in a row **light up in red**.
- The **bars along the edge** count the suns in each row (on the right) and each column (at the bottom): grey while some are missing, **green** when there are exactly half, **red** when there are too many.
- The grid is finished as soon as every cell matches the solution: "Grid solved!" appears with your time.

## How grids are made

A complete valid grid is first drawn at random, then cells are removed one by one as long as the solution stays unique (a solver checks it after each removal). So just enough clues remain to deduce everything.

## Statistics

The timer runs during the game. The Records panel shows your **best time** for the chosen size and the number of **grids solved**.

## Data and sync

Your best times per size and your counter are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Binaire → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
