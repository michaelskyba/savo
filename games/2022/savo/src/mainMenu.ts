import c from "./canvas"
import MenuOption from "./MenuOption"
import claudiaHouse from "./claudiaHouse"

const mainMenu = {
	selected: 0,
	screen: "Main menu",

	options: [
		new MenuOption("Start", 150, 200),
		new MenuOption("Credits", 150, 260)
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
		c.fillStyle = "white"
		c.frect(0, 0, 1325, 325)

		c.fillStyle = "blue"
		c.frect(0, 325, 1325, 400)

		c.font = "48px monospace"
		c.fillStyle = "black"
		c.text("Malfacile Gajnita Savo", 50, 50)

		c.fillStyle = "white"
		c.font = "48px serif"
		c.text("Controls", 400, 400)
		c.font = "20px monospace"
		c.text("Arrow keys: Movement", 400, 450)
		c.text("Z: UI Selection", 400, 480)
		c.text("Other keys will be introduced later", 400, 510)

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
