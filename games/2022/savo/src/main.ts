/*
import mainMenu from "./menus/mainMenu"

document.onkeydown = e => mainMenu.handleInput(e.code)
window.requestAnimationFrame(mainMenu.draw)
*/

// (Faster start for testing)

import perinthus from "./overworld/perinthus"
import player from "./play/player"

perinthus.init()

window.requestAnimationFrame(perinthus.draw)
