import c from "./canvas"
import player from "./player"

import dialogue from "./dialogue_1"

const claudiaHouse = {
	scene: {
		dialogue: dialogue.main,
		playing: true,
		frame: 0
	},

	init() {
		document.onkeydown = e => {
			player.handleKey("keydown", e)
		}
		document.onkeyup = e => {
			player.handleKey("keyup", e)
		}
	},

	draw() {
		c.fillStyle = "#f9f9f9"
		c.frect(0, 0, 1325, 725)

		c.fillStyle = "#982c61"
		c.frect(400, 0, 925, 725)

		c.fillStyle = "#2c8898"
		c.text(this.scene.dialogue[this.scene.frame], 20, 20)

		// .move() doesn't really belong in draw() but it's fine for now
		player.move()
		player.draw()

		window.requestAnimationFrame(this.draw)
	}
}
claudiaHouse.draw = claudiaHouse.draw.bind(claudiaHouse)

export default claudiaHouse
