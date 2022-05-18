import ctx from "./canvas"
import menuOption from "./menuOption"
import claudiaHouse from "./claudiaHouse"

const mainMenu = {
	selected: 0,
	screen: "Main menu",

	options: [
		new menuOption(0, "Start"),
		new menuOption(1, "Credits")
	],

	handleInput(e: number) {
		if (e.code == "ArrowUp" || e.code == "KeyK") mainMenu.selected = 0
		if (e.code == "ArrowDown" || e.code == "KeyJ") mainMenu.selected = 1

		// Select option
		if (e.code == "KeyZ") {
			if (mainMenu.selected == 0) {
				mainMenu.screen = "Claudia's house"
			}
		}
	},

	draw() {
		ctx.fillStyle = "#f9f9f9"
		ctx.fillRect(0, 0, 1325, 725)

		ctx.font = "48px monospace"
		ctx.fillStyle = "#4a4a4a"
		ctx.fillText("Malfacile Gajnita Savo", 50, 50)

		for (let i = 0; i < this.options.length; i++) {
			this.options[i].draw(this.selected == i)
		}

		if (this.screen == "Main menu")
			window.requestAnimationFrame(this.draw)

		// Once the user selects "Start", we need to switch screens
		else
			window.requestAnimationFrame(claudiaHouse.draw)
	}
}

mainMenu.draw = mainMenu.draw.bind(mainMenu)
export default mainMenu
