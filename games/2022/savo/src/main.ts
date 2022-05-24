import mainMenu from "./menus/mainMenu"

document.onkeydown = e => mainMenu.handleInput(e.code)
window.requestAnimationFrame(mainMenu.draw)

/*
// (Faster start for testing)

import perinthus from "./overworld/perinthus"
import claudiaHouse from "./fixed/claudiaHouse"
import player from "./play/player"

claudiaHouse.init()
perinthus.init()

window.requestAnimationFrame(perinthus.draw)
*/
