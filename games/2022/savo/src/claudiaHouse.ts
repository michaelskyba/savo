import c from "./canvas"
import player from "./player"

import dialogue from "./dialogue_1"
import textBox from "./textBox"

const claudiaHouse = {
	scene: {
		dialogue: dialogue.main,
		playing: true,
		frame: 0,

		// Let TypeScript infer the types from here and then set them properly
		// in init(). In here, "this" throws a "Object possibly undefined" error
		speaker: new textBox("", 0, 0, 0, "serif", "", ""),
		speech: new textBox("", 0, 0, 0, "serif", "", "")
	},

	init() {
		let line = this.scene.dialogue[this.scene.frame]
		this.scene.speech = new textBox(line[1], 50, 600, 30, "serif", "white", "black")

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

		/*
		let line = this.scene.dialogue[this.scene.frame]
		let speaker = line[0]
		let speech = line[1]

		if (line[0]) this.scene.speech.draw()

		c.fillStyle = "#2c8898"
		c.text(speech, 20, 100)
		*/

		this.scene.speech.draw()

		// .move() doesn't really belong in draw() but it's fine for now
		player.move()
		player.draw()

		window.requestAnimationFrame(this.draw)
	}
}
claudiaHouse.draw = claudiaHouse.draw.bind(claudiaHouse)

export default claudiaHouse
