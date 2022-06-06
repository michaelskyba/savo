/*
import mainMenu from "../menus/mainMenu"

document.onkeydown = e => mainMenu.handleInput(e.code)
window.requestAnimationFrame(mainMenu.draw)
*/

// (Faster start for testing)

import akvedukto from "../fixed/akvedukto"
import steps from "./steps"

akvedukto.init()

/*
akvedukto.phase = 5
import player from "./player"
player.x = 637.5
player.y = 670
*/

window.requestAnimationFrame(steps.akvedukto)
