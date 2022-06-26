import player from "../game/player"
import music from "../game/music"
import c from "../game/canvas"

import Scene from "../menus/Scene"
import dialogue from "../events/7"

import Block from "./Block"
import Interactable from "./Interactable"

const wallColour = "#c3272b"
const walls = [
	new Block(0, 0, 1325, 25, wallColour),
	new Block(0, 700, 1325, 25, wallColour),

	new Block(0, 0, 25, 262.5, wallColour),
	new Block(0, 462.5, 25, 262.5, wallColour),

	new Block(1300, 0, 25, 262.5, wallColour),
	new Block(1300, 462.5, 25, 262.5, wallColour),
]

const claudius = new Interactable("Claudius", new Block(200, 600, 50, 50, "#1d697c"))

let scene = new Scene(dialogue.Claudius)
scene.playing = false

class House {
	room = 0

	init() {
		document.onkeydown = event => {
			let code = event.code

			if (scene.playing && code == "KeyZ")
				scene.progress()

			else if (!scene.playing)
				player.handleKey("keydown", code)
		}

		document.onkeyup = event => {
			if (!scene.playing)
				player.handleKey("keyup", event.code)
		}

		music.reset()
		music.climactic_return.play()
	}

	transitions(): string | null {
		if (this.room == 0 && player.x < 0)
			return "Lerwick"

		else if (this.room == 1 && player.y > 675)
			return "MessalinaRoom"

		else return null
	}

	move(time: number) {
		if (!scene.playing) player.move(time, "fixed", walls)
	}

	draw() {
		// Floor
		c.fillStyle = "#c37127"
		c.frect(0, 0, 1325, 725)

		for (const wall of walls) {
			wall.draw()
		}

		claudius.draw()
		player.draw("fixed")
	}
}

const house = new House()
export default house
