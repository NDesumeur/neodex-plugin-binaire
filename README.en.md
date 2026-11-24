# Binaire (Binary)

A logic puzzle on a square grid: fill each cell with a sun or a moon following three simple rules. Each grid is generated at random and has only one solution, found by deduction (large grids sometimes ask you to test a guess).

*Version française : [README.md](README.md)*

## Daily grid and hints that teach (new in 1.2.0)

**Daily grid**: one 8 × 8 grid, the same for everyone each day, with a day streak (and its best). **Hint**: it shows the technique instead of giving the cell — pair (two alike side by side), sandwich (one on each side), counting (the line already has its half) — with the useful cells in green; a second click places the cell. A wrong cell is pointed out first.

## The rules

1. **Never three in a row**: no three suns or three moons side by side, in a row or a column.
2. **As many of each**: every row and every column holds exactly as many suns as moons (3 and 3 on a 6-wide grid).
3. **No duplicates**: two complete rows are never identical, and neither are two columns.

## How to play

- **Click** a cell: empty → sun → moon → empty.
- **Right-click**: places a moon directly (or empties the cell if it already is one).
- **Backspace** undoes the last move, as many times as you like.
- The starting cells, lighter and riveted at the four corners, are fixed.
- Each symbol you place hops with a small flash; behind the grid, the sky slowly turns from day (clouds) to night (stars).
- **Fullscreen** enlarges the grid to the whole screen (Escape to leave). Outside fullscreen, the grid takes all the room the window allows, small or large.
- **New game** draws a new grid; the **Grid** list chooses the size: 6 × 6, 8 × 8 or 10 × 10.

## The aids

- Three identical symbols in a row **light up in red**.
- The **bars along the edge** count the suns in each row (on the right) and each column (at the bottom): grey while some are missing, **green** when there are exactly half, **red** when there are too many.
- The grid is finished as soon as every cell matches the solution: a golden wave sweeps the grid, then "Grid solved!" appears with your time.

## How grids are made

A complete valid grid is first drawn at random, then cells are removed one by one as long as the solution stays unique (a solver checks it after each removal). So just enough clues remain to deduce everything.

## Statistics

The timer runs during the game and pauses when you leave the tab. The Records panel shows your **best time** for the chosen size and the number of **grids solved**.

## Data and sync

Your best times per size and your counter are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Binaire → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
