import c from "./canvas"
import player from "./player"

import dialogue from "./dialogue_1"
import Scene from "./scene"
import TextBox from "./TextBox"

const scene: Scene | null = new Scene(dialogue.main)

const claudiaHouse = {
	init() {
		document.onkeydown = e => {
			player.handleKey("keydown", e)
		}
		document.onkeyup = e => {
			player.handleKey("keyup", e)
		}
	},

	draw() {
		c.fillStyle = "white"
		c.frect(0, 0, 1325, 725)

		c.fillStyle = "purple"
		c.frect(400, 0, 925, 725)

		// Dialogue scene
		scene.speech.draw()
		if (scene.speaker) scene.speaker.draw()

		// .move() doesn't really belong in draw() but it's fine for now
		player.move()
		player.draw()

		window.requestAnimationFrame(this.draw)
	}
}
claudiaHouse.draw = claudiaHouse.draw.bind(claudiaHouse)

export default claudiaHouse
