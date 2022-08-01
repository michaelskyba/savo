# Malfacile Gajnita Savo
This was made as a final project for an introductory CS high school course

## Building: ``./build``
I made a "build" script to avoid having to type something manually and to avoid
using node.js. It depends on TypeScript (tsc) for the ``src/*.ts`` -->
``out-ts/*.js`` compilation and entr for checking for file updates.

## Constant "magic" numbers
Certain numbers are used in src/ frequently. Instead of writing out many
variables and otherwise-unnecessary imports/exports, it's easier to describe
them here. I'm guessing it's also slightly more performant. If one is used as
part of a calculation, I may pad it with a comment for clarity, though.

### 50
The size (side length of square) of the player and enemies

### 1325
The width of the canvas (screen)

### 725
The height of the canvas (screen)