import c from "../canvas"
import player from "../play/player"
import Wall from "./Wall"

import perinthus from "../overworld/perinthus"

import dialogue from "../events/1"
import Scene from "../menus/Scene"
import TextBox from "../menus/TextBox"

const scene: Scene | null = new Scene(dialogue.main)

const walls = [
	[
		new Wall(0, 0, 1325, 25),
		new Wall(0, 0, 25, 1325),
		new Wall(0, 700, 1325, 25),

		new Wall(1300, 0, 25, 262.5),
		new Wall(1300, 462.5, 25, 262.5)
	],
	[
		new Wall(0, 0, 1325, 25),
		new Wall(0, 700, 1325, 25),

		new Wall(0, 0, 25, 262.5),
		new Wall(0, 462.5, 25, 262.5),

		new Wall(1300, 0, 25, 262.5),
		new Wall(1300, 462.5, 25, 262.5)
	]
]

const claudiaHouse = {
	screen: "Claudia's House",
	room: 1,

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

	transitions() {
		if (player.x < 0) {
			this.room = 0
			player.x = 1325 - player.size
		}

		if (player.x > 1325 - player.size) {
			if (this.room == 0) {
				this.room = 1
				player.x = 0
			}

			// Leaving the house
			else {
				this.screen = "Perinthus"

				player.x = 0
				player.y = 0
			}
		}
	},

	draw() {
		c.fillStyle = "white"
		c.frect(0, 0, 1325, 725)

		c.fillStyle = "purple"
		c.frect(400, 0, 925, 725)

		if (!scene.playing) {
			player.move(walls[this.room])
			this.transitions()
		}

		player.draw("fixed")

		for (const wall of walls[this.room]) {
			wall.draw()
		}

		if (scene.playing) {
			// Dialogue scene

			scene.speech.draw()
			if (scene.speaker) scene.speaker.draw()
		}

		if (this.screen == "Claudia's House")
			window.requestAnimationFrame(this.draw)

		else window.requestAnimationFrame(perinthus.draw)
	}
}
claudiaHouse.draw = claudiaHouse.draw.bind(claudiaHouse)

export default claudiaHouse