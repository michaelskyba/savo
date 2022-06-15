/*
Name: Michael Skyba, Malfacile Gajnita Savo
*/

// Official start
import mainMenu from "../menus/mainMenu"
import steps from "./steps"

document.getElementById("load").onclick = () => {
	mainMenu.init()
	window.requestAnimationFrame(steps.mainMenu)

	// Hide load button
	document.getElementById("load").style.display = "none"
}
