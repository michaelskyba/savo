/*
import mainMenu from "../menus/mainMenu"

document.onkeydown = e => mainMenu.handleInput(e.code)
window.requestAnimationFrame(mainMenu.draw)
*/

// (Faster start for testing)

import lerwick from "../overworld/lerwick"
import steps from "./steps"
import player from "./player"

lerwick.init()

player.x = 0
player.y = 0

window.requestAnimationFrame(steps.lerwick)
