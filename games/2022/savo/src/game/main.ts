/*
import mainMenu from "./menus/mainMenu"

document.onkeydown = e => mainMenu.handleInput(e.code)
window.requestAnimationFrame(mainMenu.draw)
*/

// (Faster start for testing)

import akvedukto from "../fixed/akvedukto"
import steps from "./steps"

akvedukto.init()
window.requestAnimationFrame(steps.akvedukto)
