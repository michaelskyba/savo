import c from "../game/canvas"
import MenuOption from "./MenuOption"
import claudiaHouse from "../fixed/claudiaHouse"

import steps from "../game/steps"
import music from "../game/music"

const mainMenu = {
	selected: 0,
	screen: "Controls",

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

				case 1:
					this.screen = "Controls"
					break

				case 2:
					this.screen = "Credits"
					break

				// "Source code" button
				case 3:
					window.open("https://github.com/michaelskyba/michaelskyba.github.io/tree/master/games/2022/savo", "_blank").focus()
					break

				// "Home" button
				case 4:
					window.location.href = "../../2022.html"
					break

				// "Password" button
				case 5:
					let code = prompt("Enter your code.")
					if (code == "11037") alert("11037...? This is so difficult to figure out...")
					break
			}

		}
	},

	draw() {
		// Background
		c.fillStyle = "white"
		c.frect(0, 0, 500, 725)
		c.fillStyle = "maroon"
		c.frect(500, 0, 825, 725)

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
		c.frect(650, 300, 525, 3)

		// Section title
		if (this.screen != "Claudia's house") {
			c.fillStyle = "white"
			c.font = "48px serif"
			c.text(this.screen, 770, 400)
			c.font = "20px serif"
		}

		if (this.screen == "Controls") {
			c.text("- Use arrow keys for player and UI movement", 700, 450)
			c.text("- Use Z for UI selection, including dialogue progression", 700, 480)
			c.text("- Use Backspace to pause the game", 700, 510)
			c.text("- Other keys (for combat) will be introduced later, in-game", 700, 540)
		}

		else if (this.screen == "Credits") {
			c.text("- I, Michael, did the development", 700, 450)
			c.text("- The music was stolen from Masafumi Takada", 700, 480)
			c.text("- ImageMagick was used to generate (image) assets", 700, 510)
			c.text("- TypeScript was used as the general programming language", 700, 540)
			c.text("- rollup.js was used to bundle the JavaScript", 700, 570)
			c.text("- Kakoune was used as the code editor", 700, 600)
			c.text("- GitHub is used for hosting the source code and production build", 700, 630)
			c.text("- Arch Linux was used as the development operating system", 700, 660)
		}

		for (let i = 0; i < this.options.length; i++) {
			this.options[i].show(this.selected == i)
		}
	}
}

mainMenu.init = mainMenu.init.bind(mainMenu)
mainMenu.draw = mainMenu.draw.bind(mainMenu)
mainMenu.handleInput = mainMenu.handleInput.bind(mainMenu)

export default mainMenu
