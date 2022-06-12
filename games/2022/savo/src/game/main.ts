// Official start
import mainMenu from "../menus/mainMenu"

document.getElementById("load").onclick = () => {
	mainMenu.init()
	document.getElementById("load").style.display = "none"
}

// Lerwick start
/*
import lerwick from "../overworld/lerwick"
import steps from "./steps"
import player from "./player"

lerwick.init()

player.x = 0
player.y = 0

window.requestAnimationFrame(steps.lerwick)
*/

// Nero's room start
/*
import neroHouse from "../fixed/neroHouse"
import steps from "./steps"
import player from "./player"

neroHouse.init()
neroHouse.neroRoomInit()
neroHouse.room = 5

player.x = 637.5
player.y = 50

window.requestAnimationFrame(steps.neroHouse)
*/
