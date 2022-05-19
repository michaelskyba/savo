import c from "./canvas"
import menuOption from "./menuOption"
import claudiaHouse from "./claudiaHouse"

const mainMenu = {
	selected: 0,
	screen: "Main menu",

	options: [
		new menuOption(0, "Start"),
		new menuOption(1, "Credits")
	],

	handleInput(e: KeyboardEvent) {
		if (e.code == "ArrowUp" || e.code == "KeyK") mainMenu.selected = 0
		if (e.code == "ArrowDown" || e.code == "KeyJ") mainMenu.selected = 1

		// Select option
		if (e.code == "KeyZ") {

			// You pressed start, so enter the claudiaHouse object
			if (mainMenu.selected == 0) {
				claudiaHouse.init()

				// Putting this in claudiaHouse.ts would require an additional import
				mainMenu.screen = "Claudia's house"
			}
		}
	},

	draw() {
		c.fillStyle = "#f9f9f9"
		c.frect(0, 0, 1325, 725)

		c.font = "48px monospace"
		c.fillStyle = "#4a4a4a"
		c.text("Malfacile Gajnita Savo", 50, 50)

		for (let i = 0; i < this.options.length; i++) {
			this.options[i].draw(this.selected == i)
		}

		if (this.screen == "Main menu")
			window.requestAnimationFrame(this.draw)

		// Once the user selects "Start", we need to switch screens
		else window.requestAnimationFrame(claudiaHouse.draw)
	}
}

mainMenu.draw = mainMenu.draw.bind(mainMenu)
export default mainMenu
