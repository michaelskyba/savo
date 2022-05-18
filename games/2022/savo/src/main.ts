import {mainMenu, handleKeys} from "./mainMenu"

document.onkeydown = handleKeys
window.requestAnimationFrame(mainMenu.draw)
