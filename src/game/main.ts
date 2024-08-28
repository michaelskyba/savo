// Official start
import mainMenu from "../menus/mainMenu"
import steps from "./steps"

document.getElementById("load").onclick = () => {
	mainMenu.init()
	window.requestAnimationFrame(steps.mainMenu)
	document.getElementById("load").style.display = "none"
}

// Testing Augustus fight
/*
import steps from "./steps"
import augustusRoom from "../fixed/augustusRoom"
import password from "../events/password"
import c from "./canvas"

// Based qutebrowser doesn't require input, so I can leave it like this while testing
document.getElementById("help").style.display = "none"

password.timeMachine = true

augustusRoom.init()
window.requestAnimationFrame(steps.augustusRoom)
*/

// Testing dual Nero fight
/*
import steps from "./steps"
import neroHouse from "../fixed/neroHouse"
import password from "../events/password"

password.timeMachine = true

document.getElementById("help").style.display = "none"
neroHouse.init()
neroHouse.room = 3
window.requestAnimationFrame(steps.neroHouse)

document.body.style.backgroundColor = "#111"
*/
