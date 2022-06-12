import c from "../game/canvas"
import player from "../game/player"
import Wall from "./Wall"

import dialogue from "../events/1"
import Scene from "../menus/Scene"
import TextBox from "../menus/TextBox"

import music from "../game/music"

const scene: Scene | null = new Scene(dialogue.main)

let wallColour = "#bf823e"
const walls = [
	[
		new Wall(0, 0, 1325, 25, wallColour),
		new Wall(0, 0, 25, 1325, wallColour),
		new Wall(0, 700, 1325, 25, wallColour),

		new Wall(1300, 0, 25, 262.5, wallColour),
		new Wall(1300, 462.5, 25, 262.5, wallColour)
	],
	[
		new Wall(0, 0, 1325, 25, wallColour),
		new Wall(0, 700, 1325, 25, wallColour),

		new Wall(0, 0, 25, 262.5, wallColour),
		new Wall(0, 462.5, 25, 262.5, wallColour),

		new Wall(1300, 0, 25, 262.5, wallColour),
		new Wall(1300, 462.5, 25, 262.5, wallColour)
	]
]

const claudiaHouse = {
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
		if (key == "KeyZ" && scene.playing) {
			scene.progress()

			// Start the next track once movement is open
			if (!scene.playing) {
				music.reset()
				music.beautiful_ruin.play()
			}
		}
	},

	move() {
		if (!scene.playing)
			player.move("fixed", walls[this.room])
	},

	transitions(): boolean {
		// 1275 = canvas width - player width

		if (player.x < 0) {
			this.room = 0
			player.x = 1275
		}

		if (player.x > 1275) {
			if (this.room == 0) {
				this.room = 1
				player.x = 0
			}

			// Leaving the house - read by steps.ts
			else return true
		}

		return false
	},

	draw() {
		c.fillStyle = "#f0e68c"
		c.frect(0, 0, 1325, 725)

		player.draw("fixed")

		for (const wall of walls[this.room]) {
			wall.draw()
		}

		if (scene.playing) {
			// Dialogue scene

			scene.speech.draw()
			if (scene.speaker) scene.speaker.draw()
		}
	}
}
claudiaHouse.draw = claudiaHouse.draw.bind(claudiaHouse)

export default claudiaHouse
