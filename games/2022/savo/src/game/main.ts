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

import steps from "./steps"
import tiberiusHouse from "../fixed/tiberiusHouse"

document.getElementById("load").onclick = () => {
	tiberiusHouse.init()
	window.requestAnimationFrame(steps.tiberiusHouse)

	// Hide load button
	document.getElementById("load").style.display = "none"
}
