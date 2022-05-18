import { ctx } from "./canvas"
import menuOption from "./menuOption"

const mainMenu = {
	selected: 0,

	options: [
		new menuOption(0, "Start"),
		new menuOption(1, "Credits")
	],

	draw() {
		ctx.fillStyle = "#f9f9f9"
		ctx.fillRect(0, 0, 1325, 725)

		ctx.font = "48px monospace"
		ctx.fillStyle = "#4a4a4a"
		ctx.fillText("Malfacile Gajnita Savo", 50, 50)

		for (let i = 0; i < this.options.length; i++) {
			this.options[i].draw(this.selected == i)
		}

		window.requestAnimationFrame(this.draw)
	}
}
mainMenu.draw = mainMenu.draw.bind(mainMenu)

const handleKeys = e => {
	if (e.code == "ArrowUp" || e.code == "KeyK") mainMenu.selected = 0
	if (e.code == "ArrowDown" || e.code == "KeyJ") mainMenu.selected = 1
}

export { mainMenu, handleKeys }
