import c from "./canvas"
import player from "./player"
import Wall from "./Wall"

import dialogue from "./dialogue_1"
import Scene from "./Scene"
import TextBox from "./TextBox"

const scene: Scene | null = new Scene(dialogue.main)

const walls = [
	new Wall(0, 0, 1325, 25),
	new Wall(0, 0, 25, 1325),
	new Wall(0, 700, 1325, 25),

	new Wall(1300, 0, 25, 262.5),
	new Wall(1300, 462.5, 25, 262.5)
]

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

		for (const wall of walls) {
			wall.draw()
		}

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
