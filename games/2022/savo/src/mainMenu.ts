import c from "./canvas"
import menuOption from "./menuOption"
import claudiaHouse from "./claudiaHouse"

const mainMenu = {
	selected: 0,
	screen: "Main menu",

	options: [
		new menuOption("Start", 150, 200),
		new menuOption("Credits", 150, 260)
	],

	handleInput(e: KeyboardEvent) {
		if (e.code == "ArrowUp" || e.code == "KeyK") this.selected = 0
		if (e.code == "ArrowDown" || e.code == "KeyJ") this.selected = 1

		// Select option
		if (e.code == "KeyZ") {

			// You pressed start, so enter the claudiaHouse object
			if (this.selected == 0) {
				claudiaHouse.init()

				// Putting this in claudiaHouse.ts would require an additional import
				this.screen = "Claudia's house"
			}
		}
	},

	draw() {
		c.fillStyle = "#f9f9f9"
		c.frect(0, 0, 1325, 325)

		c.fillStyle = "#2c8898"
		c.frect(0, 325, 1325, 400)

		c.font = "48px monospace"
		c.fillStyle = "#4a4a4a"
		c.text("Malfacile Gajnita Savo", 50, 50)

		for (let i = 0; i < this.options.length; i++) {
			this.options[i].show(this.selected == i)
		}

		if (this.screen == "Main menu")
			window.requestAnimationFrame(this.draw)

		// Once the user selects "Start", we need to switch screens
		else window.requestAnimationFrame(claudiaHouse.draw)
	}
}

mainMenu.draw = mainMenu.draw.bind(mainMenu)
mainMenu.handleInput = mainMenu.handleInput.bind(mainMenu)

export default mainMenu
