import c from "../game/canvas"
import MenuOption from "./MenuOption"
import claudiaHouse from "../fixed/claudiaHouse"

import steps from "../game/steps"
import music from "../game/music"

const mainMenu = {
	selected: 0,
	screen: "Main menu",

	options: [
		new MenuOption("Start", 150, 200),
		new MenuOption("Controls", 150, 260),
		new MenuOption("Credits", 150, 320),
		new MenuOption("Source code", 150, 380),
		new MenuOption("Home", 150, 440),
		new MenuOption("Password", 150, 500),
	],

	init() {
		document.onkeydown = e => this.handleInput(e.code)
		window.requestAnimationFrame(this.draw)

		music.class_trial.play()
	},

	handleInput(key: string) {
		// Option hovering
		if ((key == "ArrowUp" || key == "KeyK") && this.selected > 0)
			this.selected--
		if ((key == "ArrowDown" || key == "KeyJ") && this.selected < 5)
			this.selected++

		// Select option
		if (key == "KeyZ") {
			switch(this.selected) {
				// You pressed start, so enter the claudiaHouse object
				// steps.ts will react to the "screen" property
				case 0:
					this.screen = "Claudia's house"
					break

				// "Source code" button
				case 3:
					window.open("https://github.com/michaelskyba/michaelskyba.github.io/tree/master/games/2022/savo", "_blank").focus()
					break

				// "Home" button
				case 4:
					window.location.href = "../../2022.html"
					break
			}

		}
	},

	draw() {
		// Background
		c.fillStyle = "white"
		c.frect(0, 0, 600, 725)
		c.fillStyle = "maroon"
		c.frect(600, 0, 725, 725)

		// Main title text
		c.font = "48px serif"
		c.fillStyle = "white"
		c.text("Malfacile", 770, 100)
		c.fillStyle = "#ddd"
		c.text("Gajnita Savo", 770, 150)
		c.fillStyle = "white"
		c.font = "20px serif"
		c.text("by Michael Skyba", 770, 250)

		// Divider
		c.fillStyle = "white"
		c.frect(700, 300, 525, 3)

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
	}
}

mainMenu.init = mainMenu.init.bind(mainMenu)
mainMenu.draw = mainMenu.draw.bind(mainMenu)
mainMenu.handleInput = mainMenu.handleInput.bind(mainMenu)

export default mainMenu
