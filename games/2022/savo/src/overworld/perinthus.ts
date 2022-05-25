import c from "../canvas"
import player from "../play/player"

import Block from "./Block"

import claudiaHouse from "../fixed/claudiaHouse"

const buildings = [
	new Block(-425, -150, 400, 300, "yellow"),
	new Block(50, -1150, 300, 250, "lightblue")
]

const roads = [
	new Block(-50, -50, 155, 100, "gray"),
	new Block(100, -1000, 200, 2000, "gray")
]

const doors = [
	new Block(-50, -50, 25, 100, "brown"),
	new Block(150, -925, 100, 25, "brown")
]

const perinthus = {
	init() {
		player.x = 5
		player.y = 0

		document.onkeydown = event => player.handleKey("keydown", event.code)
		document.onkeyup = event => player.handleKey("keyup", event.code)
	},

	move: () => player.move("overworld", buildings),

	transitions(): string | null {
		let x = player.x
		let y = player.y

		if (x == 0.25 && y > -75 && y < 75)
			return "claudiaHouse"

		else return null
	},

	draw() {
		c.fillStyle = "purple"
		c.frect(0, 0, 1325, 725)

		for (const road of roads) {
			road.draw(player.x, player.y)
		}

		for (const building of buildings) {
			building.draw(player.x, player.y)
		}

		for (const door of doors) {
			door.draw(player.x, player.y)
		}

		player.draw("overworld")
	}
}

// It's better to bind it outside of the requestAnimationFrame call so that a
// new binding doesn't have to be created every frame
perinthus.draw = perinthus.draw.bind(perinthus)

export default perinthus
