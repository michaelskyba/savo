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

		let line = this.scene.dialogue[this.scene.frame]
		let speaker = line[0]
		let speech = line[1]

		c.fillStyle = "#2c8898"
		if (speaker) c.text(speaker, 20, 20)
		c.text(speech, 20, 100)

		// .move() doesn't really belong in draw() but it's fine for now
		player.move()
		player.draw()

		window.requestAnimationFrame(this.draw)
	}
}
claudiaHouse.draw = claudiaHouse.draw.bind(claudiaHouse)

export default claudiaHouse
