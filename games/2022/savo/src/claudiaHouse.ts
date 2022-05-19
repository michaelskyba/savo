import c from "./canvas"
import player from "./player"

import dialogue from "./dialogue_1"
import Scene from "./Scene"
import TextBox from "./TextBox"

const scene: Scene | null = new Scene(dialogue.main)

const claudiaHouse = {
	init() {
		document.onkeydown = event => {
			let key = event.code

			player.handleKey("keydown", key)
			this.handleInput(key)
		}

		document.onkeyup = event => {
			player.handleKey("keyup", event.code)
		}
	},

	handleInput(key: string) {
		if (key == "KeyZ") scene.progress()
	},

	draw() {
		c.fillStyle = "white"
		c.frect(0, 0, 1325, 725)

		c.fillStyle = "purple"
		c.frect(400, 0, 925, 725)

		player.draw()

		if (scene.playing) {
			// Dialogue scene

			scene.speech.draw()
			if (scene.speaker) scene.speaker.draw()
		}

		else player.move()

		window.requestAnimationFrame(this.draw)
	}
}
claudiaHouse.draw = claudiaHouse.draw.bind(claudiaHouse)

export default claudiaHouse
