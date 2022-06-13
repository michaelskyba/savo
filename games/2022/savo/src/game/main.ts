// Official start
/*
import mainMenu from "../menus/mainMenu"
import steps from "./steps"

document.getElementById("load").onclick = () => {
	mainMenu.init()
	window.requestAnimationFrame(steps.mainMenu)

	// Hide load button
	document.getElementById("load").style.display = "none"
}
*/

// Quick main menu
import mainMenu from "../menus/mainMenu"
import steps from "./steps"
mainMenu.init()
window.requestAnimationFrame(steps.mainMenu)
document.getElementById("load").style.display = "none"

// Lerwick
/*
import lerwick from "../overworld/lerwick"
import steps from "./steps"
import player from "./player"

lerwick.init()

player.x = 0
player.y = 0

window.requestAnimationFrame(steps.lerwick)
*/

// Nero's room
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
document.getElementById("load").style.display = "none"
*/
