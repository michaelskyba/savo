import player from "../game/player"
import c from "../game/canvas"
import Block from "./Block"

import music from "../game/music"
import augustus from "../combat/augustus"

import dialogue from "../events/8"
import Scene from "../menus/Scene"

const scene = new Scene(dialogue[0])

const wallColour = "#8db255"
const walls = [
	new Block(0, 0, 1325, 25, wallColour),
	new Block(0, 700, 1325, 25, wallColour),

	new Block(0, 0, 25, 262.5, wallColour),
	new Block(0, 462.5, 25, 262.5, wallColour),

	new Block(1300, 0, 25, 725, wallColour)
]

class Room {
	collisions = [...walls, {
		x: augustus.x,
		y: augustus.y,
		width: 50,
		height: 50
	}]

	init() {
		player.x = 30

		// Initial waiting time
		document.onkeydown = event => {
			let code = event.code

			if (scene.playing && code == "KeyZ")
				scene.progress()

			else if (!scene.playing)
				player.handleKey("keydown", code)
		}

		document.onkeyup = event => {
			player.handleKey("keyup", event.code)
		}
	}

	move(time: number) {
		player.move(time, "fixed", this.collisions)
	}

	transitions() {
		if (player.x < 0) return "TiberiusHouse"
		else return null
	}

	draw() {
		c.fillStyle = "#000"
		c.frect(0, 0, 1325, 725)

		for (const wall of walls) {
			wall.draw()
		}

		player.draw("fixed")
		augustus.draw()

		scene.draw()
	}
}

const room = new Room()
export default room
