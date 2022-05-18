import mainMenu from "./mainMenu"

document.onkeydown = mainMenu.handleInput
window.requestAnimationFrame(mainMenu.draw)
