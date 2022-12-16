// Official start
// /*
import mainMenu from "../menus/mainMenu"
import steps from "./steps"

document.getElementById("load").onclick = () => {
	mainMenu.init()
	window.requestAnimationFrame(steps.mainMenu)

	// Hide load button
	document.getElementById("load").style.display = "none"
}
// */

/*
// Testing Augustus fight

import steps from "./steps"
import augustusRoom from "../fixed/augustusRoom"
import password from "../events/password"

// Based qutebrowser doesn't require input, so I can leave it like this while testing
document.getElementById("help").style.display = "none"

password.timeMachine = true

augustusRoom.init()
window.requestAnimationFrame(steps.augustusRoom)
*/
