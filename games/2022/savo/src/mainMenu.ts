import { ctx } from "./canvas"
import menuOption from "./menuOption"

const mainMenu = {
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

		this.options[0].draw(true)
		this.options[1].draw(false)

		window.requestAnimationFrame(this.draw)
	}
}
mainMenu.draw = mainMenu.draw.bind(mainMenu)

export default mainMenu
